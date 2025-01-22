import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../../components/ui/Card'
import Sidebar from '../../components/navigation/Sidebar'
import ErrorMessage from '../../components/ui/ErrorMessage'
import AddTrain from '../admin/AddTrain'
import UpdateTrain from '../admin/UpdateTrain'
import DeleteTrain from '../admin/DeleteTrain'
function Profile({ setUserRole }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please login to view your profile')
          setLoading(false)
          return
        }

        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data.user)
        setUserRole(response.data.user.role)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [setUserRole])

  const adminNavItems = [
    { id: 'addTrain', label: 'Add Train' },
    { id: 'updateTrain', label: 'Update Train' },
    { id: 'deleteTrain', label: 'Delete Train' },
    { id: 'addRoute', label: 'Add Route' },
    { id: 'updateRoute', label: 'Update Route' },
    { id: 'deleteRoute', label: 'Delete Route' },
    { id: 'addStop', label: 'Add Stop' },
    { id: 'updateStop', label: 'Update Stop' },
    { id: 'deleteStop', label: 'Delete Stop' }
  ]

  const userNavItems = [
    { id: 'fetchTicket', label: 'Current Bookings' },
    { id: 'generatePDF', label: 'Generate Ticket PDF' },
    { id: 'searchTrains', label: 'Search Trains' },
    { id: 'allTrains', label: 'All Trains' },
    { id: 'trainByName', label: 'Find Train by Name' },
    { id: 'allStops', label: 'All Stops' },
    { id: 'stopById', label: 'Find Stop by ID' },
    { id: 'createBooking', label: 'Book Ticket' },
    { id: 'cancelBooking', label: 'Cancel Booking' },
    { id: 'bookingHistory', label: 'Booking History' }
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-6xl mx-auto">
          <div className="text-center">Loading profile...</div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-6xl mx-auto">
          <ErrorMessage message={error} />
        </Card>
      </div>
    )
  }

  const ProfileInfo = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back!
        </p>
      </div>

      {user && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {user.role}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInfo />
      case 'addTrain':
        return <AddTrain />
      case 'updateTrain':
        return <UpdateTrain />
      case 'deleteTrain':
        return <DeleteTrain />
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/([A-Z])/g, ' $1')}
            </h2>
            <p className="text-gray-600">This feature will be implemented soon.</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          <Sidebar
            items={user?.role === 'admin' ? adminNavItems : userNavItems}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <Card className="flex-1">
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile