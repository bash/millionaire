import babel from 'rollup-plugin-babel'

const isRelease = process.env[ 'BUILD_MODE' ] === 'release'

export default {
  plugins: [ babel() ],
  sourceMap: !isRelease,
  acorn: {
    ecmaVersion: 8,
    allowReserved: true
  },
  format: 'iife'
}
