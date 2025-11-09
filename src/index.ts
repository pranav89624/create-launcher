import { runCLIUserPrompts } from "./prompts/projectPrompts.js";
import { createProject } from "./actions/index.js";
import { logger } from "../core/logger.js";
import { ProjectConfig } from "../core/types.js";
import { printBanner } from "../core/banner.js";

async function main(): Promise<void> {
  try {
    printBanner();
    logger.welcome();
    logger.step(1, 4, "Gathering project configuration...");

    const config: ProjectConfig = await runCLIUserPrompts();

    logger.step(2, 4, `Selected template: ${config.template}`);
    if (config.useTypeScript) logger.info("TypeScript enabled");
    if (config.useTailwind) logger.info("Tailwind CSS enabled");
    logger.info(`Package Manager: ${config.packageManager}`);
    if (!config.installDeps) logger.info("Dependencies will NOT be installed automatically");

    logger.step(3, 4, "Creating project...");
    await createProject(config);

    logger.step(4, 4, "Setup complete!");
    logger.completion(config.name, config.packageManager, config.installDeps);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("cancelled")) {
        logger.info("Operation cancelled by user.");
        process.exit(0);
      }
      logger.error(`An error occurred: ${error.message}`);
    } else {
      logger.error(`An error occurred: ${String(error)}`);
    }
    process.exit(1);
  }
}

// Graceful exit on Ctrl + C
process.on("SIGINT", () => {
  logger.info("\nOperation cancelled by user.");
  process.exit(0);
});

main();
