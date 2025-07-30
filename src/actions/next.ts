import { copyTemplate } from "../utils/templateHelper.js";

export async function createNextApp(projectName: string) {
  await copyTemplate("next", projectName);
}