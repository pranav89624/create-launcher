import chalk from "chalk";

/**
 * Center text based on terminal width. Strips ANSI colors for correct length.
 */
function centerText(text: string): string {
  const terminalWidth = process.stdout.columns || 80;
  return text
    .split("\n")
    .map((line) => {
      // eslint-disable-next-line no-control-regex
      const lineLength = line.replace(/\x1B\[[0-9;]*m/g, "").length;
      const padding = Math.max(0, Math.floor((terminalWidth - lineLength) / 2));
      return " ".repeat(padding) + line;
    })
    .join("\n");
}

/**
 * ASCII banner text
 */
const asciiBanner = `
_________                        __                   .____                               .__                  
╲_   ___ ╲_______   ____ _____ _╱  │_  ____           │    │   _____   __ __  ____   ____ │  │__   ___________ 
╱    ╲  ╲╱╲_  __ ╲_╱ __ ╲╲__  ╲╲   __╲╱ __ ╲   ______ │    │   ╲__  ╲ │  │  ╲╱    ╲_╱ ___╲│  │  ╲_╱ __ ╲_  __ ╲
╲     ╲____│  │ ╲╱╲  ___╱ ╱ __ ╲│  │ ╲  ___╱  ╱_____╱ │    │___ ╱ __ ╲│  │  ╱   │  ╲  ╲___│   Y  ╲  ___╱│  │ ╲╱
 ╲______  ╱│__│    ╲___  >____  ╱__│  ╲___  >         │_______ (____  ╱____╱│___│  ╱╲___  >___│  ╱╲___  >__│   
        ╲╱             ╲╱     ╲╱          ╲╱                  ╲╱    ╲╱           ╲╱     ╲╱     ╲╱     ╲╱      
`;

/**
 * Prints ASCII banner or fallback if terminal too small
 */
export function printBanner(): void {
  const terminalWidth = process.stdout.columns || 80;

  const maxLineLength = Math.max(
    // eslint-disable-next-line no-control-regex
    ...asciiBanner.split("\n").map((line) => line.replace(/\x1B\[[0-9;]*m/g, "").length)
  );

  if (terminalWidth < maxLineLength) {
    console.log(
      chalk.cyan(
        centerText(`
====================
  Cʀᴇᴀᴛᴇ-Lᴀᴜɴᴄʜᴇʀ
====================
      `)
      )
    );
  } else {
    console.log(chalk.cyan(centerText(asciiBanner)));
  }
}
