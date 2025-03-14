import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  externals: ['vite'],
  outDir: 'dist',
  clean: true,
  declaration: true,
  rollup: {
    dts: {
      compilerOptions: {
        declaration: true,
        declarationDir: 'dist',
      },
    },
    emitCJS: true,
  },
})