import { build } from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import fs from 'node:fs';
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'preview-dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'posters'), { recursive: true });
const swap = {
  name: 'swap',
  setup(b) {
    b.onResolve({ filter: /lib\/(link|paths)$/ }, (a) => ({ path: path.join(root, 'preview', path.basename(a.path) + '.js') }));
  },
};
const nm = '/home/claude/.npm-global/lib/node_modules';
await build({
  entryPoints: [path.join(root, 'preview/main.jsx')],
  bundle: true, minify: true, format: 'iife', outfile: path.join(out, 'app.js'),
  jsx: 'automatic', loader: { '.js': 'jsx' }, plugins: [swap],
  nodePaths: [nm], define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const html = `<title>Кино на вечер</title>
<script>try{var t=localStorage.getItem('kv-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@600;800&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script src="app.js"></script>
`;
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of fs.readdirSync(path.join(root, 'public/posters'))) fs.copyFileSync(path.join(root, 'public/posters', f), path.join(out, 'posters', f));
console.log('ok', fs.statSync(path.join(out, 'app.js')).size);
