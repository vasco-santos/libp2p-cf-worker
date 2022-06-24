import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'
// import git from 'git-rev-sync'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
)

export async function buildCmd (opts) {
  const sentryRelease = `block-service@${pkg.version}-${
    opts.env || 'dev'
  }`//+${git.short(__dirname)}`
  console.log(`Building ${sentryRelease}`)

  await build({
    entryPoints: [path.join(__dirname, '..', 'src', 'index.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(__dirname, '..', 'dist', 'worker.mjs'),
    legalComments: 'external',
    define: {
      VERSION: JSON.stringify(pkg.version),
      // COMMITHASH: JSON.stringify(git.long(__dirname)),
      // BRANCH: JSON.stringify(git.branch(__dirname)),
      global: 'globalThis'
    },
    minify: false, // opts.env !== 'dev',
    sourcemap: 'external'
  })
}
