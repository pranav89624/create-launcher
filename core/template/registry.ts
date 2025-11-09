import { z } from "zod";
import {
  NormalizedProjectConfig,
  PackageManager,
  ProjectConfig,
  TemplateFeatureFlags,
  TemplateRepositoryConfig,
  TemplateResolutionOptions,
  TemplateType,
  TemplateVariantMeta,
} from "../types.js";
import type { Result } from "../utils/result.js";

const templateVariantSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TemplateType),
  path: z.string(),
  features: z.object({
    typescript: z.boolean(),
    tailwind: z.boolean(),
  }),
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  recommendedPackageManager: z.nativeEnum(PackageManager).optional(),
});

const TEMPLATE_VARIANTS = {
  next: {
    id: "next",
    type: TemplateType.NEXT,
    path: "templates/next",
    features: { typescript: false, tailwind: false },
    title: "Next.js",
    description: "Server-rendered React with the Next.js App Router.",
    tags: ["frontend", "react", "nextjs"],
  },
  "next-tailwind": {
    id: "next-tailwind",
    type: TemplateType.NEXT,
    path: "templates/next-tailwind",
    features: { typescript: false, tailwind: true },
    title: "Next.js + Tailwind",
    description: "Next.js App Router starter with Tailwind CSS configured.",
    tags: ["frontend", "react", "nextjs", "tailwind"],
  },
  "next-ts": {
    id: "next-ts",
    type: TemplateType.NEXT,
    path: "templates/next-ts",
    features: { typescript: true, tailwind: false },
    title: "Next.js + TypeScript",
    description: "Next.js with full TypeScript configuration.",
    tags: ["frontend", "react", "nextjs", "typescript"],
  },
  "next-ts-tailwind": {
    id: "next-ts-tailwind",
    type: TemplateType.NEXT,
    path: "templates/next-ts-tailwind",
    features: { typescript: true, tailwind: true },
    title: "Next.js + TS + Tailwind",
    description: "Typed Next.js starter styled with Tailwind CSS.",
    tags: ["frontend", "react", "nextjs", "typescript", "tailwind"],
  },
  react: {
    id: "react",
    type: TemplateType.REACT,
    path: "templates/react",
    features: { typescript: false, tailwind: false },
    title: "React (Vite)",
    description: "Modern React starter powered by Vite.",
    tags: ["frontend", "react", "vite"],
  },
  "react-tailwind": {
    id: "react-tailwind",
    type: TemplateType.REACT,
    path: "templates/react-tailwind",
    features: { typescript: false, tailwind: true },
    title: "React + Tailwind",
    description: "React + Vite template with Tailwind CSS.",
    tags: ["frontend", "react", "vite", "tailwind"],
  },
  "react-ts": {
    id: "react-ts",
    type: TemplateType.REACT,
    path: "templates/react-ts",
    features: { typescript: true, tailwind: false },
    title: "React + TypeScript",
    description: "Typed React starter built on top of Vite.",
    tags: ["frontend", "react", "vite", "typescript"],
  },
  "react-ts-tailwind": {
    id: "react-ts-tailwind",
    type: TemplateType.REACT,
    path: "templates/react-ts-tailwind",
    features: { typescript: true, tailwind: true },
    title: "React + TS + Tailwind",
    description: "Typed React starter with Tailwind CSS.",
    tags: ["frontend", "react", "vite", "typescript", "tailwind"],
  },
  vanilla: {
    id: "vanilla",
    type: TemplateType.VANILLA,
    path: "templates/vanilla",
    features: { typescript: false, tailwind: false },
    title: "Vanilla JavaScript",
    description: "Plain HTML, CSS and JavaScript project.",
    tags: ["frontend", "vanilla"],
  },
  "vanilla-tailwind": {
    id: "vanilla-tailwind",
    type: TemplateType.VANILLA,
    path: "templates/vanilla-tailwind",
    features: { typescript: false, tailwind: true },
    title: "Vanilla + Tailwind",
    description: "Vanilla project pre-configured with Tailwind CSS.",
    tags: ["frontend", "vanilla", "tailwind"],
  },
  "vanilla-ts": {
    id: "vanilla-ts",
    type: TemplateType.VANILLA,
    path: "templates/vanilla-ts",
    features: { typescript: true, tailwind: false },
    title: "Vanilla + TypeScript",
    description: "Vanilla starter with TypeScript tooling.",
    tags: ["frontend", "vanilla", "typescript"],
  },
  "vanilla-ts-tailwind": {
    id: "vanilla-ts-tailwind",
    type: TemplateType.VANILLA,
    path: "templates/vanilla-ts-tailwind",
    features: { typescript: true, tailwind: true },
    title: "Vanilla + TS + Tailwind",
    description: "Vanilla + TypeScript starter styled with Tailwind CSS.",
    tags: ["frontend", "vanilla", "typescript", "tailwind"],
  },
  "11ty": {
    id: "11ty",
    type: TemplateType.ELEVENTY,
    path: "templates/11ty",
    features: { typescript: false, tailwind: false },
    title: "Eleventy (11ty)",
    description: "Static site generator powered by Eleventy.",
    tags: ["frontend", "static-site", "11ty"],
  },
} as const satisfies Record<string, TemplateVariantMeta>;

