import { ProjectConfig, TemplateType } from '../types.js';
import { copyTemplate } from '../utils/templateHelper.js';

export async function createProject(config: ProjectConfig): Promise<void> {
  const templateName = getTemplateName(config);
  await copyTemplate(templateName, config.name);
}

function getTemplateName(config: ProjectConfig): string {
  const { template, useTypeScript, useTailwind } = config;
  
  // 11ty doesn't support TS/Tailwind variants
  if (template === TemplateType.ELEVENTY) {
    return '11ty';
  }
  
  let templateName: string = template;
  
  if (useTypeScript) {
    templateName += '-ts';
  }
  
  if (useTailwind) {
    templateName += '-tailwind';
  }
  
  return templateName;
}
