import { Typography } from 'antd'

const RELEASE_DATE = '2025-04-07'

export function ReleaseDate() {
  return (
    <>
      <br />
      <Typography.Text type="secondary" className="release-date-text">
        최근 업데이트 : {import.meta.env.VITE_BUILD_DATE || RELEASE_DATE}
      </Typography.Text>
    </>
  )
}