// Runtime validation - fails fast if registry definition drifts from schema
const registryValidation = templateVariantSchema
  .array()
  .safeParse(Object.values(TEMPLATE_VARIANTS));
if (!registryValidation.success) {
  throw new Error(`Template registry is invalid: ${registryValidation.error.message}`);
}

export type TemplateVariantId = keyof typeof TEMPLATE_VARIANTS;

const variantsByType = new Map<TemplateType, TemplateVariantMeta[]>(
  Object.values(TEMPLATE_VARIANTS).reduce((acc, variant) => {
    const list = acc.get(variant.type) ?? [];
    list.push(variant);
    acc.set(variant.type, list);
    return acc;
  }, new Map<TemplateType, TemplateVariantMeta[]>())
);

variantsByType.forEach((list) => list.sort(sortVariants));

function sortVariants(a: TemplateVariantMeta, b: TemplateVariantMeta): number {
  if (a.features.typescript !== b.features.typescript) {
    return a.features.typescript ? 1 : -1;
  }
  if (a.features.tailwind !== b.features.tailwind) {
    return a.features.tailwind ? 1 : -1;
  }
  return a.id.localeCompare(b.id);
}

export interface TemplateFeatureMatrix {
  supportsTypeScript: boolean;
  supportsTailwind: boolean;
  supportsTailwindWithTypeScript: boolean;
  supportsTailwindWithoutTypeScript: boolean;
}

export function getTemplateFeatureMatrix(template: TemplateType): TemplateFeatureMatrix {
  const variants = variantsByType.get(template) ?? [];
  const supportsTypeScript = variants.some((v) => v.features.typescript);
  const supportsTailwind = variants.some((v) => v.features.tailwind);
  const supportsTailwindWithTypeScript = variants.some(
    (v) => v.features.typescript && v.features.tailwind
  );
  const supportsTailwindWithoutTypeScript = variants.some(
    (v) => !v.features.typescript && v.features.tailwind
  );

  return {
    supportsTypeScript,
    supportsTailwind,
    supportsTailwindWithTypeScript,
    supportsTailwindWithoutTypeScript,
  };
}

export function listTemplatesForPrompt(): Array<{
  type: TemplateType;
  title: string;
  description?: string;
}> {
  const seen = new Set<TemplateType>();
  const result: Array<{ type: TemplateType; title: string; description?: string }> = [];

  Object.values(TEMPLATE_VARIANTS).forEach((variant) => {
    if (seen.has(variant.type)) {
      return;
    }
    seen.add(variant.type);
    result.push({ type: variant.type, title: variant.title, description: variant.description });
  });

  return result.sort((a, b) => a.title.localeCompare(b.title));
}

export interface TemplateResolutionError {
  code: "TEMPLATE_NOT_FOUND" | "UNSUPPORTED_COMBINATION" | "INVALID_CONFIGURATION";
  message: string;
  details?: Record<string, unknown>;
}

