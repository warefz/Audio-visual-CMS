<template>
  <div id="page-container" class="sidebar-l sidebar-o side-scroll header-navbar-fixed" style="height:100%">
    <side-nav></side-nav>
    <nav-header></nav-header>
    <router-view id="main-container"></router-view>
  </div>
</template>

<script>
import SideNav from '@/components/sideNav'
import NavHeader from '@/components/header'
export default {
  components: {
    SideNav,
    NavHeader
  }
}

</script>

<style lang="scss">
#page-container{
  background: #fff;
}
</style>
