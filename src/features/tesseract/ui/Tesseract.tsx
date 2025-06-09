import { Button, Upload } from 'antd'
import { Upload as IconUpload } from 'lucide-react'
import { useTesseract } from '../lib'

export function Tesseract() {
  const { loading, contextHolder, iconSize, beforeUpload } = useTesseract()

  return (
    <>
      <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} disabled={loading}>
        <Button type="dashed" icon={<IconUpload size={iconSize} />} loading={loading}>
          선수 이미지 업로드
        </Button>
      </Upload>
      {contextHolder}
    </>
  )
}
