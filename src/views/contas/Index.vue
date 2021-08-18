<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" @finish="getContas"
                  :data="sidebarData"/>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3" v-if="$acl.check('configuracao_conta_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Conta
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
                                      v-model="dados.search" id="search_input" size="large" placeholder="Pesquisar por nome ou integração"/>
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
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Conta
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20" v-show="items.length === 0">
                  <nenhum-registro/>
                </div>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" class="table-items"
                              style="border-spacing: 0 8px;border-collapse: separate;">
                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th>Nome</vs-th>
                            <vs-th>Integração</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3 relative">
                                <vs-td class="flex justify-center items-center relative">
                                    <vs-dropdown vs-trigger-click v-if="$acl.check('configuracao_conta_editar') || $acl.check('configuracao_conta_deletar')">
                                        <vs-button radius color="#EDEDED" type="filled"
                                                   class="btn-more-icon relative botao-menu"
                                                   icon-pack="material-icons" icon="more_horiz"
                                        ></vs-button>
                                        <vs-dropdown-menu class="dropdown-menu-list">
                                            <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>
                                            <vs-dropdown-item @click="updateData(data[indextr])" v-if="$acl.check('configuracao_conta_editar')">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>

                                            <vs-dropdown-item @click="deletar(data[indextr].id)" v-if="$acl.check('configuracao_conta_deletar')">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>

                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                                <vs-td :data="data[indextr].nome" class="relative">
                                    <span class="destaque">{{ data[indextr].nome }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].integracao.descricao" class="relative">
                                    {{ data[indextr].integracao.descricao }}
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
    import SideBar from './SideBar'
    import moduleContas from '@/store/contas/moduleContas.js'

    export default {
        name: "Index",
        components: {SideBar},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Contas',
                dados: {
                    search: '',
                    page: 1
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1
                //items: {}
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }

            this.getContas();
        },
        methods: {
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getContas() {
                this.$store.dispatch('getVarios', {rota: 'contas', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                }).catch(erro => {
                console.log('erro', erro.response);
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar conta id: ${id}`,
                    text: 'Deseja deletar esta Conta? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'contas'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A URL foi deletada com sucesso'
                            });
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar a conta. Contate o suporte.'
                            })
                        }).finally(()=>{
                          this.getContas();
                        })
                    }
                })
            },
            pesquisar(e) {
              this.dados.page = 1;
                e.preventDefault();
                this.$vs.loading();
                this.getContas();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getContas();
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
