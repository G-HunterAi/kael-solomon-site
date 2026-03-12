import type { Metadata } from "next";
import DiagnoseClient from "./DiagnoseClient";

export const metadata: Metadata = {
  title: "Diagnose — Kael Solomon",
  description:
    "The Reverse Decision Tree Engine. 7 instruments. ~40 minutes. 8 Career Families. Find your entry point.",
};

export default function DiagnosePage() {
  return <DiagnoseClient />;
}
