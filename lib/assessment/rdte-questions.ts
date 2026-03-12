// ============================================================================
// RDTE Sub-Component Assessment Questions
//
// Measures the 28 sub-components across 6 dimensions that feed into the
// Career Family scoring engine. Each component has questions at three
// language levels (simple, standard, professional) to support ages 14–65.
//
// Dimensions (28 sub-components):
//   Cognitive (C1-C6): Analytical, Creative, Verbal, Quantitative, Spatial, Processing
//   Personality (P1-P5): Extraversion, Intuition, Thinking/Feeling, Judging/Perceiving, VIA Cluster
//   Emotional Intelligence (E1-E5): Self-Awareness, Self-Regulation, Empathy, Social Skill, Drive
//   Energy (N1-N7): People, Problems, Completion, Mastery, Helping, Building, Complexity
//   Environment (V1-V5): Pace, Structure, Scale, Risk Tolerance, Autonomy
//   Values (H1-H5): Value #1-#5
//
// Design principles:
//   - Youth (14-17): Activity-based, concrete, school-context language
//   - Emerging (18-24): Hybrid, college/early-career language
//   - Adult (25+): Self-report, professional language
// ============================================================================

export type LanguageLevel = 'simple' | 'standard' | 'professional';

export interface RdteQuestion {
  id: string;
  component: string;
  dimension: string;
  text: Record<LanguageLevel, string>;
  subtext?: Record<LanguageLevel, string>;
  type: 'scale' | 'ranking' | 'scenario' | 'activity_sort';
  scaleMin?: number;
  scaleMax?: number;
  lowLabel?: Record<LanguageLevel, string>;
  highLabel?: Record<LanguageLevel, string>;
  /** For scenario type — age-appropriate situation descriptions */
  scenarios?: Record<LanguageLevel, { situation: string; options: { label: string; score: number }[] }>;
}

export interface RdteDimensionBlock {
  dimension: string;
  label: string;
  description: Record<LanguageLevel, string>;
  color: string;
  icon: string;
  questions: RdteQuestion[];
}

// ── Cognitive Dimension (C1-C6) ──

