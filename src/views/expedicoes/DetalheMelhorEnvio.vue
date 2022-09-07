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
                    <div class="vx-col w-full mb-4">
                        <p class="text-lg destaque font-bold">{{ data.nome_destinatario }}</p>
                        <p class="text-md text-black">{{ data.email_destinatario }}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-md mb-1"><b>Cidade / Estado: </b> {{ data.endereco.cidade + ' / ' + data.endereco.estado }}</p>
                        <p class="text-md mb-1"><b>Bairro: </b> {{ data.endereco.bairro }}</p>
                        <p class="text-md mb-1"><b>Endereço: </b> {{ data.endereco.endereco }}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 lg:text-right">
                        <p class="text-md mb-1"><b>Complemento: </b> {{ data.endereco.complemento }}</p>
                        <p class="text-md mb-1"><b>Número: </b> {{ data.endereco.numero }}</p>
                        <p class="text-md mb-1"><b>CEP: </b>{{ data.endereco.cep | VMask('##.###-###') }}</p>
                    </div>
                </div>
                <div class="vx-row contained-example-container mt-10">
                    <div class="vx-col w-full vs-con-loading__container text-center" id="div-with-loading">
                        <vx-tooltip :text="data.rastreio_melhor_envio ? 'Rastreio do objeto direto pela plataforma' : 'Objeto aguardando postagem'" position="top">
                            <vs-button color="primary" outline size="large" :disabled="!data.rastreio_melhor_envio" class="text-white font-bold"
                                       @click="redirectUrl('https://www.melhorrastreio.com.br/rastreio/' + data.rastreio_melhor_envio)">
                                Visualizar andamento
                            </vs-button>
                        </vx-tooltip>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import vSelect from 'vue-select';
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";

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
        if (!moduleExpedicoesBrindes.isRegistered) {
            this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
            moduleExpedicoesBrindes.isRegistered = true;
        }

        this.getItem();
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
    methods: {
        getItem() {
            this.$store.dispatch('expedicaos/rastreio', {rastreio: this.data.rastreio}).then(response => {
                if (!response.erro) {
                    this.historicoRastreio = response;
                }
                //this.$vs.loading.close();
            });
        },
        redirectUrl(url) {
            window.open(url, '_blank');
        }
    },
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
