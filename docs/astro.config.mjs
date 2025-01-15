// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc'
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
// https://astro.build/config
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
const [createDocumentation, documentation] = createStarlightTypeDocPlugin();

export default defineConfig({
    site: 'https://github.com/OfirTheOne/sigjs',

    // base: 'my-repo',
    integrations: [
        expressiveCode({
            plugins: [pluginLineNumbers()],
        }),
        mdx(),
        starlight({
            title: 'Sig',
            customCss: [
                '/src/styles/custom.css',
            ],
            plugins: [
                createDocumentation({
                    entryPoints: [
                        '../sig/lib/index.ts',
                        '../sig/lib/router',
                        '../sig/lib/store',
                    ],
                    tsconfig: '../sig/tsconfig.json',
                    typeDoc: {
                        "gitRemote": "https://github.com/OfirTheOne/sigjs",
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
                        // "useCodeBlocks": true,
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
                            label: 'Rendering',
                            slug: 'guides/rendering',
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
                            label: 'Dynamic Rendering',
                            slug: 'guides/dynamic-rendering'
                        },
                        {
                            label: 'Routing',
                            slug: 'guides/routing'
                        },
                        {
                            label: 'Store',
                            slug: 'guides/store'
                        },
                    ],
                },
                {
                    label: 'Routing Guides',
                    items: [
                        {
                            label: 'Configure Routes',
                            slug: 'routing-guides/configure-routes'
                        },
                        {
                            label: 'Nested Routes',
                            slug: 'routing-guides/route'
                        },
                        {
                            label: 'Router Outlet',
                            slug: 'routing-guides/router-outlet'
                        },
                        {
                            label: 'Redirect',
                            slug: 'routing-guides/redirect'
                        },
                        {
                            label: 'Link',
                            slug: 'routing-guides/link'
                        },
                    ]
                },
                {
                    label: 'Reference',
                    autogenerate: { directory: 'reference' },
                },
            ],
        })],

    adapter: netlify(),
});