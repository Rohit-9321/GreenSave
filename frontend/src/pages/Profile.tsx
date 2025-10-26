import { getUser } from '../lib/auth'
export default function Profile() {
  const user = getUser()
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Profile</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="font-semibold">{user?.name}</div>
        <div className="text-sm text-gray-600">{user?.email}</div>
      </div>
    </div>
  )
}
