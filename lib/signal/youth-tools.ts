// ============================================================================
// Youth Tool Variants
//
// Age-adapted versions of the core DM Tools for users aged 14–24.
// Uses school/extracurricular activities, simplified language, and
// youth-specific flux states.
//
// Tools adapted:
//   1. Youth Energy Sort — school activities instead of professional
//   2. Youth FSI (Flux State Index) — 5 youth states instead of adult 7
//   3. Youth Career Family Finder — education-focused career mapping
//
// Design principles:
//   - Concrete activities, not abstract self-report
//   - School/extracurricular context (youth) or college/internship (emerging)
//   - No jargon: "career family" → "what kind of work fits you"
//   - Results emphasize exploration, not commitment
// ============================================================================

import type { AgeGroup } from '@/lib/career/decision-domains';

// ── Youth Energy Sort ──

export interface YouthActivity {
  id: number;
  text: string;
  /** Which energy dimensions this maps to */
  dimensions: string[];
  /** Short label for results view */
  short: string;
  /** Which age groups this activity is relevant to */
  ageGroups: AgeGroup[];
}

/**
 * Youth activities replace the 30 professional activities in the adult Energy Sort.
 * Tagged with age group relevance so the UI can filter appropriately.
 */
export const YOUTH_ACTIVITIES: YouthActivity[] = [
  // ── N1: People Energy ──
  { id: 101, text: 'Leading a group project at school', dimensions: ['N1'], short: 'Leading group project', ageGroups: ['youth', 'emerging'] },
  { id: 102, text: 'Helping a friend study for a test', dimensions: ['N1', 'N5'], short: 'Helping friend study', ageGroups: ['youth', 'emerging'] },
  { id: 103, text: 'Speaking up in class discussions', dimensions: ['N1'], short: 'Class discussions', ageGroups: ['youth'] },
  { id: 104, text: 'Networking at a campus event or career fair', dimensions: ['N1'], short: 'Campus networking', ageGroups: ['emerging'] },
  { id: 105, text: 'Organizing a social event or party', dimensions: ['N1'], short: 'Organizing social events', ageGroups: ['youth', 'emerging'] },

  // ── N2: Problem Energy ──
  { id: 106, text: 'Solving a really tough math or science problem', dimensions: ['N2'], short: 'Tough math/science', ageGroups: ['youth', 'emerging'] },
  { id: 107, text: 'Figuring out why your code isn\'t working', dimensions: ['N2', 'N6'], short: 'Debugging code', ageGroups: ['youth', 'emerging'] },
  { id: 108, text: 'Working through a brain teaser or puzzle', dimensions: ['N2'], short: 'Brain teasers', ageGroups: ['youth'] },
  { id: 109, text: 'Troubleshooting a problem in a lab experiment', dimensions: ['N2', 'N7'], short: 'Lab troubleshooting', ageGroups: ['emerging'] },
  { id: 110, text: 'Figuring out the strategy in a competitive game', dimensions: ['N2', 'N7'], short: 'Game strategy', ageGroups: ['youth', 'emerging'] },

  // ── N3: Completion Energy ──
  { id: 111, text: 'Finishing all your homework before the deadline', dimensions: ['N3'], short: 'Finishing homework', ageGroups: ['youth'] },
  { id: 112, text: 'Organizing your room, locker, or digital files', dimensions: ['N3'], short: 'Organizing things', ageGroups: ['youth', 'emerging'] },
  { id: 113, text: 'Making a to-do list and checking everything off', dimensions: ['N3'], short: 'Checking off to-dos', ageGroups: ['youth', 'emerging'] },
  { id: 114, text: 'Completing a long-term project or paper on time', dimensions: ['N3'], short: 'Completing big projects', ageGroups: ['emerging'] },
  { id: 115, text: 'Cleaning up and finalizing a group project before submission', dimensions: ['N3'], short: 'Finalizing group work', ageGroups: ['youth', 'emerging'] },

  // ── N4: Mastery Energy ──
  { id: 116, text: 'Spending hours practicing a musical instrument or sport skill', dimensions: ['N4'], short: 'Practicing instrument/sport', ageGroups: ['youth', 'emerging'] },
  { id: 117, text: 'Going deep into a subject you find fascinating', dimensions: ['N4'], short: 'Going deep on a subject', ageGroups: ['youth', 'emerging'] },
  { id: 118, text: 'Watching tutorials to master a new software tool or technique', dimensions: ['N4'], short: 'Mastering new tools', ageGroups: ['youth', 'emerging'] },
  { id: 119, text: 'Re-reading a book or re-watching content to understand it deeply', dimensions: ['N4'], short: 'Deep understanding', ageGroups: ['youth'] },
  { id: 120, text: 'Taking an online course or certification in something that interests you', dimensions: ['N4'], short: 'Online courses', ageGroups: ['emerging'] },

  // ── N5: Helping Energy ──
  { id: 121, text: 'Tutoring someone who\'s struggling with a subject', dimensions: ['N5'], short: 'Tutoring others', ageGroups: ['youth', 'emerging'] },
  { id: 122, text: 'Volunteering in your community', dimensions: ['N5'], short: 'Volunteering', ageGroups: ['youth', 'emerging'] },
  { id: 123, text: 'Listening to a friend who\'s going through a hard time', dimensions: ['N5', 'N1'], short: 'Supporting a friend', ageGroups: ['youth', 'emerging'] },
  { id: 124, text: 'Being a mentor or team captain for younger students', dimensions: ['N5', 'N1'], short: 'Mentoring younger students', ageGroups: ['emerging'] },

  // ── N6: Building Energy ──
  { id: 125, text: 'Building something with your hands (art, woodworking, electronics)', dimensions: ['N6'], short: 'Building with hands', ageGroups: ['youth', 'emerging'] },
  { id: 126, text: 'Creating a website, app, or digital project', dimensions: ['N6', 'N2'], short: 'Creating digital projects', ageGroups: ['youth', 'emerging'] },
  { id: 127, text: 'Writing a story, song, or creative piece from scratch', dimensions: ['N6'], short: 'Creative writing/music', ageGroups: ['youth', 'emerging'] },
  { id: 128, text: 'Starting a small business, club, or side project', dimensions: ['N6', 'N7'], short: 'Starting a project/club', ageGroups: ['emerging'] },

  // ── N7: Complexity Energy ──
  { id: 129, text: 'Playing a strategy game (chess, Civilization, etc.)', dimensions: ['N7'], short: 'Strategy games', ageGroups: ['youth', 'emerging'] },
  { id: 130, text: 'Thinking about how different school subjects connect to each other', dimensions: ['N7'], short: 'Connecting subjects', ageGroups: ['youth'] },
  { id: 131, text: 'Debating a topic with multiple sides and no clear answer', dimensions: ['N7', 'N1'], short: 'Complex debates', ageGroups: ['youth', 'emerging'] },
  { id: 132, text: 'Planning a complex event with lots of moving parts', dimensions: ['N7', 'N3'], short: 'Complex event planning', ageGroups: ['emerging'] },
  { id: 133, text: 'Thinking about how the world works — economics, politics, systems', dimensions: ['N7'], short: 'Systems thinking', ageGroups: ['youth', 'emerging'] },
];

