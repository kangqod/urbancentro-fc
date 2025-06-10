import { Button, Spin, Upload } from 'antd'
import { Upload as IconUpload } from 'lucide-react'
import { useTesseract } from '../lib'

import './tesseract.scss'

export function Tesseract() {
  const { loading, contextHolder, iconSize, beforeUpload } = useTesseract()

  return (
    <>
      <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} disabled={loading}>
        <Button type="dashed" icon={<IconUpload size={iconSize} />} loading={loading}>
          선수 이미지 업로드
        </Button>
      </Upload>
      <Spin fullscreen spinning={loading} tip="텍스트 추출중입니다. 잠시만 기다려주세요." className="upload-spin" />
      {contextHolder}
    </>
  )
}
