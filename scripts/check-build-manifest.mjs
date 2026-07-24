// 빌드 산출물 게이트: dist/build.json이 실제로 생성됐고, 그 buildTime이 번들에 주입된
// __APP_BUILD_TIME__과 일치하는지 검증한다. 둘이 어긋나면 모든 사용자가 첫 로드에 새로고침
// 모달을 맞으므로(오탐 폭탄) CI에서 배포 전에 반드시 막는다. postbuild로 pnpm build마다 실행.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const manifestPath = join(distDir, 'build.json')
const assetsDir = join(distDir, 'assets')

function fail(msg) {
  console.error(`\n❌ build.json 검증 실패: ${msg}\n`)
  process.exit(1)
}

if (!existsSync(manifestPath)) {
  fail(`dist/build.json이 없다. vite.config.ts의 buildTimeJson 플러그인이 emit했는지 확인.`)
}

let buildTime
try {
  const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'))
  buildTime = parsed.buildTime
} catch (e) {
  fail(`dist/build.json이 유효한 JSON이 아니다: ${e.message}`)
}

if (typeof buildTime !== 'string' || buildTime.length === 0) {
  fail(`buildTime이 비어있거나 문자열이 아니다: ${JSON.stringify(buildTime)}`)
}
if (Number.isNaN(Date.parse(buildTime))) {
  fail(`buildTime이 파싱 가능한 날짜 문자열이 아니다: ${buildTime}`)
}

if (!existsSync(assetsDir)) {
  fail(`dist/assets 디렉터리가 없다.`)
}

const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'))
const injected = jsFiles.some((f) => readFileSync(join(assetsDir, f), 'utf8').includes(buildTime))
if (!injected) {
  fail(
    `번들(dist/assets/*.js)에 주입된 __APP_BUILD_TIME__이 build.json의 buildTime(${buildTime})과 일치하지 않는다. ` +
      `둘이 어긋나면 배포 직후 모든 사용자에게 새로고침 모달이 뜬다. vite define과 buildTimeJson이 같은 값을 쓰는지 확인.`
  )
}

console.log(`✅ build.json 검증 통과 — buildTime=${buildTime}, 번들 주입값과 일치`)