/**
 * Get activities filtered for a specific age group.
 */
export function getYouthActivities(ageGroup: AgeGroup): YouthActivity[] {
  return YOUTH_ACTIVITIES.filter((a) => a.ageGroups.includes(ageGroup));
}

// ── Youth FSI (Flux State Index) ──

export interface YouthFsiItem {
  id: number;
  state: string;
  text: string;
}

/**
 * Youth FSI items — 25 items across 5 youth-specific flux states.
 * These replace the adult FSI-30's 7-state model with states that
 * make sense for people who haven't established careers yet.
 */
export const YOUTH_FSI_ITEMS: YouthFsiItem[] = [
  // ── Exploring (healthy curiosity, active trying) ──
  { id: 201, state: 'exploring', text: 'I enjoy trying new activities, subjects, and interests.' },
  { id: 202, state: 'exploring', text: 'I\'m curious about lots of different career options.' },
  { id: 203, state: 'exploring', text: 'I feel excited about the future, even if I don\'t know exactly where I\'m headed.' },
  { id: 204, state: 'exploring', text: 'I actively seek out new experiences and opportunities.' },
  { id: 205, state: 'exploring', text: 'I don\'t feel rushed to pick a single direction — exploring is part of the process.' },

  // ── Drifting (passive, disengaged, no direction) ──
  { id: 206, state: 'drifting', text: 'I don\'t really have strong interests in anything right now.' },
  { id: 207, state: 'drifting', text: 'I go through the motions without feeling excited about my future.' },
  { id: 208, state: 'drifting', text: 'When people ask what I want to do, I just shrug.' },
  { id: 209, state: 'drifting', text: 'I haven\'t tried anything new in a while.' },
  { id: 210, state: 'drifting', text: 'I feel like other people have their lives figured out, but I don\'t.' },

  // ── Pressured (external expectations dominating) ──
  { id: 211, state: 'pressured', text: 'I feel a lot of pressure from my family about what I should do with my life.' },
  { id: 212, state: 'pressured', text: 'The career path I\'m on was chosen more by others than by me.' },
  { id: 213, state: 'pressured', text: 'I worry about disappointing the people who are investing in my future.' },
  { id: 214, state: 'pressured', text: 'I feel guilty when I think about wanting something different from what\'s expected.' },
  { id: 215, state: 'pressured', text: 'I say "I want to be a ___" because it makes other people happy, not because it excites me.' },

  // ── Committed (clear direction, active pursuit) ──
  { id: 216, state: 'committed', text: 'I know what kind of work or career I want to pursue.' },
  { id: 217, state: 'committed', text: 'I\'m actively taking steps toward my goal (classes, projects, practice).' },
  { id: 218, state: 'committed', text: 'When I imagine my future career, I feel energized and motivated.' },
  { id: 219, state: 'committed', text: 'I chose my direction based on my own interests and strengths, not just what others expect.' },
  { id: 220, state: 'committed', text: 'I can explain why my chosen path fits who I am.' },

  // ── Mismatched (on a path that doesn't fit) ──
  { id: 221, state: 'mismatched', text: 'The subject or career I\'m pursuing doesn\'t excite me the way it should.' },
  { id: 222, state: 'mismatched', text: 'I often feel drained by the work I\'m supposed to be passionate about.' },
  { id: 223, state: 'mismatched', text: 'I notice I have more energy for my hobbies and side interests than for my "main" path.' },
  { id: 224, state: 'mismatched', text: 'I sometimes wonder if I picked the wrong major, career path, or direction.' },
  { id: 225, state: 'mismatched', text: 'The things I\'m naturally good at don\'t seem to match the path I\'m on.' },
];

