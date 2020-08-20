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
            <h4>Dados da Etiqueta</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <vs-divider class="mb-0"></vs-divider>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row mb-3">
                    <div class="vx-col w-full">
                        <p class="text-lg destaque text-black">Informações Gerais</p>
                    </div>
                </div>
                <div class="vx-row mb-5">
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-md mb-2 flex items-center">
                            <b>Produto: </b>
                            <vs-chip class="ml-3" :color="this.data.produto.cor || ''">{{this.data.produto.nome}}</vs-chip>
                        </p>
                        <p class="text-md mb-2"><b>Brinde: </b> {{this.data.brinde.nome}}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 lg:text-right">
                        <p class="text-md mb-2"><b>Ticket: </b> #{{this.data.ticket_id}}</p>
                        <p class="text-md mb-2"><b>Lançado por: </b> {{this.data.responsavel.nome}}</p>
                    </div>
                </div>
                <vs-divider class="my-5"></vs-divider>
                <div class="vx-row mb-3">
                    <div class="vx-col w-full">
                        <p class="text-lg destaque text-black">Informações Pessoais</p>
                    </div>
                </div>
                <div class="vx-row mb-5">
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-md mb-2"><b>Nome: </b>{{this.data.lead.nome}}</p>
                        <p class="text-md mb-2"><b>E-mail: </b> {{this.data.lead.email}}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 lg:text-right">
                        <p class="text-md mb-2"><b>CPF: </b> {{(this.data.lead.cpf || 'Não preenchido') | VMask('###.###.###-##')}}</p>
                        <p class="text-md mb-2"><b>Telefone: </b> {{this.data.lead.ddd + this.data.lead.telefone | VMask('(##) #####-####')}}</p>
                    </div>
                </div>
                <vs-divider class="my-5"></vs-divider>
                <div class="vx-row mb-3" v-if="this.data.endereco">
                    <div class="vx-col w-full">
                        <p class="text-lg destaque text-black">Endereço</p>
                    </div>
                </div>
                <div class="vx-row mb-5" v-if="this.data.endereco">
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-md mb-2"><b>CEP: </b>Um cep aqui</p>
                        <p class="text-md mb-2"><b>Cidade: </b> {{this.data.lead.email}}</p>
                        <p class="text-md mb-2"><b>Endereço: </b> {{this.data.lead.email}}</p>
                        <p class="text-md mb-2"><b>Complemento: </b> {{this.data.lead.email}}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 lg:text-right">
                        <p class="text-md mb-2"><b>Estado: </b> {{(this.data.lead.cpf || 'Não preenchido') | VMask('###.###.###-##')}}</p>
                        <p class="text-md mb-2"><b>Bairro: </b> {{this.data.lead.ddd + this.data.lead.telefone | VMask('(##) #####-####')}}</p>
                        <p class="text-md mb-2"><b>Número: </b> {{this.data.lead.ddd + this.data.lead.telefone | VMask('(##) #####-####')}}</p>
                        <p class="text-md mb-2"><b>Status atual da Etiqueta: </b> {{this.data.lead.ddd + this.data.lead.telefone | VMask('(##) #####-####')}}</p>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
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
                    this.brinde = JSON.parse(JSON.stringify(this.data));
                }
            },
        },
        data() {
            return {}
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
        },
        methods: {},
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect
        },
        created() {
            console.log('obj', this.data);
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
