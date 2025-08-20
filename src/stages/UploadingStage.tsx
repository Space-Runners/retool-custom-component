import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadProgress } from '../components/UploadProgress'
import { UploadResult } from '../components/UploadResult'
import { useImageUpload } from '../ImageUploadContext'

export const UploadingStage: React.FC = () => {
  const { previewUrl, croppedFile, uploadProgress, uploadResult } =
    useImageUpload()

  if (!previewUrl) return null

  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={croppedFile} />
      <UploadProgress uploadProgress={uploadProgress} />
      <UploadResult uploadResult={uploadResult} isUploading={true} />
    </>
  )
}
