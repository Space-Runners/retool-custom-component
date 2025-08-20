import React, { type FC } from 'react'

import { ImageUploadProvider, useImageUpload } from './ImageUploadContext'
import { EmptyStage } from './stages/EmptyStage'
import { CropStage } from './stages/CropStage'
import { UploadStage } from './stages/UploadStage'
import { UploadingStage } from './stages/UploadingStage'
import { UploadedStage } from './stages/UploadedStage'

// Inner component that uses the context
const ImageUploadContent: FC = () => {
  const { stage } = useImageUpload()

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
      {stage === 'empty' && <EmptyStage />}

      {/* Stage 2: Crop - User can crop the selected image */}
      {stage === 'crop' && <CropStage />}

      {/* Stage 3: Upload - User can upload or remove the image */}
      {stage === 'upload' && <UploadStage />}

      {/* Stage 4: Uploading - Everything disabled, waiting for upload */}
      {stage === 'uploading' && <UploadingStage />}

      {/* Stage 5: Uploaded - Show success, user can delete or upload new */}
      {stage === 'uploaded' && <UploadedStage />}
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
