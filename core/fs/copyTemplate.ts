import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { fileURLToPath } from "url";
import { logger } from "@core/logger.js";
import { askPackageManager } from "../../src/prompts/projectPrompts.js";
import { PackageManager } from "@core/types.js";

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
export async function copyTemplate(templateName: string, projectName: string): Promise<void> {
  const templatePath = path.resolve(__dirname, `../../templates/${templateName}`);
  const targetPath = path.resolve(process.cwd(), projectName);

  // Check if template exists
  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template "${templateName}" not found at ${templatePath}`);
  }

  // Check if target directory already exists
  if (await fs.pathExists(targetPath)) {
    throw new Error(`Directory "${projectName}" already exists`);
  }

  try {
    logger.info(`Creating project from "${templateName}" template...`);

    await fs.copy(templatePath, targetPath, {
      overwrite: false,
      errorOnExist: true,
    });

    await updatePackageJson(targetPath, projectName);

    logger.success(`Project structure created successfully!`);

    await installDependencies(targetPath);
  } catch (err) {
    // Cleanup on failure
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }
    throw err;
  }
}

async function updatePackageJson(targetPath: string, projectName: string): Promise<void> {
  const pkgJsonPath = path.join(targetPath, "package.json");

  if (await fs.pathExists(pkgJsonPath)) {
    const pkg = await fs.readJson(pkgJsonPath);
    pkg.name = projectName;
    await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
    logger.info(`Updated package.json with project name "${projectName}"`);
  }
}

async function installDependencies(targetPath: string): Promise<void> {
  const pkgManager = await askPackageManager();
  logger.info(`Installing dependencies with ${pkgManager}...`);

  const installCmd = pkgManager === PackageManager.YARN ? [] : ["install"];

  try {
    await execa(pkgManager, installCmd, {
      cwd: targetPath,
      stdio: "inherit",
    });

    logger.success(`Dependencies installed successfully! 🚀`);
  } catch (err) {
    logger.warn("Failed to install dependencies automatically. Error : ", err);
    logger.info(
      `You can install them manually by running: cd ${path.basename(targetPath)} && ${pkgManager} install`
    );
  }
}
