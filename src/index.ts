import { runPromptFlow, runAskTS, runAskTailwind } from "./prompts.js";
import { createNextApp } from "./actions/next.js";
import { createReactApp } from "./actions/react.js";
import { create11tyApp } from "./actions/11ty.js";
import { createVanillaApp } from "./actions/vanilla.js";
import { logger } from "./utils/logger.js";

async function main() {
  try {
    const { projectName, template } = await runPromptFlow();

    if (!projectName || !template) {
      logger.warn("Project name and template are required.");
      process.exit(0);
    }

    let useTypeScript: boolean;
    let useTailwindCSS: boolean;

    if (template === "11ty") {
      useTypeScript = false;
      useTailwindCSS = false;
    } else {
      useTypeScript = await runAskTS();
      if (useTypeScript) {
        logger.info("You chose to use TypeScript.");
      } else {
        logger.info("You chose not to use TypeScript.");
      }
      useTailwindCSS = await runAskTailwind();
      if (useTailwindCSS) {
        logger.info("You chose to use Tailwind CSS.");
      } else {
        logger.info("You chose not to use Tailwind CSS.");
      }
    }

    switch (template) {
      case "next":
        await createNextApp(projectName, useTypeScript, useTailwindCSS);
        break;
      case "react":
        await createReactApp(projectName, useTypeScript, useTailwindCSS);
        break;
      case "vanilla":
        await createVanillaApp(projectName, useTypeScript, useTailwindCSS);
        break;
      case "11ty":
        await create11tyApp(projectName);
        break;
      default:
        logger.error("Invalid template selected.");
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`An error occurred: ${error.message}`);
    } else {
      logger.error(`An error occurred: ${String(error)}`);
    }
    process.exit(1);
  }
}

main();
