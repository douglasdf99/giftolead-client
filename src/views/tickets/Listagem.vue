<template>
    <div>
        <div class="vx-row bg-white p-4 my-5 rounded-lg" v-for="ticket in items" :key="ticket.id">
            <div class="vx-col w-1/12 flex-row">
                <img :src="null" width="80" class="rounded-full"
                     :style="{ backgroundImage: 'url('+getAvatar(ticket.lead.email)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '60px', height:'60px' }">
            </div>
            <div class="vx-col w-4/12">
                <p>{{ ticket.id }}</p>
                <p class="destaque">{{ ticket.lead.nome }}</p>
                <vs-chip :color="ticket.produto.cor || ''">{{ ticket.produto.nome }}</vs-chip>
            </div>
            <div class="vx-col w-4/12 flex items-center">
                <p>{{ ticket.lead.email }}</p>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vx-tooltip text="Aberto">
                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                             class="icon-grande text-success" v-if="ticket.status == 0"></vs-icon>
                </vx-tooltip>
                <vx-tooltip text="Pendente">
                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                             class="icon-grande text-warning" v-if="ticket.status == 1"></vs-icon>
                </vx-tooltip>
                <vx-tooltip text="Fechado">
                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                             class="icon-grande text-black" v-if="ticket.status == 2"></vs-icon>
                </vx-tooltip>
                <vx-tooltip text="Reaberto">
                    <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                             class="icon-grande text-primary" v-if="ticket.status == 3"></vs-icon>
                </vx-tooltip>
            </div>
            <div class="vx-col w-2/12 flex justify-around items-center">
                <i class="material-icons hover:text-primary cursor-pointer" v-if="canAtender(ticket)" @click="$emit('atender', ticket.id)">call</i>
                <i class="material-icons hover:text-primary cursor-pointer" v-if="$acl.check('ticket_detalhar')" @click="$emit('detalhar', ticket.id)">visibility</i>
                <i class="material-icons hover:text-primary cursor-pointer" v-if="canEditar(ticket)" @click="$emit('update', ticket)">edit</i>
                <i class="material-icons hover:text-primary cursor-pointer" v-if="(ticket.status == 2 && $acl.check('ticket_transferir'))" @click="$emit('open', ticket)">lock_open</i>
                <i class="material-icons hover:text-primary cursor-pointer" v-if="canDeletar(ticket)" @click="$emit('delete', ticket.id)">delete</i>
                <i class="material-icons hover:text-primary cursor-pointer" v-if="(ticket.status == 1 && $acl.check('ticket_transferir'))" @click="$emit('transfer', ticket.id)">forward</i>
            </div>
        </div>
    </div>
</template>

<script>
import Tooltip from "../components/vuesax/tooltip/Tooltip";

export default {
    name: "Listagem",
    components: {Tooltip},
    props: ['items'],
    data() {
        return {
            currentx: 1,
        };
    },

    methods: {
        canAtender(ticket) {
            if (ticket.status != 2 && this.$acl.check('ticket_atender')) {
                let user = JSON.parse(localStorage.getItem("userInfo"));
                if (ticket.status == 3) {
                    return true;
                }
                if (ticket.status == 0) {
                    return true;
                }
                if (ticket.atendimentos) {
                    if (ticket.atendimentos.length > 0 && ticket.atendimentos[0].atendente_id == user.uid) {
                        return true;
                    }
                }

                return false;
            }
            return false;
        },
        canEditar(ticket) {
            if (ticket.status != 2 && this.$acl.check('ticket_editar_todos')) {
                return true;
            } else if (ticket.status != 2 && this.$acl.check('ticket_editar')) {
                let user = JSON.parse(localStorage.getItem("userInfo"));
                if (ticket.responsavel_type == 'App\\Models\\User' && ticket.responsavel_id == user.uid) {
                    return true;
                }
                return false;
            }
            return false;
        },
        canDeletar(ticket) {
            if (ticket.status != 2 && this.$acl.check('ticket_deletar_todos')) {
                return true;
            } else if (ticket.status != 2 && this.$acl.check('ticket_deletar')) {
                let user = JSON.parse(localStorage.getItem("userInfo"));
                if (ticket.responsavel_type == 'App\\Models\\User', ticket.responsavel_id == user.uid) {
                    return true;
                }
                return false;
            }
            return false;
        }
    }
};
</script>
