export default {
    path: '/user',
    title: '用户管理',
    icon: 'user-plus',
    children: (pre => [
      { path: `${pre}user`, title: '用户列表', icon: 'vcard' },
    ])('/')
  }
  