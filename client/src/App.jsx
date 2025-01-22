// import { useState, useEffect } from 'react'
// import Login from './pages/Auth/Login'
// import Register from './pages/Auth/Register'
// import Profile from './pages/Auth/Profile'
// import './App.css'

// function App() {
//   const [currentPage, setCurrentPage] = useState('login')
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       setIsAuthenticated(true)
//       setCurrentPage('profile')
//     }
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     setIsAuthenticated(false)
//     setCurrentPage('login')
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-indigo-600 text-white">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">Railway Ticket Booking System</h1>
//             <div className="space-x-4">
//               {!isAuthenticated ? (
//                 <>
//                   <button 
//                     onClick={() => setCurrentPage('login')}
//                     className={`px-4 py-2 rounded-md ${currentPage === 'login' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//                   >
//                     Login
//                   </button>
//                   <button 
//                     onClick={() => setCurrentPage('register')}
//                     className={`px-4 py-2 rounded-md ${currentPage === 'register' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//                   >
//                     Register
//                   </button>
//                 </>
//               ) : (
//                 <button 
//                   onClick={handleLogout}
//                   className="px-4 py-2 rounded-md hover:bg-indigo-700"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>
      
//       <main>
//         {isAuthenticated ? (
//           <Profile />
//         ) : (
//           currentPage === 'login' ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Register />
//         )}
//       </main>
      
//       <footer className="bg-gray-800 text-white mt-auto">
//         <div className="container mx-auto px-4 py-6">
//           <p className="text-center text-sm">© 2024 Railway Ticket Booking System. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }

// export default App 
import { useState, useEffect } from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setCurrentPage('profile')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setCurrentPage('login')
    setUserRole(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Railway Ticket Booking System</h1>
            <div className="space-x-4">
              {!isAuthenticated ? (
                <>
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
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {isAuthenticated ? (
          <Profile setUserRole={setUserRole} />
        ) : (
          currentPage === 'login' ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Register />
        )}
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