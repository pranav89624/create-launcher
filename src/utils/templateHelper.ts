import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";
import { askPackageManager } from "../prompts.js";

// Ensure __dirname is defined for ES modules
// This is necessary because __dirname is not available in ES module context
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Copies a local template folder into a new project directory.
 * Also patches package.json with the new project name if present.
 *
 * @param {string} templateName - The folder name under /templates (e.g. "next-ts-tailwind")
 * @param {string} projectName - The new project folder name
 */

export async function copyTemplate(templateName: string, projectName: string) {
  try {
    const templatePath = path.resolve(
      __dirname,
      `../../templates/${templateName}`
    );
    const targetPath = path.resolve(process.cwd(), projectName);

    logger.info(`Creating template "${templateName}" at "${targetPath}"...`);
    await fs.copy(templatePath, targetPath, {
      overwrite: true,
      errorOnExist: false,
    });

    const pkgJsonPath = path.join(targetPath, "package.json");
    if (await fs.pathExists(pkgJsonPath)) {
      const pkg = await fs.readJson(pkgJsonPath);
      pkg.name = projectName;
      await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
      logger.info(`Updated package.json name to "${projectName}"`);
    } else {
      logger.info("No package.json found in template, skipping rename");
    }

    logger.success(`Template "${templateName}" created successfully!`);

    const pkgManager = await askPackageManager();
    logger.info("Installing dependencies (this might take a while)...");

    const installCmd = pkgManager === "yarn" ? [] : ["install"];

    await execa(pkgManager, installCmd, {
      cwd: targetPath,
      stdio: "inherit",
    });

    logger.success(`Project setup complete using ${pkgManager} 🚀`);
  } catch (err) {
    logger.error(
      `Failed to create template "${templateName}" or install dependencies:`
    );
    console.error(err);
    throw err;
  }
}
