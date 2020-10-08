<template>
    <div>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3" v-if="$acl.check('configuracao_contrato_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Contrato
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
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop" v-if="$acl.check('configuracao_contrato_incluir')">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Contrato
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20" v-show="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div v-if="dados.search">
                                <p class="span-sem-item">Nenhum item foi encontrado</p>
                                <p class="text-sem-item mt-6" v-if="$acl.check('configuracao_contrato_incluir')">
                                    Para inserir novos registros você <br> pode clicar em incluir Contrato.
                                </p>
                            </div>
                            <div v-else>
                                <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                <p class="text-sem-item" v-if="$acl.check('configuracao_contrato_incluir')">
                                    Para inserir novos registros você <br> pode clicar em incluir Contrato.
                                </p>
                            </div>
                            <br>
                            <p v-if="$acl.check('configuracao_contrato_incluir')">
                                <vs-button color="primary" class="float-left botao-incluir mt-6" type="filled"
                                           @click="addNewData">
                                    <vs-icon icon-pack="material-icons" icon="check_circle"
                                             class="icon-grande"></vs-icon>
                                    Incluir Contrato
                                </vs-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" class="table-items vs-con-loading__container" id="div-contrato-list">

                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th>Contrato</vs-th>
                            <vs-th>Numero do Contrato</vs-th>
                            <vs-th>Cartão de postagem</vs-th>
                            <vs-th>Código Adm</vs-th>
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
                                            <vs-dropdown-item @click="ativaContrato(tr)" v-if="$acl.check('configuracao_contrato_editar')">
                                                <vs-icon icon-pack="material-icons" :icon="tr.status ? 'toggle_on' : 'toggle_off'"></vs-icon>
                                                {{tr.status ? 'Desativar' : 'Ativar'}}
                                            </vs-dropdown-item>
                                            <vs-dropdown-item @click="configData(tr.id)" v-if="$acl.check('configuracao_contrato_frete')">
                                                <vs-icon icon-pack="material-icons" icon="directions_bus"></vs-icon>
                                                Formas de frete
                                            </vs-dropdown-item>
                                            <vs-divider></vs-divider>
                                            <vs-dropdown-item @click="updateData(tr.id)" v-if="$acl.check('configuracao_contrato_editar')">
                                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                Editar
                                            </vs-dropdown-item>
                                            <vs-dropdown-item @click="deletar(data[indextr].id)" v-if="$acl.check('configuracao_contrato_deletar')">
                                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                Deletar
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    <span class="destaque">{{ data[indextr].nome }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].contrato">
                                    <span class="destaque">{{data[indextr].contrato}}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].cartaoPostagem">
                                    <span class="destaque">{{ data[indextr].cartaoPostagem }}</span>
                                </vs-td>
                                <vs-td :data="data[indextr].codAdministrativo">
                                    {{ data[indextr].codAdministrativo }}
                                </vs-td>
                                <vs-td :data="data[indextr].status" class="td-icons flex flex-col items-center justify-center">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success"
                                             v-if="data[indextr].status"></vs-icon>
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande"
                                             v-else></vs-icon>
                                    <vx-tooltip :text="tr.erros" position="top">
                                        <vs-icon icon-pack="material-icons" icon="cancel"
                                                 class="icon-grande text-danger"
                                                 v-if="tr.erros"></vs-icon>
                                    </vx-tooltip>
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
    import moduleContrato from '@/store/contratos/moduleContrato.js'

    export default {
        name: "Index",
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Contrato',
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
                countSwitch: []
                //items: {}
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleContrato.isRegistered) {
                this.$store.registerModule('contratos', moduleContrato)
                moduleContrato.isRegistered = true
            }

            this.getItems();
        },
        methods: {
            paginate() {
                console.log('resetou');
                this.currentx = 1;
            },
            addNewData() {
                this.$router.push({name: 'contratos-criar'});
            },
            configData(id) {
                this.$router.push({path: '/configuracoes/contratos/servicos/' + id});
            },
            updateData(id) {
                this.$router.push({path: '/configuracoes/contratos/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems() {
                this.$store.dispatch('getVarios', {rota: 'correios', params: this.dados}).then(response => {
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
                    title: `Deletar conta id: ${id}`,
                    text: 'Deseja deletar este Contrato? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'correios'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'Deletado com sucesso'
                            });
                            this.getItems();
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
            ativaContrato(e) {
                console.log(this.countSwitch)
                if(this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                } else {
                    console.log(e)
                    this.$vs.loading({
                        container: '#div-contrato-list',
                        scale: 0.6
                    });
                    this.$vs.notify({
                        title: 'Aguarde',
                        text: "Conectando no sistema dos correios",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'warning',
                        time: 8000,
                    });
                    let rota = e.status ? 'desativar' : 'ativar';
                    this.$store.dispatch('contratos/ativar', {id: e.id, rota: rota}).then(response => {
                        console.log(response)
                        if(response.data.data.ativo){
                            this.$vs.notify({
                                title: '',
                                text: "Sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                        } else {
                            this.$vs.notify({
                                title: '',
                                text: response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                        }
                        this.$vs.loading.close('#div-contrato-list > .con-vs-loading');
                        this.getItems();
                    }).catch(erro => {
                        this.$vs.notify({
                            title: 'Error',
                            text: erro.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    });
                    this.$vs.loading.close();
                    this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
                }
            },
            checkPerm(){
                return this.$acl.check('configuracao_contrato_editar') || this.$acl.check('configuracao_contrato_deletar') || this.$acl.check('configuracao_contrato_frete')
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
            dados: {
                handler(val) {
                    console.log('mudou');
                    if (val.search) {
                        this.paginate()
                    }
                },
                deep: true
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