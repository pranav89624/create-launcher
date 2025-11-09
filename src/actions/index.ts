import degit from "degit";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { logger } from "../../core/logger.js";
import { ProjectConfig, NormalizedProjectConfig } from "../../core/types.js";
import {
  downloadTemplate,
  TemplateDownloadError,
  TemplateDownloadResult,
} from "../../core/github/downloadTemplate.js";
import { copyTemplate, installProjectDependencies } from "../../core/fs/copyTemplate.js";
import { normalizeProjectConfig, TemplateResolutionError } from "../../core/template/index.js";
import { withSpinner } from "../utils/spinner.js";
import { ensureDir } from "../../core/fs/ensureDir.js";
import { isErr } from "../../core/utils/result.js";
import type { Result } from "../../core/utils/result.js";

const MAX_DOWNLOAD_RETRIES = 2;
const RETRY_DELAY_MS = 750;

export async function createProject(rawConfig: ProjectConfig): Promise<void> {
  const normalizationResult: Result<NormalizedProjectConfig, TemplateResolutionError> =
    normalizeProjectConfig(rawConfig);

  if (isErr(normalizationResult)) {
    handleNormalizationError(normalizationResult.error);
    throw new Error(normalizationResult.error.message);
  }

  const config: NormalizedProjectConfig = normalizationResult.value;
  logConfigurationSummary(config);

  const downloadResult: TemplateDownloadResult = await withSpinner<TemplateDownloadResult>(() =>
    downloadWithFallback(config)
  );

  try {
    const targetPath: string = await withSpinner<string>(() =>
      copyTemplate(downloadResult.localPath, config)
    );

    await withSpinner(() => installProjectDependencies(targetPath, config));

    logger.success("Project scaffolding completed successfully.");
  } catch (error) {
    handleCreationError(error);
    throw error;
  } finally {
    await downloadResult.cleanup().catch(() => undefined);
  }
}

async function downloadWithFallback(
  config: NormalizedProjectConfig
): Promise<TemplateDownloadResult> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= MAX_DOWNLOAD_RETRIES) {
    try {
      return await downloadTemplate({
        repository: config.repository,
        templatePath: config.variant.path,
        onProgress: (message) => logger.info(`  ${message}`),
      });
    } catch (error) {
      if (error instanceof TemplateDownloadError) {
        logDownloadHints(error);
        if (error.code === "TEMPLATE_NOT_FOUND") {
          throw error;
        }
      }

      lastError = error;
      attempt += 1;

      if (attempt > MAX_DOWNLOAD_RETRIES) {
        break;
      }

      const delayMs = RETRY_DELAY_MS * attempt * attempt;
      logger.warn(
        `Retrying download in ${(delayMs / 1000).toFixed(1)}s (attempt ${attempt}/${
          MAX_DOWNLOAD_RETRIES
        }).`
      );
      await delay(delayMs);
    }
  }

  logger.warn("Falling back to degit (lightweight download).");
  return await downloadViaDegit(config, lastError);
}

async function downloadViaDegit(
  config: NormalizedProjectConfig,
  cause: unknown
): Promise<TemplateDownloadResult> {
  const spec = `${config.repository.slug}/${config.variant.path}#${config.repository.branch}`;
  const tempDir = path.join(os.tmpdir(), `create-launcher-degit-${Date.now()}`);
  await ensureDir(tempDir);

  try {
    const emitter = degit(spec, { cache: false, force: true });
    await emitter.clone(tempDir);

    return {
      localPath: tempDir,
      cleanup: async () => {
        await fs.remove(tempDir);
      },
    };
  } catch (error) {
    throw new TemplateDownloadError(
      "CLONE_FAILED",
      "Failed to download template using degit fallback.",
      [
        "Check your network connection and try again.",
        "If you are behind a proxy, configure git/degit to use it.",
      ],
      { cause: cause ?? error }
    );
  }
}

function handleNormalizationError(error: TemplateResolutionError): void {
  logger.error(error.message);
  if (error.details?.issues) {
    logger.info("Validation issues:");
    for (const issue of error.details.issues as Array<{ path: unknown[]; message: string }>) {
      const field = issue.path.join(".") || "config";
      logger.info(`  - ${field}: ${issue.message}`);
    }
  }
}

function handleCreationError(error: unknown): void {
  if (error instanceof TemplateDownloadError) {
    logDownloadHints(error);
    if (isError(error.cause)) {
      logger.error(error.cause.message);
    }
  }
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function logDownloadHints(error: TemplateDownloadError): void {
  if (error.hints?.length) {
    logger.info("Helpful hints:");
    for (const hint of error.hints) {
      logger.info(`  • ${hint}`);
    }
  }
}

function logConfigurationSummary(config: NormalizedProjectConfig): void {
  logger.info(`Template variant: ${config.variant.id}`);
  logger.info(`Repository: ${config.repository.url}#${config.repository.branch}\n`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
