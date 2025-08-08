import React from 'react'

interface UploadButtonProps {
  onClick: () => void
  selectedFile: File | null
  isUploading: boolean
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  selectedFile,
  isUploading
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!selectedFile || isUploading}
      style={{
        width: '100%',
        padding: '10px 16px',
        backgroundColor: !selectedFile || isUploading ? '#e5e7eb' : '#3b82f6',
        color: !selectedFile || isUploading ? '#9ca3af' : '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: !selectedFile || isUploading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow:
          !selectedFile || isUploading
            ? 'none'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
      onMouseOver={(e) => {
        if (selectedFile && !isUploading) {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#2563eb'
          target.style.transform = 'translateY(-1px)'
          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }}
      onMouseOut={(e) => {
        if (selectedFile && !isUploading) {
          const target = e.target as HTMLButtonElement
          target.style.backgroundColor = '#3b82f6'
          target.style.transform = 'translateY(0)'
          target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      {isUploading
        ? '⏳ Uploading...'
        : selectedFile
          ? '📤 Upload to S3'
          : '📁 Select an image first'}
    </button>
  )
}
