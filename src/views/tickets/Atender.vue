<template>
    <div>
        <iframe allow="microphone" src="https://api2.totalvoice.com.br/w3/?key=df342ee831afacb903fd4e18530e86b4&pop=1&ver=2&fechar_fim=1" @conectar="escutaconectar" style="display: block;height: 500px;" ref="webphoneRef"></iframe>
        <side-bar v-if="responderTicket" :isSidebarActive="responderTicket" @closeSidebar="toggleRespostaSidebar" :data="aresponder"/>
        <email v-if="enviarEmail" :isSidebarActive="enviarEmail" @closeSidebar="toggleEmailSidebar" :data="aresponder"/>
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
                                {{'(' + ticket.lead.ddd + ') ' + ticket.lead.telefone}}
                            </p>
                            <p class="font-semibold text-md" style="color: #9B9B9B">{{ticket.lead.email}}</p>
                            <p class="font-semibold text-md mb-4" style="color: #9B9B9B" v-if="ticket.lead.cpf">CPF: {{ticket.lead.cpf}}</p>
                            <div class="w-full flex my-5">
                                <vs-button class="font-bold rounded-full mx-2" color="primary" type="filled" icon-pack="material-icons" icon="call" @click="conectar()">
                                    Ligar agora
                                </vs-button>
                                <vs-button class="font-bold rounded-full mx-2" color="primary" type="filled" icon-pack="material-icons" icon="call" @click="desconectar()">
                                    desconect
                                </vs-button>
                                <vs-button class="rounded-full mx-2 px-1 py-1" color="#8ED839" type="filled" @click="whatsapp(ticket)">
                                    <i class="fab fa-whatsapp text-3xl mx-2 text-white"></i>
                                </vs-button>
                                <vs-button class="rounded-full mx-2 px-1 py-1" color="#F23257" type="filled" @click="email(ticket)">
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
                                <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                                <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaBoleto'">
                                <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
                                <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
                                <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCancelado'">
                                <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\\Models\\\Whatsapplist'">
                                <img :src="get_img_api(ticket.responsavel.avatar)" width="40" class="ml-2" v-else>
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
                        <historico :data="ticket.acoesrecebidas"></historico>
                    </vs-tab>
                    <vs-tab color="primary" v-if="ticket.lead" :label="`transações (${ticket.lead.transacaos.length})`">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                    <vs-tab color="primary" v-if="ticket.lead" label="brindes (x)">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="finalizar">
                                Finalizar Atendimento
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="cancelarAtendimento(ticket.id)">
                                Cancelar Atendimento
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
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
                /*ticket: {
                    responsavel_type: '',
                    responsavel: {
                        avatar: ''
                    },
                    produto: {},
                    follow_up: ''
                },*/

                selectedTab: 0,
                phonevar: '',
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
                        this.ticket.nome_destinatario = response.lead.nome;
                        this.ticket.email_destinatario = response.lead.email;

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
            email(dados) {
                this.aresponder = dados;
                this.toggleEmailSidebar(true);
            },
            cancelarAtendimento(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Cancelar atendimento?`,
                    text: 'Deseja mesmo cancelar este atendimento?',
                    acceptText: 'Sim!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('tickets/cancelar', id).then(response => {
                            console.log('pora cara', response)
                            if (response.status) {
                                this.$vs.notify({
                                    color: 'success',
                                    title: '',
                                    text: 'Atendimento cancelado com sucesso'
                                });
                                this.$vs.loading.close();
                                this.$router.push({name: 'tickets-list'})
                            }
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            finalizar() {
                console.log(this.ticket)
            },


            /* TOTAL VOICE */
            desligaChamada() {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'hangup'
                }, '*');
            },

            //Conecta o webphone para coloca-lo em operação
            conectar() {
                this.$refs.webphoneRef.contentWindow.postMessage({message: 'conectar'}, '*');
            },
            escutaconectar(){
                console.log('escuta')
            },

            //desconecta o webphone - ele nao recebe nem envia mais chamadas
            desconectar() {
                console.log(this.$refs)
                this.$refs.webphoneRef.contentWindow.postMessage({message: 'desconectar'}, '*');
                console.log(this.$refs)
            },


            //telefona para um número
            chamaNumero(numero) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'chamaNumero',
                    'numero': numero
                }, '*');
            },

            //atender
            atender() {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'answer'
                }, '*');
            },

            //para uso com uras
            enviaDTMF(meuDTMF) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'enviaDTMF',
                    'dtmf': meuDTMF
                }, '*');
            },

            //mute microfone
            mute() {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'mute'
                }, '*');
            },

            //transferencia blind - encerra a ligação aqui e transfere para o numero
            transferir(numeroTelefone) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'transferir',
                    'numeroTelefone': numeroTelefone
                }, '*');
            },

            //transferencia com consulta
            transferirConsulta(numeroTelefone) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'transferirConsulta',
                    'numeroTelefone': numeroTelefone
                }, '*');
            },

            recstart() {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'recStart'
                }, '*');
            },

            recstop() {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'recStop'
                }, '*');
            },

            pausarNaFila(filaId) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'pausarNaFila',
                    filaId: filaId
                }, '*');
            },

            despausarNaFila(filaId) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'despausarNaFila',
                    filaId: filaId
                }, '*');
            },

            entrarNaFila(filaId) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'entrarNaFila',
                    filaId: filaId
                }, '*');
            },

            sairDaFila(filaId) {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'sairDaFila',
                    filaId: filaId
                }, '*');
            },
            callPhone: function () {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'chamaNumero',
                    'numero': '7173'
                }, '*');
            },
            answerCall: function () {
                this.$refs.webphoneRef.contentWindow.postMessage({
                    message: 'answer'
                }, '*');
            }
        },
        computed: {
            ticket() {
                return this.$store.state.tickets.ticketAtendimento;
            }
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
            //this.getAvailableCustomers();
            var vm = this;
            this.phonevar = this.$refs.webphone;
            console.log('alou', this.phonevar)
            window.onmessage = function (e) {
                //quando receber uma ligacao
                console.log('evento', e)
                if (e.data.message == 'chegandoChamada') {
                    alert('Chegando Chamada de ' + e.data.numeroChegando + ' para: ' + e.data.numeroDestino + ' chamada_recebida_id: ' + e.data.chamadaRecebidaId);

                }
                //conectado, chamando, encerrada, conversando
                if (e.data.message == 'status') {
                    console.log('alou')
                    if (e.data.status == 'encerrada') {
                        console.log('alou 2')
                        this.isCallActive = false;
                    } else if (e.data.status == 'chamando' || e.data.status == 'conversando') {
                        console.log('alou 3')
                        this.isCallActive = true;
                    }
                }
                //o id é único e pode ser utilizado na api para recuperação de mais informações (get na api ou webhooks)
                if (e.data.message == 'chamada_id') {
                    alert('Chamada_id: ' + e.data.chamada_id);
                }
                //os erros são finais
                if (e.data.message == 'status_erro') {
                    alert('Sem Permissão: ' + e.data.status_erro);
                    this.isCallActive = false;

                }
                //rebendo o statu0s de diagnóstico de internet e computador para verificar qualidade de ligação
                if (e.data.message == 'stats_webphone') {
                    alert('Internet: ' + e.data.internet + ' e computador: ' + e.data.computador);
                }

                vm.callPhone()
                setTimeout(function () {

                }, 3000);
            };
        }
    }
</script>

<style scoped>

</style>
