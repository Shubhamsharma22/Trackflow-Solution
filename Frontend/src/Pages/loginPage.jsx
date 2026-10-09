import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  
  const navigate = useNavigate()
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.get('Email'),
          password: formData.get('password'),
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to sign in. Check your email and password.')
      }

      setMessage(result?.message || 'Signed in successfully.')
      navigate("/")
      form.reset()
    } catch (error) {
      setMessage(error.message || 'Unable to reach the login service.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    'mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
  const labelClassName = 'text-[10px] font-semibold uppercase tracking-wide text-slate-600'

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto min-h-[calc(100vh-3rem)] max-w-5xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:min-h-[calc(100vh-4rem)] sm:px-10 sm:py-10">
        <header className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            TrackFlow - Your Own Shipment Solution
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Move every shipment with confidence.
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Secure access for owners, members, and administrators.
          </p>
        </header>

        <section className="mx-auto mt-8 w-full max-w-md rounded-md border border-slate-200 bg-white p-5 sm:mt-10 sm:p-6">
          <h2 className="text-lg font-bold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to manage your shipments.
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className={labelClassName} htmlFor="Email">Email</label>
              <input
                className={inputClassName}
                id="Email"
                name="Email"
                type="Email"
                placeholder="name@company.com"
                autoComplete="Email"
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="password">Password</label>
              <input
                className={inputClassName}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              className="w-full rounded-md bg-slate-700 px-4 py-3 text-xs font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting} 
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {message && (
            <p className="mt-3 text-xs text-slate-600" role="status">
              {message}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Use the account details provided by your organization.
          </p>
          <p className="mt-4 text-center text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
