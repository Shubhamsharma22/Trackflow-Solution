import { Link, useLocation } from 'react-router-dom'

const Side = () => {
  const { pathname } = useLocation()

  return (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col justify-between border-r border-slate-900 bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-slate-50 shadow-xl shadow-slate-900/10">
      <div className="flex flex-col gap-8">
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-cyan-300 text-lg font-black text-slate-900 shadow-lg shadow-slate-950/20">
              R
            </span>
            <div>
              <p className="text-sm font-bold tracking-wide text-white">Route/Logistics</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200">Control center</p>
            </div>
          </div>
        </div>
        <nav className="px-3" aria-label="Main navigation">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/80">Workspace</p>
          <ul className="flex flex-col gap-1.5">
            <li>
              <Link
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname === '/' ? 'bg-teal-300 text-slate-900 shadow-md shadow-slate-950/10' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                to="/"
              >
                Shipments
              </Link>
            </li>
            <li>
              <Link
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname.startsWith('/organizations') ? 'bg-teal-300 text-slate-900 shadow-md shadow-slate-950/10' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                to="/organizations/new"
              >
                Organizations
              </Link>
            </li>
            <li>
              <Link
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname.startsWith('/tracking-events') ? 'bg-teal-300 text-slate-900 shadow-md shadow-slate-950/10' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                to="/tracking-events"
              >
                Tracking events
              </Link>
            </li>
            <li>
              <Link
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname.startsWith('/members') ? 'bg-teal-300 text-slate-900 shadow-md shadow-slate-950/10' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                to="/members"
              >
                Members
              </Link>
            </li>
            <li>
              <Link
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname.startsWith('/profile') ? 'bg-teal-300 text-slate-900 shadow-md shadow-slate-950/10' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                to="/profile"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-200">Current organization</p>
        <p className="mt-2 text-xs text-slate-200">Manage your shipping network</p>
      </div>
    </aside>
  )
}

export default Side
