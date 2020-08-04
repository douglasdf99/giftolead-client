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
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'whatsapp'" color="green" type="filled"
                                       @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fab fa-whatsapp text-3xl mx-3 text-white"></i>
                                Mensagem enviada
                                </span>
                            </vs-button>
                            <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'email'" color="#F23257" type="filled"
                                       @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-envelope-open text-2xl mx-3 text-white"></i>
                                Mensagem enviada
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
                <div class="vx-col w-full text-center mb-3">
                    <p class="text-black" v-html="mensagem"></p>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>

    export default {
        name: "Historico",
        props: ['data'],
        data() {
            return {
                exibirMensagem: false,
                mensagem: ''
            }
        },
        created() {
            console.log(this.data)
        },
        methods: {
            IsUser(type) {
                return (type == `App\\Models\\User`) ? true : false;
            }
        },
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>
