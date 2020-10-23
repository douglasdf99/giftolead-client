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
            <h4>Detalhe da Pré Comissão</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row flex items-center">
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="font-bold text-dark text-xl">{{data.ticket.lead.nome}}</p>
                        <p class="font-bold text-primary text-xl">{{data.ticket.lead.ddd + data.ticket.lead.telefone | VMask('(##) #####-####')}}</p>
                        <p class="font-bold text-gray text-md">{{data.ticket.lead.email}}</p>
                        <p class="font-bold text-gray text-md">CPF: {{data.ticket.lead.cpf || '' | VMask('###.###.###-##')}}</p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 text-right">
                        <p class="font-bold text-2xl text-dark">Ticket: {{data.ticket.id}}</p>
                        <p>Data: <b>{{data.created_at | formatDateTime}}</b></p>
                        <vs-chip class="float-right" :color="data.tipo === 'pendente' ? 'warning' : 'danger'">Status: {{data.tipo}}</vs-chip>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="vx-row my-5">
                    <div class="vx-col w-full relative">
                        <form @submit="pesquisarTrans">
                            <vs-input autocomplete="off" class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg" v-model="dados.search" id="search_input" size="large"
                                      placeholder="Buscar transações"/>
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-10">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
                <div v-if="pesquisado">
                    <div v-if="resultado.length === 0">
                        <div class="vx-row">
                            <div class="vx-col w-full text-center">
                                <p class="font-bold">Nenhum resultado encontrado</p>
                                <p class="mt-5">Caso deseje criar uma transação manual preencha os dados abaixo</p>
                            </div>
                        </div>
                        <div class="vx-row mt-5 flex items-end">
                            <div class="vx-col w-full lg:w-1/2">
                                <vs-input autocomplete v-validate="'required|email'" class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                          v-model="transacao.email" id="search_input_trans" size="large"
                                          placeholder="E-mail" name="email"/>
                              <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                            </div>
                            <div class="vx-col w-full lg:w-1/2">
                                <label class="vs-input--label">Tipo de Transação</label>
                                <v-select v-model="transacao.payment_type" v-validate="'required'" :class="'select-large-base'" :clearable="true" class="bg-white"
                                          :options="opcoes" name="tipo"/>
                              <span class="text-danger text-sm" v-show="errors.has('tipo')">{{ errors.first('tipo') }}</span>

                            </div>
                            <div class="vx-col w-full mt-5 text-center">
                                <vs-button class="font-bold text-white" color="primary" type="filled" @click="storeTransacao">Criar transação</vs-button>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row mt-5" v-else>
                        <div class="vx-col w-full">
                            <vs-table :data="resultado" class="table-items" multiple v-model="selecteds" @selected="handleSelected">

                                <template slot="thead">
                                    <vs-th>Transação</vs-th>
                                    <vs-th>Lead</vs-th>
                                    <vs-th>Produto</vs-th>
                                    <vs-th>Data e Hora</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr" v-bind:class="{'row-table-disabled': true}">
                                        <vs-td :data="tr.transaction">
                                            {{ tr.transaction }}
                                        </vs-td>
                                        <vs-td :data="tr.lead.nome" class="cursor-pointer">
                                            {{ tr.lead.nome }}
                                        </vs-td>
                                        <vs-td v-if="tr.produto">
                                            <vs-chip :color="tr.produto.cor || ''" class="product-order-status">
                                                {{ tr.produto.nome}}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td :data="tr.updated_at">
                                            <span class="destaque">{{ tr.updated_at | formatDateTime}}</span>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </div>
                <p v-if="data.descricao">{{data.descricao}}</p>
                <div class="vx-row my-5 px-3" v-if="data.anexos.length > 0">
                    <p class="font-bold">Imagens anexadas</p>
                    <galeria :imagens="data.anexos" :remove="false"></galeria>
                </div>
            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer" v-if="$acl.check('comissao_pendente_aprovar')">
            <vs-button class="mr-6 font-bold text-white" color="danger" v-if="$acl.check('comissao_pendente_aprovar')" @click="$emit('action', {method: 'reprovar', ids: idsTransacoes, id: data.id})">Reprovar</vs-button>
            <vs-button class="mr-6 font-bold text-white" color="primary" v-if="$acl.check('comissao_pendente_aprovar')"
                       @click="$emit('action', {method: 'aprovar', ids: idsTransacoes, id: data.id, nome: data.ticket.lead.nome})" :disabled="selecteds.length == 0">
                Aprovar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import vSelect from 'vue-select'
    import galeria from '../components/Galeria';

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
        components: {
            'v-select': vSelect,
            VuePerfectScrollbar, galeria
        },
        data() {
            return {
                buscaTransacao: '',
                transacao: {
                    email: '',
                    tipo: ''
                },
                dados: {
                    search: '',
                },
                opcoes: [
                    {id: 'transferencia', label: 'Transferência'},
                    {id: 'deposito', label: 'Depósito'},
                    {id: 'outros', label: 'Outros'},
                ],
                resultado: [],
                pesquisado: false,
                selecteds: [],
            }
        },
        created() {
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive
                },
                set(val) {
                    if (!val) {
                        this.transacao.email = '';
                        this.transacao.tipo=  '';
                      this.resultado = [],
                      this.dados.search = '';
                      this.pesquisado = false;
                      this.$emit('closeSidebar')
                        // this.$validator.reset()
                        // this.initValues()
                    }
                }
            },
            idsTransacoes() {
                let ids = this.selecteds.map(obj => {
                    return obj.lead_produto_id;
                });

                return ids;
            }
        },
        methods: {
            pesquisarTrans(e) {
                this.pesquisado = true;
                if(e)
                    e.preventDefault();
                console.log('pesquiisa');
                this.$vs.loading();
                this.$store.dispatch('comissoes/searchTrans', {produto_id: this.data.lead_produto.produto_id, comissao: true, ...this.dados}).then(response => {
                    console.log('response', response);
                    this.resultado = response;
                    console.log('result', this.resultado);
                    this.$vs.loading.close();
                });
            },
            handleSelected(e){
                console.log(e)
            },
            storeTransacao() {
              this.$validator.validateAll().then(result => {
                if (result) {
                  this.$vs.loading();
                  this.$store.dispatch('comissoes/storeTrans', {produto_id: this.data.lead_produto.produto_id, email: this.transacao.email, payment_type: this.transacao.payment_type.id}).then(() => {
                    this.$vs.notify({
                      color: 'success',
                      title: '',
                      text: 'Transação salva com sucesso.'
                    });
                    this.dados.search = this.transacao.email;
                    this.pesquisarTrans();
                    this.$vs.loading.close();
                  }).catch(erro => {
                    console.log(erro)
                  });
                }
              });
            }
        },
        watch: {
        }
    }
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
          z-index: 52000;
        }

        ::v-deep .vs-sidebar {
          z-index: 52000;
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
