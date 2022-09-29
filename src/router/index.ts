import { createRouter, createWebHistory } from 'vue-router'

import userRoutes from './user'
import postRoutes from './post'
import commentRoutes from './comment'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    ...userRoutes,
    ...postRoutes,
    ...commentRoutes,
  ],
})

export default router
