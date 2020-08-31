<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-end lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.pesquisa" id="search_input" size="large"
                                      placeholder="Pesquisar por nome ou email do destinatário"/>
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
            <div class="vx-col w-full lg:w-1/2">
                <label class="vs-input--label">Brinde</label>
                <v-select v-model="selectedBrinde" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="brindes"/>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems('pendente')" color="warning" value="10" v-if="pagination" :label="'pendentes' + (dados.status == 'pendente' ? ' (' + items.length + ')' : '')">
                        <listagem @fecharVarias="fecharVarias" @visualizar="visualizar" @editar="editar" :items="items" tipo="pendente" v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems('fechada')" color="success" value="10"
                            :label="'fechadas' + (dados.status == 'fechada' ? ' (' + items.length + ')' : '')">
                        <listagem @visualizar="visualizar" :items="items" tipo="fechada" v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'primary'; getItems('todos')" color="primary" value="10"
                            :label="'todos' + (dados.status == 'todos' ? ' (' + items.length + ')' : '')">
                        <listagem @visualizar="visualizar" :items="items" tipo="todos" v-if="items.length > 0"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div v-if="dados.search === null">
                                <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                <p class="text-sem-item">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>
                            </div>
                            <div v-else>
                                <p class="span-sem-item">Nenhum item foi encontrado</p>
                                <p class="text-sem-item mt-6">
                                    Para inserir novos registros você <br> pode clicar em incluir conta.
                                </p>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
            </vs-col>
        </vs-row>
        <vs-prompt
                @cancel="modaleditar = false"
                @accept="update"
                acceptText="Salvar"
                cancelText="Cancelar"
                :title="'Editar informações'"
                :max-width="'600px'"
                :active.sync="modaleditar">
            <div class="con-exemple-prompt">
                <div class="mb-3">
                    <span class="font-regular mb-2">Nome do destinatário</span>
                    <vs-input class="w-full" v-validate="'required'" name="remetenteEstado" v-model="val.nome_destinatario" size="large"/>
                </div>
                <div class="mb-3">
                    <span class="font-regular mb-2">E-mail do destinatário</span>
                    <vs-input class="w-full" v-validate="'required'" name="remetenteEstado" v-model="val.email_destinatario" size="large"/>
                </div>
                <div class="mb-3">
                    <span class="font-regular mb-2">Brinde</span>
                    <v-select v-model="selectedEditBrinde" class="mb-2" :class="'select-large-base'" :clearable="false"
                              :options="brindesEdit" v-validate="'required'" name="variavel"/>
                </div>
            </div>
        </vs-prompt>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import listagem from './Listagem'
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'
    import vSelect from 'vue-select'
    import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";

    export default {
        name: "Index",
        components: {
            listagem,
            'v-select': vSelect,
            SideBar
        },
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},

                dados: {
                    pesquisa: null,
                    page: 1,
                    length: 30,
                    status: 'pendente',
                    brinde_id: null
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1,
                colorx: 'warning',
                selectedBrinde: {},
                brindes: [],
                brindesCru: [],
                //items: {}

                //Prompt Editar
                modaleditar: false,
                val: {
                    nome_destinatario: '',
                    email_destinatario: '',
                    brinde_id: null
                },
                selectedEditBrinde: {},
                brindesEdit: []
            }
        },
        created() {
            this.$vs.loading();
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes);
                moduleBrindes.isRegistered = true;
            }

            if (!moduleExpedicoesBrindes.isRegistered) {
                this.$store.registerModule('expedicao', moduleExpedicoesBrindes);
                moduleExpedicoesBrindes.isRegistered = true;
            }
            this.$vs.loading.close();
            this.getOpcoes();
            this.getItems();
        },
        methods: {
            paginate() {
                console.log('resetou');
                this.currentx = 1;
            },
            visualizar(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems(status = 'pendente') {
                this.$vs.loading();
                this.dados.status = status;
                this.$store.dispatch('getVarios', {rota: 'expedicaos', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response);
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
            getOpcoes(){
                this.$store.dispatch('brindes/get').then(response => {
                    this.brindes = [...this.arraySelect(response)];
                    this.brindesCru = [...response];
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
                            this.getItems();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: '',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            },

            //Procedimentos
            fecharVarias(arr, rota, tipo){
                console.log('fechando várias', arr)
                let arr2 = arr.map(item => {return item.id});
                this.$vs.dialog({
                    color: 'primary',
                    title: (rota == 'fechar' ? 'Fechar' : 'Restaurar' ) + ` expedições?`,
                    text: 'Deseja mesmo ' + rota + ' as expedições selecionadas?',
                    acceptText: 'Sim!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('expedicao/fecharVarias', {arr: arr2, rota: rota}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Procedimento realizado com sucesso'
                            });
                            this.getItems(tipo);
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao finalizar. Reinicie a página.'
                            })
                        });
                    }
                })

            },

            //Prompt Editar
            editar(obj){
                this.modaleditar = true;
                this.brindesEdit = [];
                this.brindesCru.forEach(item => {
                    if(obj.produto_id == item.produto_id){
                        this.brindesEdit.push({id: item.id, label: item.nome});
                    }
                });
                this.val = {...obj};
                this.selectedEditBrinde = {id: obj.brinde.id, label: obj.brinde.nome};
            },
            update(){
                console.log(this.selectedEditBrinde);
                this.val.brinde_id = this.selectedEditBrinde.id;
                this.$vs.loading();
                this.$store.dispatch('expedicao/store', this.val).then(() => {
                    this.val = {};
                    this.$vs.notify({
                        color: 'success',
                        title: '',
                        text: 'Salvo com sucesso'
                    });
                    this.getItems();
                }).catch(erro => {
                    console.log(erro)
                    this.$vs.notify({
                        color: 'danger',
                        title: 'Erro',
                        text: 'Algo deu errado ao finalizar. Reinicie a página.'
                    })
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
            selectedBrinde(val){
                this.$vs.loading();
                this.dados.brinde_id = this.selectedBrinde != null ? this.selectedBrinde.id : null;
                this.getItems();
            },
            selectedEditBrinde(val){
                console.log(val)
            }
        },
        computed: {
            items() {
                return this.$store.state.items;
            },
        },

    }
</script>
<style>
    .td-icons > span {
        display: flex;
    }
</style>