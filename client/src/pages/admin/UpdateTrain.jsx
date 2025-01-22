import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../../components/ui/Card'
import FormInput from '../../components/ui/FormInput'
import FormSelect from '../../components/ui/FormSelect'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'

function UpdateTrain() {
  const [trains, setTrains] = useState([])
  const [stops, setStops] = useState([])
  const [selectedTrain, setSelectedTrain] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    trainNumber: '',
    startStopId: '',
    endStopId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTrains, setLoadingTrains] = useState(true)
  const [loadingStops, setLoadingStops] = useState(true)

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

    const fetchStops = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/stops', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStops(response.data.stops)
      } catch (err) {
        setError('Failed to load stops')
      } finally {
        setLoadingStops(false)
      }
    }

    fetchTrains()
    fetchStops()
  }, [])

  useEffect(() => {
    const fetchTrainDetails = async () => {
      if (!selectedTrain) return

      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:3000/api/trains/${selectedTrain}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const train = response.data.train
        setFormData({
          name: train.name,
          trainNumber: train.trainNumber,
          startStopId: train.startStopId,
          endStopId: train.endStopId
        })
      } catch (err) {
        setError('Failed to load train details')
      }
    }

    fetchTrainDetails()
  }, [selectedTrain])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'trainSelect') {
      setSelectedTrain(value)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTrain) {
      setError('Please select a train to update')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:3000/api/trains/${selectedTrain}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccess('Train updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update train')
    } finally {
      setLoading(false)
    }
  }

  if (loadingTrains || loadingStops) {
    return (
      <Card>
        <div className="text-center">Loading...</div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Update Train</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select a train and update its details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {selectedTrain && (
          <>
            <FormInput
              label="Train Name"
              id="name"
              name="name"
              required
              placeholder="Enter train name"
              value={formData.name}
              onChange={handleChange}
            />

            <FormInput
              label="Train Number"
              id="trainNumber"
              name="trainNumber"
              required
              placeholder="Enter train number"
              value={formData.trainNumber}
              onChange={handleChange}
            />

            <FormSelect
              label="Start Stop"
              id="startStopId"
              name="startStopId"
              required
              options={stops.map(stop => ({
                value: stop.id,
                label: stop.name
              }))}
              value={formData.startStopId}
              onChange={handleChange}
            />

            <FormSelect
              label="End Stop"
              id="endStopId"
              name="endStopId"
              required
              options={stops.map(stop => ({
                value: stop.id,
                label: stop.name
              }))}
              value={formData.endStopId}
              onChange={handleChange}
            />
          </>
        )}

        {error && <ErrorMessage message={error} />}
        
        {success && (
          <div className="text-green-500 text-sm text-center">
            {success}
          </div>
        )}

        <Button type="submit" loading={loading} disabled={!selectedTrain}>
          Update Train
        </Button>
      </form>
    </Card>
  )
}

export default UpdateTrain