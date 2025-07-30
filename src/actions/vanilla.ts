import { copyTemplate } from "../utils/templateHelper.js";

export async function createVanillaApp(projectName: string) {
  await copyTemplate("vanilla", projectName);
}