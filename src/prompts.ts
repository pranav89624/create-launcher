import prompts from "prompts";
import { TemplateType, PackageManager, PromptResponse } from './types.js';

function validateProjectName(name: string): string | boolean {
  if (name.trim() === "") return "Name cannot be empty";
  if (!/^[a-zA-Z0-9-_]+$/.test(name))
    return "Name can only contain letters, numbers, hyphens, and underscores";
  if (name.startsWith("-") || name.startsWith("_"))
    return "Name cannot start with a hyphen or underscore";
  if (name.length > 50) return "Name must be 50 characters or less";
  return true;
}

export async function runPromptFlow(): Promise<PromptResponse> {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "What is your project named?",
      validate: validateProjectName,
    },
    {
      type: "select",
      name: "template",
      message: "Select a starter template",
      choices: [
        { title: "Next.js", value: TemplateType.NEXT },
        { title: "React (Vite)", value: TemplateType.REACT },
        { title: "Vanilla JS", value: TemplateType.VANILLA },
        { title: "Eleventy (11ty)", value: TemplateType.ELEVENTY },
      ],
    },
  ]);
  
  // Handle user cancellation
  if (!response.projectName || !response.template) {
    throw new Error('Project creation cancelled by user');
  }
  
  return response as PromptResponse;
}

/**
 * Asks user for preferred package manager
 */
export async function askPackageManager(): Promise<PackageManager> {
  const { pm } = await prompts({
    type: "select",
    name: "pm",
    message: "Which package manager would you like to use?",
    choices: [
      { title: "npm", value: PackageManager.NPM },
      { title: "yarn", value: PackageManager.YARN },
      { title: "pnpm", value: PackageManager.PNPM },
    ],
    initial: 0,
  });

  return pm ?? PackageManager.NPM;
}

/**
 * Asks user if they want to use TypeScript
 */
export async function runAskTS(): Promise<boolean> {
  const { useTS } = await prompts({
    type: "confirm",
    name: "useTS",
    message: "Would you like to use TypeScript?",
    initial: false,
  });
  return useTS ?? false;
}

/**
 * Asks user if they want to use Tailwind CSS
 */
export async function runAskTailwind(): Promise<boolean> {
  const { useTailwind } = await prompts({
    type: "confirm",
    name: "useTailwind",
    message: "Would you like to use Tailwind CSS?",
    initial: false,
  });
  return useTailwind ?? false;
}
