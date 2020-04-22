export default {
  path: '/develope',
  title: '开发管理',
  icon: 'windows',
  children: (pre => [
    { path: `${pre}designer`, title: '设计器', icon: 'building' },
    // { path: `${pre}domain`, title: '模型管理', icon: 'file-excel-o' },
    { path: `${pre}generator`, title: '代码助手', icon: 'building' }
  ])('/')
}
