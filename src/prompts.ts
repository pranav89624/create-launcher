import prompts from 'prompts';

export async function runPromptFlow() {
  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      validate: name => name.trim() === '' ? 'Name cannot be empty' : true
    },
    {
      type: 'select',
      name: 'template',
      message: 'Select a starter template',
      choices: [
        { title: 'Next.js', value: 'next' },
        { title: 'React (Vite)', value: 'react' },
        { title: 'Vanilla JS', value: 'vanilla' },
        { title: 'Eleventy (11ty)', value: '11ty' }
      ]
    }
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