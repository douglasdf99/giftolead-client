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
    <div class="vx-row">
      <div class="vx-col sm:w-1/12  mb-2">
          <div class="seta-footer" style="">
            <feather-icon icon="CornerLeftUpIcon" svgClasses="stroke-current text-dark-50 w-6 h-6" class="ml-2" />
          </div>

        </div>
      <slot></slot>
    </div>
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
  @media (min-width: 1200px){
    .footerbar {
      position: fixed;
      padding: 26px;
      padding-right: 3rem;
      padding-left: 3rem;
      right: 0;
      bottom: 0;
      left: 291px;
      color: #494949;
      background-color: #ffffff;
      text-align: center;
      border-top: 2px solid #e5e5e5;
      z-index: 500;
    }
  }
  @media (max-width: 1199px){
    .footerbar {
      position: fixed;
      padding: 26px;
      padding-right: 2.2rem;
      padding-left: 2.2rem;
      right: 0;
      bottom: 0;
      left: 0;
      color: #494949;
      background-color: #ffffff;
      text-align: left;
      border-top: 2px solid #e5e5e5;
    }
  }

</style>
