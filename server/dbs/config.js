export default {
  smtp: {
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return '1396845172@qq.com'
    },
    get pass(){
      return ''
    }
  },
  //发送4位验证码
  get code(){
    return ()=>{
      return Math.random().toString(16).slice(2,6).toUpperCase()
    }
  },
  //设置过期时间：
  get expire(){
    return ()=>{
      return new Date().getTime()+60*60*60*1000
    }
  }
}