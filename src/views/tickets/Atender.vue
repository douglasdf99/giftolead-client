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
        <!-- inicio popup-->
        <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="" v-if="ticket.lead" v-show="isCallActive">
            <div class="vs-popup--background"></div>
            <div class="vs-popup" style="background: rgb(255, 255, 255);">
                <header class="vs-popup--header">
                    <div class="vs-popup--title">
                    </div>
                </header>
                <div class="vs-popup--content">
                    <div class="vx-col w-full">
                        <vx-card class="p-2">
                            <div class="text-left mb-10">
                                <h6 class="mb-2"><b>Nome do lead:</b> {{ ticket.lead.nome }}</h6>
                                <h6 class="mb-2"><b>Numero de telefone:</b> +55{{ticket.lead.ddd}}{{ ticket.lead.telefone}}</h6>
                                <p class="mb-2"></p>
                            </div>
                            <div class="flex items-center">
                                <div class="fill-row-loading w-full">
                                    <h3><span class="font-14">Status:</span> {{statustext}}</h3>
                                    <div id="loading-sound" :class="{'activeLoading':activeLoading}"
                                         class="vs-con-loading__container loading-example w-full" v-show="chamada.id">
                                    </div>
                                    <div id="loading-default" :class="{'activeLoading':activeLoading}"
                                         class="vs-con-loading__container loading-example w-full" v-show="!chamada.id">
                                    </div>
                                    <h5><span class="font-14 my-2">Tempo:</span> {{time}}</h5>
                                </div>
                            </div>
                            <div class="flex justify-center flex-wrap mt-10">
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="success" type="filled" v-if="!muted"
                                           icon-pack="material-icons" icon="volume_up" @click="mute">
                                </vs-button>
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled" v-else
                                           icon-pack="material-icons" icon="volume_off" @click="mute">
                                </vs-button>
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled"
                                           icon-pack="material-icons" icon="call_end" @click="desligaChamada">

                                </vs-button>
                            </div>
                            <template slot="footer">
                                <vs-divider/>
                                <div class="flex justify-between">
                                    <span class="flex items-center">
                                        <vs-icon icon="signal_cellular_alt"></vs-icon>
                                        <span>Internet: {{status.internet}} </span>
                                    </span>
                                    <span class="flex items-center">
                                        <vs-icon icon="computer"></vs-icon>
                                        <span>computador: {{status.computador}} </span>
                                     </span>
                                </div>
                            </template>
                        </vx-card>
                    </div>
                </div>
            </div>
        </div>
        <!-- fim popup-->
        <div class="vx-row" v-if="ticket.lead" >
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
                            <div class="w-full flex my-5">
                                <vs-button class="font-bold rounded-full mx-2" color="primary" type="filled" icon-pack="material-icons" icon="call" @click="chamaNumero" :disabled="!conectado">
                                    Ligar
                                    <div class="h-3 w-3 inline-block rounded-full mr-2" :class="{'bg-success' : conectado,'bg-danger' : !conectado}"></div>
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
                                {{ticket.responsavel.nome}}
                                <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                                <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaBoleto'">
                                <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
                                <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
                                <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCancelado'">
                                <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel_type == 'App\\\Models\\\Whatsapplist'">
                                <img :src="get_img_api(ticket.responsavel.avatar)" width="40" class="ml-2" v-if="ticket.responsavel.avatar">
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
                        <historico :data="ticket.acoesrecebidas" @whatsapp="whatsapp(ticket)"></historico>
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
                            <vs-button class="mr-3" color="primary" type="filled" @click="finalizar" :disabled="!valido">
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
  import moduleUsuario from "../../store/usuarios/moduleUsuario";
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

                activeLoading: false,
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
            }
        },
        created() {

            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }
            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('usuarios', moduleUsuario)
                moduleUsuario.isRegistered = true
            }

          this.verificacao();

          this.$store.dispatch('usuarios/getUserAuth').then(response => {
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', 'https://api2.totalvoice.com.br/w3/?key='+response.webphone+'&tipo=hidden&ver=2');
            document.body.appendChild(recaptchaScript)
          });

        },
        methods: {
            getId(id) {
                this.$vs.loading();
                console.log('teste')
                this.$store.dispatch('tickets/getId', id).then(response => {
                    this.ticket = response;
                    this.ticket.nome_destinatario = response.lead.nome;
                    this.ticket.email_destinatario = response.lead.email;

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
                this.$vs.dialog({
                    color: 'primary',
                    title: `Finalizar atendimento?`,
                    text: 'Deseja mesmo finalizar este atendimento?',
                    acceptText: 'Sim!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('tickets/finalizar', this.ticket).then(response => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Atendimento finalizado com sucesso'
                            });
                            this.$vs.loading.close();
                            this.$router.push({name: 'tickets-list'});
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao finalizar. Reinicie a página.'
                            })
                        })
                    }
                })
            },
            verificacao() {
                this.$store.dispatch('tickets/verificaDisponibilidade', this.$route.params.id).then(response => {
                    console.log('olha o response', response)
                    if (response.status == 'ok')
                        this.getId(this.$route.params.id);
                    else if (response.status == 'atendendo') {
                        this.openAlert('Ticket em atendimento', response.msg, 'danger');
                    } else if (response.status == 'jaatendendo') {
                        this.openAlert('Atendimento em andamento, Ticket #' + response.id, response.msg, 'primary', response.id);
                    } else {
                        this.openAlert('Este Ticket já encontra-se fechado', response.msg, 'danger');
                    }
                });
            },
            openAlert(title, text, color, id = null) {
                this.$vs.dialog({
                    color: color,
                    title: title,
                    text: text,
                    type: 'confirm',
                    cancelText: 'Voltar',
                    accept: () => {
                        if (id != null) {
                            this.$router.push({name: 'tickets-atender', params: {id}});
                            this.getId(id);
                        } else
                            this.$router.push({name: 'tickets-list'});
                    },
                    cancel: () => {
                        this.$router.push({name: 'tickets-list'});
                    },
                    acceptText: 'Ir até ele'
                })
            },
            sendChamada(id) {
                this.$store.dispatch('tickets/chamaNumero', {ticket: this.ticket, chamada_id: id}).then(response => {
                    console.log('response também da chamada realizada', response)
                });
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

            /* TOTAL VOICE */
            //Conecta o webphone para coloca-lo em operação
            conectar() {
                webphone.contentWindow.postMessage({message: 'conectar'}, '*');
            },

            //desconecta o webphone - ele nao recebe nem envia mais chamadas
            desconectar() {
                webphone.contentWindow.postMessage({message: 'desconectar'}, '*');
            },

            tratamentoTelefone(ddd,telefone){
              if (ddd) {
                ddd = ddd.replace(/[{()}]/g, '');
              }else{
                ddd = '';
              }
              if (telefone){
                telefone = telefone.replace(/-/g, '')
                telefone = telefone.replace(/[{()}]/g, '')
              }else{
                telefone = '';
              }

              return ddd + telefone;
            },

            //telefona para um número
            chamaNumero() {
                this.isCallActive = true;

                this.$vs.loading({
                    container: `#loading-sound`,
                    type: 'sound',
                });
                this.$vs.loading({
                    container: `#loading-default`,
                    type: 'default',
                });

              let teletone = this.tratamentoTelefone(this.ticket.lead.ddd,this.ticket.lead.telefone)
                console.log('numero', teletone)
                webphone.contentWindow.postMessage({
                    message: 'chamaNumero',
                    //'numero': '61981489175',
                    'numero': teletone
                }, '*');
            },
            desligaChamada() {
                console.log(this.chamada);
                webphone.contentWindow.postMessage({
                    message: 'hangup'
                }, '*');
                let text = (this.chamada.id != null) ? 'Chamada encerrada e registrada no histórico do Ticket.' : 'Chamada encerrada.';
                this.$vs.notify({
                    color: 'primary',
                    title: '',
                    text: text
                });
                this.getId(this.$route.params.id);
                /* this.$store.dispatch('tickets/desligaChamada', this.chamada).then(response => {
                   console.log('response também da chamada desligada', response)
                   this.$vs.loading.close();
                 });*/
            },



            //mute microfone
            mute() {
                this.muted = !this.muted;
                webphone.contentWindow.postMessage({
                    message: 'mute'
                }, '*');

            },


            //cronometro//

            start() {
                this.cron = setInterval(() => {
                    this.timer();
                }, this.tempo);
            },
            //Para o temporizador e limpa as variáveis
            stop() {
                clearInterval(this.cron);
                this.hh = 0;
                this.mm = 0;
                this.ss = 0;

                this.time = '00:00:00';
            },

            //Faz a contagem do tempo e exibição
            timer() {
                this.ss++; //Incrementa +1 na variável ss

                if (this.ss == 59) { //Verifica se deu 59 segundos
                    this.ss = 0; //Volta os segundos para 0
                    this.mm++; //Adiciona +1 na variável mm

                    if (this.mm == 59) { //Verifica se deu 59 minutos
                        this.mm = 0;//Volta os minutos para 0
                        this.hh++;//Adiciona +1 na variável hora
                    }
                }
                //Cria uma variável com o valor tratado HH:MM:SS
                let format = (this.hh < 10 ? '0' + this.hh : this.hh) + ':' + (this.mm < 10 ? '0' + this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss);
                console.log('timer', format)
                this.time = format;
            },

        },
        computed: {
            ticket() {
                return this.$store.state.tickets.ticketAtendimento;
            },
            valido() {
                let temfollow = this.ticket.follow_up != null && this.ticket.follow_up != "";
                console.log('status', this.ticket.status_atendimento_id);
                return (temfollow && this.ticket.status_atendimento_id != {});
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
            window.onmessage = function (e) {
                //quando receber uma ligacao
                console.log('evento', e)
                if (e.data.message == 'chegandoChamada') {
                    alert('Chegando Chamada de ' + e.data.numeroChegando + ' para: ' + e.data.numeroDestino + ' chamada_recebida_id: ' + e.data.chamadaRecebidaId);
                }
                //conectado, chamando, encerrada, conversando
                if (e.data.message == 'status') {
                    vm.statustext = e.data.status;
                    if (e.data.status == 'encerrada') {
                        vm.stop();
                        vm.isCallActive = false;
                    } else if (e.data.status == 'chamando') {
                        vm.isCallActive = true;
                    } else if (e.data.status == 'conectado') {
                        vm.conectado = true;
                    } else if (e.data.status == 'conversando') {
                        vm.start();
                        vm.isCallActive = true;
                    }
                }
                //o id é único e pode ser utilizado na api para recuperação de mais informações (get na api ou webhooks)
                if (e.data.message == 'chamada_id') {
                    vm.chamada.id = e.data.chamada_id;
                    if (e.data.chamada_id) {
                        vm.sendChamada(e.data.chamada_id);
                    }

                }
                //os erros são finais
                if (e.data.message == 'status_erro') {
                    alert('Sem Permissão: ' + e.data.status_erro);
                    vm.isCallActive = false;
                    vm.conectado = false;
                }
                //rebendo o statu0s de diagnóstico de internet e computador para verificar qualidade de ligação
                if (e.data.message == 'stats_webphone') {
                    vm.status.internet = e.data.internet;
                    vm.status.computador = e.data.computador;

                }
                //os erros são finais
                if (e.data.message == 'status_erro') {
                    alert('Sem Permissão: ' + e.data.status_erro);
                }
            };
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

            &.activeLoading {
                opacity: 0 !important;
                transform: scale(0.5);
            }
        }
    }
</style>
