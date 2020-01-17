// 在打包第三方模块的过程中，rollup无法直接解析npm模块，因此需要引入插件rollup-plugin-node-resolve并配合commonjs插件来解析这些第三方模块
const resolve = require( 'rollup-plugin-node-resolve')
// 解析commonjs需要引入一个rollup插件——rollup-plugin-commonjs
const commonjs = require('rollup-plugin-commonjs')
// 打包node内置模块
const builtins = require('rollup-plugin-node-builtins')
// eslint 代码规范
const { eslint } = require('rollup-plugin-eslint')
// babel转码
const babel = require('rollup-plugin-babel')

// ccs plugin
const postcss = require('rollup-plugin-postcss')
const simplevars = require('postcss-simple-vars')
const nested = require("postcss-nested")
const autoprefixer = require('autoprefixer')
const cssnext = require("postcss-cssnext")
const cssnano = require('cssnano')

// 项目名称
const cliParams = process.argv.filter(item => item.includes('=')).reduce((total, item) => ({ [item.split('=')[0].substr(2)]: item.split('=')[1], ...total }), {})

// console.log('obj:', cliParams)

// 项目名称
let proName = cliParams.pro

module.exports = {
  output: {
    name: `${proName}Sdk`,
    format: 'umd',
    banner: '/*eslint-disable */', // 打包后的文件不进行eslint检查
    sourcemap: false  // sourceMap支持
  },
  // external: ['jquery'], // 为rollup设置外部模块和全局变量
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['./**'],
      exclude: ['node_modules/**', 'dist/**', `${proName}-sdk/build/**`, `${proName}-sdk/example/*.less`, `${proName}-sdk/example/*.css`]
    }),
    resolve({
      browser: true
    }),
    babel({
      // babelrc: false,
      exclude: ['node_modules/**'],
    }),
    postcss({
      extensions: [".less", ".css"],
      plugins: [simplevars(), nested(), autoprefixer(), cssnext({ warnForDuplicates: false }), cssnano()],
      extract: false // `${proName}-sdk/build/index.css` // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
    }),

    commonjs(),
    builtins(),

  ],

  // paths: { // rollup配合CDN来使用
  //   jquery: 'https://cdn.bootcss.com/jquery/3.2.1/jquery.js'
  // }

  // globals: { // globals的值是一个对象，key表示使用的模块名称（npm模块名），value表示在打包文件中引用的全局变量名
  //   jquery: 'jQuery'
  // }
}
