<template>
    <div class="vx-row mt-5">
        <div class="w-full flex justify-center ">
          <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_y0RfCl.json"  background="transparent"  speed="1"  v-bind:style="{width: (imgWidth || '150px'), height: (imgHeight || '150px')}"  loop  autoplay></lottie-player>
        </div>
        <div class="w-full flex justify-center">
          <p class="span-sem-item text-lg">Não existe registro por aqui</p>
        </div>
    </div>

</template>

<script>
export default {
name: "NenhumRegistro",
    props: ['add', 'module', 'imgWidth', 'imgHeight']
};
</script>

<style scoped>

</style>
