<template>
    <div class="vx-row">
        <div class="vx-col w-full">
            <h4 class="my-base">Valores recuperados automaticamente pelo sistema</h4>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.boleto" class="mb-base" icon="DollarSignIcon"
                                    :statistic="items.boleto | statisticCardValue"
                                    statisticTitle="Boleto" color="success"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5">
            <custom-statistics-card hideChart :non-formated-value="items.carrinho" class="mb-base" icon="DollarSignIcon"
                                    :statistic="items.carrinho | statisticCardValue"
                                    statisticTitle="Carrinho" color="success"/>
        </div>
        <div class="vx-col w-1/2 lg:w-1/5" v-if="items.colaborador !== 'undefined'">
            <custom-statistics-card hideChart :non-formated-value="items.colaborador" class="mb-base" icon="LinkIcon"
                                    :statistic="items.colaborador | statisticCardValue"
                                    statisticTitle="Link do Colaborador" color="success"/>
        </div>
    </div>
</template>

<script>
import CustomStatisticsCard from './CustomStatisticsCard';

export default {
    name: "Automaticas",
    components: {CustomStatisticsCard},
    props: {
        items: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style scoped>

</style>
