import Vue from 'vue'
import Router from 'vue-router'
import Main from "@/components/main"
import store from "@/store"
Vue.use(Router)

const detailRouter = [
  {
    // 登录
    path: '/login',
    name: 'login',
    component: (resolve) => require(["@/views/login"], resolve)
  },

  {
    // 註冊
    path: '/signUp',
    name: 'signUp',
    component: () => import("@/views/signUp"),
  },

  {
    path: '/',
    name: "Main",
    component: Main,
    redirect: "/login",
    children: [
      //主页
      {
        path: '/home',
        name: 'home',
        component: () => import("@/views/home"),
      },
      {
        path: '/home/addProduct',
        name: 'addProduct',
        component: () => import("@/views/home/addProduct"),
      },
      {
        path: '/shopList',
        name: 'shopList',
        component: () => import("@/views/shopList"),
      },
      {
        path: '/orderList',
        name: 'orderList',
        component: () => import("@/views/orderList"),
      },
      {
        path: 'userInfoCenter',
        name: 'userInfoCenter',
        component: () => import("@/views/userInfo"),
      },
      {
        path: '/homeConfig',
        name: 'homeConfig',
        component: () => import("@/views/homeConfig"),
      },
    ]
  }


]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: detailRouter
})
router.beforeEach(async (to, from, next) => {
  next();
})
export default router