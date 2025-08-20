import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadButton } from '../components/UploadButton'
import { RemoveButton } from '../components/RemoveButton'
import { useImageUpload } from '../ImageUploadContext'

export const UploadStage: React.FC = () => {
  const { previewUrl, croppedFile, handleUpload, handleRemoveImage } =
    useImageUpload()

  if (!previewUrl) return null

  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={croppedFile} />
      <UploadButton
        onClick={handleUpload}
        selectedFile={croppedFile}
        isUploading={false}
      />
      <RemoveButton onClick={handleRemoveImage} />
    </>
  )
}
