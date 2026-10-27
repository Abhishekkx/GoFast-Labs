import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

const partialsDir = resolve(__dirname, 'src/partials');
const INCLUDE = /<!--\s*@include\s+([\w-]+)\s*-->/g;

// Inlines <!-- @include name --> with src/partials/name.html so every page
// shares one copy of the nav, footer and global chrome without a runtime fetch.
function htmlPartials() {
  return {
    name: 'gofast-html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(INCLUDE, (_, name) => readFileSync(resolve(partialsDir, `${name}.html`), 'utf8')),
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) server.ws.send({ type: 'full-reload' });
    },
  };
}

// Every top-level .html file is a page, so new pages need no config change.
const pages = Object.fromEntries(
  readdirSync(__dirname)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace(/\.html$/, ''), resolve(__dirname, file)])
);

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    outDir: 'dist',
    rollupOptions: { input: pages },
  },
  server: {
    port: 3000,
    open: false,
  },
});
