import { Button, Upload } from 'antd'
import { Upload as IconUpload } from 'lucide-react'
import { useTesseract } from '../lib'
import { OcrLoading } from './ocr-loading'

export function Tesseract() {
  const { loading, phase, progress, contextHolder, iconSize, beforeUpload } = useTesseract()

  return (
    <>
      <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} disabled={loading}>
        <Button type="dashed" icon={<IconUpload size={iconSize} />} loading={loading}>
          선수 이미지 업로드
        </Button>
      </Upload>
      <OcrLoading visible={loading} phase={phase} progress={progress} />
      {contextHolder}
    </>
  )
}
