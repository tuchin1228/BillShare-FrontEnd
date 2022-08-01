import {
  createRouter,
  createWebHistory
} from 'vue-router'
import {
  useCookies
} from "vue3-cookies";
import Home from '../views/Home.vue'
import Details from '../views/Details.vue'
import AddExpend from '../views/AddExpend.vue'
import Checkout from '../views/Checkout.vue'
import AddUser from '../views/AddUser.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GroupList from '../views/GroupList.vue'
import Invite from '../views/Invite.vue'
import AddGroup from '../views/AddGroup.vue'

const {
  cookies
} = useCookies();


const router = createRouter({
  history: createWebHistory(),
  // history: createWebHistory(
  //   import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/grouplist',
      name: 'grouplist',
      component: GroupList
    },
    {
      path: '/invite/:GroupId/:ValidateCode',
      name: 'invite',
      component: Invite
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/addGroup',
      name: 'addGroup',
      component: AddGroup
    },
    {
      path: '/:groupId/details/:expendId',
      name: 'details',
      component: Details
    },
    {
      path: '/:groupId/addExpend',
      name: 'addExpend',
      component: AddExpend
    },
    {
      path: '/:groupId/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/:groupId/addUser',
      name: 'addUser',
      component: AddUser
    },
    {
      path: '/:groupId',
      name: 'home',
      component: Home
    },

  ]
})

router.beforeEach((to, from, next) => {

  if (to.name == 'login' || to.name == 'invite' || to.name == 'register' || cookies.get('token')) {
    next()
  }else{
    next({ name: 'login' });
  }
})

export default router;