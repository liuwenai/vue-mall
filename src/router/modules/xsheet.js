/* eslint-disable no-sparse-arrays */
/**
 * 和报表相关的页面
 */
export default [
  {
    path: '/xsheet',
    name: 'xsheet',
    component: () => import('@/views/xsheet'),
    meta: {
      cache: true,
      title: '在线表格'
    }
  }

]
