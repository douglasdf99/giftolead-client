<template>
    <div class="vx-row flex items-center mb-5">
        <div class="vx-col w-full lg:w-6/12">
            <p>Resultado da busca considerando o período: <span
                class="destaque">{{ dateRange.startDate | formatDate }} a {{ dateRange.endDate | formatDate
                }}</span>
            </p>
        </div>
        <div class="vx-col w-full relative lg:w-6/12 sm:w-1/2 flex justify-end">
            <vs-button color="black" type="flat" @click="setDate('hoje')"
                       :class="`btn-periodo ${this.dados.daysInterval === 'hoje' ? 'active' : ''}`">Hoje
            </vs-button>
            <vs-button color="black" type="flat" @click="setDate('7')"
                       :class="`btn-periodo ${this.dados.daysInterval === '7' ? 'active' : ''}`">7 Dias
            </vs-button>
            <vs-button color="black" type="flat" @click="setDate('15')"
                       :class="`btn-periodo ${this.dados.daysInterval === '15' ? 'active' : ''}`">15 Dias
            </vs-button>
            <vs-button color="black" type="flat" @click="setDate('30')"
                       :class="`btn-periodo ${this.dados.daysInterval === '30' ? 'active' : ''}`">30 Dias
            </vs-button>
            <date-range-picker ref="picker" opens="left" :locale-data="saveleadsConfig.localeData"
                               :singleDatePicker="false" :maxDate="maxDate"
                               :timePicker="false" :showWeekNumbers="false" :showDropdowns="true" :autoApply="true"
                               v-model="dateRange" :linkedCalendars="true" :close-on-esc="true"
                               :append-to-body="true" :ranges="ranges">
            </date-range-picker>
        </div>
        <div :class="`vx-col w-full my-5 ${$route.name === 'relatorio-usuario' ? 'lg:w-1/2' : ''}`">
            <label for="prs" class="font-bold">Filtrar Produtos</label>
            <v-select id="prs" multiple :closeOnSelect="false" v-model="selectedProducts"
                      class="select-large-base bg-white" :options="products"/>
        </div>
        <div class="vx-col w-full lg:w-1/2 my-5" v-if="$route.name === 'relatorio-usuario'">
            <label for="userss" class="font-bold">Filtrar Usuários</label>
            <v-select id="userss" multiple :closeOnSelect="false" v-model="selectedUsers"
                      class="select-large-base bg-white" :options="users"/>
        </div>
    </div>
</template>

<script>
import saveleadsConfig from "../../../saveleadsConfig";
import Datepicker from 'vuejs-datepicker';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import vSelect from 'vue-select';
import moduleProdutos from "../../store/produtos/moduleProdutos";
import moduleRelatorios from "../../store/relatorios/moduleRelatorios";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "rel-header",
    components: {
        Datepicker, DateRangePicker, moment, vSelect
    },
    props: ['data'],
    data() {
        return {
            dados: {
                route: 'relatorio-vendas',
                dt_inicio: '',
                dt_fim: '',
                produtos: [],
                daysInterval: 7
            },
            dateRange: {},
            ranges: {
                //Definindo ranges padronizados
                'Hoje': [this.getDay(true), this.getDay(true)],
                'Ontem': [this.getDay(false), this.getDay(false)],
                'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                // 'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                // 'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
            },
            products: [
                {id: null, label: 'Carregando...'}
            ],
            selectedProducts: [],
            users: [
                {id: null, label: 'Carregando...'}
            ],
            selectedUsers: [],
            filterRequestCount: 0,
            saveleadsConfig,
            maxDate: moment().add(1, 'days').format('YYYY-MM-DD')
        };
    },
    created() {
        if (!moduleRelatorios.isRegistered) {
            this.$store.registerModule('relatorios', moduleRelatorios);
            moduleRelatorios.isRegistered = true;
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos);
            moduleProdutos.isRegistered = true;
        }

        this.dateRange.startDate = moment().subtract(this.dados.daysInterval, 'days');
        this.dateRange.endDate = moment();
        this.dados = {...this.data};
    },
    async mounted() {
        await this.get();
        await this.getOptions();
    },
    methods: {
        get() {
            this.$vs.loading();
            if (this.dateRange.startDate)
                this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
            if (this.dateRange.endDate)
                this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

            this.$store.dispatch('relatorios/get', this.dados).then(() => {
                this.$emit('animate');
                if(this.$route.name === 'relatorio-usuario') {
                    this.users = this.$store.state.relatorios.vendas.grafico.users;
                }
            }).finally(() => {
                this.$store.commit('relatorios/SET_LOADING', false);
                this.$vs.loading.close();
                this.filterRequestCount = 0;
            });
        },
        getOptions() {
            this.$store.dispatch('produtos/getArraySelect')
                .then(response => this.products = response);
        },
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
            this.dados.daysInterval = val;
            this.get();
        },
        filtrar() {
            setTimeout(() => {
                if (this.filterRequestCount === 0) {
                    this.filterRequestCount++;
                    if (this.selectedProducts.length > 0)
                        this.dados.produtos = this.selectedProducts.map(prod => prod.id);
                    else this.dados.produtos = [];

                    if (this.selectedUsers.length > 0)
                        this.dados.usuarios = this.selectedUsers.map(prod => prod.id);
                    else this.dados.usuarios = [];

                    this.get();
                }
            }, 1000);
        }
    },
    watch: {
        selectedProducts() {
            setTimeout(() => {
                this.filtrar();
            }, 2000);
        },
        selectedUsers() {
            setTimeout(() => {
                this.filtrar();
            }, 2000);
        },
        dateRange({startDate, endDate}) {
            let start = moment(startDate);
            let end = moment(endDate);
            let diff = start.diff(end, 'days');
            if(diff <= -60) {
                this.$vs.notify({
                    title: '',
                    text: 'O intervalo entre as datas deve ser de, no máximo, 60 dias',
                    iconPack: 'feather',
                    icon: 'icon-close',
                    color: 'danger',
                    time: 5000
                });
            } else {
                this.$vs.loading();
                this.get();
            }
        }
    }
};
</script>

<style scoped>

</style>
