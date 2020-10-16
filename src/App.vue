<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from "@/layout/MainLayout";

export default {
  name: 'app',
  components: {
    MainLayout
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
