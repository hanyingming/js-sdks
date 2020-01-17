class BaseSdk {
  /**
   * 校验参数类型
   * @param params
   * par参数
   * sType类型
   * 返回 true 或 false, false 表示参数校验不通过
   */
  checkParamsType = (params, paramsType) => {
    let status = true
    if (JSON.stringify(paramsType) === '{}') {
      status = true
    } else {
      Object.keys(paramsType).forEach((e) => {
        if (typeof params[e] === 'object') {
          if (paramsType[e] === null && params[e] !== null) {
            console.error(`error类型错误：传入的参数值中${e}:${params[e]} 应该是${paramsType[e]} 类型`)
            status = false
          } else if (paramsType[e] === 'array' && !Array.isArray(params[e])) {
            console.error(`error类型错误：传入的参数值中${e}:${params[e]} 应该是${paramsType[e]} 类型`)
            status = false
          }
        } else if (typeof params[e] !== paramsType[e]) {
          console.error(`error类型错误：传入的参数值中${e}:${params[e]} 应该是${paramsType[e]} 类型`)
          status = false
        } else if (paramsType[e] === 'string' && (params[e].length <= 0 || params[e] === 'undefined' || params[e] === 'null')) {
          console.error(`必须合法赋值error：${e}参数必须传值，当前值是${params[e]}`)
          status = false
        }
      })
    }
    return status
  }

  /**
   * 校验必传参数类型
   * @param params
   * params 参数
   * paramsType 参数类型
   * 返回 true 或 false, false 表示参数校验不通过
   */
  checkParamsMust = (params, paramsType) => { // 默认传入的参数都是对象或undefined
    let status = true
    if (typeof params === 'undefined' && typeof paramsType !== 'undefined') {
      return false
    }
    Object.keys(paramsType).forEach((e) => {
      if (!Object.prototype.hasOwnProperty.call(params, e)) {
        console.error(`必传参数error：${e}参数必传，类型是${paramsType[e]}`)
        status = false
      } else {
        status = checkParamsType(params, paramsType)
      }
    })
    return status
  }

  // 判断全局变量是否存在
  checkGlobalVar = (varName) => {
    let status = window && window[varName] ? true : false
    if (!status) {
      console.error(`检测全局变量：window.${varName}为 ${window && window[varName]}`)
    }
    return status
  }

  // 检测是否在微信中
  checkInWx = () => window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ? true : false

  // 检测是否在小程序中
  checkInWeapp = () => window.__wxjs_environment === 'miniprogram' ? true : false

  // 校验小程序环境是否存在
  checkWeappEnv = () => {
    let status = window && window.wx && window.wx.miniProgram && window.wx.miniProgram ? true : false
    if (!status) {
      console.error(`检测小程序环境变量：window.wx为 ${window && window.wx}`)
    }
    return status
  }

  // 检查当前环境是否在移动端
  checkInMoblie = () => /Android|webOS|iPad|iPod|BlackBerry|IEMobile|Opera Mini|ucweb|rv:1.2.3.4|midp|windows ce|windows mobile|iphone os|/i.test(navigator.userAgent) ? true : false

  // 获取网页所在客户端
  getClientEnv = () => {
    const descText = {
      wx: '微信-移动端',
      weapp: '微信小程序',
      mobile: '移动浏览器',
      pc: 'pc网页浏览器'
    }
    let env = ''
    if (this.checkInWx()) { // 微信移动端
      env = 'wx'
    } else if (this.checkInWeapp()) { // 微信小程序
      env = 'weapp'
    } else if (this.checkInMoblie()) {
      env = 'mobile'
    } else {
      env = 'pc'
    }
    console.log(`网页所在客户端环境：${env}-${descText[env]}; `, JSON.stringify(descText))
    return env
  }

  // 获取url中的参数
  getQueryString = () => {
    const queryString = {}
    const query = window.location.search.substr(1)
    if (!query) {
      return {}
    }
    const vars = query.split('&')
    vars.forEach((v) => {
      const pair = v.split('=')
      if (!Object.prototype.hasOwnProperty.call(queryString, pair[0])) {
        queryString[pair[0]] = decodeURIComponent(pair[1])
      } else if (typeof queryString[pair[0]] === 'string') {
        const arr = [queryString[pair[0]], decodeURIComponent(pair[1])]
        queryString[pair[0]] = arr
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]))
      }
    })
    return queryString
  }

  /**
   * 获取Cookie值
   * @param params
   * 如传值就获取传入对应的参数，如果有就返回值。没有就返回空字符串
   * 如果不传值就返回整个cookie转化的对象
   */
  getCookie = (key) => {
    const cookies = document.cookie ? document.cookie.split(';') : []
    const rdecode = /(%[0-9A-Z]{2})+/g
    let result = {}
    for (i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      let cookie = parts.slice(1).join('=')
      if (cookie.charAt(0) === '"') {
        cookie = cookie.slice(1, -1)
      }
      const name = parts[0].replace(rdecode, decodeURIComponent).trim()
      cookie = cookie.replace(rdecode, decodeURIComponent).trim()
      if (key === name) {
        result = cookie
        break
      }
      if (!key) {
        result[name] = cookie
      }
    }
    return result
  }

}

export default new BaseSdk
