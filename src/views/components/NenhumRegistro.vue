<template>
    <div class="vx-row flex justify-center">
        <div class="w-full lg:w-8/12 mx-auto s:w-full sem-item">
            <div class="w-8/12">
                <div>
                    <p class="span-sem-item">{{ text }}</p>
                </div>
                <br>
            </div>
        </div>
    </div>
</template>

<script>
export default {
name: "NenhumRegistro",
    props: ['text']
}
</script>

<style scoped>

</style>