import React from 'react'

interface FolderInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const FolderInput: React.FC<FolderInputProps> = ({
  value,
  onChange,
  placeholder = 'uploads'
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px'
        }}
      >
        📁 Folder Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          color: '#374151',
          outline: 'none',
          transition: 'all 0.2s ease-in-out',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          const target = e.target as HTMLInputElement
          target.style.borderColor = '#3b82f6'
          target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
        }}
        onBlur={(e) => {
          const target = e.target as HTMLInputElement
          target.style.borderColor = '#d1d5db'
          target.style.boxShadow = 'none'
        }}
      />
      <div
        style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '4px'
        }}
      >
        Files will be uploaded to: {value || placeholder}/
      </div>
    </div>
  )
}