export const YOUTH_FSI_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export const YOUTH_FLUX_GUIDANCE: Record<string, {
  what: string;
  risk: string;
  doNext: string[];
  rule: string;
}> = {
  exploring: {
    what: 'You\'re actively curious and trying things. This is exactly where you should be. Exploration IS the work at this stage — not a sign of indecision.',
    risk: 'Feeling bad about not having it "figured out." Some adults will push you to commit too early. Resist this — data from exploration is more valuable than premature commitment.',
    doNext: [
      'Keep a simple energy journal: after each activity, note whether it energized or drained you.',
      'Try at least 2 new activities or subjects this semester that are outside your comfort zone.',
      'Talk to 3 people who have jobs that interest you. Ask what their day actually looks like.',
      'Take the Energy Sort to identify your natural energy patterns.',
      'Remember: you\'re building self-knowledge, not making a permanent choice.',
    ],
    rule: '"I\'m gathering data, not making a life sentence."',
  },
  drifting: {
    what: 'You\'re not actively exploring and nothing is pulling you in a direction. This isn\'t laziness — it\'s often a sign that you haven\'t been exposed to the right activities yet, or that something is blocking your natural curiosity.',
    risk: 'Staying passive too long and letting others choose for you by default. The longer you drift, the harder it gets to start exploring.',
    doNext: [
      'Start small: pick ONE new activity this week. It doesn\'t have to be career-related.',
      'Take the Energy Sort — it works even when you don\'t think you have strong preferences.',
      'Ask yourself: "What did I enjoy doing when I was younger, before anyone told me what I should do?"',
      'Find one person whose life looks interesting to you and ask them about their path.',
      'Set a tiny goal: try 3 new things in the next month. Just try them — no commitment.',
    ],
    rule: '"I\'ll try one new thing this week. Just one."',
  },
  pressured: {
    what: 'You feel significant external pressure about your direction — from family, teachers, peers, or culture. Your own voice is being drowned out by what others expect. This is the most common and most dangerous state for young people.',
    risk: 'Spending years on a path chosen by someone else, then facing a painful mid-career transition to realign with who you actually are. The cost of conformity is deferred, not avoided.',
    doNext: [
      'Separate what YOU want from what others want for you. Write two lists side by side.',
      'Take the Energy Sort privately — don\'t share results until YOU understand them.',
      'Find one trusted adult who will listen without an agenda. Share what you actually feel.',
      'Remember: honoring your parents doesn\'t mean living their dream. You can be respectful AND authentic.',
      'Ask: "If no one could see my career, what would I choose?"',
    ],
    rule: '"Their expectations are about their fears, not my future."',
  },
  committed: {
    what: 'You have a clear direction that you chose based on your own interests and strengths. You\'re actively pursuing it. This is rare and valuable at your age.',
    risk: 'Tunnel vision — being so locked in that you miss better-fitting options. Stay open to adjacent possibilities even as you pursue your chosen path.',
    doNext: [
      'Validate your direction with the Career Family Finder — does it match your energy patterns?',
      'Start building toward your goal: relevant courses, internships, projects, or portfolio pieces.',
      'Identify the top 3 gaps between where you are and where you want to be.',
      'Find a mentor who\'s 5-10 years ahead on a similar path.',
      'Set a 6-month check-in: "Does this still feel right? Am I energized by the actual work?"',
    ],
    rule: '"I\'m committed, not closed. I\'ll check in with myself regularly."',
  },
  mismatched: {
    what: 'You\'re on a path, but your energy patterns suggest it doesn\'t fit who you actually are. You may have chosen it for the right reasons at the time, or it may have been chosen for you. Either way, the mismatch is real data.',
    risk: 'Ignoring the mismatch and pushing through anyway — this leads to burnout, resentment, and eventually a harder correction later. The earlier you course-correct, the easier it is.',
    doNext: [
      'Take the Energy Sort to identify where the mismatch is — which energy patterns are being starved?',
      'Don\'t panic or quit immediately. A mismatch is information, not an emergency.',
      'Explore what WOULD match: what activities make you lose track of time?',
      'Talk to someone in a field that matches your energy patterns. What does their work feel like?',
      'Consider: can you adjust your current path to better fit you, or do you need a different path entirely?',
    ],
    rule: '"The mismatch is a signal, not a failure. I\'m allowed to change direction."',
  },
};

