<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>Detalhe do Histórico</h4>
            <div class="flex items-center cursor-pointer" @click.stop="isSidebarActiveLocal = false">
                <vs-icon icon-pack="material-icons" icon="clear" class="mr-2 icon-cancelar"/>
                Fechar
            </div>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6 w-10/12 mx-auto mt-4">
                <p class="destaque mb-4">Detalhes</p>
                <table class="table-auto table-detalhe mb-5">
                    <thead>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="px-4 py-2 w-3/12"><span class="font-semibold text-black">Para</span></td>
                        <td class="px-4 py-2 w-9/12"><span>{{data.contato.email}}</span></td>
                    </tr>
                    <tr>
                        <td class="px-4 py-2 w-3/12"><span class="font-semibold text-black">De</span></td>
                        <td class="px-4 py-2 w-9/12"><span>noreply@saveleads.com.br</span></td>
                    </tr>
                    <tr>
                        <td class="px-4 py-2 w-3/12"><span class="font-semibold text-black">Assunto</span></td>
                        <td class="px-4 py-2 w-9/12"><span>{{data.email.assunto}}</span></td>
                    </tr>
                    <tr v-if="!maisDetalhes">
                        <td colspan="2" class="px-4 py-2 w-full text-center cursor-pointer" @click="maisDetalhes = true">
                            <span class="font-medium text-primary">Mais detalhes...</span>
                        </td>
                    </tr>
                    <tr v-if="maisDetalhes">
                        <td class="px-4 py-2 w-3/12"><span class="font-semibold text-black">Identificador</span></td>
                        <td class="px-4 py-2 w-9/12"><span>{{data.uuid}}</span></td>
                    </tr>
                    </tbody>
                </table>
                <p class="destaque mb-4">Eventos</p>
                <vx-card class="mb-4">
                    <span>Data de envio</span>
                    <vs-collapse>
                        <vs-collapse-item>
                            <div slot="header" class="flex items-center justify-between">
                                <div class="flex">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success"></vs-icon>
                                    <p class="text-base">Solicitado</p>
                                </div>
                                <p class="mr-4 text-sm">{{data.created_at | formatDateTime}}</p>
                            </div>
                            Primeira solicitação de envio do e-mail realizada.
                        </vs-collapse-item>
                    </vs-collapse>
                </vx-card>
                <vx-card class="mb-4" v-if="data.eventos_entrega.length > 0">
                    <span>Eventos de entrega</span>
                    <vs-collapse>
                        <vs-collapse-item v-for="item in data.eventos_entrega">
                            <div slot="header" class="flex items-center justify-between">
                                <div class="flex">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success" v-if="item.resposta === 'success'"></vs-icon>
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-danger" v-else></vs-icon>
                                    <p class="text-base">{{item.evento}}</p>
                                </div>
                                <p class="mr-4 text-sm">{{item.created_at | formatDateTime}}</p>
                            </div>
                            {{descritivo(item)}}
                        </vs-collapse-item>
                    </vs-collapse>
                </vx-card>
                <vx-card class="mb-4" v-if="data.eventos_acao.length > 0">
                    <span>Eventos de ação</span>
                    <vs-collapse>
                        <vs-collapse-item v-for="item in data.eventos_acao">
                            <div slot="header" class="flex items-center justify-between">
                                <div class="flex">
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-success" v-if="item.resposta === 'success'"></vs-icon>
                                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                             class="icon-grande text-danger" v-else></vs-icon>
                                    <p class="text-base">{{item.evento}}</p>
                                </div>
                                <p class="mr-4 text-sm">{{item.created_at | formatDateTime}}</p>
                            </div>
                            {{descritivo(item)}}
                        </vs-collapse-item>
                    </vs-collapse>
                </vx-card>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import vSelect from 'vue-select'
    import draggable from 'vuedraggable'

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
        data() {
            return {
                origem: {
                    empresa_id: 1,
                    nome: '',
                },
                emails: [],
                maisDetalhes: false
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
            initValues() {
                console.log('chamou init');
                if (this.data.id) {
                    console.log(this.data)
                    return
                } else {
                    this.origem.id = null
                    this.origem.nome = ''
                }
            },
            descritivo(obj) {
                switch (obj.evento) {
                    case 'Processado':
                        return 'Primeira tentativa de envio do e-mail realizada.';
                    case 'Entregue':
                        return 'E-mail entregue com sucesso ao destinatário.';
                    case 'Clicou':
                        return 'O destinatário clicou em um link dentro da mensagem.'
                    case 'Desistiu':
                        return 'Você pode ver os seguintes motivos da queda: Cabeçalho SMTPAPI inválido, Conteúdo de spam (se o aplicativo Verificador de spam está ativado),' +
                            ' Endereço não inscrito, Endereço devolvido, Endereço de relatório de spam, Inválido, Lista de destinatários sobre a cota do pacote'
                    case 'Diferido':
                        return 'O servidor de recebimento rejeitou temporariamente a mensagem.'
                    case 'Bounce':
                        return 'O servidor de recebimento não pôde ou não aceitou mensagens para esse destinatário permanentemente.' +
                            ' Se um destinatário já cancelou sua inscrição em seus e-mails, a mensagem será descartada.' +
                            'Motivo: ' + obj.reason
                    case 'Bloqueado':
                        return 'O servidor de recebimento não pôde ou não aceitou a mensagem temporariamente. ' +
                            'Se o destinatário já cancelou sua inscrição em seus e-mails, a mensagem será descartada.' +
                            'Motivo: ' + obj.reason
                    case 'Aberto':
                        return 'O destinatário abriu a mensagem HTML.'
                    case 'Spam Reportado':
                        return 'Mensagem marcada pelo destinatário como spam.'
                    case 'Cancelou subscrição':
                        return 'O destinatário clicou no link \'Optar por não receber todos os emails\' (disponível após clicar no link de gerenciamento de assinaturas da mensagem).'
                    case 'Cancelou inscrição do grupo':
                        return 'O destinatário cancelou a inscrição de um grupo específico clicando no link diretamente ou atualizando suas preferências.'
                    case 'Se Reinscreveu no grupo':
                        return 'O destinatário se inscreveu novamente em um grupo específico, atualizando suas preferências.'
                    default:
                        return '' + obj.reason;
                }
            }
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect,
            draggable,
        },
        created() {
            this.initValues();
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                console.log('entrou aqui', this.data);
                //this.origem = JSON.parse(JSON.stringify(this.data));
                this.emails = JSON.parse(JSON.stringify(this.data))

            }
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

    .table-detalhe {
        width: 100%;
        box-shadow: none;
        border: 1px solid #f6e9e9;
        transition-duration: .1s !important;
        border-radius: 5px !important;
        border-collapse: collapse;
    }

    .table-detalhe td {
        border-bottom: 1px solid #f6e9e9;
    }
</style>
