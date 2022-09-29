import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/comments',
    name: 'comments',
    redirect: { name: 'comment.list' },
    component: () => import('../views/comment/CommentContainer.vue'),
    children: [
      {
        path: '',
        name: 'comment.list',
        component: () => import('../views/comment/CommentListView.vue'),
      },
      {
        path: ':commentId',
        name: 'comment.update',
        component: () => import('../views/comment/CommentUpdateView.vue'),
      },
      {
        path: 'create',
        name: 'comment.create',
        component: () => import('../views/comment/CommentCreateView.vue'),
      },
    ],
  },
]
