import { copyTemplate } from "../utils/templateHelper.js";

export async function createReactApp(projectName: string) {
  await copyTemplate("react", projectName);
}