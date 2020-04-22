export default {
  path: '/flow',
  title: '流程管理',
  icon: 'blind',
  children: (pre => [
    { path: `${pre}flc`, title: '流程定义', icon: 'rocket' },

    { path: `${pre}flcspjl`, title: '流程记录', icon: 'folder-o' }

    // @path@"
  ])('/')
}
