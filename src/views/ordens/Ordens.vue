<template>
    <div>
        <detalhe-comissao v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar"
                          @closeSidebar="toggleDataSidebar"
                          :data="sidebarData" :empresa="empresa"/>
        <div class="vx-row flex items-center lg:mt-5 sm:mt-6 justify-between">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="vx-row flex items-end mb-10">
                    <div class="vx-col w-full lg:w-6/12">
                        <p>Resultado da busca considerando o período: <span
                            class="destaque">{{ dateRange.startDate | formatDate }} a {{ dateRange.endDate | formatDate
                            }}</span>
                        </p>
                    </div>
                  <div class="vx-col w-full relative lg:w-8/12 sm:w-1/2 flex justify-end">
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
                </div>
                <div class="flex items-center">
                    <div class="relative w-full">

                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
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
                    <span class="destaque" v-if="dados.aba === 'pago'">Valor das Ordens Pagas</span>
                    <span class="destaque" v-else>Valor das Ordens Pendentes</span>
                    <p class="font-bold text-3xl my-5"
                       v-bind:class="{'text-warning' : !dados.pago, 'text-success' : dados.pago}">R$
                        {{ formatPrice(soma) }}</p>
                </vx-card>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems(0); dados.aba = 'pagar'" color="warning" value="10"
                            :label="'pendentes' + ( dados.aba === 'pagar' ? ` (${ordens.length})` : '')">
                        <listagem :items="ordens" @action="action" @visualizar="visualizar" tipo="pagar"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems(1); dados.aba = 'pago'" color="success"
                            :label="'pagas' + ( dados.aba === 'pago' ? ` (${ordens.length})` : '')">
                        <listagem :items="ordens" @action="action" @visualizar="visualizar" tipo="pago"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import DetalheComissao from '../ordens/DetalheOrdem';
import listagem from './Listagem';
import vSelect from 'vue-select';
import saveleadsConfig from "../../../saveleadsConfig";
import moduleOrdens from "../../store/ordens/moduleOrdens";
import Datepicker from 'vuejs-datepicker';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

import VueMoment from 'vue-moment';
import SideBar from "@/views/transacoes/SideBar";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "Ordens",
    components: {
        DetalheComissao, listagem, 'v-select': vSelect,
        Datepicker,
        VueMoment,
        moment,
        DateRangePicker,
        SideBar
    },
    data() {
        return {
            colorx: 'warning',

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            empresa: {},

            search: '',
            dados: {
                search: '',
                page: 1,
                length: 25,
                aba: 'pagar',
                pago: 0
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            lengths: saveleadsConfig.lengths,
            currentx: 1,
            ordens: [],
            tipoCom: 'pendente',
            soma: 0,
            dt_inicio: '',
            dt_fim: '',
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
        };
    },
    created() {
        this.$vs.loading();
        if (!moduleOrdens.isRegistered) {
            this.$store.registerModule('ordens', moduleOrdens);
            moduleOrdens.isRegistered = true;
        }

        this.dt_inicio = '';
        this.dt_fim = '';
        this.dateRange.startDate = '';
        this.dateRange.endDate = '';

        this.getItems(0);
    },
    methods: {
        getDay(dia) {
            //Definindo datas usadas nos ranges padronizados
            let today = new Date();
            today.setHours(0, 0, 0, 0);

            let yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            return (dia ? today : yesterday);
        },
        setDate(val) {
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
            this.getItems();
        },
        addNewData() {
            this.sidebarData = {};
            this.toggleDataSidebar(true);
        },
        updateData(obj) {
            this.sidebarData = obj;
            this.toggleDataSidebar(true);
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val;
        },
        getItems(pago = this.dados.pago) {
            if(pago !== this.dados.pago)
                this.currentx = 1;

            this.dados.pago = pago;
            this.$vs.loading();

            let url = '';
            let control = 0;//Controla entradas em cada condição
            if (this.search !== '') {
                url += 'name:' + this.search + ';';
                url += 'email:' + this.search;
                control++;
            }
            if (this.dateRange.startDate)
                this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
            if (this.dateRange.endDate)
                this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

            if (control >= 2)
                url += '&searchJoin=and';

            this.dados.search = url;

            this.$store.dispatch('ordens/getOrdens', this.dados).then(response => {
                this.ordens = [...response[0].data];
                this.pagination = response[0];
                this.empresa = response.empresa;
                this.soma = parseFloat(response.soma);
                //this.dados.page = this.pagination.current_page
                this.$vs.loading.close();
            });
        },
        pesquisar(e) {
            this.dados.page = 1;
            e.preventDefault();
            this.$vs.loading();
            this.getItems(this.dados.pago);
        },
        visualizar(obj) {
            this.sidebarData = obj;
            this.toggleDataSidebar(true);
        },
        action(obj) {
            let ids = obj.ids.map(item => {
                return item.id;
            });
            this.$vs.loading();
            this.$store.dispatch('ordens/' + obj.method, ids).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'Operação realizada com sucesso.'
                });
                this.getItems(this.dados.pago);
            });
        }
    },
    watch: {
        currentx() {
            this.$vs.loading();
            this.dados.page = this.currentx;
            this.getItems();
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle;
        },
        selectedUser() {
            this.$vs.loading();
            this.dados.page = 1;
            this.getItems();
        },
        selectedResp() {
            this.$vs.loading();
            this.dados.page = 1;
            this.getItems();
        },
        dados: {
            handler(val) {
                if (val.length != this.pagination.per_page) {
                    this.dados.page = 1;
                    this.$vs.loading();
                    this.getItems();
                }
            },
            deep: true
        },
    },
    mounted() {
    },
    computed: {
        items() {
            return this.$store.state.items;
        },
        /*pagination() {
            return this.$store.state.pagination;
        },*/
    },

};
</script>
