'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'role'>('profile')
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    account_number: '',
    bank_name: '',
    primary_phone: '',
    secondary_phone: '',
    role: ''
  })
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [roleSwitch, setRoleSwitch] = useState('customer')

  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/profile/')
        const user = res.data.user
        setProfile({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          account_number: user.account_number || '',
          bank_name: user.bank_name || '',
          primary_phone: user.primary_phone || '',
          secondary_phone: user.secondary_phone || '',
          role: user.role || 'customer'
        })
        setRoleSwitch(user.role)
      } catch {
        toast.error('Failed to load profile', { position: 'top-center' })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put('/auth/profile/update/', profile)
      toast.success('Profile updated', { position: 'top-center' })
      setEditMode(false)
      router.push('/dashboard')
    } catch {
      toast.error('Update failed', { position: 'top-center' })
    }
  }

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/auth/profile/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      })
      toast.success('Password changed successfully', { position: 'top-center' })
      setOldPassword('')
      setNewPassword('')
      router.push('/dashboard')
    } catch {
      toast.error('Password change failed', { position: 'top-center' })
    }
  }

  const handleRoleSwitch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/user/switch-role/', { role: roleSwitch })
      toast.success(res.data.message, { position: 'top-center' })
      router.push('/dashboard')
    } catch {
      toast.error('Role switch failed', { position: 'top-center' })
    }
  }

  if (loading) return <p className="text-center py-10">Loading...</p>

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}>
            Profile Info
          </button>
          <button onClick={() => setActiveTab('password')} className={`px-4 py-2 rounded ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}>
            Change Password
          </button>
          <button onClick={() => setActiveTab('role')} className={`px-4 py-2 rounded ${activeTab === 'role' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}>
            Switch Role
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <>
          {editMode ? (
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Email (read-only)</label>
                <input
                  type="text"
                  value={profile.email}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Account Number</label>
                <input
                  type="text"
                  value={profile.account_number}
                  onChange={(e) => handleChange('account_number', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Bank Name</label>
                <input
                  type="text"
                  value={profile.bank_name}
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Primary Phone</label>
                <input
                  type="text"
                  value={profile.primary_phone}
                  onChange={(e) => handleChange('primary_phone', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Secondary Phone</label>
                <input
                  type="text"
                  value={profile.secondary_phone}
                  onChange={(e) => handleChange('secondary_phone', e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="md:col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <p><strong>First Name:</strong> {profile.first_name}</p>
                <p><strong>Last Name:</strong> {profile.last_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Account Number:</strong> {profile.account_number}</p>
                <p><strong>Bank Name:</strong> {profile.bank_name}</p>
                <p><strong>Primary Phone:</strong> {profile.primary_phone}</p>
                <p><strong>Secondary Phone:</strong> {profile.secondary_phone}</p>
                <p><strong>Current Role:</strong> {profile.role}</p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </>
          )}
        </>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Change Password
          </button>
        </form>
      )}

      {activeTab === 'role' && (
        <form onSubmit={handleRoleSwitch} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Select Role</label>
            <select
              value={roleSwitch}
              onChange={(e) => setRoleSwitch(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Switch Role
          </button>
        </form>
      )}
    </section>
  )
}
