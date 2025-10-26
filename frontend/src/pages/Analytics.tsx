import { useEffect, useState } from 'react'
import api from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [data, setData] = useState<any>(null)
  useEffect(()=>{ api.get('/analytics/summary').then(r=>setData(r.data)) }, [])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Analytics</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">CO₂ Saved Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.timeseries || []}>
              <XAxis dataKey="day"/><YAxis/><Tooltip/>
              <Line type="monotone" dataKey="co2" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h2 className="font-semibold mb-2">Top Users</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {data?.topUsers?.map((u: any) => (
            <div key={u.id} className="border rounded p-2 flex justify-between">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div className="font-semibold">{Number(u.co2).toFixed(1)} kg</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
