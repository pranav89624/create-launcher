import chalk from "chalk";
import { PackageManager } from "./types.js";

export interface LoggerOptions {
  timestamp?: boolean;
  prefix?: string;
}

class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = { timestamp: false, ...options };
  }

  private getTimestamp(): string {
    return this.options.timestamp ? `[${new Date().toLocaleTimeString()}] ` : "";
  }

  private getPrefix(): string {
    return this.options.prefix ? `${this.options.prefix} ` : "";
  }

  private format(level: string, message: string, color: (msg: string) => string): string {
    return color(`${this.getTimestamp()}${this.getPrefix()}${level} ${message}`);
  }

  info(msg: string): void {
    console.log(this.format("ℹ", msg, chalk.cyan));
  }

  success(msg: string): void {
    console.log(this.format("✓", msg, chalk.green));
  }

  warn(msg: string, err?: unknown): void {
    console.log(this.format("⚠", msg, chalk.yellow));
    if (err) console.log(chalk.yellow(`  → ${String(err)}`));
  }

  error(msg: string, err?: unknown): void {
    console.log(this.format("✗", msg, chalk.red));
    if (err) console.log(chalk.red(`  → ${String(err)}`));
  }

  step(current: number, total: number, msg: string): void {
    console.log(chalk.blue(`\n[${current}/${total}] ${msg}`));
  }

  welcome(): void {
    console.log(chalk.blue.bold("\n🚀 Welcome to create-launcher!\n"));
  }

  completion(projectName: string, pm: PackageManager, installDeps: boolean): void {
    console.log(chalk.green.bold(`\n🎉 Project "${projectName}" created successfully!\n`));
    console.log(chalk.gray("Next steps:"));
    console.log(chalk.gray(`  cd ${projectName}`));
    if (!installDeps) {
      if (pm === PackageManager.YARN) {
        console.log(chalk.gray(`  yarn && yarn dev\n`));
      } else if (pm === PackageManager.PNPM) {
        console.log(chalk.gray(`  pnpm install && pnpm dev\n`));
      } else {
        console.log(chalk.gray(`  npm install && npm run dev\n`));
      }
    } else {
      if (pm === PackageManager.YARN) {
        console.log(chalk.gray(`  yarn dev\n`));
      } else if (pm === PackageManager.PNPM) {
        console.log(chalk.gray(`  pnpm dev\n`));
      } else {
        console.log(chalk.gray(`  npm run dev\n`));
      }
    }
  }
}

export const logger = new Logger();
