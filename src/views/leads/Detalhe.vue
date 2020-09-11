<template>
    <div>
        <div class="vx-row">
            <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-leads tabs-shadow-none tabs-detalhe"
                     id="profile-tabs"
                     :key="isSmallerScreen">

                <!-- GENERAL -->
                <vs-tab label="Dados do contato">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-row mb-4">
                            <div class="vx-col w-1/2">
                                <p class="font-regular mb-2">Nome</p>
                                <vs-input class="w-full" v-model="lead.nome" size="large" v-validate="'required'"/>
                                <span class="text-danger text-sm"
                                      v-show="errors.has('nome')">Preenchimento obrigatório</span>
                            </div>
                            <div class="vx-col w-1/2">
                                <p class="font-regular mb-2">CPF</p>
                                <vs-input class="w-full" v-model="lead.cpf" size="large" v-mask="'###.###.###-##'"/>
                            </div>
                        </div>
                        <div class="vx-row mb-4">
                            <div class="vx-col w-full lg:w-6/12">
                                <p class="font-regular mb-2">Telefone</p>
                                <div class="vx-row">
                                    <div class="vx-col w-4/12">
                                        <vs-input class="w-full" v-model="lead.ddd" size="large" @keypress="isNumber"
                                                  v-mask="'(##)'"/>
                                    </div>
                                    <div class="vx-col w-8/12">
                                        <vs-input class="w-full" v-model="lead.telefone" size="large"
                                                  v-mask="'#####-####'" @keypress="isNumber"/>
                                    </div>
                                </div>
                            </div>
                            <div class="vx-col w-full lg:w-6/12">
                                <p class="font-regular mb-2">E-mail</p>
                                <vs-input class="w-full" v-model="lead.email" size="large" v-validate="'required'"/>
                                <span class="text-danger text-sm"
                                      v-show="errors.has('email')">Preenchimento obrigatório</span>
                            </div>
                        </div>
                        <div class="vx-row relative">
                            <div class="vx-col w-full">
                                <vs-button class="mr-3" color="primary" type="filled" @click="salvar"
                                           :disabled="isValid">
                                    Salvar
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Transações (' + lead.transacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.transacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Transação</vs-th>
                                    <vs-th>Lead</vs-th>
                                    <vs-th>Data e Hora</vs-th>
                                    <vs-th>Comissão do Hotmart</vs-th>
                                    <vs-th>Produto</vs-th>
                                    <vs-th>Status</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td :data="tr.transaction">
                                            {{ tr.transaction }}
                                        </vs-td>
                                        <vs-td :data="lead.nome">
                                            <span class="destaque">{{ lead.nome }}</span>
                                        </vs-td>
                                        <vs-td :data="tr.confirmation_purchase_date">
                                            <span class="destaque">{{ tr.confirmation_purchase_date | formatDate}}</span>
                                        </vs-td>
                                        <vs-td>
                                            <span class="preco">R$ {{formatPrice(tr.full_price)}}</span>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip :color="tr.produto.cor" class="product-order-status">
                                                {{ tr.produto.nome }}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td class="flex justify-center">
                                            <vx-tooltip :text="status[0]" position="top" v-for="(status, index) in hotmartStatus" :key="index" v-if="index === tr.status">
                                                <vs-chip :color="status[1]" class="product-order-status rounded-full"></vs-chip>
                                            </vx-tooltip>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Solicicatações (' + lead.solicitacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.solicitacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Email</vs-th>
                                    <vs-th>Destinatário</vs-th>
                                    <vs-th>Brinde</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td :data="tr.transaction">
                                            {{ tr.nome_destinatario }}
                                        </vs-td>
                                        <vs-td :data="lead.nome">
                                            {{ tr.email_destinatario }}
                                        </vs-td>
                                        <vs-td :data="tr.confirmation_purchase_date">
                                            {{ tr.brinde.nome }}
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Automações (' + lead.automacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.automacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Inserção</vs-th>
                                    <vs-th>Brinde</vs-th>
                                    <vs-th>E-mail</vs-th>
                                    <vs-th>Token</vs-th>
                                    <vs-th>Ordem de envio</vs-th>
                                    <vs-th>Status</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td>
                                            <p class="font-bold">{{getResponsavel(tr)}}</p>
                                        </vs-td>
                                        <vs-td>
                                            <p class="font-bold">{{tr.brinde.nome}}</p>
                                        </vs-td>
                                        <vs-td>
                                            <vs-icon icon-pack="material-icons" icon="watch_later" color="gray" v-if="tr.eventos.length == 0" class="text-2xl"/>
                                            <vs-icon icon-pack="material-icons" icon="cancel" color="danger" v-if="getEventoRed(tr)" class="text-2xl"/>
                                            <vs-icon icon-pack="material-icons" icon="check" color="success" v-if="getEventoGreen(tr)" class="text-2xl"/>
                                        </vs-td>
                                        <vs-td>
                                            {{tr.uuid}}
                                        </vs-td>
                                        <vs-td>
                                            <p class="font-bold flex items-center" v-bind:class="getOrdemColor(tr)">
                                                {{getOrdemEnvio(tr)}}
                                                <i class="material-icons ml-3" v-bind:class="getOrdemColor(tr)">fiber_manual_record</i>
                                            </p>
                                        </vs-td>
                                        <vs-td class="flex">
                                            <img src="@/assets/images/util/delivery-icon.svg" width="40px" class="mr-2" v-if="tr.rastreio != null">
                                            <img src="@/assets/images/util/expedicao-icon.svg" width="25px" v-if="tr.expedicao && tr.expedicao != null">
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Historico (' + lead.acoesrecebidas.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico sofrido</p>
                            <ul class="vx-timeline">
                                <li v-for="(historico, index) in lead.acoesrecebidas" :key="index">
                                    <div class="timeline-icon p-0" v-if="historico.causer">
                      <span class="feather-icon select-none relative">
                        <img :src="get_img_api(historico.causer.avatar)" width="40" height="40" class="rounded-full" v-if="IsUser(historico.causer_type)">
                        <img src="@/assets/images/util/boleto.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaBoleto'">
                        <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaWhatsapp'">
                        <img src="@/assets/images/util/agendamento.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaAgendamento'">
                        <img src="@/assets/images/util/cancelado.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\Models\CampanhaCancelado'">
                        <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full" v-if="historico.causer_type == 'App\\Models\\Whatsapplist'">
                      </span>
                                    </div>
                                    <div class="timeline-info">
                                        <div class="" v-if="historico.causer">
                                            <p class="font-semibold" v-if="IsUser(historico.causer_type)">{{historico.causer.name}}</p>
                                            <p class="font-semibold" v-else>{{historico.causer.nome}}</p>
                                        </div>
                                        <span class="activity-desc">{{historico.description}}</span>
                                        <div class="vx-row my-3">
                                            <div class="vx-col w-full">
                                                <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'whatsapp'" color="#8ED839" type="filled"
                                                           @click="$emit('whatsapp')">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fab fa-whatsapp text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                                                </vs-button>
                                                <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.tipo == 'email'" color="#F23257" type="filled"
                                                           @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-envelope-open text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                                                </vs-button>
                                                <vs-button class="rounded-full mx-3 px-3 py-2" v-if="historico.properties && historico.properties.identificacao" color="#F23257" type="filled"
                                                           @click="exibirLigacao = true; chamadaResgatada = historico.properties; consultaChamada(historico.properties.id)">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-phone text-2xl mr-3 text-white"></i>
                                Chamada
                                </span>
                                                </vs-button>
                                            </div>
                                        </div>
                                    </div>
                                    <small class="text-grey activity-e-time">{{historico.created_at | formatDateHumanize}}</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </div>
</template>

<script>
    import moduleLeads from '@/store/leads/moduleLeads.js'
    import moduleTickets from "../../store/tickets/moduleTickets";

    export default {
        name: "Detalhe",
        data() {
            return {
                lead: {
                    transacaos: [],
                    solicitacaos: [],
                    automacaos: [],
                    acoesrecebidas: [],
                },
                hotmartStatus: {
                    started: ['Iniciado', '#3498db'],
                    billet_printed: ['Boleto Impresso', '#848a91'],
                    expired: ['Expirado', '#848a91'],
                    pending_analysis: ['Pendente', '#848a91'],
                    delayed: ['Atrasado', '#e74c3c'],
                    canceled: ['Cancelado', '#e74c3c'],
                    approved: ['Aprovado', '#2ecc71'],
                    completed: ['Concluído', '#2ecc71'],
                    chargeback: ['Chargeback', '#e74c3c'],
                    blocked: ['Bloqueado', '#848a91'],
                    refunded: ['Devolvido', '#e74c3c'],
                    admin_free: ['Cadastrado', '#848a91'],
                    dispute: ['Disputa', '#e74c3c']
                },
            }
        },
        created() {
            if (!moduleLeads.isRegistered) {
                this.$store.registerModule('leads', moduleLeads)
                moduleLeads.isRegistered = true
            }
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }

            if (this.$route.name === 'leads-detalhe') {
                this.getId(this.$route.params.id);
            }
        },
        methods: {

            IsUser(type) {
                return (type == `App\\Models\\User`) ? true : false;
            },
            getId(id) {
                this.$vs.loading()
                this.$store.dispatch('leads/getId', id).then(data => {
                    console.log(data)
                    this.lead = data;
                    this.$vs.loading.close();
                });
            },
            getResponsavel(obj) {
                switch (obj.responsavel_type) {
                    case 'App\\Models\\User':
                        return obj.responsavel.name;
                    default:
                        return obj.responsavel.nome;
                }
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
                console.log('obj', obj)
                console.log(obj.eventos[obj.eventos.length - 1])
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
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        //this.usuario.role_id = this.funcaoSelected.id;
                        const formData = new FormData();
                        formData.append('nome', this.lead.nome);
                        formData.append('email', this.lead.email);
                        formData.append('cpf', this.lead.cpf);
                        formData.append('telefone', this.lead.telefone);
                        formData.append('ddd', this.lead.ddd);
                        formData.append('empresa_id', this.lead.empresa_id);
                        formData.append('_method', 'PUT');
                        this.$store.dispatch('leads/update', {dados: formData, id: this.lead.id}).then(response => {
                            console.log('response', response);
                            this.$vs.loading.close();
                            this.$vs.notify({
                                title: '',
                                text: "Atualizado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            //this.$router.push({name: 'leads'});
                        }).catch(erro => {
                            this.$vs.loading.close();
                            this.$vs.notify({
                                title: '',
                                text: erro.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        })
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'verifique os erros específicos',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }
                })
            },
            consultaChamada(id) {
                this.$vs.loading({
                    container: `#loading-chamada`,
                    type: 'default',
                });
                this.$store.dispatch('tickets/consultaChamada', {identificacao: id}).then(response => {
                    console.log('response consultaChamada', response);

                    this.detalheChamada = response
                });
            },
            tipoChamada(val) {
                switch (val) {
                    case 'movel':
                        return 'Celular';
                    case 'ramal':
                        return 'Interno';
                    default:
                        return val;
                }
            }
        },
        computed: {
            isSmallerScreen() {
                return this.$store.state.windowWidth < 768
            },
            isValid() {
                return this.errors.any();
            },
        }
    }
</script>

<style scoped>
    .main-info-lead {
        font-size: 1.5rem;
        font-weight: 700;
    }

    .secundary-info-lead {
        color: #9B9B9B;
        font-size: 1.2rem;
        font-weight: 600;
    }
</style>
