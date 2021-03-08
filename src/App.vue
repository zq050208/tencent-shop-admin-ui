<template>
  <div id="app">
      <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>

export default {
  mounted () {
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener('hashchange', () => {
      let currentPath = window.location.hash.slice(1)
      console.log('23331111', currentPath);
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
    // 首次登录能拿到accessToken,但是必须修改密码
    let currentPath = window.location.hash.slice(1)
    const isFirstLogin = localStorage.getItem(('isFirstLogin'));
    if (isFirstLogin && isFirstLogin === '1' && currentPath !== '/login') {
      window.location.href = '#/login';
    }
  },
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>

</style>
