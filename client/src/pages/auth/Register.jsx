import { useState } from 'react'
import axios from 'axios'
import FormInput from '../../components/ui/FormInput'
import FormSelect from '../../components/ui/FormSelect'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Card from '../../components/ui/Card'

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData)
      alert('Registration successful!')
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Register for a new account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <FormInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <FormSelect
            label="Role"
            id="role"
            name="role"
            required
            options={roleOptions}
            value={formData.role}
            onChange={handleChange}
          />

          <ErrorMessage message={error} />

          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Register