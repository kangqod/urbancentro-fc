const URBANCENTRO_KEY = '90a1fb63e15ccfb9ec0fece0d1fb8deb78be2df610d4e3ae4d59ca1c2d30e510'

async function hashPassword(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const KEY_PASSWORD = 'urbancentro-fc'

export async function checkUrbanFCPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === URBANCENTRO_KEY
}
