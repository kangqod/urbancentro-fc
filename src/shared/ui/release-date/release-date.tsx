import { Typography } from 'antd'

import './release-date.scss'

// build.json과 동일 소스(__APP_BUILD_TIME__)의 날짜부. 주입 안 되는 환경(테스트 등)에선 렌더하지 않는다.
const BUILD_TIME = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : ''

export function ReleaseDate() {
  if (!BUILD_TIME) return null

  // ISO 앞 10자(UTC 날짜부)를 그대로 쓰면 UTC 저녁 빌드가 KST 사용자에게 하루 밀린다.
  // Date로 파싱해 뷰어 로컬 날짜로 표기한다.
  const date = new Date(BUILD_TIME)
  if (Number.isNaN(date.getTime())) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return (
    <>
      <br />
      <Typography.Text type="secondary" className="release-date-text">
        최근 업데이트 : {`${year}년 ${month}월 ${day}일`}
      </Typography.Text>
    </>
  )
}
