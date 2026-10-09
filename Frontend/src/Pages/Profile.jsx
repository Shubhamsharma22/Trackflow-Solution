import { useEffect, useState } from 'react'
import { apiUrl } from '../api.js'

const inputClassName =
  'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(apiUrl('/api/auth/getProfile'), {
          credentials: 'include',
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load profile.')
        }

        setProfile(result.user)
      } catch (loadError) {
        setError(loadError.message || 'Unable to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch(apiUrl('/api/auth/updateProfile'), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: formData.get('UserName'),
          Email: formData.get('Email'),
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to update profile.')
      }

      setProfile(result.user)
      setMessage(result.message || 'Profile updated successfully.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs text-slate-500">Account&nbsp; / &nbsp;Profile</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">View and update your account details.</p>

        {error && <p className="mt-5 text-sm text-red-700" role="alert">{error}</p>}
        {message && <p className="mt-5 text-sm text-emerald-700" role="status">{message}</p>}

        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          {loading ? (
            <p className="text-sm text-slate-500">Loading profile…</p>
          ) : profile ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium" htmlFor="UserName">Name</label>
                <input
                  className={inputClassName}
                  id="UserName"
                  name="UserName"
                  defaultValue={profile.UserName || ''}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="Email">Email</label>
                <input
                  className={inputClassName}
                  id="Email"
                  name="Email"
                  type="email"
                  defaultValue={profile.Email || ''}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="role">Role</label>
                <input
                  className={inputClassName}
                  id="role"
                  value={profile.role || ''}
                  readOnly
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">Profile data is unavailable.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default Profile