/**
 * Score youth FSI responses.
 * Input: array of { itemId: number, score: 1-5 (strongly disagree to strongly agree) }
 */
export function scoreYouthFsi(
  responses: { itemId: number; score: number }[]
): {
  primary: string;
  scores: Record<string, number>;
  confidence: number;
  all: { state: string; score: number; normalized: number }[];
} {
  const stateScores: Record<string, number[]> = {
    exploring: [],
    drifting: [],
    pressured: [],
    committed: [],
    mismatched: [],
  };

  for (const r of responses) {
    const item = YOUTH_FSI_ITEMS.find((i) => i.id === r.itemId);
    if (item && stateScores[item.state]) {
      stateScores[item.state].push(r.score);
    }
  }

  const results = Object.entries(stateScores).map(([state, scores]) => {
    const avg = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
    // Normalize 1-5 to 0-100
    const normalized = Math.round(((avg - 1) / 4) * 100);
    return { state, score: Math.round(avg * 10) / 10, normalized };
  });

  results.sort((a, b) => b.normalized - a.normalized);

  const primary = results[0].state;
  const margin = results[0].normalized - (results[1]?.normalized ?? 0);
  const confidence = Math.min(1, margin / 30); // >30 point margin = full confidence

  const scoresMap: Record<string, number> = {};
  for (const r of results) {
    scoresMap[r.state] = r.normalized;
  }

  return { primary, scores: scoresMap, confidence, all: results };
}

