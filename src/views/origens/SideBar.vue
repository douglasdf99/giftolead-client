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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Origem</h4>
            <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
            <div class="flex items-center cursor-pointer" @click.stop="isSidebarActiveLocal = false">
                <vs-icon icon-pack="material-icons" icon="clear" class="mr-2 icon-cancelar"/>
                Cancelar
            </div>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <div class="p-5">
                <span class="float-right mt-1 mx-4" style="font-weight: bold">
                    {{origem.status ? 'Ativado' : 'Desativado'}}
                </span>
                    <vs-switch vs-icon-on="check" color="#0FB599" v-model="origem.status" class="float-right switch"/>
                    <span class="float-right mt-1 mx-4" style="font-weight: bold">Ativação da Origem</span>
                </div>
                <vs-input size="large" v-validate="'required'" label="Nome da origem" autocomplete="off"
                          v-model="origem.nome" class="mt-5 w-full"
                          name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>
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
                origem: {
                    empresa_id: 1,
                    nome: '',
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
                    this.origem.id = null
                    this.origem.nome = ''
                }
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.origem};
                        if (this.origem.id !== null && this.origem.id >= 0) {
                            obj._method = 'PUT';
                            this.$store.dispatch("updateItem", {rota: 'origems', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A origem foi atualizada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$store.dispatch('getVarios', {rota: 'origems', params: {page: 1}}).then(() => {
                                    this.$vs.loading.close();
                                });
                            }).catch(err => {
                                console.error(err)
                            })
                        } else {
                            delete obj.id
                            this.$store.dispatch("addItem", {rota: 'origems', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A origem foi criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                })
                                this.$store.dispatch('getVarios', {rota: 'origems', params: {page: 1}}).then(() => {
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
                this.origem = JSON.parse(JSON.stringify(this.data));
                //this.selected = this.origem.integracao_id;
                this.selected = {id: this.origem.integracao_id, label: this.origem.integracao.descricao};
                //this.selected.label = this.origem.integracao.descricao;

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
