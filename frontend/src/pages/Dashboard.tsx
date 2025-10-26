import { useEffect, useState } from 'react'
import api from '../lib/api'
import { getUser } from '../lib/auth'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [groupLB, setGroupLB] = useState<any[]>([])

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data))
    api.get('/analytics/group-leaderboard').then(r => setGroupLB(r.data))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Hello, {getUser()?.name} 👋</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card title="Users" value={summary?.totals?.totalUsers}/>
        <Card title="Challenges" value={summary?.totals?.totalChallenges}/>
        <Card title="Actions" value={summary?.totals?.totalActions}/>
        <Card title="CO₂ Saved (kg)" value={summary?.totals?.totalCO2?.toFixed?.(1)}/>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="p-4 rounded-xl bg-white shadow">
          <h2 className="font-semibold mb-2">Quick Links</h2>
          <div className="flex gap-3">
            <Link className="underline text-green-700" to="/challenges">Explore Challenges</Link>
            <Link className="underline text-green-700" to="/analytics">View Analytics</Link>
            <Link className="underline text-green-700" to="/verify">Verify Action</Link>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white shadow">
          <h2 className="font-semibold mb-2">Top Groups (CO₂)</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {groupLB.map((g: any) => (
              <div key={g.id} className="border rounded p-2 flex justify-between">
                <div className="font-semibold">{g.name}</div>
                <div className="font-semibold">{Number(g.co2).toFixed(1)} kg</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="p-4 rounded-xl bg-white shadow">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value ?? '—'}</div>
    </div>
  )
}
