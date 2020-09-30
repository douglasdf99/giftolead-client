<template>
    <div class="">
        <div class="vx-row" v-if="dados">
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Atividades" subtitle="Notificações relacionadas ao usuário" no-shadow>
                    <span class="font-bold">Função Alterada</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.funcao_alterada_para" :option="dados.funcao_alterada_para"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Brinde" subtitle="Notificações relacionadas a brindes" no-shadow>
                    <span class="font-bold">Solicitação de brinde aprovada</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.solicitacao_brinde_foi_aprovada"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Ordem" subtitle="Notificações relacionadas a ordens" no-shadow>
                    <span class="font-bold">Ordem Paga</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.ordem_paga"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Comissão" subtitle="Notificações relacionadas a comissãos" no-shadow>
                    <span class="font-bold">Nova comissão paga</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.comissao_aprovada"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Conquista" subtitle="Notificações relacionadas a conquista" no-shadow>
                    <span class="font-bold">Conquista tal alcançada</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.conquista_alcancada"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Correio" subtitle="Notificações relacionadas a conquista" no-shadow>
                    <span class="font-bold">Contrato do correios inativo (admins ou relacionados)</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.contrato_correios_inativo"></option-notification>
                </vx-card>
            </div>

            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Ticket" subtitle="Notificações relacionadas a tickets" no-shadow>
                    <span class="font-bold">Ticket atrasado</span>
                    <option-notification class="w-full" :slack="slack" :option.sync="dados.ticket_atrasados"></option-notification>
                    <span class="font-bold">Você tem um ticket agendado para logo</span>
                    <option-notification :slack="slack" :option.sync="dados.ticket_agendado_para"></option-notification>
                    <span class="font-bold">Seu ticket foi atendido</span>
                    <option-notification :slack="slack" :option.sync="dados.ticket_foi_atendido"></option-notification>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
                <vx-card title="Zenvia" subtitle="Notificações relacionadas a zenvia" no-shadow>
                    <span class="font-bold">Recarga Zenvia</span>
                    <option-notification :slack="slack" :option.sync="dados.recarga_zenvia"></option-notification>

                    <span class="font-bold">Saldo zenvia baixo</span>
                    <option-notification :slack="slack" :option.sync="dados.saldo_zenvia_baixo"></option-notification>

                    <span class="font-bold">Sem saldo zenvia</span>
                    <option-notification :slack="slack" :option.sync="dados.sem_saldo_zenvia"></option-notification>

                    <span class="font-bold">Ramal foi vinvulado</span>
                    <option-notification :slack="slack" :option.sync="dados.ramal_vinculado"></option-notification>

                    <span class="font-bold">Ramal alterado</span>
                    <option-notification :slack="slack" :option.sync="dados.ramal_alterado"></option-notification>

                    <span class="font-bold">Ramal devinculado</span>
                    <option-notification :slack="slack" :option.sync="dados.ramal_devinculado"></option-notification>
                </vx-card>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative flex items-center">
                            <vs-button class="mt-2" @click="update">Salvar alterações</vs-button>
                            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="calcelar">Cancelar</vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import OptionNotification from '../components/OptionsNotification'
import moduleNotificacoes from '@/store/notificacoes/moduleNotificacoes.js'
import moduleExtensoes from "@/store/extensoes/moduleExtensoes";

export default {
    components: {
        'v-select': vSelect,
        'option-notification': OptionNotification,
    },
    data() {
        return {
            dados: null,
            init: null,
            selected: ['foo', 'bar'],
            options: ['foo', 'bar', 'baz'],
            slack: false
        }
    },
    computed: {},
    created() {
        if (!moduleNotificacoes.isRegistered) {
            this.$store.registerModule('notificacoes', moduleNotificacoes)
            moduleNotificacoes.isRegistered = true
        }

        if (!moduleExtensoes.isRegistered) {
            this.$store.registerModule('extensoes', moduleExtensoes)
            moduleExtensoes.isRegistered = true
        }
        this.$vs.loading();
        this.verificaExtensao();
        this.getId();
    },
    mounted() {
    },
    methods: {
        getId() {
            this.$store.dispatch('notificacoes/getId').then(response => {
                console.log('notifica', response);
                this.dados = response;
                this.init = {...this.dados};
                console.log('notifica', response);
                this.$vs.loading.close()
            });
        },
        update() {
            this.$vs.loading();
            this.$store.dispatch('notificacoes/update', this.dados).then(response => {
                console.log('notifica', response);
                this.$vs.loading.close()
            });
        },
        calcelar() {
            this.$router.push({name: 'configuracoes-geral'})
        },
        verificaExtensao() {
            this.verficaExtesoes().then(response => {
                this.slack = response.includes('slack');
            });
        }
    }
}
</script>
