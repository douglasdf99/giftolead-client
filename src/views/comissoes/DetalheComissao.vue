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
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Valores a comissionar</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row mb-5">
                    <div class="vx-col w-1/2">
                        <div class="flex items-center">
                            <img :src="get_img_api(data.avatar)" width="50px" class="rounded-full mx-5" style="margin-left: -8%"/>
                            <p class="font-bold text-dark text-xl">{{data.name}}</p>
                        </div>
                    </div>
                    <div class="vx-col w-1/2">
                        <p class="font-bold text-xl">Valor Total: R$ {{somaComissao}}</p>
                    </div>
                </div>
                <div class="vx-row my-5 mt-10">
                    <div class="vx-col w-full">
                        <vs-table :data="listaComissao" class="table-items">

                            <template slot="thead">
                                <vs-th>Item</vs-th>
                                <vs-th>Motivo</vs-th>
                                <vs-th>Comissão</vs-th>
                                <vs-th>Responsável</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr" v-bind:class="{'row-table-disabled': true}">
                                    <vs-td>

                                    </vs-td>
                                    <vs-td>
                                        {{ tr.natureza }}
                                    </vs-td>
                                    <vs-td class="font-bold">
                                        R$ {{ formatPrice(tr.valor) }}
                                    </vs-td>
                                    <vs-td :data="tr.updated_at">
                                        <span class="destaque">{{ getResponsavel(tr.responsavel_type)}}</span>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <!--<div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" color="primary">
                Imprimir Ordem
            </vs-button>
        </div>-->
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'

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
        data() {
            return {}
        },
        created() {
            console.log('dados', this.data);
            console.log('listagem', this.listaComissao);
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
            somaComissao() {
                let soma = 0.0
                this.data.comissaos.forEach(item => {
                    soma += parseFloat(item.valor);
                });

                return this.formatPrice(soma);
            },
            listaComissao() {
                let nomes = [];

                this.data.comissaos.forEach(item => {
                    nomes.push(item.produto.nome);
                });

                let prods = [...new Set(nomes)];

                console.log('prods', prods);

                let arrFinal = [];

                prods.forEach(prod => {
                    this.data.comissaos.forEach(item => {
                        if(item.natureza == 'Atendimento'){
                            arrFinal = [prod, 'Atendimento']
                        }
                    })
                });
            }
        },
        methods: {
            getResponsavel(val) {
                switch (val) {
                    case 'App\\Models\\PreComissao':
                        return 'Pré Comissão'
                    default:
                        return val
                }
            }
        },
        components: {
            VuePerfectScrollbar,
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
</style>
