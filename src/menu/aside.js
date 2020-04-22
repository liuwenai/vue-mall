// 菜单 侧边栏
import admin from './modules/admin'
import develope from './modules/develope'
import flow from './modules/flow'
import xsheet from './modules/xsheet'
export default [
  { path: '/index', title: '首页', icon: 'home' },
  admin,
  develope,
  flow,
  xsheet,
  {
    path: 'demo',
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' }
    ]
  }
]
