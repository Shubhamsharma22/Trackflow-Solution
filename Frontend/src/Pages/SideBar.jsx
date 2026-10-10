import { useEffect, useState } from "react"
import { authFetch } from '../api.js'


const SideBar = ({ organizations, organizationError }) => {
  const inputClassName =
    'mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
  const labelClassName = 'text-[10px] font-semibold text-slate-700'
  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [carrier, setCarrier] = useState('')
  const [expectedDelivery, setExpectedDelivery] = useState('')
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [status, setStatus] = useState('Created')

  useEffect(() => {
    let isCurrent = true

    async function getOwners() {
      try {
        const response = await authFetch('/api/member/ownersWithOrganizations')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.message || 'Unable to load senders and receivers.')
        }

        if (isCurrent) {
          setUsers(Array.isArray(result.owners) ? result.owners : [])
        }
      } catch (error) {
        if (isCurrent) {
          setUsersError(error.message || 'Unable to load senders and receivers.')
        }
      }
    }

    getOwners()
    return () => {
      isCurrent = false
    }
  }, [])

async function handleSubmit(event){
  event.preventDefault()
  setSubmitError('')
  setIsSubmitting(true)

  const newShipment = {
    trackingId,
    organization: organizationId,
    carrier,
    expectedDelivery,
    sender,
    receiver,
    origin,
    destination,
    currentStatus: status,
  }

  try {
    const response = await authFetch('/api/member/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newShipment),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.message || result?.errors?.join(', ') || 'Unable to create your shipment.')
    }
  } catch (error) {
    setSubmitError(error.message || 'Unable to create your shipment.')
  } finally {
    setIsSubmitting(false)
  }
}

  const senderOptions = users.filter((user) => user._id !== receiver)
  const receiverOptions = users.filter((user) => user._id !== sender)

  return (
    <div className="flex min-h-screen bg-slate-50 w-full text-slate-800">

      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] text-slate-500">Shipments&nbsp; / &nbsp;New shipment</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">Create shipment</h1>
              <p className="mt-1 text-xs text-slate-500">
                Enter the shipment details to start tracking.
              </p>
            </div>
            <p className="text-xs text-slate-500">Step 1 of 1&nbsp; · &nbsp;Shipment details</p>
          </div>

          <form className="mt-5 space-y-3" onSubmit={(event) => handleSubmit(event)}>
            <section className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-800">Shipment information</h2>
              <p className="mt-2 text-[11px] text-slate-500">
                Identify the organization and carrier responsible for this shipment.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div>
                  <label className={labelClassName} htmlFor="trackingId">Tracking ID *</label>
                  <input
                    className={inputClassName}
                    id="trackingId"
                    name="trackingId"
                    type="text"
                    value={trackingId}
                    placeholder="e.g. RT-240831"
                    onChange={(e)=>setTrackingId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={labelClassName} htmlFor="organization">Organization *</label>
                  {organizationError && (
                    <p className="mt-1 text-xs text-red-700" role="alert">
                      {organizationError}
                    </p>
                  )}
                  <select
                    className={inputClassName}
                    id="organization"
                    name="organization"
                    value={organizationId}
                    onChange={(e)=>setOrganizationId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {organizationError ? 'Unable to load organizations' : 'Select organization'}
                    </option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClassName} htmlFor="carrier">Carrier *</label>
                  <select
                    className={inputClassName}
                    id="carrier"
                    name="carrier"
                    defaultValue=""
                    value={carrier}
                    onChange={(e)=>setCarrier(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select carrier</option>
                    <option value="ups">UPS</option>
                    <option value="fedex">FedEx</option>
                    <option value="dhl">DHL</option>
                    <option value="usps">USPS</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassName} htmlFor="expectedDelivery">Expected delivery *</label>
                  <input
                    className={inputClassName}
                    id="expectedDelivery"
                    name="expectedDelivery"
                    type="date"
                    value={expectedDelivery}
                    onChange={(e)=>setExpectedDelivery(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-800">People and route</h2>
              <p className="mt-2 text-[11px] text-slate-500">
                Add sender, receiver, and the shipment route.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div>
                  <label className={labelClassName} htmlFor="sender">Sender *</label>
                  <select
                    className={inputClassName}
                    id="sender"
                    name="sender"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {usersError ? 'Unable to load users' : 'Select sender'}
                    </option>
                    {senderOptions.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.UserName} ({user.Email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClassName} htmlFor="receiver">Receiver *</label>
                  <select
                    className={inputClassName}
                    id="receiver"
                    name="receiver"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {usersError ? 'Unable to load users' : 'Select receiver'}
                    </option>
                    {receiverOptions.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.UserName} ({user.Email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClassName} htmlFor="origin">Origin *</label>
                  <input
                    className={inputClassName}
                    id="origin"
                    name="origin"
                    type="text"
                    placeholder="City, region"
                    required
                    value={origin}
                    onChange={(e)=>setOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClassName} htmlFor="destination">Destination *</label>
                  <input
                    className={inputClassName}
                    id="destination"
                    name="destination"
                    type="text"
                    placeholder="City, region"
                    required
                    value={destination}
                    onChange={(e)=>setDestination(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-5 py-3">
              <label className="text-[11px] font-semibold text-slate-700" htmlFor="status">
                Current status
              </label>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                id="status"
                name="status"
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
              >
                <option value="Created">Created</option>
                <option value="Picked Up">Picked up</option>
                <option value="In Transit">In Transit</option>
                <option value="Out For Delivery">Out for delivery</option>
                <option value="Delayed">Delayed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </section>

            <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-[10px] text-slate-400">Required fields are marked with *</p>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating shipment…' : 'Create shipment'}
                </button>
              </div>
            </footer>
            {(usersError || submitError) && (
              <p className="text-xs text-red-700" role="alert">
                {submitError || usersError}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}

export default SideBar
