<template>
   <!-- <ul class="vx-timeline">
        <li key="TEste 1">
            <div class="timeline-icon bg-red">
                <feather-icon icon="SearchIcon" svgClasses="text-white stroke-current w-5 h-5" />
            </div>
            <div class="timeline-info">
                <p class="font-semibold">Título</p>
                <span class="activity-desc">Descrição maluca</span>
            </div>
            <small class="text-grey activity-e-time">15 dias atrás</small>
        </li>
        <li key="Lucas">
            <div class="timeline-icon bg-blue">
                <feather-icon icon="SearchIcon" svgClasses="text-white stroke-current w-5 h-5" />
            </div>
            <div class="timeline-info">
                <p class="font-semibold">Título</p>
                <span class="activity-desc">Descrição maluca</span>
            </div>
            <small class="text-grey activity-e-time">15 dias atrás</small>
        </li>
    </ul>
-->
  <ul class="vx-timeline">
    <li v-for="historico in data">
      <div class="timeline-icon " v-bind:class="{ 'p-0' : IsUser(historico.causer_type), 'bg-primary' : !IsUser(historico.causer_type)}">
        <span class="feather-icon select-none relative">
          <img :src="get_img_api(historico.causer.avatar)" alt="" width="40" height="40" class="rounded-full" v-if="IsUser(historico.causer_type)">
          <img src="@/assets/images/util/boleto.svg" alt="" v-if="historico.causer_type == 'App\Models\CampanhaBoleto'">
          <img src="@/assets/images/util/whatsapp.svg" alt="" v-if="historico.causer_type == 'App\Models\CampanhaWhatsapp'">
          <img src="@/assets/images/util/agendamento.svg" alt="" v-if="historico.causer_type == 'App\Models\CampanhaAgendamento'">
          <img src="@/assets/images/util/cancelado.svg" alt="" v-if="historico.causer_type == 'App\Models\CampanhaCancelado'">
        </span>
      </div>
      <div class="timeline-info">
        <p class="font-semibold" v-if="IsUser(historico.causer_type)">{{historico.causer.name}}</p>
        <p class="font-semibold" v-else>{{historico.causer.nome}}</p>
        <span class="activity-desc">{{historico.description}}</span>
      </div>
      <small class="text-grey activity-e-time">25 Days Ago</small>
    </li>
    <li>
      <div class="timeline-icon p-0">
        <span class="feather-icon select-none relative">
            <img src="https://i.imgur.com/ezM6SJ5.png" alt="" width="40" height="40" class="rounded-full">
        </span>
      </div>
      <div class="timeline-info"><p class="font-semibold">Task Update Found</p><span class="activity-desc">Cupcake gummi bears soufflé caramels candy</span>
      </div>
      <small class="text-grey activity-e-time">15 Days Ago</small>
    </li>
  </ul>
</template>

<script>
    export default {
        name: "Historico",
       props: ['data'],
      
      
      methods: {
        IsUser(type) {
         if (type == `App\\Models\\User`) {
           return true;
         }else {
           return false;
         }
        }
        },
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>
