import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import { uploadToS3Smart, deleteFromS3 } from './s3Utils'
import { config } from './config'

// Define the 5 main stages
export type Stage = 'empty' | 'crop' | 'upload' | 'uploading' | 'uploaded'

// Upload result type
export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Context state interface
interface ImageUploadState {
  stage: Stage
  selectedFile: File | null
  previewUrl: string | null
  croppedFile: File | null
  uploadProgress: number
  uploadResult: UploadResult | null
  uploadedFileKey: string | null
  folderName: string
}

// Context actions interface
interface ImageUploadActions {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCropComplete: (croppedFile: File) => void
  handleCropCancel: () => void
  handleRemoveImage: () => void
  handleUpload: () => Promise<void>
  handleDeleteUploaded: () => Promise<void>
  handleUploadNew: () => void
}

// Combined context interface
interface ImageUploadContextType extends ImageUploadState, ImageUploadActions {}

// Create context
const ImageUploadContext = createContext<ImageUploadContextType | undefined>(
  undefined
)

// Custom hook to use the context
export const useImageUpload = () => {
  const context = useContext(ImageUploadContext)
  if (context === undefined) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider')
  }
  return context
}

// Provider component
interface ImageUploadProviderProps {
  children: ReactNode
}

export const ImageUploadProvider: React.FC<ImageUploadProviderProps> = ({
  children
}) => {
  // State
  const [stage, setStage] = useState<Stage>('empty')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null)

  // Retool state and callbacks
  const [, setImageUrl] = Retool.useStateString({
    name: 'uploadedImageUrl',
    initialValue: '',
    label: 'Uploaded Image URL',
    description: 'The URL of the uploaded image, accessible via Retool queries.'
  })

  const [folderName] = Retool.useStateString({
    name: 'folderName',
    initialValue: 'uploads',
    label: 'Folder Name',
    description: 'The folder in S3 where images will be uploaded'
  })

  const onUploadSuccess = Retool.useEventCallback({ name: 'uploadSuccess' })
  const onUploadError = Retool.useEventCallback({ name: 'uploadError' })

  // Helper function to set image URL with CDN replacement
  const handleSetImageUrl = (url?: string) => {
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

  // Action handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)

      // Create preview URL and move to crop stage
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setStage('crop')
      setCroppedFile(null)
      setUploadResult(null)
      setUploadedFileKey(null)
    } else {
      // Reset to empty stage
      setSelectedFile(null)
      setPreviewUrl(null)
      setStage('empty')
      setCroppedFile(null)
      setUploadResult(null)
      setUploadedFileKey(null)
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setCroppedFile(croppedFile)
    setStage('upload')

    // Update preview URL to show cropped image
    const croppedUrl = URL.createObjectURL(croppedFile)
    setPreviewUrl(croppedUrl)
  }

  const handleCropCancel = () => {
    setStage('upload')
    setCroppedFile(selectedFile)
    // Keep original preview URL
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setStage('empty')
    setCroppedFile(null)
    setUploadResult(null)
    setUploadedFileKey(null)
  }

  const handleUpload = async () => {
    const fileToUpload = croppedFile || selectedFile
    if (fileToUpload) {
      setStage('uploading')
      setUploadProgress(0)
      setUploadResult(null)

      try {
        // Use smart S3 upload with multipart support and progress tracking
        const result = await uploadToS3Smart(
          fileToUpload,
          config.s3,
          { folder: folderName || 'uploads', acl: 'public-read' },
          (progress) => {
            setUploadProgress(progress)
          }
        )

        setUploadResult(result)

        if (result.success) {
          handleSetImageUrl(result.url)
          setUploadedFileKey(result.key || null)
          setStage('uploaded')
          onUploadSuccess()
        } else {
          handleSetImageUrl()
          setUploadedFileKey(null)
          setStage('upload') // Go back to upload stage on error
          onUploadError()
        }
      } catch (error) {
        console.error('Upload failed:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'
        setUploadResult({ success: false, error: errorMessage })
        handleSetImageUrl()
        setUploadedFileKey(null)
        setStage('upload') // Go back to upload stage on error
        onUploadError()
      }
    }
  }

  const handleDeleteUploaded = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this image? This action cannot be undone.'
    )

    if (!confirmed) {
      return // User cancelled, don't proceed with deletion
    }

    // If we have an uploaded file key, delete it from S3
    if (uploadedFileKey) {
      try {
        const deleteResult = await deleteFromS3(uploadedFileKey, config.s3)
        if (!deleteResult.success) {
          console.error('Failed to delete file from S3:', deleteResult.error)
          // Continue with UI reset even if S3 delete fails
        }
      } catch (error) {
        console.error('Error deleting file from S3:', error)
        // Continue with UI reset even if S3 delete fails
      }
    }

    // Reset to empty stage
    setSelectedFile(null)
    setPreviewUrl(null)
    setStage('empty')
    setCroppedFile(null)
    setUploadResult(null)
    setUploadProgress(0)
    setUploadedFileKey(null)
    handleSetImageUrl('')
  }

  const handleUploadNew = () => {
    // Reset to empty stage for new upload
    setSelectedFile(null)
    setPreviewUrl(null)
    setStage('empty')
    setCroppedFile(null)
    setUploadResult(null)
    setUploadProgress(0)
    setUploadedFileKey(null)
  }

  // Context value
  const contextValue: ImageUploadContextType = {
    // State
    stage,
    selectedFile,
    previewUrl,
    croppedFile,
    uploadProgress,
    uploadResult,
    uploadedFileKey,
    folderName,
    // Actions
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
    handleUpload,
    handleDeleteUploaded,
    handleUploadNew
  }

  return (
    <ImageUploadContext.Provider value={contextValue}>
      {children}
    </ImageUploadContext.Provider>
  )
}
