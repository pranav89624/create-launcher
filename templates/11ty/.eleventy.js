export default function (eleventyConfig) {
  // Copy CSS files
  eleventyConfig.addPassthroughCopy("src/styles.css");
  
  // Copy assets folder from src to dist
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk"
  };
}
