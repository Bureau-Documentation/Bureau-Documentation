module.exports = {
  // Content files referencing CSS classes
  content: ["./site/**/*.html"],

  // CSS files to be purged in-place
  css: ["./site/**/*.css"],
  safelist: {
    standard: [], // Safelist the body selector with "body"
    deep: [],
    greedy: [],
  },
};
