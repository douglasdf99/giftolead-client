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
            <h4>Detalhe da Pré Comissão</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row flex items-center">
                    <div class="vx-col w-full lg:w-1/2">
                        <p>Data: <b>{{data.created_at | formatDateTime}}</b></p>
                        <vs-chip :color="data.tipo === 'pendente' ? 'warning' : 'danger'">Status: {{data.tipo}}</vs-chip>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 text-right">
                        <p class="font-bold text-3xl text-dark">Ticket: {{data.ticket.id}}</p>
                    </div>
                </div>
                <div class="vx-row mt-5">
                    <div class="vx-col w-full">
                        <vs-table :data="data.comissaos" class="table-items">

                            <template slot="thead">
                                <!--<vs-th></vs-th>-->
                                <vs-th>Usuários</vs-th>
                                <vs-th>Motivo</vs-th>
                                <vs-th>Comissão</vs-th>
                                <vs-th>Conquista</vs-th>
                                <vs-th>Valor Total</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                    <vs-td></vs-td>
                                    <vs-td></vs-td>
                                    <vs-td>
                                        <span class="preco">R$ {{formatPrice(tr.full_price)}}</span>
                                    </vs-td>
                                    <vs-td></vs-td>
                                    <vs-td v-if="tr.produto">
                                        <span class="preco">R$ {{formatPrice(tr.produto.preco)}}</span>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <!--<div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="verificaLeadEmail">{{!prosseguiu ? 'Prosseguir' :
                'Salvar'}}
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
            return {

            }
        },
        created() {

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
