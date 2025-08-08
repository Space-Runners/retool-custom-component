import React from 'react'
import { formatFileSize } from '../s3Utils'

interface ImagePreviewProps {
  previewUrl: string
  selectedFile: File | null
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  selectedFile
}) => {
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      }}
    >
      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: '12px',
          fontWeight: '500',
          color: '#475569'
        }}
      >
        Preview
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <img
          src={previewUrl}
          alt="Selected file preview"
          style={{
            maxWidth: '100%',
            maxHeight: '150px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            objectFit: 'contain'
          }}
        />
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            fontSize: '10px',
            color: '#64748b',
            textAlign: 'center'
          }}
        >
          <strong>{selectedFile?.name}</strong>
          <br />
          {selectedFile ? formatFileSize(selectedFile.size) : '0 KB'}
        </div>
      </div>
    </div>
  )
}
