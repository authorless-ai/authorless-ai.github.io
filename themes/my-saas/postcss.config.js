const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  safelist: [],
});


module.exports = {
  plugins: [
    require('postcss-import')({
      path: ['themes/my-saas/assets/css'], // Specify the base path for relative imports
    }),
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ]
}
