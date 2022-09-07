<template>
    <div class="flex items-center font-bold">
        {{ ticket.responsavel.nome || ticket.responsavel.name }}
        <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full"
             v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
        <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full"
             v-if="ticket.responsavel_type == 'App\\Models\\CampanhaBoleto'">
        <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full"
             v-if="ticket.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
        <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full"
             v-if="ticket.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
        <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full"
             v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCancelado'">
        <img :src="null" width="40" class="ml-4 rounded-full" v-if="ticket.responsavel.avatar"
             :style="{ backgroundImage: 'url('+get_img_cdn(ticket.responsavel.avatar)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '50px', height:'50px' }">
    </div>
</template>

<script>
export default {
    name: "IdentifyResponsible",
    props: ['ticket']
};
</script>

<style scoped>

</style>
