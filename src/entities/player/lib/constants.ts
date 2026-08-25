// Google Sheets "웹에 게시 → CSV" URL. 게시 URL은 공개값(브라우저 네트워크 탭에 그대로 노출)이라 코드 상수로 둔다.
// "웹에 게시"된 명단 탭만 공개되는 주소(다른 탭은 401). 구글 게시 캐시 max-age=300이라 수정 반영은 최대 5분. 빈 문자열이면 fetch 없이 캐시/error 경로.
export const ROSTER_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrFjhz3PaIcWss7Ka3i_eP2RS_RdZK34LyqPSEU-AqGG7cA7_nSAH0faVl-5L68YlMdR1uZ4wSXz-W/pub?gid=2042895997&single=true&output=csv'

export const ROSTER_FETCH_TIMEOUT_MS = 5000
