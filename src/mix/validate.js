export default {
  methods: {
    validateIdentityCard (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (reg.test(value) === false) {
          callback(new Error('身份证格式错误'))
        } else {
          callback()
        }
      }
    },
    validatePhone (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        let reg = /^1(3|4|5|7|8)\d{9}$/
        if (reg.test(value) === false) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    },
    validateEmail (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (reg.test(value) === false) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
    },
    validateBh (rule, value, callback) {
      if (value.length > 2) {
        callback(new Error('不能大于两字符'))
      } else {
        callback()
      }
    }
  }
}
