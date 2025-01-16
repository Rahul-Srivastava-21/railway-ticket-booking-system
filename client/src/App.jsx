import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Railway Ticket Booking System</h1>
            <div className="space-x-4">
              <button 
                onClick={() => setCurrentPage('login')}
                className={`px-4 py-2 rounded-md ${currentPage === 'login' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentPage('register')}
                className={`px-4 py-2 rounded-md ${currentPage === 'register' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {currentPage === 'login' ? <Login /> : <Register />}
      </main>
      
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm">© 2024 Railway Ticket Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App