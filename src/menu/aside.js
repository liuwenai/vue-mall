// 菜单 侧边栏
import admin from './modules/admin'
import develope from './modules/develope'
import flow from './modules/flow'
import xsheet from './modules/xsheet'
import book from './modules/book'
import order from './modules/order'
import user from './modules/user'
export default [
  { path: '/index', title: '首页', icon: 'home' },
  book,
  order,
  user,
  admin,
  develope,
  flow,
  xsheet
]
