<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
            <h1 class="sm:mx-0 mx-4 mb-12 text-5xl d-theme-heading-color">Agende seu atendimento nesta página</h1>
            <p class="sm:mx-0 mx-4 mb-4 sm:mb-5 d-theme-text-inverse text-black">Defina no campo abaixo a data e o
                horário em que deseja ser contatato pela nossa equipe.</p>
            <flat-pickr :config="configdateTimePicker" v-model="datetime" id="teste" v-if="!enviado"
                        class="flatpickr-custom w-full lg:w-1/4 md:w-1/3 rounded-lg px-5 py-4 border-none cursor-pointer ml-0"
                        placeholder="Clique aqui"/>
            <vs-button size="large" class="mt-4" :disabled="!datetime" @click="salvar">Salvar</vs-button>
        </div>
    </div>
</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {Portuguese} from 'flatpickr/dist/l10n/pt.js';
    import moduleAgendamentoLink from "../../store/agendamento_link/moduleAgendamentoLink";

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "AgendamentoLinkNovo",
        components: {
            flatPickr
        },
        data() {
            return {
                datetime: null,
                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    altInput: true,
                    altFormat: 'd/m/Y H:i',
                    locale: Portuguese,
                    minDate: moment().format('Y-MM-DD H:mm')
                },
                leadInfo: this.$route.query,
                enviado: false
            }
        },
        created() {
            console.log(this.$route)
            console.log('minDate', moment().format('Y-MM-DD H:mm'))

            if (!moduleAgendamentoLink.isRegistered) {
                this.$store.registerModule('agendamento', moduleAgendamentoLink)
                moduleAgendamentoLink.isRegistered = true
            }
        },
        methods: {
            salvar() {
                this.leadInfo.data_agendamento = this.datetime;
                this.$store.dispatch('agendamento/store', this.leadInfo).then(() => {
                    this.enviado = true;
                    this.$vs.notify({
                        color: 'success',
                        title: 'Pronto!',
                        text: 'Seu atendimento foi agendado com sucesso! Aguarde até que entremos em contato.',
                        iconPack: 'feather',
                        icon:'icon-check',
                        time:120000,
                    });
                }).catch(erro => console.log(erro))
            }
        }
    }
</script>

<style scoped>

</style>
