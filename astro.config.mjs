// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		// mermaid MUST come before starlight
		mermaid(),
		starlight({
			title: 'Hackathon Courses',
			customCss: ['./src/styles/brand.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/korenmiklos/cegjegyzek-hackathon' }],
			sidebar: [
				{
					label: 'How to Use AI',
					autogenerate: { directory: 'ai-usage' },
				},
				{
					label: 'Entity Relational Modeling',
					autogenerate: { directory: 'erd' },
				},
				{
					label: 'Data Refactoring Exercise',
					autogenerate: { directory: 'refactoring' },
				},
				{
					label: 'Blog Posts',
					autogenerate: { directory: 'blog' },
				},
			],
		}),
	],
});
