import prompts, { PromptObject } from "prompts";
import { TemplateType, PackageManager, ProjectConfig } from "../../core/types.js";
import { getTemplateFeatureMatrix, listTemplatesForPrompt } from "../../core/template/index.js";

function validateProjectName(name: string): string | boolean {
  if (!name.trim()) return "Name cannot be empty";
  if (!/^[a-zA-Z0-9-_]+$/.test(name))
    return "Name can only contain letters, numbers, hyphens, and underscores";
  if (name.startsWith("-") || name.startsWith("_"))
    return "Name cannot start with a hyphen or underscore";
  if (name.length > 50) return "Name must be 50 characters or less";
  return true;
}

export async function runCLIUserPrompts(): Promise<ProjectConfig> {
  const templateChoices = listTemplatesForPrompt();

  const questions: PromptObject[] = [
    {
      type: "text",
      name: "name",
      message: "What is your project named?",
      validate: validateProjectName,
    },
    {
      type: "select",
      name: "template",
      message: "Select a starter template",
      choices: templateChoices.map((choice) => ({
        title: choice.title,
        value: choice.type,
        description: choice.description,
      })),
    },
    {
      type: (prev) => {
        if (!prev) return null;
        const matrix = getTemplateFeatureMatrix(prev as TemplateType);
        return matrix.supportsTypeScript ? "confirm" : null;
      },
      name: "useTypeScript",
      message: "Use TypeScript?",
      initial: true,
    },
    {
      type: (_prev, values) => {
        const template = values.template as TemplateType | undefined;
        if (!template) return null;

        const matrix = getTemplateFeatureMatrix(template);

        if (!matrix.supportsTailwind) return null;

        const wantsTs = Boolean(values.useTypeScript);
        if (wantsTs && !matrix.supportsTailwindWithTypeScript) {
          return null;
        }

        if (!wantsTs && !matrix.supportsTailwindWithoutTypeScript) {
          return null;
        }

        return "confirm";
      },
      name: "useTailwind",
      message: "Include Tailwind CSS?",
      initial: true,
    },
    {
      type: "select",
      name: "packageManager",
      message: "Select a package manager",
      choices: [
        { title: "npm", value: PackageManager.NPM },
        { title: "yarn", value: PackageManager.YARN },
        { title: "pnpm", value: PackageManager.PNPM },
      ],
      initial: 0,
    },
    {
      type: "confirm",
      name: "installDeps",
      message: "Install dependencies automatically?",
      initial: true,
    },
  ];

  const response = await prompts(questions, {
    onCancel: () => {
      throw new Error("Project creation cancelled by user");
    },
  });

  return {
    name: response.name as string,
    template: response.template as TemplateType,
    useTypeScript: response.useTypeScript ?? false,
    useTailwind: response.useTailwind ?? false,
    packageManager: response.packageManager ?? PackageManager.NPM,
    installDeps: response.installDeps ?? true,
    branch: "main",
  };
}
