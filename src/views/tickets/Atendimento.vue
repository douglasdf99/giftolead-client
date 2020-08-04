<template>
    <div class="py-5">
        <div class="vx-row mb-5">
            <div class="vx-col w-full mb-2">
                <p class="destaque text-black">Informações de follow-up</p>
                <vs-textarea v-model="ticket.info" id="text-area" class="w-full bg-white" rows="6" v-validate="'required'" name="info"/>
                <span class="text-danger text-sm" v-show="errors.has('info')">Preenchimento obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-5">
            <div class="vx-col w-full">
                <div class="w-full p-5 rounded-lg" style="background-color: #EDEDED">
                    <div class="vx-row mb-4">
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao ganhou bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 0)}"
                                 @click="ticket.tipo = 0; selectedStatus = {}">
                                <span>Ganhou</span>
                                <img src="@/assets/images/util/ganhou.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao aguardando bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 1)}"
                                 @click="ticket.tipo = 1; selectedStatus = {}">
                                <span>Aguardando</span>
                                <img src="@/assets/images/util/aguardando.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao perdeu bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 2)}"
                                 @click="ticket.tipo = 2; selectedStatus = {}">
                                <span>Perdeu</span>
                                <img src="@/assets/images/util/perdeu.svg">
                            </div>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 0">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Como você concluiu a venda?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-4/12 ml-10">
                            <span class="font-regular mb-2">Selecione o Status de Finalização</span>
                            <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="false"
                                      style="background-color: white" :options="statusGanhou" name="statusGanhou"/>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 1">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Qual dia e horário deseja fazer o agenda do novo atendimento?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-3/12 ml-10">
                            <flat-pickr :config="configdateTimePicker" v-model="datetime" id="teste" class="flatpickr-custom w-full rounded-lg px-5 py-4 border-none cursor-pointer ml-0"
                                        placeholder="Agendar para uma data futura"/>
                        </div>
                        <div class="vx-col w-full lg:w-9/12"></div>
                        <div class="vx-col w-full lg:w-4/12 ml-10 mt-3">
                            <span class="font-regular mb-2">Selecione o Status de Finalização</span>
                            <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="false"
                                      style="background-color: white" :options="statusAguardando" name="statusAguardando"/>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 2">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Por que você não concluiu a venda?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-4/12 ml-10">
                            <span class="font-regular mb-2">Selecione o Status de Finalização</span>
                            <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="false"
                                      style="background-color: white" :options="statusPerdeu" name="statusPerdeu"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="ticket.tipo == 0">
            <div class="vx-row mb-10">
                <div class="vx-col w-full">
                    <vs-checkbox color="dark" v-model="ticket.hasbrinde">
                        <span class="label-bold-underline">Inserir brinde físico para esta venda</span>
                    </vs-checkbox>
                </div>
            </div>
            <transition name="fade">
                <div class="vx-row mb-10" v-if="ticket.hasbrinde">
                    <div class="vx-col w-full mb-4">
                        <p class="text-black text-xl font-bold">
                            Preencha com as informações do brinde
                        </p>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">Selecione o brinde</span>
                        <v-select v-model="selectedBrinde" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white" :options="brindes" v-validate="'required'" name="brinde"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">Nome do destinatário</span>
                        <vs-input class="w-full" v-model="ticket.nome_destinatario" size="large"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">E-mail para solicitação de endereço</span>
                        <vs-input class="w-full" v-model="ticket.email_endereco" size="large"/>
                    </div>
                </div>
            </transition>
            <vs-divider class="mb-10"/>
            <div class="vx-row mb-10">
                <div class="vx-col w-full">
                    <vs-checkbox color="dark" v-model="ticket.hasupsell">
                        <span class="label-bold-underline">Oferecer um produto de Upsell</span>
                    </vs-checkbox>
                </div>
            </div>
            <transition name="fade">
                <div class="vx-row mb-10" v-if="ticket.hasupsell">
                    <div class="vx-col w-full mb-4">
                        <p class="text-black text-xl font-bold">
                            Qual produto você ofereceu?
                        </p>
                    </div>
                    <div class="vx-col w-full lg:w-1/3 mb-10">
                        <span class="font-regular mb-2">Selecione o produto</span>
                        <v-select v-model="selectedUpsell" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white" :options="produtos" v-validate="'required'" name="produtoUpsell"/>
                    </div>
                    <div class="vx-col w-full">
                        <p class="destaque text-black mb-3">Nas seguintes condições abaixo</p>
                        <div class="w-full text-black text-sm p-3" style="background-color: #EDEDED">
                            A comissão de só é gerada como Upsell quando a transação do produto de Upsell for recebida
                            com
                            status de aprovada ou de boleto gerado no prazo máximo de 30 minutos após a venda que deu
                            origem. Caso a solicitação ultrapasse este prazo, será necessário lançar um ticket
                            especifico
                            para a venda do produto de upsell.
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled">
                                Finalizar Atendimento
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'produtos'})">
                                Cancelar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {Portuguese} from 'flatpickr/dist/l10n/pt.js';
    import moduleStatus from "../../store/statusFinalizacao/moduleStatus";
    import moduleProdutos from "../../store/produtos/moduleProdutos";

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Atendimento",
        components: {
            'v-select': vSelect,
            flatPickr
        },
        data() {
            return {
                ticket: {
                    tipo: 0,
                    conclusao: 1,
                    hasbrinde: 0,
                    hasupsell: 0,
                    motivoAguardando: 'whatsapp',
                    motivoPerda: 'incorreto',
                    info: ''
                },
                statusGanhou: [],
                statusAguardando: [],
                statusPerdeu: [],
                selectedStatus: {id: null, label: 'Selecione...'},
                selectedBrinde: {id: null, label: 'Selecione...'},
                brindes: [],
                selectedUpsell: {id: null, label: 'Selecione...'},
                produtos: [],
                datetime: null,

                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    altInput: true,
                    altFormat: 'd/m/Y H:i',
                    locale: Portuguese,
                    minDate: moment().format('Y-MM-DD H:mm')
                },
            }
        },
        created() {
            if (!moduleStatus.isRegistered) {
                this.$store.registerModule('status', moduleStatus)
                moduleStatus.isRegistered = true
            }

            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }

            this.getOpcoes();

        },
        methods: {
            getOpcoes(){
                this.$store.dispatch('status/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        switch (item.tipo) {
                            case 0:
                                this.statusGanhou.push({id: item.id, label: item.nome});
                                break;
                            case 1:
                                this.statusAguardando.push({id: item.id, label: item.nome});
                                break;
                            default:
                                this.statusPerdeu.push({id: item.id, label: item.nome});
                        }
                    });
                });

                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome});
                        this.brindes.push({id: item.id, label: item.nome});
                    });
                });
            }
        },
        computed: {
            isInvalid() {
                return this.errors.any();
            },
        }
    }
</script>

<style scoped>

</style>