<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData" @paginate="paginate"/>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3" v-if="$acl.check('configuracao_embalagens_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Brinde
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
                                      v-model="dados.search" id="search_input" size="large"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
                                <button type="submit"
                                        style="border: none; background: transparent; cursor: pointer;">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop" v-if="$acl.check('configuracao_embalagens_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Embalagem
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div v-if="dados.search === null">
                                <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                <p class="text-sem-item" v-if="$acl.check('configuracao_embalagens_incluir')">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>
                            </div>
                            <div v-else>
                                <p class="span-sem-item">Nenhum item foi encontrado</p>
                                <p class="text-sem-item mt-6" v-if="$acl.check('configuracao_embalagens_incluir')">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>

                            </div>
                            <br>
                            <p v-if="$acl.check('configuracao_embalagens_incluir')">
                                <vs-button color="primary" class="float-left botao-incluir mt-6" type="filled"
                                           @click="addNewData">
                                    <vs-icon icon-pack="material-icons" icon="check_circle"
                                             class="icon-grande"></vs-icon>
                                    Incluir Embalagem
                                </vs-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-else>
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th>Embalagem</vs-th>
                            <vs-th>Peso (Kg)</vs-th>
                            <vs-th>Largura (cm)</vs-th>
                            <vs-th>Altura (cm)</vs-th>
                            <vs-th>Comprimento (cm)</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td class="flex justify-center items-center">
                                    <vs-dropdown vs-trigger-click v-if="$acl.check('configuracao_embalagens_editar') || $acl.check('configuracao_embalagens_deletar')">
                                        <vs-button radius color="#EDEDED" type="filled"
                                                   class="btn-more-icon relative botao-menu"
                                                   icon-pack="material-icons" icon="more_horiz"
                                        ></vs-button>
                                        <vs-dropdown-menu class="dropdown-menu-list">
                                            <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>
                                            <vs-dropdown-item @click="updateData(data[indextr])" v-if="$acl.check('configuracao_embalagens_editar')">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>

                                            <vs-dropdown-item @click="deletar(data[indextr].id)" v-if="$acl.check('configuracao_embalagens_deletar')">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>

                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>
                                <vs-td :data="data[indextr].peso">
                                    {{ data[indextr].peso }}
                                </vs-td>
                                <vs-td :data="data[indextr].largura">
                                    {{ data[indextr].largura }}
                                </vs-td>
                                <vs-td :data="data[indextr].altura">
                                    {{ data[indextr].altura }}
                                </vs-td>
                                <vs-td :data="data[indextr].comprimento">
                                    {{ data[indextr].comprimento }}
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
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'

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
                    search: null,
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
            // if (!moduleBrindes.isRegistered) {
            //     this.$store.registerModule('brindes', moduleBrindes)
            //   moduleBrindes.isRegistered = true
            // }

            this.getBrindes();
        },
        methods: {
            paginate() {
                this.currentx = 1;
            },
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
            getBrindes() {
                this.$store.dispatch('getVarios', {rota: 'embalagems', params: this.dados}).then(response => {
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
                    text: 'Deseja mesmo deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'embalagens'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso'
                            });
                            this.getBrindes();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: '',
                                text: 'Algo deu errado ao deletar o registro. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getBrindes();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getBrindes();
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
