#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import babel from '@babel/core';
import { minify } from 'terser';
import postcss from 'postcss';
import cssnano from 'cssnano';
import sortMediaQueries from 'postcss-sort-media-queries';

function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

// Post Processors
function babelTransform (code) { return babel.transform(code, {
  presets: ['@babel/preset-env'],
}).code;}
async function terserTransform (code) { const result = await minify(code); return result.code; }
async function transformJS (code) { return await terserTransform(babelTransform(code)); }

async function postcssTransform (code) { const result = await postcss([sortMediaQueries({sort: 'mobile-first'}), cssnano]).process(code, {from: undefined}); return result.css; }

const sourceFilename = process.argv[2];
if (!sourceFilename) {
  throw new Error('No file provided');
}

const outputDir = path.basename(sourceFilename, '.yml');
const minifiedDir = 'min';
createDir(outputDir);
createDir(minifiedDir);

const sourceFile = fs.readFileSync(sourceFilename, 'utf8');
const source = yaml.load(sourceFile);


const contexts = [];
Object.keys(source.web).forEach((key) => {
  if (!key.startsWith('_')) {
    contexts.push(source.web[key]);
  }
});

async function processContexts() {
  for (const context of contexts) {
    const contextId = context._id;
    createDir(`${outputDir}/${contextId}`);
    fs.writeFileSync(`${outputDir}/${contextId}/script.js`, context._metadata.script)
    fs.writeFileSync(`${outputDir}/${contextId}/styles.css`, context._metadata.styles)
    context._metadata.script = await transformJS(context._metadata.script);
    context._metadata.styles = await postcssTransform(context._metadata.styles);

    for (const key of Object.keys(context)) {
      if (!key.startsWith('_')) {
        createDir(`${outputDir}/${contextId}/${key}`);
        for (const variant of context[key]._values) {
          createDir(`${outputDir}/${contextId}/${key}/${variant._value.id}`);
          fs.writeFileSync(`${outputDir}/${contextId}/${key}/${variant._value.id}/script.js`, variant._value.script);
          fs.writeFileSync(`${outputDir}/${contextId}/${key}/${variant._value.id}/styles.css`, variant._value.styles);
          variant._value.script = await transformJS(variant._value.script);
          variant._value.styles = await postcssTransform(variant._value.styles);
        };
      }
    };
  };
}

await processContexts();
fs.writeFileSync(`${minifiedDir}/${outputDir}.min.yml`, yaml.dump(source, { lineWidth: -1 }));

console.log(`Wrote ${minifiedDir}/${outputDir}.min.yml`);