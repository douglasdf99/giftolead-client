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
            <h4>Detalhe da transação {{data.transaction}}</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">

            <div class="p-10">
                <div class="vx-row flex items-center">

                </div>

                <div class="vx-row my-5">

                    <div class="vx-col w-full relative">
                      <div class="vx-row flex items-center">
                        <div class="vx-col w-full lg:w-1/2">
                          <p class="font-bold text-dark text-xl">{{data.lead.nome}}</p>
                          <p class="font-bold text-primary text-xl">{{data.lead.ddd + data.lead.telefone | VMask('(##) #####-####')}}</p>
                          <p class="font-bold text-gray text-md">{{data.lead.email}}</p>
                          <p class="font-bold text-gray text-md">CPF: {{data.lead.cpf || '' | VMask('###.###.###-##')}}</p>
                        </div>

                      </div>
                      <vs-divider></vs-divider>
                      <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                          <p class="black font-bold text-x1 ">Informações da transação</p>
                          <div class="vx-col  ">
                            <div class="w-full" >

                              <div class="conquista-clicavel w-full cursor-pointer pt-3"
                                   >
                                <!--<img :src="get_img_api(cliente.company_plano.plano.imagem)" class="img-conquista my-4" alt="" width="150">-->
                                <div class="w-full text-left">
                                </div>
                                <p class="nome-conq mb-4">
                                </p>
                                <ul class="text-sm text-gray text-left w-full mb-3"
                                    >
                                  <li class="flex">
                                    <div class="w-1/2 text-lg"></div>
                                    <div class="w-1/2 text-center text-lg">
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Status</div>
                                    <div class="w-1/2 text-right text-lg">
                                      <vs-chip v-for="(status, index) in hotmartStatus" v-if="index === data.status"
                                               :color="status[1]" class="product-order-status">
                                        {{ status[0] }}
                                      </vs-chip>
                                    </div>
                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Codigo da transação</div>
                                    <div class="w-1/2  text-left text-lg">{{
                                      data.transaction
                                      }}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Nome do produto</div>
                                    <div class="w-1/2 text-left text-lg">
                                      {{data.produto.nome}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Valor da compra</div>
                                    <div class="w-1/2 text-left text-lg">
                                      {{data.full_price	}} {{numParcecelas}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Oferta</div>
                                    <div class="w-1/2 text-left  text-lg">
                                      {{data.off}}
                                    </div>

                                  </li>
                                  <li class="flex" v-if="data.coupon_code">
                                    <div class="w-1/2 text-lg">Cupom</div>
                                    <div class="w-1/2  text-lg text-left"
                                         >
                                      {{data.coupon_code}}
                                      <i class="material-icons text-lg"></i>
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Data da compra</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.purchase_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Data da Aprovação</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.confirmation_purchase_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Garantia até</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.warranty_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Origem</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.sck}}
                                    </div>

                                  </li>
                                </ul>

                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <vs-divider></vs-divider>
                      <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                          <p class="black font-bold text-x1 ">Detalhes</p>
                          <div class="vx-col  ">
                            <div class="w-full" >

                              <div class="conquista-clicavel w-full cursor-pointer pt-3"
                              >
                                <!--<img :src="get_img_api(cliente.company_plano.plano.imagem)" class="img-conquista my-4" alt="" width="150">-->
                                <div class="w-full text-left">
                                </div>
                                <p class="nome-conq mb-4">
                                </p>
                                <ul class="text-sm text-gray text-left w-full mb-3"
                                >
                                  <li class="flex">
                                    <div class="w-1/2 text-lg"></div>
                                    <div class="w-1/2 text-center text-lg">
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Valor pago pelo comprador</div>
                                    <div class="w-1/2 text-left text-lg">
                                      {{data.full_price	}}

                                    </div>
                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Valor pago pelo comprador sem tarifas e impostos</div>
                                    <div class="w-1/2  text-left text-lg">{{
                                        data.transaction
                                      }}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Nome do produto</div>
                                    <div class="w-1/2 text-left text-lg">
                                      {{data.produto.nome}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Valor da compra</div>
                                    <div class="w-1/2 text-left text-lg">
                                      {{data.full_price	}} {{numParcecelas}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Oferta</div>
                                    <div class="w-1/2 text-left  text-lg">
                                      {{data.off}}
                                    </div>

                                  </li>
                                  <li class="flex" v-if="data.coupon_code">
                                    <div class="w-1/2 text-lg">Cupom</div>
                                    <div class="w-1/2  text-lg text-left"
                                    >
                                      {{data.coupon_code}}
                                      <i class="material-icons text-lg"></i>
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Data da compra</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.purchase_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Data da Aprovação</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.confirmation_purchase_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Garantia até</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.warranty_date| formatDateTime}}
                                    </div>

                                  </li>
                                  <li class="flex">
                                    <div class="w-1/2 text-lg">Origem</div>
                                    <div class="w-1/2  text-lg text-left">
                                      {{data.sck}}
                                    </div>

                                  </li>
                                </ul>

                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                    {{data}}

                    </div>
                </div>

            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer" v-if="$acl.check('comissao_pendente_aprovar')">
            <vs-button class="mr-6 font-bold text-white" color="danger" v-if="$acl.check('comissao_pendente_aprovar')" @click="$emit('action', {method: 'reprovar', ids: idsTransacoes, id: data.id})">Reprovar</vs-button>
            <vs-button class="mr-6 font-bold text-white" color="primary" v-if="$acl.check('comissao_pendente_aprovar')"
                      >
                Aprovar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import vSelect from 'vue-select'

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
            VuePerfectScrollbar
        },

        data() {
            return {
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
            },
          numParcecelas(){
            if (this.data.installments_number == 1){
              return 'A vista'
            }else{
              return 'Em '+this.data.installments_number+' vezes'
            }
          },
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
