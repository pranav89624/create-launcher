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

export interface TemplateFeatureFlags {
  typescript: boolean;
  tailwind: boolean;
}

export interface TemplateRepositoryConfig {
  url: string; // Full git URL (https://... or git@...)
  branch: string;
  pathPrefix: string; // Usually "templates"
  slug: string; // owner/repo formatted for degit fallback
}

export interface TemplateVariantMeta {
  id: string; // e.g. "react-ts-tailwind"
  type: TemplateType;
  path: string; // Repo relative path
  features: TemplateFeatureFlags;
  title: string;
  description?: string;
  tags?: string[];
  recommendedPackageManager?: PackageManager;
}

export interface ProjectConfig {
  name: string;
  template: TemplateType;
  useTypeScript?: boolean;
  useTailwind?: boolean;
  packageManager: PackageManager;
  installDeps: boolean;
  branch?: string;
  repositoryUrl?: string;
}

export interface NormalizedProjectConfig {
  name: string;
  template: TemplateType;
  features: TemplateFeatureFlags;
  packageManager: PackageManager;
  installDeps: boolean;
  repository: TemplateRepositoryConfig;
  variant: TemplateVariantMeta;
}

export interface TemplateResolutionOptions {
  template: TemplateType;
  features: TemplateFeatureFlags;
}

export interface PromptResponse {
  projectName: string;
  template: TemplateType;
}
