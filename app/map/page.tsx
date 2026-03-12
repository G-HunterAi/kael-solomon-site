import type { Metadata } from "next";
import MapClient from "./MapClient";

export const metadata: Metadata = {
  title: "Map of Me — Kael Solomon",
  description: "The most uncharted territory is the one you carry.",
};

export default function MapPage() {
  return <MapClient />;
}
