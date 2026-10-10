import { useEffect, useState } from 'react'
import { authFetch } from '../api.js'

const initialMemberForm = {
  UserName: '',
  Email: '',
  password: '',
  Organization: '',
}

const Members = () => {
  const [members, setMembers] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [memberForm, setMemberForm] = useState(initialMemberForm)

  async function loadMembers() {
    try {
      const organizationsResponse = await authFetch('/api/owner/getOrganizations')
      const organizationsResult = await organizationsResponse.json()

      if (!organizationsResponse.ok) {
        throw new Error(organizationsResult.message || 'Unable to load organizations.')
      }

      const organizationsList = Array.isArray(organizationsResult.organizations)
        ? organizationsResult.organizations
        : []

      setOrganizations(organizationsList)

      const memberResults = await Promise.all(
        organizationsList.map(async (organization) => {
          const response = await authFetch(`/api/owner/organizations/${organization._id}/members`)
          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.message || `Unable to load members for ${organization.Name}.`)
          }

          return (Array.isArray(result.members) ? result.members : []).map((member) => ({
            ...member,
            organizationName: organization.Name,
          }))
        }),
      )

      setMembers(memberResults.flat())
    } catch (loadError) {
      setError(loadError.message || 'Unable to load members.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  async function handleAddMember(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!memberForm.UserName || !memberForm.Email || !memberForm.password || !memberForm.Organization) {
      setError('Please complete all fields before adding a member.')
      return
    }

    setSubmitting(true)

    try {
      const response = await authFetch('/api/owner/createMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserName: memberForm.UserName.trim(),
          Email: memberForm.Email.trim(),
          password: memberForm.password,
          Organization: memberForm.Organization,
        }),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to add member.')
      }

      setMemberForm(initialMemberForm)
      setMessage(result.message || 'Member added successfully.')
      await loadMembers()
    } catch (addError) {
      setError(addError.message || 'Unable to add member.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(member) {
    if (!window.confirm(`Delete member ${member.UserName}?`)) return

    setError('')
    setMessage('')

    try {
      const response = await authFetch(`/api/owner/deleteMember/${member._id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to delete member.')
      }

      setMembers((currentMembers) =>
        currentMembers.filter((currentMember) => currentMember._id !== member._id),
      )
      setMessage(result.message || 'Member deleted successfully.')
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete member.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-slate-500">Organization&nbsp; / &nbsp;Members</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Members</h1>
            <p className="mt-1 text-sm text-slate-500">View and manage members in your organizations.</p>
          </div>

          <button
            type="button"
            onClick={() => document.getElementById('member-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add member
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-700" role="status">{message}</p>}

        <form id="member-form" onSubmit={handleAddMember} className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Name</span>
              <input
                type="text"
                value={memberForm.UserName}
                onChange={(event) => setMemberForm((current) => ({ ...current, UserName: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Jane Smith"
                required
              />
            </label>

            <label className="text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Email</span>
              <input
                type="email"
                value={memberForm.Email}
                onChange={(event) => setMemberForm((current) => ({ ...current, Email: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="jane@example.com"
                required
              />
            </label>

            <label className="text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Password</span>
              <input
                type="password"
                value={memberForm.password}
                onChange={(event) => setMemberForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Create a password"
                required
              />
            </label>

            <label className="text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Organization</span>
              <select
                value={memberForm.Organization}
                onChange={(event) => setMemberForm((current) => ({ ...current, Organization: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              >
                <option value="">Select organization</option>
                {organizations.map((organization) => (
                  <option key={organization._id} value={organization._id}>
                    {organization.Name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Adding member...' : 'Save member'}
            </button>
          </div>
        </form>

        <section className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-slate-50">
              <tr>
                {['Name', 'Email', 'Organization', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-6 text-sm text-slate-500">Loading members…</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-6 text-sm text-slate-500">No members found.</td></tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id} className="border-t border-slate-200 text-sm">
                    <td className="whitespace-nowrap px-4 py-3">{member.UserName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{member.Email}</td>
                    <td className="whitespace-nowrap px-4 py-3">{member.organizationName}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(member)}
                        className="font-medium text-red-700 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

export default Members
