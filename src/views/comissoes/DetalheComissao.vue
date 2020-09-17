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
      <h4>Valores a comissionar</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
      <div class="p-10">
        <div class="vx-row mb-5">
          <div class="vx-col w-1/2">
            <div class="flex items-center">
              <img :src="get_img_api(data.user.avatar)" width="50px" class="rounded-full mx-5" style="margin-left: -8%"/>
              <p class="font-bold text-dark text-xl">{{data.user.name}}</p>
            </div>
          </div>
          <div class="vx-col w-1/2">
            <div class="flex items-center">
            <h3 class="font-bold ">Valor Total: R$ {{somaComissao}}</h3>
            </div>
          </div>
        </div>
        <div class="vx-row my-5 mt-10">
          <div class="vx-col w-full">
            <vs-table :data="data.comissaos" class="table-items">

              <template slot="thead">
                <vs-th>Item</vs-th>
                <vs-th>Origem</vs-th>
                <vs-th>Ticket médio</vs-th>
                <vs-th>Comissão</vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr" v-bind:class="{'row-table-disabled': true}">
                  <vs-td>
                    <div class="font-bold" v-if="tr.responsavel.lead_produto">
                      {{tr.responsavel.lead_produto.lead.nome}}
                    </div>
                    Motivo: {{ tr.natureza }}<br/>
                    Produto: {{ tr.produto.nome }}
                  </vs-td>
                  <vs-td>
                    <div class="" v-if="tr.origem">
                      <vx-tooltip delay=".5s" :text="tr.origem.nome">
                        <img src="@/assets/images/util/checkout.svg" width="40" class="ml-4 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaCarrinho'">
                      </vx-tooltip>
                      <vx-tooltip delay=".5s" :text="tr.origem.nome">
                        <img src="@/assets/images/util/boleto.svg" width="40" class="ml-4 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaBoleto'">
                      </vx-tooltip>
                      <vx-tooltip delay=".5s" :text="tr.origem.nome">
                        <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-4 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaWhatsapp'">
                      </vx-tooltip>
                      <vx-tooltip delay=".5s" :text="tr.origem.nome">
                        <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-4 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaAgendamento'">
                      </vx-tooltip>
                      <vx-tooltip delay=".5s" :text="tr.origem.nome">
                        <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-4 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaCancelado'">
                      </vx-tooltip>
                      <vx-tooltip delay=".5s" :text="tr.origem.name">
                        <img :src="get_img_api(tr.origem.avatar)" width="40" class="ml-4 rounded-full" v-if="tr.origem.avatar">
                      </vx-tooltip>
                    </div>
                  </vs-td>
                  <vs-td>
                    <div class="" v-if="tr.comissoes_conquistas.length > 0">
                      R$ {{ formatPrice(somaConquistas(tr.comissoes_conquistas)) }}
                    </div>
                  </vs-td>
                  <vs-td class="font-bold">
                    R$ {{ formatPrice(tr.valor) }}
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
    <!--<div class="flex flex-wrap items-center p-6" slot="footer">
        <vs-button class="mr-6" color="primary">
            Imprimir Ordem
        </vs-button>
    </div>-->
  </vs-sidebar>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

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
      return {}
    },
    created() {
      console.log('dados', this.data);
      console.log('listagem', this.listaComissao);
    },
    computed: {
      isSidebarActiveLocal: {
        get() {
          return this.isSidebarActive
        },
        set(val) {
          if (!val) {
            this.$emit('closeSidebar')

          }
        }
      },
      somaComissao() {
        let soma = 0.0
        this.data.comissaos.forEach(item => {
          soma += parseFloat(item.valor);
        });
        return this.formatPrice(soma);
      },

    },
    methods: {
      getResponsavel(val) {
        switch (val) {
          case 'App\\Models\\PreComissao':
            return 'Pré Comissão'
          default:
            return val
        }
      },
      somaConquistas(val){
        let valor = 0;
        val.forEach((item)=>{
          valor += parseFloat(item.valor);
        });
       return valor;
      }
    },
    components: {
      VuePerfectScrollbar,
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
</style>
