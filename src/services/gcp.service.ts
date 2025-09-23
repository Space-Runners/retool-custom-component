import axios from 'axios'
import { config } from '../config'

export type GCSUploadConfig = {
  secret: string
  baseUrl: string
}

type GCSUploadInput = {
  fileName: string
  folderName: string
  image: File | ArrayBuffer | string
  contentType: string
}

export async function uploadToGCS({
  fileName,
  folderName,
  image,
  contentType
}: GCSUploadInput): Promise<string> {
  const { baseUrl, secret } = config.gcs
  const plainFilename = fileName.split('.')[0]
  const signedUrlResponse = await axios.post(
    `${baseUrl}/storage/upload/static`,
    { contentType, fileName: plainFilename, folderName },
    { headers: { 'x-retool-secret': secret } }
  )
  const url = signedUrlResponse.data.url

  await axios.put(url, image, { headers: { 'Content-Type': contentType } })
  return url.split('?')[0]
}
