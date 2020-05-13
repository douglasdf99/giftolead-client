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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Status de Finalização</h4>
            <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
            <div class="flex items-center cursor-pointer" @click.stop="isSidebarActiveLocal = false">
                <vs-icon icon-pack="material-icons" icon="clear" class="mr-2 icon-cancelar"/>
                Cancelar
            </div>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <vs-input size="large" v-validate="'required'" label="Nome do Status" autocomplete="off"
                          v-model="status.nome" class="mt-5 w-full" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>
                <p class="mt-10 destaque">
                    Escolha o tipo de finalização
                </p>
                <div class="div-finalizacoes">
                    <div class="card-finalizacao ganhou" v-bind:class="{'tipoAtivo' : (status.tipo == 0)}"
                         @click="status.tipo = 0">
                        <span>Ganhou</span>
                        <img src="@/assets/images/util/ganhou.svg">
                    </div>
                    <div class="card-finalizacao aguardando" v-bind:class="{'tipoAtivo' : (status.tipo == 1)}"
                         @click="status.tipo = 1">
                        <span>Aguardando</span>
                        <img src="@/assets/images/util/aguardando.svg">
                    </div>
                    <div class="card-finalizacao perdeu" v-bind:class="{'tipoAtivo' : (status.tipo == 2)}"
                         @click="status.tipo = 2">
                        <span>Perdeu</span>
                        <img src="@/assets/images/util/perdeu.svg">
                    </div>
                </div>
                <div class="mt-10" v-if="status.tipo == 0">
                    <vs-checkbox color="dark" v-model="status.hab_brinde"><span class="label-bold-underline">
                        Habilita a opção de brinde</span>
                    </vs-checkbox>
                </div>
                <div class="mt-10" v-if="status.tipo == 1">
                    <label class="destaque">Número de vezes desta ocorrência para finalizar o ticket</label>
                    <v-select v-model="status.fechamento" :class="'select-large-base'" :clearable="false"
                              class="w-full lg:w-1/7 md:w-2/6 sm:w-1/3 mt-3"
                              :options="[{id: 1, label: '1', selected: true}, {id:2,label:'2'}, {id:3,label:'3'}]"
                              name="tipo_de_caixa"/>
                    <div class="mt-5">
                        <vs-checkbox color="dark" v-model="status.espera"><span class="label-bold-underline">
                            Habilitar espera do sistema para finalizar o ticket</span>
                        </vs-checkbox>
                    </div>
                </div>
                <div class="mt-10" v-if="status.tipo == 2">
                    <vs-checkbox color="dark" v-model="status.hab_perda"><span class="label-bold-underline">
                        Habilita motivo de perda</span>
                    </vs-checkbox>
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
                status: {
                    empresa_id: 1,
                    nome: '',
                    tipo: null,
                    hab_perda: 0,
                    hab_brinde: 0,
                    hab_comissao: 0,
                    espera: 0
                },
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
            initValues() {
                console.log('chamou init');
                if (this.data.id) {
                    console.log(this.data)
                    return
                } else {
                    this.status.id = null
                    this.status.nome = '';
                }
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.status};
                        obj.hab_comissao = (obj.tipo == 0 ?  true : false); //Habilitando comissão
                        if(obj.fechamento)
                            obj.fechamento = obj.fechamento.id;
                        if (this.status.id !== null && this.status.id >= 0) {
                            obj._method = 'PUT';
                            this.$store.dispatch("updateItem", {rota: 'status_de_finalizacaos', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O status foi atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$store.dispatch('getVarios', {
                                    rota: 'status_de_finalizacaos',
                                    params: {page: 1}
                                }).then(() => {
                                    this.$vs.loading.close();
                                });
                            }).catch(err => {
                                console.error(err)
                            })
                        } else {
                            delete obj.id
                            this.$store.dispatch("addItem", {rota: 'status_de_finalizacaos', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O status foi criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$store.dispatch('getVarios', {
                                    rota: 'status_de_finalizacaos',
                                    params: {page: 1}
                                }).then(() => {
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
                            })
                        }

                        this.$emit('closeSidebar')
                        this.initValues()
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
                this.status = JSON.parse(JSON.stringify(this.data));
                if(this.status.fechamento){
                    let val = this.status.fechamento;
                    this.status.fechamento = {id: val, label: val};
                }
            }
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

    .div-finalizacoes {
        padding: 2rem 6rem;
        width: 100%;
    }

    .card-finalizacao {
        background: #E7E7E7;
        width: 100%;
        padding: 1rem;
        border-radius: 7px;
        display: flex !important;
        align-items: center;
        margin: 1rem 0;
        color: black;
        font-weight: bold;
        justify-content: space-between;
        cursor: pointer;
        transition-duration: .3s;
    }

    .ganhou.tipoAtivo {
        background: #4DE98A;
        transition-duration: .3s;
    }

    .aguardando.tipoAtivo {
        background: #E7BE00;
        transition-duration: .3s;
    }

    .perdeu.tipoAtivo {
        background: #F03165;
        transition-duration: .3s;
    }
</style>
