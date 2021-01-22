<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <nenhum-registro></nenhum-registro>
        </div>
        <div class="com-item" v-else>
            <vs-table :data="items" class="table-items">
                <template slot="thead">
                    <vs-th></vs-th>
                    <vs-th>Cliente</vs-th>
                    <vs-th>Inserção</vs-th>
                    <vs-th>Brinde</vs-th>
                    <vs-th>E-mail</vs-th>
                    <vs-th>Token</vs-th>
                    <vs-th>Ordem de envio</vs-th>
                    <vs-th>Status</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr v-for="tr in data">
                        <vs-td class="flex justify-center items-center">
                            <vs-dropdown vs-trigger-click v-if="$acl.check('brinde_automacao_editar') || $acl.check('brinde_automacao_deletar')">
                                <vs-button radius color="#EDEDED" type="filled"
                                           class="btn-more-icon relative botao-menu"
                                           icon-pack="material-icons" icon="more_horiz"
                                ></vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list">
                                    <vs-dropdown-item @click="editarEndereco(tr)" v-if="$acl.check('brinde_automacao_editar') && !tr.expedicao">
                                        <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                        Editar endereço
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="arquivar(tr)" v-if="$acl.check('brinde_automacao_deletar')">
                                        <vs-icon icon-pack="material-icons" icon="work"></vs-icon>
                                        Arquivar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="restaurarAlert(tr.id)" v-show="tr.arquivado == 1" v-if="$acl.check('brinde_automacao_deletar')">
                                        <vs-icon icon-pack="material-icons" icon="star"></vs-icon>
                                        Restaurar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="getLinkRastreio(tr)">
                                        <vs-icon icon-pack="material-icons" icon="star"></vs-icon>
                                        Copiar link de entrega
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="getEventoRed(tr)" @click="reenviar(tr.uuid)">
                                        <vs-icon icon-pack="material-icons" icon="mail"></vs-icon>
                                        Reenviar por e-mail
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.endereco == null" @click="$emit('reenviarWhats', tr)">
                                        <vs-icon icon-pack="material-icons" icon="forward"></vs-icon>
                                        Enviar por whatsapp
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ tr.lead.nome }}</p>
                            <p class="">{{ tr.lead.email }}</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ getResponsavel(tr) }}</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ tr.brinde.nome }}</p>
                        </vs-td>
                        <vs-td class="flex justify-center">
                            <vx-tooltip text="Enviando" position="top">
                                <vs-icon icon-pack="material-icons" icon="watch_later" color="gray" v-if="tr.eventos.length == 0" class="text-2xl"/>
                            </vx-tooltip>
                            <vx-tooltip text="Não enviado" position="top">
                                <vs-icon icon-pack="material-icons" icon="cancel" color="danger" v-if="getEventoRed(tr)" class="text-2xl"/>
                            </vx-tooltip>
                            <vx-tooltip text="Enviado" position="top">
                                <vs-icon icon-pack="material-icons" icon="check" color="success" v-if="getEventoGreen(tr)" class="text-2xl"/>
                            </vx-tooltip>
                        </vs-td>
                        <vs-td>
                            {{ tr.uuid }}
                        </vs-td>
                        <vs-td>
                            <p class="font-bold flex items-center" v-bind:class="getOrdemColor(tr)">
                                {{ getOrdemEnvio(tr) }}
                                <i class="material-icons ml-3" v-bind:class="getOrdemColor(tr)">fiber_manual_record</i>
                            </p>
                        </vs-td>
                        <vs-td class="flex">
                            <vx-tooltip position="top" :text="tr.rastreio">
                                <img src="@/assets/images/util/delivery-icon.svg" width="40px" class="mr-2 cursor-pointer" @click="copyText(tr.rastreio)" v-if="tr.rastreio != null">
                            </vx-tooltip>
                            <img src="@/assets/images/util/expedicao-icon.svg" width="25px" v-if="tr.expedicao && tr.expedicao != null">
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</template>

