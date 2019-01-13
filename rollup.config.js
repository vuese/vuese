import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import isBuiltinModule from 'is-builtin-module'

function resolveInput(projectDir) {
  return path.resolve('packages', `${projectDir}/lib/index.ts`)
}

function resolveOnput(projectDir) {
  return path.resolve('packages', `${projectDir}/dist/index.js`)
}

const PKG_DIR = process.env.PKG_DIR
const pkgMeta = require(path.resolve(`packages`, `${PKG_DIR}/package.json`))

export default {
  input: resolveInput(PKG_DIR),
  external(id) {
    return (
      (pkgMeta.dependencies && !!pkgMeta.dependencies[id]) ||
      id === 'prismjs/components'
    )
  },
  plugins: [
    typescript({
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
    })
  ],
  output: {
    file: resolveOnput(PKG_DIR),
    format: 'cjs'
  },
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    warn(warning)
  }
}
