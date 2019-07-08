import Router from 'koa-router';
import axios from './utils/axios';

let router = new Router({prefix:'/geo'});
const sign = 'abcd';

//获取地区
router.get('/getPosition',async (ctx)=>{
  let {status,data:{province,city}} = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
});

//获取菜单
router.get('/menu', async (ctx) => {
  let {status, data: {
      menu
    }} = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

export default router