const cognitiveQuestions: RdteQuestion[] = [
  {
    id: 'C1',
    component: 'C1',
    dimension: 'Cognitive',
    text: {
      simple: 'When something doesn\'t make sense, how much do you enjoy figuring out why?',
      standard: 'How naturally do you break down complex problems into logical steps?',
      professional: 'Rate your analytical reasoning — the ability to decompose problems, identify root causes, and construct logical arguments.',
    },
    subtext: {
      simple: 'Like solving a puzzle, debugging an error, or figuring out why something broke.',
      standard: 'Think about how you approach homework, projects, or real-world problems.',
      professional: 'Consider your comfort with data analysis, troubleshooting, and structured reasoning.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I usually give up or ask someone',
      standard: 'I struggle with complex analysis',
      professional: 'Analytical reasoning is not a strength',
    },
    highLabel: {
      simple: 'I love figuring things out',
      standard: 'I naturally break problems apart',
      professional: 'Highly analytical and systematic',
    },
  },
  {
    id: 'C2',
    component: 'C2',
    dimension: 'Cognitive',
    text: {
      simple: 'How often do you come up with ideas that are different from what everyone else thinks?',
      standard: 'How naturally do original or unconventional ideas come to you?',
      professional: 'Rate your creative cognition — generating novel ideas, seeing unexpected connections, and thinking outside established patterns.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I usually go with what others suggest',
      standard: 'I tend to stick to proven approaches',
      professional: 'I prefer established methods over novel ones',
    },
    highLabel: {
      simple: 'I\'m always imagining new possibilities',
      standard: 'I constantly generate original ideas',
      professional: 'Highly creative and divergent in thinking',
    },
  },
  {
    id: 'C3',
    component: 'C3',
    dimension: 'Cognitive',
    text: {
      simple: 'How good are you at explaining things to other people using words?',
      standard: 'How effectively can you communicate complex ideas in writing or speech?',
      professional: 'Rate your verbal intelligence — articulation, persuasion, and the ability to translate complex concepts for different audiences.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I struggle to explain what I mean',
      standard: 'Communication is challenging for me',
      professional: 'Verbal communication is not a core strength',
    },
    highLabel: {
      simple: 'I\'m great at explaining things clearly',
      standard: 'I\'m highly articulate and persuasive',
      professional: 'Exceptional verbal and written communication',
    },
  },
  {
    id: 'C4',
    component: 'C4',
    dimension: 'Cognitive',
    text: {
      simple: 'How comfortable are you working with numbers and math?',
      standard: 'How naturally do you work with numbers, statistics, and quantitative data?',
      professional: 'Rate your quantitative reasoning — comfort with numbers, statistical thinking, financial modeling, and data-driven analysis.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Numbers stress me out',
      standard: 'Quantitative work is difficult for me',
      professional: 'I avoid quantitative analysis when possible',
    },
    highLabel: {
      simple: 'I think in numbers naturally',
      standard: 'I\'m very comfortable with data and stats',
      professional: 'Highly quantitative and data-native',
    },
  },
  {
    id: 'C5',
    component: 'C5',
    dimension: 'Cognitive',
    text: {
      simple: 'Can you easily picture things in your head — like how a room would look rearranged?',
      standard: 'How strong is your ability to visualize, design, or think in 3D space?',
      professional: 'Rate your spatial reasoning — visualization, design thinking, and the ability to mentally manipulate objects and spaces.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I can\'t picture things very well',
      standard: 'Spatial/visual thinking is hard for me',
      professional: 'Spatial reasoning is not a strength',
    },
    highLabel: {
      simple: 'I can see things clearly in my mind',
      standard: 'I think very visually and spatially',
      professional: 'Excellent spatial and design reasoning',
    },
  },
  {
    id: 'C6',
    component: 'C6',
    dimension: 'Cognitive',
    text: {
      simple: 'How quickly do you pick up new things and make decisions?',
      standard: 'How fast do you process new information and adapt to changing situations?',
      professional: 'Rate your processing speed — how quickly you absorb new information, make decisions under time pressure, and adapt to changing inputs.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I need a lot of time to learn new things',
      standard: 'I process information slowly but thoroughly',
      professional: 'I prefer deliberate, unhurried processing',
    },
    highLabel: {
      simple: 'I pick things up super fast',
      standard: 'I process and adapt very quickly',
      professional: 'Rapid processing and adaptation',
    },
  },
];

// ── Personality Dimension (P1-P5) ──

