import React from 'react'
import { FileInput } from '../components/FileInput'
import { useImageUpload } from '../ImageUploadContext'

export const EmptyStage: React.FC = () => {
  const { handleFileChange } = useImageUpload()

  return <FileInput onChange={handleFileChange} />
}
