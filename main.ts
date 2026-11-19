// GTA 6 meme entry — gta6-meme-x-01.
//
// The entry itself is the X post: the meme picture plus its text, which the
// house reads straight from X. This program only hands the house the post's
// address: it reads POST.json from the repository root and writes it to the
// output directory. It never touches anything else, and it never deletes
// the output directory (in the grader /output is a mount point, so removing
// it would fail).
//
// Revision: the post URL is now validated against the exact shape the house
// accepts — an X/Twitter status link — so a wrong URL fails loudly here
// instead of silently reaching the gate. Missing or malformed POST.json
// also fails with a clear message instead of a raw stack trace.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The house accepts https://x.com/<handle>/status/<id> or the same on
// twitter.com, with an optional www./mobile. prefix, or /i/web/status/<id>;
// a query or fragment after the id is read past.
const POST_URL_RE =
  /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:i\/web\/status\/\d+|[A-Za-z0-9_]+\/status\/\d+)(?:[?#].*)?$/;

let postText: string;
try {
  postText = readFileSync(join(botDir, 'POST.json'), 'utf8');
} catch (err) {
  throw new Error(`POST.json not found in ${botDir}: ${(err as Error).message}`);
}

let post: { url?: unknown };
try {
  post = JSON.parse(postText) as { url?: unknown };
} catch (err) {
  throw new Error(`POST.json is not valid JSON: ${(err as Error).message}`);
}

if (typeof post.url !== 'string') {
  throw new Error('POST.json has no "url" string field');
}
if (!POST_URL_RE.test(post.url)) {
  throw new Error(
    `POST.json url is not an X/Twitter status link: ${post.url} ` +
      '(expected https://x.com/<handle>/status/<digits> or twitter.com)',
  );
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), postText);
console.log(`POST.json handed in: ${post.url}`);
