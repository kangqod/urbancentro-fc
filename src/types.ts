export interface KakaoWindow extends Window {
  Kakao: any
}

export interface Player {
  id: string
  name: string
  year: string
  number?: number
}

export interface Team {
  id: string
  name: string
  players: Player[]
}
