<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 头像区 -->
        <img src="../../public/n.jpg" alt />
      </div>
      <!-- 表单区 -->
      <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-geren" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据绑定
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //表单验证
      loginRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 6, message: '长度在 4 到 6 个数字', trigger: 'blur' }
        ]
      }

    };
  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid){
          return
        }
        const {data} = await this.$http.post('login',this.loginForm)
        if(data.meta.status !== 200){
         this.$message.error('登录失败')
        }else{
          this.$message.success('登录成功')
          console.log(data)
          //1 将登录成功之后的token，保存到客服端的 sessionStorage中
          //1.1 项目中除了登录之外的其他api接口，必须在登录之后才能运行
          //1.2 token只是在当前网站打开期间才生效，所有将token保存到sessionStorage
          window.sessionStorage.setItem('token',data.data.token)
          //2通过编程式导航栏跳转到后台主页 路由地址是‘/home’
          this.$router.push('/home')
          }
      })
    }
  },
  components: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../common/stylus/mixins.styl';

.login_container 
  background-color: pink;
  height: 100%;
  position relative

  .login_box 
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    


    .avatar_box
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 2px 2px 20px #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img 
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #fff;
    .login_form
      position absolute
      width 100%
      bottom 0
      padding 0 20px
      box-sizing border-box
      .btns
        display flex
        justify-content center
</style>
