import VueRouter from 'vue-router';
import Home from './views/Home';
import Login from './views/Login';
import Admin from './views/Admin';
import http from './utils/http';

const auth = async (to, from, next) => {
  try {
    const { data } = await http.get('/auth');
    if (data.id) return next();
    next('/login');
  } catch (error) {
    next('/login');
  }
};

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: async (to, from, next) => {
      try {
        const { data } = await http.get('/auth');
        if (data.id) return next('/admin');
        next();
      } catch (error) {
        next();
      }
    },
  },
  {
    path: '/admin',
    component: Admin,
    beforeEnter: auth,
  }
];

export default new VueRouter({
  routes,
  mode: 'history'
});