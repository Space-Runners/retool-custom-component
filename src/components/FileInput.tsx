import React from 'react'

interface FileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  multiple?: boolean
  label?: string
  inputId?: string
}

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  multiple = false,
  label,
  inputId = 'image-input'
}) => {
  const labelText = label || (multiple ? 'Choose Image File(s)' : 'Choose Image File')

  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#374151'
        }}
      >
        {labelText}
      </label>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '100%'
        }}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onChange}
          style={{
            width: '90%',
            padding: '8px 12px',
            border: '2px dashed #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#f9fafb',
            fontSize: '12px',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLInputElement
            target.style.borderColor = '#3b82f6'
            target.style.backgroundColor = '#eff6ff'
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLInputElement
            target.style.borderColor = '#d1d5db'
            target.style.backgroundColor = '#f9fafb'
          }}
        />
      </div>
    </div>
  )
}
