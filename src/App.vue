<template>
 <div id="app">
      <router-view></router-view>
 </div>
</template>

<script>
 export default {
   data () {
     return {

     }
   },
   components: {

   }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './common/stylus/mixins.styl'
  #app
    height 100%
    min-width 1366px
 
</style>
