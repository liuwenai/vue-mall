export default {
    path: '/order',
    title: '订单管理',
    icon: 'area-chart',
    children: (pre => [
      { path: `${pre}address`, title: '地址列表', icon: 'bar-chart' },
      { path: `${pre}cart`, title: '购物车', icon: 'cart-plus' },
      { path: `${pre}order`, title: '订单列表', icon: 'address-card' },
    ])('/')
  }
  