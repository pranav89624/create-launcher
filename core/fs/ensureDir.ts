import fs from "fs-extra";

/**
 * Ensures that a folder exists.
 * If it does not exist, it will be created recursively.
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}
