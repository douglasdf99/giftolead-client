<template>
    <div class="vx-row mt-5">
        <div class="vx-col w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item mx-auto">
            <div class="w-8/12">
                <p class="span-sem-item">Nenhum registro foi encontrado</p>
                <div v-if="add">
                    <p class="text-sem-item mt-6">
                        Para inserir novos registros você <br> pode clicar no botão abaixo.
                    </p>
                    <p>
                        <vs-button color="primary" class="float-left botao-incluir mt-6" type="filled"
                                   @click="$emit('addEvent')">
                            <vs-icon icon-pack="material-icons" icon="check_circle"
                                     class="icon-grande"></vs-icon>
                            Incluir {{ module || '' }}
                        </vs-button>
                    </p>
                </div>
            </div>
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