/* eslint-disable no-sparse-arrays */
/**
 * 系统管理部分
 */
export default [

  {
    path: '/department',
    name: 'department',
    component: () => import('@/views/admin/bdepartment'),
    meta: {
      title: '部门列表'
    }
  },
  {
    path: '/role',
    name: 'role',
    component: () => import('@/views/admin/brole'),
    meta: {
      title: '角色列表'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/admin/buser'),
    meta: {
      title: '用户列表'
    }
  },

  {
    path: '/menu',
    name: 'bmenu',
    component: () => import('@/views/admin/bmenu'),
    meta: {
      title: '菜单列表'
    }
  },
  {
    path: '/base',
    name: 'base',
    component: () => import('@/views/admin/base'),
    meta: {
      cache: true,
      title: '模型管理'
    }
  }

]
