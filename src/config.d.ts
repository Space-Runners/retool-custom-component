import { S3UploadConfig } from './utils/s3Utils'
import { GCSUploadConfig } from './utils/gcpUtils'

export type Config = {
  s3: S3UploadConfig
  gcs: GCSUploadConfig
  bunnyCdn: {
    baseUrl: string
  }
}
