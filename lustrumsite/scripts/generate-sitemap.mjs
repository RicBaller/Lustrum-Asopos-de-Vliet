import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const siteUrl = (process.env.SITE_URL || 'https://asoposlustrum.nl').replace(/\/$/, '');
const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');

const routes = ['/', '/activiteiten', '/albums', '/videos', '/shop', '/commissie', '/partners'];
const lastModified = new Date().toISOString().slice(0, 10);

const urlEntries = routes
  .map((route) => {
    const loc = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml, 'utf8');

console.log(`Sitemap generated at ${outputPath}`);
