import { useEffect } from 'react'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { PRIMARY_COLOR } from '@/shared'
import { Main } from '@/pages'
import { useThemeValue } from './lib'

const fontFamily = `'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`

// 라이트모드 표면/경계 토큰
const lightSurfaceTokens = {
  colorBgLayout: '#f0f2f5',
  colorBgContainer: '#ffffff',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#e8e8e8'
}

// 다크모드 표면/경계 토큰 — 기존 `.dark-mode` SCSS 하드코딩 값(#141414 / #2a2a2a / #444)과 동일하게 맞춰
// antd CSS 변수(--ant-color-bg-layout 등) 하나로 라이트/다크 양쪽을 커버할 수 있게 한다 (회귀 없음, 값 동일).
const darkSurfaceTokens = {
  colorBgLayout: '#141414',
  colorBgContainer: '#2a2a2a',
  colorBorder: '#444444',
  colorBorderSecondary: '#333333'
}

export function Provider() {
  const isDarkMode = useThemeValue()

  // 테마 body 클래스는 앱 루트에서 관리해 토글 버튼 마운트 여부와 무관하게 보장한다
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_COLOR,
          fontFamily,
          // 스포츠·에너지틱 라운드: 컨트롤 10 / 카드 16
          borderRadius: 10,
          borderRadiusLG: 16,
          // CTA 임팩트 + 터치 타깃 확대
          controlHeight: 40,
          controlHeightLG: 48,
          // 헤딩 타입 스케일 업
          fontSize: 15,
          fontSizeHeading3: 28,
          fontSizeHeading4: 22,
          // antd 컴포넌트 트랜지션 타이밍 통일
          motionDurationMid: '0.25s',
          motionEaseInOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
          // 라이트/다크 공용 엘리베이션 스케일 — 에너지틱 리프트
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
          boxShadowSecondary: '0 8px 24px rgba(0, 0, 0, 0.14)',
          ...(isDarkMode ? darkSurfaceTokens : lightSurfaceTokens)
        }
      }}
    >
      <AntdApp>
        <Main />
      </AntdApp>
    </ConfigProvider>
  )
}
