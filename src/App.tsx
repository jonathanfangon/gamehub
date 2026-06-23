import { Routes, Route } from 'react-router-dom'
import { Hub } from './pages/Hub'
import { Stats } from './pages/Stats'
import { Auth } from './pages/Auth'
import { WordGuessGame } from './games/wordguess/WordGuessGame'
import { GroupsGame } from './games/groups/GroupsGame'
import { NbaGroupsGame } from './games/nbagroups/NbaGroupsGame'
import { MathCrossGame } from './games/mathcrossword/MathCrossGame'
import { NbaTriviaGame } from './games/nbatrivia/NbaTriviaGame'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/word-guess" element={<WordGuessGame />} />
      <Route path="/groups" element={<GroupsGame />} />
      <Route path="/nba-groups" element={<NbaGroupsGame />} />
      <Route path="/math-crossword" element={<MathCrossGame />} />
      <Route path="/nba-trivia" element={<NbaTriviaGame />} />
    </Routes>
  )
}
