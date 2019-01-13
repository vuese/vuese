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
  input: resolveInput(process.env.PKG_DIR),
  external(id) {
    const shouldInternals = ['@vuese/utils']
    const internal = shouldInternals.some(m => id.includes(m))
    if (internal) return false
    return id.includes('node_modules') || id.includes('@vuese')
  },
  plugins: [
    typescript({
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
    }),
    moduleResolve()
  ],
  output: {
    file: resolveOnput(process.env.PKG_DIR),
    format: 'cjs'
  },
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    warn(warning)
  }
}
