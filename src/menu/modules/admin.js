export default {
  path: '/system',
  title: '系统管理',
  icon: 'gavel',
  children: (pre => [
    { path: `${pre}role`, title: '角色列表', icon: 'user' },
    { path: `${pre}user`, title: '用户列表', icon: 'user-o' },
    { path: `${pre}department`, title: '部门列表', icon: 'users' },
    { path: `${pre}menu`, title: '菜单列表', icon: 'server' },
    { path: `${pre}base`, title: '模型管理', icon: 'building' }
  ])('/')
}
