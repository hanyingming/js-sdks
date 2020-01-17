// 启动本地serve服务
const serve = require('rollup-plugin-serve')
// 支持本地热更新
const livereload = require('rollup-plugin-livereload')

const cliParams = process.argv.filter(item => item.includes('=')).reduce((total, item) => ({ [item.split('=')[0].substr(2)]: item.split('=')[1], ...total }), {})

// 项目名称
let proName = cliParams.pro

module.exports = {
  input: `${proName}-sdk/example/`,
  output: {
    file: `${proName}-sdk/build/index.js`,
    sourcemap: true  // sourceMap支持
  },
  plugins: [
    serve({ // 开发环境、本地服务器配置
      open: true,
      contentBase: `./${proName}-sdk/`, // 启动html的文件夹
      openPage: '/example/index.html',
      host: 'localhost', // 设置本地启动服务器
      historyApiFallback: true, // Set to true to return index.html instead of 404
      port: 3000 // 监听端口号
    }),
    livereload({
      watch: `${proName}-sdk/` // 热更新监听文件夹
    }),

  ]
}
