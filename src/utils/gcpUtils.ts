import { config } from '../config'
import { Ablo } from '@space-runners/ablo-ts-sdk'

export type GCSUploadConfig = {
  apiKey: string
  baseUrl: string
}

export const ablo = () => {
  return new Ablo(config.gcs.apiKey, {
    baseUrl: config.gcs.baseUrl
  })
}

export const uploadToGCS = async (
  file: File
): Promise<{
  success: boolean
  url?: string
  key?: string
  error?: string
}> => {
  try {
    const signedUrl = await ablo().storage.getSignedUrl(file.type)
    const upload = await ablo().storage.upload(signedUrl, file, file.type)
    return { success: true, url: upload }
  } catch (error) {
    console.error('Static image upload error:', error)
    return {
      success: false,
      error: (error as Error).message
    }
  }
}
