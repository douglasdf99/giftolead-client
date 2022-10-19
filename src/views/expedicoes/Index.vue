<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-end">
            <div class="vx-col w-full lg:w-6/12">
                <p v-if="dateRange.startDate || dateRange.endDate">Resultado da busca considerando o período: <span
                    class="destaque">{{ dateRange.startDate | formatDate }} a {{ dateRange.endDate | formatDate
                    }}</span></p>
                <p v-else>Resultado da busca considerando todos as datas</p>
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
        </div>
        <div class="vx-row flex items-end">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.pesquisa" id="search_input" size="large"
                                      placeholder="Pesquisar por nome ou email do destinatário"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
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
            <div class="vx-col w-full lg:w-1/2">
                <label class="vs-input--label">Brinde</label>
                <v-select v-model="selectedBrinde" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="brindes"/>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems('pendente')" color="warning" value="10"
                            v-if="pagination"
                            :label="'pendentes' + (dados.status == 'pendente' ? ' (' + items.length + ')' : '')">
                        <listagem @fecharVarias="fecharVarias" @visualizar="visualizar" @editar="editar" :items="items"
                                  tipo="pendente" v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems('fechada')" color="success" value="10"
                            :label="'fechadas' + (dados.status == 'fechada' ? ' (' + items.length + ')' : '')">
                        <listagem @enviarRastreio="enviarRastreio" @visualizar="visualizar" :items="items"
                                  tipo="fechada" v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'primary'; getItems('todos')" color="primary" value="10"
                            :label="'todos' + (dados.status == 'todos' ? ' (' + items.length + ')' : '')">
                        <listagem @enviarRastreio="enviarRastreio" @visualizar="visualizar" :items="items" tipo="todos"
                                  v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <nenhum-registro></nenhum-registro>
                </div>
            </vs-col>
        </vs-row>
        <vs-prompt
            @cancel="modaleditar = false"
            @accept="update"
            acceptText="Salvar"
            cancelText="Cancelar"
            :title="'Editar informações'"
            :max-width="'600px'"
            :active.sync="modaleditar">
            <div class="con-exemple-prompt">
                <div class="mb-3">
                    <span class="font-regular mb-2">Nome do destinatário</span>
                    <vs-input class="w-full" v-validate="'required'" name="remetenteEstado"
                              v-model="val.nome_destinatario" size="large"/>
                </div>
                <div class="mb-3">
                    <span class="font-regular mb-2">E-mail do destinatário</span>
                    <vs-input class="w-full" v-validate="'required'" name="remetenteEstado"
                              v-model="val.email_destinatario" size="large"/>
                </div>
                <div class="mb-3">
                    <span class="font-regular mb-2">Brinde</span>
                    <v-select v-model="selectedEditBrinde" class="mb-2" :class="'select-large-base'" :clearable="false"
                              :options="brindesEdit" v-validate="'required'" name="variavel"/>
                </div>
            </div>
        </vs-prompt>
        <!-- inicio popup-->
        <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="" v-if="modalGerarPlp">
            <div class="vs-popup--background"></div>
            <div class="vs-popup" style="background: rgb(255, 255, 255);">
                <header class="vs-popup--header">
                    <div class="vs-popup--title">
                    </div>
                </header>
                <div class="vs-popup--content">
                    <div class="vx-col w-full">
                        <vx-card class="p-2">
                            <div class="text-left mb-10">
                                <h2 class="text-center"> Gerando PLP </h2>
                                <h6 class="mb-2 mt-4"><b>Numero da Expedição :</b> #{{ expedicao.id }}</h6>
                                <h6 class="mb-2"><b>Brinde a ser enviado :</b> {{ expedicao.brinde.nome }}</h6>
                                <p class="mb-2"></p>
                            </div>
                            <vs-divider/>
                            <div class="flex items-center">
                                <div class="fill-row-loading w-full">
                                    <h6 class="mb-6"><b>Status atual:</b> <span> Fechando Expedições </span></h6>
                                    <h6 class="text-center mb-2"> {{ atual }}/{{ total }} </h6>
                                    <vs-progress :height="12" :percent="(atual / total)* 100"
                                                 color="success"></vs-progress>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>
        </div>
        <!-- fim popup-->
    </div>
</template>

