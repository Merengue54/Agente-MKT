import { promises as fs } from 'node:fs';
import path from 'node:path';

const HISTORY_FILE = path.resolve('data/history.json');

async function ensureHistoryFile() {
  await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });

  try {
    await fs.access(HISTORY_FILE);
  } catch {
    await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getHistory() {
  await ensureHistoryFile();
  const raw = await fs.readFile(HISTORY_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

export async function saveHistoryEntry(entry) {
  const history = await getHistory();
  history.unshift(entry);
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
  return entry;
}
