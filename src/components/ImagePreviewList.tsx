import React from 'react'
import { formatFileSize } from '../services/s3.service'

interface ImagePreviewListProps {
  previewUrls: string[]
  selectedFiles: File[]
}

export const ImagePreviewList: React.FC<ImagePreviewListProps> = ({
  previewUrls,
  selectedFiles
}) => {
  if (previewUrls.length === 0) {
    return null
  }

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
        Previews ({previewUrls.length})
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
          gap: '8px'
        }}
      >
        {previewUrls.map((previewUrl, index) => {
          const file = selectedFiles[index]

          return (
            <div
              key={`${file?.name || 'image'}-${index}`}
              style={{
                padding: '6px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                border: '1px solid #e2e8f0'
              }}
            >
              <img
                src={previewUrl}
                alt={`Selected file preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '72px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  marginBottom: '6px'
                }}
              />
              <div
                style={{
                  fontSize: '10px',
                  color: '#64748b',
                  wordBreak: 'break-word',
                  lineHeight: '1.3'
                }}
              >
                <strong>{file?.name || `Image ${index + 1}`}</strong>
                <br />
                {file ? formatFileSize(file.size) : '0 KB'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
