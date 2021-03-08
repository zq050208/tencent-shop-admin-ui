import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
		// redirect: '/login',
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
  },
  {
    path: '/home',
    component: Layout,
		redirect: '/home/home',
		name: '概览',
		meta: {
      title: '概览',
      icon: 'lock'
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/home'),
        name: 'home',
        meta: { title: '概览', icon: 'el-icon-orange',  affix: true }
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
		redirect: '/order/order',
		name: '订单管理',
		meta: {
      title: '订单管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/order'),
        name: 'order',
        meta: { title: '订单列表', icon: 'el-icon-orange',  affix: true }
      },
      {
        path: 'recovery',
        component: () => import('@/views/order/recovery'),
        name: 'order',
        meta: { title: '追缴列表', icon: 'el-icon-orange',  affix: true }
      },
    ]
  },
  {
    path: '/merchant',
    component: Layout,
		redirect: '/merchant/merchant',
		name: '商户管理',
		meta: {
      title: '商户管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'merchant',
        component: () => import('@/views/merchant/merchant'),
        name: 'merchant',
        meta: { title: '商户列表', icon: 'el-icon-orange',  affix: true }
      },
      // {
      //   path: 'recovery',
      //   component: () => import('@/views/order/recovery'),
      //   name: 'order',
      //   meta: { title: '追缴列表', icon: 'el-icon-orange',  affix: true }
      // },
    ]
  },
  {
    path: '/coupon',
    component: Layout,
    redirect: '/coupon/couponList',
    name: '营销中心',
    meta: {
      title: '营销中心',
      icon: 'lock'
    },
    children: [
      {
        path: 'couponList',
        component: () => import('@/views/coupon/couponList'),
        name: 'couponList',
        meta: { title: '优惠券列表'}
      },
      {
        path: 'addCoupon',
        component: () => import('@/views/coupon/addCoupon'),
        name: 'addCoupon',
        meta: { title: '添加优惠券'}
      },
      {
        path: 'usedCouponList',
        component: () => import('@/views/coupon/usedCouponList'),
        name: 'usedCouponList',
        meta: { title: '优惠券追踪'}
      },
      {
        path: 'couponPackList',
        component: () => import('@/views/coupon/couponPackList'),
        name: 'couponPackList',
        meta: { title: '优惠券包'}
      },
      {
        path: 'addCouponPack',
        component: () => import('@/views/coupon/addCouponPack'),
        name: 'addCouponPack',
        meta: { title: '添加优惠券包'}
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/accountList',
    name: '系统设置',
    meta: {
      title: '系统设置',
      icon: 'lock'
    },
    children: [
      {
        path: 'accountList',
        component: () => import('@/views/system/account/accountList'),
        name: 'accountList',
        meta: { title: '系统设置'}
      },
      {
        path: 'addAccount',
        component: () => import('@/views/system/account/addAccount'),
        name: 'addAccount',
        meta: { title: '添加人员'}
      },
      {
        path: 'actionLog',
        component: () => import('@/views/system/account/actionLog'),
        name: 'actionLog',
        meta: { title: '行为日志'}
      },
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles 需要权限限制的页面
 */
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
