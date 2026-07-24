// 이 번들의 빌드 시각(vite define으로 주입). define 미적용 환경(일부 테스트) 대비 typeof 가드.
const CURRENT_BUILD_TIME = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : ''

// BASE_URL은 vite base 설정에 따라 트레일링 슬래시가 있을 수도(`/x/`) 없을 수도(`/x`) 있어, 슬래시를 강제해 결합한다.
export function buildManifestUrl(base: string): string {
  return `${base.replace(/\/$/, '')}/build.json`
}

const BUILD_JSON_URL = buildManifestUrl(import.meta.env.BASE_URL)

let notifiedBuildTime: string | null = null

// 모듈 전역이라 테스트 간 상태가 샌다 — 테스트 beforeEach에서 초기화용.
export function resetBuildVersionState(): void {
  notifiedBuildTime = null
}

export async function fetchBuildTime(): Promise<string | null> {
  try {
    const res = await fetch(`${BUILD_JSON_URL}?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null

    const data: unknown = await res.json()
    if (data && typeof data === 'object' && 'buildTime' in data) {
      const value = (data as { buildTime: unknown }).buildTime
      return typeof value === 'string' ? value : null
    }
    return null
  } catch {
    return null
  }
}

// ISO 문자열은 사전순 비교가 시간순과 일치한다. 롤백·CDN 전파 지연으로 서버가 옛 build.json을
// 잠깐 서빙해도 강제 리로드 루프에 빠지지 않도록, 서버가 '엄격히 더 최신'일 때만 알린다.
export function decideUpdate(latest: string | null, current: string, notified: string | null): 'notify' | 'ignore' {
  if (!latest) return 'ignore'
  if (!current) return 'ignore'
  if (latest <= current) return 'ignore'
  if (latest === notified) return 'ignore'
  return 'notify'
}

interface RunBuildVersionCheckOptions {
  onUpdate: (buildTime: string) => void
  current?: string
  fetchLatest?: () => Promise<string | null>
}

export async function runBuildVersionCheck({
  onUpdate,
  current = CURRENT_BUILD_TIME,
  fetchLatest = fetchBuildTime
}: RunBuildVersionCheckOptions): Promise<void> {
  const latest = await fetchLatest()
  if (latest && decideUpdate(latest, current, notifiedBuildTime) === 'notify') {
    notifiedBuildTime = latest
    onUpdate(latest)
  }
}