// ── Youth Career Family Finder ──

export interface YouthCareerExploration {
  family: string;
  score: number;
  tagline: string;
  icon: string;
  /** Youth-friendly explanation */
  whatItMeans: string;
  /** Concrete things a young person could explore */
  tryThis: string[];
  /** School subjects that align */
  relatedSubjects: string[];
  /** College majors that could fit */
  relatedMajors: string[];
}

export const YOUTH_CAREER_EXPLORATIONS: Record<string, Omit<YouthCareerExploration, 'family' | 'score'>> = {
  Builder: {
    tagline: 'You like making things from scratch',
    icon: '🔨',
    whatItMeans: 'You get energy from creating — whether that\'s code, furniture, art, businesses, or inventions. You\'re not just thinking about ideas, you want to build them.',
    tryThis: [
      'Start a coding project or learn a new programming language',
      'Build something physical — woodworking, electronics, 3D printing',
      'Create a small business or side project and sell something',
      'Join a maker space, robotics club, or hackathon',
      'Design and build a website or app that solves a real problem',
    ],
    relatedSubjects: ['Computer Science', 'Art/Design', 'Shop/Woodworking', 'Engineering', 'Entrepreneurship'],
    relatedMajors: ['Computer Science', 'Engineering', 'Industrial Design', 'Architecture', 'Entrepreneurship'],
  },
  Strategist: {
    tagline: 'You see the big picture others miss',
    icon: '♟️',
    whatItMeans: 'You naturally think several steps ahead. While others focus on what\'s in front of them, you\'re thinking about how all the pieces fit together and what moves to make next.',
    tryThis: [
      'Join debate club or Model UN',
      'Play strategy games competitively (chess, go, strategy video games)',
      'Start analyzing businesses — why do some succeed and others fail?',
      'Read about history, economics, or geopolitics',
      'Organize a complex project with multiple people and moving parts',
    ],
    relatedSubjects: ['Economics', 'History', 'Government', 'Mathematics', 'Business'],
    relatedMajors: ['Business/Strategy', 'Economics', 'Political Science', 'Mathematics', 'Finance'],
  },
  Explorer: {
    tagline: 'You discover things nobody else has found',
    icon: '🔭',
    whatItMeans: 'You\'re driven by curiosity and the thrill of learning something new. You go deep on topics that interest you and you\'re always looking for the next fascinating thing.',
    tryThis: [
      'Pick a topic you\'re curious about and research it obsessively for a week',
      'Travel somewhere new — even if it\'s just a different neighborhood',
      'Read widely across subjects you know nothing about',
      'Try a science experiment or independent research project',
      'Start a blog or journal about your discoveries',
    ],
    relatedSubjects: ['Science', 'Philosophy', 'Foreign Languages', 'Research Methods', 'Literature'],
    relatedMajors: ['Research Sciences', 'Journalism', 'Anthropology', 'Data Science', 'Philosophy'],
  },
  Optimizer: {
    tagline: 'You make things work better',
    icon: '⚙️',
    whatItMeans: 'You notice inefficiency and it bugs you. You want to take something that already exists and make it faster, cleaner, more organized, or more effective.',
    tryThis: [
      'Redesign a process at school or home that doesn\'t work well',
      'Learn spreadsheets or data analysis — track something and find patterns',
      'Organize a system — your schedule, a club\'s workflow, a team\'s process',
      'Study how successful companies improve their operations',
      'Take apart something (literally or conceptually) and put it back together better',
    ],
    relatedSubjects: ['Mathematics', 'Computer Science', 'Business', 'Statistics', 'Accounting'],
    relatedMajors: ['Industrial Engineering', 'Operations Management', 'Accounting', 'Data Analytics', 'Supply Chain'],
  },
  Teacher: {
    tagline: 'You develop other people\'s abilities',
    icon: '📚',
    whatItMeans: 'You light up when you help someone understand something they were struggling with. You have a gift for breaking complex things down and meeting people where they are.',
    tryThis: [
      'Tutor younger students or classmates',
      'Create a tutorial video or guide about something you know well',
      'Volunteer as a camp counselor, youth leader, or reading buddy',
      'Start a study group and lead the sessions',
      'Teach a family member something new — cooking, technology, a skill',
    ],
    relatedSubjects: ['English', 'Communications', 'Any subject you love teaching'],
    relatedMajors: ['Education', 'Communications', 'Psychology', 'Training & Development', 'Instructional Design'],
  },
  Connector: {
    tagline: 'You bring people together',
    icon: '🤝',
    whatItMeans: 'You\'re naturally social and you see connections between people, ideas, and opportunities. You\'re the one who introduces people who should know each other.',
    tryThis: [
      'Organize a social event, meetup, or networking opportunity',
      'Start a club that brings different groups of people together',
      'Practice active listening — really hear what people need',
      'Volunteer for community events or student government',
      'Build your network: meet one new person outside your circle each week',
    ],
    relatedSubjects: ['Communications', 'Psychology', 'Business', 'Drama/Theater', 'Social Studies'],
    relatedMajors: ['Communications', 'Marketing', 'Public Relations', 'Human Resources', 'Social Work'],
  },
  Guardian: {
    tagline: 'You protect what matters',
    icon: '🛡️',
    whatItMeans: 'You care about doing things right, maintaining quality, and making sure systems work reliably. You notice when things are off, and you want to fix them before they break.',
    tryThis: [
      'Learn about quality control — how do companies make sure their products work?',
      'Volunteer for safety or compliance roles (school safety patrol, peer mediation)',
      'Study how laws and regulations protect people',
      'Practice proofreading, fact-checking, or code review',
      'Learn about cybersecurity or information safety',
    ],
    relatedSubjects: ['Government/Law', 'Science', 'Computer Science', 'Health'],
    relatedMajors: ['Criminal Justice', 'Cybersecurity', 'Nursing/Healthcare', 'Quality Assurance', 'Law/Pre-Law'],
  },
  Healer: {
    tagline: 'You restore and support others',
    icon: '💚',
    whatItMeans: 'You have a deep empathy and a natural drive to help people who are struggling. You don\'t just want to help — you want to understand what\'s really going on and support genuine healing.',
    tryThis: [
      'Volunteer at a hospital, animal shelter, or crisis hotline',
      'Learn about psychology — what makes people tick?',
      'Practice being a good listener without trying to fix everything',
      'Study biology, anatomy, or nutrition',
      'Shadow a counselor, nurse, therapist, or social worker',
    ],
    relatedSubjects: ['Biology', 'Psychology', 'Health', 'Chemistry', 'Social Studies'],
    relatedMajors: ['Psychology', 'Nursing', 'Social Work', 'Pre-Med', 'Counseling', 'Physical Therapy'],
  },
};

