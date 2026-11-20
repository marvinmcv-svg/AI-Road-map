// Usage: npm run hash-password -- "your new password"
import { createHash } from 'node:crypto';
const pw = process.argv[2];
if (!pw) {
  console.error('Usage: npm run hash-password -- "your new password"');
  process.exit(1);
}
const hash = createHash('sha256').update(pw).digest('hex');
console.log(`\nAdd this to .env.local (local) or your host's environment variables:\n\nVITE_PORTAL_PASSWORD_HASH=${hash}\n`);
