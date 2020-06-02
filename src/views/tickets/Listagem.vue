<template>
    <div>
        <div class="vx-row bg-white p-4 my-5 rounded-lg" v-for="ticket in items">
            <div class="vx-col w-1/12 flex justify-center">
                <img src="@/assets/images/util/avatar-padrao.svg" width="80">
            </div>
            <div class="vx-col w-4/12">
                <p>{{ticket.id}}</p>
                <p class="destaque">{{ticket.lead.nome}}</p>
                <vs-chip :color="ticket.produto.cor || ''">{{ticket.produto.nome}}</vs-chip>
            </div>
            <div class="vx-col w-3/12 flex items-center">
                <p>{{ticket.lead.email}}</p>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-success" v-if="ticket.status == 0"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-black" v-if="ticket.status == 2"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-warning" v-if="ticket.status == 1"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-blue" v-if="ticket.status == 3"></vs-icon>
            </div>
            <div class="vx-col w-2/12 flex justify-around items-center">
                <i class="material-icons" v-if="ticket.status != 2">call</i>
                <i class="material-icons">visibility</i>
                <i class="material-icons">edit</i>
                <i class="material-icons">delete</i>
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

</style>