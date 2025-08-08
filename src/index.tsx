import React, { useState, type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

import { uploadToS3Smart } from './s3Utils'
import { FileInput } from './components/FileInput'
import { ImagePreview } from './components/ImagePreview'
import { UploadProgress } from './components/UploadProgress'
import { UploadResult } from './components/UploadResult'
import { UploadButton } from './components/UploadButton'
import { config } from './config'

export const StaticImageUpload: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)

  // Expose uploadedImageUrl to Retool via useStateString
  const [, setImageUrl] = Retool.useStateString({
    name: 'uploadedImageUrl',
    initialValue: ''
  })

  const onUploadSuccess = Retool.useEventCallback({ name: 'uploadSuccess' })
  const onUploadError = Retool.useEventCallback({ name: 'uploadError' })

  const handleSetImageUrl = (url?: string) => {
    // ex url: https://ablo-ai-tool-assets.s3.eu-central-1.amazonaws.com/uploads/cartoon-pet-style-referance_1754656294939_ysl89nj7yg8.jpg
    // So normal base url is https://{config.s3.bucketName}.s3.{config.s3.region}.amazonaws.com/{key}
    // If using Bunny CDN, replace S3 URL with CDN URL
    // e.g. https://cdn.ablo.ai/uploads/cartoon-pet-style-referance_1754656294939_ysl89nj7yg8.jpg

    if (!url) {
      setImageUrl('')
      return
    }
    const urlWithCdn = url.replace(
      `https://${config.s3.bucketName}.s3.${config.s3.region}.amazonaws.com`,
      config.bunnyCdn.baseUrl
    )
    setImageUrl(urlWithCdn)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true)
      setUploadProgress(0)
      setUploadResult(null)

      try {
        // Use smart S3 upload with multipart support and progress tracking
        const result = await uploadToS3Smart(
          selectedFile,
          config.s3,
          { folder: 'uploads', acl: 'public-read' },
          (progress) => {
            setUploadProgress(progress)
          }
        )

        setUploadResult(result)

        if (result.success) {
          handleSetImageUrl(result.url)
          onUploadSuccess()
        } else {
          handleSetImageUrl()
          onUploadError()
        }
      } catch (error) {
        console.error('Upload failed:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'
        setUploadResult({ success: false, error: errorMessage })
        handleSetImageUrl()
        onUploadError()
      } finally {
        setSelectedFile(null)
        setIsUploading(false)
      }
    }
  }

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
      <FileInput onChange={handleFileChange} />
      {previewUrl && (
        <ImagePreview previewUrl={previewUrl} selectedFile={selectedFile} />
      )}
      {isUploading && <UploadProgress uploadProgress={uploadProgress} />}
      <UploadResult uploadResult={uploadResult} isUploading={isUploading} />
      <UploadButton
        onClick={handleUpload}
        selectedFile={selectedFile}
        isUploading={isUploading}
      />
    </div>
  )
}
