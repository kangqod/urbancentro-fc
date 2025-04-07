import { describe, it, expect } from 'vitest'
import { balanceTeams } from './balance-teams'
import { PLAYER_POSITIONS } from '@/entities'
import playersData from '@/shared/assets/data.json'
import type { Player, MatchFormatType } from '@/entities'

// Helper function to get random players
function getRandomPlayers(count: number): Player[] {
  const shuffledPlayers = [...playersData].sort(() => Math.random() - 0.5)
  return shuffledPlayers.slice(0, count) as Player[]
}

describe('balanceTeams', () => {
  const modes: MatchFormatType[] = ['5:5', '5:5:5', '6:6', '6:6:6', '7:7', '7:7:7']

  modes.forEach((mode) => {
    it(`should distribute players correctly for mode ${mode}`, () => {
      const teamSizes = mode.split(':').map(Number)
      const totalPlayers = teamSizes.reduce((sum, size) => sum + size, 0)
      const randomPlayers = getRandomPlayers(totalPlayers)

      const teams = balanceTeams(randomPlayers, mode)

      // Check the number of teams
      expect(teams).toHaveLength(teamSizes.length)

      // Check the number of players in each team
      teams.forEach((team, index) => {
        expect(team.players).toHaveLength(teamSizes[index])
      })

      // Check that all players are assigned
      const allAssignedPlayers = teams.flatMap((team) => team.players)
      expect(allAssignedPlayers).toHaveLength(randomPlayers.length)
      expect(new Set(allAssignedPlayers.map((p) => p.id)).size).toBe(randomPlayers.length)
    })
  })

  // it('should ensure players in excludedPairs are not in the same team', () => {
  //   const excludedPairs = [['지원', '지원 2']]
  //   const randomPlayers = getRandomPlayers(10) // Use 10 random players for this test

  //   const teams = balanceTeams(randomPlayers, '5:5')

  //   excludedPairs.forEach(([player1Name, player2Name]) => {
  //     const teamWithPlayer1 = teams.find((team) => team.players.some((p) => p.name === player1Name))
  //     const teamWithPlayer2 = teams.find((team) => team.players.some((p) => p.name === player2Name))

  //     expect(teamWithPlayer1).not.toBe(teamWithPlayer2)
  //   })
  // })

  // it('should assign ace players based on defender count', () => {
  //   const randomPlayers = getRandomPlayers(12) // Use 12 random players for this test
  //   const teams = balanceTeams(randomPlayers, '6:6')

  //   const defenderCounts = teams.map((team) => team.players.filter((p) => p.position === PLAYER_POSITIONS.DEFENDER).length)
  //   const aceCounts = teams.map((team) => team.players.filter((p) => p.position === PLAYER_POSITIONS.ACE).length)

  //   // Ace players should be distributed based on defender counts
  //   expect(aceCounts[0]).toBeGreaterThanOrEqual(aceCounts[1])
  //   expect(defenderCounts[0]).toBeGreaterThanOrEqual(defenderCounts[1])
  // })
})
