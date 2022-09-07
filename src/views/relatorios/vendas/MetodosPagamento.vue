<template>
    <div class="vx-row">
        <div class="vx-col w-full">
            <h4 class="my-base">Métodos de Pagamento</h4>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5" v-for="(value, method) in items" :key="method">
            <custom-statistics-card hideChart :non-formated-value="value" class="mb-base" icon="DollarSignIcon" :statistic="value | statisticCardValue" :statisticTitle="method | paymentTreatment" color="success"/>
        </div>
    </div>
</template>

<script>
import CustomStatisticsCard from './CustomStatisticsCard';

export default {
    name: "MetodosPagamento",
    components: {CustomStatisticsCard},
    props: {
        items: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style scoped>

</style>
