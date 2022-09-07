<template>
    <vx-card :class="`overflow-hidden custom-statistic-card ${!nonFormatedValue ? 'disabled' : ''}`">
        <div slot="no-body">
            <div class="p-6" :class="{
              'flex justify-between flex-row-reverse items-center': iconRight,
              'text-center': !iconRight && hideChart,
              'pb-0': !hideChart
            }">
                <feather-icon v-if="icon" :icon="icon" class="p-3 inline-flex rounded-full"
                              :class="[`text-${color}`, {'mb-4': !iconRight}]"
                              :style="{background: `rgba(var(--vs-${color}),.15)`}"></feather-icon>
                <img src="@/assets/images/util/agendamento.svg" v-if="customIcon && customIcon === 'agendamento'"
                     class="img-conquista rounded-none mb-4 mx-auto" width="45">
                <img src="@/assets/images/util/boleto.svg" v-if="customIcon && customIcon === 'boleto'"
                     class="img-conquista rounded-none mb-4 mx-auto" width="45">
                <img src="@/assets/images/util/checkout.svg" v-if="customIcon && customIcon === 'checkout'"
                     class="img-conquista rounded-none mb-4 mx-auto" width="45">
                <img src="@/assets/images/util/whatsapp.svg" v-if="customIcon && customIcon === 'whatsapp'"
                     class="img-conquista rounded-none mb-4 mx-auto" width="45">
                <img src="@/assets/images/util/cancelado.svg" v-if="customIcon && customIcon === 'cancelado'"
                     class="img-conquista rounded-none mb-4 mx-auto" width="53">
                <div class="truncate">
                    <h2 class="mb-1 font-bold">
                        <span class="text-base mr-1 font-bold text-xs">
                            R$ </span>{{ statistic }}</h2>
                    <span>{{ statisticTitle }}</span>
                </div>
            </div>

            <div class="line-area-chart" v-if="!hideChart">
                <vue-apex-charts ref="apexChart" :type="type" height=100 width='100%' :options="chartOptions"
                                 :series="chartData"/>
            </div>
        </div>
    </vx-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import chartConfigs from "@/components/statistics-cards/chartConfigs.js";
import _color from '@/assets/utils/color.js';

export default {
    props: {
        icon: {
            type: String,
            required: false
        },
        customIcon: {
            type: String,
            required: false
        },
        statistic: {
            type: [Number, String],
            required: true,
        },
        statisticTitle: {
            type: String,
        },
        chartData: {
            // type: Array,
            // required: true
        },
        color: {
            type: String,
            default: 'primary',
        },
        colorTo: {
            type: String
        },
        // chartType: {
        //     type: String,
        //     default: 'line-chart',
        // },
        type: {
            type: String,
            default: 'line'
        },
        iconRight: {
            type: Boolean,
            default: false
        },
        hideChart: {
            type: Boolean,
            default: false,
        },
        nonFormatedValue: {
            type: Number,
            default: 1,
            required: false
        }
    },
    data() {
        return {
            chartOptions: null
        };
    },
    watch: {
        themePrimaryColor() {
            this.$refs.apexChart.updateOptions({theme: {monochrome: {color: this.getHex(this.color)}}});
        }
    },
    computed: {
        themePrimaryColor() {
            return this.$store.state.themePrimaryColor;
        }
    },
    methods: {
        getHex(color) {
            if (_color.isColor(color)) {
                let rgb = window.getComputedStyle(document.documentElement).getPropertyValue(`--vs-${color}`);
                rgb = rgb.split(",");
                return "#" + ((1 << 24) + (Number(rgb[0]) << 16) + (Number(rgb[1]) << 8) + Number(rgb[2])).toString(16).slice(1);
            }
            return color;
        },
        gradientToColor(color) {
            let gradientToColors = {
                "primary": "#A9A2F6",
                "success": "#55DD92",
                "warning": "#ffc085",
                "danger": "#F97794"
            };

            return gradientToColors[color] ? gradientToColors[color] : gradientToColors["primary"];
        }
    },
    components: {
        VueApexCharts
    },
    created() {
        if (this.type == 'area') {
            // assign chart options
            this.chartOptions = Object.assign({}, chartConfigs.areaChartOptions);

            this.chartOptions['theme'] = {
                monochrome: {
                    enabled: true,
                    color: this.getHex(this.color),
                    shadeTo: 'light',
                    shadeIntensity: 0.65
                }
            };
        } else if (this.type == "line") {
            // Assign chart options
            this.chartOptions = JSON.parse(JSON.stringify(chartConfigs.lineChartOptions));

            this.chartOptions.fill.gradient.gradientToColors = [this.gradientToColor(this.colorTo || this.color)];
            this.chartOptions.colors = [this.getHex(this.color)];
        }
    }
};
</script>
