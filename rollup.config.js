const lodash = require('lodash')

// 基础配置
const configBase = require('./rollup.config.base')

// 处理数组合并
function customizer(objValue, srcValue) {
    if (lodash.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

// 根据NODE_ENV 判断环境
const handleConfig = () => {
    let config = ''
    switch(process.env.NODE_ENV) {
        case `dev`: // 开发
            config = lodash.mergeWith(configBase, require('./rollup.config.dev'), customizer)
            break;
        case `prod`: // 打包
            config = lodash.mergeWith(configBase, require('./rollup.config.prod'), customizer)
            break;
        case `dep`: // 部署
            config = lodash.mergeWith(configBase, require('./rollup.config.dep'), customizer)
            break;
    }
    return config
}

// 整合配置信息
const config = handleConfig()
// console.log('config:', config)

module.exports = config






