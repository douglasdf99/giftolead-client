<template>
    <div>
        <ul class="vx-timeline ">
            <li v-for="historico in data" class="mt-5 bg-white">
                <div class="timeline-icon p-0">
                <span class="feather-icon select-none relative ">
                  <img :src="get_img_api(historico.causer.avatar)" width="40" height="40" class="rounded-full bg-white" v-if="IsUser(historico.causer_type)">
                  <img src="@/assets/images/util/boleto.svg" width="40" height="40" class="rounded-full bg-white" v-if="historico.causer_type == 'App\\Models\\CampanhaBoleto'">
                  <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full bg-white" v-if="historico.causer_type == 'App\\Models\\CampanhaWhatsapp'">
                  <img src="@/assets/images/util/agendamento.svg" width="40" height="40" class="rounded-full bg-white" v-if="historico.causer_type == 'App\\Models\\CampanhaAgendamento'">
                  <img src="@/assets/images/util/cancelado.svg" width="40" height="40" class="rounded-full bg-white" v-if="historico.causer_type == 'App\\Models\\CampanhaCancelado'">
                </span>
                </div>
                <div class="timeline-info p-4">
                    <p class="font-semibold" v-if="IsUser(historico.causer_type)">{{historico.causer.name}}</p>
                    <p class="font-semibold" v-else>{{historico.causer ? historico.causer.nome : ''}}</p>
                    <span class="activity-desc">{{historico.description}}</span>
                    <div class="vx-row my-3" v-if="historico.properties">
                        <div class="vx-col w-full">
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties.tipo == 'whatsapp'" color="#8ED839" type="filled"
                                       @click="$emit('whatsapp')">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fab fa-whatsapp text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                            </vs-button>
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties.tipo == 'email'" color="#F23257" type="filled"
                                       @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-envelope-open text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                            </vs-button>
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties.identificacao" color="#F23257" type="filled"
                                       @click="exibirLigacao = true; chamadaResgatada = historico.properties; consultaChamada(historico.properties.id)">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-phone text-2xl mr-3 text-white"></i>
                                Chamada
                                </span>
                            </vs-button>
                            <div  v-if="historico.properties.follow_up">
                              <div class="p-4 bg-card-gray">
                                <div class="flex mb-2">
                                  <span class="font-bold">Fallow Up : </span> <span > {{getAtendimento(historico.properties.id).follow_up}}</span>
                                </div>
                                <div class="flex mb-2">
                                  <span class="font-bold">Status de Atendimento Tipo : </span> <span >  <vs-chip :color="getAtendimento(historico.properties.id).status_atendimento.tipo === 0? 'success' : getAtendimento(historico.properties.id).status_atendimento.tipo === 1 ? 'warning' : 'danger'">{{ getAtendimento(historico.properties.id).status_atendimento.tipo === 0? 'Ganhou' : getAtendimento(historico.properties.id).status_atendimento.tipo === 1 ? 'Aguardando' : 'Perdeu' }}</vs-chip></span>
                                </div>
                                <div class="flex mb-2">
                                  <span class="font-bold">Status de Atendimento Escolhido : </span> <span > {{getAtendimento(historico.properties.id).status_atendimento.nome}}</span>
                                </div>
                              </div>
                            </div>
                            <div  v-if="historico.properties.data_agendamento">
                              <div class="p-4 bg-card-gray">
                                <div class="flex mb-2">
                                  <span class="font-bold">Agendamento para a data : </span> <span > {{historico.properties.data_agendamento | formatDateTime}}</span>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <small class="text-grey activity-e-time pl-4">{{historico.created_at | formatDateHumanize}}</small>
            </li>
        </ul>
        <vs-popup class="holamundo" title="Mensagem enviada" :active.sync="exibirMensagem">
            <div class="vx-row">
                <div class="vx-col w-full mb-3">
                    <p class="text-black" v-html="mensagem"></p>
                </div>
            </div>
        </vs-popup>
        <vs-popup class="holamundo2" title="Mensagem enviada" :active.sync="exibirLigacao">
            <div class="vx-row">
                <div class="vx-col w-full mb-3">
                    <h5 class="text-black">
                        #{{chamadaResgatada.id}}
                    </h5>
                    <div class="fill-row-loading w-full" v-show="!detalheChamada.sucesso">
                        <div id="loading-chamada" :class="{'activeLoading':activeLoading}"
                             class="vs-con-loading__container loading-example w-full">
                        </div>
                    </div>

                    <div class="vs-divider"></div>

                    <div class="" v-if="detalheChamada.sucesso">
                        <vx-card class="p-2">
                            <div class="vx-row">
                                <div class="vx-col w-full lg:w-1/2">
                                    <div class="text-left mb-10">
                                        <h6 class="mb-2 text-lg"><b>Informações de origem</b></h6>
                                        <h6 class="mb-2"><b>Tipo de Ligação:</b> {{ tipoChamada(detalheChamada.dados.origem.tipo) }}</h6>
                                        <h6 class="mb-2"><b>Numero :</b> {{ detalheChamada.dados.origem.numero }}</h6>
                                        <h6 class="mb-2"><b>Preco :</b> R$ {{ detalheChamada.dados.origem.preco }}</h6>
                                        <h6 class="mb-2 flex items-center"><b class="mr-4">Status:</b>
                                            <vs-chip color="primary">{{ detalheChamada.dados.origem.status || 'Não informado' }}</vs-chip>
                                        </h6>
                                    </div>
                                </div>
                                <div class="vx-col w-full lg:w-1/2">
                                    <div class="text-left mb-10">
                                        <h6 class="mb-2 text-lg"><b>Informações de Destino</b></h6>
                                        <h6 class="mb-2"><b>Tipo de Ligação:</b> {{ tipoChamada(detalheChamada.dados.destino.tipo) }}</h6>
                                        <h6 class="mb-2"><b>Numero :</b> {{ detalheChamada.dados.destino.numero | VMask('(##) #####-####')}}</h6>
                                        <h6 class="mb-2"><b>Preco :</b> R$ {{ detalheChamada.dados.destino.preco }}</h6>
                                        <h6 class="mb-2 flex items-center"><b class="mr-4">Status:</b>
                                            <vs-chip color="primary">{{ detalheChamada.dados.destino.status }}</vs-chip>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div class="vx-row">
                                <div class="vx-col w-full lg:w-1/2">
                                    <div class="text-left mb-10">
                                        <h6 class="mb-2 text-lg"><b>Informações Gerais</b></h6>
                                        <h6 class="mb-2"><b>Data da solicitação:</b> {{ detalheChamada.dados.data_criacao | formatDateTime }}</h6>
                                        <h6 class="mb-2 flex items-center"><b class="mr-4">Status Final:</b>
                                            <vs-chip color="primary">{{ detalheChamada.dados.status_geral }}</vs-chip>
                                        </h6>
                                    </div>
                                </div>
                                <div class="vx-col w-full lg:w-1/2" v-if="$acl.check('ticket_gravacao')">
                                    <h6 class="mb-5"><b>Gravação :</b>
                                    </h6>
                                    <vs-chip color="danger" v-if="!detalheChamada.dados.url_gravacao">Não houve gravação</vs-chip>
                                    <div class="" v-else>
                                        <audio controls>
                                            <source :src="detalheChamada.dados.url_gravacao" type="audio/ogg">
                                            <source :src="detalheChamada.dados.url_gravacao" type="audio/mpeg">
                                        </audio>
                                    </div>
                                </div>
                            </div>
                            <template slot="footer">
                                <vs-divider/>
                                <div class="flex justify-between">
                                    <span class="flex items-center">
                                        <vs-icon icon="signal_cellular_alt"></vs-icon>
                                        <span>Avaliação:  </span>
                                    </span>
                                    <span class="flex items-center">
                                        <vs-icon icon="computer"></vs-icon>
                                        <span>Total gasto: R$ {{detalheChamada.dados.origem.preco + detalheChamada.dados.destino.preco}}</span>
                                     </span>
                                </div>
                            </template>
                        </vx-card>
                        <!--{{detalheChamada}}-->
                    </div>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
    import moduleTickets from "../../store/tickets/moduleTickets";

    export default {
        name: "Historico",
        props: ['data','atendimentos'],
        data() {
            return {
                exibirLigacao: false,
                chamadaResgatada: {},
                exibirMensagem: false,
                mensagem: '',
                detalheChamada: {
                    sucesso: false,
                }
            }
        },
        created() {
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }
            console.log(this.data)
        },

        methods: {
          getAtendimento(id){
            let atendimento = {};
             this.atendimentos.forEach((item)=>{
               if ( item.id == id){
                 atendimento = item;
               }
            })
            return atendimento
          },
            IsUser(type) {
                return (type == `App\\Models\\User`) ? true : false;
            },
            consultaChamada(id) {
                this.$vs.loading({
                    container: `#loading-chamada`,
                    type: 'default',
                });
                this.$store.dispatch('tickets/consultaChamada', {identificacao: id}).then(response => {
                    console.log('response consultaChamada', response);

                    this.detalheChamada = response
                });
            },
            tipoChamada(val) {
                switch (val) {
                    case 'movel':
                        return 'Celular';
                    case 'ramal':
                        return 'Interno';
                    default:
                        return val;
                }
            }
        },
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>

<style>
    .holamundo2 .vs-popup {
        width: 900px;
    }

    @media (max-width: 670px) {
        .holamundo2 .vs-popup {
            width: 95%;
        }
    }
</style>
