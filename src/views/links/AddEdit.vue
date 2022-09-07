<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full col flex items-center justify-between">
                <h4 class="text-black">Produto: {{ produto.nome }}</h4>
                <div>
                    <span class="float-right mt-1 mx-4" style="font-weight: bold">{{ link.status ? 'Ativado' : 'Desativado' }}</span>
                    <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.status" class="float-right switch"/>
                    <span class="float-right mt-1 mx-4" style="font-weight: bold">Status</span>
                </div>
            </div>
        </div>
        <div class="vx-row mt-5 mb-3">
            <div class="vx-col w-full mb-6">
                <span class="font-regular ">Descrição</span>
                <vs-input class="w-full" v-model="link.descricao" size="large" v-validate="'required|max:20'" name="descricao"/>
                <span class="text-danger text-sm" v-show="errors.has('descricao')">{{ errors.first('descricao') }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full xlg:w-4/12 lg:w-4/12">
                <span class="font-regular mb-2">Código da oferta</span>
                <vs-input class="w-full" v-model="link.codigo_oferta" size="large" v-validate="'required'"
                          name="codigo_oferta"/>
                <span class="text-danger text-sm"
                      v-show="errors.has('codigo_oferta')">{{ errors.first('codigo_oferta') }}</span>
            </div>
            <div class="vx-col w-full xlg:w-6/12 lg:w-6/12">
                <span class="font-regular mb-2">Código da origem (src) </span>
                <vs-input disabled class="w-full" v-model="link.src" v-validate="'required'" size="large" name="src"/>
                <span class="text-danger text-sm" v-show="errors.has('src')">{{ errors.first('src') }}</span>
                <!--<vs-input class="w-full" v-model="produto.comi_valor" size="large" v-money="money"/>-->
            </div>
            <div class="vx-col w-full xlg:w-2/12 lg:w-2/12">
                <span class="font-regular mb-2">Parcelas (até 12 vezes)</span>
                <v-select v-model="link.split" v-validate="'required|max_value:12|min_value:1'" :class="'select-large-base'" :clearable="false" class="bg-white"
                          :options="parcelas"/>
                <span class="text-danger text-sm" v-show="errors.has('split')">{{ errors.first('split') }}</span>
            </div>
        </div>
        <div class="vx-row mt-10 mb-4">
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.builder" class="float-left switch"/>
                <span class="float-left mt-1 mx-4" style="font-weight: bold">Checkout Builder</span>
            </div>
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.boleto" class="float-left switch"/>
                <span class="float-left mt-1 mx-4" style="font-weight: bold">Boleto bancário</span>
            </div>
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.paypal" class="float-left switch"/>
                <span class="float-left mt-1 mx-4" style="font-weight: bold">Paypal</span>
            </div>
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.debito" class="float-left switch"/>
                <span class="float-left mt-1 mx-4" style="font-weight: bold">Débito bancário</span>
            </div>
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.two_cart" class="float-left switch"/>
                <span class="float-left mt-1 mx-4"
                      style="font-weight: bold">Opção de parcelamento em dois cartões de crédito</span>
            </div>
            <div class="vx-col lg:w-full w-full mb-2">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="link.hab_comissao" class="float-left switch"/>
                <span class="float-left mt-1 mx-4"
                      style="font-weight: bold">Habilitar Comissionamento por link</span>
            </div>
        </div>
        <vs-divider class="mb-20"/>

        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar">
                        Salvar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="dark" type="filled" icon-pack="feather" icon="x-circle"
                               @click="$router.push({name: 'links-produto', params:produto.id})">
                        Cancelar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select';
import moduleLinks from '@/store/links/moduleLinks.js';
import moduleProdutos from '@/store/produtos/moduleProdutos.js';
import {Validator} from 'vee-validate';
import saveleadsConfig from "../../../saveleadsConfig";

const dict = {
    custom: {
        descricao: {
            required: 'Por favor, insira o nome do produto',
            max: 'Limite máximo é de 50 caracters',
        },
        codigo_oferta: {
            required: 'Por favor, selecione a conta que pertence esse produto',
        },
        scr: {
            required: 'Por favor, insira o código',
        },
        split: {
            required: 'Por favor, insira o código',
            max_value: 'Maximo é o numero 12',
            min_value: 'Minimo é o numero 1',
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
        if (!moduleLinks.isRegistered) {
            this.$store.registerModule('links', moduleLinks);
            moduleLinks.isRegistered = true;
        }
        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos);
            moduleProdutos.isRegistered = true;
        }
        this.getProduto(this.$route.params.id);

        if (this.$route.name === 'links-produto-editar') {
            this.getLink(this.$route.params.link);
        }

        //this.$route.meta.pageTitle = "Link do curso:"+ this.produto.nome;

    },
    mounted() {

    },
    updated() {
    },
    data() {
        return {
            customcor: '',
            produto: {},
            parcelas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            link: {
                indent: '',
                identidade: 'valor',
                descricao: '',
                codigo_oferta: '',
                builder: '',
                src: 'saveleads-user',
                split: '',
                paypal: '',
                debito: '',
                two_cart: '',
                hab_comissao: ''
            },
            url: saveleadsConfig.url_api,
            contaSelected: null,
            cores: ['#21BC9C', '#1EA085', '#2FCC70', '#28AF60', '#3598DB', '#2B80B9', '#A463BF', '#8E43AD',
                '#3D556E', '#222F3D', '#F2C512', '#F39C1A', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8'],
            configComissao: false,
            opcoesContas: [],
            money: {
                decimal: ',',
                thousands: '.',
                prefix: 'R$ ',
                suffix: '',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            percent: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '%',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
        };
    },
    methods: {
        salvar() {
            this.link.produto_id = this.produto.id;
            var self = this;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    if (self.link.id !== undefined) {
                        this.$store.dispatch('links/update', self.link).then(() => {
                            this.$vs.notify({
                                title: 'Sucesso',
                                text: "O link foi atualizado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.$router.push({name: 'links-produto', params: this.produto.id});
                        }).catch(erro => {
                            this.$vs.notify({
                                title: 'Error',
                                text: erro.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        }).finally(() => {
                            this.$vs.loading.close();
                        });
                    } else {
                        this.$store.dispatch('links/store', self.link).then(() => {
                            this.$vs.notify({
                                title: 'Sucesso',
                                text: "O link foi criado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.$router.push({name: 'links-produto', params: this.produto.id});
                        }).catch(erro => {
                            this.$vs.notify({
                                title: 'Error',
                                text: erro.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        }).finally(() => {
                            this.$vs.loading.close();
                        });
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
        selecionaCor(cor) {
            if (cor) {
                this.produto.cor = cor;
            } else {
                this.produto.cor = this.customcor;
            }
            this.errors.remove('cor');
        },
        selecionaTipoComissao(val) {
            this.produto.comissao_tipo = val;
        },
        getProduto(id) {
            this.$vs.loading();
            this.$store.dispatch('produtos/getId', id).then(data => {
                this.produto = {...data};
                this.$vs.loading.close();
            });
        },
        getLink(id) {
            this.$vs.loading();
            this.$store.dispatch('links/getId', id).then(data => {
                this.link = {...data};
                this.$vs.loading.close();
            });
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
            return this.errors.any() && this.produto.cor !== '';
        },
    },
    watch: {
        currentx() {
            this.$vs.loading();
            this.dados.page = this.currentx;
        },
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
    position: absolute;
    right: 30px;
    cursor: pointer;
}
</style>
