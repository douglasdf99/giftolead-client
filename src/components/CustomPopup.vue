<template>
  <div
    class="container-cstm-popup"
    :id="'popup-' + title"
    :key="'popup-' + title"
    v-if="active" 
  >
    <div class="backdrop-cstm-popup vs-popup--background" />
    <div class="card-cstm-popup">
      <header class="header-cstm-popup">
        <div class="title-cstm-popup">
          <h3>{{ title }}</h3>
        </div>
        <i class="vs-icon notranslate icon-scale vs-popup--close vs-popup--close--icon material-icons null" 
        style="background: rgb(255, 255, 255)" @click="$emit('update:active', false)">close</i>
      </header>
      <div class="content-cstm-popup">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomPopup",
  props: {
    title: {
      type: String,
      default: "Título Padrão",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  unmounted() {
    this.$emit('udpate:active', false);
  }
};
</script>
<style lang="scss">
.container-cstm-popup {
  transition: all 0.2s;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  display: flex;
  z-index: 53000;
  left: 0;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.card-cstm-popup {
  transition: all 0.2s;
  z-index: 100;
  width: 600px;
  margin: 10px;
  max-width: calc(100% - 30px);
  max-height: calc(100% - 30px);
  border-radius: 6px;
  box-shadow: 0 5px 20px 0 #0000004d;
  background: #fff;
  animation: rebound 0.3s;
}

.header-cstm-popup {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px 5px;
  position: relative;

  .title-cstm-popup {
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 5px 5px 0 0;

    h3 {
      margin-bottom: 0;
      transition: all 0.23s ease 0.1s;
      padding: 8px;
      padding-left: 12px;
      font-size: 1.2rem;
    }
  }
}

.title-cstm-popup {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
}

.content-cstm-popup {
  transition: all 0.23s ease 0.1s;
  overflow: auto;
  max-height: calc(100vh - 100px);
  margin-top: 5px;
  margin-bottom: 5px;
  width: calc(100% - 5px);
  padding: 1.5rem;
  font-size: 1rem;
}
</style>