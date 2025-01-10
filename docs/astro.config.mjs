// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc'
// https://astro.build/config
const [createDocumentation, documentation] = createStarlightTypeDocPlugin();
// const [createTransformersDocumentation, transformersDocumentationSidebar] = createStarlightTypeDocPlugin();

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			plugins: [
				createDocumentation({
					entryPoints: [
					  '../sig/lib/index.ts',
					  '../sig/lib/router',
					  '../sig/lib/store',
					],
					tsconfig: '../sig/tsconfig.json',
					typeDoc:{
						"navigation": {
							"includeCategories": false,
							"includeFolders": false,
							"includeGroups": false,
						},
						"exclude": ["**/__tests__/**", "**/*.spec.ts", "**/*.test.ts"],
						"excludeExternals": true,
						"excludePrivate": true,
						"excludeProtected": true,
						"excludeInternal": true,
						"excludeNotDocumented": true,
						"compilerOptions": {
							"excludeInternal": true,
						},
						"hideGenerator": true,
						"groupReferencesByType": false,
						"categorizeByGroup": false,
						"readme": "none",
					}
					
				}),
			  ],
			sidebar: [
				{
					label: "Documentation",
					items: [documentation],
					
				},
				{
					label: 'Guides',
					items: [
						{
							label: 'Components',
							slug: 'guides/components',
						},
						{
							label: 'Lifecycle',
							slug: 'guides/lifecycle',
						},
						{
							label: 'Signals',
							slug: 'guides/signals',
						},
						{
							label: 'Rendering Control Flow', 
							slug: 'guides/example' 
						},
						{
							label: 'Routing',
							slug: 'guides/example'
						},
						{
							label: 'Stores',
							slug: 'guides/example'
						},
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