/**
 * Generate youth-friendly career exploration results from career family scores.
 */
export function generateYouthExplorations(
  familyScores: Record<string, number>,
): YouthCareerExploration[] {
  return Object.entries(familyScores)
    .sort((a, b) => b[1] - a[1])
    .map(([family, score]) => {
      const exploration = YOUTH_CAREER_EXPLORATIONS[family];
      if (!exploration) {
        return {
          family,
          score,
          tagline: '',
          icon: '',
          whatItMeans: '',
          tryThis: [],
          relatedSubjects: [],
          relatedMajors: [],
        };
      }
      return { family, score, ...exploration };
    });
}

// ── Tool Registry ──

export interface YouthToolDefinition {
  id: string;
  name: string;
  description: string;
  /** Minimum age to access this tool */
  minAge: number;
  /** Maximum age (inclusive) after which the adult version is used */
  maxAge: number;
  /** The adult tool this replaces */
  adultEquivalent: string;
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
  /** Whether guardian consent is required */
  requiresGuardianConsent: boolean;
  icon: string;
}

export const YOUTH_TOOL_REGISTRY: YouthToolDefinition[] = [
  {
    id: 'youth-energy-sort',
    name: 'Energy Sort (Youth)',
    description: 'Discover what activities give you energy vs. drain you. Sort school and extracurricular activities to find your natural energy patterns.',
    minAge: 14,
    maxAge: 24,
    adultEquivalent: 'energy-sort',
    estimatedMinutes: 10,
    requiresGuardianConsent: true,
    icon: '⚡',
  },
  {
    id: 'youth-fsi',
    name: 'Where Am I? (Youth Flux State)',
    description: 'Figure out where you are in your journey — exploring, drifting, pressured, committed, or mismatched. No wrong answers.',
    minAge: 14,
    maxAge: 24,
    adultEquivalent: 'fsi-30',
    estimatedMinutes: 8,
    requiresGuardianConsent: true,
    icon: '🧭',
  },
  {
    id: 'youth-career-finder',
    name: 'What Kind of Work Fits Me?',
    description: 'Based on your energy patterns, discover 8 types of work and which ones match you best. Plus: subjects and majors that align.',
    minAge: 14,
    maxAge: 24,
    adultEquivalent: 'career-family-finder',
    estimatedMinutes: 5,
    requiresGuardianConsent: false,
    icon: '🔍',
  },
];

