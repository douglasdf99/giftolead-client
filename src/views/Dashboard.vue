<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div id="dashboard-analytics">
        <div class="vx-row absolute row-top-dashboard">
            <!-- Topo -->
            <div class="vx-col w-full mb-base">
                <vx-card slot="no-body" class="greet-user rounded-none card-top-dashboard">
                    <div class="vx-row">
                        <div class="vx-col w-full mb-3">
                            <p class="mb-6 text-2xl font-bold text-white">Meu painel</p>
                        </div>
                    </div>
                    <div class="vx-row mt-3">
                        <div class="vx-col w-5/12">
                            <div class="vx-row items-center">
                                <div class="vx-col w-1/4 text-center">
                                    <img :src="get_img_api(user.avatar)" class="rounded-full mx-auto" width="80" alt="" style="border: 2px solid white;">
                                </div>
                                <div class="vx-col w-3/2">
                                    <p class="text-white leading-3">{{ user.email }}</p>
                                    <p class="text-white leading-3 text-2xl font-bold">{{ user.name }}</p>
                                    <p class="text-white leading-3 text-lg">Função</p>
                                </div>
                            </div>
                        </div>
                        <div class="vx-col w-7/12">
                            <p class="text-white mb-3">Consquistas</p>
                            <div class="flex">
                                <div v-for="conq in user.conquistas">
                                    <vx-tooltip position="top" :text="conq.conquista.nome">
                                        <img :src="get_img_api(conq.conquista.imagem)" class="rounded-full mx-3" width="40">
                                    </vx-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
        <div class="vx-row" style="margin-top: 30vh">
            <!-- CARD 4: SESSION -->
            <div class="vx-col w-full md:w-1/3 mb-base">
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <vx-card>
                            <div class="vx-row">
                                <div class="vx-col w-full">
                                    <p>Comissões a receber</p>
                                    <p class="font-bold text-3xl text-warning">R$ {{ formatPrice(parseFloat(comissoes.soma_pendente)) }}</p>
                                    <p>{{ comissoes.quantidade_pendente }} vendas</p>

                                    <p class="mt-5">Comissões pagas</p>
                                    <p class="font-bold text-3xl text-success">R$ {{ formatPrice(parseFloat(comissoes.soma_paga)) }}</p>
                                    <p>{{ comissoes.quantidade_paga }} vendas</p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full">
                        <vx-card title="Venda por produto" class="mt-base">
                            <template slot="actions">
                                <change-date-dashboard @changeDate="getVendaPorProduto"></change-date-dashboard>
                            </template>
                            <div v-for="(item, index) in produtos" :key="index" :class="{'mt-4': index}">
                                <div class="flex justify-between">
                                    <div class="flex flex-col">
                                        <span class="mb-1">{{ item.nome }}</span>
                                        <h4>{{ parseFloat(item.ratio).toFixed(2) }}%</h4>
                                    </div>
                                    <!--<div class="flex flex-col text-right">
                                <span class="flex -mr-1">
                                    <span class="mr-1">{{ item.comparedResult }}</span>
                                    <feather-icon :icon=" item.comparedResult < 0 ? 'ArrowDownIcon' : 'ArrowUpIcon'"
                                                  :svgClasses="[item.comparedResult < 0 ? 'text-danger' : 'text-success'  ,'stroke-current h-4 w-4 mb-1 mr-1']"></feather-icon>
                                </span>
                                        <span class="text-grey">{{ item.time | time(true) }}</span>
                                    </div>-->
                                </div>
                                <vs-progress :percent="item.ratio"></vs-progress>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>

            <!-- CARD 5: SUPPORT TRACKER -->
            <div class="vx-col w-full md:w-1/3 mb-base">
                <div class="vx-row">
                    <div class="vx-col w-full mb-base">
                        <vx-card title="Meus Tickets">
                            <!-- CARD ACTION -->
                            <template slot="actions">
                                <change-date-dashboard @changeDate="getMeusTickets"></change-date-dashboard>
                            </template>

                            <!-- Chart -->
                            <div slot="no-body">
                                <vue-apex-charts type=radialBar height=420
                                                 :options="chartOptions"
                                                 :series="meusTickets.series"/>
                                <div class="flex justify-center items-center font-bold">
                                    Inseriu
                                    <vs-switch vs-icon-on="check" color="#0FB599" v-model="switchMeusTickets" class="float-right switch mx-3"/>
                                    Atendeu
                                </div>
                            </div>
                            <ul>
                                <li v-for="orderData in meusTickets.analyticsData" :key="orderData.orderType"
                                    class="flex mb-3 justify-between">
                                    <span class="flex items-center">
                                            <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid"
                                                  :class="`border-${orderData.color}`"></span>
                                            <span class="font-semibold">{{ orderData.orderType }}</span>
                                    </span>
                                    <span>{{ orderData.counts }}</span>
                                </li>
                            </ul>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full">
                        <statistics-card-line
                            hideChart
                            class="mb-base"
                            icon="ServerIcon"
                            icon-right
                            statistic="1.2gb"
                            statisticTitle="Memory Usage"
                            color="success"/>
                    </div>
                    <div class="vx-col w-full">
                        <statistics-card-line
                            hideChart
                            icon="ServerIcon"
                            icon-right
                            statistic="1.2gb"
                            statisticTitle="Memory Usage"
                            color="success"/>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full md:w-1/3 mb-base">
                <vx-card>
                    <VuePerfectScrollbar class="scroll-area--data-list-add-new">
                        <div class="vx-row">
                            <div class="vx-col w-6/12">
                                <p>1454</p>
                                <p class="font-bold">Lucimar dos Santos</p>
                                <vs-chip color="primary" class="text-white font-bold p-2 ml-0 mt-1">Pompoarismo</vs-chip>
                            </div>
                            <div class="vx-col w-5/12">
                                <!--                            <vx-tooltip position="top" :text="'Responsável | ' + nameCriador(item)" class="img-criador">-->
                                <!--                                <img src="@/assets/images/util/checkout.svg" width="40px" class="ml-2 rounded-full agente" v-if="item.criador_type == 'App\\Models\\CampanhaCarrinho'">-->
                                <!--                                <img src="@/assets/images/util/boleto.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaBoleto'">-->
                                <!--                                <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaWhatsapp'">-->
                                <!--                                <img src="@/assets/images/util/agendamento.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaAgendamento'">-->
                                <!--                                <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaCancelado'">-->
                                <!--                                <img :src="get_img_api(item.criador.avatar)" v-else width="40px" class="ml-2 rounded-full agente">-->
                                <!--                            </vx-tooltip>-->
                                <!--                            <vx-tooltip position="top" :text="'Atendente | ' + item.atendente.name" style="margin-left: -15px">-->
                                <!--                                <img :src="get_img_api(item.atendente.avatar)" width="40px" class="rounded-full agente">-->
                                <!--                            </vx-tooltip>-->
                            </div>
                            <div class="vx-col w-1/12 flex flex-col items-center justify-center">
                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-warning"></vs-icon>
                            </div>
                            <vs-divider></vs-divider>
                        </div>
                    </VuePerfectScrollbar>
                </vx-card>
            </div>

        </div>

        <div class="vx-row">
            <div class="vx-col w-full">
                <vx-card title="Revenue">

                    <template slot="actions">
                        <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
                    </template>

                    <div slot="no-body" class="p-6 pb-0">

                        <div class="flex" v-if="revenueComparisonLine.analyticsData">
                            <div class="mr-6">
                                <p class="mb-1 font-semibold">This Month</p>
                                <p class="text-3xl text-success"><sup class="text-base mr-1">$</sup>{{ revenueComparisonLine.analyticsData.thisMonth.toLocaleString() }}</p>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Last Month</p>
                                <p class="text-3xl"><sup class="text-base mr-1">$</sup>{{ revenueComparisonLine.analyticsData.lastMonth.toLocaleString() }}</p>
                            </div>
                        </div>

                        <vue-apex-charts
                            type=line
                            height=266
                            :options="analyticsData.revenueComparisonLine.chartOptions"
                            :series="revenueComparisonLine.series"/>
                    </div>
                </vx-card>
            </div>
        </div>

    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from './ui-elements/card/analyticsData.js'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from "@/components/timeline/VxTimeline"