<script>
    import moduleAutomacao from "../../store/automacao/moduleAutomacao";
    import NenhumRegistro from "../components/NenhumRegistro";
    import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";


    export default {
        components: {NenhumRegistro},
        data() {
            return {
                idSelected: null,
            }
        },
        name: "Listagem",
        props: ['items', 'tipo'],
        methods: {
            deleteAlert(id) {
                this.idSelected = id;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirme`,
                    text: 'Tem certeza ao arquivar essa automação',
                    accept: this.deleteItem,
                    acceptText: "Deletar",
                    cancelText: "Cancelar"

                })
            },
            restaurarAlert(id) {
                this.idSelected = id;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirme`,
                    text: 'Tem certeza ao Restaurar essa automação',
                    accept: this.restaurarItem,
                    acceptText: "Restaurar",
                    cancelText: "Cancelar"

                })
            },
            deleteItem() {
                this.$store.dispatch('automacao/deleteItem', this.idSelected).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: "Automação aquivada com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    })
                    this.$emit('getItems', this.dados.tipo)

                }).catch(error => {

                })

            },
            arquivar(obj) {
                this.$vs.dialog({
                    color: 'primary',
                    type: 'confirm',
                    title: `Arquivar Automação`,
                    text: 'Ao arquivar a automação ela sairá da listagem atual e irá para listagem de arquivas.',
                    acceptText: 'Sim, arquivar!',
                    cancelText: 'Cancelar',
                    accept: () => {
                        this.$store.dispatch('expedicaos/arquivar', obj.id).then(() => {
                            this.$emit('getItems')
                            this.$vs.notify({
                                color: 'success',
                                text: 'Arquivado realizado com sucesso'
                            });
                        }).catch(erro => {
                            this.$vs.notify({
                                color: 'danger',
                                text: 'Algo deu errado ao arquivar a automação. Contate o suporte'
                            });
                        });
                    }
                })
            },
            restaurarItem() {
                this.$store.dispatch('automacao/restaurarItem', this.idSelected).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: "Automação restaurada com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    })
                    this.$emit('getItems')

                }).catch(error => {

                })

            },
            getResponsavel(obj) {
                switch (obj.responsavel_type) {
                    case 'App\\Models\\User':
                        return obj.responsavel.name;
                    default:
                        return obj.responsavel.nome;
                }
            },
            getLinkRastreio(obj) {
                let url = 'https://weentrega.saveleads.com.br/preencher/' + obj.uuid + '/' + obj.email_destinatario;
                const thisIns = this;
                this.$copyText(url).then(function () {
                        thisIns.$vs.notify({
                            title: 'Success',
                            text: 'URL copiada para sua área de transferência',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        })
                    },
                    function () {
                        thisIns.$vs.notify({
                            title: 'Failed',
                            text: 'Erro ao copiar link',
                            color: 'danger',
                            iconPack: 'feather',
                            position: 'top-center',
                            icon: 'icon-alert-circle'
                        })
                    })
            },
            getOrdemEnvio(obj) {
                if (obj.endereco == null)
                    return 'Pendente'
                else
                    return 'Preenchida'
            },
            getOrdemColor(obj) {
                if (obj.endereco == null)
                    return 'text-warning'
                else
                    return 'text-primary'
            },
            getEventoRed(obj) {
                if (obj.eventos.length > 0)
                    return obj.eventos[obj.eventos.length - 1].resposta == 'error';
                else
                    return false;
            },
            getEventoGreen(obj) {
                if (obj.eventos.length > 0)
                    return obj.eventos[obj.eventos.length - 1].resposta == 'success';
                else
                    return false;
            },
            copyText(val) {
                const thisIns = this;
                this.$copyText(val).then(function () {
                    thisIns.$vs.notify({
                        title: 'Success',
                        text: 'Código de rastreio copiado para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
                }, function () {
                    thisIns.$vs.notify({
                        title: 'Failed',
                        text: 'Erro ao copiar código',
                        color: 'danger',
                        iconPack: 'feather',
                        position: 'top-center',
                        icon: 'icon-alert-circle'
                    })
                })
            },
            reenviar(token) {
                let self = this
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirme`,
                    text: 'Certeza de que deseja reenviar este e-mail?',
                    accept() {
                        self.$store.dispatch('automacao/enviarEmail', {uuid: token, evento: 1}).then(() => {
                            this.$vs.notify({
                                text: 'Enviado com sucesso.',
                                color: 'success'
                            });
                        }).catch(erro => {
                            this.$vs.notify({
                                text: erro.message,
                                color: 'danger',
                                title: 'Ops! Algo deu errado. Contate o suporte.',
                                time: 10000,
                            })
                        })
                    },
                    acceptText: "Enviar",
                    cancelText: "Cancelar"

                })
            },
            //Editar endereço da automação
            editarEndereco(obj) {
                this.$emit('editarEnd', obj);
            },
        },
        created() {
            if (!moduleExpedicoesBrindes.isRegistered) {
                this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
                moduleExpedicoesBrindes.isRegistered = true;
            }
        }

    }
</script>

<style scoped>

</style>
