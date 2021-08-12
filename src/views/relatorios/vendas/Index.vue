<template>
    <div>
        <div class="vx-row flex items-center mb-5">
            <div class="vx-col w-full lg:w-6/12">
                <p>Resultado da busca considerando o período: <span
                    class="destaque">{{ dateRange.startDate | formatDate }} a {{ dateRange.endDate | formatDate
                    }}</span>
                </p>
            </div>
            <div class="vx-col w-full relative lg:w-6/12 sm:w-1/2 flex justify-end">
                <vs-button color="black" type="flat" @click="setDate('hoje')" :class="`btn-periodo ${this.dados.daysInterval === 'hoje' ? 'active' : ''}`">Hoje</vs-button>
                <vs-button color="black" type="flat" @click="setDate('7')" :class="`btn-periodo ${this.dados.daysInterval === '7' ? 'active' : ''}`">7 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('15')" :class="`btn-periodo ${this.dados.daysInterval === '15' ? 'active' : ''}`">15 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('30')" :class="`btn-periodo ${this.dados.daysInterval === '30' ? 'active' : ''}`">30 Dias</vs-button>
                <date-range-picker ref="picker" opens="left" :locale-data="saveleadsConfig.localeData"
                                   :singleDatePicker="false"
                                   :timePicker="false" :showWeekNumbers="false" :showDropdowns="true" :autoApply="true"
                                   v-model="dateRange" :linkedCalendars="true" :close-on-esc="true"
                                   :append-to-body="true" :ranges="ranges">
                </date-range-picker>
            </div>
            <div class="vx-col w-full my-5">
                <label for="produtos" class="font-bold">Filtrar produtos</label>
                <v-select id="produtos" multiple :closeOnSelect="false" v-model="produtosSelected"
                          class="select-large-base bg-white" :options="produtos"/>
            </div>
        </div>
        <div class="vx-row mb-base">
            <div class="vx-col w-full vs-con-loading__container" id="relatorio-line-chart">
                <LineChart v-if="!loading.vendas"/>
                <vx-card title="Overview" class="card-overlay w-full h-75 relative" v-else>
                    <div style="height: 30vh" class="py-5 w-full rounded-lg relative flex items-center justify-center"/>
                </vx-card>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <h4 class="my-base">Valor Coorecuperado</h4>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" custom-icon="agendamento"
                                        :statistic="statisticCardValue(statistics.coorecuperados.agendamento)"
                                        statisticTitle="Agendamento" color="success"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" custom-icon="boleto"
                                        :statistic="statisticCardValue(statistics.coorecuperados.boleto)"
                                        statisticTitle="Boleto" color="primary"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" custom-icon="cancelado"
                                        :statistic="statisticCardValue(statistics.coorecuperados.cancelado)"
                                        statisticTitle="Cancelado" color="danger"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" custom-icon="checkout"
                                        :statistic="statisticCardValue(statistics.coorecuperados.checkout)"
                                        statisticTitle="Carrinho" color="danger"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" custom-icon="whatsapp"
                                        :statistic="statisticCardValue(statistics.coorecuperados.whatsapp)"
                                        statisticTitle="WhatsappList" color="danger"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" icon="LinkIcon"
                                        :statistic="statisticCardValue(statistics.coorecuperados.link)"
                                        statisticTitle="Link" color="primary"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" icon="UserIcon"
                                        :statistic="statisticCardValue(statistics.coorecuperados.user)"
                                        statisticTitle="Usuário do Sistema" color="primary"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <h4 class="my-base">Valores recuperados automaticamente pelo sistema</h4>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" icon="DollarSignIcon"
                                        :statistic="statisticCardValue(statistics.automaticas.boleto)"
                                        statisticTitle="Boleto" color="success"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" icon="DollarSignIcon"
                                        :statistic="statisticCardValue(statistics.automaticas.carrinho)"
                                        statisticTitle="Carrinho" color="success"/>
            </div>
            <div class="vx-col w-1/2 lg:w-1/5">
                <custom-statistics-card hideChart class="mb-base" icon="LinkIcon"
                                        :statistic="statisticCardValue(statistics.automaticas.colaborador)"
                                        statisticTitle="Link do Colaborador" color="success"/>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "./LineChart";
import CustomStatisticsCard from './CustomStatisticsCard'
import moduleRelatorios from "../../../store/relatorios/moduleRelatorios";
import saveleadsConfig from "../../../../saveleadsConfig";
import Datepicker from 'vuejs-datepicker';
import * as lang from 'vuejs-datepicker/src/locale';
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import gsap from 'gsap'
import Multiselect from 'vue-multiselect'
import vSelect from 'vue-select'
import moduleProdutos from "../../../store/produtos/moduleProdutos";