const personalityQuestions: RdteQuestion[] = [
  {
    id: 'P1',
    component: 'P1',
    dimension: 'Personality',
    text: {
      simple: 'After spending time with a group of people, do you feel more energized or more tired?',
      standard: 'How much energy do you get from social interaction vs. solitude?',
      professional: 'Rate your extraversion — the degree to which social interaction energizes vs. drains you.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Groups drain me, I recharge alone',
      standard: 'Strongly introverted',
      professional: 'Deep introversion — energized by solitude',
    },
    highLabel: {
      simple: 'I get energy from being around people',
      standard: 'Strongly extraverted',
      professional: 'High extraversion — energized by interaction',
    },
  },
  {
    id: 'P2',
    component: 'P2',
    dimension: 'Personality',
    text: {
      simple: 'Do you usually trust your gut feeling, or do you need to see facts first?',
      standard: 'Do you tend to trust gut instincts and patterns, or prefer concrete evidence?',
      professional: 'Rate your intuition style — reliance on pattern recognition and gut instinct vs. concrete sensory evidence.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I need to see proof before I believe something',
      standard: 'I rely on concrete evidence and details',
      professional: 'Strongly sensing — facts and data first',
    },
    highLabel: {
      simple: 'I just know things sometimes before I can explain why',
      standard: 'I trust patterns and gut feelings',
      professional: 'Strongly intuitive — pattern and possibility-driven',
    },
  },
  {
    id: 'P3',
    component: 'P3',
    dimension: 'Personality',
    text: {
      simple: 'When making a tough decision, do you go with what makes logical sense or what feels right?',
      standard: 'In decisions, do you prioritize logical consistency or human impact?',
      professional: 'Rate your thinking/feeling orientation — the balance between logical analysis and values-based, people-centered decision-making.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Logic and fairness come first',
      standard: 'I prioritize logic over feelings',
      professional: 'Strongly thinking — logic and principles first',
    },
    highLabel: {
      simple: 'How people feel matters most to me',
      standard: 'People and values come before logic',
      professional: 'Strongly feeling — values and human impact first',
    },
  },
  {
    id: 'P4',
    component: 'P4',
    dimension: 'Personality',
    text: {
      simple: 'Do you like having a plan and sticking to it, or do you prefer to go with the flow?',
      standard: 'Do you prefer structure and closure, or flexibility and open-endedness?',
      professional: 'Rate your judging/perceiving orientation — preference for structured plans and closure vs. flexibility and emergent possibilities.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I need a plan and get stressed without one',
      standard: 'I strongly prefer structure and closure',
      professional: 'Strongly judging — plans, schedules, and closure',
    },
    highLabel: {
      simple: 'I like keeping my options open and going with the flow',
      standard: 'I thrive with flexibility and spontaneity',
      professional: 'Strongly perceiving — flexibility and emergence',
    },
  },
  {
    id: 'P5',
    component: 'P5',
    dimension: 'Personality',
    text: {
      simple: 'Which of these matters most to you: being fair, being brave, being curious, being kind, or being disciplined?',
      standard: 'Which character strength cluster resonates most: justice, courage, wisdom, humanity, or temperance?',
      professional: 'Identify your primary VIA character strength cluster — the virtue category most central to your identity.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    subtext: {
      simple: 'There\'s no wrong answer — this is about what drives you most.',
      standard: 'Think about what you admire in yourself and what you naturally prioritize.',
      professional: 'Consider which virtue cluster you lean on most under pressure.',
    },
    lowLabel: {
      simple: 'I\'m still figuring out what matters to me',
      standard: 'My character strengths are diffuse',
      professional: 'No single dominant VIA cluster',
    },
    highLabel: {
      simple: 'I know exactly what matters most to me',
      standard: 'I have a very clear primary strength',
      professional: 'Strong, clear primary VIA cluster',
    },
  },
];

// ── Emotional Intelligence (E1-E5) ──

const emotionalIntelligenceQuestions: RdteQuestion[] = [
  {
    id: 'E1',
    component: 'E1',
    dimension: 'EmotionalIntelligence',
    text: {
      simple: 'How well do you know what you\'re feeling and why?',
      standard: 'How accurately can you identify and name your emotions in real time?',
      professional: 'Rate your emotional self-awareness — the ability to recognize, name, and understand the causes of your emotional states.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I often don\'t know what I\'m feeling',
      standard: 'I struggle to identify my emotions',
      professional: 'Low emotional self-awareness',
    },
    highLabel: {
      simple: 'I always know exactly how I feel and why',
      standard: 'I\'m very in tune with my emotional states',
      professional: 'Highly emotionally self-aware',
    },
  },
  {
    id: 'E2',
    component: 'E2',
    dimension: 'EmotionalIntelligence',
    text: {
      simple: 'When you get really frustrated or angry, can you stop yourself from reacting badly?',
      standard: 'How well can you manage strong emotions without being controlled by them?',
      professional: 'Rate your emotional self-regulation — the ability to manage impulses, tolerate discomfort, and maintain composure under stress.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I react before I think',
      standard: 'I struggle to control strong emotions',
      professional: 'Emotional regulation is challenging',
    },
    highLabel: {
      simple: 'I can stay calm even when I\'m upset',
      standard: 'I manage my emotions very effectively',
      professional: 'Excellent emotional self-regulation',
    },
  },
  {
    id: 'E3',
    component: 'E3',
    dimension: 'EmotionalIntelligence',
    text: {
      simple: 'How easily can you tell what someone else is feeling, even if they don\'t say it?',
      standard: 'How naturally do you pick up on and understand others\' emotions?',
      professional: 'Rate your empathy — the ability to perceive, understand, and respond to the emotional states of others.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I usually can\'t tell what others are feeling',
      standard: 'I often miss emotional cues from others',
      professional: 'Low empathic perception',
    },
    highLabel: {
      simple: 'I always pick up on how others feel',
      standard: 'I\'m highly attuned to others\' emotions',
      professional: 'Exceptionally empathic',
    },
  },
  {
    id: 'E4',
    component: 'E4',
    dimension: 'EmotionalIntelligence',
    text: {
      simple: 'How good are you at getting along with different kinds of people?',
      standard: 'How effectively do you navigate social dynamics, build rapport, and influence others?',
      professional: 'Rate your social skill — the ability to build relationships, navigate group dynamics, and influence outcomes through interpersonal effectiveness.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I find social situations confusing',
      standard: 'Social situations are draining',
      professional: 'Social and political navigation is not a strength',
    },
    highLabel: {
      simple: 'I get along with pretty much everyone',
      standard: 'I\'m very socially skilled and influential',
      professional: 'Highly skilled at social navigation and influence',
    },
  },
  {
    id: 'E5',
    component: 'E5',
    dimension: 'EmotionalIntelligence',
    text: {
      simple: 'When something is really hard, do you keep going or give up?',
      standard: 'How strong is your internal drive to persist through challenges and setbacks?',
      professional: 'Rate your intrinsic drive — persistence through adversity, self-motivation, and the ability to sustain effort without external reinforcement.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I give up when things get too hard',
      standard: 'I lose motivation when faced with setbacks',
      professional: 'Drive and persistence are inconsistent',
    },
    highLabel: {
      simple: 'I never give up, even when it\'s really tough',
      standard: 'I\'m extremely persistent and self-motivated',
      professional: 'Exceptionally driven and resilient',
    },
  },
];

