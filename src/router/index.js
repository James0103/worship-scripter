import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import WorshipForm from '../pages/WorshipForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/worship-form',
      name: 'worship-form',
      component: WorshipForm,
      props: (route) => ({
        type: route.query.type,
      }),
      beforeEnter: (to, from, next) => {
        const validTypes = ['sunday', 'wednesday']
        if (!validTypes.includes(to.query.type)) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
  ],
})

export default router
