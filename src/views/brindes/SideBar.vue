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
            <h4>{{ Object.entries(this.data).length === 0 ? "Adicionar nova" : "Atualizar" }} Brinde</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>

        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">

              <vs-input size="large "  v-validate="'required'" label="Nome da brinde" autocomplete="off" v-model="brinde.nome" class="mt-5 w-full"
                        name="nome"/>
              <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>

              <div class="mt-4">
                <label class="vs-input--label">Selecione o contrato de entrega deste brinde</label>
                <v-select v-model="selected" :class="'select-large-base'" :clearable="false" :options="opcoesContrato" v-validate="'required'" name="contrato" />
                <span class="text-danger text-sm"  v-show="errors.has('contrato')">{{ errors.first('contrato') }}</span>
              </div>
              <div class="p-10" style="display: flex; justify-content: center; align-content: center">
                <img src="@/assets/images/util/medidas.svg" >
              </div>

              <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input size="large "  v-validate="'required'" label="Largura" autocomplete="off" v-model="brinde.largura" class="mt-5 w-full"
                            name="largura"/>
                  <span class="text-danger text-sm" v-show="errors.has('largura')">Este campo é obrigatório</span>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input size="large "  v-validate="'required'" label="Nome da brinde" autocomplete="off" v-model="brinde.altura" class="mt-5 w-full"
                            name="altura"/>
                  <span class="text-danger text-sm" v-show="errors.has('altura')">Este campo é obrigatório</span>
                </div>
              </div>

              <div class="vx-row ">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input size="large "  v-validate="'required'" label="Comprimento" autocomplete="off" v-model="brinde.comprimento" class="mt-5 w-full"
                            name="comprimento"/>
                  <span class="text-danger text-sm" v-show="errors.has('largura')">Este campo é obrigatório</span>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                  <vs-input size="large "  v-validate="'required'" label="Peso" autocomplete="off" v-model="brinde.peso" class="mt-5 w-full"
                            name="peso"/>
                  <span class="text-danger text-sm" v-show="errors.has('peso')">Este campo é obrigatório</span>
                </div>
              </div>
              <div class="mt-8">
              <vs-checkbox color="dark" v-model="checkBox5"><span class="label-bold-underline">Usar embalagem padrão</span></vs-checkbox>
              </div>
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
                    this.brinde = JSON.parse(JSON.stringify(this.data));
                    this.selected = this.brinde.integracao_id;
                    //this.selected.label = this.brinde.integracao.descricao;

                }
                // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
            }
        },
        data() {
            return {
                brinde: {
                    nome: '',
                    detal: '',
                    largura: '',
                    comprimento: '',
                    peso: '',
                    integracao: {}
                },
                opcoesContrato: [{id: 'Foo', label: 'foo'},{id: 'Foo2', label: 'foo2'}],
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
                this.brinde.nome = ''
                this.brinde.token = ''
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading()
                        const obj = {...this.brinde};
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
                            this.$store.dispatch("addItem", {rota: 'brindes', item: obj}).then(() => {
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "A brinde foi criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                })
                                this.$store.dispatch('getVarios', 'brindes').then(() => {
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
                this.$store.dispatch('brindes/getOpcoes').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesContrato.push({id: item.id, label: item.descricao})
                    });
                    console.log('af', this.opcoesContrato)
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
          if (Object.entries(this.data).length === 0) {
            //this.initValues()
            this.$validator.reset()
          } else {
            console.log('entrou aqui', this.data);
            this.brinde = JSON.parse(JSON.stringify(this.data));
            //this.selected = this.brinde.integracao_id;
            this.selected = {id: this.brinde.integracao_id, label: this.brinde.integracao.descricao};
            //this.selected.label = this.brinde.integracao.descricao;

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
