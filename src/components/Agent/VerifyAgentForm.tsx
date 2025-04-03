'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

export default function VerifyAgentForm() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState({
    valid_id: null,
    cac_certificate: null,
    business_proof: null,
    authorization_letter: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selected } = e.target
    if (selected && selected.length > 0) {
      setFiles((prev) => ({
        ...prev,
        [name]: selected[0],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    Object.entries(files).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })

    try {
      await axios.post('/auth/verify-agent/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Verification documents submitted!', {position: 'top-center'})
      window.location.reload()
    } catch (err) {
      toast.error('Submission failed. Check your files.', {position: 'top-center'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-blacksection shadow rounded-lg space-y-6"
    >
      <h2 className="text-xl font-semibold text-center mb-4">Verify Your Identity</h2>

      {[
        { label: 'Valid ID (National ID, Passport, etc)', name: 'valid_id' },
        { label: 'CAC Certificate', name: 'cac_certificate' },
        { label: 'Proof of Business Address', name: 'business_proof' },
        { label: 'Authorization Letter', name: 'authorization_letter' },
      ].map((input) => (
        <div key={input.name}>
          <label className="block mb-1 font-medium text-sm">{input.label}</label>
          <input
            type="file"
            name={input.name}
            accept=".jpg,.jpeg,.png,.pdf"
            required
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
      >
        {loading ? 'Submitting...' : 'Submit for Verification'}
      </button>
    </form>
  )
}