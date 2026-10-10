import { Link } from 'react-router-dom'

const Organization = ({ organization = [] }) => {
  const currentOrganization = organization[0]

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Overview&nbsp; / &nbsp;Organizations</p>
          {currentOrganization && (
            <span className="font-semibold uppercase">{currentOrganization.Name}</span>
          )}
        </div>

        {/* Page header */}
        <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage the organizations connected to your account.
            </p>
          </div>
          <Link
            to="/organizations/new"
            className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ＋ New organization
          </Link>
        </header>

        {/* Summary cards */}
        <section
          aria-label="Organization summary"
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active organization
            </h2>
            <p className="mt-2 text-2xl font-bold">
              {currentOrganization?.Name || 'No organization selected'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Owner: {currentOrganization?.Owner?.UserName || '—'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {currentOrganization?.Members?.length ?? 0} members
              {currentOrganization?.createdAt && (
                <>
                  &nbsp;·&nbsp;Created{' '}
                  {new Date(currentOrganization.createdAt).toLocaleDateString()}
                </>
              )}
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total organizations
            </h2>
            <p className="mt-2 text-3xl font-bold">{organization.length}</p>
            <p className="mt-1 text-xs text-slate-500">Connected to your account</p>
          </article>
        </section>

        {/* Organizations table */}
        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Your organizations</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                All organizations linked to your account.
              </p>
            </div>
            <label className="relative flex items-center">
              <span className="sr-only">Search organizations</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 text-slate-400"
              >
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search organizations"
                className="rounded-md border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Organization', 'Owner', 'Members', 'Status', 'Actions'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {organization.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No organizations found.
                    </td>
                  </tr>
                ) : (
                  organization.map((org) => (
                    <tr key={org._id} className="border-t border-slate-200 text-sm">
                      <td className="whitespace-nowrap px-4 py-3 font-semibold">
                        {org.Name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {org.Owner?.UserName || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {org.Members?.length ?? 0} members
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            aria-label={`More actions for ${org.Name}`}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            ···
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Inline new-organization form */}
        <section
          aria-label="New organization form"
          className="mt-5 rounded-lg border border-slate-200 bg-white p-5"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            New organization
          </p>
          <h2 className="mt-1 text-lg font-bold">Create an organization</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Set up a new organization to manage shipments and members.
          </p>

          <div className="mt-4">
            <label
              htmlFor="organization-name"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
            >
              Organization name
            </label>
            <input
              id="organization-name"
              type="text"
              placeholder="e.g. Acme Logistics"
              className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:max-w-sm"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Create organization
            </button>
          </div>
        </section>

      </div>
    </main>
  )
}

export default Organization
