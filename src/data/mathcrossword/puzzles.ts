export type MathDifficulty = 'easy' | 'medium' | 'hard'

export type CellContent = number | string | null

export interface MathCrossPuzzle {
  id: number
  grid: CellContent[][]
  blanks: Record<MathDifficulty, [number, number][]>
}

// Small puzzles (5×5, 4-5 equations) — used for Easy difficulty
const SMALL_PUZZLES: MathCrossPuzzle[] = [
  {
    // 6+9=15, 3-1=2, 6×3=18, 9+1=10
    id: 1,
    grid: [
      [6,  '+', 9,  '=', 15],
      ['×', null, '+', null, null],
      [3,  '-', 1,  '=', 2],
      ['=', null, '=', null, null],
      [18, null, 10, null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2]],
      medium: [[0,0], [0,2], [2,0], [2,2]],
      hard:   [[0,0], [0,2], [2,0], [2,2], [2,4]],
    },
  },
  {
    // 7×4=28, 3+5=8, 7-3=4, 4+5=9
    id: 2,
    grid: [
      [7,  '×', 4,  '=', 28],
      ['-', null, '+', null, null],
      [3,  '+', 5,  '=', 8],
      ['=', null, '=', null, null],
      [4,  null, 9,  null, null],
    ],
    blanks: {
      easy:   [[0,2], [2,0]],
      medium: [[0,0], [0,2], [2,0], [2,2]],
      hard:   [[0,0], [0,2], [2,0], [2,2], [0,4]],
    },
  },
  {
    // 9-5=4, 6×2=12, 9+6=15, 5×2=10
    id: 3,
    grid: [
      [9,  '-', 5,  '=', 4],
      ['+', null, '×', null, null],
      [6,  '×', 2,  '=', 12],
      ['=', null, '=', null, null],
      [15, null, 10, null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2]],
      medium: [[0,0], [0,2], [2,0], [2,2]],
      hard:   [[0,0], [0,2], [2,0], [2,2], [0,4]],
    },
  },
  {
    // 4×6=24, 4-2=2, 4+4=8, 6×2=12
    id: 4,
    grid: [
      [4,  '×', 6,  '=', 24],
      ['+', null, '×', null, null],
      [4,  '-', 2,  '=', 2],
      ['=', null, '=', null, null],
      [8,  null, 12, null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2]],
      medium: [[0,0], [0,2], [2,0], [2,2]],
      hard:   [[0,0], [0,2], [2,0], [2,2], [2,4]],
    },
  },
]

// Medium puzzles (5×9, 7-8 equations) — used for Medium difficulty
const MEDIUM_PUZZLES: MathCrossPuzzle[] = [
  {
    // R0: 8+7=15, 15+5=20 | R2: 2×4=8, 8-3=5 | R4: 16-3=13
    // DC0: 8×2=16 | DC2: 7-4=3 | DC6: 5×3=15
    id: 5,
    grid: [
      [8,  '+', 7,  '=', 15, '+', 5,  '=', 20],
      ['×', null, '-', null, null, null, '×', null, null],
      [2,  '×', 4,  '=', 8,  '-', 3,  '=', 5],
      ['=', null, '=', null, null, null, '=', null, null],
      [16, '-', 3,  '=', 13, null, 15, null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,6], [0,6]],
      medium: [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,4], [2,6], [4,0], [4,2]],
    },
  },
  {
    // R0: 5×3=15, 15-6=9 | R2: 4+1=5, 5×2=10
    // DC0: 5+4=9 | DC2: 3-1=2 | DC6: 6+2=8
    id: 6,
    grid: [
      [5,  '×', 3,  '=', 15, '-', 6,  '=', 9],
      ['+', null, '-', null, null, null, '+', null, null],
      [4,  '+', 1,  '=', 5,  '×', 2,  '=', 10],
      ['=', null, '=', null, null, null, '=', null, null],
      [9,  null, 2,  null, null, null, 8,  null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2], [0,6]],
      medium: [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [2,4], [4,0]],
    },
  },
  {
    // R0: 12-4=8, 8+3=11 | R2: 3×2=6, 6-1=5
    // DC0: 12+3=15 | DC2: 4×2=8 | DC6: 3-1=2
    id: 7,
    grid: [
      [12, '-', 4,  '=', 8,  '+', 3,  '=', 11],
      ['+', null, '×', null, null, null, '-', null, null],
      [3,  '×', 2,  '=', 6,  '-', 1,  '=', 5],
      ['=', null, '=', null, null, null, '=', null, null],
      [15, null, 8,  null, null, null, 2,  null, null],
    ],
    blanks: {
      easy:   [[0,6], [2,0], [2,6]],
      medium: [[0,2], [0,6], [2,0], [2,2], [2,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [2,4]],
    },
  },
]

