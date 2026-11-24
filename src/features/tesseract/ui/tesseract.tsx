import { Button, Upload } from 'antd'
import { Upload as IconUpload } from 'lucide-react'
import { useTesseract } from '../lib'
import { OcrLoading } from './ocr-loading'
import { OcrReviewModal } from './ocr-review-modal'

export function Tesseract() {
  const { loading, phase, progress, contextHolder, iconSize, beforeUpload, review, reviewId, closeReview } = useTesseract()

  return (
    <>
      <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} disabled={loading}>
        <Button type="dashed" icon={<IconUpload size={iconSize} />} loading={loading}>
          선수 이미지 업로드
        </Button>
      </Upload>
      <OcrLoading visible={loading} phase={phase} progress={progress} />
      <OcrReviewModal key={reviewId} extraction={review} onClose={closeReview} />
      {contextHolder}
    </>
  )
}
