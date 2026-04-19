export interface LessonSeedItem {
  title: string;
  description: string;
  level: string;
  category: string;
  orderIndex: number;
  xpReward: number;
  isPublished: boolean;
  contentJson: Record<string, unknown>;
}

export const LESSON_SEED_DATA: LessonSeedItem[] = [
  // A1 — Grammar
  {
    title: 'Present Simple — To Be',
    description: 'Learn to use am, is, are in basic sentences.',
    level: 'A1', category: 'grammar', orderIndex: 1, xpReward: 10, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'The verb "to be" has three forms: am, is, are.' },
        { type: 'text', content: 'I am a student. She is happy. They are friends.' },
        { type: 'quiz', question: 'She ___ a teacher.', options: ['am', 'is', 'are'], answer: 1 },
      ],
    },
  },
  // A1 — Reading
  {
    title: 'My Family',
    description: 'Read a short text about a family.',
    level: 'A1', category: 'reading', orderIndex: 2, xpReward: 10, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'My name is Tom. I have a small family. My mother is a doctor. My father is a teacher. I have one sister. Her name is Anna.' },
        { type: 'quiz', question: "What is Tom's mother's job?", options: ['teacher', 'doctor', 'engineer'], answer: 1 },
      ],
    },
  },
  // A1 — Listening
  {
    title: 'Numbers 1–20',
    description: 'Listen and learn numbers from 1 to 20.',
    level: 'A1', category: 'listening', orderIndex: 3, xpReward: 10, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'audio', url: '', transcript: 'One, two, three, four, five, six, seven, eight, nine, ten.' },
        { type: 'quiz', question: 'How do you say 7 in English?', options: ['six', 'seven', 'eight'], answer: 1 },
      ],
    },
  },
  // A1 — Writing
  {
    title: 'Write About Yourself',
    description: 'Practice writing basic sentences about yourself.',
    level: 'A1', category: 'writing', orderIndex: 4, xpReward: 10, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Write 3 sentences about yourself: your name, your age, and where you live.' },
        { type: 'prompt', content: 'My name is ___, I am ___ years old, and I live in ___.' },
      ],
    },
  },
  // A1 — Speaking
  {
    title: 'Greetings and Introductions',
    description: 'Learn how to greet people and introduce yourself.',
    level: 'A1', category: 'speaking', orderIndex: 5, xpReward: 10, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Common greetings: Hello, Hi, Good morning, Good afternoon.' },
        { type: 'dialog', lines: ['A: Hello! What is your name?', 'B: Hi! My name is Lan. Nice to meet you.', 'A: Nice to meet you too!'] },
        { type: 'quiz', question: 'Which is a greeting?', options: ['Goodbye', 'Hello', 'Thank you'], answer: 1 },
      ],
    },
  },
  // A2 — Grammar
  {
    title: 'Present Continuous Tense',
    description: 'Learn how to describe actions happening right now.',
    level: 'A2', category: 'grammar', orderIndex: 1, xpReward: 15, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Use am/is/are + verb-ing for actions happening now.' },
        { type: 'text', content: 'I am reading. She is cooking. They are playing.' },
        { type: 'quiz', question: 'He ___ (watch) TV right now.', options: ['watches', 'is watching', 'watched'], answer: 1 },
      ],
    },
  },
  // A2 — Reading
  {
    title: 'A Day in the City',
    description: 'Read about daily activities in the city.',
    level: 'A2', category: 'reading', orderIndex: 2, xpReward: 15, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Maria lives in a big city. Every morning, she takes the bus to work. She works in a café. After work, she goes to the gym and then cooks dinner at home.' },
        { type: 'quiz', question: 'How does Maria go to work?', options: ['by car', 'by bus', 'by bike'], answer: 1 },
      ],
    },
  },
  // A2 — Listening
  {
    title: 'Ordering Food',
    description: 'Listen to a conversation at a restaurant.',
    level: 'A2', category: 'listening', orderIndex: 3, xpReward: 15, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'audio', url: '', transcript: 'Waiter: Good evening! What would you like? Customer: I would like a pizza and a glass of water, please.' },
        { type: 'quiz', question: 'What does the customer order?', options: ['burger and juice', 'pizza and water', 'pasta and tea'], answer: 1 },
      ],
    },
  },
  // A2 — Writing
  {
    title: 'Writing an Email',
    description: 'Learn how to write a simple email to a friend.',
    level: 'A2', category: 'writing', orderIndex: 4, xpReward: 15, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Structure: Subject line, greeting (Dear / Hi), body, closing (Best wishes / Bye).' },
        { type: 'prompt', content: 'Write a short email to your friend about your weekend plans.' },
      ],
    },
  },
  // A2 — Speaking
  {
    title: 'Talking About Your Routine',
    description: 'Describe your daily routine using time expressions.',
    level: 'A2', category: 'speaking', orderIndex: 5, xpReward: 15, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Use: in the morning, at noon, in the evening, at night.' },
        { type: 'dialog', lines: ['A: What do you do in the morning?', 'B: I wake up at 7, have breakfast, and go to school.'] },
        { type: 'quiz', question: 'Which expression means before noon?', options: ['at night', 'in the morning', 'in the evening'], answer: 1 },
      ],
    },
  },
  // B1 — Grammar
  {
    title: 'Present Perfect Tense',
    description: 'Connect the past to the present using have/has + past participle.',
    level: 'B1', category: 'grammar', orderIndex: 1, xpReward: 20, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Use the present perfect for past actions with present relevance.' },
        { type: 'text', content: 'I have visited Paris. She has eaten sushi. We have never seen snow.' },
        { type: 'quiz', question: 'He ___ (finish) his homework already.', options: ['finished', 'has finished', 'finish'], answer: 1 },
      ],
    },
  },
  // B1 — Reading
  {
    title: 'Climate Change Overview',
    description: 'Understand a passage about global warming and its effects.',
    level: 'B1', category: 'reading', orderIndex: 2, xpReward: 20, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. Since the 1800s, human activities — especially the burning of fossil fuels — have been the main driver of climate change.' },
        { type: 'quiz', question: 'What is the main driver of climate change since the 1800s?', options: ['volcanic eruptions', 'human activities', 'natural cycles'], answer: 1 },
      ],
    },
  },
  // B1 — Listening
  {
    title: 'Job Interview Tips',
    description: 'Listen to advice about how to succeed in job interviews.',
    level: 'B1', category: 'listening', orderIndex: 3, xpReward: 20, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'audio', url: '', transcript: 'Tip 1: Research the company before your interview. Tip 2: Prepare answers to common questions. Tip 3: Dress professionally and arrive on time.' },
        { type: 'quiz', question: 'What should you do before the interview?', options: ['relax at home', 'research the company', 'call the interviewer'], answer: 1 },
      ],
    },
  },
  // B1 — Writing
  {
    title: 'Opinion Essay: Introduction',
    description: 'Learn how to write a structured opinion essay.',
    level: 'B1', category: 'writing', orderIndex: 4, xpReward: 20, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Structure: Introduction (state your opinion), Body (2-3 arguments with examples), Conclusion (restate opinion).' },
        { type: 'prompt', content: 'Write a 5-sentence opinion paragraph about whether students should use smartphones in class.' },
      ],
    },
  },
  // B1 — Speaking
  {
    title: 'Discussing Advantages and Disadvantages',
    description: 'Practice expressing pros and cons in spoken English.',
    level: 'B1', category: 'speaking', orderIndex: 5, xpReward: 20, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Useful phrases: On the one hand... / On the other hand... / One advantage is... / A major disadvantage is...' },
        { type: 'dialog', lines: ['A: What do you think about working from home?', 'B: On the one hand, it saves time on commuting. On the other hand, it can be isolating.'] },
        { type: 'quiz', question: 'Which phrase introduces a disadvantage?', options: ['One advantage is', 'On the one hand', 'A major disadvantage is'], answer: 2 },
      ],
    },
  },
  // B2 — Grammar
  {
    title: 'Conditionals: Type 2 and Type 3',
    description: 'Master hypothetical and counterfactual conditionals.',
    level: 'B2', category: 'grammar', orderIndex: 1, xpReward: 25, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Type 2 (hypothetical present): If I were rich, I would travel the world.\nType 3 (past unreal): If I had studied harder, I would have passed.' },
        { type: 'quiz', question: 'If she ___ (know) the answer, she would have told us.', options: ['knows', 'knew', 'had known'], answer: 2 },
      ],
    },
  },
  // B2 — Reading
  {
    title: 'Academic Reading: Technology and Society',
    description: 'Analyze an academic-style text about the impact of technology.',
    level: 'B2', category: 'reading', orderIndex: 2, xpReward: 25, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'The digital revolution has fundamentally transformed how humans interact, work, and access information. While proponents argue that technology has democratized knowledge, critics contend that it has deepened social inequalities.' },
        { type: 'quiz', question: 'What do critics argue about technology?', options: ['it democratized knowledge', 'it deepened social inequalities', 'it improved communication'], answer: 1 },
      ],
    },
  },
  // B2 — Listening
  {
    title: 'News Report: Environmental Policy',
    description: 'Listen to a news-style report and answer comprehension questions.',
    level: 'B2', category: 'listening', orderIndex: 3, xpReward: 25, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'audio', url: '', transcript: 'Governments worldwide are implementing new carbon emission targets. The EU announced a 55% reduction goal by 2030, while developing nations are requesting financial support for green transitions.' },
        { type: 'quiz', question: "What is the EU's emission reduction target by 2030?", options: ['40%', '55%', '70%'], answer: 1 },
      ],
    },
  },
  // B2 — Writing
  {
    title: 'Formal Report Writing',
    description: 'Learn how to write a structured formal report.',
    level: 'B2', category: 'writing', orderIndex: 4, xpReward: 25, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Structure: Executive Summary, Introduction, Findings, Recommendations, Conclusion.' },
        { type: 'text', content: 'Formal language: It is recommended that... / The findings suggest... / In conclusion...' },
        { type: 'prompt', content: 'Write a 200-word report on the benefits of remote working for your company.' },
      ],
    },
  },
  // B2 — Speaking
  {
    title: 'Debate: Technology in Education',
    description: 'Practice structured debate skills using formal language.',
    level: 'B2', category: 'speaking', orderIndex: 5, xpReward: 25, isPublished: true,
    contentJson: {
      blocks: [
        { type: 'text', content: 'Debate phrases: I strongly believe that... / My opponent claims, but... / The evidence clearly shows...' },
        { type: 'dialog', lines: [
          'A: I strongly believe that technology enhances learning outcomes.',
          'B: While that may be true, excessive screen time has been linked to reduced attention spans.',
        ]},
        { type: 'quiz', question: 'Which phrase is used to counter an argument?', options: ['I strongly believe', 'My opponent claims, but', 'The evidence shows'], answer: 1 },
      ],
    },
  },
];
