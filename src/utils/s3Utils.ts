// S3 Upload Utilities for Retool Custom Component
import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'

export interface S3UploadConfig {
  bucketName: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string
}

export interface S3UploadOptions {
  fileName?: string
  contentType?: string
  folder?: string
  acl?: 'private' | 'public-read' | 'public-read-write'
  metadata?: Record<string, string>
}

export interface S3UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

/**
 * Generate a unique filename with timestamp and random string
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.')

  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`
}

/**
 * Get the MIME type of a file
 */
export const getContentType = (file: File): string => {
  return file.type || 'application/octet-stream'
}

/**
 * Validate if the file is an image
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  // Check for valid image extensions
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  if (!fileExtension || !validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Please select a valid image file (jpg, jpeg, png, gif, webp, svg)'
    }
  }

  return { valid: true }
}

/**
 * Upload file to S3 using AWS SDK v3
 * Note: This requires AWS SDK v3 to be installed: npm install @aws-sdk/client-s3
 */
export const uploadToS3 = async (
  file: File,
  config: S3UploadConfig,
  options: S3UploadOptions = {}
): Promise<S3UploadResult> => {
  try {
    // Validate the file first
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Create S3 client
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        ...(config.sessionToken && { sessionToken: config.sessionToken })
      }
    })

    const fileName = options.fileName || generateUniqueFileName(file.name)
    const key = options.folder ? `${options.folder}/${fileName}` : fileName

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer()

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: new Uint8Array(fileBuffer),
      ContentType: options.contentType || getContentType(file),
      ACL: options.acl || 'private',
      Metadata: options.metadata
    })

    await s3Client.send(command)

    const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`

    return {
      success: true,
      url,
      key
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Upload large files using multipart upload
 * Recommended for files larger than 100MB
 */
export const uploadToS3Multipart = async (
  file: File,
  config: S3UploadConfig,
  options: S3UploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<S3UploadResult> => {
  let uploadId: string | undefined

  try {
    // Validate the file first
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Create S3 client
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        ...(config.sessionToken && { sessionToken: config.sessionToken })
      }
    })

    const fileName = options.fileName || generateUniqueFileName(file.name)
    const key = options.folder ? `${options.folder}/${fileName}` : fileName

    // Start multipart upload
    const createMultipartCommand = new CreateMultipartUploadCommand({
      Bucket: config.bucketName,
      Key: key,
      ContentType: options.contentType || getContentType(file),
      ACL: options.acl || 'private',
      Metadata: options.metadata
    })

    const multipartResponse = await s3Client.send(createMultipartCommand)
    uploadId = multipartResponse.UploadId

    if (!uploadId) {
      throw new Error('Failed to create multipart upload')
    }

    // Split file into chunks (5MB minimum for S3)
    const chunkSize = 5 * 1024 * 1024 // 5MB
    const chunks = Math.ceil(file.size / chunkSize)
    const uploadPromises: Promise<{
      ETag: string | undefined
      PartNumber: number
    }>[] = []
    const completedParts: { ETag: string | undefined; PartNumber: number }[] =
      []

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      const partNumber = i + 1

      const uploadPartPromise = (async () => {
        const chunkBuffer = await chunk.arrayBuffer()
        const uploadPartCommand = new UploadPartCommand({
          Bucket: config.bucketName,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: new Uint8Array(chunkBuffer)
        })

        const partResult = await s3Client.send(uploadPartCommand)

        if (onProgress) {
          onProgress((partNumber / chunks) * 100)
        }

        return {
          ETag: partResult.ETag,
          PartNumber: partNumber
        }
      })()

      uploadPromises.push(uploadPartPromise)
    }

    // Wait for all parts to upload
    const parts = await Promise.all(uploadPromises)
    completedParts.push(...parts.sort((a, b) => a.PartNumber - b.PartNumber))

    // Complete multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: config.bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: completedParts
      }
    })

    await s3Client.send(completeCommand)

    const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`

    return {
      success: true,
      url,
      key
    }
  } catch (error) {
    // Abort multipart upload on error
    if (uploadId) {
      try {
        const s3Client = new S3Client({
          region: config.region,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            ...(config.sessionToken && { sessionToken: config.sessionToken })
          }
        })

        const fileName = options.fileName || generateUniqueFileName(file.name)
        const key = options.folder ? `${options.folder}/${fileName}` : fileName

        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: config.bucketName,
          Key: key,
          UploadId: uploadId
        })

        await s3Client.send(abortCommand)
      } catch (abortError) {
        console.error('Failed to abort multipart upload:', abortError)
      }
    }

    console.error('S3 multipart upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Multipart upload failed'
    }
  }
}

/**
 * Smart upload function that chooses between regular and multipart upload
 * based on file size
 */
export const uploadToS3Smart = async (
  file: File,
  config: S3UploadConfig,
  options: S3UploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<S3UploadResult> => {
  // Use multipart upload for files larger than 100MB
  const multipartThreshold = 100 * 1024 * 1024 // 100MB

  if (file.size > multipartThreshold) {
    return uploadToS3Multipart(file, config, options, onProgress)
  } else {
    const result = await uploadToS3(file, config, options)
    if (onProgress && result.success) {
      onProgress(100)
    }
    return result
  }
}

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Delete file from S3 using the file key
 */
export const deleteFromS3 = async (
  key: string,
  config: S3UploadConfig
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create S3 client
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        ...(config.sessionToken && { sessionToken: config.sessionToken })
      }
    })

    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key
    })

    await s3Client.send(command)

    return {
      success: true
    }
  } catch (error) {
    console.error('S3 delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}