import moduleUsuario from "@/store/usuarios/moduleUsuario";
import moduleDashboard from "@/store/dashboard/moduleDashboard";
import ChangeDateDashboard from '@/views/components/ChangeDateDashboard';

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    data() {
        return {
            checkpointReward: {},
            subscribersGained: {},
            ordersRecevied: {},
            salesBarSession: {},
            supportTracker: {},
            productsOrder: {},
            salesRadar: {},

            timelineData: [
                {
                    color: "primary",
                    icon: "PlusIcon",
                    title: "Client Meeting",
                    desc: "Bonbon macaroon jelly beans gummi bears jelly lollipop apple",
                    time: "25 mins Ago"
                },
                {
                    color: "warning",
                    icon: "MailIcon",
                    title: "Email Newsletter",
                    desc: "Cupcake gummi bears soufflé caramels candy",
                    time: "15 Days Ago"
                },
                {
                    color: "danger",
                    icon: "UsersIcon",
                    title: "Plan Webinar",
                    desc: "Candy ice cream cake. Halvah gummi bears",
                    time: "20 days ago"
                },
                {
                    color: "success",
                    icon: "LayoutIcon",
                    title: "Launch Website",
                    desc: "Candy ice cream cake. Halvah gummi bears Cupcake gummi bears soufflé caramels candy.",
                    time: "25 days ago"
                },
                {
                    color: "primary",
                    icon: "TvIcon",
                    title: "Marketing",
                    desc: "Candy ice cream cake. Halvah gummi bears Cupcake gummi bears.",
                    time: "28 days ago"
                }
            ],


            analyticsData: analyticsData,
            dispatchedOrders: [],
            browserStatistics: [],
            revenueComparisonLine: {},

            //Topo
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            user: {},
            conquistas: [],
            comissoes: {},

            //Venda por Produto
            por_produto: [],
            produtos: [],

            //Meus tickets
            meusTickets: {
                analyticsData: [],
                series: []
            },
            chartOptions: {
                labels: ['Ganhou', 'Aguardando', 'Perdeu'],
                plotOptions: {
                    radialBar: {
                        size: 165,
                        offsetY: -5,
                        hollow: {
                            size: '20%'
                        },
                        track: {
                            background: "#ebebeb",
                            strokeWidth: '100%',
                            margin: 15,
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                fontSize: '18px',
                            },
                            value: {
                                fontSize: '16px',
                                color: "#636a71",
                                offsetY: 11
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                formatter: function(val) {
                                    return 42459
                                }
                            }
                        }
                    },
                },
                responsive: [{
                    breakpoint: 576,
                    options: {
                        plotOptions: {
                            radialBar: {
                                size: 150,
                                hollow: {
                                    size: '20%'
                                },
                                track: {
                                    background: "#ebebeb",
                                    strokeWidth: '100%',
                                    margin: 15,
                                },
                            }
                        }
                    }
                }],
                colors: ['#4DE98A', '#FF9F43', '#EA5455'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        // enabled: true,
                        shade: 'dark',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#65dd91', '#FFC085', '#f29292'],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100]
                    },
                },
                stroke: {
                    lineCap: 'round'
                },
                chart: {
                    height: 355,
                    dropShadow: {
                        enabled: true,
                        blur: 3,
                        left: 1,
                        top: 1,
                        opacity: 0.1
                    },
                }
            },
            switchMeusTickets: false

        }
    },
    components: {
        VueApexCharts,
        StatisticsCardLine,
        ChangeTimeDurationDropdown,
        VxTimeline,
        ChangeDateDashboard
    },
    created() {
        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario)
            moduleUsuario.isRegistered = true
        }

        if (!moduleDashboard.isRegistered) {
            this.$store.registerModule('dashboard', moduleDashboard)
            moduleDashboard.isRegistered = true
        }

        this.getUserInfo(this.userInfo.uid);

        this.$http.get("/api/card/card-analytics/browser-analytics")
            .then((response) => {
                this.browserStatistics = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Revenue Comparison
        this.$http.get("/api/card/card-analytics/revenue-comparison")
            .then((response) => {
                this.revenueComparisonLine = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        //  User Reward Card
        this.$http.get("/api/user/checkpoint-reward")
            .then((response) => {
                this.checkpointReward = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Subscribers gained - Statistics
        this.$http.get("/api/card/card-statistics/subscribers")
            .then((response) => {
                this.subscribersGained = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Orders - Statistics
        this.$http.get("/api/card/card-statistics/orders")
            .then((response) => {
                this.ordersRecevied = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Sales bar - Analytics
        this.$http.get("/api/card/card-analytics/sales/bar")
            .then((response) => {
                this.salesBarSession = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Support Tracker
        this.$http.get("/api/card/card-analytics/support-tracker")
            .then((response) => {
                this.supportTracker = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Products Order
        this.$http.get("/api/card/card-analytics/products-orders")
            .then((response) => {
                this.productsOrder = response.data
                console.log('productsorder', this.productsOrder);
            })
            .catch((error) => {
                console.log(error)
            })

        // Sales Radar
        this.$http.get("/api/card/card-analytics/sales/radar")
            .then((response) => {
                this.salesRadar = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        // Dispatched Orders
        this.$http.get("/api/table/dispatched-orders")
            .then((response) => {
                this.dispatchedOrders = response.data
            })
            .catch((error) => {
                console.log(error)
            })

        //Personalizado
        this.getComissoes();

        this.$store.dispatch('ativarMenu', true);
    },
    methods: {
        getUserInfo(id) {
            this.$vs.loading();
            this.$store.dispatch('users/getId', id).then(response => {
                console.log('resposta', response)
                this.user = response;
            }).finally(() => this.$vs.loading.close());
        },
        nameCriador(obj) {
            switch (obj.criador_type) {
                case 'App\\Models\\User':
                    return obj.criador.name;
                default:
                    return obj.criador.nome;
            }
        },
        getComissoes() {
            this.$store.dispatch('dashboard/comissoes').then(response => {
                console.log('chegou', response);
                this.comissoes = response
                this.getVendaPorProduto();
            });
        },
        getVendaPorProduto(datas = null) {
            if (datas == null) {
                datas = {
                    dt_inicio: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                    dt_fim: moment().format('YYYY-MM-DD'),
                }
            }
            this.produtos = [];
            this.$store.dispatch('dashboard/porProduto', datas).then(response => {
                this.por_produto = response; //armazenando array que já vem agrupado por produto
                this.por_produto.forEach(prod => {
                    this.produtos.push({nome: prod[0].produto.nome, quantidade: prod.length});//salvando cada produto com suas quantidades
                });
                let somaQuantidade = 0;
                this.produtos.forEach(item => {
                    somaQuantidade += item.quantidade;//guarda a soma da quantidade de todas as vendas, independente do produto
                });
                this.produtos.forEach(item => {
                    //calculando a parcela da quantidade de cada produto. Porcentagem de venda = quantidaede do item vendido 8 100 dividido
                    item.ratio = (item.quantidade * 100) / somaQuantidade;
                });
                this.getMeusTickets();
            });
        },
        getMeusTickets(datas = null) {
            if (datas == null) {
                datas = {
                    dt_inicio: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                    dt_fim: moment().format('YYYY-MM-DD'),
                }
            }
            this.$store.dispatch('dashboard/meusTickets', {...datas, type: this.switchMeusTickets ? 'atendimento' : 'inseridor'}).then(response => {
                let soma = 0;
                this.meusTickets = {
                    analyticsData: [],
                    series: []
                }
                if(this.switchMeusTickets){
                    this.chartOptions.colors[2] = '#EA5455';
                    this.chartOptions.fill.gradient.gradientToColors[2] = '#f29292';
                    this.chartOptions.labels = ['Ganhou', 'Aguardando', 'Perdeu'];

                    soma = (response.tickets_aguardando + response.tickets_ganhou + response.tickets_perdeu);
                    this.meusTickets.analyticsData.push({color: 'success', counts: response.tickets_ganhou, orderType: 'Ganhou'});
                    this.meusTickets.analyticsData.push({color: 'warning', counts: response.tickets_aguardando, orderType: 'Aguardando'});
                    this.meusTickets.analyticsData.push({color: 'danger', counts: response.tickets_perdeu, orderType: 'Perdeu'});

                    this.meusTickets.series.push(((response.tickets_ganhou * 100) / soma).toFixed(2));
                    this.meusTickets.series.push(((response.tickets_aguardando * 100) / soma).toFixed(2));
                    this.meusTickets.series.push(((response.tickets_perdeu * 100) / soma).toFixed(2));
                } else {
                    this.chartOptions.colors[2] = '#0c0c0c';
                    this.chartOptions.fill.gradient.gradientToColors[2] = '#353434';
                    this.chartOptions.labels = ['Abertos', 'Pendentes', 'Finalizadas'];

                    soma = (response.tickets_pendentes + response.tickets_abertos + response.tickets_finalizados);
                    this.meusTickets.analyticsData.push({color: 'success', counts: response.tickets_abertos, orderType: 'Abertos'});
                    this.meusTickets.analyticsData.push({color: 'warning', counts: response.tickets_pendentes, orderType: 'Pendentes'});
                    this.meusTickets.analyticsData.push({color: 'dark', counts: response.tickets_finalizados, orderType: 'Finalizados'});

                    this.meusTickets.series.push(((response.tickets_abertos * 100) / soma).toFixed(2));
                    this.meusTickets.series.push(((response.tickets_pendentes * 100) / soma).toFixed(2));
                    this.meusTickets.series.push(((response.tickets_finalizados * 100) / soma).toFixed(2));
                }
            });
        }
    },
    watch: {
        switchMeusTickets(val) {
            this.getMeusTickets();
        }
    }
}
</script>


<style lang="scss">
.row-top-dashboard {
    width: 102%;
    left: 0;
    top: 60px;
    z-index: 2;
}

.card-top-dashboard {
    background: rgb(147, 68, 196);
    background: linear-gradient(90deg, rgba(147, 68, 196, 1) 0%, rgba(94, 44, 124, 1) 72%);
}

/*! rtl:begin:ignore */
#dashboard-analytics {
    .greet-user {
        position: relative;

        .decore-left {
            position: absolute;
            left: 0;
            top: 0;
        }

        .decore-right {
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    @media(max-width: 576px) {
        .decore-left, .decore-right {
            width: 140px;
        }
    }
}

/*! rtl:end:ignore */
</style>
