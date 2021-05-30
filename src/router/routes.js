
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { name: 'all-images', path: '/images', component: () => import('pages/Images.vue')},
      { name: 'image', path: '/images/:id', component: () => import('pages/Image.vue')},
      { name: 'random', path: '/random', component: () => import('pages/Random.vue')},
      { name: 'api', path: '/api', component: () => import('pages/API.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
