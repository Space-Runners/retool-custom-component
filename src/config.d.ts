import { S3UploadConfig } from './s3Utils'

export type Config = {
  s3: S3UploadConfig
  bunnyCdn: {
    baseUrl: string
  }
}
