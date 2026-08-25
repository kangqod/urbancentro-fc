const toParts = (date: Date) => ({
  year: date.getFullYear(),
  month: String(date.getMonth() + 1).padStart(2, '0'),
  day: String(date.getDate()).padStart(2, '0')
})

export function formatDateToYYYYMMDD(date: Date): string {
  const { year, month, day } = toParts(date)
  return `${year}-${month}-${day}`
}

export function formatDateToKorean(date: Date): string {
  const { year, month, day } = toParts(date)
  return `${year}년 ${month}월 ${day}일`
}
