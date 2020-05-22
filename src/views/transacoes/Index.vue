<template>
    <div>
        <div class="vx-row flex items-end lg:mt-20 sm:mt-6">
            <!--<div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Lead
                </vs-button>
                &lt;!&ndash; SEARCH INPUT &ndash;&gt;
            </div>-->
            <div class="vx-col w-full sm:w-full md:w-full lg:w-3/12 xlg:w-3/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input" size="large"/>
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
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Produto</label>
                <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="produtos"/>
            </div>
            <div class="vx-col w-full lg:w-2/12 sm:w-full">
                <label class="vs-input--label">Status</label>
                <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="status"/>
            </div>
            <div class="vx-col w-full lg:w-2/12 sm:w-1/2">
                <vs-button class="mb-3 px-3 py-2" style="border: 1px solid #C7C7C7; color: #C7C7C7;" color="transparent"
                           @click="$refs.programaticOpen.showCalendar()"><i class="material-icons">calendar_today</i>
                </vs-button>
                <datepicker placeholder="De" ref="programaticOpen" v-model="dt_inicio" class="datepicker-input"
                            :language="languages.ptBR" format="dd/MM/yyyy"></datepicker>
            </div>
            <div class="vx-col w-full lg:w-2/12 sm:w-1/2">
                <vs-button class="mb-3 px-3 py-2" style="border: 1px solid #C7C7C7; color: #C7C7C7;" color="transparent"
                           @click="$refs.programaticOpen.showCalendar()"><i class="material-icons">calendar_today</i>
                </vs-button>
                <datepicker placeholder="Até" ref="programaticOpen2" v-model="dt_fim" class="datepicker-input"
                            :language="languages.ptBR" format="dd/MM/yyyy"></datepicker>
            </div>
            <!--<div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Lead
                </vs-button>
                &lt;!&ndash; SEARCH INPUT &ndash;&gt;
            </div>-->
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20" v-show="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div v-if="dados.search">
                                <p class="span-sem-item">Nenhum item foi encontrado</p>
                                <p class="text-sem-item mt-6">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>
                            </div>
                            <div v-else>
                                <p class="span-sem-item">Você não possui nenhum item cadastrado neste período</p>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-show="items.length > 0">
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
                                <vs-td :data="tr.lead.nome">
                                    {{ tr.lead.nome }}
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

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Index",
        components: {
            'v-select': vSelect,
            Datepicker,
            VueMoment,
            moment
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
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }
            console.log('linguagem', this.languages);
            console.log('moment', moment("subtract", "30 days").format('DD-MM-YYYY'))
            /*this.dt_inicio = moment().format('DD-MM-YYYY');
            console.log(this.dt_inicio)*/
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
                if (this.selectedProduto)
                    this.dados.produto = this.selectedProduto.label;
                if (this.selectedStatus)
                    this.dados.status = this.selectedStatus.id;
                if(this.dt_inicio)
                    this.dados.dt_inicio = this.formatDateBanco(this.dt_inicio);
                if(this.dt_fim)
                    this.dados.dt_fim = this.formatDateBanco(this.dt_fim);
                this.$store.dispatch('getVarios', {rota: 'transacaos', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
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
    .con-vs-chip {
        border-radius: 5px !important;
    }
</style>