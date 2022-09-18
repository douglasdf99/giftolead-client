<template>
    <div>
        <div class="vx-row mb-4" v-if="campanhaSelected != 'cancelado'">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{ campanha.status ? 'Ativado' : 'Desativado' }}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da campanha</span>
                <vs-input class="w-full" v-model="campanha.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Produto da campanha</span>
                <v-select v-model="produtoSelected" :class="'select-large-base'" :clearable="false" style="background-color: white" :options="produtos" v-validate="'required'" name="produto"/>
                <span class="text-danger text-sm" v-show="errors.has('produto')">{{ errors.first('produto') }}</span>
            </div>
        </div>
        <div class="vx-row mt-10 mb-3 justify-around flex">
            <div class="vx-col w-full mb-10">
                <h2 class="subtitulo">Escolha o tipo de campanha de recuperação</h2>
            </div>
            <div class="vx-col w-full lg:w-1/5 sm:w-full text-center hover-opacidade cursor-pointer"
                 v-for="(tipo, index) in tiposCampanha" @click="campanhaSelected = tipo.img" :key="index">
                <div class="tipo-conquista" :class="{'conquista-ativa': (campanhaSelected == tipo.img)}">
                    <div class="vx-row py-5">
                        <div class="vx-col w-full">
                            <img src="@/assets/images/util/checkout.svg" alt="" v-if="tipo.img == 'checkout'">
                            <img src="@/assets/images/util/boleto.svg" alt="" v-if="tipo.img == 'boleto'">
                            <img src="@/assets/images/util/whatsapp.svg" alt="" v-if="tipo.img == 'whatsapp'">
                            <img src="@/assets/images/util/agendamento.svg" alt="" v-if="tipo.img == 'agendamento'">
                            <img src="@/assets/images/util/cancelado.svg" alt="" v-if="tipo.img == 'cancelado'">
                        </div>
                        <div class="vx-col w-full text-center mt-5">
                            <p class="destaque justify-center mb-3" v-html="tipo.text"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full">
                <span class="text-danger text-sm" v-show="!campanhaSelected">Selecione um tipo de campanha</span>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                               @click="$router.push({name: 'meus-planos'})">
                        Cancelar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="primary" type="border" @click="salvar" :disabled="isValid">
                        Salvar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select';
import moduleCampanhas from '@/store/campanhas/moduleCampanhas.js';
import moduleProdutos from '@/store/produtos/moduleProdutos.js';
import {Validator} from 'vee-validate';
import saveleadsConfig from "../../../saveleadsConfig";

const dict = {
    custom: {
        nome: {
            required: 'Por favor, insira o nome do produto',
        },
        produto: {
            required: 'Por favor, selecione um produto',
        },
    }
};
Validator.localize('pt-br', dict);
export default {
    name: "Edit",
    components: {
        'v-select': vSelect
    },
    created() {
        if (!moduleCampanhas.isRegistered) {
            this.$store.registerModule('campanhas', moduleCampanhas);
            moduleCampanhas.isRegistered = true;
        }
        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos);
            moduleProdutos.isRegistered = true;
        }
        this.getOpcoes();

        /*if (this.$route.name === 'produto-editar') {
            this.produtoSelected = {id: null, label: ''};
            this.getId(this.$route.params.id);
        } else {
            this.campanha.preco = true;
        }*/
    },
    data() {
        return {
            customcor: '',
            campanha: {
                nome: '',
                produto_id: null,
                tipo: '',
                status: false
            },
            campanhaSelected: null,
            url: saveleadsConfig.url_api,
            produtoSelected: {id: null, label: 'Selecione'},
            produtos: [],
            tiposCampanha: [
                {img: 'checkout', text: 'Recuperação <br> de carrinho'},
                {img: 'boleto', text: 'Recuperação <br> de boletos'},
                {img: 'whatsapp', text: 'Recuperação <br> por whatsapp'},
                {img: 'agendamento', text: 'Agendamento <br> de Ticket'},
                {img: 'cancelado', text: 'Ticket para <br> Vendas Canceladas'},
            ]
        };
    },
    methods: {
        salvar() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    if (this.campanhaSelected == null) {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'verifique os erros específicos',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        });
                    } else {
                        this.$vs.loading();
                        this.campanha.produto_id = this.produtoSelected.id;
                        this.campanha.tipo = this.campanhaSelected;
                        this.campanha.plano_id = this.$route.params.plan_id;
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('campanhas/update', this.campanha).then(() => {
                                this.$vs.notify({
                                    title: '',
                                    text: "Atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'planos-gerenciar', params:{plan_id:this.$route.params.plan_id }});
                            }).catch(erro => {
                                this.$vs.notify({
                                    title: '',
                                    text: erro.response.data.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                });
                            }).finally(() => this.$vs.loading.close());
                        } else {
                            this.$store.dispatch('campanhas/store', this.campanha).then(() => {
                                this.$vs.notify({
                                    title: '',
                                    text: "Criada com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'planos-gerenciar', params:{plan_id:this.$route.params.plan_id }});
                            }).finally(() => this.$vs.loading.close());
                        }
                    }
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                }
            });
        },

        getOpcoes() {
            this.produtos = [];
            this.$store.dispatch('produtos/getArraySelect').then(response => {
                this.produtos = [...response];
            });
        },
        getId(id) {
            this.$vs.loading();
            this.$store.dispatch('campanhas/getId', id).then(data => {
                this.campanha = {...data};
            }).catch(error => {
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        copyText() {
            const thisIns = this;
            this.$copyText(this.url).then(function () {
                thisIns.$vs.notify({
                    title: 'Success',
                    text: 'URL copiada para sua área de transferência',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                });
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar link',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                });
            });
        }
    },
    computed: {
        isValid() {
            return this.errors.any();
        },
    },
    watch: {
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle;
        }
    },
};
</script>

<style>
[dir] .con-select .vs-select--input {
    padding: 1.4rem 2rem !important;
}

.list-tipo-comissao .vs-radio--label {
    font-weight: 600;
    margin-left: 2rem;
}

#copy-icon {
    position: absolute;
    top: 0.7rem;
    right: 30px;
    cursor: pointer;
}
</style>
