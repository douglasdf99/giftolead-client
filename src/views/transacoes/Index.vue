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
                                      placeholder="Pesquisar por nome do Lead ou transação"/>
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
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <label class="vs-input--label">Produto</label>
                <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="produtos"/>
            </div>
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <label class="vs-input--label">Status</label>
                <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="status"/>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div>
                                <p class="span-sem-item">Nenhuma transação encontrada</p>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-else>
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Transação</vs-th>
                            <vs-th>Lead</vs-th>
                            <vs-th>Produto</vs-th>
                            <vs-th>Data e Hora</vs-th>
                            <vs-th>Comissão do Hotmart</vs-th>
                            <vs-th>Comissão Cadastrada</vs-th>
                            <vs-th>Status</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                <!--<vs-td class="flex justify-center items-center relative">
                                    <vs-dropdown vs-trigger-click>
                                        <vs-button radius color="#EDEDED" type="filled"
                                                   class="btn-more-icon relative botao-menu"
                                                   icon-pack="material-icons" icon="more_horiz"
                                        ></vs-button>
                                        <vs-dropdown-menu class="dropdown-menu-list">
                                            <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>
                                            <vs-dropdown-item @click="updateData(data[indextr])">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>

                                            <vs-dropdown-item @click="deletar(data[indextr].id)">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>

                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>-->
                                <vs-td :data="tr.transaction">
                                    {{ tr.transaction }}
                                </vs-td>
                                <vs-td :data="tr.lead.nome" class="cursor-pointer">
                                    <router-link :to="{name: 'leads-detalhe', params: {id: tr.lead.id}}">{{ tr.lead.nome
                                        }}
                                    </router-link>
                                </vs-td>
                                <vs-td v-if="tr.produto">
                                    <vs-chip :color="tr.produto.cor || ''" class="product-order-status">
                                        {{ tr.produto.nome}}
                                    </vs-chip>
                                </vs-td>
                                <vs-td :data="tr.confirmation_purchase_date">
                                    <span class="destaque">{{ tr.confirmation_purchase_date | formatDate}}</span>
                                </vs-td>
                                <vs-td>
                                    <span class="preco">R$ {{formatPrice(tr.full_price)}}</span>
                                </vs-td>
                                <vs-td v-if="tr.produto">
                                    <span class="preco">R$ {{formatPrice(tr.produto.preco)}}</span>
                                </vs-td>
                                <vs-td>
                                    <vs-chip v-for="(status, index) in hotmartStatus" v-if="index === tr.status"
                                             :color="status[1]" class="product-order-status">
                                        {{ status[0]}}
                                    </vs-chip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'
    import Datepicker from 'vuejs-datepicker';
    import * as lang from 'vuejs-datepicker/src/locale';
    import VueMoment from 'vue-moment'
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Index",
        components: {
            'v-select': vSelect,
            Datepicker,
            VueMoment,
            moment,
            DateRangePicker
        },
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Leads',
                dados: {
                    search: '',
                    pesquisa: '',
                    page: 1,
                    dt_inicio: '',
                    dt_fim: '',
                    status: '',
                    produto: ''
                },
                dt_inicio: '',
                dt_fim: '',
                languages: lang,
                selectedProduto: null,
                selectedStatus: null,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dateRange: {},
                produtos: [],
                status: [],
                currentx: 1,
                //items: {}
                hotmartStatus: {
                    started: ['Iniciado', '#3498db'],
                    billet_printed: ['Boleto Impresso', '#848a91'],
                    expired: ['Expirado', '#848a91'],
                    pending_analysis: ['Pendente', '#848a91'],
                    delayed: ['Atrasado', '#e74c3c'],
                    canceled: ['Cancelado', '#e74c3c'],
                    approved: ['Aprovado', '#2ecc71'],
                    completed: ['Concluído', '#2ecc71'],
                    chargeback: ['Chargeback', '#e74c3c'],
                    blocked: ['Bloqueado', '#848a91'],
                    refunded: ['Devolvido', '#e74c3c'],
                    admin_free: ['Cadastrado', '#848a91'],
                    dispute: ['Disputa', '#e74c3c']
                },
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
            this.$vs.loading()
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }

            this.dt_inicio = moment().subtract(30, 'days').format('DD-MM-YYYY');
            this.dt_fim = moment().format('DD-MM-YYYY');
            this.dateRange.startDate = moment().subtract(30, 'days')
            this.dateRange.endDate = moment()
            this.getOpcoes();
            this.getTransacoes();

        },
        methods: {
            addNewData() {
                //this.$router.push({name: 'produto-criar'});
            },
            updateData(id) {
                //this.$router.push({path: '/configuracoes/produtos/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getTransacoes() {
                /*let url = '';
                let control = 0;//Controla entradas em cada condição
                if(this.search !== ''){
                    url += 'lead.nome:' + this.search + ';';
                    url += 'transaction:' + this.search + ';';
                    url += 'produto.preco:' + this.search ;
                    control++;
                }

                if(this.selectedProduto){
                    if(control)
                        url += ';'

                    url += 'produto.nome:' + this.selectedProduto.label;
                    control++;
                }

                if(this.selectedStatus){
                    if(control)
                        url += ';'

                    url += 'status:' + this.selectedStatus.id;
                    control++;
                }

                if(control >= 2)
                    url += '&searchJoin=and';

                this.dados.search = url;*/
                this.dados.pesquisa = this.search;

                if (this.selectedProduto !== null)
                    this.dados.produto = this.selectedProduto.id;
                else this.dados.produto = '';

                if (this.selectedStatus !== null)
                    this.dados.status = this.selectedStatus.id;
                else this.dados.status = '';

                if (this.dateRange.startDate)
                    this.dados.dt_inicio = moment(this.dateRange.startDate).format('DD-MM-YYYY');
                if (this.dateRange.endDate)
                    this.dados.dt_fim = moment(this.dateRange.endDate).format('DD-MM-YYYY');

                this.$store.dispatch('getVarios', {rota: 'transacaos', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
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
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar conta id: ${id}`,
                    text: 'Deseja deletar este Lead? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'transacaos'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A URL foi deletada com sucesso'
                            });
                            this.getTransacoes();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar o produto. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.dados.page = 1;
                this.pagination.current_page = 1;
                this.currentx = 1;
                this.getTransacoes();
            },
            getOpcoes() {
                //Produtos
                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome})
                    });
                });

                //Status
                for (let item in this.hotmartStatus) {
                    this.status.push({id: item, label: this.hotmartStatus[item][0]})
                }

                console.log(this.status)
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
                this.getTransacoes();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getTransacoes();
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle
            },
            selectedProduto(val) {
                console.log('teste', val)
                this.$vs.loading();
                this.dados.page = 1;
                this.getTransacoes();
            },
            selectedStatus(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getTransacoes();
            },
            dt_inicio(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getTransacoes();
            },
            dt_fim(val) {
                this.$vs.loading();
                this.dados.page = 1;
                this.getTransacoes();
            },
            dateRange(val) {
                this.$vs.loading();
                this.getTransacoes();
            }
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
<style scoped>
    .input-span-placeholder {
        font-size: 1rem !important;
    }
</style>