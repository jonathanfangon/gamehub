export type Operator = '+' | '-'

export type MathDifficulty = 'easy' | 'medium' | 'hard'

export interface MathCrossPuzzle {
  // 3x3 grid using digits 1-9, each exactly once.
  // Row equation: n[r*3] opsH[r*2] n[r*3+1] opsH[r*2+1] n[r*3+2] = rowResults[r]
  // Col equation: n[c] opsV[c*2] n[c+3] opsV[c*2+1] n[c+6] = colResults[c]
  numbers: [number, number, number, number, number, number, number, number, number]
  opsHorizontal: [Operator, Operator, Operator, Operator, Operator, Operator]
  opsVertical: [Operator, Operator, Operator, Operator, Operator, Operator]
  rowResults: [number, number, number]
  colResults: [number, number, number]
  givenEasy: number[]   // 5 cells shown
  givenMedium: number[] // 3 cells shown
  givenHard: number[]   // 1 cell shown
}

export const PUZZLES: MathCrossPuzzle[] = [
  {
    // 8+1-3=6  |  5+9-7=7  |  4-6+2=0
    // col: 8-5+4=7  1+9-6=4  3-7+2=-2
    numbers: [8, 1, 3, 5, 9, 7, 4, 6, 2],
    opsHorizontal: ['+', '-', '+', '-', '-', '+'],
    opsVertical: ['-', '+', '+', '-', '-', '+'],
    rowResults: [6, 7, 0],
    colResults: [7, 4, -2],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [0, 4, 8],
    givenHard: [4],
  },
  {
    // 9-5+2=6  |  3+7-8=2  |  6-4+1=3
    // col: 9-3+6=12  5+7-4=8  2-8+1=-5
    numbers: [9, 5, 2, 3, 7, 8, 6, 4, 1],
    opsHorizontal: ['-', '+', '+', '-', '-', '+'],
    opsVertical: ['-', '+', '+', '-', '-', '+'],
    rowResults: [6, 2, 3],
    colResults: [12, 8, -5],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [2, 4, 6],
    givenHard: [4],
  },
  {
    // 7+3-6=4  |  2-8+5=-1  |  9+1-4=6
    // col: 7-2+9=14  3+8-1=10  6-5+4=5
    numbers: [7, 3, 6, 2, 8, 5, 9, 1, 4],
    opsHorizontal: ['+', '-', '-', '+', '+', '-'],
    opsVertical: ['-', '+', '+', '-', '-', '+'],
    rowResults: [4, -1, 6],
    colResults: [14, 10, 5],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [0, 4, 8],
    givenHard: [4],
  },
  {
    // 5-2+9=12  |  1+8-3=6  |  4+6-7=3
    // col: 5+1-4=2  2-8+6=0  9+3-7=5
    numbers: [5, 2, 9, 1, 8, 3, 4, 6, 7],
    opsHorizontal: ['-', '+', '+', '-', '+', '-'],
    opsVertical: ['+', '-', '-', '+', '+', '-'],
    rowResults: [12, 6, 3],
    colResults: [2, 0, 5],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [1, 3, 8],
    givenHard: [4],
  },
  {
    // 3+8-5=6  |  9-4+1=6  |  6+2-7=1
    // col: 3-9+6=0  8+4-2=10  5-1+7=11
    numbers: [3, 8, 5, 9, 4, 1, 6, 2, 7],
    opsHorizontal: ['+', '-', '-', '+', '+', '-'],
    opsVertical: ['-', '+', '+', '-', '-', '+'],
    rowResults: [6, 6, 1],
    colResults: [0, 10, 11],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [2, 4, 6],
    givenHard: [4],
  },
  {
    // 4-9+8=3  |  7+3-6=4  |  1-5+2=-2
    // col: 4+7-1=10  9-3+5=11  8+6-2=12
    numbers: [4, 9, 8, 7, 3, 6, 1, 5, 2],
    opsHorizontal: ['-', '+', '+', '-', '-', '+'],
    opsVertical: ['+', '-', '-', '+', '+', '-'],
    rowResults: [3, 4, -2],
    colResults: [10, 11, 12],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [0, 5, 7],
    givenHard: [4],
  },
  {
    // 6+5-4=7  |  2-1+9=10  |  8+3-7=4
    // col: 6-2+8=12  5+1-3=3  4-9+7=2
    numbers: [6, 5, 4, 2, 1, 9, 8, 3, 7],
    opsHorizontal: ['+', '-', '-', '+', '+', '-'],
    opsVertical: ['-', '+', '+', '-', '-', '+'],
    rowResults: [7, 10, 4],
    colResults: [12, 3, 2],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [1, 3, 8],
    givenHard: [4],
  },
  {
    // 2+7-4=5  |  6-9+3=0  |  8+5-1=12
    // col: 2-6+8=4  7+9-5=11  4+3-1=6
    numbers: [2, 7, 4, 6, 9, 3, 8, 5, 1],
    opsHorizontal: ['+', '-', '-', '+', '+', '-'],
    opsVertical: ['-', '+', '+', '-', '+', '-'],
    rowResults: [5, 0, 12],
    colResults: [4, 11, 6],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [0, 4, 8],
    givenHard: [4],
  },
  {
    // 1+4-8=-3  |  5-3+6=8  |  9+7-2=14
    // col: 1+5-9=-3  4-3+7=8  8+6-2=12
    numbers: [1, 4, 8, 5, 3, 6, 9, 7, 2],
    opsHorizontal: ['+', '-', '-', '+', '+', '-'],
    opsVertical: ['+', '-', '-', '+', '+', '-'],
    rowResults: [-3, 8, 14],
    colResults: [-3, 8, 12],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [2, 4, 6],
    givenHard: [4],
  },
  {
    // 9-6+5=8  |  3+2-1=4  |  7-8+4=3
    // col: 9+3-7=5  6-2+8=12  5+1-4=2
    numbers: [9, 6, 5, 3, 2, 1, 7, 8, 4],
    opsHorizontal: ['-', '+', '+', '-', '-', '+'],
    opsVertical: ['+', '-', '-', '+', '+', '-'],
    rowResults: [8, 4, 3],
    colResults: [5, 12, 2],
    givenEasy: [0, 2, 4, 6, 8],
    givenMedium: [1, 4, 7],
    givenHard: [4],
  },
]
