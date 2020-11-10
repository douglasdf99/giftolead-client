<template>
    <div>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3" v-if="$acl.check('configuracao_produto_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Produto
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large" placeholder="Pesquisar por nome ou conta"/>
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
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop" v-if="$acl.check('configuracao_produto_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Produto
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <nenhum-registro class="mt-20" :add="true" module="Produto" @addEvent="addNewData" v-if="items.length === 0"/>
                <div class="com-item" v-else>
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th>Produto</vs-th>
                            <vs-th>Cor</vs-th>
                            <vs-th>Conta</vs-th>
                            <vs-th>Preço</vs-th>
                            <vs-th></vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                <vs-td class="flex justify-center items-center relative">
                                    <vs-dropdown vs-trigger-click v-if="checkPerm">
                                        <vs-button radius color="#EDEDED" type="filled"
                                                   class="btn-more-icon relative botao-menu"
                                                   icon-pack="material-icons" icon="more_horiz"
                                        ></vs-button>
                                        <vs-dropdown-menu class="dropdown-menu-list">
                                            <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>
                                            <vs-dropdown-item @click="showLink(tr.id)" v-if="$acl.check('configuracao_link')">
                                                <vs-icon icon-pack="material-icons" icon="link"></vs-icon>
                                                Links
                                            </vs-dropdown-item>
                                            <vs-divider></vs-divider>
                                            <vs-dropdown-item @click="updateData(tr.id)" v-if="$acl.check('configuracao_produto_editar')">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>

                                            <vs-dropdown-item @click="deletar(data[indextr].id)" v-if="$acl.check('configuracao_produto_deletar')">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>

                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    <span class="destaque">{{ data[indextr].nome }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].cor">
                                    <div class="w-10 cursor-pointer h-10 rounded-lg m-2 float-left"
                                         :style="{backgroundColor: data[indextr].cor}"
                                         style="cursor: default !important;">
                                    </div>
                                </vs-td>
                                <vs-td :data="data[indextr].conta.nome">
                                    {{ data[indextr].conta.nome || ''}}
                                </vs-td>
                                <vs-td :data="data[indextr].preco">
                                    <span class="destaque"> R$ {{data[indextr].preco}}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].status">
                                    <div class="w-10 h-10 rounded"></div>
                                </vs-td>
                                <vs-td :data="data[indextr].status">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success"
                                             v-if="data[indextr].status"></vs-icon>
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande"
                                             v-else></vs-icon>
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
    import moduleContas from '@/store/contas/moduleContas.js'
    import Divider from "../components/vuesax/divider/Divider";
    import NenhumRegistro from "@/views/components/NenhumRegistro";

    export default {
        name: "Index",
      components: {NenhumRegistro, Divider},
      data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Produtos',
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
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: 'R$ ',
                    suffix: '',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
                //items: {}
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }

            this.getProdutos();
        },
        methods: {
            addNewData() {
                this.$router.push({name: 'produto-criar'});
            },
            showLink(id) {
                this.$router.push({path: '/configuracoes/links/produto/' + id});
            },
            updateData(id) {
                this.$router.push({path: '/configuracoes/produtos/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getProdutos() {
                this.$store.dispatch('getVarios', {rota: 'produtos', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro?`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'produtos'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso'
                            });
                            this.getProdutos();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getProdutos();
            },
            checkPerm(){
                return this.$acl.check('configuracao_produto_editar') || this.$acl.check('configuracao_produto_deletar') || this.$acl.check('configuracao_link')
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getProdutos();
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
