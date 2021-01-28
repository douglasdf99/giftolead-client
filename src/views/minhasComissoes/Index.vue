<template>
    <div>
        <side-bar v-show="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data.sync="sidebarData" @reload="getItems"/>
        <div class="vx-row flex items-center lg:mt-5 sm:mt-6 justify-between">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large"
                                      placeholder="Pesquisar por usuário"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Comissões {{dados.aba}}</span>
                    <p class="font-bold text-3xl my-5" v-bind:style="{'color' : colorx}">R$ {{formatPrice(soma)}}</p>
                </vx-card>
            </div>
        </div>
        <!--<div class="vx-row flex items-end my-5" v-if="dados.aba == 'aprovadas' || dados.aba == 'comissionadas'">
            <div class="vx-col w-full lg:w-6/12">
                <p>Resultado da busca considerando o período: <span class="destaque">{{dateRange.startDate | formatDate}} a {{dateRange.endDate | formatDate}}</span>
                </p>
            </div>
            <div class="vx-col w-full relative lg:w-6/12 sm:w-1/2 flex justify-end">
                <vs-button color="black" type="flat" @click="setDate('hoje')" class="btn-periodo">Hoje</vs-button>
                <vs-button color="black" type="flat" @click="setDate('7')" class="btn-periodo">7 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('15')" class="btn-periodo">15 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('30')" class="btn-periodo">30 Dias</vs-button>
                <date-range-picker ref="picker" opens="left" :locale-data="localeData" :singleDatePicker="false"
                                   :timePicker="false" :showWeekNumbers="false" :showDropdowns="true" :autoApply="true"
                                   v-model="dateRange" :linkedCalendars="true" :close-on-esc="true"
                                   :append-to-body="true" :ranges="ranges">
                </date-range-picker>
            </div>
        </div>-->
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = '#E7BE00'; getItems('pendentes'); dados.aba = 'pendentes'" color="warning" label="pendentes">
                        <listagem @updateData="updateData" :items="comissoes" :colorx="colorx" :tipo="dados.aba"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = '#9344C4'; getItems('aprovadas'); dados.aba = 'aprovadas'" color="primary" label="aprovadas">
                        <listagemcomi :items="comissoes" :colorx="colorx" :tipo="dados.aba"></listagemcomi>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = '#4DE98A'; getItems('comissionadas'); dados.aba = 'comissionadas'" color="success" label="comissões pagas">
                        <listagemcomi :items="comissoes" :colorx="colorx" :tipo="dados.aba"></listagemcomi>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = '#F03165'; getItems('reprovadas'); dados.aba = 'reprovadas'" color="danger" label="reprovadas">
                        <listagem @updateData="updateData" :items="comissoes" :colorx="colorx" :tipo="dados.aba"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import listagem from './Listagem'
    import listagemcomi from './ListagemComissao'
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleMComissoes from "@/store/minhasComissoes/moduleMComissoes";
    import VueMoment from 'vue-moment';
    import DateRangePicker from 'vue2-daterange-picker'

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Index",
        components: {SideBar, listagem,listagemcomi,
            DateRangePicker,
            VueMoment,
            moment,},
        data() {
            return {
                colorx: '#E7BE00',
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {
                    ticket: {
                        lead: {}
                    }
                },
                routeTitle: 'Brindes',
                dados: {
                    search: null,
                    page: 1,
                    dt_inicio: '',
                    dt_fim: '',
                    tipo: 'pendentes'
                },

                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1,

                lengths: saveleadsConfig.lengths,
                tipoCom: 'pendente',
                selectedUser: {id: null},
                selectedResp: {id: null},
                soma: 0,
                usuarios: [],
                comissoes: [],

                dateRange: {},
                localeData: {
                    direction: 'ltr',
                    format: 'dd/mm/yyyy',
                    separator: ' - ',
                    applyLabel: 'Aplicar',
                    cancelLabel: 'Cancelar',
                    weekLabel: 'M',
                    customRangeLabel: 'Período',
                    daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    firstDay: 0,
                    startDate: '05/26/2020',
                    endDate: '05/26/2020',
                },
                ranges: {
                    //Definindo ranges padronizados
                    'Hoje': [this.getDay(true), this.getDay(true)],
                    'Ontem': [this.getDay(false), this.getDay(false)],
                    'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                    'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                    'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
                }
            }
        },
        created() {
            this.$vs.loading();
            if (!moduleMComissoes.isRegistered) {
                this.$store.registerModule('mcomissoes', moduleMComissoes);
                moduleMComissoes.isRegistered = true;
            }

            this.dateRange.startDate = moment().subtract(30, 'days');
            this.dateRange.endDate = moment();

            this.getItems('pendentes');
        },
        methods: {
            paginate() {
                console.log('resetou');
                this.currentx = 1;
            },
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
                if(!val)
                    this.getItems(this.dados.tipo);
            },
            getItems(tipo = 'pendentes') {
                this.$vs.loading();
                this.dados.tipo = tipo;
                if (this.dateRange.startDate)
                    this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
                if (this.dateRange.endDate)
                    this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');
                this.$store.dispatch('getVarios', {rota: 'comissaos/minhas', params: this.dados}).then(response => {
                    this.$vs.loading.close();
                    this.comissoes = [...response[0].data]
                    this.pagination = response[0];
                    this.soma = parseFloat(response.soma);
                    this.$vs.loading.close();
                });
            },
            pesquisar(e) {
              this.dados.page = 1;
                e.preventDefault();
                this.$vs.loading();
                this.getItems(this.dados.tipo);
            },
            setDate(val) {
                this.$vs.loading();
                switch (val) {
                    case 'hoje':
                        this.dateRange.startDate = moment();
                        break;
                    case '7':
                        this.dateRange.startDate = moment().subtract(7, 'days');
                        break;
                    case '15':
                        this.dateRange.startDate = moment().subtract(15, 'days');
                        break;
                    case '30':
                        this.dateRange.startDate = moment().subtract(30, 'days');
                        break;
                }
                this.getItems(this.dados.tipo);
            },
            getDay(dia) {
                //Definindo datas usadas nos ranges padronizados
                let today = new Date()
                today.setHours(0, 0, 0, 0)

                let yesterday = new Date()
                yesterday.setDate(today.getDate() - 1)
                yesterday.setHours(0, 0, 0, 0);
                return (dia ? today : yesterday)
            },
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getItems(this.dados.tipo);
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle
            },
            dateRange(val) {
                this.$vs.loading();
                this.getItems(this.dados.tipo);
            },
        },
        computed: {
            items() {
                return this.$store.state.items;
            },
            /*pagination() {
                return this.$store.state.pagination;
            },*/
        },

    }
</script>
<style>
    .td-icons > span {
        display: flex;
    }
</style>
