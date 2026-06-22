export type Difficulty = 'yellow' | 'green' | 'blue' | 'purple'

export interface GroupDef {
  category: string
  words: [string, string, string, string]
  difficulty: Difficulty
}

export interface GroupsPuzzle {
  groups: [GroupDef, GroupDef, GroupDef, GroupDef]
}

export const PUZZLES: GroupsPuzzle[] = [
  {
    groups: [
      { category: 'Planets', words: ['MARS', 'VENUS', 'SATURN', 'NEPTUNE'], difficulty: 'yellow' },
      { category: 'Card games', words: ['POKER', 'BRIDGE', 'SPADES', 'HEARTS'], difficulty: 'green' },
      { category: '___ bar', words: ['CANDY', 'CROW', 'HANDLE', 'GOLD'], difficulty: 'blue' },
      { category: 'Things that are pitched', words: ['TENT', 'IDEA', 'BALL', 'VOICE'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Breakfast foods', words: ['WAFFLE', 'CEREAL', 'BAGEL', 'OATMEAL'], difficulty: 'yellow' },
      { category: 'Currencies', words: ['POUND', 'FRANC', 'MARK', 'CROWN'], difficulty: 'green' },
      { category: 'Hit hard', words: ['SLUG', 'WALLOP', 'HAMMER', 'BELT'], difficulty: 'blue' },
      { category: 'Royal ___', words: ['FLUSH', 'FAMILY', 'BLUE', 'JELLY'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Dog breeds', words: ['BOXER', 'HUSKY', 'POODLE', 'BEAGLE'], difficulty: 'yellow' },
      { category: 'Music genres', words: ['JAZZ', 'BLUES', 'METAL', 'PUNK'], difficulty: 'green' },
      { category: 'Shades of red', words: ['RUBY', 'CHERRY', 'CRIMSON', 'SCARLET'], difficulty: 'blue' },
      { category: '___ fish', words: ['SWORD', 'ANGEL', 'BLOW', 'CAT'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Footwear', words: ['BOOT', 'SANDAL', 'LOAFER', 'CLOG'], difficulty: 'yellow' },
      { category: 'Things that spin', words: ['TOP', 'WHEEL', 'RECORD', 'GLOBE'], difficulty: 'green' },
      { category: 'Parts of a book', words: ['SPINE', 'COVER', 'JACKET', 'LEAF'], difficulty: 'blue' },
      { category: 'Double ___', words: ['DUTCH', 'CHECK', 'CROSS', 'TAKE'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Kitchen appliances', words: ['BLENDER', 'TOASTER', 'MIXER', 'KETTLE'], difficulty: 'yellow' },
      { category: 'Types of dance', words: ['WALTZ', 'TANGO', 'SALSA', 'SWING'], difficulty: 'green' },
      { category: 'Things with rings', words: ['SATURN', 'PHONE', 'CIRCUS', 'TREE'], difficulty: 'blue' },
      { category: 'Break ___', words: ['FAST', 'DOWN', 'EVEN', 'THROUGH'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Pasta shapes', words: ['PENNE', 'RIGATONI', 'FUSILLI', 'ORZO'], difficulty: 'yellow' },
      { category: 'Poker terms', words: ['FOLD', 'RAISE', 'BLUFF', 'CALL'], difficulty: 'green' },
      { category: 'Things with keys', words: ['PIANO', 'MAP', 'LOCK', 'LAPTOP'], difficulty: 'blue' },
      { category: 'Famous Johns', words: ['LEGEND', 'ADAMS', 'WICK', 'LENNON'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Olympic sports', words: ['FENCING', 'ROWING', 'DIVING', 'ARCHERY'], difficulty: 'yellow' },
      { category: 'Coffee drinks', words: ['LATTE', 'MOCHA', 'ESPRESSO', 'CORTADO'], difficulty: 'green' },
      { category: 'Types of cloud', words: ['CIRRUS', 'NIMBUS', 'STRATUS', 'CUMULUS'], difficulty: 'blue' },
      { category: 'Grand ___', words: ['PIANO', 'PRIX', 'JURY', 'SLAM'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Board games', words: ['CHESS', 'RISK', 'CLUE', 'LIFE'], difficulty: 'yellow' },
      { category: 'Fabrics', words: ['SILK', 'DENIM', 'LINEN', 'COTTON'], difficulty: 'green' },
      { category: 'Things that drip', words: ['FAUCET', 'CANDLE', 'PAINT', 'SWEAT'], difficulty: 'blue' },
      { category: '___ light', words: ['FLASH', 'SPOT', 'MOON', 'HIGH'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Citrus fruits', words: ['LEMON', 'LIME', 'ORANGE', 'GRAPE'], difficulty: 'yellow' },
      { category: 'Units of measure', words: ['METER', 'GALLON', 'POUND', 'OUNCE'], difficulty: 'green' },
      { category: 'Things with necks', words: ['BOTTLE', 'GUITAR', 'GIRAFFE', 'SHIRT'], difficulty: 'blue' },
      { category: 'Run ___', words: ['AWAY', 'DOWN', 'OFF', 'OVER'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Vegetables', words: ['CARROT', 'PEPPER', 'TURNIP', 'CELERY'], difficulty: 'yellow' },
      { category: 'Musical instruments', words: ['DRUM', 'HARP', 'FLUTE', 'ORGAN'], difficulty: 'green' },
      { category: 'Things with tails', words: ['COMET', 'COAT', 'KITE', 'MONKEY'], difficulty: 'blue' },
      { category: 'Cold ___', words: ['FRONT', 'CASE', 'SNAP', 'SHOULDER'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Desserts', words: ['BROWNIE', 'SUNDAE', 'MOUSSE', 'TRIFLE'], difficulty: 'yellow' },
      { category: 'Dances', words: ['TWIST', 'HUSTLE', 'RUMBA', 'MAMBO'], difficulty: 'green' },
      { category: 'Things with caps', words: ['BOTTLE', 'MUSHROOM', 'TOOTH', 'KNEE'], difficulty: 'blue' },
      { category: 'Paper ___', words: ['CLIP', 'WEIGHT', 'TRAIL', 'BACK'], difficulty: 'purple' },
    ],
  },
  {
    groups: [
      { category: 'Trees', words: ['MAPLE', 'CEDAR', 'BIRCH', 'WILLOW'], difficulty: 'yellow' },
      { category: 'Gemstones', words: ['PEARL', 'JADE', 'OPAL', 'TOPAZ'], difficulty: 'green' },
      { category: 'Things that buzz', words: ['BEE', 'PHONE', 'ALARM', 'CROWD'], difficulty: 'blue' },
      { category: 'Air ___', words: ['PORT', 'CRAFT', 'TIGHT', 'BRUSH'], difficulty: 'purple' },
    ],
  },
]
