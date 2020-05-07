import * as address from './address'
import * as author from './author'
import * as book from './book'
import * as user from './user'
import * as order from './order'
export const mall = {
  ...address,
  ...author,
  ...book,
  ...user,
  ...order,
}
