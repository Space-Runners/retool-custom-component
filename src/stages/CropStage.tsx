import React from 'react'
import { CropImage } from '../components/CropImage'
import { useImageUpload } from '../ImageUploadContext'

export const CropStage: React.FC = () => {
  const { previewUrl, selectedFile, handleCropComplete, handleCropCancel } =
    useImageUpload()

  if (!previewUrl) return null

  return (
    <CropImage
      previewUrl={previewUrl}
      selectedFile={selectedFile}
      onCropComplete={handleCropComplete}
      onCancel={handleCropCancel}
    />
  )
}
