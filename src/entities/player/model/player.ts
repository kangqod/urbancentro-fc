import type { Player, ConditionType, PositionType } from './types'

const DEFAULT_YEAR = '2099'
const DEFAULT_NUMBER = 99
const DEFAULT_POSITION = 'midfielder'
const DEFAULT_CONDITION = 'mid'

export class PlayerClass implements Player {
  id: string
  name: string
  year: string
  position: PositionType
  condition: ConditionType
  number: number
  isGuest: boolean
  isAvailable: boolean

  constructor(data: Partial<Player>) {
    this.id = `${data.year}-${data.name}-${data.number}`
    this.name = data.name || ''
    this.year = data.year || DEFAULT_YEAR
    this.number = data.number || DEFAULT_NUMBER
    this.position = data.position || DEFAULT_POSITION
    this.condition = data.condition || DEFAULT_CONDITION
    this.isGuest = data.isGuest || false
    this.isAvailable = data.year !== DEFAULT_YEAR
  }

  static createFromData(data: Partial<Player>): PlayerClass {
    return new PlayerClass(data)
  }

  toggleSelection(): void {
    this.isAvailable = !this.isAvailable
  }

  updateCondition(condition: ConditionType): void {
    this.condition = condition
  }
}
