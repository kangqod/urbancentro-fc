# tesseract/ui

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File                    | Description                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tesseract.tsx`         | `Tesseract()` — antd `Upload`(`accept="image/*"`, `showUploadList={false}`, `beforeUpload`, 로딩 중 disabled) + 대시 버튼 "선수 이미지 업로드" + `<OcrLoading/>` + `<OcrReviewModal key={reviewId}/>` + contextHolder                                                                           |
| `ocr-review-modal.tsx`  | `OcrReviewModal({ extraction, onClose })` — 반영 후 알림 전용. "반영된 선수 (N명)"(생년 뒤 2자리 회색 + 이름, prefix 매칭엔 `OCR: 원문`) + 아래 "미인식" 목록, 빈 섹션 숨김, footer는 '확인' 하나. 닫힘 애니메이션 중 내용 유지를 위해 첫 extraction을 `useState`로 고정(부모 `key`로 리마운트) |
| `ocr-review-modal.scss` | `.ocr-review-modal` 섹션·목록 레이아웃, 원문 보조 텍스트                                                                                                                                                                                                                                        |

## Subdirectories

| Directory      | Purpose                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| `ocr-loading/` | 전체화면 진행 오버레이 (see `ocr-loading/AGENTS.md`)                                 |
| `__tests__/`   | `ocr-review-modal.test.tsx` — 반영 목록·원문 표시·미인식·확인 단일 버튼·빈 섹션 숨김 |

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
