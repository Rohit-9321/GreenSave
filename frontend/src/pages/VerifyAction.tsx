import { useState } from 'react'
import api from '../lib/api'

export default function VerifyAction() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')

  async function upload() {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    setUrl(data.url)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Verify Action (Image)</h1>
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)}/>
        <button onClick={upload} className="bg-green-600 text-white px-3 py-2 rounded">Upload</button>
        {url && <div className="text-sm">Uploaded: <a className="underline text-green-700" href={url} target="_blank">{url}</a></div>}
      </div>
    </div>
  )
}
