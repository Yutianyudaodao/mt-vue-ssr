import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import home from './modules/home'

Vue.use(Vuex)

const store = () => new Vuex.store({
  modules:{
    geo,
    home
  },
  actions:{
    async nuxtServerInit({commit},{req,app}){
      const {status,data:{province,city}} = await app.$axios.get('/geo/getPosition');
      commit('geo/setPosition',status===200?
      {city,province}:
      {city:'',province:''})
    }
  }
})

export default store