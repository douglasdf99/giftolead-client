<!-- =========================================================================================
    File Name: VxTimeline.vue
    Description: Timeline Component
    Component Name: VxTimeline
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="footerbar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "vx-timeline",
  props: {
  },
  data() {
    return {

    }
  },
}
</script>

<style>
  .footerbar {
    padding: 5px;
    right: 0;
    position: fixed;
    bottom: 0;
    width: calc(100% - 15.2vw);
    color: #494949;
    background-color: #f8f8f8;
    text-align: center;
    border-top: 2px solid #626262;
  }
</style>
