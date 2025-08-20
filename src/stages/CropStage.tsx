import React from 'react'
import { CropImage } from '../components/CropImage'

interface CropStageProps {
  previewUrl: string
  selectedFile: File | null
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
}

export const CropStage: React.FC<CropStageProps> = ({
  previewUrl,
  selectedFile,
  onCropComplete,
  onCancel
}) => {
  return (
    <CropImage
      previewUrl={previewUrl}
      selectedFile={selectedFile}
      onCropComplete={onCropComplete}
      onCancel={onCancel}
    />
  )
}
