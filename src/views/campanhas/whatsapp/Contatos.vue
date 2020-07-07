<template>
    <div>
        <div class="vx-row flex items-end">
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
        </div>
        <div class="vx-row flex items-end mb-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-4/12 xlg:w-6/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por e-mail do contato"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-4">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full" v-if="$route.name == 'campanha-config-whatsapp-contatos-todos'">
                <label class="vs-input--label">Filtro</label>
                <v-select v-model="filtroContatos" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="[{id: 'todos', label: 'Todos'}, {id: 'respondidos', label: 'Respondidos'}, {id: 'pendentes', label: 'pendentes'}]"/>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div>
                                <p class="span-sem-item">Nenhum dado encontrado</p>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-else>
                    <vs-table :data="items" class="table-items">
                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Nome</vs-th>
                            <vs-th>E-mail</vs-th>
                            <vs-th>Telefone</vs-th>
                            <vs-th>Entrou em</vs-th>
                            <vs-th v-if="dados.todos == '1' || dados.pendentes == '1'">Saiu em</vs-th>
                            <vs-th></vs-th>
                            <vs-th></vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="mb-3 cursor-default">
                                <vs-td>{{tr.nome}}</vs-td>
                                <vs-td>{{tr.email}}</vs-td>
                                <vs-td v-if="tr.telefone != null">{{tr.telefone | VMask('(##) #####-####')}}</vs-td>
                                <vs-td v-else></vs-td>
                                <vs-td><span class="destaque">{{ tr.created_at | formatDateTime}}</span></vs-td>
                                <vs-td v-if="dados.todos || dados.pendentes"><span class="destaque">{{ tr.deleted_at | formatDateTime}}</span></vs-td>
                                <vs-td class="text-center">
                                    <vx-tooltip text="WhatsappList" position="top">
                                        <vs-icon icon-pack="material-icons" icon="launch"
                                                 class="icon-grande text-black cursor-pointer" @click="pesquisaContatoWhatsList(tr.nome)"></vs-icon>
                                    </vx-tooltip>
                                </vs-td>
                                <vs-td class="text-center">
                                    <vx-tooltip text="Detalhe do Lead" position="top">
                                        <vs-icon icon-pack="material-icons" icon="account_box"
                                                 class="icon-grande text-black cursor-pointer" @click="handleSelected(tr)"></vs-icon>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/campanha/configurar-whatsapp/' + $route.params.id})">
                                Voltar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import * as lang from 'vuejs-datepicker/src/locale';
    import VueMoment from 'vue-moment'
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import vSelect from "vue-select";
    import moduleCampWhatsapp from "../../../store/campanha_whatsapp/moduleCampWhatsapp";

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Contatos",
        components: {
            Datepicker,
            VueMoment,
            moment,
            DateRangePicker,
            'v-select': vSelect
        },
        created() {
            if (!moduleCampWhatsapp.isRegistered) {
                this.$store.registerModule('whatsapp', moduleCampWhatsapp)
                moduleCampWhatsapp.isRegistered = true
            }
            this.dt_inicio = moment().subtract(30, 'days').format('DD-MM-YYYY');
            this.dt_fim = moment().format('DD-MM-YYYY');
            this.dateRange.startDate = moment().subtract(30, 'days');
            this.dateRange.endDate = moment();
            if (this.$route.name === 'campanha-config-whatsapp-contatos-pendentes') {
                this.dados.pendentes = '1';
            }
            if (this.$route.name === 'campanha-config-whatsapp-contatos-todos') {
                this.dados.todos = '1';
            }

            if (this.$route.name === 'campanha-config-whatsapp-contatos-todos')
                this.filtroContatos = {id: 'todos', label: 'Todos'};
            else
                this.getId(this.$route.params.id);
        },
        data() {
            return {
                currentx: 1,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dados: {
                    search: '',
                    length: 25,
                    page: 1,
                    dt_inicio: '',
                    dt_fim: '',
                    todos: 0,
                    pendentes: 0
                },
                filtroContatos: {id: null, label: 'Todos'},
                dt_inicio: '',
                dt_fim: '',
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
                    startDate: '',
                    endDate: '',
                },
                ranges: {
                    //Definindo ranges padronizados
                    'Hoje': [this.getDay(true), this.getDay(true)],
                    'Ontem': [this.getDay(false), this.getDay(false)],
                    'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
                    'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
                    'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
                },
                items: [],
                selected: []
            }
        },
        methods: {
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.dados.page = 1;
                this.pagination.current_page = 1;
                this.currentx = 1;
                this.getId(this.$route.params.id);
            },
            pesquisaContatoWhatsList(nome) {
                this.$store.dispatch('globalSearchParams', nome).then(() => this.$router.push({name: 'whatsapplist-list'}));
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
                this.dateRange.endDate = moment();
                this.dados.page = 1
                if (this.filtroContatos.id !== null) {
                    this.filtrar(this.filtroContatos.id);
                }
                this.getId(this.$route.params.id);
            },
            handleSelected(tr) {
                console.log('clicou no contato', tr);
                this.$router.push({path: '/leads/detalhe/' + tr.lead_id});
            },
            getId(id) {
                console.log(id)
                this.$vs.loading();
                let url = '';
                if (this.search !== '') {
                    url += 'nome:' + this.search + ';';
                    url += 'email:' + this.search + ';';
                    url += 'telefone:' + this.search;
                }
                this.dados.search = url;
                this.dados.campanha_id = id;
                if (this.dateRange.startDate)
                    this.dados.dt_inicio = moment(this.dateRange.startDate).format('DD-MM-YYYY');
                if (this.dateRange.endDate)
                    this.dados.dt_fim = moment(this.dateRange.endDate).format('DD-MM-YYYY');

                this.$store.dispatch('whatsapp/getContatos', {params: this.dados}).then(response => {
                    this.items = [...new Set(response.data)];
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
            filtrar(val) {
                switch (val) {
                    case 'todos':
                        this.dados.todos = '1';
                        this.dados.pendentes = '0';
                        break;
                    case 'pendentes':
                        this.dados.pendentes = '1';
                        this.dados.todos = '0';
                        break;
                    default:
                        this.dados.todos = '0';
                        this.dados.pendentes = '0';
                }
            }
        },
        computed: {},
        watch: {
            currentx(val) {
                this.$vs.loading();
                this.dados.page = val;
                this.getId(this.$route.params.id);
            },
            dateRange() {
                this.$vs.loading();
                this.getId(this.$route.params.id);
            },
            filtroContatos(val) {
                this.$vs.loading();
                this.filtrar(val.id)
                this.dados.campanha_id = this.$route.params.id;
                this.$store.dispatch('whatsapp/getContatos', {params: this.dados}).then(response => {
                    this.items = [...new Set(response.data)];
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            }
        },
    }
</script>