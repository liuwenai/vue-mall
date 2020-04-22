export default {
  path: '/spreadsheet',
  title: '电子表格',
  icon: 'windows',
  children: (pre => [
    { path: `${pre}xsheet`, title: '电子表格', icon: 'file-excel-o' }
  ])('/')
}
