<template>
  <a-layout style="height: 100%;">
    <a-layout-header style="padding: 0 16px; background-color: #fff;">
      <a-icon type="menu" v-if="isMobile"
              @click="showDrawer"
              style="color: #bc20e7; float: left; line-height: 64px; font-size: 20px;"/>
      <a-menu @click="onModeChange" mode="horizontal" v-else
              style="display: inline-block; float: left; line-height: 64px; background-color: #fff;" v-model="current">
        <template v-for="routeName in routeNames">
          <a-menu-item :key="routeName">
            {{ routeName }}
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-header>
    <router-view/>
    <a-drawer :visible="drawerVisible" placement="left" @close="closeDrawewr" :closable="false">
      <div>
        <p :key="routeName" v-for="routeName in routeNames" @click="onRouteChange(routeName)">
          {{ routeName }}
        </p>
      </div>
    </a-drawer>
  </a-layout>
</template>

<script>
import router from '@/router'
import routes from '@/router/routes'

const routeNames = routes.map(r => r.name)

export default {
  name: "MainLayout",
  router,
  data: () => ({
    routeNames,
    drawerVisible: false,
    current: [routeNames[0]]
  }),
  computed: {
    isMobile() {
      return this.$vssWidth < this.$mobileSize
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$route.name) {
        this.current = [this.$route.name]
      } else {
        this.$router.push('/monitor')
      }
    }, 1000)
  },
  methods: {
    showDrawer() {
      this.drawerVisible = true
    },
    closeDrawewr() {
      this.drawerVisible = false
    },
    onRouteChange(routeName) {
      if (this.$route.path === `/${routeName.toLowerCase()}`) return
      else {
        this.$router.push(`/${routeName.toLowerCase()}`)
        this.drawerVisible = false
      }
    },
    onModeChange({key}) {
      if (this.$route.path === `/${key.toLowerCase()}`) return
      this.$router.push(`/${key.toLowerCase()}`)
    }
  }
}
</script>

<style scoped>

</style>
