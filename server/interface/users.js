import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer'; //发邮件
import User from '../dbs/models/users';
import Passport from './utils/passport';
import Email from '../dbs/config';
import axios from './utils/axios'

let router = new Router({
  prefix: './users'
})

let Store = new Redis().client;

//注册
router.post('/signup',async (ctx)=>{
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;

  // 验证码判断
  if(code){
    const saveCode = await Store.hget(`nodemail:${username}`,'code');
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire');
    if(code === saveCode){
      if(new Date().getTime() - saveExpire > 0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return

      }
    }else{
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  }else{
    ctx.body={
      code: -1,
      msg: '请填写验证码'
    }
  };

  let user = await User.find({
    username
  });
  // 用户名已被注册
  if(user.length){
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }

  //写库
  let nuser = await User.create({
    username,
    password,
    email
  });
  if(nuser){
    let res = await axios.post('/users/signin',{
      username,
      password
    });
    if(res.data && res.data.code === 0){
      ctx.body = {
        code:0,
        msg:'注册成功',
        user:res.data.user
      }
    }else{
      ctx.body={
        code:-1,
        msg:'error'
      }
    }

  }else{
    ctx.body={
      code:-1,
      msg:'注册失败'
    }
  }

})

//登录
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

//邮件验证
router.post('/verify',async (ctx, next)=>{
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  };

  //发给谁
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  });
  //发送信息
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  };
  //邮件内容
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}`
  };
  //发送
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  //响应
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

//退出
router.get('/exit',async (ctx, next)=>{
  await ctx.logout();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

//获取用户名
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user
    ctx.body={
      user:username,
      email
    }
  }else{
    ctx.body={
      user:'',
      email:''
    }
  }
})

export default router
