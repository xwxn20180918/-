import Vue from 'vue'
import Router from 'vue-router'


import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'

Vue.use(Router)
//解决location错误
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
    routes:[
        {
            path:'/login',
            component:Login
        },
        {
            path:'/',
            redirect: '/login'
        },
        {
            path:'/home',
            component:Home,
            children:[
                {
                  path:'/welcome',
                  component:Welcome
                },
                {
                  path:'/users',
                  component:Users
                },
                {
                  path:'/rights',
                  component:Rights
                },
                {
                    path:'/roles',
                    component:Roles
                  },
                {
                  path:'/',
                  redirect:'/welcome'
                },
            ],
        },
    ]
})
//挂载路由守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个页面跳转而来
    //next 代表函数 表示放行
    if(to.path === '/login'){
        return next()
    }
    //如果不是  获取token
    const Token = window.sessionStorage.getItem('token')
    if(!Token){
        return next('/login')
    }
    next()
        

    
})
export default router