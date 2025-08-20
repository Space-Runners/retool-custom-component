import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadProgress } from '../components/UploadProgress'
import { UploadResult } from '../components/UploadResult'

interface UploadingStageProps {
  previewUrl: string
  selectedFile: File | null
  uploadProgress: number
  uploadResult: { success: boolean; url?: string; error?: string } | null
}

export const UploadingStage: React.FC<UploadingStageProps> = ({
  previewUrl,
  selectedFile,
  uploadProgress,
  uploadResult
}) => {
  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={selectedFile} />
      <UploadProgress uploadProgress={uploadProgress} />
      <UploadResult uploadResult={uploadResult} isUploading={true} />
    </>
  )
}
