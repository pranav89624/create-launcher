import prompts from "prompts";

export async function runPromptFlow() {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "What is your project named?",
      validate: (name) => {
        if (name.trim() === "") return "Name cannot be empty";
        if (!/^[a-zA-Z0-9-_]+$/.test(name))
          return "Name can only contain letters, numbers, hyphens, and underscores";
        if (name.startsWith("-") || name.startsWith("_"))
          return "Name cannot start with a hyphen or underscore";
        return true;
      },
    },
    {
      type: "select",
      name: "template",
      message: "Select a starter template",
      choices: [
        { title: "Next.js", value: "next" },
        { title: "React (Vite)", value: "react" },
        { title: "Vanilla JS", value: "vanilla" },
        { title: "Eleventy (11ty)", value: "11ty" },
      ],
    },
  ]);
  return response;
}

/**
 * Asks user for preferred package manager
 */
export async function askPackageManager(): Promise<"npm" | "yarn" | "pnpm"> {
  const { pm } = await prompts({
    type: "select",
    name: "pm",
    message: "You are using which package manager?",
    choices: [
      { title: "npm", value: "npm" },
      { title: "yarn", value: "yarn" },
      { title: "pnpm", value: "pnpm" },
    ],
    initial: 0,
  });

  return pm ?? "npm";
}

/**
 * Asks user if they want to use TypeScript
 */
export async function runAskTS() {
  const { useTS } = await prompts({
    type: "confirm",
    name: "useTS",
    message: "Would you like to use TypeScript?",
    initial: false,
  });
  return useTS;
}

/**
 * Asks user if they want to use Tailwind CSS
 */
export async function runAskTailwind() {
  const { useTailwind } = await prompts({
    type: "confirm",
    name: "useTailwind",
    message: "Would you like to use Tailwind CSS?",
    initial: false,
  });
  return useTailwind;
}
