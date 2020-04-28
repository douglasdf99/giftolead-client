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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Conta</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>

        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
              <div class="mt-4">
                <label class="vs-input--label">Status</label>
                <v-select v-model="status_local" :class="'select-large-base'" :clearable="false" :options="opcoesIntegracao" v-validate="'required'" name="status" />
                <span class="text-danger text-sm"  v-show="errors.has('status')">{{ errors.first('status') }}</span>
              </div>
<!--                &lt;!&ndash;<v-select id="integracao" v-validate="'required'" v-model="selected" :options="opcoesIntegracao"/>&ndash;&gt;-->
<!--                <vs-select  v-validate="'required'" @input="mudou" @focus="mudou" v-model="selected" name="integracao" label="Integração" class="select-large mt-5 w-full">-->
<!--                    <vs-select-item :key="index" :value="item.id" :text="item.label" v-for="(item,index) in opcoesIntegracao" />-->
<!--                </vs-select>-->

                <vs-input size="large "  v-validate="'required'" label="Nome da conta" autocomplete="off" v-model="conta.nome" class="mt-5 w-full"
                          name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>

                <vs-input size="large" label="Token da conta" autocomplete="off" v-model="conta.token"
                          class="mt-5 w-full" name="token" v-validate="'required'"/>
                <span class="text-danger text-sm" v-show="errors.has('token')">Este campo é obrigatório</span>
                <vs-input v-if="conta.integracao.need === 2" size="large" label="Token 2 da conta" autocomplete="off" v-model="conta.token2"
                          class="mt-5 w-full" name="token" v-validate="'required'"/>
                <span class="text-danger text-sm" v-show="errors.has('token2')">Este campo é obrigatório</span>
                <vs-input v-if="conta.integracao.need >= 2" size="large" label="Token 3 da conta" autocomplete="off" v-model="conta.toke3"
                          class="mt-5 w-full" name="token" v-validate="'required'"/>
                <span class="text-danger text-sm" v-show="errors.has('token3')">Este campo é obrigatório</span>
            </div>
        </VuePerfectScrollbar>

        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" >Salvar</vs-button>
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
        watch: {
            isSidebarActive(val) {
                if (!val) return
                if (Object.entries(this.data).length === 0) {
                    this.initValues()
                    this.$validator.reset()
                } else {
                    console.log('entrou aqui', this.data);
                    this.conta = JSON.parse(JSON.stringify(this.data));
                    this.selected = this.conta.integracao_id;
                    //this.selected.label = this.conta.integracao.descricao;

                }
                // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
            }
        },
        data() {
            return {
                conta: {
                    empresa_id: 1,
                    integracao: {}
                },
                opcoesIntegracao: [{id: 'Foo', label: 'foo'},{id: 'Foo2', label: 'foo2'}],
                selected: null
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
                this.conta.nome = ''
                this.conta.token = ''
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.conta};
                        if (this.conta.id !== null && this.conta.id >= 0) {
                            obj._method = 'PUT';
                            this.$store.dispatch("updateItem", {rota: 'contas', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A conta foi atualizada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                              this.$store.dispatch('getVarios', {rota: 'brindes', params: {}}).then(() => {
                                this.$vs.loading.close()
                              });

                            }).catch(err => {
                                console.error(err)
                            })
                        } else {
                            delete obj.id
                            console.log('obj', obj)
                            obj.integracao_id = this.selected;
                            this.$store.dispatch("addItem", {rota: 'contas', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A conta foi criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                })
                                this.$store.dispatch('getVarios', 'contas').then(() => {
                                    this.$vs.loading.close()
                                });
                            }).catch(error => {
                                console.error(err)
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
            getOpcoes() {
                this.$store.dispatch('contas/getOpcoes').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesIntegracao.push({id: item.id, label: item.descricao})
                    });
                    console.log('af', this.opcoesIntegracao)
                    console.log('af2', [{id: 'Foo', label: 'foo'}])
                })
            },
            mudou(){
                console.log(this.selected)
            }
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
        created() {
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