const moment = require('moment/moment');

require('moment/locale/pt-br');

export default {
    name: "Index",
    components: {LineChart, CustomStatisticsCard, Datepicker, DateRangePicker, moment, Multiselect, vSelect},
    data() {
        return {
            dados: {
                route: 'relatoriovendas',
                dt_inicio: '',
                dt_fim: '',
                produtos: [],
                daysInterval: 7
            },
            dateRange: {},
            //Statistics só existe para a animação ser aplicada corretamente
            statistics: {
                automaticas: {
                    boleto: 0,
                    carrinho: 0,
                    colaborador: 0
                },
                coorecuperados: {
                    agendamento: 0,
                    boleto: 0,
                    cancelado: 0,
                    checkout: 0,
                    whatsapp: 0,
                    link: 0,
                    user: 0,
                }
            },
            filterRequestCount: 0,
            produtos: [
                {id: null, label: 'Carregando...'}
            ],
            produtosSelected: [],
            ranges: {
                //Definindo ranges padronizados
                'Hoje': [this.getDay(true), this.getDay(true)],
                'Ontem': [this.getDay(false), this.getDay(false)],
                'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
            },
            saveleadsConfig
        }
    },
    created() {
        if (!moduleRelatorios.isRegistered) {
            this.$store.registerModule('relatorios', moduleRelatorios)
            moduleRelatorios.isRegistered = true
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos)
            moduleProdutos.isRegistered = true
        }

        this.dateRange.startDate = moment().subtract(this.dados.daysInterval, 'days')
        this.dateRange.endDate = moment()
    },
    async mounted() {
        await this.getProductSales()
        await this.getProdutos()
    },
    methods: {
        getProductSales() {
            this.$vs.loading({
                color: 'red',
                container: "#relatorio-line-chart",
                scale: 0.6
            })
            if (this.dateRange.startDate)
                this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
            if (this.dateRange.endDate)
                this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

            this.$store.dispatch('relatorios/get', this.dados).then(() => {
                this.animateStatisticNumbers()
            }).finally(() => {
                this.$store.commit('relatorios/SET_LOADING', {vendas: false})
                this.$vs.loading.close("#relatorio-line-chart > .con-vs-loading")
                this.$vs.loading.close()
                this.filterRequestCount = 0
            })
        },
        getProdutos() {
            this.$store.dispatch('produtos/getArraySelect')
                .then(response => this.produtos = response)
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
            this.dados.daysInterval = val
            this.getProductSales();
        },
        statisticCardValue(val) {
            if (val && val != undefined)
                return val > 999 ? (val / 1000).toFixed(2) + 'k' : parseFloat(val).toFixed(2);
            else return 0
        },
        animateStatisticNumbers() {
            let duration = 4.5

            gsap.to(this.statistics.automaticas, {
                duration, carrinho: this.automaticas.carrinho,
                boleto: this.automaticas.boleto, colaborador: this.automaticas.colaborador
            })
            gsap.to(this.statistics.coorecuperados, {
                duration, carrinho: this.coorecuperados.carrinho,
                boleto: this.coorecuperados.boleto, whatsapp: this.coorecuperados.whatsapp,
                agendamento: this.coorecuperados.agendamento, cancelado: this.coorecuperados.cancelado,
                user: this.coorecuperados.user, link: this.coorecuperados.link
            })
        },
        filtrar() {
            setTimeout( () => {
                if(this.filterRequestCount === 0){
                    this.filterRequestCount++
                    if (this.produtosSelected.length > 0)
                        this.dados.produtos = this.produtosSelected.map(prod => prod.id)
                    else this.dados.produtos = []
                    console.log('dentro do time', this.filterRequestCount)
                    this.getProductSales()
                }
            }, 1000)

            console.log('fora do time', this.filterRequestCount)
        }
    },
    computed: {
        loading() {
            return this.$store.state.relatorios.loading
        },
        vendas() {
            return this.$store.state.relatorios.vendas
        },
        coorecuperados() {
            return this.$store.getters['relatorios/coorecuperadosObject']
        },
        automaticas() {
            return this.$store.getters['relatorios/automaticasObject']
        },
    },
    watch: {
        produtosSelected(val) {
            console.log('olha ele', val)
            setTimeout(() => {
                this.filtrar()
            }, 2000)
        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"/>