// Large puzzles (9×9, 12 equations) — used for Hard difficulty
const LARGE_PUZZLES: MathCrossPuzzle[] = [
  {
    // Top: 6+3=9, 9-2=7, 4-1=3, 3×3=9, DC0:6×4=24, DC2:3+1=4, DC6:2×3=6
    // R4: 24+4=28 | Bottom: 24-8=16, 4×2=8, 6+3=9 | R6: 8×2=16
    id: 8,
    grid: [
      [6,  '+', 3,  '=', 9,  '-', 2,  '=', 7],
      ['×', null, '+', null, null, null, '×', null, null],
      [4,  '-', 1,  '=', 3,  '×', 3,  '=', 9],
      ['=', null, '=', null, null, null, '=', null, null],
      [24, '+', 4,  '=', 28, null, 6,  null, null],
      ['-', null, '×', null, null, null, '+', null, null],
      [8,  '×', 2,  '=', 16, null, 3,  null, null],
      ['=', null, '=', null, null, null, '=', null, null],
      [16, null, 8,  null, null, null, 9,  null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2], [0,6], [6,6]],
      medium: [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [6,0], [6,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,4], [2,6], [4,0], [4,2], [4,6], [6,0], [6,2], [6,6], [4,4]],
    },
  },
  {
    // Top: 3×5=15, 15+4=19, 7-2=5, 5×3=15 | DC0:3+7=10, DC2:5-2=3, DC6:4×3=12
    // R4: 10×3=30 | Bottom: 10-4=6, 3+1=4, 12-8=4 | R6: 4+1=5
    id: 9,
    grid: [
      [3,  '×', 5,  '=', 15, '+', 4,  '=', 19],
      ['+', null, '-', null, null, null, '×', null, null],
      [7,  '-', 2,  '=', 5,  '×', 3,  '=', 15],
      ['=', null, '=', null, null, null, '=', null, null],
      [10, '×', 3,  '=', 30, null, 12, null, null],
      ['-', null, '+', null, null, null, '-', null, null],
      [4,  '+', 1,  '=', 5,  null, 8,  null, null],
      ['=', null, '=', null, null, null, '=', null, null],
      [6,  null, 4,  null, null, null, 4,  null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2], [0,6], [6,6]],
      medium: [[0,0], [0,2], [0,6], [2,2], [2,6], [6,0], [6,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [4,0], [4,2], [6,0], [6,2], [6,6]],
    },
  },
  {
    // Top: 5+8=13, 13-7=6, 2+3=5, 5×4=20 | DC0:5×2=10, DC2:8-3=5, DC6:7×4=28
    // R4: 10-5=5 | Bottom: 10+6=16, 5×3=15, 28+2=30 | R6: 6×3=18
    id: 10,
    grid: [
      [5,  '+', 8,  '=', 13, '-', 7,  '=', 6],
      ['×', null, '-', null, null, null, '×', null, null],
      [2,  '+', 3,  '=', 5,  '×', 4,  '=', 20],
      ['=', null, '=', null, null, null, '=', null, null],
      [10, '-', 5,  '=', 5,  null, 28, null, null],
      ['+', null, '×', null, null, null, '+', null, null],
      [6,  '×', 3,  '=', 18, null, 2,  null, null],
      ['=', null, '=', null, null, null, '=', null, null],
      [16, null, 15, null, null, null, 30, null, null],
    ],
    blanks: {
      easy:   [[0,0], [2,2], [0,6], [6,6]],
      medium: [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [6,0], [6,6]],
      hard:   [[0,0], [0,2], [0,6], [2,0], [2,2], [2,6], [4,0], [4,2], [6,0], [6,2], [6,6]],
    },
  },
]

export function getPuzzlePool(difficulty: MathDifficulty): MathCrossPuzzle[] {
  switch (difficulty) {
    case 'easy': return SMALL_PUZZLES
    case 'medium': return MEDIUM_PUZZLES
    case 'hard': return LARGE_PUZZLES
  }
}

export function isNumberCell(cell: CellContent): cell is number {
  return typeof cell === 'number'
}

export function isOperatorCell(cell: CellContent): cell is string {
  return typeof cell === 'string'
}
