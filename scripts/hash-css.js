#!/usr/bin/env node

/**
 * CSS Cache Busting Script
 *
 * Generates a content-based hash of style.css and creates a versioned copy.
 * Updates index.html to reference the new hashed filename.
 *
 * Usage: node scripts/hash-css.js
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// File paths
const cssSourcePath = join(projectRoot, 'assets', 'style.css');
const assetsDir = join(projectRoot, 'assets');
const indexPath = join(projectRoot, 'index.html');

/**
 * Compute SHA-256 hash of file contents (first 8 chars)
 */
function hashFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const hash = createHash('sha256').update(content).digest('hex');
  return hash.substring(0, 8); // Short hash for readability
}

/**
 * Remove old hashed CSS files (keep only style.css)
 */
function cleanOldHashedFiles() {
  const files = readdirSync(assetsDir);
  const hashedCssPattern = /^style\.[a-f0-9]{8}\.css$/;

  for (const file of files) {
    if (hashedCssPattern.test(file)) {
      const filePath = join(assetsDir, file);
      unlinkSync(filePath);
      console.log(`🗑️  Removed old hashed file: ${file}`);
    }
  }
}

/**
 * Update index.html to reference the new hashed CSS file
 */
function updateIndexHtml(hashedFilename) {
  let html = readFileSync(indexPath, 'utf8');

  // Match any style.css or style.[hash].css or style.v1.css reference
  const cssLinkPattern = /<link\s+rel="stylesheet"\s+href="\/assets\/style(\.[a-z0-9]+)?\.css"\s*\/>/;

  if (!cssLinkPattern.test(html)) {
    throw new Error(
      'Could not find CSS <link> tag in index.html. Expected pattern: <link rel="stylesheet" href="/assets/style*.css" />'
    );
  }

  html = html.replace(
    cssLinkPattern,
    `<link rel="stylesheet" href="/assets/${hashedFilename}" />`
  );

  writeFileSync(indexPath, html, 'utf8');
  console.log(`📝 Updated index.html to reference: ${hashedFilename}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Starting CSS cache busting...\n');

  // Step 1: Compute hash of style.css
  const hash = hashFile(cssSourcePath);
  const hashedFilename = `style.${hash}.css`;
  const hashedFilePath = join(assetsDir, hashedFilename);

  console.log(`🔐 Computed hash: ${hash}`);

  // Step 2: Clean up old hashed files
  cleanOldHashedFiles();

  // Step 3: Copy style.css to style.[hash].css
  const cssContent = readFileSync(cssSourcePath, 'utf8');
  writeFileSync(hashedFilePath, cssContent, 'utf8');
  console.log(`✅ Created: ${hashedFilename}`);

  // Step 4: Update index.html
  updateIndexHtml(hashedFilename);

  console.log('\n✨ CSS cache busting complete!');
  console.log(`📦 Deploy with: firebase deploy --only hosting`);
}

main();
