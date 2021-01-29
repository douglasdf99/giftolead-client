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
            <div class="">
                <div class="p-6 pt-0">
                    <h4 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 my-3">Informações pessoais</h4>
                    <form class="w-full px-6">
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 font-bold">Destinatário</p>
                            <vs-input class="w-full mb-3" v-model="endereco.nome" type="text" required/>
                        </div>
                        <div class="vx-row mt-2">
                            <div class="vx-col w-3/12">
                                <p class="gray-wdc mb-2 font-bold">DDD</p>
                                <vs-input class="w-full mb-3"
                                          v-model="endereco.ddd" type="text" required v-mask="'##'" @keypress="isNumber"/>
                            </div>
                            <div class="vx-col w-9/12">
                                <p class="gray-wdc mb-2 font-bold">Telefone</p>
                                <vs-input class="w-full mb-3"
                                          v-model="endereco.telefone" type="text" required v-mask="['####-####', '#####-####']" @keypress="isNumber"/>
                            </div>
                        </div>
                    </form>
                    <h4 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 mb-3 mt-5">Suas informações de entrega</h4>
                    <form class="w-full px-6 vs-con-loading__container" id="div-with-loading">
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 font-bold">CEP (CÓDIGO POSTAL)</p>
                            <vs-input class="w-full mb-3" id="search_input_trans1"
                                      v-model="endereco.cep" name="cep" type="text" required @keypress="isNumber" v-mask="'########'" v-validate="'required|digits:8'"/>
                            <span class="text-danger text-sm" v-show="errors.has('cep')">{{ errors.first('cep') }}</span>

                        </div>
                        <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4" @click="buscaCep" v-if="!valido"
                                   type="button">
                            Buscar
                        </vs-button>

                        <div class="" v-if="valido">
                            <div class="vx-row mt-2">
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Estado</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.estado"
                                              :disabled="true"/>
                                </div>
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Cidade</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.cidade"
                                              :disabled="true"/>
                                </div>
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Bairro</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.bairro"/>
                                </div>
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Endereço</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.endereco"/>
                                </div>
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Complemento</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.complemento" name="complemento"
                                              v-validate="'required|max:30'"/>
                                    <span class="text-danger text-sm" v-show="errors.has('complemento')">{{ errors.first('complemento') }}</span>

                                </div>
                                <div class="vx-col w-6/12">
                                    <p class="gray-wdc mb-2 font-bold">Número</p>
                                    <vs-input class="w-full mb-3" type="text" required v-model="endereco.numero" name="numero"
                                              v-validate="'max:5'"/>
                                    <span class="text-danger text-sm" v-show="errors.has('numero')">{{ errors.first('numero') }}</span>

                                </div>
                            </div>
                            <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4"
                                       type="submit" @click="storeEndereco" :disabled="invalidoEntrega">
                                Confirmar dados
                            </vs-button>
                        </div>
                    </form>
                </div>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import vSelect from 'vue-select'
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
import {Validator} from 'vee-validate';

const {consultarCep} = require("correios-brasil");
const dict = {
    custom: {
        cep: {
            required: 'Por favor, insira o cep',
            digits: 'O cep deve conter o total de 8 digitos',
        },
        complemento: {
            max: 'O limite maximo escrito aceito é de 30 caracters',
        },
        numero: {
            required: 'Por favor, insira o numero',
            max: 'O limite maximo escrito aceito é de 5 caracters'
        },
    }
};
Validator.localize('pt-br', dict);
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

    data() {
        return {
            endereco: {
                telefone: '',
                ddd: '',
                endereco: '',
                estado: '',
                cidade: '',
                bairro: '',
                complemento: '',
                numero: '',
            },
            valido: false,
            antigoCep: '',
        }
    },
    watch: {
        endereco: {
            handler: function (e) {
                if (e.cep != this.antigoCep) {
                    this.valido = false;
                }
            },
            deep: true
        },
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
    created() {
        this.getEndereco(this.data.id);

        if (!moduleExpedicoesBrindes.isRegistered) {
            this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
            moduleExpedicoesBrindes.isRegistered = true;
        }
        /*this.$vs.loading({
            container: '#div-with-loading',
            scale: 0.6
        });*/
    },
    computed: {
        invalidoEntrega() {
            return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length < 8
                || !this.endereco.endereco || !this.endereco.bairro);
        },
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar');
                }
            }
        },
    },
    methods: {
        storeEndereco() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.endereco.telefone = this.endereco.ddd + this.endereco.telefone.replace('-', '');
                    this.endereco.nome = this.removeAccents(this.endereco.nome);
                    this.$vs.loading();
                    this.$store.dispatch('expedicaos/storeEndereco', this.endereco).then(response => {
                        this.isSidebarActiveLocal = false;
                        this.$vs.notify({
                            color: 'success',
                            text: 'Salvo com sucesso.'
                        });
                        this.$emit('validar', this.endereco);
                    }).catch(erro => {
                        this.$vs.notify({
                            color: 'danger',
                            text: erro.response.data.message
                        })
                    }).finally(() => this.$vs.loading.close());
                } else {
                    alert('Verifique os erros');
                }
            })
        }
        ,
        getEndereco(id) {
            this.$vs.loading();
            this.$store.dispatch('expedicaos/getEndereco', id).then(response => {

                this.endereco = response.data;
                this.endereco.ddd = this.endereco.telefone.substring(0, 2);
                this.endereco.telefone = this.endereco.telefone.replace(this.endereco.ddd, '');

                this.antigoCep = this.endereco.cep;
                if (this.endereco.cep) {
                    this.valido = true;
                }
                this.$vs.loading.close();

            }).catch(erro => {
                this.$vs.notify({
                    title: '',
                    color: 'danger',
                    text: erro.response.data.message
                })
            });
        },
        buscaCep() {
            if (this.valido) {
            } else {
                this.endereco.complemento = '';
                this.endereco.numero = '';
                consultarCep(this.endereco.cep).then(response => {
                    this.antigoCep = this.endereco.cep;
                    this.valido = true;
                    this.endereco.cidade = this.removeAccents(response.localidade);
                    this.endereco.bairro = this.removeAccents(response.bairro);
                    this.endereco.endereco = this.removeAccents(response.logradouro);
                    this.endereco.estado = this.removeAccents(response.uf);
                }).catch(erro => {
                    this.$vs.notify({
                        title: '',
                        color: 'danger',
                        text: erro.response.data.message
                    })
                });
            }
        },
    },
    components: {
        VuePerfectScrollbar,
        'v-select': vSelect
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
