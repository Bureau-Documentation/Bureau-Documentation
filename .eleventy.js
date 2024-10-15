// Import the necessary libraries and plugins using ESM syntax
import fs from "node:fs/promises";
import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { minify } from "html-minifier-terser";
import PurgeCss from "eleventy-plugin-purgecss";
import CleanCSS from "clean-css";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import markdownItTOC from "markdown-it-toc-done-right";
import markdownItBracketedSpans from "markdown-it-bracketed-spans";

export default function (eleventyConfig) {
  //
  // Configure Eleventy to not use .gitignore files
  eleventyConfig.setUseGitIgnore(false);

  // Set the directories for input, includes, data, and output
  eleventyConfig.dir = {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "site",
  };

  // Set Markdown options
  const mdOptions = {
    html: true, // Allow HTML tags in Markdown files
    breaks: true, // Convert line breaks to HTML <br> tags
    linkify: true, // Automatically convert URLs into links
  };

  // Create a Markdown library with custom plugins
  const markdownLib = markdownIt(mdOptions)
    .use(markdownItAnchor) // Enables anchor links
    .use(markdownItAttrs) // Enable attributes for Markdown elements
    .use(markdownItBracketedSpans) // Enable bracketed spans
    .use(markdownItTOC, {
      // Configure Table of Contents
      containerClass: "pre", // Class for the container DIV
      level: 3, // Minimum level to apply anchors on or array of selected levels
      listType: "ul", // Type of list (ul for unordered, ol for ordered)
    })
    .disable("code"); // Disable code rendering

  // Set the Markdown library to use with Eleventy
  eleventyConfig.setLibrary("md", markdownLib);

  // Define the template formats that Eleventy will process
  eleventyConfig.setTemplateFormats([
    "md",
    "webmanifest",
    "xml",
    "ico",
    "svg",
    "png",
    "jpg",
    "gif",
    "webm",
    "mp4",
    "txt",
    "woff",
    "woff2",
    "css",
    "pdf",
    "zip",
  ]);

  // Register a filter to output a human-readable post date
  eleventyConfig.addFilter("readablePostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Asia/Hong_Kong" })
      .setLocale("en-GB")
      .toLocaleString({ day: "numeric", month: "short", year: "numeric" });
  });

  // Register a filter to output post date in ISO format
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "Asia/Hong_Kong" })
      .setLocale("en-GB")
      .toISODate();
  });

  // Add an image transform plugin with custom configuration
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html", // Process only HTML files
    formats: ["jpg", "webp"],
    widths: ["auto", 400, 800, 1600],
    defaultAttributes: {
      loading: "lazy",
      sizes: "auto",
      decoding: "async",
    },
  });

  // Add a transform to minify HTML content
  eleventyConfig.addTransform("minifyHTML", (content, outputPath) => {
    // Only minify HTML files
    if (outputPath?.endsWith(".html")) {
      return minify(content, {
        collapseWhitespace: true, // Collapses whitespace between tags
        removeComments: true, // Removes HTML comments
        minifyCSS: true, // Minifies inline CSS
        minifyJS: true, // Minifies inline JavaScript
        removeAttributeQuotes: true, // Removes quotes around attributes when possible
        removeOptionalTags: false, // Removes optional HTML tags (<html>, <head>, <body>)
        collapseBooleanAttributes: true, // Converts boolean attributes to HTML5 style
        removeEmptyAttributes: true, // Removes empty attributes
        minifyURLs: true, // Minifies URLs in attributes
        html5: true, // Enables HTML5 parsing
      });
    }
    return content; // Return the original content if not HTML
  });

  // CleanCSS
  eleventyConfig.on("afterBuild", async () => {
    const inputFiles = ["src/css/reset.css", "src/css/index.css"];
    for (const inputFile of inputFiles) {
      try {
        const input = await fs.readFile(inputFile, "utf8");
        const output = new CleanCSS().minify(input);
        const outputFilePath = `site/css/${inputFile.split("/").pop()}`; // Adjust output path as necessary
        await fs.writeFile(outputFilePath, output.styles);
        console.log(
          `eleventy-plugin-cleancss: Successfully minified ${inputFile} to ${outputFilePath}`,
        );
      } catch (err) {
        console.error(
          `eleventy-plugin-cleancss: Error minifying ${inputFile}: ${err}`,
        );
      }
    }
  });

  // Purge unused CSS
  eleventyConfig.addPlugin(PurgeCss, {
    config: "./purgecss.config.cjs",
  });

  // Return effective configuration for Eleventy
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "site",
    },
  };
}
