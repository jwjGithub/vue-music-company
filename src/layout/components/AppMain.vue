<!--
 * @Description:内容部分
 * @Autor: JWJ
 * @Date: 2020-10-14 22:52:10
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-21 14:21:27
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color:#e7EDF5;
}
.fixed-header+.app-main {
  padding-top: 70px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
