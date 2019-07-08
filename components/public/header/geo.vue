<template>
  <div class="m-geo">
    <i class="el-icon-location"/>{{name}}
    <nuxt-link
      class="changeCity"
      to="/changeCity">切换城市</nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "geo",
  computed:{
    ...mapState('geo',{
      city:state=>state.position.city
    })
  }
}
</script>

<style lang="css">
</style>
