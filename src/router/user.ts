import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/users',
    name: 'users',
    redirect: { name: 'user.list' },
    component: () => import('../views/user/UserContainer.vue'),
    children: [
      {
        path: '',
        name: 'user.list',
        component: () => import('../views/user/UserListView.vue'),
      },
      {
        path: ':userId',
        name: 'user.update',
        component: () => import('../views/user/UserUpdateView.vue'),
      },
      {
        path: 'create',
        name: 'user.create',
        component: () => import('../views/user/UserCreateView.vue'),
      },
    ],
  },
]
