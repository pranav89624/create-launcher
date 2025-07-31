import { copyTemplate } from "../utils/templateHelper.js";

export async function createVanillaApp(
  projectName: string,
  useTS: boolean,
  useTailwind: boolean
) {
  if (useTS && useTailwind) {
  } else if (useTS) {
  } else if (useTailwind) {
  } else {
    await copyTemplate("vanilla", projectName);
  }
}
