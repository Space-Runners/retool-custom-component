import React from 'react'

interface UploadProgressProps {
  uploadProgress: number
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  uploadProgress
}) => {
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#eff6ff',
        borderRadius: '6px',
        border: '1px solid #3b82f6'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e40af' }}>
          Uploading...
        </span>
        <span style={{ fontSize: '12px', color: '#1e40af' }}>
          {Math.round(uploadProgress)}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#dbeafe',
          borderRadius: '3px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${uploadProgress}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  )
}
