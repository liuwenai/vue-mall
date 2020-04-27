/* eslint-disable no-sparse-arrays */
/**
 * 开发相关的页面
 */
export default [
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/mall/user'),
      meta: {
        // cache: true,
        title: '用户列表'
      }
    },
    {
        path: '/address',
        name: 'address',
        component: () => import('@/views/mall/address'),
        meta: {
          // cache: true,
          title: '地址列表'
        }
      },
      {
        path: '/author',
        name: 'author',
        component: () => import('@/views/mall/author'),
        meta: {
          // cache: true,
          title: '作者列表'
        }
      },
      {
        path: '/book',
        name: 'book',
        component: () => import('@/views/mall/book'),
        meta: {
          // cache: true,
          title: '书籍列表'
        }
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/mall/order'),
        meta: {
          // cache: true,
          title: '订单列表'
        }
      },
  
  ]
  