// ── Energy Dimension (N1-N7) ──

const energyQuestions: RdteQuestion[] = [
  {
    id: 'N1',
    component: 'N1',
    dimension: 'Energy',
    text: {
      simple: 'How much energy do you get from working with other people?',
      standard: 'How energized are you by collaborating with, leading, or helping people?',
      professional: 'Rate your People energy — the degree to which interpersonal work (collaboration, mentoring, leading teams) energizes you.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'People work drains me',
      standard: 'People-centric work is tiring',
      professional: 'Low People energy',
    },
    highLabel: {
      simple: 'Working with people lights me up',
      standard: 'I\'m most alive working with people',
      professional: 'Very high People energy',
    },
  },
  {
    id: 'N2',
    component: 'N2',
    dimension: 'Energy',
    text: {
      simple: 'Do you enjoy tackling problems that seem impossible to solve?',
      standard: 'How much energy do you get from solving hard, ambiguous problems?',
      professional: 'Rate your Problem energy — the degree to which difficult, ambiguous problems energize rather than exhaust you.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Hard problems stress me out',
      standard: 'Ambiguous problems drain me',
      professional: 'Low Problem energy',
    },
    highLabel: {
      simple: 'The harder the problem, the more excited I get',
      standard: 'I thrive on complexity and ambiguity',
      professional: 'Very high Problem energy',
    },
  },
  {
    id: 'N3',
    component: 'N3',
    dimension: 'Energy',
    text: {
      simple: 'How satisfying is it for you to finish something completely?',
      standard: 'How much energy do you get from completing tasks and crossing things off?',
      professional: 'Rate your Completion energy — the drive to finish things, close loops, and achieve tangible deliverables.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I start lots of things but don\'t always finish',
      standard: 'Finishing isn\'t as exciting as starting',
      professional: 'Low Completion energy',
    },
    highLabel: {
      simple: 'Finishing things is the best feeling',
      standard: 'I love the satisfaction of completion',
      professional: 'Very high Completion energy',
    },
  },
  {
    id: 'N4',
    component: 'N4',
    dimension: 'Energy',
    text: {
      simple: 'Do you enjoy getting really, really good at something?',
      standard: 'How energized are you by the process of deep learning and mastery?',
      professional: 'Rate your Mastery energy — the drive to develop deep expertise, pursue mastery, and continuously improve in a domain.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I\'d rather try lots of things than go deep on one',
      standard: 'I prefer breadth over depth',
      professional: 'Low Mastery energy',
    },
    highLabel: {
      simple: 'I love going deep and becoming an expert',
      standard: 'I\'m driven to achieve deep expertise',
      professional: 'Very high Mastery energy',
    },
  },
  {
    id: 'N5',
    component: 'N5',
    dimension: 'Energy',
    text: {
      simple: 'How much do you enjoy helping someone else succeed or feel better?',
      standard: 'How energized are you by making a positive difference in someone\'s life?',
      professional: 'Rate your Helping energy — the drive to support, nurture, heal, or develop other people.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Helping others isn\'t really my thing',
      standard: 'I\'m more focused on my own goals',
      professional: 'Low Helping energy',
    },
    highLabel: {
      simple: 'Helping others makes my day',
      standard: 'I\'m deeply motivated by service',
      professional: 'Very high Helping energy',
    },
  },
  {
    id: 'N6',
    component: 'N6',
    dimension: 'Energy',
    text: {
      simple: 'Do you enjoy making things — building, creating, or constructing?',
      standard: 'How energized are you by creating tangible things from scratch?',
      professional: 'Rate your Building energy — the drive to create, construct, ship products, and bring ideas to tangible form.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I\'m better at using things than making them',
      standard: 'Building from scratch isn\'t my thing',
      professional: 'Low Building energy',
    },
    highLabel: {
      simple: 'I love building things with my hands or on a computer',
      standard: 'Creating from scratch is my highest drive',
      professional: 'Very high Building energy',
    },
  },
  {
    id: 'N7',
    component: 'N7',
    dimension: 'Energy',
    text: {
      simple: 'Do you enjoy thinking about complicated things with lots of moving parts?',
      standard: 'How energized are you by working on systems with many interconnected variables?',
      professional: 'Rate your Complexity energy — the drive to engage with multi-variable systems, strategy, and interconnected dynamics.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I prefer things simple and straightforward',
      standard: 'I avoid unnecessary complexity',
      professional: 'Low Complexity energy',
    },
    highLabel: {
      simple: 'The more complicated, the more interesting',
      standard: 'I thrive in complex, multi-variable systems',
      professional: 'Very high Complexity energy',
    },
  },
];

