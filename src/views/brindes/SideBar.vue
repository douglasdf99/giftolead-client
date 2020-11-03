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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Brinde </h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <vs-alert color="danger" v-if="!brinde.contrato.status && this.data.length > 0" icon-pack="material-icons" icon="cancel" class="w-full">
                    <span>Contrato desativado</span>
                </vs-alert>
                <div class="p-5" v-if="Object.entries(this.data).length != 0">
                    <span class="float-right mt-1 mx-4" style="font-weight: bold">
                        {{brinde.ativo ? 'Ativado' : 'Desativado'}}
                    </span>
                    <vs-switch vs-icon-on="check" color="#0FB599" v-model="brinde.ativo" class="float-right switch" @click="switchBrinde(brinde.ativo)"/>
                </div>
                <vs-input size="large " v-validate="'required'" label="Nome da brinde" autocomplete="off"
                          v-model="brinde.nome"
                          class="mt-5 w-full"
                          name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
                <div class="mt-4">
                    <label class="vs-input--label">Selecione o produto</label>
                    <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="false"
                              :options="produtos"
                              v-validate="'required'" name="produto"/>
                    <span class="text-danger text-sm"
                          v-show="errors.has('produto')">{{ errors.first('produto') }}</span>
                </div>
                <div class="mt-4">
                    <label class="vs-input--label">Selecione o contrato de entrega deste brinde</label>
                    <v-select v-model="selected" :class="'select-large-base'" :clearable="false"
                              :options="opcoesContrato"
                              v-validate="'required'" name="contrato" v-bind:style="{border: (!brinde.contrato.status && this.data.length > 0 ? '2px solid #ff000066' : '')}"/>
                    <span class="text-danger text-sm"
                          v-show="errors.has('contrato')">{{ errors.first('contrato') }}</span>
                </div>
                <div class="" v-if="!brinde.hasembalagem">
                    <!-- AQUI EMBAIXO É DOIDERA -->
                    <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                         v-if="tipo_envelope">
                        <img src="@/assets/images/util/envelope.svg" height="200">
                    </div>
                    <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                         v-if="tipo_caixa">
                        <img src="@/assets/images/util/pacote_caixa.svg" height="200">
                    </div>
                    <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                         v-if="tipo_cilindro">
                        <img src="@/assets/images/util/rolo_cilindro.svg" height="200">
                    </div>
                    <div class="vx-row mt-5">
                        <div class="vx-col  w-full mb-2">
                            <label class="vs-input--label">Tipo de caixa</label>
                            <v-select v-model="brinde.tipo_de_caixa" :class="'select-large-base'" :clearable="false"
                                      :options="opcoesTipoCaixa" v-validate="'required'" name="tipo_de_caixa"/>
                            <span class="text-danger text-sm" v-show="errors.has('tipo_de_caixa')">{{ errors.first('tipo_de_caixa') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2 relative" v-if="tipo_caixa">
                            <vs-input size="large" v-validate="'required'" label="Altura" autocomplete="off"
                                      v-model="brinde.altura" class="mt-5 w-full" name="altura" type="number"/>
                            <div class="unidade absolute p-2">
                                <span>cm</span>
                            </div>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('altura')">{{ errors.first('altura') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2 relative" v-if="tipo_caixa">
                            <vs-input size="large " v-validate="'required'" label="Largura" autocomplete="off"
                                      v-model="brinde.largura" class="mt-5 w-full" type="number" name="largura"/>
                            <div class="unidade absolute p-2">
                                <span>cm</span>
                            </div>
                            <span class="text-danger text-sm" v-show="errors.has('largura')">{{ errors.first('largura') }}</span>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/2 w-full mb-2 relative" v-if="tipo_cilindro">
                            <vs-input size="large " v-validate="'required'" label="Diâmetro" autocomplete="off"
                                      v-model="brinde.diametro" class="mt-5 w-full" type="number"
                                      name="diametro"/>
                            <div class="unidade absolute p-2">
                                <span>cm</span>
                            </div>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('diametro')">{{ errors.first('diametro') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2 relative" v-if="tipo_caixa || tipo_cilindro">
                            <vs-input size="large " v-validate="'required'" label="Comprimento" autocomplete="off"
                                      v-model="brinde.comprimento" class="mt-5 w-full" type="number"
                                      name="comprimento"/>
                            <div class="unidade absolute p-2">
                                <span>cm</span>
                            </div>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('comprimento')">{{ errors.first('comprimento') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2 relative">
                            <vs-input size="large " v-validate="'required'" label="Peso" autocomplete="off"
                                      v-model="brinde.peso" class="mt-5 w-full" type="number" name="peso"/>
                            <div class="unidade absolute p-2">
                                <span>Kg</span>
                            </div>
                            <span class="text-danger text-sm"
                                  v-show="errors.has('peso')">{{ errors.first('peso') }}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-8">
                    <vs-checkbox color="dark" v-model="brinde.hasembalagem"><span class="label-bold-underline">Usar embalagem padrão</span>
                    </vs-checkbox>
                </div>
                <div class="mt-4" v-if="brinde.hasembalagem">
                    <label class="vs-input--label">Embalagem Padrão</label>
                    <v-select v-model="embalagem" :class="'select-large-base'" :clearable="false"
                              :options="opcoesEmbalagem"
                              v-validate="'required'" name="embalagem"/>
                    <span class="text-danger text-sm"
                          v-show="errors.has('embalagem')">{{ errors.first('embalagem') }}</span>
                </div>

            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData">Salvar</vs-button>
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
            nome: {
                required: 'Por favor, insira o nome do brinde',
            },
            contrato: {
                required: 'Por favor, selecione o contrato que pertence esse brinde',
            },
            largura: {
                required: 'Por favor, insira a largura',
            },
            tipo_de_caixa: {
                required: 'Por favor, insira a tipo de caixa',
            },
            comprimento: {
                required: 'Por favor, insira o comprimento',
            },
            altura: {
                required: 'Por favor, insira a altura',
            },
            peso: {
                required: 'Por favor, insira o peso',
            },
            embalagem: {
                required: 'Por favor, insira a embalagem padrão',
            },
            produto: {
                required: 'Por favor, selecione o produto',
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
        watch: {
            isSidebarActive(val) {
                if (!val) return
                if (Object.entries(this.data).length === 0) {
                    this.initValues()
                    this.$validator.reset()
                } else {
                    this.brinde = JSON.parse(JSON.stringify(this.data));
                }
            },
            brinde: {
                handler(val) {
                    console.log('val', val);
                    switch (val.tipo_de_caixa.id) {
                        case '001':
                            this.tipo_envelope = true;
                            this.tipo_caixa = false;
                            this.tipo_cilindro = false;
                            break;
                        case '002':
                            this.tipo_caixa = true;
                            this.tipo_envelope = false;
                            this.tipo_cilindro = false;
                            break;
                        case '003':
                            this.tipo_cilindro = true;
                            this.tipo_caixa = false;
                            this.tipo_envelope = false;
                            break;
                    }
                },
                deep: true
            }
        },
        data() {
            return {
                brinde: {
                    nome: '',
                    detal: '',
                    largura: 0,
                    altura: 0,
                    comprimento: 0,
                    diametro: 0,
                    peso: 0,
                    integracao: {},
                    tipo: true,
                    contrato: {}
                },
                tipo_caixa: false,
                tipo_envelope: false,
                tipo_cilindro: false,
                opcoesTipoCaixa: [{id: '001', label: 'ENVELOPE'}, {
                    id: '002',
                    label: 'PACOTE CAIXA'
                }, {id: '003', label: 'ROLO CILINDRO'}],
                opcoesContrato: [],
                opcoesEmbalagem: [],
                produtos: [],
                selected: null,
                selectedProduto: null,
                embalagem: null
            }
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive
                },
                set(val) {
                    console.log('valor side', val);
                    if (!val) {
                        console.log('entou no emit side', val);

                        this.$emit('closeSidebar')
                        // this.$validator.reset()
                        // this.initValues()
                    }
                }
            },
            isFormValid() {
                return !this.errors.any() && (this.selected > 0 || this.selected != null);
            }
        },
        methods: {
            initValues() {
                if (this.data.id) return
                this.brinde.nome = ''
                this.brinde.token = ''
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.brinde};
                        obj.produto_id = this.selectedProduto.id;

                        if (this.selected)
                            obj.contrato_id = this.selected.id || '';
                        if (this.brinde.tipo_de_caixa)
                            obj.tipo_de_caixa = this.brinde.tipo_de_caixa.id || '';
                        if (this.embalagem)
                            obj.embalagem_id = this.embalagem.id || '';

                        if (this.brinde.id !== null && this.brinde.id >= 0) {
                            obj._method = 'PUT';
                            this.$store.dispatch("updateItem", {rota: 'brindes', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A brinde foi atualizada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });

                                this.$store.dispatch('getVarios', {rota: 'brindes', params: {page: 1}}).then(() => {
                                    this.$vs.loading.close()
                                });
                            }).catch(err => {
                                console.error(err)
                            }).finally(()=>{
                              this.$vs.loading.close();
                            })
                        } else {
                            delete obj.id;
                            obj.integracao_id = this.selected.id;
                            this.$store.dispatch("addItem", {rota: 'brindes', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A brinde foi criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$store.dispatch('getVarios', {rota: 'brindes', params: {page: 1}}).then(() => {
                                    this.$vs.loading.close()
                                });

                            }).catch(error => {
                                this.$vs.notify({
                                    title: 'Error',
                                    text: error.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            }).finally(()=>{
                              this.$vs.loading.close();
                            })
                        }
                        console.log('chegou no emit')
                        this.$emit('paginate');
                        this.$emit('closeSidebar');
                        this.initValues()
                    }
                })
            },
            getEmbalagems() {
                this.$store.dispatch('brindes/getEmbalagems').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesEmbalagem.push({id: item.id, label: item.nome})
                    });
                })
            },
            getContratos() {
                this.$store.dispatch('brindes/getContratos').then(response => {
                    console.log('correios', response)
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesContrato.push({id: item.id, label: item.nome})
                    });
                })
            },
            getProdutos() {
                this.$store.dispatch('brindes/getProdutos').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome})
                    });
                    console.log('prods', this.produtos)
                })
            },
            mudou() {
                console.log(this.selected)
            },
            switchBrinde(val) {
                if (this.brinde.id != null) {
                    console.log('val', !val)
                    if (val) {
                        this.$vs.dialog({
                            color: 'danger',
                            type: 'confirm',
                            title: `Muita atenção!`,
                            text: 'Ao desativar o brinde, as campanhas relacionadas a este brinde serão desativadas.',
                            acceptText: 'Estou ciente',
                            cancelText: 'Cancelar',
                            accept: () => {

                            },
                            cancel: () => {
                                console.log('cancelei')
                                this.brinde.ativo = true
                            }
                        })
                    }
                }
            }
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
        created() {
            this.getEmbalagems();
            this.getProdutos();
            this.getContratos();
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                this.brinde = JSON.parse(JSON.stringify(this.data));
                //this.selected = this.brinde.integracao_id;
                if (this.brinde.contrato.id && this.brinde.contrato.status)
                    this.selected = {id: this.brinde.contrato_id, label: this.brinde.contrato.nome};
                if (this.brinde.embalagem)
                    this.embalagem = {id: this.brinde.embalagem_id, label: this.brinde.embalagem.nome};

                if (this.brinde.tipo_de_caixa) {
                    switch (this.brinde.tipo_de_caixa) {
                        case '001':
                            this.brinde.tipo_de_caixa = {id: '001', label: 'ENVELOPE'}
                            this.tipo_envelope = true;
                            this.tipo_caixa = false;
                            this.tipo_cilindro = false;
                            break;
                        case '002':
                            this.brinde.tipo_de_caixa = {id: '002', label: 'PACOTE CAIXA'}
                            this.tipo_caixa = true;
                            this.tipo_envelope = false;
                            this.tipo_cilindro = false;
                            break;
                        case '003':
                            this.brinde.tipo_de_caixa = {id: '003', label: 'CILINDRO'}
                            this.tipo_cilindro = true;
                            this.tipo_caixa = false;
                            this.tipo_envelope = false;
                            break;
                    }
                }

                this.selectedProduto = {id: this.brinde.produto_id, label: this.brinde.produto.nome};
            }
        }
    }
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
            z-index: 52000;
        }

        ::v-deep .vs-sidebar {
            z-index: 52000;
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

    .vs-dialog {
        z-index: 99999 !important;
    }
</style>
