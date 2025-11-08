import { runPromptFlow, runAskTS, runAskTailwind } from "./prompts/projectPrompts.js";
import { createProject } from "./actions/index.js";
import { logger } from "@core/logger.js";
import { TemplateType, ProjectConfig } from "@core/types.js";

async function main(): Promise<void> {
  try {
    logger.welcome();

    logger.step(1, 4, "Getting project details...");
    const { projectName, template } = await runPromptFlow();

    let useTypeScript = false;
    let useTailwind = false;

    // Only ask about TS/Tailwind for frameworks that support them
    if (template !== TemplateType.ELEVENTY) {
      logger.step(2, 4, "Configuring options...");

      useTypeScript = await runAskTS();
      useTailwind = await runAskTailwind();

      if (useTypeScript) logger.info("TypeScript enabled");
      if (useTailwind) logger.info("Tailwind CSS enabled");
    } else {
      logger.step(2, 4, "Skipping options (not supported by Eleventy)...");
    }

    const config: ProjectConfig = {
      name: projectName,
      template,
      useTypeScript,
      useTailwind,
    };

    logger.step(3, 4, "Creating project...");
    await createProject(config);

    logger.step(4, 4, "Setup complete!");
    logger.completion(projectName);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("cancelled")) {
        logger.info("Operation cancelled by user.");
        process.exit(0);
      } else {
        logger.error(`An error occurred: ${error.message}`);
      }
    } else {
      logger.error(`An error occurred: ${String(error)}`);
    }
    process.exit(1);
  }
}

// Handle process interruption gracefully
process.on("SIGINT", () => {
  logger.info("\nOperation cancelled by user.");
  process.exit(0);
});

main();
