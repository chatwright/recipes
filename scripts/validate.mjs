#!/usr/bin/env node
// Dependency-free validator for chatwright/recipes.
//
// Checks:
//   1. registry/registry.json — valid JSON, correct shape, unique ids.
//   2. jobs/*.md and recipes/*/README.md front matter — id uniqueness
//      (within each collection), and every job's `solvedBy` id resolves
//      to a real recipe id, every recipe's `jobs` id resolves to a real
//      job id.
//
// Plain Node.js only (>=18), no npm dependencies, no network access.
// Run: node scripts/validate.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function rel(p) {
  return path.relative(ROOT, p);
}

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

// ---------- tiny front-matter parser (flow-style scalars/arrays only) ----------
// Deliberately narrow: this repository's front matter never uses nested
// block-style YAML, only `key: value` and `key: [a, b]` / `key: []`.
function parseFrontMatter(text, filePath) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return null;
  const data = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) {
      warn(`${rel(filePath)}: unparseable front-matter line: "${rawLine}"`);
      continue;
    }
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      value = inner === '' ? [] : inner.split(',').map((s) => stripQuotes(s.trim()));
    } else {
      value = stripQuotes(value);
    }
    data[key] = value;
  }
  return data;
}

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function asArray(v) {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function walkMarkdown(dir) {
  const out = [];
  if (!exists(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdown(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// ---------- 1. registry/registry.json ----------
function validateRegistry() {
  const registryPath = path.join(ROOT, 'registry', 'registry.json');
  if (!exists(registryPath)) {
    fail('registry/registry.json is missing');
    return;
  }

  let json;
  try {
    json = JSON.parse(readFileSync(registryPath, 'utf8'));
  } catch (e) {
    fail(`registry/registry.json is not valid JSON: ${e.message}`);
    return;
  }

  if (json.format !== 'https://chatwright.dev/formats/registry/v0') {
    fail(
      'registry/registry.json: "format" must be exactly ' +
        '"https://chatwright.dev/formats/registry/v0"'
    );
  }

  if (!Array.isArray(json.entries)) {
    fail('registry/registry.json: "entries" must be an array');
    return;
  }

  const requiredFields = ['id', 'repo', 'category', 'capabilities', 'addedAt'];
  const seenIds = new Set();

  json.entries.forEach((entry, i) => {
    for (const field of requiredFields) {
      if (!(field in entry)) {
        fail(`registry/registry.json: entries[${i}] missing required field "${field}"`);
      }
    }
    if (entry.id) {
      if (seenIds.has(entry.id)) {
        fail(`registry/registry.json: duplicate registry entry id "${entry.id}"`);
      }
      seenIds.add(entry.id);
    }
    if (entry.capabilities !== undefined && !Array.isArray(entry.capabilities)) {
      fail(`registry/registry.json: entries[${i}].capabilities must be an array`);
    }
  });

  console.log(`registry.json: ${json.entries.length} entrie(s) checked`);
}

// ---------- 2. jobs + recipes front-matter graph ----------
function validateContentGraph() {
  const jobFiles = walkMarkdown(path.join(ROOT, 'jobs'));
  const recipeFiles = walkMarkdown(path.join(ROOT, 'recipes')).filter(
    (f) => path.basename(f) === 'README.md'
  );

  const jobIdOwners = new Map(); // id -> [file, ...]
  const recipeIdOwners = new Map();
  const jobs = [];
  const recipes = [];

  for (const file of jobFiles) {
    const fm = parseFrontMatter(readFileSync(file, 'utf8'), file);
    if (!fm) {
      fail(`${rel(file)}: missing YAML front matter`);
      continue;
    }
    if (!fm.id) {
      fail(`${rel(file)}: front matter missing "id"`);
      continue;
    }
    registerId(jobIdOwners, fm.id, file);
    jobs.push({ file, fm });
  }

  for (const file of recipeFiles) {
    const fm = parseFrontMatter(readFileSync(file, 'utf8'), file);
    if (!fm) {
      fail(`${rel(file)}: missing YAML front matter`);
      continue;
    }
    if (!fm.id) {
      fail(`${rel(file)}: front matter missing "id"`);
      continue;
    }
    registerId(recipeIdOwners, fm.id, file);
    recipes.push({ file, fm });
  }

  // ids must be unique within each collection, and across collections
  // (a job and a recipe sharing an id would make node references ambiguous).
  for (const [id, files] of jobIdOwners) {
    if (recipeIdOwners.has(id)) {
      fail(
        `id "${id}" is used by both a job (${files.map(rel).join(', ')}) and a recipe ` +
          `(${recipeIdOwners.get(id).map(rel).join(', ')})`
      );
    }
  }

  const recipeIds = new Set(recipes.map((r) => r.fm.id));
  const jobIds = new Set(jobs.map((j) => j.fm.id));

  for (const { file, fm } of jobs) {
    for (const recipeId of asArray(fm.solvedBy)) {
      if (!recipeIds.has(recipeId)) {
        fail(`${rel(file)}: solvedBy references unknown recipe id "${recipeId}"`);
      }
    }
    for (const relatedId of asArray(fm.related)) {
      if (!jobIds.has(relatedId)) {
        fail(`${rel(file)}: related references unknown job id "${relatedId}"`);
      }
    }
  }

  for (const { file, fm } of recipes) {
    for (const jobId of asArray(fm.jobs)) {
      if (!jobIds.has(jobId)) {
        fail(`${rel(file)}: jobs references unknown job id "${jobId}"`);
      }
    }
  }

  console.log(`jobs: ${jobs.length} checked, recipes: ${recipes.length} checked`);
}

function registerId(owners, id, file) {
  if (owners.has(id)) {
    fail(`duplicate id "${id}": ${rel(file)} and ${owners.get(id).map(rel).join(', ')}`);
    owners.get(id).push(file);
  } else {
    owners.set(id, [file]);
  }
}

// ---------- run ----------
validateRegistry();
validateContentGraph();

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
} else {
  console.log(`\nOK — 0 errors, ${warnings.length} warning(s).`);
}
