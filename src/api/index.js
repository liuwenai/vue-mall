import * as system from './admin'
import * as base from './file'
import * as mall from "./mall"
export const allApi = {
  ...system['system'],
  ...base['base'],
  ...mall['mall']
}
