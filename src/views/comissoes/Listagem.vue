<template>
  <div>
    <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
      <nenhum-registro/>
    </div>
    <div class="" v-else>
      <vs-button color="primary" type="border" @click="realizarDiagnostico" icon-pack="feather" icon="icon-refresh-cw" id="button-with-loading-diagnostico" class="vs-con-loading__container w-full">Realizar Diagnóstico em Todos</vs-button>

      <div class="vx-row bg-white p-4 my-5 rounded-lg vs-con-loading__container" v-for="(item,index) in items" @click="visualizar(item)"
           v-bind:class="{'cursor-pointer' : ( item.tipo != 'reprovado' && $acl.check('comissao_pendente_detalhar')),
              'clicavel' : (item.tipo != 'reprovado' && $acl.check('comissao_pendente_detalhar'))}"  :id="'button-with-loading-card-'+index">
        <div class="vx-col w-3/12">
          <p>{{item.id}}</p>
          <p class="destaque text-lg">{{item.ticket.lead.nome}}</p>
          <vs-chip :color="item.lead_produto.produto.cor || ''">{{item.lead_produto.produto.nome}}</vs-chip>
        </div>
        <div class="vx-col w-3/12">
          <p class="mt-2">comissão</p>
          <p class="preco">R$ {{formatPrice(item.comissao_criador + item.comissao_atendente)}}</p>
        </div>
        <div class="vx-col w-2/12 flex items-center text-center">
          <vx-tooltip position="top" :text="'Responsável | ' + nameCriador(item)" class="img-criador">
            <img src="@/assets/images/util/checkout.svg" width="40px" class="ml-2 rounded-full agente" v-if="item.criador_type == 'App\\Models\\CampanhaCarrinho'">
            <img src="@/assets/images/util/boleto.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaBoleto'">
            <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaWhatsapp'">
            <img src="@/assets/images/util/agendamento.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaAgendamento'">
            <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaCancelado'">
            <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\Link'">
            <div :src="null" width="40px" class="ml-2 rounded-full agente" v-else :style="{ backgroundImage: 'url('+get_img_api(item.criador.avatar)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '40px', height:'40px',backgroundPositionX: 'center' }"></div>

          </vx-tooltip>
          <vx-tooltip position="top" :text="'Atendente | ' + item.atendente.name" style="margin-left: -15px">
            <div :src="null" width="40px" class="rounded-full agente"
                 :style="{ backgroundImage: 'url('+get_img_api(item.atendente.avatar)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '40px', height:'40px',backgroundPositionX: 'center' }"></div>
          </vx-tooltip>
        </div>
        <div class="vx-col w-1/12 flex items-center justify-center">
          <vx-tooltip position="top" text="Possui anexo" v-if="item.anexos.length > 0" class="cursor-default">
            <vs-icon icon-pack="material-icons" icon="attach_file"
                     class="icon-grande font-bold text-black"></vs-icon>
          </vx-tooltip>
          <vx-tooltip position="top" text="Pendente" v-if="item.tipo == 'pendente'">
            <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-warning"></vs-icon>
          </vx-tooltip>
          <vx-tooltip position="top" text="Reprovado" v-else>
            <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-danger"></vs-icon>
          </vx-tooltip>
        </div>
        <div class="vx-col w-1/12 flex items-center">
          <vx-tooltip position="top" text="Ultimo diagnóstico">
            <vs-chip>
              <vs-icon icon-pack="material-icons" icon="local_hospital" class="icon-grande font-bold text-warning"></vs-icon>
              <p class="" v-if="item.disgnostico">{{item.disgnostico.created_at | formatDateHumanize()}}</p>
              <p v-else>Nunca realizado</p>
            </vs-chip>

          </vx-tooltip>
        </div>
        <div class="vx-col w-1/12 flex items-center justify-center">
          <vx-tooltip position="top" text="Restaurar" v-if="item.tipo == 'reprovado' && $acl.check('comissao_pendente_restaurar')">
            <vs-icon icon-pack="material-icons" icon="undo" @click="$emit('action', {id: item.id, method: 'restaurar'})"
                     class="icon-grande font-bold mx-3 cursor-pointer text-warning"></vs-icon>
          </vx-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Listagem",
    props: ['items'],
    data() {
      return {
        currentx: 1,
      }
    },
    methods: {
      realizarDiagnostico() {
        this.$vs.loading({
          color: this.colorLoading,
          container: "#button-with-loading-diagnostico",
          scale: 0.45
        })
        var self = this
        async function diags() {
          for (const [idx, item] of self.items.entries()) {
            self.$vs.loading({
              color: self.colorLoading,
              container: "#button-with-loading-card-"+idx,
              scale: 0.45
            })
            document.getElementById('button-with-loading-card-'+idx).focus();
            const diag = await self.$store.dispatch('comissoes/diagnosticar', {pre_comissao_id: item.id}).then(response => {
              item.disgnostico = response.data;
            }).finally(() => {
              self.$vs.loading.close("#button-with-loading-card-"+idx+" > .con-vs-loading")
            });
          }
          self.$vs.loading.close("#button-with-loading-diagnostico > .con-vs-loading")
        }
        diags();
      },
      nameCriador(obj) {
        switch (obj.criador_type) {
          case 'App\\Models\\User':
            return obj.criador.name;
          default:
            return obj.criador.nome;
        }
      },
      visualizar(item) {
        if (this.$acl.check('comissao_pendente_detalhar'))
          this.$emit('visualizar', item)
        else {
          this.$vs.notify({
            color: 'danger',
            text: 'Você não possui permissão para detalhar.'
          });
        }
      }
    }
  }
</script>
