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
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="mt-20">
                    <div class="vx-row">
                        <div class="vx-col col-conquista mb-10">
                            <div class="conquista">
                                <div class="flex items-center text-left">
                                    <div class="py-2 w-1/2">
                                        <p class="font-bold text-black text-md mb-0">Contrato com os correios</p>
                                    </div>
                                    <div class="py-2 w-1/2">
                                        <vs-switch @click="ativaExt(extensoes.correios)" vs-icon-on="check" color="#0FB599" v-model="extensoes.correios.ativo" class="float-right switch" v-if="extensoes.correios != null"/>
                                    </div>
                                </div>
                                <div class="w-full my-3">
                                    <img src="@/assets/images/util/correios.svg" class="img-conquista my-4" alt="" width="150">
                                    <p class="mb-4">Integre o seu contrato com os correios para enviar brindes físicos à seus clientes</p>
                                </div>
                                <div class="conquista-clicavel w-full cursor-pointer my-3">
                                    <vs-button class="text-black rounded-full w-full border-solid font-bold" style="border-color: #9AAABE; border-width: 1px" color="#F4F4F4">
                                        {{extensoes.correios != null ? 'Detalhar' : 'Instalar'}}</vs-button>
                                </div>
                                <p class="w-full font-bold text-lg text-left" style="color: #9AAABE">R$ 20,00 / mês</p>
                            </div>
                        </div>
                        <div class="vx-col col-conquista mb-10">
                            <div class="conquista">
                                <div class="flex items-center text-left">
                                    <div class="py-2 w-1/2">
                                        <p class="font-bold text-black text-md mb-0">Ligações internas com a Zenvia</p>
                                    </div>
                                    <div class="py-2 w-1/2">
                                        <vs-switch @click="ativaExt(extensoes.totalvoice)" :disabled="!$acl.check('extensao_zenvia_ativar')" vs-icon-on="check" color="#0FB599" v-model="extensoes.totalvoice.ativo" class="float-right switch" v-if="extensoes.totalvoice != null"/>
                                    </div>
                                </div>
                                <div class="w-full my-3">
                                    <img src="@/assets/images/util/zenvia.svg" class="img-conquista my-4" alt="" width="150">
                                    <p class="mb-4">Faça ligações e as mantenha registradas na linha do tempo de seus contatos!</p>
                                </div>
                                <div class="conquista-clicavel w-full cursor-pointer my-3">
                                    <vs-button class="text-black rounded-full w-full border-solid font-bold" style="border-color: #9AAABE; border-width: 1px" color="#F4F4F4" v-if="$acl.check('extensao_zenvia_detal')"
                                               @click="$router.push({name: 'extensoes-zenvia-config'})">{{extensoes.totalvoice != null ? 'Detalhar' : 'Instalar'}}</vs-button>
                                </div>
                                <p class="w-full font-bold text-lg text-left" style="color: #9AAABE">R$ 20,00 / mês + créditos</p>
                            </div>
                        </div>
                        <div class="vx-col col-conquista mb-10">
                            <div class="conquista">
                                <div class="flex items-center text-left">
                                    <div class="py-2 w-1/2">
                                        <p class="font-bold text-black text-md mb-0">Notificações via Slack</p>
                                    </div>
                                    <div class="py-2 w-1/2">
                                        <vs-switch @click="ativaExt(extensoes.slack)" :disabled="!$acl.check('extensao_slack_ativar')" vs-icon-on="check" color="#0FB599" v-model="extensoes.slack.ativo" class="float-right switch" v-if="extensoes.slack != null"/>
                                    </div>
                                </div>
                                <div class="w-full my-3">
                                    <img src="@/assets/images/util/slack.png" class="img-conquista my-4" alt="" width="150">
                                    <p class="mb-4">Integre o Slack da sua empresa ao sistema, possibilitando envio automático de notificações.</p>
                                </div>
                                <div class="conquista-clicavel w-full cursor-pointer my-3">
                                    <vs-button class="text-black rounded-full w-full border-solid font-bold" style="border-color: #9AAABE; border-width: 1px" color="#F4F4F4" v-if="$acl.check('extensao_slack_detal')"
                                               @click="$router.push({name: 'extensoes-slack-config'})">{{extensoes.slack != null ? 'Detalhar' : 'Instalar'}}</vs-button>
                                </div>
                                <p class="w-full font-bold text-lg text-left" style="color: #9AAABE">R$ 20,00 / mês + créditos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleExtensoes from "../../store/extensoes/moduleExtensoes";

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
                    page: 1,
                    subdomain: ''
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1,
                selectedTipo: {},
                countSwitch: [],

                extensoes: {
                    correios: null,
                    totalvoice: null,
                    slack: null
                }
                //items: {}
            }
        },
        created() {
            if (!moduleExtensoes.isRegistered) {
                this.$store.registerModule('extensoes', moduleExtensoes)
                moduleExtensoes.isRegistered = true
            }
            this.$vs.loading();
            this.getItems();
        },
        methods: {
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            },
            ativaExt(e) {
                console.log(this.countSwitch)
                e._method = 'PUT';
                if (this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    e.ativo = !e.ativo;
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
                    let obj = {...e}
                    obj.ativo = ativo;
                    this.$store.dispatch('extensoes/switchExt', {id: e.id, dados: obj}).then(() => {
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
            },
            getItems(){
                var subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
                this.$store.dispatch('extensoes/get', subdomain).then(response => {
                    let arr = response.extensoes;
                    if(arr.length > 0){
                        arr.forEach(item => {
                            if(item.extensao_type === "App\\Models\\Extensoes\\Totalvoice"){
                                this.extensoes.totalvoice = item;
                            }
                            if(item.extensao_type === "App\\Models\\Extensoes\\Slack"){
                                this.extensoes.slack = item;
                            }
                        });
                    }
                    this.$vs.loading.close();
                });
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                //this.getItems();
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
