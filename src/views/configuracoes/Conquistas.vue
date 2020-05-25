<template>
    <div>
        <div class="vx-row flex items-end lg:mt-20 sm:mt-6">
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
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Tipo</label>
                <!--<v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="status"/>-->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="mt-20">
                    <div class="vx-row">
                        <div class="vx-col w-full mb-10">
                            <p class="destaque">Configure a estrutura do seu plano de recuperação</p>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full lg:w-3/12 md:w-4/12">
                            <div class="conquista nova">
                                <div class="img-plus">
                                    <i class="material-icons">add</i>
                                </div>
                                <p class="nome-conq">
                                    Adicionar Nova Conquista
                                </p>
                            </div>
                        </div>
                        <div class="vx-col w-full lg:w-3/12 md:w-4/12">
                            <div class="conquista">
                                <img src="" class="img-conquista" alt="">
                                <p class="nome-conq">
                                    Adicionar Nova Conquista
                                </p>
                            </div>
                        </div>
                    </div>
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
            this.getItems();
        },
        methods: {
            getItems() {
                this.$store.dispatch('getVarios', {rota: 'origems', params: this.dados}).then(response => {
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar origem id: ${id}`,
                    text: 'Deseja deletar esta Origem? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'origems'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A Origem foi deletada com sucesso'
                            });
                            this.getItems();
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
                this.getItems();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getItems();
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
