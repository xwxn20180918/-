<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="home_header">
      <div class="home_img">
        <img src="../../public/n.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧区域 -->
      <el-aside :width="isShowMenu ? '64px' : '200px'" class="home_aside">
        <div class="home_button" @click="toggleMenu">|||</div>
        <!-- 左侧菜单栏区域 -->
        <el-menu class="home_menu" background-color="#313542" text-color="#fff" active-text-color="#3887E0" 
        unique-opened :collapse="isShowMenu" :collapse-transition="false" router :default-active='active'>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="(item,index) in menuList" :key="index.id">
            <!-- 菜单模板 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+menuItem.path + ''" v-for="(menuItem,index) in item.children" 
            :key="index.id" @click="currentActive('/'+menuItem.path)">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{menuItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList:[],
      iconObj:{
        '125':'iconfont icon-yonghuguanli',
        '103':'iconfont icon-quanxian',
        '101':'iconfont icon-goods',
        '102':'iconfont icon-dingdanguanli',
        '145':'iconfont icon-shujutongji1'

      },
      isShowMenu:false, //默认不折叠
      active:''//高亮显示
    };
  },
  created(){
    this.getMenuList()
    //动态赋值 从sessionStorage 中取出来 赋值给当前active
    this.active = window.sessionStorage.getItem('active')
  },
  methods: {
    logout() {
      //清空sessionStorage
      window.sessionStorage.clear();
      //跳转到登录界面
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data} = await this.$http.get('menus')
      console.log(data)
      if(data.meta.status !== 200){
        return this.$message.error(data.meta.msg)
      }
        this.menuList = data.data
    },
    toggleMenu(){
      this.isShowMenu= !this.isShowMenu
    },
    currentActive(active){
      //将当前保存至sessionStorage
      window.sessionStorage.setItem('active',active)
      //使当前点击的高亮
      this.active = active
      }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../common/stylus/mixins.styl';

.home_container 
  height 100%

  .home_header 
    background-color #363B3F
    display flex
    justify-content space-between
    align-items center
    padding-left 0
    color #ffffff
    font-size 20px
    .home_img 
      display flex
      align-items center
      >img 
        width 50px
        height 50px
        border-radius 50%
      >span 
        margin-left 10px
  .home_aside 
    background-color #313542
    .home_button
      background-color #485062
      text-align center
      color #fff
      letter-spacing 0.2rem
      line-height 20px
      cursor pointer
    .el-menu
      border-right 0
    
  .home_main 
    background-color #E8ECF0;
  .iconfont
    margin-right 10px
  

</style>
