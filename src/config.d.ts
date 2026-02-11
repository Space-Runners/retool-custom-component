import { GCSUploadConfig } from './services/gcp.service'

export type Config = {
  gcs: GCSUploadConfig
  bunnyCdn: {
    baseUrl: string
  }
}
