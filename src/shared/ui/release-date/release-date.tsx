import { Typography } from 'antd'
import { formatDateToYYYYMMDD } from '../../lib'

import './release-date.scss'

const TODAY = formatDateToYYYYMMDD(new Date())

export function ReleaseDate() {
  return (
    <>
      <br />
      <Typography.Text type="secondary" className="release-date-text">
        최근 업데이트 : {import.meta.env.VITE_BUILD_DATE || TODAY}
      </Typography.Text>
    </>
  )
}
