import React from 'react'

interface DeleteButtonProps {
  onClick: () => void
  isDeleting: boolean
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  isDeleting
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDeleting}
      style={{
        width: '100%',
        padding: '10px 16px',
        backgroundColor: isDeleting ? '#e5e7eb' : '#dc2626',
        color: isDeleting ? '#9ca3af' : '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isDeleting ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        marginTop: '8px'
      }}
      onMouseOver={(e) => {
        if (!isDeleting) {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#b91c1c'
          target.style.transform = 'translateY(-1px)'
          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }}
      onMouseOut={(e) => {
        if (!isDeleting) {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#dc2626'
          target.style.transform = 'translateY(0)'
          target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Image'}
    </button>
  )
}
