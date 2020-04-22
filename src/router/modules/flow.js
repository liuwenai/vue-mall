export default [
  {
    path: '/flc',
    name: 'flc',
    component: () => import('@/views/flow/flc'),
    meta: {
      // cache: true,
      title: '流程定义'
    }
  },

  {
    path: '/flcspjl',
    name: 'flcspjl',
    component: () => import('@/views/flow/flcspjl'),
    meta: {
      cache: true,
      title: '流程记录'
    }
  }

  // @route@
]
