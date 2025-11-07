import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://seedfinderpro.de';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/seedfinder`, lastModified: new Date() },
    { url: `${base}/growmanager`, lastModified: new Date() },
    { url: `${base}/downloads`, lastModified: new Date() },
    { url: `${base}/settings`, lastModified: new Date() },
    { url: `${base}/impressum`, lastModified: new Date() },
    { url: `${base}/datenschutz`, lastModified: new Date() }
  ];
}