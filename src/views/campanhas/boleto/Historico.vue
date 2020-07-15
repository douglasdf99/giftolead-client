<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
        <div class="vx-row mb-3">
            <div class="vx-col w-full" v-if="historico.length > 0">
                <p class="destaque text-2xl">{{historico[0].campanha.nome}}</p>
            </div>
        </div>
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
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Assunto</label>
                <v-select v-model="selectedAssunto" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="assuntos"/>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Status</label>
                <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="statusList"/>
            </div>
            <div class="vx-col w-full lg:w-2/12 sm:w-full">
                <label class="vs-input--label">Tipo</label>
                <v-select v-model="selectedTipo" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="[{id: 'email', label: 'E-mail'}, {id: 'sms', label: 'SMS'}]"/>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="historico.length === 0">
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
                    <vs-table v-model="selected" :data="historico" @selected="handleSelected" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Lead</vs-th>
                            <vs-th>Assunto</vs-th>
                            <vs-th>Data e Hora</vs-th>
                            <vs-th>Status</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="mb-3 cursor-pointer">
                                <vs-td>{{tr.contato ? tr.contato.email : ''}}</vs-td>
                                <vs-td>{{tr.email ? tr.email.assunto : tr.sms.corpo.substr(0, 30)}}</vs-td>
                                <vs-td><span class="destaque">{{ tr.created_at | formatDateTime}}</span></vs-td>
                                <vs-td v-if="tr.email">
                                    <vs-chip v-if="tr.eventos_entrega.length > 0"
                                             :color="tr.eventos_entrega[0].resposta === 'success' ? '#2ecc71' : '#e74c3c'"
                                             class="product-order-status">
                                        {{ tr.eventos_entrega[0].evento }}
                                    </vs-chip>
                                </vs-td>
                                <vs-td v-else>
                                    <vs-chip
                                            :color="tr.sms.responder != null ? '#2ecc71' : '#e74c3c'"
                                            class="product-order-status">
                                        {{ tr.sms.responder != null ?'Respondido' : 'Não respondido' }}
                                    </vs-chip>
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
                            <vs-button class="mr-3" color="dark" type="filled" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/campanha/configurar-boleto/' + historico[0].campanha_id})">
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
    import SideBar from './DetalheHistorico'
    import Datepicker from 'vuejs-datepicker';
    import * as lang from 'vuejs-datepicker/src/locale';
    import VueMoment from 'vue-moment'
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import vSelect from "vue-select";
    import moduleCampBoletos from "../../../store/campanha_boleto/moduleCampBoletos";

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Historico",
        components: {
            SideBar,
            Datepicker,
            VueMoment,
            moment,
            DateRangePicker,
            'v-select': vSelect
        },
        computed: {
            items() {
                return this.$store.state.items;
            },
        },
        created() {
            if (!moduleCampBoletos.isRegistered) {
                this.$store.registerModule('boleto', moduleCampBoletos)
                moduleCampBoletos.isRegistered = true
            }
            this.dt_inicio = moment().subtract(30, 'days').format('YYYY-MM-DD');
            this.dt_fim = moment().format('YYYY-MM-DD');
            this.dateRange.startDate = moment().subtract(30, 'days')
            this.dateRange.endDate = moment()

            this.getId(this.$route.params.id);
        },
        data() {
            return {
                statusList: [
                    {id: 'Processado', label: 'Processado'},
                    {id: 'Entregue', label: 'Entregue'},
                    {id: 'Desistiu', label: 'Desistiu'},
                    {id: 'Diferido', label: 'Diferido'},
                    {id: 'Bloqueado', label: 'Bloqueado'},
                    {id: 'Bounce', label: 'Bounce'},
                    {id: 'Aberto', label: 'Aberto'},
                    {id: 'Clicou', label: 'Clicou'},
                    {id: 'Reportado', label: 'Reportado'},
                    {id: 'Cancelou subscrição', label: 'Cancelou subs...'},
                    {id: 'Spam Reportado', label: 'Spam Reportado'},
                    {id: 'Cancelou inscrição do grupo', label: 'Cancelou insc... do grupo'},
                    {id: 'Se Reinscreveu no grupo', label: 'Se reins... no grupo'},
                ],
                emails: [],
                assuntos: [],
                selectedStatus: {},
                selectedTipo: {id: 'email', label: 'E-mail'},
                selectedAssunto: {},
                currentx: 1,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dados: {
                    search: '',
                    page: 1,
                    dt_inicio: '',
                    dt_fim: '',
                    email_id: '',
                    type: 'email'
                },
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
                },
                historico: [],
                addNewDataSidebar: false,
                sidebarData: {},
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
                this.dados.page = 1
                this.getId(this.$route.params.id);
            },
            handleSelected(tr) {
                this.sidebarData = tr;
                this.toggleDataSidebar(true);
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getId(id) {
                this.$vs.loading();
                let url = '';
                if (this.search !== '') {
                    url += 'contato.nome:' + this.search + ';';
                    url += 'contato.email:' + this.search + ';';
                    url += 'campanha.nome:' + this.search;
                }
                this.dados.search = url;

                if (this.selectedStatus !== null)
                    this.dados.status = this.selectedStatus.id;
                else this.dados.status = '';

                if (this.selectedAssunto !== null)
                    this.dados.email_id = this.selectedAssunto.id;
                else this.dados.email_id = '';

                if (this.selectedTipo !== null)
                    this.dados.type = this.selectedTipo.id;
                else this.dados.type = '';

                if (this.dateRange.startDate)
                    this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
                if (this.dateRange.endDate)
                    this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');

                this.$store.dispatch('boleto/getEmails', this.$route.params.id).then(response => {
                    this.emails = response;
                    this.assuntos = [];
                    this.emails.forEach((item, index) => {
                        this.assuntos.push({id: item.id, label: item.assunto});
                    });
                });

                this.$store.dispatch('boleto/getHistorico', {id: id, params: this.dados}).then(response => {
                    this.historico = response.data;
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                this.dados.page = val;
                this.getId(this.$route.params.id);
            },
            selectedStatus(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getId(this.$route.params.id);
            },
            selectedAssunto(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getId(this.$route.params.id);
            },
            selectedTipo(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getId(this.$route.params.id);
            },
            dateRange() {
                this.$vs.loading();
                this.getId(this.$route.params.id);
            }
        },
    }
</script>

<style scoped>

</style>