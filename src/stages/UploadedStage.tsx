import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadResult } from '../components/UploadResult'
import { UploadedActions } from '../components/UploadedActions'

interface UploadedStageProps {
  previewUrl: string
  selectedFile: File | null
  uploadResult: { success: boolean; url?: string; error?: string } | null
  onDelete: () => void
  onUploadNew: () => void
}

export const UploadedStage: React.FC<UploadedStageProps> = ({
  previewUrl,
  selectedFile,
  uploadResult,
  onDelete,
  onUploadNew
}) => {
  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={selectedFile} />
      <UploadResult uploadResult={uploadResult} isUploading={false} />
      <UploadedActions onDelete={onDelete} onUploadNew={onUploadNew} />
    </>
  )
}
