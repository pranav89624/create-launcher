import { runPromptFlow } from './prompts.js';
import { createNextApp } from './actions/next.js';
import { createReactApp } from './actions/react.js';
import { create11tyApp } from './actions/11ty.js';
import { createVanillaApp } from './actions/vanilla.js';
import { logger } from './utils/logger.js';

async function main() {
    const { projectName, template } = await runPromptFlow();

  if (!projectName || !template) {
    logger.warn('Project name and template are required.');
    process.exit(1);
  }

  switch (template) {
    case 'next':
      await createNextApp(projectName);
      break;
    case 'react':
      await createReactApp(projectName);
      break;
    case 'vanilla':
      await createVanillaApp(projectName);
      break;
    case '11ty':
      await create11tyApp(projectName);
      break;
    default:
      logger.error('Invalid template selected.');
  }
}

main();