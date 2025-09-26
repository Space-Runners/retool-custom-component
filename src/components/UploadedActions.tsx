import React from 'react'

interface UploadedActionsProps {
  onUploadNew: () => void
}

export const UploadedActions: React.FC<UploadedActionsProps> = ({
  onUploadNew
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
      <button
        onClick={onUploadNew}
        style={{
          flex: 1,
          padding: '10px 16px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
        onMouseOver={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#2563eb'
          target.style.transform = 'translateY(-1px)'
          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOut={(e) => {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#3b82f6'
          target.style.transform = 'translateY(0)'
          target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        📁 Upload New
      </button>
    </div>
  )
}
