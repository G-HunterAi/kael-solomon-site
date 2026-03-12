import { books } from "./books";

export const resonanceBooks = books
  .filter((b) => b.universe === "resonance")
  .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
