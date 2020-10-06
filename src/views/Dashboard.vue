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
        <!-- Topo -->
        <div class="vx-row absolute row-top-dashboard">
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
                        <div class="vx-col w-7/12" v-if="user.conquistas.length > 0">
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
            <div class="vx-col w-full md:w-1/3 mb-base">
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <place-holder-loading-dashboard tipo="comissoes" v-if="comissoes.length == 0"/>
                        <vx-card v-else>
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
                        <place-holder-loading-dashboard tipo="produtos" v-if="!por_produto_pesquisado"/>
                        <vx-card :title="produtos.length > 0 ? 'Venda por produto' : 'Nenhuma venda encontrada'" class="mt-base" v-show="por_produto_pesquisado">
                            <template slot="actions">
                                <change-date-dashboard @changeDate="getVendaPorProduto"></change-date-dashboard>
                            </template>
                            <div v-for="(item, index) in produtos" :key="index" :class="{'mt-4': index}" v-if="produtos.length > 0">
                                <div class="flex justify-between">
                                    <div class="flex flex-col">
                                        <span class="mb-1">{{ item.nome }}</span>
                                        <h4>{{ parseFloat(item.ratio).toFixed(2) }}%</h4>
                                    </div>
                                </div>
                                <vs-progress :percent="item.ratio"></vs-progress>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>

            <div class="vx-col w-full md:w-1/3 mb-base">
                <div class="vx-row">
                    <!-- Meus Tickets -->
                    <div class="vx-col w-full mb-base">
                        <place-holder-loading-dashboard tipo="meus_tickets" v-if="meus_tickets.analyticsData.length == 0"/>
                        <vx-card v-else :title="'Meus tickets ' + (tipo_meus_tickets == 'atendimento' ? 'atendidos' : 'inseridos')">
                            <!-- CARD ACTION -->
                            <template slot="actions" class="flex items-center">
                                <vs-dropdown vs-trigger-click class="cursor-pointer">
                                    <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey mr-4"></feather-icon>
                                    <vs-dropdown-menu class="w-32">
                                        <vs-dropdown-item @click="tipo_meus_tickets = 'atendimento'">Atendidos</vs-dropdown-item>
                                        <vs-dropdown-item @click="tipo_meus_tickets = 'inseridor'">Inseridos</vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                                <change-date-dashboard @changeDate="getMeusTickets"></change-date-dashboard>
                            </template>

                            <!-- Chart -->
                            <div slot="no-body">
                                <vue-apex-charts type=radialBar height=420
                                                 :options="chart_options"
                                                 :series="meus_tickets.series"/>
                            </div>
                            <ul>
                                <li v-for="orderData in meus_tickets.analyticsData" :key="orderData.orderType"
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
                    <!-- Tickets Atrasados -->
                    <div class="vx-col w-full">
                        <place-holder-loading-dashboard v-if="qtdAtrasados == null" tipo="whatsapplist"/>
                        <statistics-card-line hideChart class="mb-base" chart-data="" icon="ClockIcon" v-else
                                              icon-right :statistic="qtdAtrasados" statisticTitle="Tickets Atrasados" color="danger"/>
                    </div>

                    <!-- Whatslist atendidos -->
                    <div class="vx-col w-full">
                        <place-holder-loading-dashboard v-if="qtdWhats == null" tipo="whatsapplist"/>
                        <statistics-card-line v-else hideChart icon="SmartphoneIcon" icon-right :statistic="qtdWhats"
                                              statisticTitle="WhatsappLists Respondidos" color="success"/>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full md:w-1/3 mb-base">
                <VuePerfectScrollbar class="scroll-area--data-list-add-new">
                    <place-holder-loading-dashboard tipo="ultimos_tickets" v-if="!ultimos_tickets_esquisados"/>
                    <vx-card v-for="item in ultimos_tickets" class="mb-base" v-else style="width: 96%">
                        <div class="vx-row mb-4">
                            <div class="vx-col w-3/12">
                                <p class="text-lg mb-3">#{{ item.id }}</p>
                                <div class="flex items-center text-center">
                                    <vx-tooltip position="top" :text="'Responsável | ' + nameCauser(item.responsavel, item.responsavel_type)" v-if="item.responsavel != null">
                                        <img src="@/assets/images/util/checkout.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-if="item.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                                        <img src="@/assets/images/util/boleto.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.responsavel_type == 'App\\Models\\CampanhaBoleto'">
                                        <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
                                        <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.responsavel_type == 'App\\Models\\Whatsapplist'">
                                        <img src="@/assets/images/util/agendamento.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
                                        <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.responsavel_type == 'App\\Models\\CampanhaCancelado'">
                                        <img :src="get_img_api(item.responsavel.avatar)" v-else width="40px" class="ml-2 rounded-full agente">
                                    </vx-tooltip>
                                    <vx-tooltip position="top" :text="'Última Ação | ' + nameCauser(item.ultima_acao)" style="margin-left: -15px" class="img-criador">
                                        <img src="@/assets/images/util/checkout.svg" width="40px" class="ml-2 rounded-full agente" v-if="item.ultima_acao.causer_type == 'App\\Models\\CampanhaCarrinho'">
                                        <img src="@/assets/images/util/boleto.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.ultima_acao.causer_type == 'App\\Models\\CampanhaBoleto'">
                                        <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.ultima_acao.causer_type == 'App\\Models\\CampanhaWhatsapp'">
                                        <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.ultima_acao.causer_type == 'App\\Models\\Whatsapplist'">
                                        <img src="@/assets/images/util/agendamento.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.ultima_acao.causer_type == 'App\\Models\\CampanhaAgendamento'">
                                        <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente"
                                             v-else-if="item.ultima_acao.causer_type == 'App\\Models\\CampanhaCancelado'">
                                        <img :src="get_img_api(item.ultima_acao.causer.avatar)" v-else width="40px" class="ml-2 rounded-full agente">
                                    </vx-tooltip>
                                </div>
                            </div>
                            <div class="vx-col w-7/12">
                                <p class="font-bold">{{ item.lead.nome }}</p>
                                <vs-chip color="primary" class="text-white font-bold p-2 pr-4 mt-1">{{ item.produto.nome }}</vs-chip>
                            </div>
                            <div class="vx-col w-1/12">
                                <p class="mb-3">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande"
                                             :class="`text-${(item.status == 0 || item.status == 3) ? 'success' : item.status == 1 ? 'warning' : 'dark'}`"></vs-icon>
                                </p>
                            </div>
                        </div>
                        <div class="vx-row p-2" style="background-color: #f4f4f4">
                            <div class="vx-col w-full">
                                <p class="text-sm">{{ elapsedTime(item.ultima_acao.created_at) }}</p>
                                <p class="text-lg">{{ item.ultima_acao.description }}</p>
                            </div>
                        </div>
                    </vx-card>
                    <div class="text-center" v-if="this.paginationUltimos && this.paginationUltimos.current_page < this.paginationUltimos.last_page">
                        <p class="font-bold text-primary text-lg cursor-pointer" @click="loadMoreTicket">Carregar mais...</p>
                    </div>
                </VuePerfectScrollbar>
            </div>

        </div>

        <div class="vx-row">
            <div class="vx-col w-full">
                <place-holder-loading-dashboard v-if="this.chart_media_options.xaxis.categories.length == 0" tipo="media"/>
                <vx-card v-if="this.chart_media_options.xaxis.categories.length > 0"
                         :title="`Tickets ${tipo_media_mensal == 'atendimentos' ? 'Atendidos' : 'Inseridos'} - Comparativo Mensal`">
                    <template slot="actions">
                        <vs-dropdown vs-trigger-click class="cursor-pointer">
                            <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey mr-4"></feather-icon>
                            <vs-dropdown-menu class="w-32">
                                <vs-dropdown-item @click="tipo_media_mensal = 'atendimentos'">Atendidos</vs-dropdown-item>
                                <vs-dropdown-item @click="tipo_media_mensal = 'inseridos'">Inseridos</vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </template>
                    <div slot="no-body" class="p-6 pb-0">
                        <div class="flex">
                            <div class="mr-6">
                                <p class="mb-1 font-semibold">Esse mês</p>
                                <p class="text-3xl" :style="{'color' : '#F97794'}">{{ media_tickets.analyticsData.thisMonth.toLocaleString() }}</p>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Mês passado</p>
                                <p class="text-3xl">{{ media_tickets.analyticsData.lastMonth.toLocaleString() }}</p>
                            </div>
                        </div>
                        <vue-apex-charts type=line height=266 :options="chart_media_options" :series="media_tickets.series"/>
                    </div>
                </vx-card>
            </div>
        </div>

    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from "@/components/timeline/VxTimeline"
