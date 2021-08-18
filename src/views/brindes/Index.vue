<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @paginate="paginate" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3" v-if="$acl.check('configuracao_brinde_incluir')">
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
                        <form @input="pesquisar">
                            <vs-input autocomplete class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg" v-model="dados.search" id="search_input" size="large"
                                      placeholder="Nome do brinde, nome do produto ou medidas"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop" v-if="$acl.check('configuracao_brinde_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Brinde
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="com-item" v-if="items.length > 0">
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th>Brinde</vs-th>
                            <vs-th>Produto</vs-th>
                            <vs-th>Peso (Kg)</vs-th>
                            <vs-th>Largura (cm)</vs-th>
                            <vs-th>Altura (cm)</vs-th>
                            <vs-th>Comprimento (cm)</vs-th>

                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td class="flex justify-center items-center">
                                    <vs-dropdown vs-trigger-click v-if="$acl.check('configuracao_brinde_editar') || $acl.check('configuracao_brinde_deletar')">
                                        <vs-button radius color="#EDEDED" type="filled"
                                                   class="btn-more-icon relative botao-menu"
                                                   icon-pack="material-icons" icon="more_horiz"
                                        ></vs-button>
                                        <vs-dropdown-menu class="dropdown-menu-list">
                                            <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>
                                            <vs-dropdown-item @click="$router.push({path: '/configuracoes/contratos/editar/' + tr.contrato.id})" v-if="$acl.check('configuracao_contrato_editar') && !tr.contrato.deleted_at">
                                                <vs-icon icon-pack="feather" icon="icon-file-text"></vs-icon>
                                                Editar Contrato
                                            </vs-dropdown-item>
                                            <vs-dropdown-item @click="updateData(data[indextr])" v-if="$acl.check('configuracao_brinde_editar')">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>
                                            <vs-dropdown-item @click="deletar(data[indextr].id)" v-if="$acl.check('configuracao_brinde_deletar')">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>

                                <vs-td v-if="data[indextr].produto && data[indextr].produto.nome"
                                       :data="data[indextr].produto.nome">
                                    {{ data[indextr].produto.nome }}
                                </vs-td>
                                <vs-td v-else>
                                    produto indefinido
                                </vs-td>
                                <vs-td :data="data[indextr].peso">
                                    {{ tr.hasembalagem ? tr.embalagem.peso : data[indextr].peso }}
                                </vs-td>
                                <vs-td :data="data[indextr].largura">
                                    {{ tr.hasembalagem ? tr.embalagem.largura : data[indextr].largura }}
                                </vs-td>
                                <vs-td :data="data[indextr].altura">
                                    {{ tr.hasembalagem ? tr.embalagem.altura : data[indextr].altura }}
                                </vs-td>
                                <vs-td :data="data[indextr].comprimento">
                                    {{ tr.hasembalagem ? tr.embalagem.comprimento : data[indextr].comprimento }}
                                </vs-td>
                                <vs-td :data="data[indextr].ativo" class="td-icons flex flex-col items-center justify-center">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success"
                                             v-if="data[indextr].ativo"></vs-icon>
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande"
                                             v-else></vs-icon>
                                    <vx-tooltip text="Contrato desativado ou deletado" position="top">
                                        <vs-icon icon-pack="material-icons" icon="cancel" class="icon-grande text-danger" v-if="!tr.contrato.status && tr.contrato_type == 'App\\Models\\Correio'"></vs-icon>
                                    </vx-tooltip>
                                    <vx-tooltip text="Contrato desativado ou deletado" position="top">
                                        <vs-icon icon-pack="material-icons" icon="cancel" class="icon-grande text-danger"
                                                 v-if="tr.contrato.extensao && !tr.contrato.extensao.ativo"></vs-icon>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>

                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
                <div class="vx-row mt-20 flex justify-center" v-else>
                  <nenhum-registro></nenhum-registro>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'
    import NenhumRegistro from "../components/NenhumRegistro";

    export default {
        name: "Index",
        components: {NenhumRegistro, SideBar},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Brindes',
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
            this.$vs.loading();
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes);
                moduleBrindes.isRegistered = true;
            }
            this.getBrindes();
        },
        methods: {
            paginate() {
                console.log('resetou');
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
                this.$store.dispatch('getVarios', {rota: 'brindes', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                }).finally(()=>{
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
                        this.$store.dispatch('deleteItem', {id: id, rota: 'brindes'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso'
                            });
                            this.getBrindes();
                        }).catch(erro => {
                            this.$vs.notify({
                                color: 'danger',
                                title: '',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        }).finally(()=>{
                          this.$vs.loading.close()
                        })
                    }
                })
            },
            pesquisar(e) {
                this.dados.page = 1;
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
<style>
    .td-icons > span {
        display: flex;
    }
</style>
