export type Screen =
  | { type: 'welcome' }
  | { type: 'sectionIntro'; section: 'cognitive' | 'applied' | 'character'; number: 1 | 2 | 3 }
  | { type: 'memorySource' }
  | { type: 'question'; questionId: string; questionNumber: number; sectionLabel: string }
  | { type: 'break'; number: 1 | 2; quote: string }
  | { type: 'submission' }

export const LITE_SCREEN_SEQUENCE: Screen[] = [
  { type: 'welcome' },
  { type: 'sectionIntro', section: 'cognitive', number: 1 },
  { type: 'memorySource' },
  { type: 'question', questionId: 'C2-P1', questionNumber: 1, sectionLabel: 'SECTION 1 \u00b7 COGNITIVE FOUNDATION' },
  { type: 'question', questionId: 'C3-1', questionNumber: 2, sectionLabel: 'SECTION 1 \u00b7 COGNITIVE FOUNDATION' },
  { type: 'question', questionId: 'D1-2', questionNumber: 3, sectionLabel: 'SECTION 1 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D2-2', questionNumber: 4, sectionLabel: 'SECTION 1 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D3-2', questionNumber: 5, sectionLabel: 'SECTION 1 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'C1-1', questionNumber: 6, sectionLabel: 'SECTION 1 \u00b7 COGNITIVE FOUNDATION' },
  { type: 'break', number: 1, quote: 'The quality of your thinking determines the quality of your decisions.' },
  { type: 'sectionIntro', section: 'applied', number: 2 },
  { type: 'question', questionId: 'D4-1', questionNumber: 7, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D5-P1', questionNumber: 8, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D6-P1', questionNumber: 9, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D7-1', questionNumber: 10, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D8-1', questionNumber: 11, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D9-P1', questionNumber: 12, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'break', number: 2, quote: "Genius isn\u2019t what you were born with. It\u2019s what you build." },
  { type: 'question', questionId: 'D10-1', questionNumber: 13, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D11-1', questionNumber: 14, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'question', questionId: 'D12-1', questionNumber: 15, sectionLabel: 'SECTION 2 \u00b7 APPLIED INTELLIGENCE' },
  { type: 'sectionIntro', section: 'character', number: 3 },
  { type: 'question', questionId: 'G1-1', questionNumber: 16, sectionLabel: 'SECTION 3 \u00b7 CHARACTER & GENERATIVE' },
  { type: 'question', questionId: 'G2-P1', questionNumber: 17, sectionLabel: 'SECTION 3 \u00b7 CHARACTER & GENERATIVE' },
  { type: 'question', questionId: 'G3-P1', questionNumber: 18, sectionLabel: 'SECTION 3 \u00b7 CHARACTER & GENERATIVE' },
  { type: 'submission' },
]
