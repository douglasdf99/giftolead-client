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
  <div class="footerbar content-area-reduced">
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
    position: fixed;
    padding: 26px;
    right: 0;
    bottom: 0;
    width: calc(100% - 15.2vw);
    color: #494949;
    background-color: #ffffff;
    text-align: center;
    border-top: 2px solid #e5e5e5;
  }
  .seta-footer {
    position: absolute; left: -104px; top:30%
  }
</style>
