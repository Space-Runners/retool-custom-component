import React from 'react'

interface RemoveButtonProps {
  onClick: () => void
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 16px',
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        marginTop: '8px'
      }}
      onMouseOver={(e) => {
        const target = e.target as HTMLButtonElement
        target.style.backgroundColor = '#dc2626'
        target.style.transform = 'translateY(-1px)'
        target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      onMouseOut={(e) => {
        const target = e.target as HTMLButtonElement
        target.style.backgroundColor = '#ef4444'
        target.style.transform = 'translateY(0)'
        target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      🗑️ Remove Image
    </button>
  )
}
