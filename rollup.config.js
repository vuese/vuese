import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import moduleResolve from 'rollup-plugin-node-resolve'
import isBuiltinModule from 'is-builtin-module'

function resolveInput(projectDir) {
  return path.resolve('packages', `${projectDir}/lib/index.ts`)
}

function resolveOnput(projectDir) {
  return path.resolve('packages', `${projectDir}/dist/index.js`)
}

export default {
  input: resolveInput('parser'),
  external(id) {
    return id.includes('node_modules')
  },
  plugins: [
    typescript({
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
    }),
    moduleResolve()
  ],
  output: {
    file: resolveOnput('parser'),
    format: 'cjs'
  },
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    warn(warning)
  }
}
