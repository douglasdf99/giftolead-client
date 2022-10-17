<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da campanha</span>
                <vs-input class="w-full" v-model="campanha.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Produto da campanha</span>
                <v-select v-model="produtoSelected" :disabled="$route.name == 'brindes-campanhas-editar'" :class="'select-large-base'" :clearable="false" style="background-color: white" :options="produtos"
                          v-validate="'required'" name="produto"/>
                <span class="text-danger text-sm" v-show="errors.has('produto')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full">
                <span class="font-regular mb-2">O que será entregue</span>
                <v-select v-model="brindeSelected" :disabled="!produtoSelected.id || brindes.length == 0 || $route.name == 'brindes-campanhas-editar'" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="brindes"
                          v-validate="'required'" name="brinde"/>
                <span class="text-danger text-sm" v-show="errors.has('brinde')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full">
                <span class="font-regular mb-2">Descrição da Campanha</span>
                <vs-textarea v-model="campanha.descricao" id="text-area" class="w-full bg-white" rows="6" name="descricao"/>
                <span class="text-danger text-sm" v-show="errors.has('descricao')">Este campo é obrigatório</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full mb-3">
                <h2 class="font-bold" style="font-family: 'Poppins';">Configurando a sua segmentação para solicitação automática de endereço</h2>
            </div>
            <div class="vx-col w-full relative">
                <span class="font-regular mb-2">Quando o seguinte evento acontecer</span>
                <v-select :closeOnSelect="false" v-model="tiposSelected" :options="tipos" dir="ltr" class="bg-white select-large-base"/>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar" :disabled="invalid">
                        Salvar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                               @click="$router.push({name: 'brindes-campanhas'})">
                        Cancelar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select';
import moduleBrindes from "../../store/brindes/moduleBrindes";
import {Validator} from 'vee-validate';

Validator.localize('pt-br');
export default {
    name: "AddConfig",
    components: {
        'v-select': vSelect
    },
    data() {
        return {
            campanha: {
                nome: "",
                descricao: "",
            },
            produtoSelected: {},
            produtos: [],
            brindeSelected: {},
            brindes: [],
            tiposSelected: {},
            tipos: [
                {id: 'approved', label: 'Compra aprovada'},
                {id: 'completed', label: 'Completa'},
            ],
        };
    },
    created() {
        if (!moduleBrindes.isRegistered) {
            this.$store.registerModule('brindes', moduleBrindes);
            moduleBrindes.isRegistered = true;
        }

        this.getOpcoes();

        if (this.$route.params.id)
            this.getId();
    },
    methods: {
        getId() {
            this.$store.dispatch('brindes/getCampanha', this.$route.params.id).then(response => {
                this.campanha = {...response};
                this.produtoSelected = {id: this.campanha.produto.id, label: this.campanha.produto.nome};
                switch (this.campanha.tipos) {
                    case 'approved':
                        this.tiposSelected = {id: 'approved', label: 'Compra aprovada'};
                        break;
                    case 'completed':
                        this.tiposSelected = {id: 'completed', label: 'Completa'};
                        break;
                    default:
                        this.tiposSelected = {id: 'billet_printed', label: 'Boleto Gerado'};
                }
                this.brindeSelected = {id: this.campanha.brinde.id, label: this.campanha.brinde.nome};
            });
        },
        getOpcoes() {
            this.$store.dispatch('produtos/get').then(response => {
                this.produtos = [...this.arraySelect(response)];
            });
        },
        salvar() {
            if (this.tiposSelected.id) {
                this.campanha.tipos = this.tiposSelected.id;
            }
            if (this.produtoSelected.id) {
                this.campanha.produto_id = this.produtoSelected.id;
            }
            if (this.brindeSelected.id) {
                this.campanha.brinde_id = this.brindeSelected.id;
            }
            this.$store.dispatch('brindes/storeCampanha', this.campanha).then(() => {
                this.$vs.notify({
                    title: 'Sucesso',
                    text: "A Campanha foi salva com sucesso.",
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    color: 'success'
                });
                this.$router.push({name: 'brindes-campanhas'});
            }).catch(erro => {
                this.$vs.notify({
                    title: 'Error',
                    text: erro.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            });
        }
    },
    watch: {
        produtoSelected: {
            handler() {
                this.brindes = [];
                if (this.$route.name == 'brindes-campanhas-criar')
                    this.brindeSelected = {};
                this.$store.dispatch('brindes/getArraySelect').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        if (item.produto_id === this.produtoSelected.id)
                            this.brindes.push({id: item.id, label: item.nome});
                    });
                });
            }
        },
    },
    computed: {
        invalid() {
            return this.errors.any() || (this.campanha.nome == "" || this.campanha.descricao == "" || !this.produtoSelected.id || !this.brindeSelected.id);
        }
    }
};
</script>
