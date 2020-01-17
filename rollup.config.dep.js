 // 最小化代码
 const { uglify } = require('rollup-plugin-uglify')

 // 文件拷贝
 const copy = require('rollup-plugin-copy')

 const cliParams = process.argv.filter(item => item.includes('=')).reduce((total, item) => ({ [item.split('=')[0].substr(2)]: item.split('=')[1], ...total }), {})

 // 项目名称
 let proName = cliParams.pro

 module.exports = {
   input: `./${proName}-sdk/example`,
   output: {
     file: `deploy/${proName}-sdk/build/index.js`,
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
     copy({
      targets: [
        { src: `./${proName}-sdk/example/index.html`, dest:  `deploy/${proName}-sdk/example/` },
      ]
    })
   ]
 }
