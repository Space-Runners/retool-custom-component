import React from 'react'

interface UploadResultProps {
  uploadResult: {
    success: boolean
    error?: string
  } | null
  isUploading: boolean
}

export const UploadResult: React.FC<UploadResultProps> = ({
  uploadResult,
  isUploading
}) => {
  if (!uploadResult || isUploading) {
    return null
  }

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: uploadResult.success ? '#f0fdf4' : '#fef2f2',
        borderRadius: '6px',
        border: `1px solid ${uploadResult.success ? '#16a34a' : '#dc2626'}`
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '500',
          color: uploadResult.success ? '#166534' : '#991b1b',
          marginBottom: uploadResult.success ? '4px' : '0'
        }}
      >
        {uploadResult.success ? '✅ Upload successful!' : '❌ Upload failed'}
      </div>
      {!uploadResult.success && uploadResult.error && (
        <div
          style={{
            fontSize: '10px',
            color: '#991b1b'
          }}
        >
          Error: {uploadResult.error}
        </div>
      )}
    </div>
  )
}
