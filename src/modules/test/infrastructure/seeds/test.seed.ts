export interface TestSeedItem {
  title: string;
  description: string;
  level: string;
  category: string;
  timeLimit: number;
  maxXp: number;
  isPublished: boolean;
  questions: QuestionSeedItem[];
}

export interface QuestionSeedItem {
  content: string;
  choices: string[];
  correctAnswer: number;
  explanation: string | null;
  orderIndex: number;
}

export const TEST_SEED_DATA: TestSeedItem[] = [
  {
    title: 'A1 Grammar Basics',
    description: 'Test your knowledge of basic English grammar.',
    level: 'A1', category: 'grammar', timeLimit: 15, maxXp: 30, isPublished: true,
    questions: [
      { content: 'She ___ a student.', choices: ['am', 'is', 'are', 'be'], correctAnswer: 1, explanation: 'She is third person singular — use "is".', orderIndex: 1 },
      { content: 'I ___ from Vietnam.', choices: ['is', 'are', 'am', 'be'], correctAnswer: 2, explanation: 'With "I", use "am".', orderIndex: 2 },
      { content: 'They ___ happy today.', choices: ['is', 'am', 'be', 'are'], correctAnswer: 3, explanation: 'With "they", use "are".', orderIndex: 3 },
      { content: 'Choose the correct article: ___ apple a day keeps the doctor away.', choices: ['A', 'An', 'The', 'No article'], correctAnswer: 1, explanation: '"apple" starts with a vowel sound — use "an".', orderIndex: 4 },
      { content: 'My name ___ Tom.', choices: ['are', 'am', 'is', 'be'], correctAnswer: 2, explanation: '"My name" is third person singular — use "is".', orderIndex: 5 },
    ],
  },
  {
    title: 'A2 Vocabulary Test',
    description: 'Test your A2-level English vocabulary.',
    level: 'A2', category: 'vocabulary', timeLimit: 20, maxXp: 40, isPublished: true,
    questions: [
      { content: 'What is the meaning of "exhausted"?', choices: ['happy', 'very tired', 'angry', 'hungry'], correctAnswer: 1, explanation: '"Exhausted" means extremely tired.', orderIndex: 1 },
      { content: 'Choose the synonym for "begin".', choices: ['finish', 'stop', 'start', 'end'], correctAnswer: 2, explanation: '"Begin" means to start.', orderIndex: 2 },
      { content: 'A place where you borrow books is called a ___', choices: ['museum', 'bookshop', 'library', 'school'], correctAnswer: 2, explanation: 'A library is where you borrow books for free.', orderIndex: 3 },
      { content: '"She works in a hospital. She is a ___."', choices: ['teacher', 'doctor', 'pilot', 'chef'], correctAnswer: 1, explanation: 'A person who works in a hospital treating patients is a doctor.', orderIndex: 4 },
      { content: 'The opposite of "cheap" is ___', choices: ['old', 'expensive', 'small', 'fast'], correctAnswer: 1, explanation: '"Expensive" is the opposite of "cheap".', orderIndex: 5 },
      { content: '"I need to ___ the bus at this stop." — Which word fits?', choices: ['take', 'catch', 'get off', 'drive'], correctAnswer: 2, explanation: '"Get off" means to leave a bus, train, etc.', orderIndex: 6 },
    ],
  },
  {
    title: 'B1 Grammar: Tenses',
    description: 'Test your knowledge of English tenses at B1 level.',
    level: 'B1', category: 'grammar', timeLimit: 25, maxXp: 50, isPublished: true,
    questions: [
      { content: 'She ___ (live) in Hanoi for five years.', choices: ['lives', 'lived', 'has lived', 'is living'], correctAnswer: 2, explanation: '"For five years" with a present connection → present perfect.', orderIndex: 1 },
      { content: 'By the time he arrived, she ___ (leave) already.', choices: ['left', 'has left', 'had left', 'was leaving'], correctAnswer: 2, explanation: 'An action completed before another past action → past perfect.', orderIndex: 2 },
      { content: 'If I ___ (have) more money, I would travel the world.', choices: ['have', 'had', 'would have', 'has'], correctAnswer: 1, explanation: 'Type 2 conditional: if + past simple.', orderIndex: 3 },
      { content: 'He ___ (work) when I called him.', choices: ['works', 'worked', 'was working', 'has worked'], correctAnswer: 2, explanation: 'An action in progress at a past moment → past continuous.', orderIndex: 4 },
      { content: 'I ___ (not see) that movie yet.', choices: ["don't see", "didn't see", "haven't seen", "wasn't seeing"], correctAnswer: 2, explanation: '"Yet" with present relevance → present perfect negative.', orderIndex: 5 },
      { content: 'She ___ (study) every night this week.', choices: ['studies', 'is studying', 'has been studying', 'studied'], correctAnswer: 2, explanation: 'Ongoing action over a period → present perfect continuous.', orderIndex: 6 },
    ],
  },
  {
    title: 'B1 Reading Comprehension',
    description: 'Read a passage and answer questions about it.',
    level: 'B1', category: 'reading', timeLimit: 20, maxXp: 50, isPublished: true,
    questions: [
      { content: 'Passage: "The Amazon rainforest covers over 5.5 million square kilometres and is home to 10% of all species on Earth. Despite its importance, deforestation has reduced its size by nearly 20% in recent decades."\n\nWhat percentage of Earth\'s species live in the Amazon?', choices: ['5%', '10%', '20%', '50%'], correctAnswer: 1, explanation: 'The passage states "10% of all species on Earth".', orderIndex: 1 },
      { content: 'According to the passage, what is the main threat to the Amazon?', choices: ['flooding', 'drought', 'deforestation', 'wildfires'], correctAnswer: 2, explanation: 'The passage mentions deforestation has reduced its size by 20%.', orderIndex: 2 },
      { content: 'The Amazon has been reduced by approximately ___', choices: ['10%', '15%', '20%', '25%'], correctAnswer: 2, explanation: '"nearly 20%" is stated in the passage.', orderIndex: 3 },
      { content: 'Which word in the passage is closest in meaning to "destroyed area"?', choices: ['covers', 'species', 'importance', 'deforestation'], correctAnswer: 3, explanation: 'Deforestation = the cutting down and removal of trees from forests.', orderIndex: 4 },
      { content: 'How large is the Amazon rainforest?', choices: ['5.5 thousand km²', '5.5 million km²', '5.5 billion km²', '550 thousand km²'], correctAnswer: 1, explanation: 'The passage says "over 5.5 million square kilometres".', orderIndex: 5 },
    ],
  },
  {
    title: 'B2 Mixed Skills Test',
    description: 'A comprehensive B2-level test covering grammar, vocabulary, and reading.',
    level: 'B2', category: 'mixed', timeLimit: 30, maxXp: 75, isPublished: true,
    questions: [
      { content: 'If she ___ (know) the answer, she would have told us. (Grammar: Type 3 conditional)', choices: ['knows', 'knew', 'had known', 'would know'], correctAnswer: 2, explanation: 'Type 3 conditional: if + past perfect.', orderIndex: 1 },
      { content: 'The report ___ (write) by a team of economists. (Grammar: Passive Voice)', choices: ['wrote', 'was written', 'has written', 'writes'], correctAnswer: 1, explanation: 'Passive voice: was + past participle.', orderIndex: 2 },
      { content: 'Choose the word closest in meaning to "mitigate".', choices: ['worsen', 'reduce', 'ignore', 'cause'], correctAnswer: 1, explanation: '"Mitigate" means to make less severe.', orderIndex: 3 },
      { content: 'Which word best describes something that is "pervasive"?', choices: ['rare', 'occasional', 'widespread', 'small'], correctAnswer: 2, explanation: '"Pervasive" means spreading widely throughout an area.', orderIndex: 4 },
      { content: '"The two sides reached a ___ after lengthy discussions."', choices: ['compromise', 'competition', 'conflict', 'comparison'], correctAnswer: 0, explanation: 'A "compromise" is a mutual agreement reached through negotiation.', orderIndex: 5 },
      { content: 'The proposal was ___ by the committee because of budget constraints. (Choose correct word)', choices: ['rejected', 'accepted', 'delayed', 'ignored'], correctAnswer: 0, explanation: 'Context implies the proposal was turned down.', orderIndex: 6 },
      { content: '"Despite the setbacks, the team remained ___." (Choose the most appropriate word)', choices: ['pessimistic', 'resilient', 'passive', 'confused'], correctAnswer: 1, explanation: '"Resilient" means able to recover from difficulties.', orderIndex: 7 },
      { content: 'She spoke so ___ that everyone in the room was moved. (Vocabulary)', choices: ['rudely', 'carelessly', 'eloquently', 'briefly'], correctAnswer: 2, explanation: '"Eloquently" means speaking in a persuasive and fluent manner.', orderIndex: 8 },
    ],
  },
];
