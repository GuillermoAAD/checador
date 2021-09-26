import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Checador from '../views/Checador.vue'
import Login from '../views/Login.vue'
import Signup from '../views/SignUp.vue'
import LoginAdmin from '../views/LoginAdmin.vue'
import ChecadorAdmin from '../views/ChecadorAdmin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Checador
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/loginAdmin',
    name: 'loginAdmin',
    component: LoginAdmin
  },
  {
    path: '/checadorAdmin',
    name: 'checadorAdmin',
    component: ChecadorAdmin
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
