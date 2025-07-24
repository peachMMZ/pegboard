import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: () => import('@/layout/MainLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        props: true,
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: '/marketplace',
        name: 'marketplace',
        component: () => import('@/views/marketplace/index.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/about/index.vue'),
      }
    ]
  },
]

export default routes
