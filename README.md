# Urbancentro FC ⚽

검단 어반센트로 풋살 팀 나누기 웹 애플리케이션

> 선수 실력 티어 기반의 밸런스 팀 분배, OCR 명단 인식, 카카오톡 공유까지 지원하는 풋살 전용 팀 빌더

🔗 **https://kangqod.github.io/urbancentro-fc**

---

## 주요 기능

### 팀 구성 설정
- 다양한 매치 포맷 지원: 5v5, 6v6, 7v7 (2팀 ~ 4팀)
- 총 7가지 매치 포맷 제공

### 선수 선택
- 등록된 멤버 목록에서 출전 선수 선택
- 게스트 선수 추가 및 연결 선수 지정
- 선수별 상세 정보 확인 (티어, 속성 등)

### 팀 밸런싱 알고리즘
- 4단계 티어 시스템: ACE(4) > Advanced(3) > Intermediate(2) > Beginner(1)
- 티어별 가중치 기반 팀 전력 균등 분배
- ACE 부재 팀 보정, 비기너 과다 팀 보정
- 특정 선수 쌍 동일 팀 배정 제외 규칙
- 게스트 선수 연결 기반 배치 최적화
- 컨디션(폼) 랜덤 부여

### OCR 명단 인식
- Tesseract.js 기반 이미지 → 텍스트 변환
- 캡처 이미지에서 출전 선수를 자동 인식

### 공유
- 카카오톡 공유: 팀 분배 결과를 카카오톡 메시지로 전송
- URL 공유: 쿼리 파라미터로 팀 결과를 인코딩하여 링크 공유

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Language** | TypeScript |
| **UI** | React 19, Ant Design 5 |
| **Bundler** | Vite 7 |
| **State** | Zustand + Immer |
| **Style** | SCSS |
| **OCR** | Tesseract.js |
| **Icon** | Lucide React |
| **Test** | Vitest + jsdom |
| **Deploy** | GitHub Pages (GitHub Actions) |

---

## 프로젝트 구조

```
src/
├── app/            # 앱 엔트리, Provider (다크모드, Ant Design)
├── pages/main/     # 메인 페이지, URL 파라미터 초기화
├── features/       # 기능 단위 모듈
│   ├── team-setup-flow/  # 팀 구성 3단계 플로우 (포맷 → 선수 → 분배)
│   ├── player-modal/     # 선수 상세 모달
│   ├── tesseract/        # OCR 명단 인식
│   ├── theme/            # 다크모드 토글
│   └── kakao-loader/     # 카카오 SDK 초기화
├── widgets/        # 헤더, 선수 상세 모달
├── entities/       # 도메인 모델
│   ├── player/     # 선수 모델, 스토어
│   ├── team/       # 팀 모델, 밸런싱 알고리즘, 카카오 공유
│   └── theme/      # 테마 스토어
└── shared/         # 공통 UI, 유틸, 에셋 (선수 데이터 JSON)
```

---

## 시작하기

### 사전 요구사항

- **Node.js** 24+ ([mise](https://mise.jdx.dev/) 사용 시 자동 적용)
- **pnpm**

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | TypeScript 컴파일 + 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 로컬 미리보기 |
| `pnpm lint` | ESLint 검사 |
| `pnpm test` | Vitest 테스트 실행 |
| `pnpm pages` | 빌드 후 gh-pages 브랜치로 수동 배포 |

---

## 배포

`master` 브랜치에 푸시하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.

- **워크플로**: `.github/workflows/deploy.yml`
- **배포 URL**: https://kangqod.github.io/urbancentro-fc
- **CI 린트**: PR 생성 시 `.github/workflows/lint.yml`로 린트 + 타입 체크 자동 실행
