import React from 'react'
import { FileInput } from '../components/FileInput'

interface EmptyStageProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const EmptyStage: React.FC<EmptyStageProps> = ({ onFileChange }) => {
  return <FileInput onChange={onFileChange} />
}
