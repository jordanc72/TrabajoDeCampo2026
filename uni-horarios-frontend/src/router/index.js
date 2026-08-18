import { createRouter, createWebHistory } from 'vue-router'
import TotemView from '../views/TotemView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(), // Usa el historial nativo del navegador para URLs limpias
  routes: [
    {
      path: '/',
      name: 'totem',
      component: TotemView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

export default router