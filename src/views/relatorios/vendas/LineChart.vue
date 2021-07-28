<template>
    <vx-card title="Comparação mensal" class="card-overlay">
        <template slot="actions">
            <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
        </template>
        <div slot="no-body" class="p-6 pb-0">

            <div class="flex">
                <div class="mr-6">
                    <p class="mb-1 font-semibold">Este mês</p>
                    <p class="text-3xl text-success">
                        <sup class="text-base mr-1">$</sup>
                        {{ series[0].data.reduce((total, next) => (total + next)) }}
                    </p>
                </div>
            </div>

            <vue-apex-charts type=line height=266 :options="chartOptions" :series="series"/>
        </div>
    </vx-card>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "LineChart",
    //extends: Line,
    components: {VueApexCharts},
    props: ['series', 'labels'],
    data() {
        return {
            chartOptions: {
                chart: {
                    toolbar: {show: false},
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
                    show: false,
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
                    axisTicks: {
                        show: false,
                    },
                    categories: [],
                    axisBorder: {
                        show: false,
                    },
                },
                yaxis: {
                    tickAmount: 5,
                    labels: {
                        style: {
                            cssClass: 'text-grey fill-current',
                        },
                        formatter: function (val) {
                            return val > 999 ? (val / 1000).toFixed(1) + 'k' : val;
                        }
                    }
                },
                tooltip: {
                    x: {show: false}
                }
            },
            loadings: {
                productSales: false
            }
        }
    },
    created() {
        this.chartOptions.xaxis.categories = [...this.labels]
    }

}
</script>
