import ora from "ora";

export async function withSpinner<T>(task: () => Promise<T>): Promise<T> {
  const spinner = ora({ color: "cyan" }).start();
  try {
    const result = await task();
    spinner.succeed("Task completed.\n");
    return result;
  } catch (error) {
    spinner.fail("Task failed.");
    throw error;
  }
}