// ── Environment Dimension (V1-V5) ──

const environmentQuestions: RdteQuestion[] = [
  {
    id: 'V1',
    component: 'V1',
    dimension: 'Environment',
    text: {
      simple: 'Do you like things fast-paced or slow and steady?',
      standard: 'What work pace suits you best — fast and high-energy, or measured and deliberate?',
      professional: 'Rate your ideal work pace — from deliberate and methodical to rapid-fire and high-intensity.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'Slow and steady wins the race',
      standard: 'I prefer a measured, deliberate pace',
      professional: 'Strongly methodical pace preference',
    },
    highLabel: {
      simple: 'I want everything fast and exciting',
      standard: 'I thrive in fast-paced environments',
      professional: 'Strongly high-intensity pace preference',
    },
  },
  {
    id: 'V2',
    component: 'V2',
    dimension: 'Environment',
    text: {
      simple: 'Do you like having clear rules and routines, or do you prefer figuring it out as you go?',
      standard: 'How much structure do you want in your work — clear processes, or freedom to improvise?',
      professional: 'Rate your structure preference — from highly defined processes and procedures to fluid, self-organizing environments.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I don\'t like being told exactly what to do',
      standard: 'I prefer minimal structure',
      professional: 'Low structure — highly fluid environments',
    },
    highLabel: {
      simple: 'I work best when I know exactly what\'s expected',
      standard: 'I thrive with clear processes and expectations',
      professional: 'High structure — defined processes and standards',
    },
  },
  {
    id: 'V3',
    component: 'V3',
    dimension: 'Environment',
    text: {
      simple: 'Would you rather work on something small that you can control, or something big that affects many people?',
      standard: 'Do you prefer working at small scale (craft) or large scale (enterprise)?',
      professional: 'Rate your scale preference — from boutique/craft-scale work to large-scale institutional or enterprise impact.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I like small, personal projects',
      standard: 'I prefer intimate, focused work',
      professional: 'Small scale — craft and boutique environments',
    },
    highLabel: {
      simple: 'I want to work on something that changes the world',
      standard: 'I want maximum scale and impact',
      professional: 'Large scale — enterprise and institutional impact',
    },
  },
  {
    id: 'V4',
    component: 'V4',
    dimension: 'Environment',
    text: {
      simple: 'How do you feel about taking big risks?',
      standard: 'How comfortable are you with uncertainty and high-stakes decisions?',
      professional: 'Rate your risk tolerance — from strong preference for stability and predictability to comfort with ambiguity and high-stakes bets.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I\'d rather play it safe',
      standard: 'I strongly prefer stability and predictability',
      professional: 'Low risk tolerance — stability-seeking',
    },
    highLabel: {
      simple: 'I love taking chances on big things',
      standard: 'I thrive with risk and uncertainty',
      professional: 'High risk tolerance — comfort with ambiguity',
    },
  },
  {
    id: 'V5',
    component: 'V5',
    dimension: 'Environment',
    text: {
      simple: 'Do you like being told what to do, or do you prefer doing things your own way?',
      standard: 'How much autonomy do you need — freedom to set your own direction?',
      professional: 'Rate your autonomy need — from comfort with directed work to strong need for self-direction and independent decision-making.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I like it when someone shows me what to do',
      standard: 'I\'m comfortable being directed',
      professional: 'Low autonomy need — comfortable with direction',
    },
    highLabel: {
      simple: 'I need to do things my own way',
      standard: 'I must have full control over my work',
      professional: 'Very high autonomy — self-directed and independent',
    },
  },
];

