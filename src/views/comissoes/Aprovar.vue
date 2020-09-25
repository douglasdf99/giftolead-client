<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData" @action="action"/>
        <div class="vx-row flex items-end lg:mt-5 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-4/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por n de ticket ou e-mail do lead"/>
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
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <select-responsaveis @chooseResp="chooseResp" />
            </div>
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <label class="vs-input--label">Atendente</label>
                <v-select v-model="selectedAten" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="usuarios"/>
            </div>
        </div>
        <div class="vx-row mt-10 -mb-4">
            <div class="vx-col w-full">
                <vs-dropdown vs-trigger-click class="cursor-pointer float-right">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentx * dados.length - (dados.length - 1) }} - {{ pagination.total - currentx * dados.length > 0 ? currentx * dados.length : pagination.total }} de {{ pagination.total }}</span>
                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
                    </div>
                    <vs-dropdown-menu>
                        <vs-dropdown-item v-for="(item, index) in lengths" key="index" @click="dados.length = item">
                            <span>{{item}}</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'rgb(16, 233, 179)'; getItems('pendente');" color="success" value="10"
                            :label="'pendentes' + (tipoCom == 'pendente' ? ` (${comissoes.length})` : '')">
                        <listagem @action="action" @visualizar="visualizar" @update="updateData" @delete="deletar" :items="comissoes"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'rgb(51, 51, 51)'; getItems('reprovado')" color="danger"
                            :label="'reprovados' + (tipoCom == 'reprovado' ? ` (${comissoes.length})` : '')">
                        <listagem @action="action" @visualizar="visualizar" @update="updateData" @delete="deletar" :items="comissoes"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
                <div class="vx-row mt-20" v-show="comissoes.length === 0">
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
                        </div>
                    </div>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SelectResponsaveis from "../components/SelectResponsaveis";
    import SideBar from './SideBar'
    import listagem from './Listagem'
    import vSelect from 'vue-select'
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleComissoes from "../../store/comissoes/moduleComissoes";
    import moduleCampAgendamentos from "../../store/campanha_agendamento/moduleCampAgendamentos";
    import moduleCampBoletos from "../../store/campanha_boleto/moduleCampBoletos";
    import moduleCampCanceladas from "../../store/campanha_canceladas/moduleCampCanceladas";
    import moduleUsuario from "../../store/usuarios/moduleUsuario";
    import moduleCampWhatsapp from "../../store/campanha_whatsapp/moduleCampWhatsapp";

    export default {
        name: "Index",
        components: {SideBar, listagem, 'v-select': vSelect, SelectResponsaveis},
        data() {
            return {
                colorx: 'rgb(16, 233, 179)',
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                search: '',
                dados: {
                    search: '',
                    page: 1,
                    length: 25
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                lengths: saveleadsConfig.lengths,
                currentx: 1,
                comissoes: [],
                tipoCom: 'pendente',
                selectedAten: {id: null, label: 'Selecione atendente'},
                selectedResp: null,

                //responsaveis
                usuarios: [],
                whats: [],
                canceladas: [],
                agendadas: [],
                boletos: [],

                agentes: [],
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleComissoes.isRegistered) {
                this.$store.registerModule('comissoes', moduleComissoes)
                moduleComissoes.isRegistered = true
            }

            if (!moduleCampAgendamentos.isRegistered) {
                this.$store.registerModule('agendadas', moduleCampAgendamentos)
                moduleCampAgendamentos.isRegistered = true
            }

            if (!moduleCampBoletos.isRegistered) {
                this.$store.registerModule('boletos', moduleCampBoletos)
                moduleCampBoletos.isRegistered = true
            }

            if (!moduleCampCanceladas.isRegistered) {
                this.$store.registerModule('canceladas', moduleCampCanceladas)
                moduleCampCanceladas.isRegistered = true
            }

            if (!moduleCampWhatsapp.isRegistered) {
                this.$store.registerModule('whats', moduleCampWhatsapp)
                moduleCampWhatsapp.isRegistered = true
            }

            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('users', moduleUsuario)
                moduleUsuario.isRegistered = true
            }
            this.getOpcoes();
            this.getItems();
        },
        methods: {
            openAlert(title, text, color, id = null) {
                this.$vs.dialog({
                    color: color,
                    title: title,
                    text: text,
                    accept: () => {
                        if (id != null)
                            this.$router.push({path: `/comissoes/atender/${id}`});
                    },
                    acceptText: 'Ir até ele'
                })
            },
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
            getItems(tipo = this.tipoCom) {
                this.$vs.loading();
                this.dados.tipo = tipo;
                this.tipoCom = tipo;

                let url = '';
                let control = 0;//Controla entradas em cada condição
                if (this.search !== '') {
                    url += 'lead.email:' + this.search + ';';
                    url += 'ticket.id:' + this.search;
                    control++;
                }

                if (this.selectedResp != null) {
                    this.dados.criador_type = this.selectedResp.criador_type;
                    this.dados.criador_id = this.selectedResp.id;
                } else {
                    this.dados.criador_id = null;
                    this.dados.criador_type = null;
                }

                if (this.selectedAten.id != null) {
                    this.dados.atendente_id = this.selectedAten.id
                }

                if (control >= 2)
                    url += '&searchJoin=and';

                this.dados.search = url;

                this.$store.dispatch('comissoes/getPreCom', {params: this.dados}).then(response => {
                    console.log('retornado com sucessso', response)
                    this.pagination = response;
                    this.comissoes = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
            },
            getOpcoes(){
                this.selectedAten.label = 'Carregando...';
                this.$store.dispatch('users/get').then(response => {
                    this.usuarios = [...this.arraySelect(response)];
                    this.selectedAten.label = 'Selecione o atendente';
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'comissoes'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A URL foi deletada com sucesso'
                            });
                            this.$vs.loading.close()
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
            action(obj) {
                console.log('array aí', obj);
                this.$vs.dialog({
                    color: 'primary',
                    title: obj.method == 'aprovar' ? 'Aprovar' : obj.method == 'reprovar' ? 'Reprovar' : 'Restaurar' + ` pré comissão?`,
                    text: `Deseja ${obj.method} esta comissão?`,
                    acceptText: 'Sim',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch(`comissoes/action`, obj).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Aprovado com sucesso'
                            });
                            this.toggleDataSidebar(false);
                            this.getItems();
                        }).catch(erro => {
                            console.log(erro.response.data.message)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: erro.response.data.message
                            })
                        }).finally(() => this.$vs.loading.close())
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            },
            visualizar(obj) {
                console.log('obj detalhe', obj);
                if (obj.tipo != 'reprovado') {
                    this.sidebarData = obj;
                    this.toggleDataSidebar(true);
                }
            },

            chooseResp(obj){
                this.selectedResp = obj;
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
            selectedAten() {
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
