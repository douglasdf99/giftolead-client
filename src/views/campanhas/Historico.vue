<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
        <div class="vx-row mb-3">
            <div class="vx-col w-full" v-if="historico.length > 0">
                <p class="destaque text-2xl">{{historico[0].campanha.nome}}</p>
            </div>
        </div>
        <div class="vx-row flex items-end lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input" size="large"
                                      placeholder="Pesquisar por e-mail do lead"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
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
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="historico.length === 0">
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
                    <vs-table v-model="selected" :data="historico" @selected="handleSelected" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Lead</vs-th>
                            <vs-th>Assunto</vs-th>
                            <vs-th>Data e Hora</vs-th>
                            <vs-th>Status</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="mb-3 cursor-pointer">
                                <vs-td>{{tr.contato ? tr.contato.email : ''}}</vs-td>
                                <vs-td>{{tr.email.assunto}}</vs-td>
                                <vs-td><span class="destaque">{{ tr.email.created_at | formatDateTime}}</span></vs-td>
                                <vs-td>
                                    <vs-chip v-if="tr.eventos_entrega.length > 0"
                                             :color="tr.eventos_entrega[0].resposta === 'success' ? '#2ecc71' : '#e74c3c'"
                                             class="product-order-status">
                                        {{ tr.eventos_entrega[0].evento }}
                                    </vs-chip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/campanha/configurar-checkout/' + historico[0].campanha_id})">
                                Voltar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import moduleCampCheckouts from "@/store/campanha_checkout/moduleCampCheckouts";
    import SideBar from './DetalheHistorico'

    export default {
        name: "Historico",
        components: {
            SideBar
        },
        computed: {
            items() {
                return this.$store.state.items;
            },
        },
        created() {
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            this.getId(this.$route.params.id);
        },
        data() {
            return {
                statusObj: {
                    Processado: ['#2ecc71'],
                    Cancelado: ['#e74c3c'],
                    Entregue: ['#2ecc71'],
                    Desistiu: ['#2ecc71'],
                    Pulo: ['#2ecc71'],
                    Bloqueado: ['#2ecc71'],
                    Aberto: ['#2ecc71'],
                    Clicou: ['#2ecc71'],
                    Reportado: ['#2ecc71'],
                    Cancelarsubscricao: ['#2ecc71'],
                },
                currentx: 1,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dados: {
                    search: '',
                    page: 1,
                },
                historico: [],
                addNewDataSidebar: false,
                sidebarData: {},
                selected: []
            }
        },
        methods: {
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.dados.page = 1;
                this.pagination.current_page = 1;
                this.currentx = 1;
                this.getId(this.$route.params.id);
            },
            handleSelected(tr) {
                this.sidebarData = tr;
                this.toggleDataSidebar(true);
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getId(id) {
                this.$vs.loading();
                let url = '';
                if (this.search !== '') {
                    url += 'contato.nome:' + this.search + ';';
                    url += 'contato.email:' + this.search + ';';
                    url += 'campanha.nome:' + this.search;
                }
                this.dados.search = url;
                this.$store.dispatch('checkout/getHistorico', {id: id, params: this.dados}).then(response => {
                    this.historico = response.data;
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                this.dados.page = val;
                this.getId(this.$route.params.id);
            }
        },
    }
</script>

<style scoped>

</style>