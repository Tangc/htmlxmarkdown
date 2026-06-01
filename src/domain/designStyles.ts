export interface DesignStyleOption {
  id: string;
  label: string;
  source: string;
  cssClass: string;
}

export const designStyleOptions = [
  {
    id: "soul-design-md",
    label: "Soul Design MD",
    source: "soulcore-dev/soul-design-md",
    cssClass: "design-soul-design-md"
  },
  {
    id: "mongodb-analysis",
    label: "MongoDB Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-mongodb-analysis"
  },
  {
    id: "awesome-tui-design",
    label: "Awesome TUI",
    source: "cola-runner/awesome-tui-design",
    cssClass: "design-awesome-tui"
  },
  {
    id: "nike-analysis",
    label: "Nike Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-nike-analysis"
  },
  {
    id: "spacex-inspired",
    label: "SpaceX Inspired",
    source: "voltagent/awesome-design-md",
    cssClass: "design-spacex-inspired"
  },
  {
    id: "wired-inspired",
    label: "Wired Inspired",
    source: "voltagent/awesome-design-md",
    cssClass: "design-wired-inspired"
  },
  {
    id: "design-bites",
    label: "Design Bites",
    source: "educlopez/design-bites",
    cssClass: "design-design-bites"
  },
  {
    id: "soul-design-md-alt",
    label: "Soul Design MD Alt",
    source: "soulcore-dev/soul-design-md",
    cssClass: "design-soul-design-md-alt"
  },
  {
    id: "awesome-tui-design-alt",
    label: "Awesome TUI Alt",
    source: "cola-runner/awesome-tui-design",
    cssClass: "design-awesome-tui-alt"
  },
  {
    id: "nika-design-skill",
    label: "Nika Design Skill",
    source: "supernovae-st/nika-design-skill",
    cssClass: "design-nika-design-skill"
  },
  {
    id: "impeccable",
    label: "Impeccable",
    source: "pbakaus/impeccable",
    cssClass: "design-impeccable"
  },
  {
    id: "awesome-design-md-jp",
    label: "Awesome Design JP",
    source: "kzhrknt/awesome-design-md-jp",
    cssClass: "design-awesome-design-jp"
  },
  {
    id: "voltagent-inspired",
    label: "VoltAgent Inspired",
    source: "voltagent/voltagent",
    cssClass: "design-voltagent-inspired"
  },
  {
    id: "bmw-m",
    label: "BMW M",
    source: "voltagent/awesome-design-md",
    cssClass: "design-bmw-m"
  },
  {
    id: "cursor-analysis",
    label: "Cursor Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-cursor-analysis"
  },
  {
    id: "apple-analysis",
    label: "Apple Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-apple-analysis"
  },
  {
    id: "ibm-analysis",
    label: "IBM Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-ibm-analysis"
  },
  {
    id: "notion-analysis",
    label: "Notion Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-notion-analysis"
  },
  {
    id: "claude-analysis",
    label: "Claude Analysis",
    source: "voltagent/awesome-design-md",
    cssClass: "design-claude-analysis"
  },
  {
    id: "mistral-ai",
    label: "Mistral AI",
    source: "voltagent/awesome-design-md",
    cssClass: "design-mistral-ai"
  }
] as const satisfies readonly DesignStyleOption[];

export type DesignStyleId = (typeof designStyleOptions)[number]["id"];

export const defaultDesignStyleId: DesignStyleId = "soul-design-md";

export function getDesignStyleOption(id: DesignStyleId): DesignStyleOption {
  return designStyleOptions.find((option) => option.id === id) ?? designStyleOptions[0];
}
