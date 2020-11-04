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
            <h4>{{ Object.entries(this.data).length === 0 ? "Novo" : "Atualizar" }} Ticket</h4>
            <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <div class="wizard-ticket"></div>
                <div class="vx-row flex relative justify-around">
                    <div class="vx-col w-3/12 flex items-center justify-center flex-col relative cursor-pointer"
                         @click="prosseguiu = false">
                        <div class="wizard-atual" v-if="!prosseguiu"></div>
                        <i class="material-icons wizard-ticket-icon">people_out</i>
                        <span class="wizard-ticket-span"
                              v-bind:class="{'text-white': !prosseguiu}">Dados do Ticket</span>
                    </div>
                    <div class="vx-col w-3/12 flex items-center justify-center flex-col relative"
                         v-bind:class="{'cursor-pointer': validado}" @click="validado ? prosseguiu = true : ''">
                        <div class="wizard-atual" v-if="prosseguiu"></div>
                        <i class="material-icons wizard-ticket-icon">favorite</i>
                        <span class="wizard-ticket-span"
                              v-bind:class="{'text-white': prosseguiu}">Dados do Lead</span>
                    </div>
                </div>
                <div v-if="!prosseguiu">
                    <div class="vx-row mt-10">
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="font-regular mb-2">Origem</span>
                            <v-select id="origem" name="origem" class="bg-white" v-validate="'required'"
                                      v-model="selectedOrigem" :options="origens" :clearable="false"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('origem')">{{ errors.first('origem') }}</span>
                        </div>
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="font-regular mb-2">Dúvida</span>
                            <v-select id="duvida" name="duvida" v-validate="'required'" v-model="selectedDuvida"
                                      :options="duvidas" :clearable="false"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('duvida')">{{ errors.first('duvida') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">Produto</span>
                            <v-select id="produto" name="produto" v-validate="'required'" v-model="selectedProduto"
                                      :options="produtos" :clearable="false"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('produto')">{{ errors.first('produto') }}</span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="vx-row mt-10">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">E-mail</span>
                            <vs-input class="w-full" type="email" v-model="ticket.lead.email" size="large"
                                      name="lead_email"
                                      v-validate="'required'" @blur="verificaLead"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('lead_email')">{{ errors.first('lead_email') }}</span>
                            <span class="text-danger text-sm"
                                  v-show="verificaLeadEmail">Já existe um ticket para este Lead vinculado a este Produto.</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">Lead</span>
                            <vs-input class="w-full" v-model="ticket.lead.nome" size="large" name="lead_nome"
                                      v-validate="'required'"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('lead_nome')">{{ errors.first('lead_nome') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-2/12">
                            <span class="font-regular mb-2">DDD</span>
                            <vs-input class="w-full" v-model="ticket.lead.ddd" size="large" name="lead_ddd"
                                      v-validate="'required'" @keypress="isNumber" v-mask="'(##)'"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('lead_ddd')">{{ errors.first('lead_ddd') }}</span>
                        </div>
                        <div class="vx-col w-10/12">
                            <span class="font-regular mb-2">Telefone</span>
                            <vs-input class="w-full" v-model="ticket.lead.telefone" size="large" v-mask="'#####-####'"
                                      name="lead_telefone"
                                      v-validate="'required'" @keypress="isNumber"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('lead_telefone')">{{ errors.first('lead_telefone') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <span class="font-regular mb-2">Detalhamento da solicitação</span>
                            <vs-textarea name="detalhamento" v-validate="'required'" v-model="ticket.detalhamento"
                                         id="text-area" class="w-full bg-white" rows="6"/>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('detalhamento')">{{ errors.first('detalhamento') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="verificaLeadEmail">{{!prosseguiu ? 'Prosseguir' :
                'Salvar'}}
            </vs-button>
            <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancelar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import vSelect from 'vue-select'
    import {Validator} from 'vee-validate';

    const dict = {
        custom: {
            origem: {
                required: 'Por favor, selecione uma origem',
            },
            produto: {
                required: 'Por favor, selecione um produto',
            },
            duvida: {
                required: 'Por favor, selecione uma dúvida',
            },
            lead_nome: {
                required: 'Por favor, insira o nome',
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
                prosseguiu: false,
                origens: [],
                produtos: [],
                duvidas: [],
                selectedOrigem: null,
                selectedProduto: null,
                selectedDuvida: null,
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
            }
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive
                },
                set(val) {
                    if (!val) {
                        this.$emit('closeSidebar')
                        // this.$validator.reset()
                        // this.initValues()
                    }
                }
            },
        },
        methods: {
            getOpcoes() {
                this.$store.dispatch('origens/get').then(response => {
                    let origens = [...response];
                    origens.forEach(item => {
                        this.origens.push({id: item.id, label: item.nome})
                    });
                });
                this.$store.dispatch('produtos/get').then(response => {
                    let produtos = [...response];
                    produtos.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome})
                    });
                });
                this.$store.dispatch('duvidas/get').then(response => {
                    let duvidas = [...response];
                    duvidas.forEach(item => {
                        this.duvidas.push({id: item.id, label: item.nome})
                    });
                });
            },
            verificaLead() {
                console.log('ticket', this.ticket, 'data', this.data)
                if(this.data.lead){
                    if (this.ticket.lead.email !== this.data.lead.email) {
                        this.$store.dispatch('tickets/verificaLead', {
                            email: this.ticket.lead.email,
                            produto_id: this.selectedProduto.id
                        }).then(response => {
                            this.verificaLeadEmail = response.verificacao;
                        });
                    } else {
                        this.verificaLeadEmail = false;
                    }
                } else {
                    this.$store.dispatch('tickets/verificaLead', {
                        email: this.ticket.lead.email,
                        produto_id: this.selectedProduto.id
                    }).then(response => {
                        this.verificaLeadEmail = response.verificacao;
                    });
                }
            },
            initValues() {
                if (this.data.id) {
                    console.log(this.data)
                    return
                } else {
                    this.ticket.id = null
                    this.ticket.lead.nome = ''
                    this.selectedDuvida = null
                    this.selectedProduto = null
                    this.selectedOrigem = null
                }
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (!this.prosseguiu) {
                            this.validado = true;
                            this.prosseguiu = true;
                        } else {
                            if (!this.verificaLeadEmail) {
                                this.$vs.loading()
                                const obj = {};
                                if (this.selectedDuvida != null)
                                    obj.tipo_duvida_id = this.selectedDuvida.id;

                                if (this.selectedProduto != null)
                                    obj.produto_id = this.selectedProduto.id;

                                if (this.selectedOrigem != null)
                                    obj.origem_id = this.selectedOrigem.id;

                                obj.nome = this.ticket.lead.nome;
                                obj.email = this.ticket.lead.email;
                                obj.ddd = this.ticket.lead.ddd;
                                obj.telefone = this.ticket.lead.telefone;
                                obj.detalhamento = this.ticket.detalhamento;
                                if (this.data.id) {
                                    obj.id = this.data.id;
                                    obj._method = 'PUT';
                                    console.log('obj atualizando', obj)
                                    this.$store.dispatch("updateItem", {rota: 'tickets', item: obj}).then(() => {
                                        this.$vs.notify({
                                            title: 'Sucesso',
                                            text: "A conta foi atualizada com sucesso.",
                                            iconPack: 'feather',
                                            icon: 'icon-check-circle',
                                            color: 'success'
                                        });
                                        this.$store.dispatch('getVarios', {
                                            rota: 'tickets',
                                            params: {page: 1}
                                        }).then(() => {
                                            this.$vs.loading.close();
                                        });
                                    }).catch(err => {
                                        console.error(err)
                                    })
                                } else {
                                    delete obj.id
                                    console.log('obj criando', obj)
                                    this.$store.dispatch("addItem", {rota: 'tickets', item: obj}).then(() => {
                                        this.$vs.notify({
                                            title: '',
                                            text: "Ticket criado com sucesso.",
                                            iconPack: 'feather',
                                            icon: 'icon-check-circle',
                                            color: 'success'
                                        })
                                        this.$vs.loading.close();
                                    }).catch(error => {
                                        this.$vs.notify({
                                            title: '',
                                            text: error.message,
                                            iconPack: 'feather',
                                            icon: 'icon-alert-circle',
                                            color: 'danger'
                                        })
                                    })
                                }

                                this.$emit('closeSidebar')
                                this.initValues()
                            }
                        }
                    } else {
                        this.$vs.notify({
                            title: '',
                            text: 'verifique os erros específicos',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }
                })
            },
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
        created() {
            this.initValues();
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                console.log('entrou aqui', this.data);
                this.ticket = JSON.parse(JSON.stringify(this.data));
                //this.selected = this.ticket.integracao_id;
                this.selectedProduto = {id: this.data.produto.id, label: this.data.produto.nome};
                this.selectedDuvida = {id: this.data.tipoduvida.id, label: this.data.tipoduvida.nome};
                this.selectedOrigem = {id: this.data.origem.id, label: this.data.origem.nome};
            }
            this.getOpcoes();
        }
    }
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
            z-index: 52010;
        }

        ::v-deep .vs-sidebar {
            z-index: 52010;
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
