import { execa } from "execa";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { ensureDir } from "../fs/ensureDir.js";
import { TemplateRepositoryConfig } from "../types.js";
import { safeExec } from "../utils/result.js";
import { logger } from "../logger.js";

export type DownloadProgressCallback = (message: string) => void;

export interface DownloadTemplateOptions {
  repository: TemplateRepositoryConfig;
  templatePath: string;
  timeoutMs?: number;
  onProgress?: DownloadProgressCallback;
}

export interface TemplateDownloadResult {
  localPath: string;
  cleanup: () => Promise<void>;
}

export type TemplateDownloadErrorCode = "GIT_NOT_INSTALLED" | "CLONE_FAILED" | "TEMPLATE_NOT_FOUND";

export class TemplateDownloadError extends Error {
  constructor(
    public readonly code: TemplateDownloadErrorCode,
    message: string,
    public readonly hints: string[] = [],
    options?: { cause?: unknown }
  ) {
    super(message);
    if (options?.cause) {
      this.cause = options.cause;
    }
    this.name = "TemplateDownloadError";
  }
}

interface GitSparseCloneContext {
  cloneDir: string;
  extractedDir?: string;
  cleaned: boolean;
}

const DEFAULT_TIMEOUT = 60_000; // 60 seconds

export async function downloadTemplate(
  options: DownloadTemplateOptions
): Promise<TemplateDownloadResult> {
  const { repository, templatePath, timeoutMs = DEFAULT_TIMEOUT, onProgress } = options;

  await assertGitAvailable();

  const cloneDir = path.join(os.tmpdir(), `create-launcher-clone-${Date.now()}`);
  const extractedDir = path.join(os.tmpdir(), `create-launcher-template-${Date.now()}`);
  const context: GitSparseCloneContext = { cloneDir, cleaned: false };

  try {
    await ensureDir(cloneDir);
    await ensureDir(extractedDir);

    onProgress?.("Cloned template via git sparse checkout...");
    await runGit(
      [
        "clone",
        "--depth",
        "1",
        "--filter=blob:none",
        "--sparse",
        "--branch",
        repository.branch,
        repository.url,
        cloneDir,
      ],
      timeoutMs
    );

    onProgress?.("Configured sparse checkout...");
    await runGit(["-C", cloneDir, "sparse-checkout", "set", templatePath], timeoutMs);

    const fullTemplatePath = path.join(cloneDir, templatePath);
    const templateExists = await fs.pathExists(fullTemplatePath);

    if (!templateExists) {
      throw new TemplateDownloadError(
        "TEMPLATE_NOT_FOUND",
        `Template path "${templatePath}" was not found in branch "${repository.branch}" of ${repository.url}.`,
        [
          "Ensure the template folder exists in the repository.",
          "Check if the branch name is correct or override CREATE_LAUNCHER_TEMPLATE_BRANCH.",
        ]
      );
    }

    onProgress?.("Prepared template files...");
    await fs.copy(fullTemplatePath, extractedDir);
    context.extractedDir = extractedDir;

    logger.success("Template downloaded successfully.");

    return {
      localPath: extractedDir,
      cleanup: async () => {
        await fs.remove(extractedDir);
      },
    };
  } catch (error) {
    await fs.remove(extractedDir).catch(() => undefined);
    if (error instanceof TemplateDownloadError) {
      throw error;
    }

    throw new TemplateDownloadError(
      "CLONE_FAILED",
      "Unable to download template via git sparse checkout.",
      [
        "Verify you have network access to GitHub.",
        "If using a corporate network, ensure git is allowed through the proxy.",
        "Try setting CREATE_LAUNCHER_TEMPLATE_REPO or CREATE_LAUNCHER_TEMPLATE_BRANCH to override the defaults.",
      ],
      { cause: error }
    );
  } finally {
    if (!context.cleaned) {
      context.cleaned = true;
      await fs.remove(context.cloneDir).catch(() => undefined);
    }
  }
}

async function assertGitAvailable(): Promise<void> {
  const gitCheck = await safeExec(() => execa("git", ["--version"], { timeout: 5_000 }));
  if (gitCheck.ok) return;

  throw new TemplateDownloadError(
    "GIT_NOT_INSTALLED",
    "Git is required to download templates but was not detected on this system.",
    [
      "Install git from https://git-scm.com/downloads and ensure it is available in your PATH.",
      "Alternatively, set CREATE_LAUNCHER_TEMPLATE_FALLBACK=degit to always use the degit fallback.",
    ],
    { cause: gitCheck.error }
  );
}

async function runGit(args: string[], timeoutMs: number): Promise<void> {
  const result = await safeExec(() =>
    execa("git", args, {
      timeout: timeoutMs,
      stdio: "ignore",
    })
  );

  if (!result.ok) {
    throw result.error;
  }
}
