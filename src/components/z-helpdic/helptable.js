/**
 * 帮助字典列数据配置
 * action:调用的接口服务
 * cols:配置要显示的列
 * @type {{erpwlzd: {action: string, cols: *[]}}}
 */
export const Helptable = {
  'base': {
    action: 'base', // 基础字典
    cols: [
      { width: '90px', prop: 'flb', label: '类别' },
      { width: '*', prop: 'fzd', label: '字典' }
    ],
    params: {}
  },
  'role': { // 角色
    action: 'rolelist',
    cols: [
      { width: '90px', prop: 'authority', label: '角色名称' },
      { width: '*', prop: 'fnote', label: '备注' }
    ],
    params: {}
  }
}
