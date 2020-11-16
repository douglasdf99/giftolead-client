<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <nenhum-registro/>
        </div>
        <div v-else class="vx-row bg-white p-4 my-5 rounded-lg" v-for="item in items" @click="visualizar(item)"
             v-bind:class="{'cursor-pointer' : (item.tipo != 'reprovado' && $acl.check('comissao_pendente_detalhar')),
              'clicavel' : (item.tipo != 'reprovado' && $acl.check('comissao_pendente_detalhar'))}">
            <div class="vx-col w-3/12">
                <p>{{item.id}}</p>
                <p class="destaque text-lg">{{item.ticket.lead.nome}}</p>
                <vs-chip :color="item.lead_produto.produto.cor || ''">{{item.lead_produto.produto.nome}}</vs-chip>
            </div>
            <div class="vx-col w-3/12">
                <p class="mt-2">comissão</p>
                <p class="preco">R$ {{formatPrice(item.comissao_criador + item.comissao_atendente)}}</p>
            </div>
            <div class="vx-col w-3/12 flex items-center text-center">
                <vx-tooltip position="top" :text="'Responsável | ' + nameCriador(item)" class="img-criador">
                    <img src="@/assets/images/util/checkout.svg" width="40px" class="ml-2 rounded-full agente" v-if="item.criador_type == 'App\\Models\\CampanhaCarrinho'">
                    <img src="@/assets/images/util/boleto.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaBoleto'">
                    <img src="@/assets/images/util/whatsapp.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaWhatsapp'">
                    <img src="@/assets/images/util/agendamento.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaAgendamento'">
                    <img src="@/assets/images/util/cancelado.svg" width="40px" class="ml-2 rounded-full agente" v-else-if="item.criador_type == 'App\\Models\\CampanhaCancelado'">
                    <img :src="get_img_api(item.criador.avatar)" v-else width="40px" class="ml-2 rounded-full agente">
                </vx-tooltip>
                <vx-tooltip position="top" :text="'Atendente | ' + item.atendente.name" style="margin-left: -15px">
                    <img :src="get_img_api(item.atendente.avatar)" width="40px" class="rounded-full agente">
                </vx-tooltip>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vx-tooltip position="top" text="Possui anexo" v-if="item.anexos.length > 0" class="cursor-default">
                    <vs-icon icon-pack="material-icons" icon="attach_file"
                             class="icon-grande font-bold text-black"></vs-icon>
                </vx-tooltip>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-warning" v-if="item.tipo == 'pendente'"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-danger" v-else></vs-icon>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center" v-if="$acl.check('comissao_pendente_restaurar')">
                <vx-tooltip position="top" text="Restaurar" v-if="item.tipo == 'reprovado'">
                    <vs-icon icon-pack="material-icons" icon="undo" @click="$emit('action', {id: item.id, method: 'restaurar'})"
                             class="icon-grande font-bold mx-3 cursor-pointer text-warning"></vs-icon>
                </vx-tooltip>
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
            nameCriador(obj) {
                switch (obj.criador_type) {
                    case 'App\\Models\\User':
                        return obj.criador.name;
                    default:
                        return obj.criador.nome;
                }
            },
            visualizar(item){
                if(this.$acl.check('comissao_pendente_detalhar'))
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
