 // 最小化代码
const { uglify } = require('rollup-plugin-uglify')

const cliParams = process.argv.filter(item => item.includes('=')).reduce((total, item) => ({ [item.split('=')[0].substr(2)]: item.split('=')[1], ...total }), {})

// 项目名称
let proName = cliParams.pro

module.exports = {
  input: `./${proName}-sdk/src`,
  output: {
    file: `dist/${proName}-sdk/${proName}Sdk.js`,
    sourcemap: true  // 开启sourceMap支持
  },
  plugins: [
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      }
    }),
  ]
}
