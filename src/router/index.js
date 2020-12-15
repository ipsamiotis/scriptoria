import { createRouter, createWebHistory } from 'vue-router'

// import ClefRecognition from '@/views/ClefRecognition.vue'
// import TimeRecognition from '@/views/TimeRecognition.vue'

const routes = [
  {
    path: '/clef_recognition/:taskId',
    name: 'ClefRecognition',
    // component: ClefRecognition
    component: () => import('@/views/ClefRecognition.vue')
  },
  {
    path: '/time_recognition/:taskId',
    name: 'TimeRecognition',
    // component: TimeRecognition
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk
    component: () => import('@/views/TimeRecognition.vue')
  }
]

const router = createRouter({
  history: createWebHistory(), // optional base to provide. Useful when the application is hosted inside of a folder like https://example.com/folder/
  routes
})

export default router
