import React from 'react'
import NavButton from './NavButton'

function Sidebar({ items, activeSection, onSectionChange }) {
  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Navigation</h3>
        <NavButton
          active={activeSection === 'profile'}
          onClick={() => onSectionChange('profile')}
        >
          Profile
        </NavButton>
        {items.map(item => (
          <NavButton
            key={item.id}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.label}
          </NavButton>
        ))}
      </div>
    </div>
  )
}

export default Sidebar