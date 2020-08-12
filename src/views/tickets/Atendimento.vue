<template>
    <div class="py-5">
        <div class="vx-row mb-5">
            <div class="vx-col w-full mb-2">
                <p class="destaque text-black">Informações de follow-up</p>
                <vs-textarea v-model="atendimento.follow_up" id="text-area" class="w-full bg-white" rows="6" v-validate="'required'" name="info"/>
                <span class="text-danger text-sm" v-show="errors.has('info')">Preenchimento obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-5">
            <div class="vx-col w-full">
                <div class="w-full p-5 rounded-lg" style="background-color: #EDEDED">
                    <div class="vx-row mb-4">
                        <div class="vx-col lg:w-4/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao ganhou bg-white"
                                 v-bind:class="{'tipoAtivo' : (atendimento.tipo == 0)}"
                                 @click="atendimento.tipo = 0; selectedStatus = {}; datetime = null">
                                <span>Ganhou</span>
                                <img src="@/assets/images/util/ganhou.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-4/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao aguardando bg-white"
                                 v-bind:class="{'tipoAtivo' : (atendimento.tipo == 1)}"
                                 @click="atendimento.tipo = 1; selectedStatus = {}; habbrinde = false; habperda = false;">
                                <span>Aguardando</span>
                                <img src="@/assets/images/util/aguardando.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-4/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao perdeu bg-white"
                                 v-bind:class="{'tipoAtivo' : (atendimento.tipo == 2)}"
                                 @click="atendimento.tipo = 2; selectedStatus = {}; habbrinde = false; habperda = false; datetime = null">
                                <span>Perdeu</span>
                                <img src="@/assets/images/util/perdeu.svg">
                            </div>
                        </div>
                    </div>
                    <div class="vx-row" v-if="atendimento.tipo == 0">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Como você concluiu a venda?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-11/12 ml-auto">
                            <ul class="list-tipo-comissao mt-2">
                                <li class="my-3" v-for="item in statusGanhou" @click="verificaHabBrinde(item)">
                                    <vs-radio color="dark" v-model="selectedStatus" :vs-value="item.id">
                                        {{item.nome}}
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row" v-if="atendimento.tipo == 1">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Qual dia e horário deseja fazer o agenda do novo atendimento?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-3/12 ml-10 relative">
                            <flat-pickr :config="configdateTimePicker" v-model="datetime" id="teste" class="flatpickr-custom w-full rounded-lg px-5 py-4 border-none cursor-pointer ml-0"
                                        placeholder="Agendar para uma data futura"/>
                            <i class="material-icons absolute" style="top: 0.7rem;right: 2rem;">today</i>
                        </div>
                        <div class="vx-col w-full lg:w-9/12"></div>
                        <div class="vx-col w-full lg:w-11/12 ml-auto">
                            <ul class="list-tipo-comissao mt-2">
                                <li class="my-3" v-for="item in statusAguardando">
                                    <vs-radio color="dark" v-model="selectedStatus" :vs-value="item.id">
                                        {{item.nome}}
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row" v-if="atendimento.tipo == 2">
                        <div class="vx-col w-full lg:w-4/12">
                            <p class="destaque text-black mb-3">
                                Por que você não concluiu a venda?
                            </p>
                            <ul class="list-tipo-comissao mt-2 ml-10">
                                <li class="my-3" v-for="item in statusPerdeu" @click="verificaHabPerda(item)">
                                    <vs-radio color="dark" v-model="selectedStatus" :vs-value="item.id">
                                        {{item.nome}}
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                        <div class="vx-col w-full lg:w-1/3"></div>
                        <div class="vx-col w-full lg:w-4/12 mb-3" v-if="habperda">
                            <p class="destaque text-black mb-3">
                                Selecione o motivo
                            </p>
                            <v-select v-model="selectedMotivo" :class="'select-large-base'" :clearable="false" style="background-color: white" :options="motivos" name="motivo"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="atendimento.tipo == 0">
            <div v-if="habbrinde">
                <div class="vx-row mb-10">
                    <div class="vx-col w-full">
                        <vs-checkbox color="dark" v-model="atendimento.tembrinde">
                            <span class="label-bold-underline">Inserir brinde físico para esta venda</span>
                        </vs-checkbox>
                    </div>
                </div>
                <transition name="fade">
                    <div class="vx-row mb-10" v-if="atendimento.tembrinde">
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
                            <vs-input class="w-full" v-model="atendimento.nome_destinatario" size="large"/>
                        </div>
                        <div class="vx-col w-full lg:w-1/3">
                            <span class="font-regular mb-2">E-mail para solicitação de endereço</span>
                            <vs-input class="w-full" v-model="atendimento.email_destinatario" size="large"/>
                        </div>
                    </div>
                </transition>
            </div>
            <div v-if="ticket.produto && ticket.produto.upsellers.length > 0">
                <vs-divider class="mb-10"/>
                <div class="vx-row mb-10">
                    <div class="vx-col w-full">
                        <vs-checkbox color="dark" v-model="atendimento.hasupsell">
                            <span class="label-bold-underline">Oferecer um produto de Upsell</span>
                        </vs-checkbox>
                    </div>
                </div>
                <transition name="fade">
                    <div class="vx-row mb-10" v-if="atendimento.hasupsell">
                        <div class="vx-col w-full mb-4">
                            <p class="text-black text-xl font-bold">
                                Qual produto você ofereceu?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-1/3 mb-10">
                            <span class="font-regular mb-2">Selecione o produto</span>
                            <v-select v-model="selectedUpsell" :class="'select-large-base'" :clearable="false"
                                      style="background-color: white" :options="opcoes" v-validate="'required'" name="produtoUpsell"/>
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
        </div>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {Portuguese} from 'flatpickr/dist/l10n/pt.js';
    import moduleStatus from "../../store/statusFinalizacao/moduleStatus";
    import moduleProdutos from "../../store/produtos/moduleProdutos";
    import moduleMotivos from "../../store/motivoPerda/moduleMotivos";

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
                statusGanhou: [],
                statusAguardando: [],
                statusPerdeu: [],
                selectedMotivo: {id: null, label: 'Selecione...'},
                selectedStatus: null,
                selectedBrinde: null,
                selectedUpsell: null,
                brindes: [],
                produtos: [],
                motivos: [],
                datetime: null,

                atendimento: {
                    tipo: 0,
                    tembrinde: 0,
                    hasupsell: 0,
                    follow_up: '',
                    nome_destinatario: '',
                    email_destinatario: '',
                    status_atendimento_id: null,
                    tipo_de_perda_id: null,
                    upsell: null
                },
                habbrinde: false,
                habperda: false,

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

            if (!moduleMotivos.isRegistered) {
                this.$store.registerModule('motivos', moduleMotivos)
                moduleMotivos.isRegistered = true
            }

            this.atendimento.nome_destinatario = this.ticket.nome_destinatario;
            this.atendimento.email_destinatario = this.ticket.email_destinatario;

            this.getOpcoes();

        },
        methods: {
            getOpcoes() {
                this.$store.dispatch('status/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        switch (item.tipo) {
                            case 0:
                                this.statusGanhou.push(item);
                                break;
                            case 1:
                                this.statusAguardando.push(item);
                                break;
                            default:
                                this.statusPerdeu.push(item);
                        }
                    });
                });

                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.brindes.push({id: item.id, label: item.nome});
                    });
                });

                this.$store.dispatch('motivos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.motivos.push({id: item.id, label: item.nome});
                    });
                });


            },
            verificaHabBrinde(obj) {
                this.habbrinde = (this.atendimento.tipo == 0 && obj.hab_brinde) ? true : false;
            },
            verificaHabPerda(obj) {
                this.habperda = (this.atendimento.tipo == 2 && obj.hab_perda) ? true : false;
            },
        },
        computed: {
            isInvalid() {
                return this.errors.any();
            },
            ticket() {
                return this.$store.state.tickets.ticketAtendimento;
            },
            opcoes(){
                let arr = [];
                this.$store.state.tickets.ticketAtendimento.produto.upsellers.forEach(item => {
                    arr.push({id: item.produto.id, label: item.produto.nome});
                });
                return arr;
            }
        },
        watch: {
            selectedStatus: {
                handler(val) {
                    console.log('mudou', val);
                    this.atendimento.status_atendimento_id = val;
                },
            },
            selectedUpsell: {
                handler(val) {
                    console.log('mudou', val);
                    if(this.atendimento.tipo == 0)
                        this.atendimento.upsell = val.id;
                },
            },
            atendimento: {
                handler(val) {
                    if (val) {
                        console.log('watch', val, this.datetime);
                        if(this.datetime != null && this.atendimento.tipo == 1)
                            this.atendimento.data_agendamento = this.datetime;
                        let obj = {...this.ticket, ...this.atendimento};
                        this.$store.commit('tickets/SET_TICKET_ATENDIDO', obj);
                    }
                },
                deep: true
            },
        },
    }
</script>

<style scoped>

</style>
