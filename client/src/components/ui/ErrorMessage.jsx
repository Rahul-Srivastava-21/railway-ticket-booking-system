import React from 'react'

function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="text-red-500 text-sm text-center">
      {message}
    </div>
  )
}

export default ErrorMessage