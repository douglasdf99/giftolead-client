<template>
    <div class="vx-row">
        <div class="vx-col w-full">
            <h4 class="my-base">Valor Coorecuperado - Origens</h4>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.agendamento" class="mb-base" custom-icon="agendamento" :statistic="items.agendamento | statisticCardValue" statisticTitle="Camp. Agendamento" color="success"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.boleto" class="mb-base" custom-icon="boleto" :statistic="items.boleto | statisticCardValue" statisticTitle="Camp. Boleto" color="primary"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.cancelado" class="mb-base" custom-icon="cancelado" :statistic="items.cancelado | statisticCardValue" statisticTitle="Camp. Cancelado" color="danger"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.checkout" class="mb-base" custom-icon="checkout" :statistic="items.checkout | statisticCardValue" statisticTitle="Camp. Carrinho" color="danger"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.whatsapp" class="mb-base" custom-icon="whatsapp" :statistic="items.whatsapp | statisticCardValue" statisticTitle="Camp. WhatsappList" color="danger"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.link" class="mb-base" icon="LinkIcon" :statistic="items.link | statisticCardValue" statisticTitle="Link direto" color="primary"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.user" class="mb-base" icon="UserIcon" :statistic="items.user | statisticCardValue" statisticTitle="Ticket manual" color="primary"/>
        </div>
    </div>
</template>

<script>
import CustomStatisticsCard from './CustomStatisticsCard';

export default {
    name: "Coorecuperados",
    components: {CustomStatisticsCard},
    props: {
        items: {
            type: Object,
            default: () => {}
        }
    }
};
</script>
