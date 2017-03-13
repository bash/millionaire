import babel from 'rollup-plugin-babel'

const isRelease = process.env[ 'BUILD_MODE' ] === 'release'

export default {
  plugins: [ babel() ],
  sourceMap: !isRelease,
  format: 'iife'
}
