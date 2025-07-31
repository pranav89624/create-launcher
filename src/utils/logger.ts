import chalk from 'chalk';

export interface LoggerOptions {
  timestamp?: boolean;
  prefix?: string;
}

class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = { timestamp: false, ...options };
  }

  private formatMessage(level: string, msg: string, color: any): [string, string] {
    const timestamp = this.options.timestamp 
      ? `[${new Date().toLocaleTimeString()}] ` 
      : '';
    const prefix = this.options.prefix ? `${this.options.prefix} ` : '';
    return [color(`${timestamp}${prefix}${level}`), msg];
  }

  info(msg: string): void {
    console.log(...this.formatMessage('ℹ INFO:', msg, chalk.cyan));
  }

  success(msg: string): void {
    console.log(...this.formatMessage('✓ SUCCESS:', msg, chalk.green));
  }

  warn(msg: string): void {
    console.log(...this.formatMessage('⚠ WARN:', msg, chalk.yellow));
  }

  error(msg: string): void {
    console.log(...this.formatMessage('✗ ERROR:', msg, chalk.red));
  }

  step(current: number, total: number, msg: string): void {
    const stepInfo = chalk.blue(`\n[${current}/${total}]`);
    console.log(stepInfo, msg);
  }

  welcome(): void {
    console.log(chalk.blue.bold('\n🚀 Welcome to create-launcher!\n'));
  }

  completion(projectName: string): void {
    console.log(chalk.green.bold(`\n🎉 Project "${projectName}" created successfully!`));
    console.log(chalk.gray(`\nNext steps:`));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray(`  npm run dev\n`));
  }
}

export const logger = new Logger();
