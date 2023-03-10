import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login_.vue'

Vue.use(VueRouter)
// /* eslint-disable */
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/login_.vue')
  },
  {
    path:'/home',
    component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/home_.vue'),
    children:[
      {
        path:'/',
        redirect:'/home/welcome'
      },
      {path:'welcome',
       component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/welcome_.vue')
      },
      {
        path:'/users',
        component: () => import(/* webpackChunkName: "users_Rights_Roles" */ '@/components/user/user_list.vue')
      },
      {
        path:'/roles',
        component: () => import(/* webpackChunkName: "users_Rights_Roles" */ '@/components/limits/limits_roles.vue')
      },
      {
        path:'/rights',
        component: () => import(/* webpackChunkName: "users_Rights_Roles" */ '@/components/limits/limits_rights.vue')
      },
      {
        path:'/goods',
        component: () => import(/* webpackChunkName: "goods_Add" */ '@/components/shangpin/shangpin_goods.vue')
      },
      {
        path:'/params',
        component: () => import(/* webpackChunkName: "params_Cate" */ '@/components/shangpin/shangpin_params.vue')
      },
      {
        path:'/categories',
        component: () => import(/* webpackChunkName: "params_Cate" */ '@/components/shangpin/shangpin_categories.vue')
      },
      {
        path:'/goods_add',
        component: () => import(/* webpackChunkName: "goods_Add" */ '@/components/shangpin/goods_add.vue')
      },
      {
        path:'/orders',
        component: () => import(/* webpackChunkName: "order_Reports" */ '@/components/orders/orders_list.vue')
      },
      {
        path:'/reports',
        component: () => import(/* webpackChunkName: "order_Reports" */ '@/components/reports/reports_list.vue')
      },

    ]
  }

]
// /* eslint-disable */
const router = new VueRouter({
  routes
})

// 挂在路由导航守卫
router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next();
  //获取token
  const token = window.sessionStorage.getItem('token_');
  // console.log(token);
  if(!token) return next('/login');
  next();
})

export default router
