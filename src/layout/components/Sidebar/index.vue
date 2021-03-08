<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper" style="width:211px"> -->
    <el-scrollbar style="height: 100%;" class="sidemenu-el-scrollbar">
      <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :background-color="variables.menuBg"
              :text-color="variables.menuText"
              :unique-opened="false"
              :active-text-color="variables.menuActiveText"
              :collapse-transition="false"
              mode="vertical"
      >
        <sidebar-item v-for="route in menu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data(){
    return{
      showLogo: true,
      menu: [
        {
          path: '/home',
          icon: 'dashboard',
          name: '概览',
          children: [
            {
              path: 'home',
              name: 'home',
              meta: { title: '概览', icon: 'star' }
            },
          ]
        },
        {
          path: '/order',
          icon: 'dashboard',
          name: '订单管理',
          children: [
            {
              path: 'order',
              name: 'order',
              meta: { title: '订单列表', icon: 'star' }
            },
            {
              path: 'recovery',
              name: 'recovery',
              meta: { title: '追缴列表', icon: 'star' }
            },
          ]
        },
        {
          path: '/merchant',
          icon: 'dashboard',
          name: '商户管理',
          children: [
            {
              path: 'merchant',
              name: 'merchant',
              meta: { title: '商户列表', icon: 'star' }
            },
          ]
        },
        {
          path: '/coupon',
          name: '营销中心',
          icon: 'dashboard',
          children: [
            {
              path: 'couponList',
              name: 'couponList',
              meta: { title: '优惠券列表', icon: 'star' }
            },
            {
              path: 'usedCouponList',
              name: 'usedCouponList',
              meta: { title: '优惠券追踪', icon: 'star' }
            },
            {
              path: 'couponPackList',
              name: 'couponPackList',
              meta: { title: '优惠券包', icon: 'star' }
            },
          ]
        },
        {
          path: '/system',
          name: '系统设置',
          icon: 'skill',
          children: [
            {
              path: 'accountList',
              name: 'accountList',
              meta: { title: '系统设置', icon: 'star'}
            },
            {
              path: 'actionLog',
              component: () => import('@/views/system/account/actionLog'),
              name: 'actionLog',
              meta: { title: '行为日志', icon: 'star'}
            },
          ]
        },
        /** when your routing map is too long, you can split it into small modules **/
        // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }
      ]
    }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      // 'menu',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  methods: {
    setScrollHeight() {
      const height = window.innerHeight;
      let scrollBar = document.querySelector('.sidemenu-el-scrollbar');
      scrollBar.style.height = height
    }
  },
  mounted(){
    this.setScrollHeight()
  }
}
</script>
<style lang="scss" scoped>
  .wanwu{
    height: 50px;
    color:#DFDFDF;
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    background: #ffffff;
  }
  /deep/ .el-menu{
    border-right: none;
  }
</style>

