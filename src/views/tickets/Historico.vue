<template>
    <div>
        <ul class="vx-timeline">
            <li v-for="historico in data">
                <div class="timeline-icon p-0">
                <span class="feather-icon select-none relative">
                  <img :src="get_img_api(historico.causer.avatar)" width="40" height="40" class="rounded-full" v-if="IsUser(historico.causer_type)">
                  <img src="@/assets/images/util/boleto.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaBoleto'">
                  <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaWhatsapp'">
                  <img src="@/assets/images/util/agendamento.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaAgendamento'">
                  <img src="@/assets/images/util/cancelado.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaCancelado'">
                  <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\\Models\\Whatsapplist'">
                </span>
                </div>
                <div class="timeline-info">
                    <p class="font-semibold" v-if="IsUser(historico.causer_type)">{{historico.causer.name}}</p>
                    <p class="font-semibold" v-else>{{historico.causer.nome}}</p>
                    <span class="activity-desc">{{historico.description}}</span>
                    <div class="vx-row my-3">
                        <div class="vx-col w-full">
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'whatsapp'" color="#8ED839" type="filled"
                                       @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fab fa-whatsapp text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                            </vs-button>
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'email'" color="#F23257" type="filled"
                                       @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-envelope-open text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                            </vs-button>
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.identificacao" color="#F23257" type="filled"
                                       @click="exibirLigacao = true; chamadaResgatada = historico.properties; consultaChamada(historico.properties.id)">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-phone text-2xl mr-3 text-white"></i>
                                Chamada
                                </span>
                            </vs-button>
                        </div>
                    </div>
                </div>
                <small class="text-grey activity-e-time">{{historico.created_at | formatDateHumanize}}</small>
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
                  <h5 class="text-black" >
                    #{{chamadaResgatada.id}}
                  </h5>
                  <div class="fill-row-loading w-full" v-show="!detalheChamada.sucesso">
                    <div id="loading-chamada" :class="{'activeLoading':activeLoading}"
                         class="vs-con-loading__container loading-example w-full" >
                    </div>
                  </div>

                  <div class="vs-divider" ></div>

                  <div class="" v-if="detalheChamada.sucesso">
                    <vx-card class="p-2">
                      <div class="text-left mb-10">
                        <h6 class="mb-2"><b>Informações de origem:</b></h6>
                        <h6 class="mb-2"><b>Tipo de Ligação:</b> {{ detalheChamada.dados.origem.tipo }}</h6>
                        <h6 class="mb-2"><b>Numero :</b> {{ detalheChamada.dados.origem.numero }}</h6>
                        <h6 class="mb-2"><b>Status :</b> {{ detalheChamada.dados.origem.status }}</h6>
                        <h6 class="mb-2"><b>Preco :</b> {{ detalheChamada.dados.origem.preco }}</h6>
                      </div>
                      <div class="text-left mb-10">
                        <h6 class="mb-2"><b>Informações de Destino:</b></h6>
                        <h6 class="mb-2"><b>Tipo de Ligação:</b> {{ detalheChamada.dados.destino.tipo }}</h6>
                        <h6 class="mb-2"><b>Numero :</b> {{ detalheChamada.dados.destino.numero }}</h6>
                        <h6 class="mb-2"><b>Status :</b> {{ detalheChamada.dados.destino.status }}</h6>
                        <h6 class="mb-2"><b>Preco :</b> {{ detalheChamada.dados.destino.preco }}</h6>
                      </div>
                      <div class="text-left mb-10">
                        <h6 class="mb-2"><b>Informações Gerais:</b></h6>
                        <h6 class="mb-2"><b>Data da solicitação:</b> {{ detalheChamada.dados.data_criacao  }}</h6>

                        <h6 class="mb-2"><b>Status Final:</b> {{ detalheChamada.dados.status_geral }}</h6>

                          <h6 class="mt-10 mb-5"><b>Gravação :</b>
                          </h6>
                        <vs-chip color="danger"  v-if="!detalheChamada.dados.url_gravacao">Não houve gravação</vs-chip>
                        <div class=""  v-else>
                          <audio controls>
                            <source :src="detalheChamada.dados.url_gravacao" type="audio/ogg">
                            <source :src="detalheChamada.dados.url_gravacao" type="audio/mpeg">
                          </audio>
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
                                        <span>total gasto:  </span>
                                     </span>
                        </div>
                      </template>
                    </vx-card>
                    {{detalheChamada}}
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
        props: ['data'],
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
            IsUser(type) {
                return (type == `App\\Models\\User`) ? true : false;
            },
            consultaChamada(id) {
              this.$vs.loading({
                container: `#loading-chamada`,
                type:'default',
              });
              this.$store.dispatch('tickets/consultaChamada', {identificacao: id}).then(response => {
                console.log('response consultaChamada', response);

                this.detalheChamada = response
              });
            }
        },
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>
