<template>
    <div>
        <div class="vx-row flex items-end lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input_trans" size="large" placeholder="Pesquisar por título"/>
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
                <label class="vs-input--label">Tipo</label>
                <v-select v-model="selectedTipo" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="[{id: '1', label: 'Global'}, {id: '0', label: 'Produto'}]"/>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="mt-20">
                    <div class="vx-row">
                        <div class="vx-col col-conquista mb-10">
                            <div class="conquista nova cursor-pointer"
                                 @click="$router.push({path: '/configuracoes/conquistas/nova'})">
                                <div class="img-plus">
                                    <i class="material-icons">add</i>
                                </div>
                                <p class="nome-conq">
                                    Adicionar Nova Conquista
                                </p>
                            </div>
                        </div>
                        <div class="vx-col col-conquista mb-10" v-for="item in items">
                            <div class="conquista">
                                <div class="py-2 w-full">
                                    <vs-switch vs-icon-on="check" color="#0FB599" v-model="item.ativo"
                                               class="float-right switch" @click="ativaConquista(item)"/>
                                    <!--<span class="float-right mt-1 mx-4" style="font-weight: bold">Ativação da Origem</span>-->
                                </div>
                                <div class="conquista-clicavel w-full cursor-pointer" @click="$router.push({path: '/configuracoes/conquistas/editar/' + item.id})">
                                    <img :src="url_api(item.imagem)" class="img-conquista my-4" alt="" width="150">
                                    <p class="nome-conq">
                                        {{item.nome}}
                                    </p>
                                    <p>{{item.global ? 'Global' : 'Produto'}} / {{item.perfil}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import moduleConquistas from '@/store/conquistas/moduleConquistas.js'
    import vSelect from 'vue-select'

    export default {
        name: "Index",
        components: {
            'v-select': vSelect
        },
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
                currentx: 1,
                selectedTipo: {},
                countSwitch: []
                //items: {}
            }
        },
        created() {
            if (!moduleConquistas.isRegistered) {
                this.$store.registerModule('conquistas', moduleConquistas)
                moduleConquistas.isRegistered = true
            }
            this.$vs.loading()
            this.getItems();
        },
        methods: {
            getItems() {
                if (this.selectedTipo !== null)
                    this.dados.global = this.selectedTipo.id;
                else this.dados.global = '';

                this.$store.dispatch('getVarios', {rota: 'conquistas', params: this.dados}).then(response => {
                    this.pagination = response;
                    //this.items = response.data
                    this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            },
            ativaConquista(e) {
                console.log(this.countSwitch)
                if(this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    e.status = !e.status;
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                } else {
                    console.log(e)
                    const formData = new FormData();
                    let ativo = e.ativo ? 0 : 1;
                    let text = e.ativo ? 'Desativada' : 'Ativada';
                    formData.append('ativo', ativo);
                    formData.append('_method', 'PUT');
                    formData.append('nome', e.nome);
                    formData.append('descricao', e.descricao);
                    formData.append('quantidade', e.quantidade);
                    formData.append('valor', e.valor);
                    formData.append('porcentagem', e.porcentagem);
                    formData.append('tipo', e.tipo);
                    formData.append('perfil', e.perfil);
                    formData.append('global', e.global);
                    this.$store.dispatch('conquistas/update', {id: e.id, dados: formData}).then(() => {
                        this.$vs.notify({
                            title: '',
                            text: text + " com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                    }).catch(erro => {
                        this.$vs.notify({
                            title: 'Error',
                            text: erro.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
                    this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
                }
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
            selectedTipo(){
                this.$vs.loading();
                this.dados.page = 1;
                this.getItems();
            }
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