/**
 * Get available tools for a given age, respecting age gates.
 * Returns youth tools for under-25, adult tools otherwise.
 */
export function getToolsForAge(age: number): {
  youthTools: YouthToolDefinition[];
  adultToolIds: string[];
} {
  if (age >= 25) {
    return {
      youthTools: [],
      adultToolIds: ['energy-sort', 'fsi-30', 'career-family-finder', 'gap-analysis', 'fix-vs-leave', 'path-sequencing', 'decision-profile'],
    };
  }

  const youthTools = YOUTH_TOOL_REGISTRY.filter(
    (t) => age >= t.minAge && age <= t.maxAge
  );

  // Users 18+ can also access some adult tools
  const adultToolIds: string[] = [];
  if (age >= 18) {
    adultToolIds.push('gap-analysis', 'path-sequencing');
  }
  if (age >= 20) {
    adultToolIds.push('fix-vs-leave', 'decision-profile');
  }

  return { youthTools, adultToolIds };
}

/**
 * Check whether a specific tool requires guardian consent for the given age.
 */
export function requiresGuardianConsent(toolId: string, age: number): boolean {
  if (age >= 18) return false;
  const tool = YOUTH_TOOL_REGISTRY.find((t) => t.id === toolId);
  return tool?.requiresGuardianConsent ?? false;
}
