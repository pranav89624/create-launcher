export type { TemplateVariantId } from "./registry.js";
export {
  TEMPLATE_VARIANTS,
  getTemplateFeatureMatrix,
  listTemplatesForPrompt,
  resolveTemplateVariant,
  toNormalizedProjectConfig,
  normalizeProjectConfig,
} from "./registry.js";
export type {
  TemplateFeatureMatrix,
  TemplateResolutionError,
  ProjectNormalizationInput,
} from "./registry.js";
