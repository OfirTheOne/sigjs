// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc'
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
// https://astro.build/config
const [createDocumentation, documentation] = createStarlightTypeDocPlugin();

export default defineConfig({
    
    integrations: [
        expressiveCode({
            plugins: [pluginLineNumbers()],
        }),
        starlight({
        title: 'My Docs',
        social: {
            github: 'https://github.com/withastro/starlight',
        },
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
    })],
});