<script>
import SideBar from './SideBar';
import listagem from './Listagem';
import moduleBrindes from '@/store/brindes/moduleBrindes.js';
import vSelect from 'vue-select';
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
import Datepicker from 'vuejs-datepicker';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import saveleadsConfig from "../../../saveleadsConfig";
import VueMoment from 'vue-moment';

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "Index",
    components: {
        listagem,
        'v-select': vSelect,
        SideBar, Datepicker,
        VueMoment,
        moment,
        DateRangePicker
    },
    data() {
        return {
            modalGerarPlp: false,
            atual: 0,
            total: 1,
            expedicao: {
                brinde: {
                    nome: '',
                    produto: {
                        nome: ''
                    }
                }
            },
            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},

            dados: {
                pesquisa: null,
                page: 1,
                length: 30,
                status: 'pendente',
                brinde_id: null,
                fechado: 0
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            currentx: 1,
            colorx: 'warning',
            selectedBrinde: {},
            brindes: [],
            brindesCru: [],
            dateRange: {},
            localeData: saveleadsConfig.localeData,
            ranges: {
                //Definindo ranges padronizados
                'Hoje': [this.getDay(true), this.getDay(true)],
                'Ontem': [this.getDay(false), this.getDay(false)],
                'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
            },
            //items: {}

            //Prompt Editar
            modaleditar: false,
            val: {
                nome_destinatario: '',
                email_destinatario: '',
                brinde_id: null
            },
            selectedEditBrinde: {},
            brindesEdit: [],
        };
    },
    created() {
        this.$vs.loading();
        if (!moduleBrindes.isRegistered) {
            this.$store.registerModule('brindes', moduleBrindes);
            moduleBrindes.isRegistered = true;
        }

        if (!moduleExpedicoesBrindes.isRegistered) {
            this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
            moduleExpedicoesBrindes.isRegistered = true;
        }

        /*this.dateRange.startDate = moment().subtract(30, 'days');
        this.dateRange.endDate = moment();*/

        this.dateRange.startDate = null;
        this.dateRange.endDate = null;

        this.$vs.loading.close();
        this.getOpcoes();
        this.getItems();
    },
    methods: {
        paginate() {
            this.currentx = 1;
        },
        visualizar(obj) {
            this.sidebarData = obj;
            this.toggleDataSidebar(true);
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val;
        },
        getItems(status = this.dados.status) {
            this.$vs.loading();
            if(status !== this.dados.status)
                this.currentx = 1;

            this.dados.status = status;
            switch (status) {
                case "pendente":
                    this.dados.fechado = 0;
                    break;
                case "fechada":
                    this.dados.fechado = 1;
                    break;
                default:
                    this.dados.fechado = null;
            }

            if (this.dateRange.startDate)
                this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
            if (this.dateRange.endDate)
                this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

            this.$store.dispatch('getVarios', {rota: 'expedicaos', params: this.dados}).then(response => {
                this.pagination = response;
            }).catch(erro => {
                this.$vs.notify({
                    text: erro.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        getOpcoes() {
            this.$store.dispatch('brindes/getArraySelect').then(response => {
                this.brindes = [...response];
                this.brindesCru = [...response];
            });
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
            this.getItems();
        },
        enviarRastreio(id) {
            this.$vs.loading();
            this.$store.dispatch('expedicaos/enviarRastreio', {expedicao_id: id}).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'Rastreios enviados com sucesso.'
                });
                this.getItems();
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    text: 'Algo deu errado. Contate o suporte'
                });
                this.$vs.loading.close();
            });
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
        deletar(id) {
            this.$vs.dialog({
                color: 'danger',
                title: `Deletar registro?`,
                text: 'Deseja deletar este registro? Procedimento irreversível',
                acceptText: 'Sim, deletar!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('deleteItem', {id: id, rota: 'brindes'}).then(() => {
                        this.$vs.notify({
                            color: 'success',
                            title: '',
                            text: 'Deletado com sucesso'
                        });
                        this.getItems();
                    }).catch(() => {
                        this.$vs.notify({
                            color: 'danger',
                            title: '',
                            text: 'Algo deu errado ao deletar. Contate o suporte.'
                        });
                    });
                }
            });
        },
        pesquisar(e) {
            this.data.page = 1;
            e.preventDefault();
            this.$vs.loading();
            this.getItems();
        },

        //Procedimentos
        fecharVarias(arr, rota, tipo) {
            var self = this;
            this.$vs.dialog({
                color: 'primary',
                title: (rota == 'fechar' ? 'Fechar' : 'Restaurar') + ` expedições?`,
                text: 'Deseja mesmo ' + rota + ' as expedições selecionadas?',
                acceptText: 'Sim!',
                accept: () => {
                    self.$vs.loading({
                        color: self.colorLoading,
                        container: "#button-with-loading-fecharPlp",
                        scale: 0.45
                    });
                    self.total = arr.length;
                    self.modalGerarPlp = true;

                    async function diags() {
                        for (const [idx, item] of arr.entries()) {
                            self.atual = idx;
                            self.expedicao = item;
                            await self.$store.dispatch('expedicaos/gerarPlp', item.id).then(() => {
                                self.items.splice(idx, 1);
                            }).catch(() => {
                                self.$vs.notify({
                                    color: 'danger',
                                    text: 'Algo deu errado ao gerar a PLP. Contate o suporte'
                                });
                            }).finally(() => {
                            });
                        }
                        self.modalGerarPlp = false;
                        self.getItems(tipo);
                        self.$vs.loading.close("#button-with-loading-fecharPlp > .con-vs-loading");
                    }

                    diags();
                }
            });
        },

        //Prompt Editar
        editar(obj) {
            this.modaleditar = true;
            this.brindesEdit = [];
            this.brindesCru.forEach(item => {
                if (obj.produto_id == item.produto_id) {
                    this.brindesEdit.push({id: item.id, label: item.nome});
                }
            });
            this.val = {...obj};
            this.selectedEditBrinde = {id: obj.brinde.id, label: obj.brinde.nome};
        },
        update() {
            this.val.brinde_id = this.selectedEditBrinde.id;
            this.$vs.loading();
            this.$store.dispatch('expedicaos/store', this.val).then(() => {
                this.val = {};
                this.$vs.notify({
                    color: 'success',
                    title: '',
                    text: 'Salvo com sucesso'
                });
                this.getItems();
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    title: 'Erro',
                    text: 'Algo deu errado ao finalizar. Reinicie a página.'
                });
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
        selectedBrinde() {
            this.$vs.loading();
            this.dados.brinde_id = this.selectedBrinde != null ? this.selectedBrinde.id : null;
            this.getItems();
        },
        dateRange() {
            this.$vs.loading();
            this.getItems();
        },
    },
    computed: {
        items() {
            return this.$store.state.items;
        },
    },

};
</script>
<style>
.td-icons > span {
    display: flex;
}
</style>
