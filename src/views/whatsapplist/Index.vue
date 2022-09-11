<template>
    <div>
        <side-bar v-if="responderTicket" :isSidebarActive="responderTicket" @closeSidebar="toggleRespostaSidebar" @getItems="getItems"
                  :data="aresponder"/>
        <transformar v-if="transformarTicket" :isSidebarActive="transformarTicket" @closeSidebar="toggleTicketSidebar" @getItems="getItems"
                     :data="atransformar"/>
        <div class="vx-row flex items-end">
            <div class="vx-col w-full lg:w-6/12">
                <p>Resultado da busca considerando o período: <span class="destaque">{{ (dateRange.startDate != null && dateRange.endDate != null) ? (dateRange.startDate | formatDate) + 'a' + (dateRange.endDate | formatDate) : 'Total'}}</span>
                </p>
            </div>
        </div>
<!--      <vs-button @click="$echo.disconnect()">desconectar</vs-button>-->
<!--      <vs-button @click="conectar">connect</vs-button>-->
<!--      <vs-button @click="idsocket()">id</vs-button>-->
        <div class="vx-row flex items-end lg:mt-3 sm:mt-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input_trans" size="large" placeholder="Pesquisar por título"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="h-6 w-6 text-gray-500"/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full relative lg:w-6/12 flex justify-end">
                <vs-button color="black" type="flat" @click="setDate('hoje')" class="btn-periodo">Hoje</vs-button>
                <vs-button color="black" type="flat" @click="setDate('7')" class="btn-periodo">7 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('15')" class="btn-periodo">15 Dias</vs-button>
                <vs-button color="black" type="flat" @click="setDate('30')" class="btn-periodo">30 Dias</vs-button>
                <date-range-picker ref="picker" opens="left" :locale-data="localeData" :singleDatePicker="false"
                                   :timePicker="false" :showWeekNumbers="false" :showDropdowns="true" :autoApply="true"
                                   v-model="dateRange" :linkedCalendars="true" :close-on-esc="true" :append-to-body="true" :ranges="ranges">
                </date-range-picker>
            </div>
        </div>
        <div class="vx-row mt-3">
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <select-responsaveis @chooseResp="chooseResp"/>
            </div>
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <label class="vs-input--label">Produto</label>
                <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="true" class="bg-white" :options="produtos"/>
            </div>
        </div>
        <div class="vx-row mt-10">
            <div class="vx-col w-full">
                <!--<label class="vs-input&#45;&#45;label">Quantidade</label>
                <v-select v-model="dados.length" :class="'select-large-base'" :clearable="false" class="bg-white"
                          :options="lengths"/>-->
                <vs-dropdown vs-trigger-click class="cursor-pointer float-right">
                    <div class="p-4 border border-solid d-theme-border-gray-light rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentx * dados.length - (dados.length - 1) }} - {{
                                pagination.total - currentx * dados.length > 0 ? currentx * dados.length : pagination.total
                            }} de {{ pagination.total }}</span>
                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
                    </div>
                    <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
                    <vs-dropdown-menu>
                        <vs-dropdown-item v-for="(item, index) in lengths" @click="dados.length = item" :key="index">
                            <span>{{ item }}</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </div>
        </div>
        <vs-row id="listagem-whatsapplist" class="vs-con-loading__container">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx" v-model="selectedTab">
                    <vs-tab @click="colorx = 'warning'; getItems('pendentes')" color="success" value="10"
                            label="pendentes" v-if="numeros">
                        <vs-alert :active="newTickets" class="mt-2 cursor-pointer hover:bg-white" @click="getItems('pendentes')">
                            Novos Whastapps foram inseridos. Clique aqui para atualizar a listagem.
                        </vs-alert>
                        <listagem @responder="responder" @transformar="transformar" :items="items"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>

                    <vs-tab @click="colorx = 'success'; getItems('respondidos')" color="black"
                            label="respondidos" v-if="numeros">
                        <listagem @responder="responder" @transformar="transformar" :items="items"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>

                    <vs-tab @click="colorx = 'primary'; getItems('todos')" label="todos" v-if="numeros">
                        <listagem @responder="responder" @transformar="transformar" :items="items"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import moduleWhatsList from "../../store/whatsapplist/moduleWhatsList";
