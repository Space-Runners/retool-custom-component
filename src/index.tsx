import React, { type FC } from 'react'

import { ImageUploadProvider, useImageUpload } from './ImageUploadContext'
import { EmptyStage } from './stages/EmptyStage'
import { CropStage } from './stages/CropStage'
import { UploadStage } from './stages/UploadStage'
import { UploadingStage } from './stages/UploadingStage'
import { UploadedStage } from './stages/UploadedStage'

// Inner component that uses the context
const ImageUploadContent: FC = () => {
  const {
    stage,
    selectedFile,
    previewUrl,
    croppedFile,
    uploadProgress,
    uploadResult,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
    handleUpload,
    handleDeleteUploaded,
    handleUploadNew
  } = useImageUpload()

  return (
    <div
      style={{
        padding: '16px',
        maxWidth: '350px',
        margin: '0 auto',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Stage 1: Empty - User can select an image */}
      {stage === 'empty' && <EmptyStage onFileChange={handleFileChange} />}

      {/* Stage 2: Crop - User can crop the selected image */}
      {stage === 'crop' && previewUrl && (
        <CropStage
          previewUrl={previewUrl}
          selectedFile={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Stage 3: Upload - User can upload or remove the image */}
      {stage === 'upload' && previewUrl && (
        <UploadStage
          previewUrl={previewUrl}
          selectedFile={croppedFile || selectedFile}
          onUpload={handleUpload}
          onRemove={handleRemoveImage}
        />
      )}

      {/* Stage 4: Uploading - Everything disabled, waiting for upload */}
      {stage === 'uploading' && previewUrl && (
        <UploadingStage
          previewUrl={previewUrl}
          selectedFile={croppedFile || selectedFile}
          uploadProgress={uploadProgress}
          uploadResult={uploadResult}
        />
      )}

      {/* Stage 5: Uploaded - Show success, user can delete or upload new */}
      {stage === 'uploaded' && previewUrl && (
        <UploadedStage
          previewUrl={previewUrl}
          selectedFile={croppedFile || selectedFile}
          uploadResult={uploadResult}
          onDelete={handleDeleteUploaded}
          onUploadNew={handleUploadNew}
        />
      )}
    </div>
  )
}

// Main component that provides context
export const StaticImageUpload: FC = () => {
  return (
    <ImageUploadProvider>
      <ImageUploadContent />
    </ImageUploadProvider>
  )
}
