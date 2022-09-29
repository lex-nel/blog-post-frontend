import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/posts',
    name: 'posts',
    redirect: { name: 'post.list' },
    component: () => import('../views/post/PostContainer.vue'),
    children: [
      {
        path: '',
        name: 'post.list',
        component: () => import('../views/post/PostListView.vue'),
      },
      {
        path: ':postId',
        name: 'post.update',
        component: () => import('../views/post/PostUpdateView.vue'),
      },
      {
        path: 'create',
        name: 'post.create',
        component: () => import('../views/post/PostCreateView.vue'),
      },
    ],
  },
]
