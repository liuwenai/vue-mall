/* eslint-disable no-sparse-arrays */
/**
 * 开发相关的页面
 */
export default [
  {
    path: '/designer',
    name: 'designer',
    component: () => import('@/views/develope/designer'),
    meta: {
      cache: true,
      title: '设计器'
    }
  },
  {
    path: '/generator',
    name: 'generator',
    component: () => import('@/views/develope/generator'),
    meta: {
      cache: true,
      title: '代码助手'
    }
  }

]
