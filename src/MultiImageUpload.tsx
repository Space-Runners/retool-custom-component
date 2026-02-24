import React, { type FC } from 'react'
import {
  MultiImageUploadProvider,
  useMultiImageUpload
} from './MultiImageUploadContext'
import { FileInput } from './components/FileInput'
import { CropImage } from './components/CropImage'
import { ImagePreviewList } from './components/ImagePreviewList'
import { UploadButton } from './components/UploadButton'
import { RemoveButton } from './components/RemoveButton'
import { UploadProgress } from './components/UploadProgress'
import { UploadResult } from './components/UploadResult'
import { UploadedActions } from './components/UploadedActions'

const MultiImageUploadContent: FC = () => {
  const {
    stage,
    selectedFiles,
    preparedFiles,
    previewUrls,
    uploadProgress,
    uploadResult,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
    handleUpload,
    handleUploadNew
  } = useMultiImageUpload()

  const filesForPreview = preparedFiles.length > 0 ? preparedFiles : selectedFiles
  const hasFiles = filesForPreview.length > 0

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
      {stage === 'empty' && (
        <FileInput
          onChange={handleFileChange}
          multiple={true}
          label="Choose Image File(s)"
          inputId="multi-image-input"
        />
      )}

      {stage === 'crop' && previewUrls[0] && (
        <CropImage
          previewUrl={previewUrls[0]}
          selectedFile={selectedFiles[0] || null}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {stage === 'upload' && hasFiles && (
        <>
          <ImagePreviewList
            previewUrls={previewUrls}
            selectedFiles={filesForPreview}
          />
          <UploadButton
            onClick={handleUpload}
            selectedFile={filesForPreview[0] || null}
            isUploading={false}
          />
          <RemoveButton onClick={handleRemoveImage} />
        </>
      )}

      {stage === 'uploading' && hasFiles && (
        <>
          <ImagePreviewList
            previewUrls={previewUrls}
            selectedFiles={filesForPreview}
          />
          <UploadProgress uploadProgress={uploadProgress} />
          <UploadResult uploadResult={uploadResult} isUploading={true} />
        </>
      )}

      {stage === 'uploaded' && hasFiles && (
        <>
          <ImagePreviewList
            previewUrls={previewUrls}
            selectedFiles={filesForPreview}
          />
          <UploadResult uploadResult={uploadResult} isUploading={false} />
          <UploadedActions onUploadNew={handleUploadNew} />
        </>
      )}
    </div>
  )
}

export const MultiImageUpload: FC = () => {
  return (
    <MultiImageUploadProvider>
      <MultiImageUploadContent />
    </MultiImageUploadProvider>
  )
}
