<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da campanha</span>
                <vs-input class="w-full" v-model="campanha.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Produto da campanha</span>
                <v-select v-model="produtoSelected" :class="'select-large-base'" :clearable="false" style="background-color: white" :options="produtos" v-validate="'required'" name="produto"/>
                <span class="text-danger text-sm" v-show="errors.has('produto')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full">
                <span class="font-regular mb-2">O que será entregue</span>
                <v-select v-model="brindeSelected" :class="'select-large-base'" :clearable="false" style="background-color: white" :options="brindes" v-validate="'required'" name="brinde"/>
                <span class="text-danger text-sm" v-show="errors.has('brinde')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full">
                <span class="font-regular mb-2">Descrição da Campanha</span>
                <vs-textarea v-model="campanha.descricao" id="text-area" class="w-full bg-white" rows="6" name="descricao"/>
                <span class="text-danger text-sm" v-show="errors.has('descricao')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full mb-3">
                <h2 class="font-bold" style="font-family: 'Poppins';">Configurando a sua segmentação para solicitação automática de endereço</h2>
            </div>
            <div class="vx-col w-full relative">
                <span class="font-regular mb-2">Quando o seguinte evento acontecer</span>
                <v-select multiple :closeOnSelect="false" v-model="eventosSelected" :options="eventos" dir="ltr" class="bg-white select-large-base"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full mb-3">
                <p class="text-lg font-bold text-black">Nas seguintes condições abaixo (opcional)</p>
            </div>
            <div class="vx-col w-full">
                <div class="p-4 rounded-md" style="background-color: #EDEDED">
                    <p class="text-sm gray">
                        Todos os filtros aplicados a uma condição devem acontecer ao mesmo tempo para que a segmentação seja executada. Se os filtros de uma condição não forem cumpridos, passaremos para a próxima
                        condição, respeitando a ordem de prioridade.
                    </p>
                </div>
            </div>
        </div>
        <div class="vx-row mt-10">
            <div class="vx-col w-full">
                <vs-checkbox color="dark" v-model="campanha.qualquerorferta">
                    <span class="label-bold-underline">Habilitar para qualquer oferta e origem de checkout no Hotmart</span>
                </vs-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleBrindes from "../../store/brindes/moduleBrindes";
    import moduleProdutos from "../../store/produtos/moduleProdutos";
    import {Validator} from 'vee-validate';

    Validator.localize('pt-br');
    export default {
        name: "AddConfig",
        components: {
            'v-select': vSelect
        },
        data() {
            return {
                campanha: {},
                produtoSelected: {},
                produtos: [],
                brindeSelected: {},
                brindes: [],
                eventosSelected: {},
                eventos: [],
            }
        },
        created() {
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes);
                moduleBrindes.isRegistered = true;
            }
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos);
                moduleProdutos.isRegistered = true;
            }
        }
    }
</script>

<style scoped>

</style>