import { Link } from 'react-router-dom'
import './Organization.css'

const Organization = ({ organization = [] }) => {
  const currentOrganization = organization[0]

  return (
  <main className="organizations-page">
    <aside className="organizations-sidebar">
      <div>
        <Link className="organizations-brand" to="/">
          <span className="organizations-brand-mark">R</span>
          <span>
            <strong>ROUTE / LOGISTICS</strong>
            <small>OWNER WORKSPACE</small>
          </span>
        </Link>

        <nav className="organizations-nav" aria-label="Main navigation">
          <Link to="/">Overview</Link>
          <Link to="/">Shipments</Link>
          <Link className="is-active" to="/organizations" aria-current="page">
            Organizations
          </Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </div>

      <div className="organizations-current">
        <span>CURRENT ORGANIZATION</span>
        <strong>{currentOrganization?.Name || 'No organization selected'}</strong>
        <small>{currentOrganization?.Owner?.UserName || 'Owner workspace'}</small>
      </div>
    </aside>

    <div className="organizations-content">
      <div className="organizations-topline">
        <p>Owner Workspace <span>/</span> Organizations</p>
        <p>{currentOrganization?.Name || 'Organizations'} <span>•</span> OWNER WORKSPACE</p>
      </div>

      <header className="organizations-heading">
        <div>
          <h1>Organizations</h1>
          <p>Manage the organizations connected to your account.</p>
        </div>
        <button className="organizations-primary" type="button">＋ New organization</button>
      </header>

      <section className="organizations-summary" aria-label="Organization summary">
        <article className="organization-summary-card">
          <span>ACTIVE ORGANIZATION</span>
          <h2>{currentOrganization?.Name || 'No organization selected'}</h2>
          <p>Owner: {currentOrganization?.Owner?.UserName || '—'}</p>
          <small>{currentOrganization?.Members?.length || 0} members
            {currentOrganization?.createdAt && (
              <> <b>•</b> Created {new Date(currentOrganization.createdAt).toLocaleDateString()}</>
            )}
          </small>
        </article>
        <article className="organization-summary-card">
          <span>TOTAL ORGANIZATIONS</span>
          <h2>{organization.length}</h2>
          <p>Connected to your account</p>
        </article>
      </section>

      <section className="organizations-list-card">
        <div className="organizations-list-heading">
          <h2>Your organizations</h2>
          <label className="organizations-search">
            <span className="visually-hidden">Search organizations</span>
            <input type="search" placeholder="Search organizations" readOnly />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>

        <div className="organizations-table-scroll">
          <table className="organizations-table">
            <thead>
              <tr>
                <th scope="col">Organization</th>
                <th scope="col">Owner</th>
                <th scope="col">Members</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organization.map((org) => (
                <tr key={org._id}>
                  <td><strong>{org.Name}</strong></td>
                  <td>{org.Owner?.UserName || '—'}</td>
                  <td>{org.Members?.length || 0} members</td>
                  <td><span className="organization-status">Active</span></td>
                  <td>
                    <button type="button">Edit</button>
                    <button type="button" aria-label={`More actions for ${org.Name}`}>···</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="organization-inline-form" aria-label="New organization form wireframe">
        <span>NEW ORGANIZATION / INLINE FORM STATE</span>
        <label htmlFor="organization-name">Organization name</label>
        <input id="organization-name" type="text" placeholder="Enter organization name" readOnly />
        <div className="organization-form-actions">
          <button className="organizations-secondary" type="button">Cancel</button>
          <button className="organizations-primary" type="button">Create organization</button>
        </div>
      </section>
    </div>
  </main>
  )
}

export default Organization
