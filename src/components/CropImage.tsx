import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CropImageProps {
  previewUrl: string
  selectedFile: File | null
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
}

// Helper function to create cropped image file
const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(file)
        }
      },
      'image/jpeg',
      0.9
    )
  })
}

export const CropImage: React.FC<CropImageProps> = ({
  previewUrl,
  selectedFile,
  onCropComplete,
  onCancel
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const crop = centerCrop(
        { unit: '%', width: 80, height: 60 },
        width,
        height
      )
      setCrop(crop)
    },
    []
  )

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current && selectedFile) {
      try {
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          selectedFile.name
        )
        onCropComplete(croppedFile)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        <p
          style={{
            margin: '0',
            fontSize: '12px',
            fontWeight: '500',
            color: '#475569'
          }}
        >
          ✂️ Crop Image
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            disabled={!completedCrop}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: completedCrop ? '#3b82f6' : '#e5e7eb',
              color: completedCrop ? '#ffffff' : '#9ca3af',
              border: 'none',
              borderRadius: '4px',
              cursor: completedCrop ? 'pointer' : 'not-allowed'
            }}
          >
            Apply Crop
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxHeight: '300px',
          overflow: 'hidden'
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          minWidth={50}
          minHeight={50}
        >
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              objectFit: 'contain'
            }}
          />
        </ReactCrop>
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#64748b',
          textAlign: 'center'
        }}
      >
        Drag to select the area you want to crop (any shape)
      </div>
    </div>
  )
}
