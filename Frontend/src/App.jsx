import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import RegisterUser from './Pages/registerUser.jsx'
import LoginPage from './Pages/loginPage.jsx'
import CreateOrganization from './Pages/createOrganization.jsx'
import CreateTracking from './Pages/CreateTracking.jsx'
import SideBar from './Pages/SideBar.jsx'
import Dashboard from './Display/Dashboard.jsx'
import Members from './Pages/Members.jsx'
import Profile from './Pages/Profile.jsx'
import ShipmentPage from './Pages/ShipmentPage.jsx'
import Organization from './Pages/Organization.jsx'
import Side from './Components/Side.jsx'
import { useEffect, useState } from 'react'
import { apiUrl } from './api.js'

const WorkspaceLayout = ({ children }) => {
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    setLogoutError('')

    try {
      const response = await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Unable to log out. Please try again.')
      }

      navigate('/login')
    } catch (error) {
      setLogoutError(error.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Side />
      <div className="min-w-0 flex-1">
        <header className="flex justify-end border-b border-slate-200 bg-white px-5 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Log out
          </button>
        </header>
        {logoutError && (
          <p className="px-5 pt-3 text-sm text-red-600" role="alert">
            {logoutError}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

const App = () => {
  
  const [organizations, setOrganizations] = useState([])
  const [organizationError, setOrganizationError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function fetchOrganizations() {
      try {
        const profileResponse = await fetch(apiUrl('/api/auth/getProfile'), {
          credentials: 'include',
        })
        const profileResult = await profileResponse.json()

        if (!profileResponse.ok) {
          throw new Error(profileResult.message || 'Unable to load your profile.')
        }

        let organizationList
        if (profileResult.user?.role === 'Member') {
          const organization = profileResult.user.Organization
          organizationList = organization && typeof organization === 'object' ? [organization] : []
        } else {
          const organizationsResponse = await fetch(
            apiUrl('/api/owner/getOrganizations'),
            { credentials: 'include' },
          )
          const organizationsResult = await organizationsResponse.json()

          if (!organizationsResponse.ok) {
            throw new Error(organizationsResult.message || 'Unable to load organizations.')
          }

          organizationList = Array.isArray(organizationsResult.organizations)
            ? organizationsResult.organizations
            : []
        }

        if (isCurrent) {
          setOrganizations(organizationList)
          setOrganizationError('')
        }
      } catch (error) {
        if (isCurrent) {
          setOrganizationError(error.message || 'Unable to load organizations.')
        }
      }
    }

    fetchOrganizations()
    return () => {
      isCurrent = false
    }
  }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<WorkspaceLayout><Dashboard /></WorkspaceLayout>}
        />
        <Route
          path="/shipments/new"
          element={
            <WorkspaceLayout>
              <SideBar organizations={organizations} organizationError={organizationError} />
            </WorkspaceLayout>
          }
        />
        <Route
          path="/shipments/:id"
          element={<WorkspaceLayout><ShipmentPage /></WorkspaceLayout>}
        />
        <Route
          path="/organizations/new"
          element={<WorkspaceLayout><Organization organization={organizations} /></WorkspaceLayout>}
        />
        <Route
          path="/tracking-events"
          element={<WorkspaceLayout><CreateTracking /></WorkspaceLayout>}
        />
        <Route
          path="/members"
          element={<WorkspaceLayout><Members /></WorkspaceLayout>}
        />
        <Route
          path="/profile"
          element={<WorkspaceLayout><Profile /></WorkspaceLayout>}
        />
        <Route
        path='/getOrganization/:id'
        element={<WorkspaceLayout><Organization/></WorkspaceLayout>}
/>
<Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
