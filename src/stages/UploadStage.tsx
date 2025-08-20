import React from 'react'
import { ImagePreview } from '../components/ImagePreview'
import { UploadButton } from '../components/UploadButton'
import { RemoveButton } from '../components/RemoveButton'

interface UploadStageProps {
  previewUrl: string
  selectedFile: File | null
  onUpload: () => void
  onRemove: () => void
}

export const UploadStage: React.FC<UploadStageProps> = ({
  previewUrl,
  selectedFile,
  onUpload,
  onRemove
}) => {
  return (
    <>
      <ImagePreview previewUrl={previewUrl} selectedFile={selectedFile} />
      <UploadButton
        onClick={onUpload}
        selectedFile={selectedFile}
        isUploading={false}
      />
      <RemoveButton onClick={onRemove} />
    </>
  )
}
