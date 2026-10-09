import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../api.js'

const statusStyles = {
  'In Transit': 'bg-slate-100 text-slate-700',
  Delayed: 'bg-amber-50 text-amber-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  'Out For Delivery': 'bg-blue-50 text-blue-700',
}

const Dashboard = () => {
  const [shipments, setShipments] = useState([])
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileResponse = await fetch(apiUrl('/api/auth/getProfile'), {
          credentials: 'include',
        })
        const profileResult = await profileResponse.json()

        if (!profileResponse.ok) {
          throw new Error(profileResult.message || 'Unable to load your profile.')
        }

        const isMember = profileResult.user?.role === 'Member'
        const requests = [
          
          fetch(
            apiUrl(`/api/${isMember ? 'member' : 'owner'}/shipments`),
            { credentials: 'include' },
          ),
        ]

        if (!isMember) {
          requests.push(
            fetch(apiUrl('/api/owner/getOrganizations'), {
              credentials: 'include',
            }),
          )
        }

        const [shipmentResponse, organizationResponse] = await Promise.all(requests)
        const shipmentResult = await shipmentResponse.json()

        if (!shipmentResponse.ok) {
          throw new Error(shipmentResult.message || 'Unable to load shipments.')
        }

        let organizationResult = null
        if (organizationResponse) {
          organizationResult = await organizationResponse.json()
          if (!organizationResponse.ok) {
            throw new Error(organizationResult.message || 'Unable to load your organization.')
          }
        }

        setShipments(Array.isArray(shipmentResult.shipments) ? shipmentResult.shipments : [])
        setUser(profileResult.user || null)
        setOrganization(organizationResult?.organizations?.[0] || null)
      } catch (loadError) {
        setError(loadError.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const activeShipments = shipments.filter(
    (shipment) => !['Delivered', 'Cancelled'].includes(shipment.currentStatus),
  )
  const inTransitShipments = shipments.filter(
    (shipment) => shipment.currentStatus === 'In Transit',
  )
  const deliveredShipments = shipments.filter(
    (shipment) => shipment.currentStatus === 'Delivered',
  )
  const delayedShipments = shipments.filter(
    (shipment) => shipment.currentStatus === 'Delayed',
  )
  const carrierCount = new Set(shipments.map((shipment) => shipment.carrier).filter(Boolean)).size
  const recentShipments = shipments.slice(0, 4)
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 18
        ? 'Good afternoon'
        : 'Good evening'

  const stats = [
    { label: 'Active shipments', value: activeShipments.length, note: 'Not delivered or cancelled' },
    { label: 'In transit', value: inTransitShipments.length, note: `Across ${carrierCount} carriers` },
    { label: 'Delivered', value: deliveredShipments.length, note: 'Current total' },
    { label: 'Delayed', value: delayedShipments.length, note: 'Needs attention' },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Overview&nbsp; / &nbsp;Shipments</p>
          <div className="flex flex-wrap items-center gap-3">
            {organization && <span>{organization.Name}</span>}
            {user && (
              <span className="font-semibold uppercase">
                {user.UserName} &nbsp;·&nbsp; {user.role}
              </span>
            )}
          </div>
        </div>

        <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}{user?.UserName ? `, ${user.UserName}` : ''}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here is what is happening across your shipments.
            </p>
          </div>
          <Link
            to="/shipments/new"
            className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            + Create shipment
          </Link>
        </header>

        {error && (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <section
          aria-label="Shipment summary"
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </h2>
              <p className="mt-2 text-3xl font-bold">{loading ? '—' : stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Recent shipments</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest shipments across your organization.
              </p>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              View all shipments&nbsp; →
            </Link>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Tracking ID', 'Route', 'Receiver', 'Carrier', 'Status', 'ETA'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-6 text-center text-sm text-slate-500">
                      Loading shipments…
                    </td>
                  </tr>
                ) : recentShipments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-6 text-center text-sm text-slate-500">
                      No shipments found.
                    </td>
                  </tr>
                ) : (
                  recentShipments.map((shipment) => (
                    <tr key={shipment._id} className="border-t border-slate-200 text-sm">
                      <td className="whitespace-nowrap px-3 py-3.5 font-semibold">
                        {user?.role === 'Owner' ? (
                          <Link
                            className="text-slate-800 hover:underline"
                            to={`/shipments/${shipment._id}`}
                          >
                            {shipment.trackingId}
                          </Link>
                        ) : (
                          shipment.trackingId
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5">
                        {shipment.origin} → {shipment.destination}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5">
                        {shipment.receiver?.UserName || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5">{shipment.carrier}</td>
                      <td className="whitespace-nowrap px-3 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            statusStyles[shipment.currentStatus] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {shipment.currentStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5">
                        {shipment.expectedDelivery
                          ? new Date(shipment.expectedDelivery).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-4 text-xs text-slate-400">
          Showing {loading ? '—' : recentShipments.length} of {loading ? '—' : shipments.length} shipments.
        </p>
      </div>
    </main>
  )
}

export default Dashboard
