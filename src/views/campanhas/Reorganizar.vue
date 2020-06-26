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
            <h4>Reorganizar ordem dos e-mails</h4>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6 w-9/12 mx-auto" style="margin-top: 5rem">
                <draggable :list="data" class="cursor-move">
                    <div v-for="(item, index) in data">
                        <p class="text-center text-xs mb-0">|</p>
                        <p class="text-xs text-center">
                            {{item.unidade_tempo}} {{item.unidade_medida}} depois {{index === 0 ? 'da entrada' : 'do último envio'}}
                        </p>
                        <vx-card class="mb-0 mt-4 py-0 card-draggable">
                            <div class="vx-row flex items-center">
                                <div class="vx-col w-2/12">
                                    <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="40px">
                                </div>
                                <div class="vx-col w-10/12">
                                    <p class="destaque">
                                        {{item.assunto}}
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                </draggable>
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
    import draggable from 'vuedraggable'

    export default {
        props: {
            isSidebarActive: {
                type: Boolean,
                required: true
            },
            data: {
                type: Array,
                default: () => {
                },
            },
            rota: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                origem: {
                    empresa_id: 1,
                    nome: '',
                },
                emails: []
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
                        const obj = []

                        //Ajustando posições
                        this.data.forEach((item, index) => {
                            obj.push(item.id);
                        })

                        this.$store.dispatch(this.rota + "/reorganizarEmails", obj).then(response => {
                            this.$vs.notify({
                                title: 'Sucesso',
                                text: "Atualizado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.$emit('closeSidebar')
                            this.initValues()
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                })
            },
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect,
            draggable,
        },
        created() {
            this.initValues();
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                console.log('entrou aqui', this.data);
                //this.origem = JSON.parse(JSON.stringify(this.data));
                this.emails = JSON.parse(JSON.stringify(this.data))

            }
        },
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

    .card-draggable .vx-card__body {
        padding-top: .5rem !important;
        padding-bottom: .5rem !important;
    }

    .card-draggable {
        box-shadow: none;
        border: 1px solid #80808080;
        transition-duration: .1s !important;
    }

    .card-draggable:hover {
        background-color: rgba(228, 228, 228, 0.68);
        transition-duration: .1s !important;
    }
</style>
