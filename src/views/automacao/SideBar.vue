<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>Nova Automação</h4>
            <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <div>
                    <div class="vx-row mt-10">
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="font-regular mb-2">E-mail do Lead</span>
                            <vs-input autocomplete class="w-full " v-model="lead.email" v-validate="'required|email'" name="email" id="inp" size="large" type="email"/>
                            <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                        </div>
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="font-regular mb-2">Nome do Lead</span>
                            <vs-input autocomplete class="w-full " v-model="lead.nome" id="lead_nome" v-validate="'required'" name="nome" size="large"/>
                            <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">Brinde</span>
                            <v-select id="brinde" v-validate="'required'" name="brinde" v-model="selectedBrinde"
                                      :options="brindes" :clearable="false"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('brinde')">{{ errors.first('brinde') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">Campanha</span>
                            <v-select id="campanha" name="campanha" v-validate="'required'" v-model="selectedCampanha"
                                      :options="campanhas" :clearable="false" label="nome"/>

                            <span class="text-danger text-sm"
                                  v-show="errors.has('campanha')">{{ errors.first('campanha') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="verificaLeadEmail">Salvar
            </vs-button>
            <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancelar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import vSelect from 'vue-select';
import {Validator} from 'vee-validate';
import moduleAutomacao from "../../store/automacao/moduleAutomacao";


const dict = {
    custom: {
        email: {
            required: 'Por favor,insira um email ',
            email: 'Por favor,insira um email valido',
        },
        nome: {
            required: 'Por favor, insira um nome',
        },
        brinde: {
            required: 'Por favor, selecione um brinde',
        },
        campanha: {
            required: 'Por favor, selecione uma campanha',
        },
        lead_email: {
            required: 'Por favor, insira o e-mail',
        },
        lead_ddd: {
            required: 'Insira o DDD',
        },
        lead_telefone: {
            required: 'Por favor, insira o Telefone',
        },
        detalhamento: {
            required: 'Por favor, insira detalhamento do ticket',
        },
    }
};
Validator.localize('pt-br', dict);

export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {
            },
        },
    },
    watch: {},
    data() {
        return {
            confimado: false,
            prosseguiu: false,
            origens: [],
            produtos: [],
            duvidas: [],
            lead: {
                email: '',
                nome: '',
            },
            campanhas: '',
            brindes: '',
            selectedLead: null,
            selectedOrigem: null,
            selectedBrinde: null,
            selectedCampanha: null,
            ticket: {
                lead: {
                    nome: '',
                    email: '',
                    ddd: '',
                    telefone: '',
                }
            },
            validado: false,
            verificaLeadEmail: false
        };
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive;
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar');
                    // this.$validator.reset()
                    // this.initValues()
                }
            }
        },
    },
    methods: {
        submitData() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    const obj = {};
                    obj.confirmado = this.confimado;
                    obj.nome = this.lead.nome;
                    obj.email = this.lead.email;
                    obj.brinde = this.selectedBrinde.id;
                    obj.campanha = this.selectedCampanha.id;
                    this.$vs.loading();

                    this.$store.dispatch("automacao/store", obj).then(() => {
                        this.$vs.notify({
                            title: '',
                            text: "Automação criada com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        this.$emit('getItems');
                        this.$emit('closeSidebar');
                    }).catch(error => {
                        if (error.response.status == 412) {
                            this.$vs.dialog({
                                type: 'confirm',
                                color: 'primary',
                                title: `Confirme`,
                                text: error.response.data.message,
                                accept: this.acceptAlert,
                                acceptText: "Confirmar",
                                cancelText: "Cancelar"
                            });
                        } else {
                            this.$vs.notify({
                                title: '',
                                text: error.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        }
                    }).finally(() => {
                        this.$vs.loading.close();
                    });
                } else {
                    this.$vs.notify({
                        title: '',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                }
            });
        },
        acceptAlert() {
            this.confimado = true;
            this.submitData();
        },
        getBrindes() {
            this.$store.dispatch('brindes/getArraySelect').then(response => {
                this.brindes = [...this.arraySelect(response)];
            });
        },
        getCampanhas() {
            this.$vs.loading();
            this.$store.dispatch('brindes/getCampanhas', this.dados).then(response => {
                this.campanhas = [...response];
            }).catch(error => {
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
    },
    components: {
        VuePerfectScrollbar,
        'v-select': vSelect
    },
    created() {
        this.$vs.loading();

        if (!moduleAutomacao.isRegistered) {
            this.$store.registerModule('automacao', moduleAutomacao);
            moduleAutomacao.isRegistered = true;
        }

        this.getBrindes();
        this.getCampanhas();
    }
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 12010;
    }

    ::v-deep .vs-sidebar {
        z-index: 42010;
        width: 750px;
        max-width: 90vw;

        .img-upload {
            margin-top: 2rem;

            .con-img-upload {
                padding: 0;
            }

            .con-input-upload {
                width: 100%;
                margin: 0;
            }
        }
    }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
</style>

<style>
.vs-sidebar--background {
    background: rgba(0, 0, 0, .2) !important;
}
</style>
