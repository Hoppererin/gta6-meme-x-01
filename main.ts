// GTA 6 meme entry — gta6-meme-x-01.
//
// The entry itself is the X post: the meme picture plus its text, which the
// house reads straight from X. This program only hands the house the post's
// address: it reads POST.json from the repository root and writes it to the
// output directory. It never touches anything else, and it never deletes
// the output directory (in the grader /output is a mount point, so removing
// it would fail).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postText = readFileSync(join(botDir, 'POST.json'), 'utf8');
const post = JSON.parse(postText) as { url?: unknown };
if (typeof post.url !== 'string' || !post.url.startsWith('https://')) {
  throw new Error('POST.json has no https url');
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), postText);
console.log(`POST.json handed in: ${post.url}`);
