import { books } from "./books";

export const logosBooks = books
  .filter((b) => b.universe === "logos")
  .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
