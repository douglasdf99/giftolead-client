<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <nenhum-registro/>
        </div>
      <div class="" v-else>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items" v-if="tipo == 'usuario'">
          <template slot="thead">
            <vs-th></vs-th>
            <vs-th></vs-th>
            <vs-th></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
              <vs-td class="flex items-center">
                <div class="flex items-center">
                  <img :src="null" width="40px" class="rounded-full mx-5" :style="{ backgroundImage: 'url('+get_img_api(tr.avatar)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '40px', height:'40px',backgroundPositionX: 'center' }">
                  <p class="font-bold text-dark text-xl">{{tr.name}}</p>
                </div>
              </vs-td>
              <vs-td>
                <p class="preco">R$ {{getValComissao(tr.comissaos)}}</p>
              </vs-td>
              <vs-td class="td-icons">
                <div class="flex items-center" v-if="$acl.check('comissao_detal')">
                  <vx-tooltip position="top" text="Detalhar">
                    <vs-icon icon-pack="material-icons" icon="visibility" @click="$emit('visualizar', tr)"
                             class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                  </vx-tooltip>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <vs-table :data="items" class="table-items" v-else>
          <template slot="thead">
            <vs-th>Lead / Produto</vs-th>
            <vs-th>Atendente</vs-th>
            <vs-th>Comissão</vs-th>
            <vs-th>Responsável</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
              <vs-td v-if="tr.responsavel">
                <p class="destaque text-lg">{{tr.responsavel.lead_produto.lead.nome}}</p>
                <vs-chip :color="tr.produto.cor || ''">{{tr.produto.nome}}</vs-chip>
              </vs-td>
              <vs-td>
                <div class="flex items-center" v-if="tr.user">
                  <img :src="get_img_api(tr.user.avatar)" width="40px" class="rounded-full mr-5 ml-1" style="margin-left: -8%"/>
                  <p class="font-bold text-dark text-xl">{{tr.user.name}}</p>
                </div>
              </vs-td>
              <vs-td>
                <p class="preco">R$ {{formatPrice(tr.valor)}}</p>
              </vs-td>
              <vs-td>
                <div class="flex items-center">
                  <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full" v-if="tr.origem_type == 'App\\Models\\CampanhaCarrinho'">
                  <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full" v-else-if="tr.origem_type == 'App\\Models\\CampanhaBoleto'">
                  <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full" v-else-if="tr.origem_type == 'App\\Models\\CampanhaWhatsapp'">
                  <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full" v-else-if="tr.origem_type == 'App\\Models\\CampanhaAgendamento'">
                  <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full" v-else-if="tr.origem_type == 'App\\Models\\CampanhaCancelado'">
                  <img :src="get_img_api(tr.origem.avatar)" v-else-if="tr.origem" width="40px" class="rounded-full">
                  <p class="font-bold text-dark text-xl ml-3">{{nameCriador(tr)}}</p>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <transition name="fade" v-if="selecteds.length > 0">
          <footer-doug>
            <div class="vx-col sm:w-11/12 mb-2">
              <vs-button class="mr-3 float-right" color="primary" type="filled" @click="gerarOrdens" v-if="tipo == 'usuario'" :disabled="!$acl.check('comissao_pagamento')">
                Gerar ordens
              </vs-button>
              <div class="float-left" v-if="tipo == 'usuario'">
                <span class="font-bold text-2xl">R$ {{formatPrice(somaSelecionados)}}</span>
                <p>valor total selecionado</p>
              </div>
            </div>
          </footer-doug>
        </transition>
      </div>

    </div>
</template>

<script>
    export default {
        name: "ListComissoes",
        props: ['items', 'tipo'],
        data() {
            return {
                selecteds: [],
                ids: [],
            }
        },
        created() {
            console.log('items', this.items);
        },
        methods: {
            handleSelected(tr) {
            },
            getValComissao(arr) {
                let soma = 0;
                arr.forEach(item => {
                    soma = parseFloat(soma) + parseFloat(item.valor);
                });
                return this.formatPrice(parseFloat(soma));
            },
            gerarOrdens() {
                this.$vs.dialog({
                    color: 'primary',
                    title: 'Gerar ordens',
                    text: `Deseja gerar ordens a partir das comissões selecionadas?`,
                    acceptText: 'Sim',
                    accept: () => {
                        this.$emit('gerarOrdens', this.selecteds);
                        this.selecteds = [];
                    }
                })
            },
            nameCriador(obj) {
                if (obj.origem_type == 'App\\Models\\User') return obj.origem.name; else return (obj.origem) ? obj.origem.nome : 'Sem origem';
            }
        },
        computed: {
            somaSelecionados() {
                let soma = 0;
                this.selecteds.forEach(obj => {
                    obj.comissaos.forEach(item => {
                        soma = parseFloat(soma) + parseFloat(item.valor);
                    });
                });

                return soma;
            }
        }
    }
</script>
