<template>
    <div>
        <div class="vx-row bg-white p-4 my-5 rounded-lg" v-for="item in items">
            <div class="vx-col w-1/12 flex justify-center">
                <img :src="getAvatar(item.lead.email)" width="80" class="rounded-full">
            </div>
            <div class="vx-col w-4/12">
                <p>{{item.id}}</p>
                <p class="destaque text-lg">{{item.lead.nome}}</p>
                <vs-chip :color="item.produto.cor || ''">{{item.produto.nome}}</vs-chip>
            </div>
            <div class="vx-col w-4/12 flex items-center">
                <p>{{item.lead.email}}</p>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-success" v-if="item.status == 0"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-black" v-if="item.status == 2"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-warning" v-if="item.status == 1"></vs-icon>
                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                         class="icon-grande text-blue" v-if="item.status == 3"></vs-icon>
            </div>
            <div class="vx-col w-2/12 flex justify-around items-center">
                <i class="material-icons cursor-pointer" v-if="item.status != 2"
                   @click="$emit('atender', item.id)">call</i>
                <i class="material-icons ">visibility</i>
                <i class="material-icons cursor-pointer" @click="$emit('update', item)">edit</i>
                <i class="material-icons cursor-pointer" @click="$emit('delete', item.id)">delete</i>
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