import * as lang from "vuejs-datepicker/dist/locale";
import SideBar from "./Responder";
import SideBarTransformar from "./Transformar";
import vSelect from "vue-select";
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import moduleProdutos from "../../store/produtos/moduleProdutos";
import listagem from './Listagem';
import saveleadsConfig from "../../../saveleadsConfig";
import SelectResponsaveis from "../components/SelectResponsaveis";
//const calendarIcon = require("@/assets/fontawesome/calendar.svg");

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "Index",
    components: {
        SideBar, DateRangePicker, SelectResponsaveis, 'v-select': vSelect, listagem, 'transformar': SideBarTransformar
    },
    channel: this.$route.params.company_slug + '_whatsapp-list',
    echo: {
        'WhatsapplistEvent': () => {
        },
    },
    data() {
        return {
            newTickets: false,

            selectedResp: null,
            // Data Sidebar
            responderTicket: false,
            transformarTicket: false,
            aresponder: {},
            atransformar: {},
            colorx: 'warning',
            dados: {
                search: '',
                page: 1,
                dt_inicio: '',
                dt_fim: '',
                todos: '0',
                length: 25,
                situacao: 'pendentes'
            },
            selectedTab: 0,
            items: [],
            numeros: {},
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            dt_inicio: null,
            dt_fim: null,
            languages: lang,
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
                startDate: null,
                endDate: null,
            },
            ranges: {
                //Definindo ranges padronizados
                'Hoje': [this.getDay(true), this.getDay(true)],
                'Ontem': [this.getDay(false), this.getDay(false)],
                'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
            },
            currentx: 1,
            lengths: saveleadsConfig.lengths,
            selectedTipo: {id: null, label: 'Selecione'},
            tipos: [
                {id: 'carrinho', label: 'Carrinho/Checkout'},
                {id: 'boleto', label: 'Boleto'},
                {id: 'whatsapp', label: 'Whatsapp'},
            ],
            selectedProduto: {id: null, label: 'Selecione'},
            produtos: [],
            selectedCampanha: {id: null, label: 'Selecione'},
            campanhas: [],
            mensagensPadrao: [],
            //items: {}
        };
    },
    created() {

        //this.dateRange.startDate = moment().subtract(30, 'days')
        //this.dateRange.endDate = moment()

        if (!moduleWhatsList.isRegistered) {
            this.$store.registerModule('whatsapplist', moduleWhatsList);
            moduleWhatsList.isRegistered = true;
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos);
            moduleProdutos.isRegistered = true;
        }

        this.$store.dispatch('produtos/getArraySelect').then(response => {
            this.produtos = [...response];
        });

        this.$store.dispatch('whatsapplist/setFilter', false);
    },
    methods: {
        idsocket() {
        },
        conectar() {
          this.$echo.connect();
          this.$echo.channel(subdomain + '_whatsapp-list').listen('WhatsapplistEvent', (payload) => {
            this.items = this.items.filter(function (item) {
              if (payload.array.tipo == "excluir") {
                if (item.id !== payload.array.whatsapp.id) {
                  return item;
                }
              } else return item;
            });
            if (payload.array.tipo != "excluir" && payload.array.tipo != 'alterar') {
              this.newTickets = true;

            }
          });
        },
        chooseResp(obj) {
            this.selectedResp = obj;
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
            this.dados.page = 1;
            this.getItems(this.$route.params.id);
        },
        responder(dados) {
            this.aresponder = dados;
            this.toggleRespostaSidebar(true);
        },
        transformar(dados) {
            this.atransformar = dados;
            this.toggleTicketSidebar(true);
        },
        toggleRespostaSidebar(val = false) {
            this.responderTicket = val;
        },
        toggleTicketSidebar(val = false) {
            this.transformarTicket = val;
        },
        getItems(tipo = null) {
            this.$vs.loading({
                container: "#listagem-whatsapplist",
                scale: 0.45
            });

            if (tipo != this.dados.situacao)
                this.currentx = 1;

            this.dados.situacao = tipo;

            if (this.selectedResp) {
                //this.dados.responsavel_type = this.selectedResp.id;
                this.dados.campanhable_type = this.selectedResp.criador_type;
                this.dados.campanhable_id = this.selectedResp.id;
            } else {
                this.dados.campanhable_type = null;
                this.dados.campanhable_id = null;
            }
            if (this.selectedProduto !== null)
                this.dados.produto_id = this.selectedProduto.id;
            else this.dados.produto_id = '';

            if (this.dateRange.startDate)
                this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
            if (this.dateRange.endDate)
                this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

            this.$store.dispatch('whatsapplist/getVarios', this.dados).then(response => {

                this.items = response.data.data;
                this.pagination = response.data;
                this.numeros = {...response.numeros};
                this.$vs.loading.close();
                this.$vs.loading.close("#listagem-whatsapplist > .con-vs-loading");
            });
            this.newTickets = false;
        },
        getCampanhas(val) {
            let rota = '';
            switch (val) {
                case 'whatsapp':
                    rota = 'campanha_whatsapps';
                    break;
                case 'boleto':
                    rota = 'campanha_boletos';
                    break;
                case 'carrinho':
                    rota = 'campanha_carrinhos';
                    break;
            }
            this.campanhas = [];
            this.$store.dispatch('whatsapplist/getCampanhas', rota).then(response => {

                let arr = [...response];
                arr.forEach(item => {
                    this.campanhas.push({id: item.id, label: item.nome});
                });
            });
        },
        deletar(id) {
            this.$vs.dialog({
                color: 'danger',
                title: `Deletar registro?`,
                text: 'Deseja deletar este registro? Procedimento irreversível',
                acceptText: 'Sim, deletar!',
                accept: () => {
                    this.$store.dispatch('deleteItem', {id: id, rota: ''}).then(() => {
                        this.$vs.notify({
                            color: 'success',
                            title: '',
                            text: 'Deletado com sucesso'
                        });
                        this.getItems(this.dados.situacao);
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
            this.dados.page = 1;
            e.preventDefault();
            this.getItems(this.dados.situacao);
        },
    },
    watch: {
        currentx() {
            this.dados.page = this.currentx;
            this.getItems(this.dados.situacao);
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle;
        },
        $echo() {
        },
        dateRange() {
            this.dados.page = 1;
            this.getItems(this.dados.situacao);
        },
        selectedProduto() {
            this.dados.page = 1;
            this.getItems(this.dados.situacao);
        },
        selectedResp() {
            this.dados.page = 1;
            this.getItems(this.dados.situacao);
        },
        selectedCampanha() {
            this.dados.page = 1;
            this.getItems(this.dados.situacao);
        },
        dados: {
            handler(val) {
                if (val.length != this.pagination.per_page) {
                    this.dados.page = 1;
                    this.getItems(this.dados.situacao);
                }
            },
            deep: true
        },
    },
    computed: {},
    mounted() {
        //this.$echo.socketId()
        if (this.$store.state.globalSearch != '') {
            this.dados.search = this.$store.state.globalSearch;
            this.dados.situacao = 'todos';
            this.selectedTab = 2;
            this.colorx = 'primary';
            this.$store.dispatch('globalSearchParams', '');
        } else {
            this.getItems('pendentes');
        }
        this.$echo.channel(subdomain + '_whatsapp-list').listen('WhatsapplistEvent', (payload) => {
            this.items = this.items.filter(function (item) {
                if (payload.array.tipo == "excluir") {
                    if (item.id !== payload.array.whatsapp.id) {
                        return item;
                    }
                } else return item;
            });
            if (payload.array.tipo != "excluir" && payload.array.tipo != 'alterar') {
                this.newTickets = true;

            }
        });
    },
};
</script>
