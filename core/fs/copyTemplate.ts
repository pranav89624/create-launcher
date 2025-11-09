import fs from "fs-extra";
import path from "node:path";
import { execa } from "execa";
import { logger } from "../logger.js";
import { NormalizedProjectConfig, PackageManager } from "../types.js";
import { ensureDir } from "./ensureDir.js";
import { safeExec } from "../utils/result.js";

/**
 * Copies template from a source path into project directory,
 * updates package.json and installs dependencies if enabled.
 */
export async function copyTemplate(
  sourcePath: string,
  config: NormalizedProjectConfig
): Promise<string> {
  const targetPath = path.resolve(process.cwd(), config.name);

  if (await fs.pathExists(targetPath)) {
    throw new Error(`Directory "${config.name}" already exists in ${process.cwd()}`);
  }

  if (!(await fs.pathExists(sourcePath))) {
    throw new Error(`Template source path does not exist: ${sourcePath}`);
  }

  await ensureDir(path.dirname(targetPath));

  try {
    logger.info(`Copying template into "${config.name}"...`);
    await fs.copy(sourcePath, targetPath, { overwrite: false, errorOnExist: true });

    await updatePackageJson(targetPath, config.name);
    logger.success("Template files copied successfully.");

    return targetPath;
  } catch (error) {
    logger.error("Project creation failed while copying files.", error);
    await fs.remove(targetPath).catch(() => undefined);
    throw error;
  }
}

async function updatePackageJson(targetPath: string, projectName: string): Promise<void> {
  const pkgPath = path.join(targetPath, "package.json");
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    logger.info(`Updated package.json → name: "${projectName}"`);
  }
}

export async function installProjectDependencies(
  targetPath: string,
  config: NormalizedProjectConfig
): Promise<void> {
  if (!config.installDeps) {
    logger.warn("Skipped dependency installation as requested.");
    logger.info(`Run "${config.packageManager} install" inside ${config.name} when ready.`);
    return;
  }

  const pkgManager = config.packageManager;
  logger.info(`Installing dependencies with ${pkgManager}...`);

  const installArgs = pkgManager === PackageManager.YARN ? [] : ["install"];
  const command = pkgManager === PackageManager.YARN ? "yarn" : `${pkgManager} install`;

  const installResult = await safeExec(() =>
    execa(pkgManager, installArgs, {
      cwd: targetPath,
      stdio: "inherit",
    })
  );

  if (installResult.ok) {
    logger.success("Dependencies installed successfully.");
    return;
  }

  logger.warn("Automatic dependency installation failed.");
  logger.info("You can install dependencies manually with the following command:");
  logger.info(`  cd ${config.name} && ${command}`);
}
