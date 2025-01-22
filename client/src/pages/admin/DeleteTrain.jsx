import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../../components/ui/Card'
import FormSelect from '../../components/ui/FormSelect'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'

function DeleteTrain() {
  const [trains, setTrains] = useState([])
  const [selectedTrain, setSelectedTrain] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTrains, setLoadingTrains] = useState(true)

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/trains', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTrains(response.data.trains)
      } catch (err) {
        setError('Failed to load trains')
      } finally {
        setLoadingTrains(false)
      }
    }

    fetchTrains()
  }, [success]) // Reload trains after successful deletion

  const handleChange = (e) => {
    setSelectedTrain(e.target.value)
    setError('')
    setSuccess('')
  }

  const handleDelete = async () => {
    if (!selectedTrain) {
      setError('Please select a train to delete')
      return
    }

    if (!window.confirm('Are you sure you want to delete this train? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `http://localhost:3000/api/trains/${selectedTrain}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccess('Train deleted successfully!')
      setSelectedTrain('') // Reset selection after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete train')
    } finally {
      setLoading(false)
    }
  }

  if (loadingTrains) {
    return (
      <Card>
        <div className="text-center">Loading trains...</div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Delete Train</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select a train to delete
        </p>
      </div>

      <div className="space-y-6">
        <FormSelect
          label="Select Train"
          id="trainSelect"
          name="trainSelect"
          required
          options={trains.map(train => ({
            value: train.id,
            label: `${train.name} (${train.trainNumber})`
          }))}
          value={selectedTrain}
          onChange={handleChange}
        />

        {error && <ErrorMessage message={error} />}
        
        {success && (
          <div className="text-green-500 text-sm text-center">
            {success}
          </div>
        )}

        <Button
          type="button"
          onClick={handleDelete}
          loading={loading}
          disabled={!selectedTrain}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          Delete Train
        </Button>
      </div>
    </Card>
  )
}

export default DeleteTrain