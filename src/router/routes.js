import api from '../util/api';

const auth = async (to, from, next) => {
  try {
    const { data } = await api.get('/auth');
    return data.id ? next() : next({ name: 'login' });
  } catch (error) {
    next({ name: 'login' });
  }
};

const routes = [
  {
    path: '/admin',
    beforeEnter: auth,
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { name: 'admin', path: '', component: () => import('pages/Admin.vue')}
    ]
  },

  {
    name: 'login',
    path: '/login',
    beforeEnter: async (to, from, next) => {
      try {
        const { data } = await api.get('/auth');
        return data.id ? next({ name: 'login' }) : next();
        next();
      } catch (error) {
        next();
      }
    },
    component: () => import('layouts/LoginLayout.vue'),
  },

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
