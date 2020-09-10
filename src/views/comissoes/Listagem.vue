<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                <div class="w-8/12">
                    <div>
                        <p class="span-sem-item">Nenhuma registro encontrado</p>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div class="vx-row bg-white p-4 my-5 rounded-lg" v-for="item in items" v-else>
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
                <img src="@/assets/images/util/checkout.svg" width="50" class="ml-2 rounded-full" v-if="item.criador_type == 'App\\Models\\CampanhaCarrinho'">
                <img src="@/assets/images/util/boleto.svg" width="50" class="ml-2 rounded-full" v-else-if="item.criador_type == 'App\\Models\\CampanhaBoleto'">
                <img src="@/assets/images/util/whatsapp.svg" width="50" class="ml-2 rounded-full" v-else-if="item.criador_type == 'App\\Models\\CampanhaWhatsapp'">
                <img src="@/assets/images/util/agendamento.svg" width="50" class="ml-2 rounded-full" v-else-if="item.criador_type == 'App\\Models\\CampanhaAgendamento'">
                <img src="@/assets/images/util/cancelado.svg" width="50" class="ml-2 rounded-full" v-else-if="item.criador_type == 'App\\Models\\CampanhaCancelado'">
                <img src="@/assets/images/util/whatsapp.svg" width="50" class="ml-2 rounded-full" v-else-if="item.criador_type == 'App\\\Models\\\Whatsapplist'">
                <img :src="get_img_api(item.criador.avatar)" v-if="item.criador" width="50px" class="rounded-full">
                <img :src="get_img_api(item.atendente.avatar)" width="50px" class="rounded-full" style="margin-left: -8%">
                <span class="ml-4 font-bold">{{item.atendente.name}}</span>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vs-icon icon-pack="material-icons" icon="check_circle_outline" v-if="true"
                         class="icon-grande font-bold" style="color: #00ACC1"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="highlight_off" v-else
                         class="icon-grande font-bold text-danger"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-warning" v-if="item.tipo == 'pendente'"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-danger" v-else></vs-icon>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vx-tooltip position="top" text="Detalhar">
                    <vs-icon icon-pack="material-icons" icon="visibility" @click="$emit('visualizar', item)"
                             class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                </vx-tooltip>
                <vx-tooltip position="top" text="Aprovar" v-if="item.tipo == 'pendente'">
                    <vs-icon icon-pack="material-icons" icon="done_all" @click="$emit('action', {id: item.id, method: 'aprovar'})"
                             class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                </vx-tooltip>
                <vx-tooltip position="top" text="Reprovar" v-if="item.tipo == 'pendente'">
                    <vs-icon icon-pack="material-icons" icon="highlight_off" @click="$emit('action', {id: item.id, method: 'reprovar'})"
                             class="icon-grande font-bold mx-3 cursor-pointer text-danger"></vs-icon>
                </vx-tooltip>
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
    }
</script>

<style scoped>
    .linha {
        transition-duration: .2s;
    }

    .linha:hover {
        background-color: transparent !important;
        transition-duration: .2s;
    }
</style>