export function resolveTemplateVariant(
  options: TemplateResolutionOptions
): Result<TemplateVariantMeta, TemplateResolutionError> {
  const variants = variantsByType.get(options.template) ?? [];
  const match = variants.find(
    (variant) =>
      variant.features.typescript === options.features.typescript &&
      variant.features.tailwind === options.features.tailwind
  );

  if (!match) {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_COMBINATION",
        message: `Template "${options.template}" does not support the requested combination (TypeScript: ${options.features.typescript ? "yes" : "no"}, Tailwind: ${options.features.tailwind ? "yes" : "no"}).`,
        details: {
          template: options.template,
          features: options.features,
        },
      },
    };
  }

  return { ok: true, value: match };
}

export interface ProjectNormalizationInput {
  name: string;
  template: TemplateType;
  features: TemplateFeatureFlags;
  packageManager: PackageManager;
  installDeps: boolean;
  repository: TemplateRepositoryConfig;
}

export function toNormalizedProjectConfig(
  input: ProjectNormalizationInput
): Result<NormalizedProjectConfig, TemplateResolutionError> {
  const resolution = resolveTemplateVariant({
    template: input.template,
    features: input.features,
  });

  if (!resolution.ok) {
    return resolution;
  }

  return {
    ok: true,
    value: {
      name: input.name,
      template: input.template,
      features: input.features,
      packageManager: input.packageManager,
      installDeps: input.installDeps,
      repository: input.repository,
      variant: resolution.value,
    },
  };
}

export { TEMPLATE_VARIANTS };

function deriveSlugFromUrl(url: string): string {
  const trimmed = url.replace(/\.git$/u, "");

  if (trimmed.startsWith("git@")) {
    const match = trimmed.match(/^git@[^:]+:(?<owner>[^/]+)\/(?<repo>[^/]+)$/u);
    if (match?.groups) {
      return `${match.groups.owner}/${match.groups.repo}`;
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.endsWith("github.com")) {
      const parts = parsed.pathname.replace(/^\//u, "").split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
    }
  } catch {
    // Ignore URL parsing errors and fall through to final error.
  }

  throw new Error(
    `Unable to derive repository slug (owner/repo) from URL: ${url}. ` +
      "Set CREATE_LAUNCHER_TEMPLATE_REPO to a valid GitHub repository reference."
  );
}

const projectConfigSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Project name must be 50 characters or fewer")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Project name can only include letters, numbers, hyphen and underscore"
    ),
  template: z.nativeEnum(TemplateType),
  useTypeScript: z.boolean().optional(),
  useTailwind: z.boolean().optional(),
  packageManager: z.nativeEnum(PackageManager).optional(),
  installDeps: z.boolean().optional(),
  branch: z.string().min(1).optional(),
  repositoryUrl: z.string().min(1).optional(),
});

const DEFAULT_REPOSITORY_URL =
  process.env.CREATE_LAUNCHER_TEMPLATE_REPO ?? "https://github.com/pranav89624/create-launcher.git";
const DEFAULT_BRANCH = process.env.CREATE_LAUNCHER_TEMPLATE_BRANCH ?? "main";
const DEFAULT_PATH_PREFIX = "templates";

export function normalizeProjectConfig(
  rawConfig: ProjectConfig
): Result<NormalizedProjectConfig, TemplateResolutionError> {
  const validation = projectConfigSchema.safeParse(rawConfig);

  if (!validation.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_CONFIGURATION",
        message: "Provided configuration is invalid.",
        details: {
          issues: validation.error.issues,
        },
      },
    };
  }

  const parsed = validation.data;

  const features: TemplateFeatureFlags = {
    typescript: Boolean(parsed.useTypeScript),
    tailwind: Boolean(parsed.useTailwind),
  };

  const repository: TemplateRepositoryConfig = {
    url: parsed.repositoryUrl ?? DEFAULT_REPOSITORY_URL,
    branch: parsed.branch ?? DEFAULT_BRANCH,
    pathPrefix: DEFAULT_PATH_PREFIX,
    slug: deriveSlugFromUrl(parsed.repositoryUrl ?? DEFAULT_REPOSITORY_URL),
  };

  return toNormalizedProjectConfig({
    name: parsed.name,
    template: parsed.template,
    features,
    packageManager: parsed.packageManager ?? PackageManager.NPM,
    installDeps: parsed.installDeps ?? true,
    repository,
  });
}
