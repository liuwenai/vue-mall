import * as system from './admin'
import * as base from './file'

export const allApi = {
  ...system['system'],
  ...base['base']
}
