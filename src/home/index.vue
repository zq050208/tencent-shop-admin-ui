<template>
  <div>
    <!-- <p>这是跳转页面</p> -->
    <header-bar></header-bar>
    <side-bar></side-bar>
    <div class="main">
      <el-tabs
        type="card"
        closable
        v-model="tabActive"
        @on-tab-remove="handleTabRemove"
        @on-click="handleTabClick"
      >
        <el-tab-pane
          :link="item.link"
          :label="item.label"
          :name="item.name"
          v-for="item in tabList"
          :key="item.name"
        ></el-tab-pane>
      </el-tabs>
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import headerBar from "@/components/header";
import sideBar from "@/components/sidebar";
export default {
  data() {
    return {
      tabList: [],
      tabActive: ""
    };
  },
  components: {
    headerBar,
    sideBar
  },
  computed: {
    key() {
      return this.$route.path + Math.random();
    }
  },
  methods: {
    handleTabRemove(name) {
      let idx = null;
      this.tabList.forEach((item, index) => {
        if (item.name === name) idx = index;
      });
      this.tabList.splice(idx, 1);
      this.includeList.splice(idx, 1);

      // this.excludeList.forEach(item=>{

      // })
      this.excludeList.push(name);

      this.tabList.forEach(item => {
        if (item.name === this.tabActive) {
          // console.log(item)
          this.$router.push({
            name: item.name,
            params: item.params,
            query: item.query
          });
        }
      });
    },
    handleTabClick(v) {
      this.tabClick = true;
      let activeItem = {};
      this.tabList.map(item => {
        if (item.name === v) {
          activeItem = item;
          // 同个页面不同信息
        }
      });

      this.$router.push({
        name: activeItem.name,
        params: activeItem.params,
        query: activeItem.query
      });
    }
  },
  watch: {
    $route(to, from) {
      if (this.tabClick) {
        this.tabClick = false;
        return;
      }
      console.log("to:",to)
      this.to = to;
	  this.activeRouterName = to.path.replace("/", "");
      // 如果为登陆页
      if (this.activeRouterName === "login") {
        this.includeList = [];
        this.tabList = [];
        return;
      }

      this.excludeList.forEach((item, index) => {
        let filterList = [
          "employeeInfo",
          "employeeMiddlePage",
          "characterUserManager",
          "employeeTips",
          "departmentControl",
          "characterAuthoritySetting"
        ];
        if (item === to.name && filterList.indexOf(to.name) === -1) {
          this.excludeList.splice(index, 1);
        }
      });

      //如果为同一个页面，则替换，这个是为了处理详情页id没有更新问题
      let idx = null;
      this.tabList.forEach((item, index) => {
        if (item.name === this.activeRouterName) {
          idx = index;
        }
      });

      if (idx !== null) {
        this.tabList.splice(idx, 1);
      }

      this.tabList.push({
        name: this.activeRouterName,
        params: to.params,
        query: to.query,
        label: to.meta.desc,
        link: this.activeRouterName + to.params
      });

      this.tabActive = this.activeRouterName;
      storage.setItem("cur-tab-route", this.tabList[this.tabList.length - 1]);
    }
  },
  mounted() {},
  created() {}
};
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100vh;
  padding: 70px 0 0 200px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>