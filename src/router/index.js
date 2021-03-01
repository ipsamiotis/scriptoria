import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/0_clef_recognition/edit/:taskId',
    name: 'ClefRecognition',
    component: () => import('@/views/ClefRecognition.vue')
  },
  {
    path: '/1_time_recognition/edit/:taskId',
    name: 'TimeRecognition',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk
    component: () => import('@/views/TimeRecognition.vue')
  },
  {
    path: '/2_key_recognition/edit/:taskId',
    name: 'KeyRecognition',
    component: () => import('@/views/KeyRecognition.vue')
  },
  {
    path: '/3_note_transcription/edit/:taskId',
    name: 'NoteTranscription',
    component: () => import('@/views/NoteTranscription.vue')
  },
  {
    path: '/4_note_pitch/edit/:taskId',
    name: 'NotePitch',
    component: () => import('@/views/NotePitch.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/PageNotFound.vue')
  },
]

const router = createRouter({
  history: createWebHistory(), // optional base to provide. Useful when the application is hosted inside of a folder like https://example.com/folder/
  routes
})

export default router
