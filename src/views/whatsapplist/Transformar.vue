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
            <h4>Transformando em Ticket</h4>
            <!--<feather-icon icon="XIcon" @click.stop="fechar" class="cursor-pointer"></feather-icon>-->
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6 flex flex-col justify-between" style="max-height: 90%; min-height: 88%">
                <div class="vx-row">
                    <div class="vx-col w-full mb-10">
                        <p class="font-bold text-xl text-black">{{ data.lead.nome }}</p>
                        <p class="font-bold text-xl text-primary">{{ data.telefone | VMask('(##) #####-####') }}</p>
                        <p class="font-normal text-lg pb-2" style="color: #9B9B9B; border-bottom: 1px solid #D9D9D9;">{{ data.email }}</p>
                    </div>
                    <div class="vx-col w-full">
                        <p class="font-bold text-lg text-black">{{ data.campanhable.campanhas[0].plano.nome }}</p>
                        <p class="font-normal text-lg text-black mb-1">Origem: {{ origem(data.campanhable_type) }}</p>
                        <vs-chip :color="data.campanhable.produto.cor || ''" class="product-order-status">
                            {{ data.campanhable.produto.nome }}
                        </vs-chip>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full mb-5">
                        <p class="font-bold text-black text-md">Como deseja fazer com o atendimento do Ticket?</p>
                    </div>
                    <!--<div class="vx-col w-full mb-3">
                        <div class="border-2 border-solid rounded-lg px-5 py-3 cursor-pointer" style="border-color: #C7C7C7"
                             :class="{'conquista-ativa': (metodo == 0 && metodo != null)}" @click="metodo = 0">
                            <p class="mb-0 font-bold text-normal inline-block">Agendar para uma data futura</p>
                            <flat-pickr :config="configdateTimePicker" v-model="datetime" class="flatpickr-custom" placeholder="Clique aqui" v-if="metodo == 0"/>
                        </div>
                    </div>-->
                    <div class="vx-col w-full mb-3" @click="metodo = 0">
                        <div class="div-flatpicker" :class="{'conquista-ativa': (metodo == 0 && metodo != null)}">
                            <flat-pickr :config="configdateTimePicker" v-model="datetime" id="teste" class="flatpickr-custom w-full border-2 border-solid rounded-lg px-5 py-3 cursor-pointer ml-0"
                                        placeholder="Agendar para uma data futura"/>
                        </div>
                    </div>
                    <div class="vx-col w-full">
                        <div class="border-2 border-solid rounded-lg px-5 py-3 cursor-pointer option" style="border-color: #C7C7C7"
                             :class="{'conquista-ativa': (metodo == 1 && metodo != null)}" @click="metodo = 1;datetime=null">
                            <p class="mb-0 font-bold text-normal">Atender ele agora</p>
                        </div>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="submitData" :disabled="metodo == null">Transformar em ticket</vs-button>
            <vs-button type="border" color="danger" @click="$emit('closeSidebar')">Cancelar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {Portuguese} from 'flatpickr/dist/l10n/pt.js';

const moment = require('moment/moment');
require('moment/locale/pt-br');

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
            metodo: null,
            datetime: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
                altInput: true,
                altFormat: 'd/m/Y H:i',
                locale: Portuguese
            },
            //Modal
            modal: false,
            selectedLink: {id: null, label: 'Selecione o link'},
            links: []
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
        submitData() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    let obj = {
                        id: this.data.id,
                        produto: this.data.campanhable.produto.id
                    };

                    if (this.metodo) obj.data = moment().format('YYYY-MM-DD hh:mm');
                    else obj.data = this.datetime;

                    this.$store.dispatch('whatsapplist/transformar', obj).then(() => {
                        console.log('eita')
                        this.$vs.notify({
                            title: '',
                            text: "Ticket criado com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });

                        if (this.metodo) {
                            this.$emit('closeSidebar')
                            this.$router.push({name: 'tickets-list'});
                        }
                        this.$store.dispatch('whatsapplist/transformar', obj).then(response => {
                            console.log('eita')
                            this.$vs.notify({
                                title: '',
                                text: "Ticket criado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });

                            if (this.metodo){
                                this.$emit('closeSidebar')
                                this.$router.push({name: 'tickets-list'});
                            }


                    }).catch(erro => {
                        console.log(erro);
                        let self = this;
                        this.$vs.dialog({
                            color: 'danger',
                            title: `Ops`,
                            text: 'Algo de errado ocorreu na criação do ticket',
                            accept: this.fechar(),
                            acceptText: 'Ok'
                        })
                    });
                    this.$vs.loading.close();
                    this.fechar();
                }
            })
        },
        fechar() {
            this.$emit('getItems')
            this.isSidebarActiveLocal = false
        },
        close() {
            this.modal = false;
        },
        origem(val) {
            let tipo = ''
            switch (val) {
                case 'App\\Models\\CampanhaWhatsapp':
                    tipo = 'Campanha Whatsapp';
            }

            return tipo;
        }
    },
    components: {
        VuePerfectScrollbar, flatPickr
    },
    created() {
        console.log('data aí', this.data)
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
    height: calc(93vh);
}
</style>

<style>
.vs-sidebar--background {
    background: rgba(0, 0, 0, .2) !important;
}

.flatpickr-custom {
    padding: 0;
    border-color: #C7C7C7;
    color: rgb(98, 98, 98);
    font-family: "Montserrat", sanf-serif;
    font-weight: 700;
    font-size: 1rem;
}

.flatpickr-custom::placeholder {
    color: rgb(98, 98, 98);
    font-family: "Montserrat", sanf-serif;
    font-weight: 700;
    font-size: 1rem;
}

.flatpickr-custom.conquista-ativa::placeholder {
    color: white;
}

.flatpickr-custom.conquista-ativa, .option.conquista-ativa, .div-flatpicker.conquista-ativa * {
    border-color: #9344c4 !important;
}

.div-flatpicker {
    border-radius: .5rem;
}

.div-flatpicker.conquista-ativa * {
    background-color: #9344C4;
    color: white;
}

.div-flatpicker.conquista-ativa *::placeholder {
    color: white;
}
</style>
