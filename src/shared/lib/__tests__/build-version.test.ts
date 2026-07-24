import { describe, it, expect, beforeEach } from 'vitest'
import { decideUpdate, runBuildVersionCheck, resetBuildVersionState, buildManifestUrl } from '../build-version'

beforeEach(() => {
  resetBuildVersionState()
})

describe('buildManifestUrl', () => {
  // 회귀 방지: base에 트레일링 슬래시가 없어 `/urbancentro-fcbuild.json`로 결합되던 버그.
  it('트레일링 슬래시 없는 base도 슬래시 1개로 결합', () => {
    expect(buildManifestUrl('/urbancentro-fc')).toBe('/urbancentro-fc/build.json')
  })

  it('트레일링 슬래시 있는 base도 슬래시 중복 없이 결합', () => {
    expect(buildManifestUrl('/urbancentro-fc/')).toBe('/urbancentro-fc/build.json')
  })

  it('루트 base(/)에서도 슬래시 중복 없음', () => {
    expect(buildManifestUrl('/')).toBe('/build.json')
  })
})

describe('decideUpdate', () => {
  it('latest 없으면(fetch 실패) ignore', () => {
    expect(decideUpdate(null, 'a', null)).toBe('ignore')
  })

  it('서버 버전이 현재 번들과 같으면 ignore', () => {
    expect(decideUpdate('a', 'a', null)).toBe('ignore')
  })

  it('이미 알린 버전이면 ignore', () => {
    expect(decideUpdate('b', 'a', 'b')).toBe('ignore')
  })

  it('서버가 현재 번들보다 더 최신이면 notify', () => {
    expect(decideUpdate('b', 'a', null)).toBe('notify')
  })

  // 회귀 방지: 롤백·CDN 전파 지연으로 서버가 옛 build.json을 서빙해도 강제 리로드 루프에 빠지면 안 된다.
  it('서버가 현재 번들보다 옛 버전이면 ignore(리로드 루프 방지)', () => {
    expect(decideUpdate('a', 'b', null)).toBe('ignore')
  })

  it('현재 번들 시각이 비어 있으면(주입 안 됨) ignore', () => {
    expect(decideUpdate('b', '', null)).toBe('ignore')
  })
})

describe('runBuildVersionCheck', () => {
  it('새 버전이면 onUpdate 1회 호출, 같은 버전 재검사 시 중복 알림 없음', async () => {
    const calls: string[] = []
    const options = {
      current: '2026-07-24T00:00:00Z',
      fetchLatest: async () => '2026-07-25T00:00:00Z',
      onUpdate: (buildTime: string) => calls.push(buildTime)
    }

    await runBuildVersionCheck(options)
    await runBuildVersionCheck(options)

    expect(calls).toEqual(['2026-07-25T00:00:00Z'])
  })
})