// ── Values Dimension (H1-H5) ──

const valuesQuestions: RdteQuestion[] = [
  {
    id: 'H1',
    component: 'H1',
    dimension: 'Values',
    text: {
      simple: 'What matters most to you in life right now?',
      standard: 'What is your #1 core value — the thing you\'d sacrifice other things to protect?',
      professional: 'Identify your primary value — the non-negotiable principle that most strongly governs your major decisions.',
    },
    subtext: {
      simple: 'Think about what you\'d fight for if you had to choose.',
      standard: 'Think family, freedom, justice, creativity, security, growth, service, etc.',
      professional: 'Consider: family, autonomy, impact, security, creativity, justice, mastery, connection, health, wealth.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: {
      simple: 'I\'m not sure what matters most to me',
      standard: 'My values are unclear or shifting',
      professional: 'Value hierarchy is undefined',
    },
    highLabel: {
      simple: 'I know exactly what I care about most',
      standard: 'My #1 value is crystal clear',
      professional: 'Primary value is clear and strongly held',
    },
  },
  {
    id: 'H2',
    component: 'H2',
    dimension: 'Values',
    text: {
      simple: 'What\'s the second most important thing to you?',
      standard: 'What is your #2 core value?',
      professional: 'Identify your secondary value.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: { simple: 'Unclear', standard: 'Unclear', professional: 'Undefined' },
    highLabel: { simple: 'Very clear', standard: 'Crystal clear', professional: 'Clear and strongly held' },
  },
  {
    id: 'H3',
    component: 'H3',
    dimension: 'Values',
    text: {
      simple: 'And the third?',
      standard: 'What is your #3 core value?',
      professional: 'Identify your tertiary value.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: { simple: 'Unclear', standard: 'Unclear', professional: 'Undefined' },
    highLabel: { simple: 'Very clear', standard: 'Crystal clear', professional: 'Clear and strongly held' },
  },
  {
    id: 'H4',
    component: 'H4',
    dimension: 'Values',
    text: {
      simple: 'Fourth?',
      standard: 'What is your #4 core value?',
      professional: 'Identify your fourth value.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: { simple: 'Unclear', standard: 'Unclear', professional: 'Undefined' },
    highLabel: { simple: 'Very clear', standard: 'Crystal clear', professional: 'Clear and strongly held' },
  },
  {
    id: 'H5',
    component: 'H5',
    dimension: 'Values',
    text: {
      simple: 'Fifth?',
      standard: 'What is your #5 core value?',
      professional: 'Identify your fifth value.',
    },
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
    lowLabel: { simple: 'Unclear', standard: 'Unclear', professional: 'Undefined' },
    highLabel: { simple: 'Very clear', standard: 'Crystal clear', professional: 'Clear and strongly held' },
  },
];

// ── Assembled Dimension Blocks ──

export const RDTE_DIMENSION_BLOCKS: RdteDimensionBlock[] = [
  {
    dimension: 'Cognitive',
    label: 'Cognitive Abilities',
    description: {
      simple: 'How your brain works — solving, creating, communicating, and processing.',
      standard: 'Your cognitive strengths — how you think, analyze, create, and process information.',
      professional: 'Cognitive profile — analytical, creative, verbal, quantitative, spatial, and processing capabilities.',
    },
    color: 'text-blue-600',
    icon: '🧠',
    questions: cognitiveQuestions,
  },
  {
    dimension: 'Personality',
    label: 'Personality',
    description: {
      simple: 'How you naturally are — with people, decisions, structure, and what drives you.',
      standard: 'Your personality tendencies — social energy, decision style, structure preference, and character strengths.',
      professional: 'Personality dimensions — extraversion, intuition, thinking/feeling orientation, judging/perceiving style, and VIA character strengths.',
    },
    color: 'text-violet-600',
    icon: '🎭',
    questions: personalityQuestions,
  },
  {
    dimension: 'EmotionalIntelligence',
    label: 'Emotional Intelligence',
    description: {
      simple: 'How well you understand yourself and others — and how you handle tough situations.',
      standard: 'Your emotional skills — self-awareness, regulation, empathy, social navigation, and drive.',
      professional: 'Emotional intelligence profile — self-awareness, self-regulation, empathy, social skill, and intrinsic motivation.',
    },
    color: 'text-amber-600',
    icon: '❤️',
    questions: emotionalIntelligenceQuestions,
  },
  {
    dimension: 'Energy',
    label: 'Energy Patterns',
    description: {
      simple: 'What gives you energy and what drains you — the activities that light you up.',
      standard: 'Your energy patterns — which activities naturally energize vs. deplete you.',
      professional: 'Energy dimension — the seven work energy patterns that reveal your natural career alignment.',
    },
    color: 'text-emerald-600',
    icon: '⚡',
    questions: energyQuestions,
  },
  {
    dimension: 'Environment',
    label: 'Work Environment',
    description: {
      simple: 'What kind of setting works best for you — fast or slow, big or small, free or structured.',
      standard: 'Your ideal work environment — pace, structure, scale, risk, and autonomy preferences.',
      professional: 'Environment preferences — optimal pace, structure, organizational scale, risk tolerance, and autonomy requirements.',
    },
    color: 'text-rose-600',
    icon: '🏢',
    questions: environmentQuestions,
  },
  {
    dimension: 'Values',
    label: 'Core Values',
    description: {
      simple: 'What matters most to you — the things you wouldn\'t give up.',
      standard: 'Your value hierarchy — the top 5 principles that drive your biggest decisions.',
      professional: 'Value hierarchy — the ordered set of non-negotiable principles governing your career and life decisions.',
    },
    color: 'text-indigo-600',
    icon: '⭐',
    questions: valuesQuestions,
  },
];

// ── Question Lookup ──

const questionMap = new Map<string, RdteQuestion>();
for (const block of RDTE_DIMENSION_BLOCKS) {
  for (const q of block.questions) {
    questionMap.set(q.id, q);
  }
}

/**
 * Get a single RDTE question by component ID.
 */
export function getRdteQuestion(componentId: string): RdteQuestion | undefined {
  return questionMap.get(componentId);
}

/**
 * Get all RDTE questions for a given dimension.
 */
export function getRdteQuestionsByDimension(dimension: string): RdteQuestion[] {
  const block = RDTE_DIMENSION_BLOCKS.find((b) => b.dimension === dimension);
  return block?.questions ?? [];
}
