import terser from '@rollup/plugin-terser';
import { plugins, moduleGlobals, umdGlobals, moduleExternals } from './rollup.config.js'

const minModuleConfig = {
  input: 'src/ngl.ts',
  plugins: [ ...plugins, terser() ],
  output: [{
    file: 'dist/ngl.umd.js',
    format: 'umd',
    name: 'NGL',
    sourcemap: true,
    globals: umdGlobals
  },
  {
    file: 'dist/ngl.esm.js',
    format: 'es',
    name: 'NGL',
    sourcemap: true,
    globals: moduleGlobals
  }
  ],
  external: moduleExternals
}


export default [ minModuleConfig ]
