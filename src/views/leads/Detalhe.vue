<template>
    <div>
        <div class="vx-row">
            <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-leads tabs-shadow-none tabs-detalhe"
                     id="profile-tabs"
                     :key="isSmallerScreen">

                <!-- GENERAL -->
                <vs-tab label="dados do contato">
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
                <vs-tab :label="'transações (' + lead.transacaos.length + ')'">
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
                                            <vx-tooltip :text="status[0]" position="top" v-for="(status, index) in hotmartStatus" v-if="index === tr.status">
                                                <vs-chip :color="status[1]" class="product-order-status rounded-full"></vs-chip>
                                            </vx-tooltip>
                                        </vs-td>
                                        <!--<vs-td>
                                            <vs-chip :color="status[1]" v-for="(status, index) in hotmartStatus" v-if="index === tr.status"
                                             class="product-order-status" >
                                                {{ status[0] }}
                                            </vs-chip>
                                        </vs-td>-->
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </div>
</template>

<script>
    import moduleLeads from '@/store/leads/moduleLeads.js'

    export default {
        name: "Detalhe",
        data() {
            return {
                lead: {},
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

            if (this.$route.name === 'leads-detalhe') {
                this.getId(this.$route.params.id);
            }
        },
        methods: {
            getId(id) {
                this.$vs.loading()
                this.$store.dispatch('leads/getId', id).then(data => {
                    console.log(data)
                    this.lead = data;
                    this.$vs.loading.close();
                });
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