## Usage

```
# Initialize
docker run --rm --name=npm -u 1000 -v /path/to/website:/app -w /app node:lts-slim npm init -y
```
```
# Install node modules
docker run --rm --name=npm -u 1000 -v /path/to/website:/app -w /app node:lts-slim npm install \
  npm \
  @11ty/eleventy@latest \
  @11ty/eleventy-img@latest \
  luxon \
  html-minifier-terser \
  clean-css \
  eleventy-plugin-purgecss \
  markdown-it-attrs \
  markdown-it-bracketed-spans \
  markdown-it-anchor \
  markdown-it-toc-done-right
```
```
# Generate website
docker run --rm --name=npm -u 1000 -v /path/to/website:/app -w /app --network none node:lts-slim npx eleventy
```
```
# Test
docker run --rm --name=npm -u 1000 -p 8080:8080 -v /path/to/website:/app -w /app node:lts-slim npx @11ty/eleventy --serve --quiet
```
```
# Update
docker run --rm --name=npm -u 1000 -v /path/to/website:/app -w /app node:lts-slim npm update
```
```
# Uninstall node modules
docker run --rm --name=npm -u 1000 -v /path/to/website:/app -w /app node:lts-slim npm remove \
  eleventy-plugin-toc

```
