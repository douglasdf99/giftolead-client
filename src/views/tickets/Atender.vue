<template>
    <div>
        <side-bar v-if="responderTicket" :isSidebarActive="responderTicket" @closeSidebar="toggleRespostaSidebar"
                  @getItems="getItems"
                  :data="aresponder"/>
        <email v-if="enviarEmail" :isSidebarActive="enviarEmail" @closeSidebar="toggleEmailSidebar"/>
        <div class="vx-row mb-3">
            <div class="vx-col w-full">
                <p class="destaque text-2xl">
                    #{{ticket.id}} <!--{{$route.params.id}}-->
                </p>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full lg:w-1/2 pr-1">
                <div class="w-full h-full bg-white p-5 rounded-lg">
                    <div class="vx-row my-4">
                        <div class="vx-col w-1/4 text-center">
                            <img src="@/assets/images/util/avatar-padrao.svg" width="80">
                        </div>
                        <div class="vx-col w-3/3" v-if="ticket.lead">
                            <p class="text-black text-xl font-bold">
                                {{ticket.lead.nome}}
                            </p>
                            <p class="text-black text-xl font-bold mb-2" v-if="ticket.lead.telefone">
                                {{'(' + ticket.lead.ddd + ') '  + ticket.lead.telefone}}
                            </p>
                            <p class="font-semibold text-md" style="color: #9B9B9B">{{ticket.lead.email}}</p>
                            <p class="font-semibold text-md mb-4" style="color: #9B9B9B" v-if="ticket.lead.cpf">CPF: {{ticket.lead.cpf}}</p>
                            <div class="w-full flex my-5">
                                <vs-button class="font-bold rounded-full mx-2" color="primary" type="filled"
                                           icon-pack="material-icons" icon="call">
                                    Ligar agora
                                </vs-button>
                                <vs-button class="rounded-full mx-2 px-1 py-1" color="green" type="filled"
                                           @click="whatsapp({})">
                                    <i class="fab fa-whatsapp text-3xl mx-2 text-white"></i>
                                </vs-button>
                                <vs-button class="rounded-full mx-2 px-1 py-1" color="#F23257" type="filled"
                                           @click="toggleEmailSidebar(true)">
                                    <i class="fa fa-envelope-open text-2xl mx-2 text-white"></i>
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-1/2 p1-1">
                <div class="w-full bg-white p-5 rounded-lg h-full">
                    <div class="vx-row my-4 flex justify-between">
                        <div class="vx-col w-1/3">
                            <p class="text-black text-xl">
                                <b>{{ticket.created_at | formatDateTime}}</b>
                            </p>
                            <p class="text-xl" v-if="ticket.origem">
                                Origem: {{ticket.origem.nome}}
                            </p>
                            <vs-chip v-if="ticket.produto" :color="ticket.produto.cor" class="text-lg mt-3 py-2 font-bold">
                                {{ticket.produto.nome}}
                            </vs-chip>
                        </div>
                        <div class="vx-col w-1/3">
                            <p class="text-lg font-semibold text-right mb-2" style="color: #9B9B9B">
                                Criado por:
                            </p>
                            <p class="text-right flex items-center font-bold float-right" v-if="ticket.responsavel">
                                {{ticket.responsavel.nome}}
                                <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                                <img :src="get_img_api(ticket.responsavel.avatar)" width="40" class="ml-2" v-else>
                                <!--<img src="@/assets/images/util/boleto.svg" alt="" v-if="tipo.img == 'boleto'">
                                <img src="@/assets/images/util/whatsapp.svg" alt="" v-if="tipo.img == 'whatsapp'">
                                <img src="@/assets/images/util/agendamento.svg" alt="" v-if="tipo.img == 'agendamento'">
                                <img src="@/assets/images/util/cancelado.svg" alt="" v-if="tipo.img == 'cancelado'">-->
                            </p>
                        </div>
                    </div>
                    <div class="vx-row my-3">
                        <div class="vx-col w-full">
                            <p class="text-xl">
                                {{ticket.detalhamento}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row mt-5">
            <div class="vx-col w-full">
                <vs-tabs color="primary" v-model="selectedTab">
                    <vs-tab color="primary" value="10" label="atendimento">
                        <atendimento></atendimento>
                    </vs-tab>
                    <vs-tab color="primary" v-if="ticket.acoesrecebidas" :label="`histórico (${ticket.acoesrecebidas.length})`">
                        <historico :data="ticket.acoesrecebidas" ></historico>
                    </vs-tab>
                    <vs-tab color="primary" :label="`transações (${ticket.lead.transacaos.length})`">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                    <vs-tab color="primary" label="brindes (x)">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import moduleTickets from "../../store/tickets/moduleTickets";
    import atendimento from "./Atendimento";
    import SideBar from "./Responder";
    import Email from "./Email"
    import historico from './Historico'
    import transacoes from "./Transacoes"

    export default {
        name: "Atender",
        components: {
            atendimento, SideBar, historico,
            Email, transacoes
        },
        data() {
            return {
                ticket: {
                    responsavel_type: '',
                    responsavel: {
                        avatar: ''
                    },
                    produto: {}
                },

                selectedTab: 0,

                //whats
                responderTicket: false,
                aresponder: {},

                //email
                enviarEmail: false,
            }
        },
        created() {
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }
            this.getId(this.$route.params.id);
        },
        methods: {
            getId(id) {
                this.$vs.loading();
                if (this.$store.state.ticketVerificado != '') {
                    this.$store.dispatch('tickets/getId', id).then(response => {
                        this.ticket = response;
                        this.$vs.loading.close();
                    });
                } else {
                    console.log('entrou no else')
                    this.$router.push({name: 'tickets-list'});
                }
            },
            toggleRespostaSidebar(val = false) {
                this.responderTicket = val;
            },
            toggleEmailSidebar(val = false) {
                this.enviarEmail = val;
            },
            whatsapp(dados) {
                this.aresponder = dados;
                this.toggleRespostaSidebar(true);
            },
        }
    }
</script>

<style scoped>

</style>
