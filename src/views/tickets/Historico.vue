<template>
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
            </div>
            <small class="text-grey activity-e-time">{{historico.created_at | formatDateHumanize}}</small>
        </li>
    </ul>
</template>

<script>

    export default {
        name: "Historico",
        props: ['data'],
        created(){
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