import moduleUsuario from "@/store/usuarios/moduleUsuario";
import moduleDashboard from "@/store/dashboard/moduleDashboard";
import ChangeDateDashboard from '@/views/components/ChangeDateDashboard';
import PlaceHolderLoadingDashboard from "@/views/components/PlaceHolderLoadingDashboard";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    data() {
        return {
            //Topo
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            user: {
                conquistas: []
            },
            conquistas: [],
            comissoes: [],

            //Venda por Produto
            por_produto: [],
            produtos: [],
            por_produto_pesquisado: false,

            //Meus tickets
            meus_tickets: {
                analyticsData: [],
                series: []
            },
            chart_options: {
                labels: ['Perdeu', 'Aguardando', 'Ganhou'],
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
                                formatter: this.somaTickets
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
                colors: ['#EA5455', '#FF9F43', '#4DE98A'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        // enabled: true,
                        shade: 'dark',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#f29292', '#FFC085', '#65dd91'],
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
            tipo_meus_tickets: 'atendimento',

            //Últimos Tickets
            ultimos_tickets: [],
            ultimos_tickets_esquisados: false,
            paginationUltimos: null,

            //Média Mensagel
            media_tickets: {
                analyticsData: {
                    thisMonth: 0,
                    lastMonth: 0
                },
                series: [
                    {name: 'Este mês', data: []},
                    {name: 'Mês passado', data: []},
                ]
            },
            chart_media_options: {
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
                    dashArray: [0, 8],
                    width: [4, 2],
                },
                grid: {
                    borderColor: '#e7e7e7',
                },
                legend: {
                    show: false,
                },
                colors: ['#F97794', '#b8c2cc'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        inverseColors: false,
                        gradientToColors: ['#7367F0', '#b8c2cc'],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100]
                    },
                },
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
            tipo_media_mensal: 'atendimentos',

            //Quantidades
            qtdWhats: null,
            qtdAtrasados: null,
        }
    },
    components: {VueApexCharts, VuePerfectScrollbar, StatisticsCardLine, ChangeTimeDurationDropdown, VxTimeline, ChangeDateDashboard, PlaceHolderLoadingDashboard},
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

        var self = this;

        async function init() {
            await self.getComissoes();
            await self.getVendaPorProduto();
            await self.getMeusTickets();
            await self.getTicketsAtrasados();
            await self.getWhatsList();
            await self.getUltimosTickets();
            await self.getMediaMensal();
        }

        init();

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
        nameCauser(obj, responsavel_type = null) {
            if (obj.causer_type) {
                switch (obj.causer_type) {
                    case 'App\\Models\\User':
                        return obj.causer.name;
                    default:
                        return obj.causer.nome;
                }
            } else if (responsavel_type) {
                switch (responsavel_type) {
                    case 'App\\Models\\User':
                        return obj.name;
                    default:
                        return obj.nome;
                }
            }
        },
        getComissoes() {
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'comissaos', params: {}}).then(response => {
                    console.log('chegou', response);
                    this.comissoes = response;
                    resolve();
                });
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
            this.por_produto_pesquisado = false;
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'dados_venda_por_produto', params: datas}).then(response => {
                    this.por_produto = response; //armazenando array que já vem agrupado por produto
                    this.por_produto_pesquisado = true;
                    if (this.por_produto.length > 0) {
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
                    }
                    resolve();
                });
            });
        },
        getMeusTickets(datas = null) {
            if (datas == null) {
                datas = {
                    dt_inicio: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                    dt_fim: moment().format('YYYY-MM-DD'),
                }
            }
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'meus_tickets', params: {...datas, type: this.tipo_meus_tickets}}).then(response => {
                    let soma = 0;
                    this.meus_tickets = {
                        analyticsData: [],
                        series: []
                    }
                    if (this.tipo_meus_tickets == 'atendimento') {
                        this.chart_options.colors[0] = '#EA5455';
                        this.chart_options.fill.gradient.gradientToColors[0] = '#f29292';
                        this.chart_options.labels = ['Perdeu', 'Aguardando', 'Ganhou'];

                        soma = (response.tickets_aguardando + response.tickets_ganhou + response.tickets_perdeu);
                        this.meus_tickets.analyticsData.push({color: 'danger', counts: response.tickets_perdeu, orderType: 'Perdeu'});
                        this.meus_tickets.analyticsData.push({color: 'warning', counts: response.tickets_aguardando, orderType: 'Aguardando'});
                        this.meus_tickets.analyticsData.push({color: 'success', counts: response.tickets_ganhou, orderType: 'Ganhou'});

                        this.meus_tickets.series.push(((response.tickets_perdeu * 100) / soma).toFixed(2));
                        this.meus_tickets.series.push(((response.tickets_aguardando * 100) / soma).toFixed(2));
                        this.meus_tickets.series.push(((response.tickets_ganhou * 100) / soma).toFixed(2));
                    } else {
                        this.chart_options.colors[0] = '#0c0c0c';
                        this.chart_options.fill.gradient.gradientToColors[0] = '#353434';
                        this.chart_options.labels = ['Finalizadas', 'Pendentes', 'Abertas'];

                        soma = (response.tickets_pendentes + response.tickets_abertos + response.tickets_finalizados);
                        this.meus_tickets.analyticsData.push({color: 'dark', counts: response.tickets_finalizados, orderType: 'Finalizados'});
                        this.meus_tickets.analyticsData.push({color: 'warning', counts: response.tickets_pendentes, orderType: 'Pendentes'});
                        this.meus_tickets.analyticsData.push({color: 'success', counts: response.tickets_abertos, orderType: 'Abertos'});

                        this.meus_tickets.series.push(((response.tickets_finalizados * 100) / soma).toFixed(2));
                        this.meus_tickets.series.push(((response.tickets_pendentes * 100) / soma).toFixed(2));
                        this.meus_tickets.series.push(((response.tickets_abertos * 100) / soma).toFixed(2));
                    }
                    resolve()
                });
            });
        },
        getTicketsAtrasados() {
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'tickets_atrasados', params: {}}).then(response => {
                    this.qtdAtrasados = response;
                    resolve()
                });
            });
        },
        getWhatsList() {
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'whatsapplist_respondidos', params: {}}).then(response => {
                    this.qtdWhats = response;
                    resolve();
                });
            });
        },
        getUltimosTickets(page = 1) {
            this.ultimos_tickets_esquisados = false;
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: 'meus_tickets_atividades', params: {page: page}}).then(response => {
                    this.ultimos_tickets = response.data;
                    this.paginationUltimos = response;
                    this.ultimos_tickets_esquisados = true;
                    resolve()
                });
            });
        },
        getMediaMensal(rota = 'atendimentos') {
            let datas = {
                dt_inicio: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                dt_fim: moment().format('YYYY-MM-DD'),
            }
            this.media_tickets.series[0].data = [];
            this.media_tickets.series[1].data = [];
            this.media_tickets.analyticsData.thisMonth = 0;
            this.media_tickets.analyticsData.lastMonth = 0;
            return new Promise(resolve => {
                this.$store.dispatch('dashboard/getData', {rota: this.tipo_media_mensal, params: datas}).then(response => {
                    response.periodo_anterior.forEach(item => {
                        this.media_tickets.analyticsData.lastMonth += item.quantidade;
                        this.media_tickets.series[1].data.push(item.quantidade);
                    });
                    response.periodo_atual.forEach((item, index) => {
                        this.media_tickets.analyticsData.thisMonth += item.quantidade;
                        this.media_tickets.series[0].data.push(item.quantidade);
                        this.chart_media_options.xaxis.categories.push(item.dia);
                    });
                    console.log('dados', this.media_tickets.series[0], this.chart_media_options)
                    resolve()
                });
            });
        },
        somaTickets() {
            let soma = 0;
            this.meus_tickets.analyticsData.forEach(item => {
                soma += item.counts;
            })
            return soma
        },
        loadMoreTicket() {
            if (this.paginationUltimos.current_page < this.paginationUltimos.last_page) {
                let page = this.paginationUltimos.current_page + 1;
                this.$store.dispatch('dashboard/getData', {rota: 'meus_tickets_atividades', params: {page: page}}).then(response => {
                    response.data.forEach(item => {
                        this.ultimos_tickets.push(item);
                    })
                    this.paginationUltimos = response;
                })
            }
        }
    },
    watch: {
        tipo_meus_tickets() {
            let datas = {
                dt_inicio: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                dt_fim: moment().format('YYYY-MM-DD'),
            }
            this.getMeusTickets(datas);
        },
        tipo_media_mensal() {
            this.chart_media_options.xaxis.categories = [];
            this.media_tickets.series[0].data = [];
            this.media_tickets.series[1].data = [];
            this.media_tickets.analyticsData.thisMonth = 0;
            this.media_tickets.analyticsData.lastMonth = 0;
            this.getMediaMensal();
        },
        userInfo() {
            this.getUserInfo(this.userInfo.id);
        }
    }
}
</script>


<style lang="scss">
@import "node_modules/placeholder-loading/src/scss/placeholder-loading.scss";

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
<style scoped>
.scroll-area--data-list-add-new {
    /*/ /height: calc(var(--vh, 1 vh) * 100 - 4.3 rem);*/
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - -45px);
}

::-webkit-scrollbar-track {
    z-index: 5000;
}

/* Handle */
::-webkit-scrollbar-thumb {
    z-index: 5000;
}
</style>