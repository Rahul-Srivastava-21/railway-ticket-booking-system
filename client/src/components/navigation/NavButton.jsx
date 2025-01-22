import React from 'react'

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-md mb-2 ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export default NavButton