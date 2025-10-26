import { useEffect, useRef, useState } from 'react'
import api from '../lib/api'
import { saveAuth } from '../lib/auth'
import { Link, useNavigate } from 'react-router-dom'

declare global {
  interface Window { google: any }
}

export default function Login() {
  const [email, setEmail] = useState('demo@greensteps.app')
  const [password, setPassword] = useState('demo1234')
  const [otpEmail, setOtpEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const googleDiv = useRef<HTMLDivElement>(null)

  async function onSubmit(e: any) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveAuth(data.token, data.user)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function demo() {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/demo')
      saveAuth(data.token, data.user)
      nav('/')
    } catch {
      setError('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  async function startOtp() {
    setError('')
    const { data } = await api.post('/auth/otp/start', { email: otpEmail })
    if (data) setOtpSent(true)
  }
  async function verifyOtp() {
    setError('')
    const { data } = await api.post('/auth/otp/verify', { email: otpEmail, code: otpCode })
    saveAuth(data.token, data.user)
    nav('/')
  }

  useEffect(() => {
    if (window.google && googleDiv.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: async (response: any) => {
            const { data } = await api.post('/auth/google', { idToken: response.credential })
            saveAuth(data.token, data.user)
            nav('/')
          }
        })
        window.google.accounts.id.renderButton(googleDiv.current, { theme: 'outline', size: 'large' })
      } catch {}
    }
  }, [])

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="grid md:grid-cols-2 gap-4 w-full max-w-3xl">
        <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow space-y-3">
          <h1 className="text-xl font-semibold">Login (Password)</h1>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input type="password" className="w-full border rounded p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
          <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? '...' : 'Login'}</button>
          <button type="button" onClick={demo} className="w-full border py-2 rounded">Demo login</button>
          <div className="mt-2" ref={googleDiv}></div>
          <p className="text-sm">No account? <Link to="/register" className="text-green-700 underline">Register</Link></p>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow space-y-3">
          <h2 className="text-lg font-semibold">Login via OTP</h2>
          <input className="w-full border rounded p-2" placeholder="Email for OTP" value={otpEmail} onChange={e=>setOtpEmail(e.target.value)}/>
          {!otpSent ? (
            <button onClick={startOtp} className="w-full bg-black text-white py-2 rounded">Send OTP</button>
          ) : (
            <div className="space-y-2">
              <input className="w-full border rounded p-2" placeholder="Enter OTP" value={otpCode} onChange={e=>setOtpCode(e.target.value)}/>
              <button onClick={verifyOtp} className="w-full bg-green-600 text-white py-2 rounded">Verify & Sign In</button>
            </div>
          )}
          <p className="text-xs text-gray-600">If email isn’t configured, the OTP code is logged on the server console for demo.</p>
        </div>
      </div>
    </div>
  )
}
