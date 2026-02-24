import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import { uploadToGCS } from './services/gcp.service'

export type Stage = 'empty' | 'crop' | 'upload' | 'uploading' | 'uploaded'

export interface MultiUploadResult {
  success: boolean
  url?: string
  error?: string
}

interface MultiImageUploadState {
  stage: Stage
  selectedFiles: File[]
  preparedFiles: File[]
  previewUrls: string[]
  uploadProgress: number
  uploadResult: MultiUploadResult | null
  uploadedUrls: string[]
  folderName: string
  enableCrop: boolean
}

interface MultiImageUploadActions {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCropComplete: (croppedFile: File) => void
  handleCropCancel: () => void
  handleRemoveImage: () => void
  handleUpload: () => Promise<void>
  handleDeleteUploaded: () => Promise<void>
  handleUploadNew: () => void
}

interface MultiImageUploadContextType
  extends MultiImageUploadState,
    MultiImageUploadActions {}

const MultiImageUploadContext = createContext<
  MultiImageUploadContextType | undefined
>(undefined)

export const useMultiImageUpload = () => {
  const context = useContext(MultiImageUploadContext)
  if (context === undefined) {
    throw new Error(
      'useMultiImageUpload must be used within a MultiImageUploadProvider'
    )
  }
  return context
}

interface MultiImageUploadProviderProps {
  children: ReactNode
}

export const MultiImageUploadProvider: React.FC<
  MultiImageUploadProviderProps
> = ({ children }) => {
  const [stage, setStage] = useState<Stage>('empty')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [preparedFiles, setPreparedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<MultiUploadResult | null>(
    null
  )
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const [, setUploadedImageUrls] = Retool.useStateString({
    name: 'uploadedImageUrls',
    initialValue: '[]',
    label: 'Uploaded Image URLs',
    description:
      'JSON array of uploaded image URLs, accessible via Retool queries.'
  })

  const [folderName] = Retool.useStateString({
    name: 'folderName',
    initialValue: 'uploads',
    label: 'Folder Name',
    description: 'The folder in GCS where images will be uploaded'
  })

  const [enableCrop] = Retool.useStateBoolean({
    name: 'enableCrop',
    initialValue: true,
    inspector: 'checkbox',
    label: 'Enable Crop',
    description:
      'When enabled, users can crop the image before uploading. When disabled, the crop step is skipped.'
  })

  const onUploadSuccess = Retool.useEventCallback({ name: 'uploadSuccess' })
  const onUploadError = Retool.useEventCallback({ name: 'uploadError' })

  const setUploadedUrlsModel = (urls: string[]) => {
    setUploadedImageUrls(JSON.stringify(urls))
  }

  const resetState = () => {
    setSelectedFiles([])
    setPreparedFiles([])
    setPreviewUrls([])
    setStage('empty')
    setUploadResult(null)
    setUploadProgress(0)
    setUploadedUrls([])
    setUploadedUrlsModel([])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      resetState()
      return
    }

    setSelectedFiles(imageFiles)
    setPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)))
    setUploadResult(null)
    setUploadProgress(0)
    setUploadedUrls([])

    if (imageFiles.length === 1 && enableCrop) {
      setPreparedFiles([])
      setStage('crop')
      return
    }

    setPreparedFiles(imageFiles)
    setStage('upload')
  }

  const handleCropComplete = (croppedFile: File) => {
    setPreparedFiles([croppedFile])
    setPreviewUrls([URL.createObjectURL(croppedFile)])
    setStage('upload')
  }

  const handleCropCancel = () => {
    if (selectedFiles.length === 0) {
      resetState()
      return
    }

    setPreparedFiles([...selectedFiles])
    setStage('upload')
  }

  const handleRemoveImage = () => {
    resetState()
  }

  const handleUpload = async () => {
    const filesToUpload = preparedFiles.length > 0 ? preparedFiles : selectedFiles

    if (filesToUpload.length === 0) {
      return
    }

    setStage('uploading')
    setUploadProgress(0)
    setUploadResult(null)

    const successfulUrls: string[] = []
    const failedFiles: string[] = []

    for (const [index, file] of filesToUpload.entries()) {
      try {
        const result = await uploadToGCS({
          fileName: file.name,
          folderName: folderName || 'uploads',
          image: file,
          contentType: file.type
        })
        successfulUrls.push(result)
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error)
        failedFiles.push(file.name)
      }

      setUploadProgress(Math.round(((index + 1) / filesToUpload.length) * 100))
    }

    setUploadedUrls(successfulUrls)
    setUploadedUrlsModel(successfulUrls)

    const totalCount = filesToUpload.length
    const successCount = successfulUrls.length
    const failedCount = failedFiles.length

    if (failedCount === 0) {
      setUploadResult({ success: true, url: successfulUrls[0] })
      setStage('uploaded')
      onUploadSuccess()
      return
    }

    if (successCount === 0) {
      setUploadResult({
        success: false,
        error: `Failed to upload ${failedCount} of ${totalCount} images.`
      })
      setStage('upload')
      onUploadError()
      return
    }

    setUploadResult({
      success: false,
      error: `Uploaded ${successCount} of ${totalCount} images. ${failedCount} failed.`
    })
    setStage('uploaded')
    onUploadError()
  }

  const handleDeleteUploaded = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear these uploaded images?'
    )
    if (!confirmed) {
      return
    }

    resetState()
  }

  const handleUploadNew = () => {
    resetState()
  }

  const contextValue: MultiImageUploadContextType = {
    stage,
    selectedFiles,
    preparedFiles,
    previewUrls,
    uploadProgress,
    uploadResult,
    uploadedUrls,
    folderName,
    enableCrop,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
    handleUpload,
    handleDeleteUploaded,
    handleUploadNew
  }

  return (
    <MultiImageUploadContext.Provider value={contextValue}>
      {children}
    </MultiImageUploadContext.Provider>
  )
}
