import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/clef_recognition/:taskId',
    name: 'ClefRecognition',
    component: () => import('@/views/ClefRecognition.vue')
  },
  {
    path: '/time_recognition/:taskId',
    name: 'TimeRecognition',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk
    component: () => import('@/views/TimeRecognition.vue')
  },
  {
    path: '/key_recognition/:taskId',
    name: 'KeyRecognition',
    component: () => import('@/views/KeyRecognition.vue')
  }
]

const router = createRouter({
  history: createWebHistory(), // optional base to provide. Useful when the application is hosted inside of a folder like https://example.com/folder/
  routes
})

export default router
