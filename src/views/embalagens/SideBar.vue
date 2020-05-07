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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Embalagem</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>

        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">

                <vs-input size="large " v-validate="'required'" label="Descrição" autocomplete="off"
                          v-model="embalagem.nome" class="mt-5 w-full"
                          name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>

                <!-- AQUI EMBAIXO É DOIDERA -->
                <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                     v-if="tipo_envelope">
                    <img src="@/assets/images/util/medidas.svg">
                </div>
                <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                     v-if="tipo_caixa">
                    <img src="@/assets/images/util/medidas.svg">
                </div>
                <div class="p-10" style="display: flex; justify-content: center; align-content: center"
                     v-if="tipo_cilindro">
                    <img src="@/assets/images/util/medidas.svg">
                </div>
                <!-- FIM DA DOIDERA -->

                <div class="mt-5">
                    <label class="vs-input--label">Tipo de Embalgem</label>
                    <v-select v-model="embalagem.tipo_de_caixa" :class="'select-large-base'" :clearable="false"
                              :options="opcoesTipoCaixa" v-validate="'required'" name="tipo_de_caixa"/>
                    <span class="text-danger text-sm" v-show="errors.has('tipo_de_caixa')">{{ errors.first('tipo_de_caixa') }}</span>
                </div>
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full mb-2 relative">
                        <vs-input size="large " v-validate="'required'" label="Altura" autocomplete="off"
                                  v-model="embalagem.altura" class="mt-5 w-full"
                                  name="altura"/>
                        <div class="unidade absolute p-2">
                            <span>cm</span>
                        </div>
                        <span class="text-danger text-sm" v-show="errors.has('altura')">Este campo é obrigatório</span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2 relative">
                        <vs-input size="large " v-validate="'required'" label="Largura" autocomplete="off"
                                  v-model="embalagem.largura" class="mt-5 w-full"
                                  name="largura"/>
                        <div class="unidade absolute p-2">
                            <span>cm</span>
                        </div>
                        <span class="text-danger text-sm" v-show="errors.has('largura')">Este campo é obrigatório</span>
                    </div>
                </div>

                <div class="vx-row ">
                    <div class="vx-col sm:w-1/2 w-full mb-2 relative">
                        <vs-input size="large " v-validate="'required'" label="Comprimento" autocomplete="off"
                                  v-model="embalagem.comprimento" class="mt-5 w-full"
                                  name="comprimento"/>
                        <div class="unidade absolute p-2">
                            <span>cm</span>
                        </div>
                        <span class="text-danger text-sm" v-show="errors.has('comprimento')">Este campo é obrigatório</span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2 relative">
                        <vs-input size="large " v-validate="'required'" label="Peso" autocomplete="off"
                                  v-model="embalagem.peso" class="mt-5 w-full"
                                  name="peso"/>
                        <div class="unidade absolute p-2">
                            <span>Kg</span>
                        </div>
                        <span class="text-danger text-sm" v-show="errors.has('peso')">Este campo é obrigatório</span>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData">Salvar</vs-button>
            <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancela</vs-button>
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
                required: 'Por favor, insira o nome do brinde'
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
                    console.log('entrou aqui', this.data);
                    this.embalagem = JSON.parse(JSON.stringify(this.data));
                    //this.selected.label = this.embalagem.integracao.descricao;

                }
                // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
            },
            embalagem: {
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
                embalagem: {
                    nome: '',
                    largura: '',
                    comprimento: '',
                    peso: '',
                    tipo_de_caixa: ''
                },
                tipo_caixa: false,
                tipo_envelope: false,
                tipo_cilindro: false,
                selected: null,
                opcoesTipoCaixa: [{id: '001', label: 'TIPO ENVELOPE'}, {
                    id: '002',
                    label: 'TIPO PACOTE CAIXA'
                }, {id: '003', label: 'TIPO ROLO CILINDRO'}],
                imagem: ''
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
            isFormValid() {
                return !this.errors.any() && (this.selected > 0 || this.selected != null);
            }
        },
        methods: {
            initValues() {
                if (this.data.id) return
                this.embalagem.nome = ''
                this.embalagem.token = ''
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.embalagem};
                        obj.tipo_de_caixa = this.embalagem.tipo_de_caixa.id;
                        if (this.embalagem.id !== null && this.embalagem.id >= 0) {
                            obj._method = 'PUT';
                            this.$store.dispatch("updateItem", {rota: 'embalagems', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A embalagem foi atualizada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$store.dispatch('getVarios', {
                                    rota: 'embalagems',
                                    params: {search: null, page: 1}
                                }).then(() => {
                                    this.$vs.loading.close();
                                });
                            }).catch(err => {
                                console.error(err)
                            })
                        } else {
                            delete obj.id
                            console.log('obj', obj)
                            obj.integracao_id = this.selected;
                            this.$store.dispatch("addItem", {rota: 'embalagems', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A embalagem foi criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                })
                                this.$store.dispatch('getVarios', {
                                    rota: 'embalagems',
                                    params: {search: null, page: 1}
                                }).then(() => {
                                    this.$vs.loading.close();
                                });
                            }).catch(error => {
                                console.error(error)
                                this.$vs.notify({
                                    title: 'Error',
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
                })
            },
            /*getOpcoes() {
                this.$store.dispatch('brindes/getOpcoes').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesContrato.push({id: item.id, label: item.descricao})
                    });
                    console.log('af', this.opcoesContrato)
                    console.log('af2', [{id: 'Foo', label: 'foo'}])
                })
            },*/
            mudou() {
                console.log(this.selected)
            }
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
        created() {
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                console.log('entrou aqui', this.data);
                this.embalagem = JSON.parse(JSON.stringify(this.data));
                //this.selected = this.embalagem.integracao_id;
                //this.selected = {id: this.embalagem.integracao_id, label: this.embalagem.integracao.descricao};
                //this.selected.label = this.embalagem.integracao.descricao;

            }
            //this.getOpcoes();

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
