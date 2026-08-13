import { createAPIFileRoute } from '@tanstack/react-start/api';
import { fetchPublishedVehicles } from '@/data/vehicles';
import { generateVehicleSlug } from '@/utils/seo';
import { CAR_BRANDS } from '@/data/cars';

export const APIRoute = createAPIFileRoute('/api/sitemap.xml')({
  GET: async () => {
    const baseUrl = 'https://neumacarmotors.com';
    
    // 1. Static Pages
    const staticPages = [
      '',
      '/taller',
      '/servicios',
      '/contacto',
      '/vender-mi-coche',
      '/presupuesto',
      '/cita',
      '/coches-segunda-mano-sevilla',
      '/coches-ocasion-sevilla',
      '/coches-km0-sevilla',
      '/coches-baratos-sevilla',
    ];

    // 2. Dynamic Brand Pages
    const brandPages = CAR_BRANDS.map(
      (brand) => `/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-segunda-mano-sevilla`
    );

    // 3. Dynamic Vehicle Pages
    const vehicles = await fetchPublishedVehicles();
    const vehiclePages = vehicles.map((v) => `/coches/${generateVehicleSlug(v)}`);

    // Combine all URLs
    const allUrls = [...staticPages, ...brandPages, ...vehiclePages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === '' ? '1.0' : url.includes('/coches/') ? '0.8' : '0.9'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
});
