import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

export default defineConfig({
  // Todo el sitio es estático (SSG) por defecto
  output: 'static',

  adapter: vercel({
    webAnalytics: {
      enabled: true, // Opcional: activa Vercel Analytics en tu panel
    },
    imageService: true, // Optimiza imágenes usando la infraestructura de Vercel
  }),

  integrations: [react()],
});