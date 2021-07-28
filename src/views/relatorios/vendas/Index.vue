<template>
    <div>
        <div class="vx-row mb-base">
            <div class="vx-col w-full">
                <LineChart :series="series" :labels="categories"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-1/4">
                <statistics-card-line hideChart class="mb-base" chart-data="" icon="DollarSignIcon"
                                      icon-right :statistic="statistics.valor_recuperado" statisticTitle="Valor recuperado" color="success"/>
            </div>
            <div class="vx-col w-1/4">
                <statistics-card-line hideChart class="mb-base" chart-data="" icon="DollarSignIcon"
                                      icon-right :statistic="5" statisticTitle="" color="primary"/>
            </div>
            <div class="vx-col w-1/4">
                <statistics-card-line hideChart class="mb-base" chart-data="" icon="ClockIcon"
                                      icon-right :statistic="5" statisticTitle="Tickets Atrasados" color="danger"/>
            </div>
            <div class="vx-col w-1/4">
                <statistics-card-line hideChart class="mb-base" chart-data="" icon="ClockIcon"
                                      icon-right :statistic="5" statisticTitle="Tickets Atrasados" color="danger"/>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "./LineChart";
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import moduleRelatorios from "../../../store/relatorios/moduleRelatorios";

export default {
    name: "Index",
    components: {LineChart, StatisticsCardLine},
    data() {
        return {
            categories: ['01/10', '05/11', '09/12', '13/13', '17/46'],
            series: [
                {data: [4896, 3000, 5677, 2324, 5298], name: 'Pompoarismo', color: '#7367F0'},
                {data: [5222, 4333, 9513, 7854, 2365], name: 'MBR', color: '#b8c2cc'},
                {data: [1234, 2345, 3456, 4567, 5678], name: 'VTSD', color: '#db3e3e'}
            ],
            statistics: {
                valor_recuperado: 0,
                valor_coorecuperado: {
                    "App\\Models\\CampanhaCarrinho": 123,
                    "App\\Models\\CampanhaBoleto": 1524123,
                    "App\\Models\\CampanhaWhatsapp": 0,
                    "App\\Models\\CampanhaCancelado": 0,
                    "App\\Models\\CampanhaAgendamento": 0,
                    "App\\Models\\User": 0,
                    "App\\Models\\Link": 0,
                },
                valor_recuperado_direto_campanhas: {
                    "saveleads-recovery-billet": 0,
                    "saveleads-recovery-cart": 0,
                    "wb-abertura-src|saveleads": 0
                }
            }
        }
    },
    created() {
        if (!moduleRelatorios.isRegistered) {
            this.$store.registerModule('relatorios', moduleRelatorios)
            moduleRelatorios.isRegistered = true
        }

        console.log('statistics', this.statistics.valor_coorecuperado["App\\Models\\CampanhaBoleto"])

        this.getProductSales()
    }
    ,
    methods: {
        getProductSales() {
            this.$store.dispatch('relatorios/get', {route: 'relatoriovendas'}).then(response => {
                console.log('volta vendas', response)
                this.statistics = {...response}
            }).finally(() => this.$store.commit('relatorios/SET_LOADING', {vendas: false}))
        }
    }
    ,
    computed: {
        loading() {
            return this.$store.state.relatorios.loading
        }
    }
}
</script>
