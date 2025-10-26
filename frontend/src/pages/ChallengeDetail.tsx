import { useState } from 'react'
import api from '../lib/api'
import { useParams } from 'react-router-dom'

export default function ChallengeDetail() {
  const { id } = useParams()
  const [amount, setAmount] = useState<number>(1)
  const [type, setType] = useState('bike')
  const [result, setResult] = useState<any>(null)

  async function join() {
    await api.post(`/challenges/${id}/join`)
    alert('Joined!')
  }

  async function addAction() {
    const { data } = await api.post(`/challenges/${id}/action`, { type, amount: Number(amount) })
    setResult(data)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Challenge #{id}</h1>
      <div className="space-x-2">
        <button onClick={join} className="bg-green-600 text-white px-3 py-2 rounded">Join</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h2 className="font-semibold mb-2">Log Action</h2>
        <div className="flex gap-2">
          <select className="border rounded p-2" value={type} onChange={e=>setType(e.target.value)}>
            <option>bike</option><option>bus</option><option>train</option><option>plant</option><option>solar</option><option>recycle</option>
          </select>
          <input className="border rounded p-2 w-32" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/>
          <button onClick={addAction} className="bg-black text-white px-3 py-2 rounded">Save</button>
        </div>
        {result && <div className="mt-2 text-sm">CO₂ saved: <b>{result.co2_saved.toFixed(2)} kg</b></div>}
      </div>
    </div>
  )
}
