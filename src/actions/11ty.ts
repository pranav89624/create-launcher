import { copyTemplate } from "../utils/templateHelper.js";

export async function create11tyApp(projectName: string) {
    await copyTemplate("11ty", projectName);
}