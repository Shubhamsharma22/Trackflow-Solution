import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiUrl } from '../api.js'

const ShipmentPage = () => {
  const { id } = useParams()
  const [shipment, setShipment] = useState(null)
  const [trackingEvents, setTrackingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadShipment() {
      try {
        const shipmentResponse = await fetch(apiUrl('/api/owner/shipments'), {
          credentials: 'include',
        })
        const shipmentResult = await shipmentResponse.json()

        if (!shipmentResponse.ok) {
          throw new Error(shipmentResult.message || 'Unable to load shipment.')
        }

        const selectedShipment = shipmentResult.shipments?.find((item) => item._id === id)
        if (!selectedShipment) {
          throw new Error('Shipment not found.')
        }
        setShipment(selectedShipment)

        const eventsResponse = await fetch(
          apiUrl(`/api/shipments/${id}/tracking-events`),
          { credentials: 'include' },
        )
        const eventsResult = await eventsResponse.json()

        if (!eventsResponse.ok) {
          throw new Error(eventsResult.message || 'Unable to load tracking history.')
        }

        setTrackingEvents(Array.isArray(eventsResult.trackingEvents) ? eventsResult.trackingEvents : [])
      } catch (loadError) {
        setError(loadError.message || 'Unable to load shipment.')
      } finally {
        setLoading(false)
      }
    }

    loadShipment()
  }, [id])

  if (loading) {
    return <main className="p-6 text-sm text-slate-500">Loading shipment…</main>
  }

  if (error || !shipment) {
    return (
      <main className="p-6">
        <p className="text-sm text-red-700" role="alert">{error || 'Shipment not found.'}</p>
        <Link className="mt-4 inline-block text-sm text-slate-700 hover:underline" to="/">
          Back to shipments
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            <Link to="/" className="hover:underline">Shipments</Link>
            &nbsp; / &nbsp;{shipment.trackingId}
          </p>
          <p>{shipment.organization?.Name || 'Organization'}</p>
        </div>

        <header className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Shipment {shipment.trackingId}</h1>
            <p className="mt-1 text-xs text-slate-500">
              Created {new Date(shipment.createdAt).toLocaleDateString()}
              &nbsp; · &nbsp;{shipment.carrier}
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold">
            {shipment.currentStatus}
          </span>
        </header>

        <section className="mt-5 grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Origin</p>
            <p className="mt-1 font-semibold">{shipment.origin}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Destination</p>
            <p className="mt-1 font-semibold">{shipment.destination}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Expected delivery</p>
            <p className="mt-1 font-semibold">
              {shipment.expectedDelivery
                ? new Date(shipment.expectedDelivery).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Organization</p>
            <p className="mt-1 text-sm">{shipment.organization?.Name || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Sender</p>
            <p className="mt-1 text-sm">{shipment.sender?.UserName || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Receiver</p>
            <p className="mt-1 text-sm">{shipment.receiver?.UserName || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Carrier</p>
            <p className="mt-1 text-sm">{shipment.carrier}</p>
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Tracking history</h2>
          <p className="mt-1 text-xs text-slate-500">Latest shipment events</p>
          {trackingEvents.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No tracking events yet.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {trackingEvents.map((event) => (
                <div key={event._id} className="flex gap-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-slate-700" />
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <p className="text-sm font-semibold">{event.status}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-1 text-sm">{event.location}</p>
                    {event.description && (
                      <p className="mt-1 text-xs text-slate-500">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ShipmentPage
