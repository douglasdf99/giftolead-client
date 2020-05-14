<template>
    <div>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <!--<div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Lead
                </vs-button>
                &lt;!&ndash; SEARCH INPUT &ndash;&gt;
            </div>-->
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large"/>
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
                                <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                <p class="text-sem-item">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>
                            </div>
                            <br>

                            <p>
                                <vs-button color="primary" class="float-left botao-incluir mt-6" type="filled"
                                           @click="addNewData">
                                    <vs-icon icon-pack="material-icons" icon="check_circle"
                                             class="icon-grande"></vs-icon>
                                    Incluir Lead
                                </vs-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Transação</vs-th>
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
                                <vs-td>
                                    <vs-chip :color="tr.produto.cor" class="product-order-status">
                                        {{ tr.produto.nome}}
                                    </vs-chip>
                                </vs-td>
                                <vs-td :data="tr.confirmation_purchase_date">
                                    <span class="destaque">{{ tr.confirmation_purchase_date | formatDate}}</span>
                                </vs-td>
                                <vs-td>
                                    <span class="preco">R$ {{formatPrice(tr.full_price)}}</span>
                                </vs-td>
                                <vs-td>
                                    <span class="preco">R$ {{formatPrice(tr.produto.preco)}}</span>
                                </vs-td>
                                <vs-td>
                                    <vs-chip v-for="(status, index) in hotmartStatus" v-if="index === tr.status" :color="status[1]" class="product-order-status">
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
    export default {
        name: "Index",
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Leads',
                dados: {
                    search: '',
                    page: 1
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
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
                this.$store.dispatch('getVarios', {rota: 'transacaos', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
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