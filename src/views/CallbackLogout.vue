<template>
  <div id="loading-bg">
    <div class="loading-logo">
      <img :src="get_img_local('logo2.svg')" alt="Logo">
    </div>
    <div class="loading">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.$router.push({name: 'login'});
  }
};
</script>

<style lang="scss">
@import "../assets/css/loader.css";
</style>
