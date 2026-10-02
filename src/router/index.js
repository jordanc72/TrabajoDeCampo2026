import { createRouter, createWebHistory } from 'vue-router'
import TotemView from '../views/TotemView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegistroView from '../views/RegistroView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'totem',
      component: TotemView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/registrar',
      name: 'registro',
      component: RegistroView,
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const isPublicRoute = !to.meta.requiresAuth

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (token && (to.name === 'login' || to.name === 'registro')) {
    return next('/dashboard')
  }

  if (!isPublicRoute && !token) {
    return next('/login')
  }

  next()
})

export default router