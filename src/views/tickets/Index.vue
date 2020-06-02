<template>
    <div>

        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Ticket
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
                                      v-model="dados.search" id="search_input" size="large"
                                      placeholder="Pesquisar por n de ticket ou e-mail do lead"/>
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
                    Incluir Ticket
                </vs-button>
                <!-- SEARCH INPUT -->

            </div>
        </div>

        <vs-row>

            <vs-col vs-w="12">
                <div class="mt-20">
                    <vs-tabs :color="colorx" v-if="nums.abertos">
                        <vs-tab @click="colorx = 'rgb(16, 233, 179)'; getTickets('abertos')" icon-pack="material-icons"
                                icon="fiber_manual_record" color="success" value="10"
                                :label="'abertos ( ' + nums.abertos + ' )'">
                            <listagem :items="tickets"></listagem>
                            <vs-pagination class="mt-2" :total="pagination.last_page"
                                           v-model="currentx"></vs-pagination>
                        </vs-tab>

                        <vs-tab @click="colorx = 'rgb(51, 51, 51)'; getTickets('fechados')" icon-pack="material-icons"
                                icon="fiber_manual_record" color="black" :label="'fechados ( ' + nums.fechados + ' )'">
                            <listagem :items="tickets" :pagination="pagination"></listagem>
                            <vs-pagination class="mt-2" :total="pagination.last_page"
                                           v-model="currentx"></vs-pagination>
                        </vs-tab>

                        <vs-tab @click="colorx = 'warning'; getTickets('todos')" label="todos">
                            <listagem :items="tickets" :pagination="pagination"></listagem>
                            <vs-pagination class="mt-2" :total="pagination.last_page"
                                           v-model="currentx"></vs-pagination>
                        </vs-tab>


                    </vs-tabs>
                </div>
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
                                    Incluir Conta
                                </vs-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-show="items.length > 0">

                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import listagem from './Listagem'
    import moduleTickets from '@/store/tickets/moduleTickets.js'
    import moduleOrigens from '@/store/origens/moduleOrigens.js'
    import moduleDuvidas from '@/store/tipoDuvida/moduleDuvidas.js'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'

    export default {
        name: "Index",
        components: {SideBar, listagem},
        channel: 'saveleads_database_lista-ticket',
        echo: {
            'ListaTicket': (payload, vm) => {
                console.log('evento disparado', payload);
            }
        },
        data() {
            return {
                colorx: 'rgb(16, 233, 179)',
                iconsucess: '<vs-icon icon-pack="material-icons" icon="fiber_manual_record"\n' +
                    '                                           class="icon-grande text-success"\n' +
                    '                                           ></vs-icon>',
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
                currentx: 1,
                tickets: [],
                tipoTicket: 'abertos',
                nums: {}
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }

            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }

            if (!moduleOrigens.isRegistered) {
                this.$store.registerModule('origens', moduleOrigens)
                moduleOrigens.isRegistered = true
            }

            if (!moduleDuvidas.isRegistered) {
                this.$store.registerModule('duvidas', moduleDuvidas)
                moduleDuvidas.isRegistered = true
            }

            this.getTickets();
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
            getTickets(tipo = this.tipoTicket) {
                this.$vs.loading();
                this.tipoTicket = tipo;
                this.$store.dispatch('tickets/getNums').then(response => {
                    console.log('nums', response)
                    this.nums = response
                });
                this.$store.dispatch('tickets/getTickets', {tipo: tipo, params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    this.tickets = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });

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
                            this.getTickets();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar a conta. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getTickets();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getTickets();
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle
            },

        },
        mounted(){
            this.channel.listen('ListaTicket', (payload) => {
                console.log('evento echo')
                //this.getTickets(;
            });
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
