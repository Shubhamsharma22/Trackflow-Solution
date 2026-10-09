import { useEffect, useRef, useState } from 'react'
import { apiUrl } from '../api.js'

const statusOptions = ['In Transit', 'Picked Up', 'Delayed', 'Delivered']

const inputClassName =
  'w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'

const CreateTracking = () => {
  const [shipments, setShipments] = useState([])
  const [shipmentid, setShipmentid] = useState('')
  const [shiptrack, setShiptrack] = useState([])
  const [editingEventId, setEditingEventId] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const formRef = useRef(null)

  async function handlesearch(event) {
    event.preventDefault()

    const shipment = shipments.find(
      (item) => item.trackingId.toLowerCase() === shipmentid.trim().toLowerCase(),
    )

    if (!shipment) {
      console.error('No shipment found with that tracking ID.')
      setShiptrack([])
      return
    }

    try {
      const response = await fetch(
        apiUrl(`/api/member/shipments/${shipment._id}/tracking-events`),
        { credentials: 'include' },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load tracking events.')
      }

      setShiptrack(Array.isArray(result.trackingEvents) ? result.trackingEvents : [])
    } catch (error) {
      console.error('Failed to load tracking events:', error)
      setShiptrack([])
    }
  }

  async function handleSaveEvent(event) {
    event.preventDefault()
    setFormMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const eventData = {
      shipment: formData.get('shipment'),
      status: formData.get('status'),
      location: formData.get('location'),
      timestamp: formData.get('timestamp') || undefined,
      description: formData.get('description'),
    }

    try {
      const response = await fetch(
        editingEventId
          ? apiUrl(`/api/member/tracking-events/${editingEventId}`)
          : apiUrl('/api/member/tracking-events'),
        {
          method: editingEventId ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to save tracking event.')
      }

      if (result.tracking) {
        setShiptrack((currentEvents) =>
          editingEventId
            ? currentEvents.map((item) =>
                item._id === result.tracking._id ? result.tracking : item,
              )
            : [result.tracking, ...currentEvents],
        )
      }

      form.reset()
      setEditingEventId('')
      setFormMessage(result.message || 'Tracking event saved.')
    } catch (error) {
      setFormMessage(error.message || 'Unable to save tracking event.')
    }
  }

  function handleEditEvent(trackingEvent) {
    const form = formRef.current
    if (!form) return

    form.elements.namedItem('shipment').value =
      typeof trackingEvent.shipment === 'object'
        ? trackingEvent.shipment._id
        : trackingEvent.shipment
    form.elements.namedItem('status').value = trackingEvent.status || ''
    form.elements.namedItem('location').value = trackingEvent.location || ''
    form.elements.namedItem('timestamp').value = trackingEvent.timestamp
      ? new Date(trackingEvent.timestamp).toISOString().slice(0, 16)
      : ''
    form.elements.namedItem('description').value = trackingEvent.description || ''
    setEditingEventId(trackingEvent._id)
    setFormMessage('')
    form.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function handleDeleteEvent(trackingEvent) {
    if (!window.confirm('Delete this tracking event?')) return

    setFormMessage('')

    try {
      const response = await fetch(
        apiUrl(`/api/member/tracking-events/${trackingEvent._id}`),
        { method: 'DELETE', credentials: 'include' },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to delete tracking event.')
      }

      setShiptrack((currentEvents) =>
        currentEvents.filter((item) => item._id !== trackingEvent._id),
      )
      if (editingEventId === trackingEvent._id) {
        formRef.current?.reset()
        setEditingEventId('')
      }
      setFormMessage(result.message || 'Tracking event deleted.')
    } catch (error) {
      setFormMessage(error.message || 'Unable to delete tracking event.')
    }
  }

  useEffect(() => {
    async function getData() {
      console.log('Loading shipments...')

      try {
        const response = await fetch(apiUrl('/api/member/shipments'), {
          credentials: 'include',
        })
        const result = await response.json()

        console.log('Shipments API response:', response.status, result)

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load shipments')
        }

        setShipments(Array.isArray(result.shipments) ? result.shipments : [])
      } catch (error) {
        console.error('Failed to load shipments:', error)
      }
    }

    getData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Admin Console / Tracking events
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-800">
              Tracking events
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review and manage shipment status updates.
            </p>
          </div>

          <div className="text-sm text-slate-500">112 events this week</div>
        </div>

        <section className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Add tracking event</h2>

          <form ref={formRef} className="mt-5 space-y-4" onSubmit={handleSaveEvent}>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Shipment
                </label>
                <select
                  name="shipment"
                  className={inputClassName}
                >
                  <option value="">Select shipment</option>
                  {shipments.map((shipment) => (
                    <option key={shipment._id} value={shipment._id}>
                      {shipment.trackingId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue="In Transit"
                  className={inputClassName}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, region"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Add an update for the shipment timeline"
                rows="3"
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {editingEventId ? 'Update event' : '+ Add event'}
              </button>
            </div>
            {formMessage && (
              <p className="text-sm text-slate-600" role="status">
                {formMessage}
              </p>
            )}
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Recent events</h2>
            <form onSubmit={handlesearch}>
              <input
                type="text"
                placeholder="Search by shipment ID"
                value={shipmentid}
                className="w-full max-w-xs rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                onChange={(event) => setShipmentid(event.target.value)}
              />
            </form>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-300">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Shipment
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Location
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm text-slate-700">
                {shiptrack.map((event) => (
                  <tr key={event._id} className="border-t border-slate-200">
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {shipments.find(
                        (shipment) =>
                          shipment._id ===
                          (typeof event.shipment === 'object'
                            ? event.shipment._id
                            : event.shipment),
                      )?.trackingId || 'Shipment'}
                    </td>
                    <td className="px-4 py-4">{event.status}</td>
                    <td className="px-4 py-4">{event.location}</td>
                    <td className="px-4 py-4">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">{event.description}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditEvent(event)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event)}
                          className="text-red-700 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Event fields reflect the tracking-event model, status, location, timestamp, description.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Admin actions: create, edit, and delete tracking events.
          </p>
        </section>
      </div>
    </div>
  )
}

export default CreateTracking
