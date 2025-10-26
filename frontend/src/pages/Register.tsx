import { useState } from 'react'
import api from '../lib/api'
import { saveAuth } from '../lib/auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function onSubmit(e: any) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      saveAuth(data.token, data.user)
      nav('/')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Create account</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input type="password" className="w-full border rounded p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? '...' : 'Register'}</button>
        <p className="text-sm">Have an account? <Link to="/login" className="text-green-700 underline">Login</Link></p>
      </form>
    </div>
  )
}
