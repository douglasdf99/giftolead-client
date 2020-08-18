<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-3">
                <p class="text-lg font-bold text-black">Nas seguintes condições abaixo (opcional)</p>
            </div>
            <div class="vx-col w-full">
                <div class="p-4 rounded-md" style="background-color: #EDEDED">
                    <p class="text-sm gray">
                        Todos os filtros aplicados a uma condição devem acontecer ao mesmo tempo para que a segmentação seja executada. Se os filtros de uma condição não forem cumpridos, passaremos para a próxima
                        condição, respeitando a ordem de prioridade.
                    </p>
                </div>
            </div>
        </div>
        <div class="vx-row mt-10" v-if="(campanha.configs && campanha.configs.length > 0)">
            <div class="vx-col w-full mb-3">
                <vs-checkbox color="dark" v-model="campanha.oferta_all">
                    <span class="label-bold-underline">Habilitar para qualquer oferta e origem de checkout no Hotmart</span>
                </vs-checkbox>
            </div>
            <div class="vx-col w-full flex collumn items-center mb-10">
                <i class="material-icons text-lg mr-2">info_outline</i>
                <p class="text-gray">Esta opção habilita a solicitação automática de endereço para qualquer oferta no Hotmart para o produto desta campanha</p>
            </div>
            <div class="vx-col w-full">
                <vx-card class="mb-10" v-for="(item, index) in campanha.configs">
                    <span class="btn btn-dark btn-rounded font-13 text-white font-weight-bold text-ou" v-if="(campanha.configs.length > 1 && index != 0)"><vs-button
                            size="small" color="dark">OU</vs-button></span>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/12 w-full mb-2">
                            <vs-dropdown vs-trigger-click>
                                <vs-button radius color="#EDEDED" type="filled"
                                           class="btn-more-icon relative botao-menu"
                                           icon-pack="material-icons" icon="more_horiz"
                                ></vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list">
                                    <vs-dropdown-item @click="editarCondicao(item)">
                                        <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                        Editar
                                    </vs-dropdown-item>

                                    <vs-dropdown-item @click="deleteCondicao(item.id)">
                                        <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                        Deletar
                                    </vs-dropdown-item>

                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </div>
                        <div class="vx-col sm:w-1/12 w-full mb-2">
                            <span class="rounded-full bg-primary py-2 px-2 text-enum text-white font-bold">{{index + 1}}</span>
                        </div>
                        <div class="vx-col sm:w-4/12 w-full mb-2">
                            <p class="mb-0 text-base font-bold">Tipo</p>
                            {{getTipo(item.tipo)}}
                        </div>
                        <div class="vx-col sm:w-3/12 w-full mb-2">
                            <p class="mb-0 text-base font-bold">Condição</p>
                            <vs-chip :color="!campanha.oferta_all ? 'success' : 'danger'">{{!campanha.oferta_all ? 'Se for' : 'Se não for'}}</vs-chip>
                        </div>
                        <div class="vx-col sm:w-3/12 w-full mb-2">
                            <p class="mb-0 text-base font-bold">Valor aplicado</p>
                            <span class="font-15 font-weight-bold">{{item.valor}}</span>
                        </div>
                    </div>
                    <!-- end row -->
                </vx-card>
            </div>
        </div>

        <div class="vx-row justify-center align-center mt-10">
            <vs-button color="primary" type="filled" icon-pack="material-icons" icon="control_point"
                       class="font-bold" @click="showAdicionarExcecao">Adicionar {{(!campanha.oferta_all ? 'Condição' : 'Exceção')}}
            </vs-button>
        </div>
        <vs-prompt
                @cancel="clearValMultiple"
                @accept="sendexcecao"
                :acceptText="'Salvar'"
                :cancelText="'Cancelar'"
                :is-valid="validExcecao"
                :title="'Adicionar ' + (!campanha.oferta_all ? 'Condição' : 'Exceção')"
                :max-width="'600px'"
                :active.sync="modalexcecao">
            <div class="con-exemple-prompt">
                <vs-alert v-show="!validExcecao" color="danger" vs-icon="new_releases" class="mb-2">
                    Os campos não podem ficar vazios
                </vs-alert>
                <div class="">
                    <span class="font-regular mb-2">Tipo</span>
                    <v-select v-model="val.tipo" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="tipos" v-validate="'required'" name="tipo"/>
                </div>
                <div class="">
                    <span class="font-regular mb-2">Valor</span>
                    <vs-input class="w-full" v-model="val.valor" size="large"></vs-input>
                </div>
            </div>
        </vs-prompt>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleBrindes from "../../store/brindes/moduleBrindes";

    export default {
        name: "Condicoes",
        components: {
            'v-select': vSelect,
        },
        data() {
            return {
                campanha: {
                    oferta_all: false
                },
                configs: {},

                //Modal Exceção/Condição
                modalexcecao: false,
                val: {
                    id: null,
                    tipo: "",
                    valor: "",
                    campanha_brinde_id: this.$route.params.id
                },
                tipos: [
                    {id: 'hotmart', label: 'Hotmart'},
                    {id: 'sck', label: 'SCK'},
                    {id: 'src', label: 'SRC'},
                ],
            }
        },
        created() {
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes);
                moduleBrindes.isRegistered = true;
            }
            this.$vs.loading();
            this.getConfig();
        },
        methods: {
            getConfig() {
                this.$store.dispatch('brindes/getCampanha', this.$route.params.id).then(response => {
                    this.campanha = {...response};
                    this.$vs.loading.close();
                });
            },
            getTipo(val) {
                switch (val) {
                    case 'hotmart':
                        return 'Hotmart';
                    case 'sck':
                        return 'SCK';
                    default:
                        return 'SRC'
                }
            },

            //Modal
            showAdicionarExcecao() {
                this.val.tipo = '';
                this.val.valor = '';
                this.modalexcecao = true;
            },
            clearValMultiple() {
                this.val.tipo = "";
                this.val.valor = "";
            },
            editarCondicao(obj) {
                this.val.tipo = {id: obj.tipo, label: this.getTipo(obj.tipo)}
                this.val.valor = obj.valor;
                this.val.id = obj.id;
                this.modalexcecao = true;
            },
            sendexcecao() {
                this.$vs.loading();
                this.val.tipo = this.val.tipo.id;
                this.$store.dispatch('brindes/storeCondicao', this.val).then(() => {
                    this.$vs.notify({
                        color: 'success',
                        title: '',
                        text: 'Salvo com sucesso!'
                    });
                    this.getConfig();
                }).catch(erro => {
                    this.$vs.notify({
                        color: 'danger',
                        title: 'Erro',
                        text: 'Erro ao salvar. Contate o suporte.'
                    });
                    console.log('erro', erro)
                });
            },
            deleteCondicao(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro?`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('brindes/deleteCondicao', id).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso!'
                            });
                            this.getConfig();
                        }).catch(erro => {
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Erro ao deletar. Contate o suporte.'
                            });
                            console.log('erro', erro)
                        });
                    }
                });
            }
        },
        computed: {
            validExcecao() {
                return (this.val.tipo !== "" && this.val.valor !== "")
            }
        }
    }
</script>

<style scoped>

</style>