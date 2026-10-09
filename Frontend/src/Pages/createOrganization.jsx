import { useState } from 'react'
import { Link } from 'react-router-dom'

const CreateOrganization = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const members = formData
      .get('members')
      .split(',')
      .map((memberId) => memberId.trim())
      .filter(Boolean)

    try {
      const response = await fetch('http://localhost:3000/api/owner/createOrganization', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name').trim(),
          ...(members.length > 0 && { members }),
        }),
      })
      const result = await response.json().catch(() => null)
console.log(result)
      if (!response.ok) {
        const validationErrors = result?.errors?.join(' ')
        throw new Error(
          result?.message || validationErrors || 'Unable to create the organization.',
        )
      }

      setSuccess(result?.message || 'Organization created successfully.')
      form.reset()
    } catch (submitError) {
      setError(submitError.message || 'Unable to reach the organization service.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    'mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
  const labelClassName = 'text-xs font-semibold text-slate-700'

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs text-slate-500">
          <Link className="hover:text-slate-800" to="/">Shipments</Link>
          &nbsp; / &nbsp;Organizations&nbsp; / &nbsp;New organization
        </p>

        <header className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Create organization
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Set up an organization to manage its shipments and members.
          </p>
        </header>

        <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit}>
          <section className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-800">Organization details</h2>
            <p className="mt-1 text-xs text-slate-500">
              You will be assigned as the organization owner.
            </p>

            <div className="mt-5">
              <label className={labelClassName} htmlFor="organization-name">
                Organization name *
              </label>
              <input
                className={inputClassName}
                id="organization-name"
                name="name"
                type="text"
                minLength={2}
                maxLength={120}
                placeholder="e.g. Northstar Supply Co."
                autoComplete="organization"
                required
              />
            </div>

            <div className="mt-4">
              <label className={labelClassName} htmlFor="organization-members">
                Member user IDs <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                className={`${inputClassName} min-h-24 resize-y`}
                id="organization-members"
                name="members"
                placeholder="Paste user IDs separated by commas"
                aria-describedby="members-help"
              />
              <p className="mt-1.5 text-xs text-slate-500" id="members-help">
                Add existing member IDs separated by commas. You can leave this blank.
              </p>
            </div>
          </section>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
              {success}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              to="/"
            >
              Cancel
            </Link>
            <button
              className="rounded-md bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating organization...' : 'Create organization'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreateOrganization
