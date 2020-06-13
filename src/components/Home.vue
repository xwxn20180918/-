<template>
 <div>
    <el-button type="info" @click="logout">退出</el-button>
 </div>
</template>

<script>
 export default {
   data () {
     return {

     }
   },
   methods:{
     logout(){
       //清空sessionStorage
       window.sessionStorage.clear()
       //跳转到登录界面
       this.$router.push('/login')
    }
   },
   components: {

   }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

 
</style>
