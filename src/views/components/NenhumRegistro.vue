<template>
    <div class="vx-row mt-5">
        <div class="w-full flex justify-center ">
          <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_y0RfCl.json"  background="transparent"  speed="1"  style="width: 150px; height: 150px;"  loop  autoplay></lottie-player>
        </div>
        <div class="w-full flex justify-center">
          <p class="span-sem-item">Não existe registro por aqui</p>
        </div>
    </div>

</template>

<script>
export default {
name: "NenhumRegistro",
    props: ['add', 'module']
}
</script>

<style scoped>

</style>
