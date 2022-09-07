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
            <h4>Dados da Automação</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row mb-4">
                    <div class="vx-col w-full">
                        <p class="text-lg destaque font-bold">{{data.nome_destinatario}}</p>
                        <p class="text-md text-black">{{data.email_destinatario}}</p>
                        <vs-chip class="my-3 text-white text-lg bg-primary">{{expedicao.brinde.nome}}</vs-chip>
                    </div>
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-md mb-1"><b>Cidade / Estado: </b> {{data.endereco.cidade + ' / ' + data.endereco.estado}}</p>
                        <p class="text-md mb-1"><b>Bairro: </b> {{data.endereco.bairro}}</p>
                        <p class="text-md mb-1"><b>Endereço: </b> {{data.endereco.endereco}}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 lg:text-right">
                        <p class="text-md mb-1"><b>Complemento: </b> {{data.endereco.complemento}}</p>
                        <p class="text-md mb-1"><b>Número: </b> {{data.endereco.numero}}</p>
                        <p class="text-md mb-1"><b>CEP: </b>{{data.endereco.cep | VMask('##.###-###')}}</p>
                    </div>
                </div>
                <div class="vx-row contained-example-container">
                    <div class="vx-col w-full vs-con-loading__container" id="div-with-loading">
                        <h1 class="poppins md:text-3xl font-bold text-center">
                            Objeto <span style="color: #9344C4">{{(data.rastreio && expedicao.fechado) ? data.rastreio : 'aguardando postagem'}}</span>
                        </h1>
                        <table class="md:mx-auto table-auto mt-8 poppins md:w-10/12">
                            <tbody>
                            <tr class="border-t border-gray-600" v-for="(item, index) in historicoRastreio" :key='index'>
                                <td class="py-2 w-1/3 text-sm font-normal md:pl-16 pt-5 pb-8">
                                    <p class="text-xs md:text-sm">{{item.date + ' ' + item.hour}}</p>
                                    <p>{{item.location}}</p>
                                </td>
                                <td class="w-2/3 mb-8">
                                    <p class="font-bold text-sm">{{item.action}}</p>
                                    <p class="font-normal md:text-sm text-xs">{{item.message}}</p>
                                </td>
                            </tr>
                            <tr class="border-t border-gray-600">
                                <td class="py-2 w-1/3 text-sm font-normal md:pl-16 pt-5 pb-8">
                                    <p class="text-xs md:text-sm">{{data.endereco.updated_at | formatDateTime}}</p>
                                </td>
                                <td class="w-2/3 mb-8">
                                    <p class="font-bold text-sm">Objeto Solicitado</p>
                                    <p class="font-normal md:text-sm text-xs">Aguardando postagem</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import vSelect from 'vue-select';

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
            expedicao: {
                type: Object,
                default: () => {
                },
            },
        },
        watch: {
            isSidebarActive(val) {
                if (!val) return;
                if (Object.entries(this.data).length === 0) {
                    this.initValues();
                    this.$validator.reset();
                } else {
                    this.brinde = JSON.parse(JSON.stringify(this.data));
                }
            },
        },
        data() {
            return {
                historicoRastreio: [],
            };
        },
        created() {
            /*this.$vs.loading({
                container: '#div-with-loading',
                scale: 0.6
            });*/
            this.$store.dispatch('expedicao/rastreio', {rastreio: this.data.rastreio}).then(response => {
                if (!response.erro) {
                    this.historicoRastreio = response;
                }
            }).catch(erro => {
                this.$vs.notify({
                    text: erro.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive;
                },
                set(val) {
                    if (!val) {

                        this.$emit('closeSidebar');
                        // this.$validator.reset()
                        // this.initValues()
                    }
                }
            },
        },
        methods: {},
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
    };
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
