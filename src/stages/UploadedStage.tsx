import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadResult } from '../components/UploadResult'
import { UploadedActions } from '../components/UploadedActions'
import { useImageUpload } from '../ImageUploadContext'

export const UploadedStage: React.FC = () => {
  const {
    previewUrl,
    croppedFile,
    uploadResult,
    handleUploadNew,
    handleDeleteUploaded
  } = useImageUpload()

  if (!previewUrl) return null

  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={croppedFile} />
      <UploadResult uploadResult={uploadResult} isUploading={false} />
      <UploadedActions
        onUploadNew={handleUploadNew}
        onDelete={handleDeleteUploaded}
      />
    </>
  )
}
