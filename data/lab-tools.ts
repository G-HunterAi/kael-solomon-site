export interface LabTool {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  tags: string[];
}

export const labTools: LabTool[] = [
  {
    id: "mission-control",
    name: "Mission Control v6",
    description: "AI fleet command center for Claude agents.",
    githubUrl: "https://github.com/G-HunterAi/mission-control",
    tags: ["Fleet management", "Open source"],
  },
  {
    id: "openclaw-event-bridge",
    name: "OpenClaw Event Bridge",
    description: "Real-time event bridge for Claude agent activity streams.",
    githubUrl: "#", // TODO: add URL when confirmed
    tags: ["Event streaming", "Open source"],
  },
  {
    id: "grandma-judy",
    name: "Grandma Judy Platform",
    description: "AI-powered recipe generation and video pipeline.",
    githubUrl: "https://github.com/G-HunterAi/judys-kitchen",
    tags: ["Recipe generation", "Open source"],
  },
];
