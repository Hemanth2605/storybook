import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** Directory holding the persisted JSON stores (gitignored). */
export const DATA_DIR = process.env.SERVER_DATA_DIR || join(here, 'data');
export const REQUESTS_FILE = join(DATA_DIR, 'requests.json');
export const BUILDS_FILE = join(DATA_DIR, 'builds.json');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  try {
    if (!existsSync(file)) return fallback;
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir();
  writeFileSync(file, JSON.stringify(value, null, 2));
}

/** All requests, keyed by id: { request, status, createdAt, decidedAt? }. */
export const loadRequests = () => readJson(REQUESTS_FILE, {});
export const saveRequests = (map) => writeJson(REQUESTS_FILE, map);

/** Build ledger, keyed by request id: { status, branch, prUrl, error, at }. */
export const loadBuilds = () => readJson(BUILDS_FILE, {});
export const saveBuilds = (map) => writeJson(BUILDS_FILE, map);
