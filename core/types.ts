export enum TemplateType {
  NEXT = "next",
  REACT = "react",
  VANILLA = "vanilla",
  ELEVENTY = "11ty",
}

export enum PackageManager {
  NPM = "npm",
  YARN = "yarn",
  PNPM = "pnpm",
}

export interface ProjectConfig {
  name: string;
  template: TemplateType;
  useTypeScript: boolean;
  useTailwind: boolean;
  packageManager?: PackageManager;
}

export interface PromptResponse {
  projectName: string;
  template: TemplateType;
}
