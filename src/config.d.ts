import { S3UploadConfig } from './services/s3.service'
import { GCSUploadConfig } from './services/gcp.service'

export type Config = {
  s3: S3UploadConfig
  gcs: GCSUploadConfig
  bunnyCdn: {
    baseUrl: string
  }
}
