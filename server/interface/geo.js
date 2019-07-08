import Router from 'koa-router';
import axios from './utils/axios';
import Province from '../dbs/models/provinces';
import City from '../dbs/models/city';
import Menu from '../dbs/models/menu';

let router = new Router({prefix:'/geo'});
const sign = 'abcd';

//获取地区
router.get('/getPosition',async (ctx)=>{


  // let {status,data:{province,city}} = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`);
  let status = 300;
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


//获取省
router.get('/province', async (ctx) => {
  let province = await Province.find()
  ctx.body = {
    province: province.map(item => {
      return {
        id: item.id,
        name: item.value[0]
      }
    })
  }
  
})

//获取城市
router.get('/city', async (ctx) => {
  let city = []
  let result = await City.find();
  result.forEach(item => {
    city = city.concat(item.value)
  })
  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
          ? item.province
          : item.name
      }
    })
  }
  
})

//获取菜单
router.get('/menu', async (ctx) => {
  const result = await Menu.findOne()
  ctx.body = {
    menu: result.menu
  }
})

export default router