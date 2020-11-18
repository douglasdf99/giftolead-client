<template>
    <div>
        <div id="widget-evoline-api-container" style="display:inline" width="10" height="20"></div>
        <side-bar v-if="responderTicket" :isSidebarActive="responderTicket" @getId="getId($route.params.id)" @closeSidebar="toggleRespostaSidebar" :data="aresponder"/>
        <email v-if="enviarEmail" :isSidebarActive="enviarEmail" @getId="getId($route.params.id)" @closeSidebar="toggleEmailSidebar" :data="aresponder"/>
        <div class="vx-row mb-3">
            <div class="vx-col w-1/2">
                <p class="destaque text-2xl">
                    #{{ticket.id}} <!--{{$route.params.id}}-->
                </p>
            </div>
            <div class="vx-col w-1/2">
                <p class="destaque text-2xl float-right flex items-center">
                    Status
                    <vs-chip color="primary" class="text-lg ml-4">{{ getStatus(ticket.status) }}</vs-chip>
                </p>
            </div>
        </div>

        <!-- fim popup-->
        <div class="vx-row" v-if="ticket.lead">
            <div class="vx-col w-full lg:w-1/2 pr-1">
                <div class="w-full h-full bg-white p-5 rounded-lg">
                    <div class="vx-row my-4">
                        <div class="vx-col w-1/4 text-center">
                            <img :src="getAvatar(ticket.lead.email)" width="80" class="rounded-full">
                        </div>
                        <div class="vx-col w-3/3" v-if="ticket.lead">
                            <p class="text-black text-xl font-bold">
                                {{ticket.lead.nome}}
                            </p>
                            <p class="text-black text-xl font-bold mb-2" v-if="ticket.lead.telefone">
                                {{'(' + ticket.lead.ddd + ') ' + ticket.lead.telefone}}
                            </p>
                            <p class="font-semibold text-md" style="color: #9B9B9B">{{ticket.lead.email}}</p>
                            <p class="font-semibold text-md mb-4" style="color: #9B9B9B" v-if="ticket.lead.cpf">CPF: {{ticket.lead.cpf}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-1/2 p1-1">
                <div class="w-full bg-white p-5 rounded-lg h-full">
                    <div class="vx-row my-4 flex justify-between">
                        <div class="vx-col w-full lg:w-1/2">
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
                        <div class="vx-col w-full lg:w-1/2">
                            <p class="text-lg font-semibold text-right mb-2" style="color: #9B9B9B">
                                Criado por:
                            </p>
                          <p class="text-right flex items-center font-bold float-right" v-if="ticket.responsavel">
                            {{ ticket.responsavel.nome || ticket.responsavel.name }}
                            <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                            <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaBoleto'">
                            <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
                            <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
                            <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCancelado'">
                            <img :src="get_img_api(ticket.responsavel.avatar)" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel.avatar">
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
        <div class="vx-row mt-5" v-if="ticket.lead">
            <div class="vx-col w-full">
                <vs-tabs color="primary" v-model="selectedTab">
                    <vs-tab color="primary" :label="`histórico (${ticket.acoesrecebidas.length})`">
                        <historico :data="ticket.acoesrecebidas" @whatsapp="whatsapp(ticket)"></historico>
                    </vs-tab>
                    <vs-tab color="primary" :label="`transações (${ticket.lead.transacaos.length})`">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                    <vs-tab color="primary" :label="`solicitações de brinde (${ticket.lead.solicitacaos.length})`">
                        <div class="vx-row mt-20 flex justify-center" v-if="ticket.lead.solicitacaos.length === 0">
                            <div class="w-full lg:w-8/12 xlg:w-8/12 s:w-full sem-item">
                                <div class="w-8/12">
                                    <div>
                                        <p class="span-sem-item">Nenhum registro encontrado</p>
                                    </div>
                                    <br>
                                </div>
                            </div>
                        </div>
                        <vs-table :data="ticket.lead.solicitacaos" class="table-items" v-else>
                            <template slot="thead">
                                <vs-th>Destinatário</vs-th>
                                <vs-th>E-mail</vs-th>
                                <vs-th>Brinde</vs-th>
                                <vs-th></vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                                    <vs-td>{{tr.nome_destinatario}}</vs-td>
                                    <vs-td>{{tr.email_destinatario}}</vs-td>
                                    <vs-td>
                                        <vs-chip color="primary" class="text-md py-2 font-bold">
                                            {{tr.brinde.nome}}
                                        </vs-chip>
                                    </vs-td>
                                    <vs-td :data="data[indextr].status" class="td-icons flex flex-col items-center justify-center">
                                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                 class="icon-grande" v-bind:style="{color: getStatusSoli(tr.status)}"
                                                 v-if="data[indextr].status"></vs-icon>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab color="primary" :label="`automações de brinde (${ticket.lead.automacaos.length})`">
                        <automacaos :items="ticket.lead.automacaos" tipo="todos"></automacaos>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
              <div class="vx-col sm:w-11/12 mb-2">
                <vs-button class="float-right mr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                           @click="voltar">
                  Voltar
                </vs-button>
              </div>
            </footer-doug>
        </transition>

    </div>
</template>

<script>
  import moduleTickets from "../../store/tickets/moduleTickets";
  import moduleUsuario from "../../store/usuarios/moduleUsuario";
  import atendimento from "./Atendimento";
  import SideBar from "./Responder";
  import Email from "./Email"
  import historico from './Historico'
  import transacoes from "./Transacoes"
  import automacaos from "../automacao/Listagem"
  import solicitacoes from '../solicitacao_brinde/Listagem'

  export default {
        name: "Atender",
        components: {
            atendimento, SideBar, historico,
            Email, transacoes, automacaos, solicitacoes
        },
        data() {
            return {
              activeLoading:false,
                statustext: 'Realizando chamada',

                muted: false,
                isCallActive: false,
                conectado: false,
                status: {},
                chamada: {
                    id: null,
                    origem: null,
                    destino: null
                },
                selectedTab: 0,
                phonevar: '',
                //whats
                responderTicket: false,
                aresponder: {},
                //email
                enviarEmail: false,
                hh: 0,
                mm: 0,
                ss: 0,
                tempo: 1000,//Quantos milésimos valem 1 segundo?
                cron: '',
                time: '00:00:00',
                ticket: {}
            }
        },
        created() {

            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }

            this.getId(this.$route.params.id)

        },
        methods: {
            getId(id) {
                this.$vs.loading();
                console.log('teste')
                this.$store.dispatch('tickets/getId', id).then(response => {
                    this.ticket = response;
                    this.$vs.loading.close();
                });
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
            email(dados) {
                this.aresponder = dados;
                this.toggleEmailSidebar(true);
            },
            getStatusSoli(status) {
                switch (status) {
                    case 'pendente':
                        return '#ff9f43'
                    case 'aprovado':
                        return '#28c76f'
                    case 'emexpedicao':
                        return '#31aef0'
                    default:
                        return ''
                }
            },

           voltar(){
             this.$router.push({name:'tickets-list'})
           },

            getStatus(val) {
                switch (val) {
                    case 0:
                        return 'aberto';
                    case 1:
                        return 'pendente';
                    case 2:
                        return 'fechado';
                    case 3:
                        return 'reaberto';
                }
            },
            tratamentoTelefone(ddd, telefone) {
                if (ddd) {
                    ddd = ddd.replace(/[{()}]/g, '');
                } else {
                    ddd = '';
                }
                if (telefone) {
                    telefone = telefone.replace(/-/g, '')
                    telefone = telefone.replace(/[{()}]/g, '')
                } else {
                    telefone = '';
                }

                return ddd + telefone;
            },
        },
        computed: {

        },
        watch: {
            '$refs': {
                handler: function (e) {
                    console.log("hit", e);
                },
                deep: true
            },
            phonevar: {
                handler: function (e) {
                    console.log("phonevar", e);
                },
                deep: true
            },
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .fill-row-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        .loading-example {
            width: 120px;
            float: left;
            height: 120px;
            box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            margin: 8px;
            transition: all 0.3s ease;

            h4 {
                z-index: 40000;
                position: relative;
                text-align: center;
                padding: 10px;
            }

        }
    }
</style>
