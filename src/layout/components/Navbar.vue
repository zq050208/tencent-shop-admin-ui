<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <div class="header_r">
        <el-dropdown>
          <span class="el-dropdown-link">
            ETC加油
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changedata">修改资料</el-dropdown-item>
            <el-dropdown-item @click.native="add=true;dialog = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="exit">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <!-- 新增信息 -->
      <span>{{ username || '' }}</span>
      <span style="padding: 0 10px;">|</span>
      <a :href="changePasswordHref" style="color: #000">修改密码</a>
      <span style="padding: 0 10px;">|</span>
      <span style="cursor: pointer" @click="handleLogout">退出</span>
    </div>
  </div>
</template>

<script>
import { logout} from "@/api/api.js"; //引入login
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import cookies from 'js-cookie'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    // Hamburger
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  created() {
    console.log('env:', process.env.NODE_ENV, window.location.origin)
    if ( process.env.NODE_ENV=== 'development') {
      this.changePasswordHref = 'https://dev.refuel.gplqdb.com/wolf/rbac/change_pwd.html'
    } else {
      this.changePasswordHref = window.location.origin + '/wolf/rbac/change_pwd.html'
    }
  },
  data() {
    return {
      // 弹窗的信息
      form: {},
      changePasswordHref: '',
      username: cookies.get('X-Username')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 修改信息
    changedata() {
      this.$router.push('/changedata')
    },
     // 注销
    exit(){
      logout().then(res => {
          console.log(res)
      })
    },
    // 弹窗
    handleClose(done) {
      this.form = {}
      this.input = ''
      done()
    },
    // 退出
    handleLogout() {
      localStorage.setItem('cellphone', '')
      localStorage.setItem('accessToken', '')
      cookies.set('accessToken', '' )
      cookies.remove('x-rbac-token')
      cookies.remove('X-Username')
      window.location.reload()
      // this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  z-index: 11;
  .header_left{
      float: left;
      width: 350px;
      margin-left: 45px;
      span{
          color:#DFDFDF;
      }
  }
  .header_r{
      float: right;
      margin-right: 100px;
  }
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 18px;
    font-weight: bold;

}
.el-icon-arrow-down {
    font-size: 16px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    fill: #fff;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right:100px ;
    color: $black;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
