<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData" @getItems="getItems('pendente')"/>
        <endereco v-if="modalEndereco" :automacao="automacaoSelected" @getItems="getItems" :isSidebarActive="modalEndereco" @closeSidebar="toggleDataSidebarEnd"
                  :data="endereco"/>
        <reenviar v-if="responderTicket" :isSidebarActive="responderTicket" @closeSidebar="toggleRespostaSidebar" @getItems="getItems"
                  :data="aresponder"/>
        <div class="vx-row flex items-end mb-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-4/12 xlg:w-6/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit.prevent="pesquisar()">
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
                        <form @submit.prevent="pesquisar()">
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
                <v-select @change="pesquisar()" v-model="selectedBrinde" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="brindes"/>
            </div>
            <div class="vx-col w-full lg:w-2/12 sm:w-full">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Automacão
                </vs-button>
            </div>

        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vs-tabs color="primary" id="div-with-loading" class="vs-con-loading__container">
                    <vs-tab color="primary" value="10" :label="'todos'" @click="getItems('')">
                        <listagem @reenviarWhats="reenviarWhats" :items="items" @editarEnd="editarEndereco" tipo="todos" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'pendentes'" @click="getItems('pendente')">
                        <listagem @reenviarWhats="reenviarWhats" :items="items" tipo="pendente" @editarEnd="editarEndereco" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'com erro'" @click="getItems('comerro')">
                        <listagem :items="items" @reenviarWhats="reenviarWhats" @editarEnd="editarEndereco" tipo="comerro" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'preenchida'" @click="getItems('preenchida')">
                        <listagem :items="items" @editarEnd="editarEndereco" tipo="preenchida" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'com expedição'" @click="getItems('comexpedicao')">
                        <listagem :items="items " @editarEnd="editarEndereco" tipo="comexpedicao" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'arquivadas'" @click="getItems('arquivadas')">
                        <listagem :items="items" @editarEnd="editarEndereco" tipo="arquivadas" @getItems="getItems"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button icon-pack="material-icons" icon="email" class="float-right mr-3" color="dark" type="flat"
                               @click="$router.push({name: 'brindes-automacao-emails'})" :disabled="!$acl.check('brinde_automacao_email')">
                        Configurar E-mails
                    </vs-button>
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
import SideBar from './SideBar';
import endereco from './Endereco'
import reenviar from './Whatsapp'
import moduleWhatsList from "@/store/whatsapplist/moduleWhatsList";


export default {
    name: "ListEntrega",
    components: {
        'v-select': vSelect, Listagem,
        SideBar, endereco, reenviar
    },
    data() {
        return {
            items: [],
            addNewDataSidebar: false,
            responderTicket: false,
            aresponder: {},
            sidebarData: '',
            modalEndereco: false,
            automacaoSelected: {},
            endereco: {
                telefone: ''
            },
            dados: {
                dt_inicio: '',
                dt_fim: '',
                page: 1,
                length: 30,
                tipo: '',
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

        if (!moduleWhatsList.isRegistered) {
            this.$store.registerModule('whatsapplist', moduleWhatsList)
            moduleWhatsList.isRegistered = true
        }
        this.getBrindes();
        this.getItems();
    },
    methods: {
        toggleDataSidebarEnd(val = false) {
            this.modalEndereco = val
        },
        reenviarWhats(dados){
            this.aresponder = dados;
            this.toggleRespostaSidebar(true);
        },
        toggleRespostaSidebar(val = false) {
            this.responderTicket = val;
        },
        //Editar endereço da automação
        editarEndereco(obj) {
          this.automacaoSelected = {...obj};
            if (obj.endereco) {
                this.endereco = {...obj.endereco};
                this.endereco.ddd = this.endereco.telefone.substring(0, 2);
                this.endereco.telefone = this.endereco.telefone.replace(this.endereco.ddd, '');
            }else{
              this.endereco = {id: null};
            }

            this.modalEndereco = true;
        },
        getItems(tipo = this.dados.tipo) {
            console.log('tipo', tipo)
            this.$vs.loading();
            if (tipo != 'arquivadas') {
                this.dados.tipo = tipo;
                this.dados.arquivadas = 0;
            } else {
                this.dados.arquivadas = 1;
                this.dados.tipo = null;
            }

            this.$store.dispatch('automacao/get', this.dados).then(response => {
                this.items = response.data;
                this.pagination = response
            }).finally(()=>{
              this.$vs.loading.close();
            });
        },
        pesquisar(){
          this.dados.page = 1;
          this.getItems();
        },
        addNewData() {
            this.sidebarData = {'brindes': this.brindes}
            this.toggleDataSidebar(true)
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
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
