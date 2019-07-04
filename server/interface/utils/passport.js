import Passport from 'koa-passport'; //验证权限
import LoaclStrategy from 'passport-local'; //本地验证
import UserModel from '../../dbs/models/users';


// 提交数据(策略)
Passport.use(new LoaclStrategy(async (username,password,done)=>{
  let where = {
    username
  };
  let result = await UserModel.findOne(where);
  if(result != null){
    if(result.password === password){
      return done(null,result)
    }else{
      return done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户不存在')
  }

}))

//存储session  序列化
Passport.serializeUser(function(user,done){
  done(null,user)
})
//反序列化
Passport.deserializeUser(function(user,done){
  done(null,user)
})


module.exports = Passport

