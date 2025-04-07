import { useEffect, useState } from 'react'
import { Typography } from 'antd'

export function ReleaseDate() {
  const [buildDate, setBuildDate] = useState<string | null>(null)

  useEffect(() => {
    fetch('/build-meta.json')
      .then((res) => res.json())
      .then((data) => {
        const dateOnly = data.date?.slice(0, 10)
        setBuildDate(dateOnly)
      })
      // .catch(() => setBuildDate(null)) // 파일 없으면 표시 X
      .catch(() => setBuildDate('2020-01-01'))
  }, [])

  if (!buildDate) return null

  return (
    <>
      <br />
      <Typography.Text type="secondary" className="release-date-text">
        최근 업데이트 : {buildDate}
      </Typography.Text>
    </>
  )
}
