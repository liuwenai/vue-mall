export default {
    path: '/book',
    title: '书籍管理',
    icon: 'book',
    children: (pre => [
      { path: `${pre}book`, title: '书籍列表', icon: 'bars' },
      { path: `${pre}author`, title: '作者列表', icon: 'user' },
    ])('/')
  }
  