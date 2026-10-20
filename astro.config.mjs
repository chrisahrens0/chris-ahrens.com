// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
	site: 'https://chris-ahrens.com',
	// Pages are prerendered to static HTML by default; opt a route into
	// on-demand rendering with `export const prerender = false`.
	adapter: cloudflare({
		// The template ships its own pre-sized images, so skip Cloudflare Images.
		imageService: 'passthrough',
	}),
});
