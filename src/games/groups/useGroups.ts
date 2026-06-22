import { useConnectionsGame } from './useConnectionsGame'
import { PUZZLES } from '../../data/groups/puzzles'

export type { GameStatus, SolvedGroup } from './useConnectionsGame'

export function useGroups() {
  return useConnectionsGame('groups', PUZZLES, 'Groups')
}
