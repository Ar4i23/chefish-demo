import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'dist');
const basePath = (process.env.GITHUB_PAGES_BASE_PATH || '').replace(/^\/+|\/+$/g, '');
const publishable = new Set(['assets', 'css', 'js', 'index.html']);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!publishable.has(entry.name)) continue;
  await cp(resolve(root, entry.name), resolve(output, entry.name), { recursive: true });
}
await writeFile(resolve(output, '_redirects'), '/* /index.html 200\n');
await writeFile(resolve(output, '.htaccess'), 'RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [L]\n');
const indexPath = resolve(output, 'index.html');
const baseIndex = await readFile(indexPath, 'utf8');
const publicPath = basePath ? `/${basePath}` : '';
const pageIndex = baseIndex
  .replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attribute, path) => `${attribute}="${publicPath}/${path}"`)
  .replace('</head>', `  <script>window.CHEFISH_BASE_PATH = ${JSON.stringify(publicPath)};</script>\n  </head>`);
await writeFile(indexPath, pageIndex);
await writeFile(resolve(output, '404.html'), pageIndex);
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Built static CheFish site in dist/.');
