import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'

export default function Challenges() {
  const [list, setList] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(()=>{ api.get('/challenges').then(r=>setList(r.data)) }, [])

  async function create() {
    if (!title || !description) return
    const { data } = await api.post('/challenges', { title, description })
    setList([data, ...list])
    setTitle(''); setDescription('')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Challenges</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-semibold mb-2">Create</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="border rounded p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
          <input className="border rounded p-2 md:col-span-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}/>
        </div>
        <button onClick={create} className="mt-2 bg-green-600 text-white px-3 py-2 rounded">Add</button>
      </div>

      <div className="grid gap-3">
        {list.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-600">{c.description}</div>
            </div>
            <Link to={`/challenges/${c.id}`} className="underline text-green-700">Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
