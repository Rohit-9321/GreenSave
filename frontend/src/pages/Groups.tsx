import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([])
  const [name, setName] = useState('')

  async function load() {
    const { data } = await api.get('/social/groups')
    setGroups(data)
  }
  useEffect(()=>{ load() }, [])

  async function create() {
    if (!name) return
    const { data } = await api.post('/social/groups', { name })
    setName('')
    setGroups([data, ...groups])
  }
  async function join(id: number) {
    await api.post(`/social/groups/${id}/join`)
    load()
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Groups</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex gap-2">
          <input className="border rounded p-2 flex-1" placeholder="Group name" value={name} onChange={e=>setName(e.target.value)}/>
          <button onClick={create} className="bg-green-600 text-white px-3 py-2 rounded">Create</button>
        </div>
      </div>
      <div className="grid gap-2 mt-4">
        {groups.map(g => (
          <div key={g.id} className="bg-white p-3 rounded-xl shadow flex justify-between">
            <div>
              <div className="font-semibold">{g.name}</div>
              <div className="text-sm text-gray-600">{g.members} members</div>
            </div>
            <button onClick={()=>join(g.id)} className="underline text-green-700">Join</button>
          </div>
        ))}
      </div>
    </div>
  )
}
