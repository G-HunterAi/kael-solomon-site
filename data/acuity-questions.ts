import type { Question } from '@/lib/acuity-types'

export const questions: Question[] = [
  // ─── C1: Memory & Comprehension ───────────────────────────────────────────────

  {
    id: 'C1-source',
    dimension: 'C1',
    section: 'cognitive',
    format: 'C',
    dimensionLabel: 'Memory & Comprehension',
    scenario:
      'Dana Reyes is a 41-year-old financial advisor who left her firm after 11 years. Her manager told her that her $34 million book of business wouldn\'t transfer with her. One of her longest-standing clients, Paul Ostrowski, told her directly: "I don\'t follow firms, I follow people. Wherever you go, I go." Her accountant warned that she\'d need at least six months of operating capital to sustain the transition. Dana resigned on a Thursday, two weeks after her 41st birthday, with $80,000 in personal savings and no outside investors.',
    memorySource: true,
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
  },

  {
    id: 'C1-1',
    dimension: 'C1',
    section: 'cognitive',
    format: 'C',
    dimensionLabel: 'Memory & Comprehension',
    scenario:
      'Think back to the account you read earlier about Dana Reyes. Answer these questions from memory.',
    prompt: 'What did Dana\'s manager tell her would NOT transfer when she left?',
    memoryRef: 'C1-source',
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Her salary and benefits package',
        tier: 0,
        rationale: 'incorrect recall',
      },
      {
        label: 'b',
        text: 'Her client list and contact files',
        tier: 0,
        rationale: 'plausible but inaccurate',
      },
      {
        label: 'c',
        text: 'Her book of business — $34 million in assets under management',
        tier: 3,
        rationale: 'exact detail from source passage',
      },
      {
        label: 'd',
        text: 'Her professional licenses and certifications',
        tier: 0,
        rationale: 'incorrect recall',
      },
    ],
  },

  // ─── C2: Linguistic Intelligence ──────────────────────────────────────────────

  {
    id: 'C2-P1',
    dimension: 'C2',
    section: 'cognitive',
    format: 'A',
    dimensionLabel: 'Linguistic Intelligence',
    scenario:
      "You've explained something you understand deeply — a business model, a process, a decision — to three different people this week. Each time you finished, they asked you to simplify. You explained carefully all three times. You're explaining again now.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Start over with one sentence: what this does and who it helps. Add detail only if they ask.',
        tier: 3,
        rationale: 'restructures the delivery architecture',
      },
      {
        label: 'b',
        text: "Ask which part specifically didn't land — find the gap, patch it",
        tier: 2,
        rationale: 'investigates but reactive',
      },
      {
        label: 'c',
        text: "They probably just need more context. Keep going — depth builds clarity eventually.",
        tier: 0,
        rationale: "doubles down on what already didn't work",
      },
      {
        label: 'd',
        text: 'Send a written follow-up — some people absorb better in writing',
        tier: 1,
        rationale: 'defers to different medium, avoids diagnosing pattern',
      },
    ],
  },

  // ─── C3: Logical Reasoning ────────────────────────────────────────────────────

  {
    id: 'C3-1',
    dimension: 'C3',
    section: 'cognitive',
    format: 'A',
    dimensionLabel: 'Logical Reasoning',
    scenario:
      'A friend is starting a health supplement company. He\'s been in the industry for three years as a sales rep. He shows you his business plan and makes the following argument:\n\n"Every person I talk to says they\'d pay for a high-quality supplement brand they could actually trust. I\'ve asked probably 200 people and they all say the same thing. The market is clearly there. We just need to build it."\n\nYou\'re considering investing $15,000. What\'s your assessment of his argument?',
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "The argument is solid — 200 people is a meaningful sample, and consistent feedback is a strong market signal. You invest.",
        tier: 0,
        rationale: 'accepts stated intent as validated demand',
      },
      {
        label: 'b',
        text: "You raise one concern: the supplement market is crowded and he'll need strong differentiation. Otherwise the logic seems fine.",
        tier: 1,
        rationale: 'surface-level objection, misses structural flaw',
      },
      {
        label: 'c',
        text: 'You recognize that "I would buy this" is not the same as "I will buy this" — intent surveys systematically overstate demand. You ask if there\'s any purchase data, waitlist signups, or early revenue before committing.',
        tier: 3,
        rationale: 'identifies the intent-action gap',
      },
      {
        label: 'd',
        text: "You tell him 200 people isn't a big enough sample and suggest he survey 1,000 before moving forward.",
        tier: 2,
        rationale: 'addresses sample size, misses the methodological flaw',
      },
    ],
  },

  // ─── D1: Contextual Judgment ──────────────────────────────────────────────────

  {
    id: 'D1-2',
    dimension: 'D1',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Contextual Judgment',
    scenario:
      "You're three months into managing a new team. Your highest performer has been quietly disengaged for two weeks — output down, messages shorter, declined two optional calls. No complaints. No direct statement. Your manager says let it play out.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Wait and watch — manager said it's fine",
        tier: 1,
        rationale: 'defers signal to authority',
      },
      {
        label: 'b',
        text: 'Schedule a casual 1:1, no agenda, create space for whatever needs to come up',
        tier: 3,
        rationale: 'reads signal, enters without pressure',
      },
      {
        label: 'c',
        text: 'Send a check-in message asking if everything is okay',
        tier: 2,
        rationale: 'acknowledges signal but creates pressure to perform fine',
      },
      {
        label: 'd',
        text: 'Increase his challenge level — engagement follows meaningful work',
        tier: 0,
        rationale: 'misreads signal, potentially accelerates exit',
      },
    ],
  },

  // ─── D2: Self-Authority ───────────────────────────────────────────────────────

  {
    id: 'D2-2',
    dimension: 'D2',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Self-Authority',
    scenario:
      "Six months into a role. You've identified a significant process inefficiency nobody else flagged. Your fix requires changing how two senior people work. You've tested your logic and you're confident you're right.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Wait until you've been there longer — still earning credibility",
        tier: 1,
        rationale: 'delay as social protection',
      },
      {
        label: 'b',
        text: 'Bring it to your direct manager, walk through the logic, let it move through proper channels',
        tier: 3,
        rationale: 'owns position, respects chain',
      },
      {
        label: 'c',
        text: 'Start implementing quietly where you can — let results speak before raising formally',
        tier: 1,
        rationale: 'bypasses accountability, creates political risk',
      },
      {
        label: 'd',
        text: "Let it go — not your mandate yet",
        tier: 0,
        rationale: 'abdicates',
      },
    ],
  },

  // ─── D3: Regulation Under Pressure ────────────────────────────────────────────

  {
    id: 'D3-2',
    dimension: 'D3',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Regulation Under Pressure',
    scenario:
      "You're presenting to 12 people including two potential funders. Twenty minutes in, two people start a side conversation you can hear. You lose your train of thought. One second to decide.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Power through — don't acknowledge it, finish the slide",
        tier: 1,
        rationale: 'fights hijack alone, performance degrades',
      },
      {
        label: 'b',
        text: 'Speed up to finish before losing the room',
        tier: 0,
        rationale: 'reactive acceleration, worsens',
      },
      {
        label: 'c',
        text: 'Pause. Visible breath. "What questions do you have so far?"',
        tier: 3,
        rationale: 'reclaims room through engagement, zero emotional reactivity',
      },
      {
        label: 'd',
        text: '"Let\'s make sure we\'re all in the same room"',
        tier: 3,
        rationale: 'direct, owns the space — slight confrontational risk',
      },
    ],
  },

  // ─── D4: Execution Capacity ───────────────────────────────────────────────────

  {
    id: 'D4-1',
    dimension: 'D4',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Execution Capacity',
    scenario:
      "You've been thinking about launching a consulting service for eight months. You have relevant experience, a clear target market, and two people who've already said they'd hire you. Your plan keeps expanding — you want a professional website, a clear service menu, a pricing structure, a contracts template, a LinkedIn strategy, and a few case studies ready before you officially launch. You're two months into building all of this. Nothing has launched. No money has come in.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Keep building. Launching before it's complete would undermine your credibility. Clients expect professionalism from day one.",
        tier: 0,
        rationale: 'delays indefinitely under cover of quality',
      },
      {
        label: 'b',
        text: "Set a hard launch date six weeks out, finish what you can, and launch with whatever's done by then.",
        tier: 2,
        rationale: 'uses deadline as forcing function but extends runway',
      },
      {
        label: 'c',
        text: "Email the two people who said they'd hire you today. Tell them you're taking clients starting next week and ask when they want to get started. The website can come later.",
        tier: 3,
        rationale: 'proof of concept over polish',
      },
      {
        label: 'd',
        text: "Call a few peers who've done this and get their advice on how they launched before committing to a timeline.",
        tier: 1,
        rationale: 'avoids decision by seeking more input',
      },
    ],
  },

  // ─── D5: Pattern Recognition ──────────────────────────────────────────────────

  {
    id: 'D5-P1',
    dimension: 'D5',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Pattern Recognition',
    scenario:
      "You've been in the same business for four years. Looking back, you realize three of your four major client losses had something in common: each one followed a leadership change at the client company within 60–90 days. At the time, each loss felt like a different reason — personality, project issues, market shift. You're noticing this for the first time now.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Three data points isn't really a pattern — hold it loosely, don't act on it yet",
        tier: 0,
        rationale: 'dismisses signal',
      },
      {
        label: 'b',
        text: 'Review each loss more carefully before drawing conclusions — validate before acting',
        tier: 2,
        rationale: 'reasonable but slow',
      },
      {
        label: 'c',
        text: "Tell your team — if others noticed it too, it confirms the pattern",
        tier: 1,
        rationale: 'seeks external validation before trusting own read',
      },
      {
        label: 'd',
        text: 'Flag it immediately: leadership change at a key client = elevated risk. Build a 60-day check-in into your process from now on.',
        tier: 3,
        rationale: 'converts pattern directly into operational system',
      },
    ],
  },

  // ─── D6: Reference Intelligence ───────────────────────────────────────────────

  {
    id: 'D6-P1',
    dimension: 'D6',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Reference Intelligence',
    scenario:
      "You're considering a significant career move: leaving a stable job for an early-stage startup you're excited about. The offer is strong. The founder impressed you in interviews. You have two weeks to decide.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Research online — press coverage, LinkedIn profiles, Glassdoor reviews',
        tier: 1,
        rationale: 'public sources, low-signal',
      },
      {
        label: 'b',
        text: 'Ask the founder for references and speak with them',
        tier: 0,
        rationale: 'founder-selected, guaranteed positive',
      },
      {
        label: 'c',
        text: 'Find someone who worked there in the last 12 months and left. Track them down on LinkedIn.',
        tier: 3,
        rationale: 'highest signal: direct experience, no incentive to recruit',
      },
      {
        label: 'd',
        text: 'Ask a trusted contact if they know anyone connected to the company',
        tier: 2,
        rationale: 'activates network but indirect',
      },
    ],
  },

  // ─── D7: Adaptive Learning ────────────────────────────────────────────────────

  {
    id: 'D7-1',
    dimension: 'D7',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Adaptive Learning',
    scenario:
      'For the past year, you\'ve been consuming information obsessively about building an online business — podcasts, books, courses, YouTube channels. You\'ve finished 4 courses, 12 books, and have nearly 200 hours of podcast listening. Your notes folder has 47 documents. Your business still hasn\'t launched. A mentor calls you out directly: "You\'re using learning as a substitute for doing. Every course is a way to feel like you\'re moving without actually moving."',
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Push back — you're building a knowledge base before launching and that's a legitimate strategy. Once you feel ready, you'll move fast.",
        tier: 0,
        rationale: 'defends learning behavior as preparation',
      },
      {
        label: 'b',
        text: 'Acknowledge the feedback, but decide to finish one more course — the one specifically about launch strategy — before taking action.',
        tier: 1,
        rationale: 'registers feedback superficially then returns to pattern',
      },
      {
        label: 'c',
        text: "Set a specific launch date for next week, identify one person you'll attempt to sell to before that date, and put all new content consumption on hold until that sale has either happened or definitively failed.",
        tier: 3,
        rationale: 'converts insight directly into behavioral constraint',
      },
      {
        label: 'd',
        text: 'Take a week off from consuming anything and spend it reviewing your notes to distill the most important lessons before moving forward.',
        tier: 2,
        rationale: 'shows awareness but stays in preparation frame',
      },
    ],
  },

  // ─── D8: Social Calibration ───────────────────────────────────────────────────

  {
    id: 'D8-1',
    dimension: 'D8',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Social Calibration',
    scenario:
      'You\'re deep in a conversation with a potential client about your consulting services. You\'ve been explaining your process in detail for about 12 minutes. The other person has responded with "yeah," "right," and "okay" a total of seven times in a row. They\'ve stopped asking questions. Their body language has shifted — arms crossed, eyes drifting toward the door behind you. You have three more key points to make.',
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Finish your three points — you're almost done and they represent the strongest part of your value proposition.",
        tier: 0,
        rationale: 'ignores social signal completely',
      },
      {
        label: 'b',
        text: "Compress your remaining points into 60 seconds, then close.",
        tier: 1,
        rationale: "accelerates but doesn't address dynamic",
      },
      {
        label: 'c',
        text: 'Stop mid-sentence, name what you\'re noticing, and ask: "I want to make sure I\'m giving you what\'s actually useful — what would be most helpful to dig into from here?"',
        tier: 3,
        rationale: 'stops, names dynamic, re-engages',
      },
      {
        label: 'd',
        text: 'Wrap up your current point, then ask a question to re-engage before continuing with the rest.',
        tier: 2,
        rationale: 'shows awareness but waits to finish current point',
      },
    ],
  },

  // ─── D9: Resilience Architecture ──────────────────────────────────────────────

  {
    id: 'D9-P1',
    dimension: 'D9',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Resilience Architecture',
    scenario:
      "Something significant fell apart three months ago — a deal you'd been building for eight months, a key relationship, a plan you'd organized your year around. The acute phase is over. You're functional again. But you haven't rebuilt momentum. You're moving carefully — more checking, more planning, less initiating than before.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Give it more time — this phase has a natural duration, and forcing it usually makes it worse",
        tier: 1,
        rationale: 'passive, indefinite; treats recovery as automatic',
      },
      {
        label: 'b',
        text: 'Take on something new — getting absorbed in a fresh project tends to restore forward motion better than examining the stuck feeling directly',
        tier: 2,
        rationale: 'reasonable mechanism but avoids original collapse',
      },
      {
        label: 'c',
        text: "Talk to someone you trust about where you actually are — naming it out loud is often the beginning of moving through it",
        tier: 2,
        rationale: 'activates support, good but preparatory',
      },
      {
        label: 'd',
        text: "Identify the one area where you stopped initiating, and take one action there today — not because you're ready, but because waiting to be ready is the maintenance of the stuck state",
        tier: 3,
        rationale: 'deliberate first action in exactly the domain where motion stopped',
      },
    ],
  },

  // ─── D10: Resourcefulness ─────────────────────────────────────────────────────

  {
    id: 'D10-1',
    dimension: 'D10',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Resourcefulness',
    scenario:
      "You're launching a consulting practice. Your strongest differentiator is a proprietary assessment tool you developed — but it currently lives in a spreadsheet, and every time you demo it to a serious prospect, interest cools when they see the format. You've gotten three software build quotes. The lowest is $18,000. You have $2,200. Your first serious prospect — a CEO whose network includes six other companies you'd love to work with — is ready for a pitch call in three weeks.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Delay the call until you can save enough to build the software version properly',
        tier: 0,
        rationale: 'avoids constraint, sacrifices opportunity',
      },
      {
        label: 'b',
        text: 'Show up to the call with the spreadsheet, acknowledge the format, and explain the software version is coming',
        tier: 1,
        rationale: 'shows up but opens with apology',
      },
      {
        label: 'c',
        text: 'Build a clean, clickable prototype in Figma or a no-code tool, present it as "the interface we\'re currently in final development on" — close the deal first, build when funded',
        tier: 2,
        rationale: 'clever workaround, handles optics',
      },
      {
        label: 'd',
        text: 'Reach out to a bootcamp developer or design grad who needs a real portfolio project — offer a rev-share and three weeks to build a functional MVP together, with you providing the IP and them the execution',
        tier: 3,
        rationale: 'builds coalition, turns constraint into creative deal',
      },
    ],
  },

  // ─── D11: Systems Thinking ────────────────────────────────────────────────────

  {
    id: 'D11-1',
    dimension: 'D11',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Systems Thinking',
    scenario:
      "You run a small restaurant — four years in, 40 seats, loyal following. This year word got out: you're fully booked every weekend, often midweek. Real money for the first time. The obvious move is to expand — the adjacent commercial space just opened up. It would take $200K and three months of construction. The expansion would nearly double your seating. A friend who runs a similar restaurant says: \"The busiest year I ever had was the year before everything fell apart.\" You've also been thinking about raising prices to manage demand more naturally.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Expand immediately — the demand is real, you've worked four years for this, and hesitation costs you",
        tier: 1,
        rationale: 'responds to visible signal, ignores lag and fixed cost implications',
      },
      {
        label: 'b',
        text: "Do nothing — the warning from your friend spooked you, and you don't want to over-extend",
        tier: 0,
        rationale: 'paralysis by anecdote, no systems reasoning',
      },
      {
        label: 'c',
        text: 'Raise prices 15-20%, watch demand response over 90 days, then revisit the expansion decision with real data about elasticity',
        tier: 3,
        rationale: 'uses price as information mechanism before committing capital',
      },
      {
        label: 'd',
        text: 'Take the adjacent space but add only 25-30% more seating rather than doubling — hedge the bet',
        tier: 2,
        rationale: 'hedges capital risk but commits without demand intelligence',
      },
    ],
  },

  // ─── D12: Temporal Intelligence ───────────────────────────────────────────────

  {
    id: 'D12-1',
    dimension: 'D12',
    section: 'applied',
    format: 'A',
    dimensionLabel: 'Temporal Intelligence',
    scenario:
      "You've been deep in a long-term project for four months — a business you believe in, slower to build than you expected but tracking. Out of nowhere, a contact offers you a six-week consulting engagement. Good money. Interesting work. Starts in ten days. Taking it means your project stalls. Declining means leaving real cash on the table.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: "Take the consulting work — the money is real and the project will still be there in six weeks",
        tier: 1,
        rationale: 'treats urgency as deciding factor',
      },
      {
        label: 'b',
        text: "Decline immediately — you made a commitment and short-term money isn't worth breaking it",
        tier: 2,
        rationale: 'values alignment over impulse but reflexive',
      },
      {
        label: 'c',
        text: "Ask yourself whether this opportunity moves toward or away from where you're building — then decide based on that, not the dollar amount",
        tier: 3,
        rationale: 'evaluates alignment, not just urgency',
      },
      {
        label: 'd',
        text: "Say yes, then figure out how to do both — you'll make it work",
        tier: 0,
        rationale: 'avoids real decision, doubles cognitive load',
      },
    ],
  },

  // ─── G1: Creative/Generative Thinking ─────────────────────────────────────────

  {
    id: 'G1-1',
    dimension: 'G1',
    section: 'character',
    format: 'A',
    dimensionLabel: 'Creative/Generative Thinking',
    scenario:
      "You're running a half-day workshop for 20 business owners on practical decision-making. The venue fell through 72 hours before the event. You've already promoted it — 18 people have confirmed. Canceling will damage your reputation as a reliable organizer. You need a space that holds 20 people, has a projector, and is within 10 miles of downtown. Budget for a new venue: $0.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Email all 18 confirmed attendees today — explain honestly that the venue fell through, note that several of them likely have conference rooms at their companies, and offer one free workshop credit to whoever provides the space',
        tier: 3,
        rationale: 'turns attendee list into resource, creates reciprocal value',
      },
      {
        label: 'b',
        text: 'Post urgently on LinkedIn explaining what happened and asking your network for help',
        tier: 1,
        rationale: 'broader reach but slower, less controllable',
      },
      {
        label: 'c',
        text: 'Contact a downtown hotel and offer to have the group buy breakfast there in exchange for use of a meeting room',
        tier: 2,
        rationale: 'creative value exchange but requires negotiation',
      },
      {
        label: 'd',
        text: 'Postpone the event two weeks and use the time to find and confirm a proper venue',
        tier: 0,
        rationale: 'abandons constraint, accepts reputation damage',
      },
    ],
  },

  // ─── G2: Self-Awareness Accuracy ──────────────────────────────────────────────

  {
    id: 'G2-P1',
    dimension: 'G2',
    section: 'character',
    format: 'A',
    dimensionLabel: 'Self-Awareness Accuracy',
    scenario:
      'You think of yourself as calm under pressure. It\'s part of your self-image. In a high-stakes meeting last month, you stayed quiet, made no visible display of stress, and delivered what you needed to deliver. Afterward, a colleague you trust said: "You seemed really tense in there — people noticed."',
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'They misread it — you were composed. You know how you operate.',
        tier: 0,
        rationale: 'defends self-model against external data',
      },
      {
        label: 'b',
        text: "Thank them and move on — composure sometimes reads as tension to people who aren't used to it",
        tier: 1,
        rationale: 'makes feedback plausibly dismissible',
      },
      {
        label: 'c',
        text: 'Reflect on it — you were more stressed than you showed; maybe it leaked more than you realized',
        tier: 2,
        rationale: 'honest internal engagement but private only',
      },
      {
        label: 'd',
        text: 'Ask one more person who was in that room: "Did I seem tense to you?" — not to validate your self-image, but to calibrate it',
        tier: 3,
        rationale: 'uses moment to refine self-perception accuracy',
      },
    ],
  },

  // ─── G3: Values Clarity ───────────────────────────────────────────────────────

  {
    id: 'G3-P1',
    dimension: 'G3',
    section: 'character',
    format: 'A',
    dimensionLabel: 'Values Clarity',
    scenario:
      "An opportunity comes in that would roughly double your current income. The work is legal, not harmful, and you'd be good at it. But it's entirely outside what you've been building — different industry, different mission, different kind of client. Saying yes means pausing the direction you've been on for 18 months.",
    liteVersion: true,
    standardVersion: true,
    deepVersion: true,
    phase: 1,
    options: [
      {
        label: 'a',
        text: 'Take it — money provides options, and options preserve the ability to return to your path later',
        tier: 1,
        rationale: 'financial logic real but values clarity absent',
      },
      {
        label: 'b',
        text: "Decline — you know what you're building and this isn't it",
        tier: 2,
        rationale: 'clear on direction but potentially reflexive',
      },
      {
        label: 'c',
        text: 'Ask yourself: in two years, which choice will I wish I made? Answer honestly.',
        tier: 2,
        rationale: 'useful framing but can rationalize either answer',
      },
      {
        label: 'd',
        text: 'Ask whether accepting requires you to be a different version of yourself, or just a busier one — and answer that honestly before anything else',
        tier: 3,
        rationale: 'the values question that precedes the financial one',
      },
    ],
  },
]

/**
 * Look up a single question by its id.
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}

/**
 * Return all questions flagged for the lite assessment version.
 */
export function getLiteQuestions(): Question[] {
  return questions.filter((q) => q.liteVersion)
}
