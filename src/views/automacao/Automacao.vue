<template>
    <div>
        <div class="vx-row flex items-end mb-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-6/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit.prevent="getItems()">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.pesquisa" id="search_input_trans" size="large"
                                      placeholder="Pesquise por nome do Lead ou Token"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-4">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit.prevent="getItems()">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.responsavel" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por inserção"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-4">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Brinde</label>
                <v-select @change="getItems()" v-model="selectedBrinde" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="brindes"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vs-tabs color="primary" id="div-with-loading" class="vs-con-loading__container">
                    <vs-tab color="primary" value="10" :label="'pendentes'" @click="getItems('pendente')">
                        <listagem :items="items" tipo="pendente"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'com erro'" @click="getItems('comerro')">
                        <listagem :items="items" tipo="comerro"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'preenchida'" @click="getItems('preenchida')">
                        <listagem :items="items" tipo="preenchida"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'com expedição'" @click="getItems('comexpedicao')">
                        <listagem :items="items" tipo="comexpedicao"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'arquivadas'" @click="getItems('arquivadas')">
                        <listagem :items="items" tipo="arquivadas"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'todos'" @click="getItems()">
                        <listagem :items="items" tipo="todos"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button icon-pack="material-icons" icon="email" class="mr-3" color="dark" type="flat" @click="$router.push({name: 'brindes-automacao-emails'})">
                                Configurar E-mails
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleAutomacao from "../../store/automacao/moduleAutomacao";
    import Listagem from './Listagem'
    import moduleBrindes from "../../store/brindes/moduleBrindes";

    export default {
        name: "ListEntrega",
        components: {
            'v-select': vSelect,
            Listagem
        },
        data() {
            return {
                items: [],
                dados: {
                    dt_inicio: '',
                    dt_fim: '',
                    page: 1,
                    length: 30,
                    tipo: 'pendente',
                    responsavel: '',
                    pesquisa: ''
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1,
                    total: 0
                },
                brindes: [],
                selectedBrinde: {id: null, label: 'Filtre por brinde'},
                currentx: 1
            }
        },
        created() {
            if (!moduleAutomacao.isRegistered) {
                this.$store.registerModule('automacao', moduleAutomacao)
                moduleAutomacao.isRegistered = true
            }

            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes)
                moduleBrindes.isRegistered = true
            }
            this.getBrindes();
            this.getItems('pendente');
        },
        methods: {
            getItems(tipo = '') {
                this.$vs.loading();
                if (tipo != 'arquivadas') {
                    this.dados.tipo = tipo;
                    this.dados.arquivadas = false;
                } else
                    this.dados.arquivadas = true;

                this.$store.dispatch('automacao/get', this.dados).then(response => {
                    this.items = response.data;
                    this.pagination = response
                    this.$vs.loading.close();
                });
            },
            getBrindes() {
                this.$store.dispatch('brindes/get').then(response => {
                    this.brindes = [...this.arraySelect(response)];
                });
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                this.dados.page = this.currentx;
                this.getItems();
            },
            selectedBrinde(val) {
                this.$vs.loading();
                this.dados.brinde_id = this.selectedBrinde ? this.selectedBrinde.id : null;
                this.getItems();
            }
        }
    }
</script>

<style scoped>

</style>
