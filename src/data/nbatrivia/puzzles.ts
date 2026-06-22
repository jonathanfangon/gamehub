export interface TriviaQuestion {
  question: string
  choices: [string, string, string, string]
  answer: number // index 0-3
}

export interface TriviaPuzzle {
  questions: [TriviaQuestion, TriviaQuestion, TriviaQuestion, TriviaQuestion, TriviaQuestion]
}

export const PUZZLES: TriviaPuzzle[] = [
  {
    questions: [
      { question: 'Who holds the NBA record for most points in a single game?', choices: ['Kobe Bryant', 'Wilt Chamberlain', 'Michael Jordan', 'LeBron James'], answer: 1 },
      { question: 'Which team won the first-ever NBA championship in 1947?', choices: ['Boston Celtics', 'Philadelphia Warriors', 'New York Knicks', 'Minneapolis Lakers'], answer: 1 },
      { question: 'How many championships did Michael Jordan win?', choices: ['4', '5', '6', '7'], answer: 2 },
      { question: 'Which player is known as "The Greek Freak"?', choices: ['Luka Doncic', 'Nikola Jokic', 'Giannis Antetokounmpo', 'Joel Embiid'], answer: 2 },
      { question: 'What year was the 3-point line introduced in the NBA?', choices: ['1977', '1979', '1981', '1983'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'Who has won the most NBA MVP awards?', choices: ['LeBron James', 'Michael Jordan', 'Kareem Abdul-Jabbar', 'Bill Russell'], answer: 2 },
      { question: 'Which team has the most NBA championships?', choices: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'], answer: 1 },
      { question: 'What is the diameter of an NBA basketball hoop in inches?', choices: ['16', '18', '20', '22'], answer: 1 },
      { question: 'Who was the #1 overall pick in the 2003 NBA Draft?', choices: ['Carmelo Anthony', 'Dwyane Wade', 'Chris Bosh', 'LeBron James'], answer: 3 },
      { question: 'Which player has the most career steals in NBA history?', choices: ['Michael Jordan', 'John Stockton', 'Gary Payton', 'Chris Paul'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'How tall is the basketball hoop from the floor?', choices: ['9 feet', '10 feet', '11 feet', '12 feet'], answer: 1 },
      { question: 'Who holds the record for most assists in NBA history?', choices: ['Magic Johnson', 'John Stockton', 'Steve Nash', 'Chris Paul'], answer: 1 },
      { question: 'Which team drafted Kobe Bryant?', choices: ['Los Angeles Lakers', 'Charlotte Hornets', 'Philadelphia 76ers', 'Boston Celtics'], answer: 1 },
      { question: 'How many minutes are in an NBA regulation game?', choices: ['40', '44', '48', '52'], answer: 2 },
      { question: 'Who won NBA Finals MVP in 2021?', choices: ['Chris Paul', 'Devin Booker', 'Giannis Antetokounmpo', 'Khris Middleton'], answer: 2 },
    ],
  },
  {
    questions: [
      { question: 'Which player scored 81 points in a single game in 2006?', choices: ['LeBron James', 'Kobe Bryant', 'Allen Iverson', 'Tracy McGrady'], answer: 1 },
      { question: 'What city are the Spurs from?', choices: ['Dallas', 'Houston', 'San Antonio', 'Austin'], answer: 2 },
      { question: 'Who was known as "The Answer"?', choices: ['Allen Iverson', 'Tracy McGrady', 'Vince Carter', 'Paul Pierce'], answer: 0 },
      { question: 'How many teams are in the NBA?', choices: ['28', '29', '30', '32'], answer: 2 },
      { question: 'Which player has the most career blocks in NBA history?', choices: ['Dikembe Mutombo', 'Hakeem Olajuwon', 'Kareem Abdul-Jabbar', 'Shaquille O\'Neal'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'Who is the all-time leading scorer in NBA history?', choices: ['Kareem Abdul-Jabbar', 'Karl Malone', 'LeBron James', 'Kobe Bryant'], answer: 2 },
      { question: 'Which team went 73-9 in the 2015-16 regular season?', choices: ['San Antonio Spurs', 'Golden State Warriors', 'Chicago Bulls', 'Cleveland Cavaliers'], answer: 1 },
      { question: 'What does "NBA" stand for?', choices: ['National Ball Association', 'National Basketball Association', 'North Basketball Alliance', 'National Basketball Alliance'], answer: 1 },
      { question: 'Which player has won the most Defensive Player of the Year awards?', choices: ['Ben Wallace', 'Dikembe Mutombo', 'Rudy Gobert', 'Dwight Howard'], answer: 1 },
      { question: 'How many players are on the court per team during a game?', choices: ['4', '5', '6', '7'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'Who hit "The Shot" over Craig Ehlo in the 1989 playoffs?', choices: ['Larry Bird', 'Magic Johnson', 'Michael Jordan', 'Isiah Thomas'], answer: 2 },
      { question: 'Which team did LeBron James play for first?', choices: ['Miami Heat', 'Cleveland Cavaliers', 'Los Angeles Lakers', 'Chicago Bulls'], answer: 1 },
      { question: 'What is a "triple-double"?', choices: ['30+ points, rebounds, assists', '10+ in three stat categories', '3 double-digit quarters', 'Double overtime with 3 wins'], answer: 1 },
      { question: 'Who has the most career triple-doubles in NBA history?', choices: ['Magic Johnson', 'LeBron James', 'Oscar Robertson', 'Russell Westbrook'], answer: 3 },
      { question: 'What conference are the Lakers in?', choices: ['Eastern', 'Western', 'Pacific', 'Southern'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'Who was the youngest player to score 10,000 career points?', choices: ['Kobe Bryant', 'LeBron James', 'Kevin Durant', 'Tracy McGrady'], answer: 1 },
      { question: 'Which team did Steph Curry play college basketball for?', choices: ['Duke', 'North Carolina', 'Davidson', 'Kentucky'], answer: 2 },
      { question: 'What is the shot clock duration in the NBA?', choices: ['20 seconds', '24 seconds', '30 seconds', '35 seconds'], answer: 1 },
      { question: 'Who was nicknamed "The Big Fundamental"?', choices: ['Hakeem Olajuwon', 'Tim Duncan', 'David Robinson', 'Patrick Ewing'], answer: 1 },
      { question: 'How many games are in an NBA regular season?', choices: ['72', '78', '82', '86'], answer: 2 },
    ],
  },
  {
    questions: [
      { question: 'Which player won 8 consecutive NBA championships?', choices: ['Bill Russell', 'Michael Jordan', 'Kareem Abdul-Jabbar', 'Magic Johnson'], answer: 0 },
      { question: 'What team does Victor Wembanyama play for?', choices: ['Houston Rockets', 'Oklahoma City Thunder', 'San Antonio Spurs', 'Charlotte Hornets'], answer: 2 },
      { question: 'Who scored "The Double Nickel" (55 points) at MSG in 1995?', choices: ['Patrick Ewing', 'Reggie Miller', 'Michael Jordan', 'Hakeem Olajuwon'], answer: 2 },
      { question: 'How many personal fouls result in a disqualification?', choices: ['4', '5', '6', '7'], answer: 2 },
      { question: 'Which arena is known as "The Mecca of Basketball"?', choices: ['Staples Center', 'United Center', 'Madison Square Garden', 'TD Garden'], answer: 2 },
    ],
  },
  {
    questions: [
      { question: 'Who averaged a triple-double for an entire season first?', choices: ['Russell Westbrook', 'Oscar Robertson', 'Magic Johnson', 'LeBron James'], answer: 1 },
      { question: 'What is the logo silhouette on the NBA logo based on?', choices: ['Michael Jordan', 'Jerry West', 'Kobe Bryant', 'Wilt Chamberlain'], answer: 1 },
      { question: 'Which team plays at Chase Center?', choices: ['Los Angeles Clippers', 'Sacramento Kings', 'Golden State Warriors', 'Portland Trail Blazers'], answer: 2 },
      { question: 'What year did LeBron James enter the NBA?', choices: ['2001', '2002', '2003', '2004'], answer: 2 },
      { question: 'Who holds the record for most 3-pointers in a single game?', choices: ['Stephen Curry', 'Klay Thompson', 'Ray Allen', 'Damian Lillard'], answer: 1 },
    ],
  },
  {
    questions: [
      { question: 'Which player was known as "Black Mamba"?', choices: ['Kevin Garnett', 'Kobe Bryant', 'Tim Duncan', 'Tracy McGrady'], answer: 1 },
      { question: 'How many rounds are in the NBA Draft?', choices: ['1', '2', '3', '4'], answer: 1 },
      { question: 'Which team won the 2023 NBA Championship?', choices: ['Miami Heat', 'Boston Celtics', 'Denver Nuggets', 'Golden State Warriors'], answer: 2 },
      { question: 'What position did Magic Johnson primarily play?', choices: ['Shooting Guard', 'Small Forward', 'Point Guard', 'Center'], answer: 2 },
      { question: 'Which city hosts the NBA All-Star Weekend the most times?', choices: ['New York', 'Los Angeles', 'Chicago', 'Houston'], answer: 1 },
    ],
  },
]
