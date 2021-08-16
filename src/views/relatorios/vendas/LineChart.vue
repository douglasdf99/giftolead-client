<template>
    <vx-card title="Overview comparativo entre produtos" class="card-overlay">
        <template slot="actions">
            <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
        </template>
        <div slot="no-body" class="p-6 pb-0">

            <div class="flex">
                <div class="mr-6">
                    <p class="mb-1 font-semibold">Valor total recuperado neste período</p>
                    <p class="text-3xl text-success">
                        <sup class="text-base mr-1 font-bold">$ {{vendas.statistics.valor_recuperado > 999 ?
                            (vendas.statistics.valor_recuperado / 1000).toFixed(2) + 'k' :
                            vendas.statistics.valor_recuperado}}</sup>
                    </p>
                </div>
            </div>

            <vue-apex-charts type=line height=350 :options="chartOptions" :series="vendas.grafico.series"/>
        </div>
    </vx-card>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "LineChart",
    //extends: Line,
    components: {VueApexCharts},
    data() {
        return {
            chartOptions: {
                chart: {
                    toolbar: {show: true},
                    dropShadow: {
                        enabled: true,
                        top: 5,
                        left: 0,
                        blur: 4,
                        opacity: 0.10,
                    },
                },
                stroke: {
                    curve: 'smooth',
                    dashArray: 8,
                    width: 3,
                },
                grid: {
                    borderColor: '#e7e7e7',
                },
                legend: {
                    show: true,
                },
                colors: ['#F97794', '#b8c2cc', '#e57b7b'],
                markers: {
                    size: 0,
                    hover: {
                        size: 5
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            cssClass: 'text-grey fill-current',
                        }
                    },
                    categories: [],
                },
                yaxis: {
                    tickAmount: 5,
                    labels: {
                        style: {
                            cssClass: 'text-grey fill-current',
                        },
                        formatter: function (val) {
                            return val > 999 ? (val / 1000).toFixed(2) + 'k' : val;
                        }
                    }
                },
                tooltip: {
                    x: {show: true}
                }
            },
            loadings: {
                productSales: false
            }
        }
    },
    created(){
        this.chartOptions.xaxis.categories = this.vendas.grafico.categories
    },
    computed: {
        vendas() {
            return this.$store.state.relatorios.vendas
        },
    },
    // updated() {
    //     this.chartOptions.xaxis.categories = this.categories
    // },
}
</script>
