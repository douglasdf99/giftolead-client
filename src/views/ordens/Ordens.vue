<template>
    <div>
        <detalhe-comissao v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                          :data="sidebarData" :empresa="empresa"/>
        <div class="vx-row flex items-center lg:mt-5 sm:mt-6 justify-between">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por usuário"/>
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
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Valor das Ordens</span>
                    <p class="font-bold text-3xl my-5" v-bind:class="{'text-warning' : !dados.pago, 'text-success' : dados.pago}">R$ {{formatPrice(soma)}}</p>
                </vx-card>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems(0); dados.aba = 'pagar'" color="warning" value="10"
                            :label="'pagar ordens' + ( dados.aba === 'pagar' ? ` (${ordens.length})` : '')">
                        <listagem :items="ordens" @action="action" @visualizar="visualizar" tipo="pagar"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems(1); dados.aba = 'pago'" color="success"
                            :label="'ordens pagas' + ( dados.aba === 'pago' ? ` (${ordens.length})` : '')">
                        <listagem :items="ordens" @action="action" @visualizar="visualizar" tipo="pago"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import DetalheComissao from '../ordens/DetalheOrdem'
    import listagem from './Listagem'
    import vSelect from 'vue-select'
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleOrdens from "../../store/ordens/moduleOrdens";

    export default {
        name: "Ordens",
        components: {DetalheComissao, listagem, 'v-select': vSelect},
        data() {
            return {
                colorx: 'warning',

                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                empresa: {},

                search: '',
                dados: {
                    search: '',
                    page: 1,
                    length: 25,
                    aba: 'pagar',
                    pago: 0
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                lengths: saveleadsConfig.lengths,
                currentx: 1,
                ordens: [],
                tipoCom: 'pendente',
                soma: 0,
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleOrdens.isRegistered) {
                this.$store.registerModule('ordens', moduleOrdens)
                moduleOrdens.isRegistered = true
            }

            this.getItems(0);
        },
        methods: {
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                console.log('editando', obj)
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems(pago = 0) {
                this.dados.pago = pago
                this.$vs.loading();

                let url = '';
                let control = 0;//Controla entradas em cada condição
                if (this.search !== '') {
                    url += 'name:' + this.search + ';';
                    url += 'email:' + this.search;
                    control++;
                }

                if (control >= 2)
                    url += '&searchJoin=and';

                this.dados.search = url;

                this.$store.dispatch('ordens/getOrdens', this.dados).then(response => {
                    console.log('retornado com sucessso', response)
                    this.ordens = [...response[0].data]
                    this.pagination = response[0];
                    this.empresa = response.empresa;
                    this.soma = parseFloat(response.soma);
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems(this.dados.pago);
            },
            visualizar(obj) {
                console.log('entrou no visualizar')
                this.sidebarData = obj;
                this.toggleDataSidebar(true);
            },
            action(obj) {
                let ids = obj.ids.map(item => {
                    return item.id
                });
                this.$vs.loading();
                this.$store.dispatch('ordens/' + obj.method, ids).then(() => {
                    this.$vs.notify({
                        color: 'success',
                        text: 'Operação realizada com sucesso.'
                    });
                    this.getItems(this.dados.pago);
                }).catch(erro => {
                    console.log('erro', erro);
                });
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
            selectedUser() {
                this.$vs.loading();
                this.dados.page = 1;
                this.getItems();
            },
            selectedResp() {
                this.$vs.loading();
                this.dados.page = 1;
                this.getItems();
            },
            dados: {
                handler(val) {
                    console.log(val.length)
                    if (val.length != this.pagination.per_page) {
                        this.dados.page = 1;
                        this.$vs.loading();
                        this.getItems();
                    }
                },
                deep: true
            },
        },
        mounted() {
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
