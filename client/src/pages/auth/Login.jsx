import { useState } from 'react'
import axios from 'axios'
import FormInput from '../../components/ui/FormInput'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Card from '../../components/ui/Card'

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await axios.post('http://localhost:3000/api/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <ErrorMessage message={error} />

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Login