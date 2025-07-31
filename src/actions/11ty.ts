import { copyTemplate } from "../utils/templateHelper.js";

export async function create11tyApp(
  projectName: string,
  useTS?: boolean,
  useTailwind?: boolean
) {
  await copyTemplate("11ty", projectName);
}
