export interface Book {
  id: string;
  title: string;
  universe: "logos" | "resonance" | "framework" | "philosophy" | "standalone";
  status: "available" | "coming-soon" | "in-progress";
  seriesOrder?: number;
  tagline?: string;
  coverImage?: string;
  coverAspectRatio: "2/3";
  purchaseUrl?: string;
  description?: string;
}

export const books: Book[] = [
  // LOGOS series (4 books)
  {
    id: "logos-1",
    title: "LOGOS: Book One",
    universe: "logos",
    status: "coming-soon",
    seriesOrder: 1,
    tagline: "The cost of fear is everything.",
    coverAspectRatio: "2/3",
    description: "The first book in the LOGOS series. A civilization discovers what fear costs when it becomes the operating system.",
  },
  {
    id: "logos-2",
    title: "LOGOS: Book Two",
    universe: "logos",
    status: "coming-soon",
    seriesOrder: 2,
    coverAspectRatio: "2/3",
  },
  {
    id: "logos-3",
    title: "LOGOS: Book Three",
    universe: "logos",
    status: "coming-soon",
    seriesOrder: 3,
    coverAspectRatio: "2/3",
  },
  {
    id: "logos-4",
    title: "LOGOS: Book Four",
    universe: "logos",
    status: "coming-soon",
    seriesOrder: 4,
    coverAspectRatio: "2/3",
  },

  // Resonance series (9 books)
  {
    id: "resonance-1",
    title: "Attunement",
    universe: "resonance",
    status: "in-progress",
    seriesOrder: 1,
    tagline: "What happens when a human consciousness is built to hold more than it was designed for.",
    coverAspectRatio: "2/3",
    description: "Book 1 of the Resonance series. The story begins with a single frequency that shouldn't exist.",
  },
  {
    id: "resonance-2",
    title: "Resonance: Book Two",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 2,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-3",
    title: "Resonance: Book Three",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 3,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-4",
    title: "Resonance: Book Four",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 4,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-5",
    title: "Resonance: Book Five",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 5,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-6",
    title: "Resonance: Book Six",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 6,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-7",
    title: "Resonance: Book Seven",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 7,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-8",
    title: "Resonance: Book Eight",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 8,
    coverAspectRatio: "2/3",
  },
  {
    id: "resonance-9",
    title: "Resonance: Book Nine",
    universe: "resonance",
    status: "coming-soon",
    seriesOrder: 9,
    coverAspectRatio: "2/3",
  },

  // Framework
  {
    id: "reprogram",
    title: "REPROGRAM",
    universe: "framework",
    status: "coming-soon",
    coverAspectRatio: "2/3",
    tagline: "You are not broken. There is nothing to fix.",
    description: "The REPROGRAM Framework. Eight elements. Not self-help — a structural model.",
  },

  // Philosophy
  {
    id: "effort-trap",
    title: "The Effort Trap",
    universe: "philosophy",
    status: "coming-soon",
    coverAspectRatio: "2/3",
    description: "Why doing more doesn't mean doing better.",
  },
  {
    id: "decision-engine",
    title: "The Decision Engine",
    universe: "philosophy",
    status: "coming-soon",
    coverAspectRatio: "2/3",
    description: "RDTE — a framework for making decisions that don't unravel.",
  },
  {
    id: "architecture-of-reality-1",
    title: "Architecture of Reality: Volume I",
    universe: "philosophy",
    status: "coming-soon",
    seriesOrder: 1,
    coverAspectRatio: "2/3",
  },
  {
    id: "architecture-of-reality-2",
    title: "Architecture of Reality: Volume II",
    universe: "philosophy",
    status: "coming-soon",
    seriesOrder: 2,
    coverAspectRatio: "2/3",
  },
  {
    id: "architecture-of-reality-3",
    title: "Architecture of Reality: Volume III",
    universe: "philosophy",
    status: "coming-soon",
    seriesOrder: 3,
    coverAspectRatio: "2/3",
  },
];
