<template>
    <vs-table :data="items" @selected="handleSelected" class="table-items" style="margin-top: 1rem">
        <template slot="thead">
            <!--<vs-th></vs-th>-->
            <vs-th>Nome</vs-th>
            <vs-th>E-mail</vs-th>
            <vs-th>Telefone</vs-th>
            <vs-th>Entrou em</vs-th>
            <vs-th v-if="dados.todos == '1' || dados.inativos == '1'">Saiu em</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="mb-3 cursor-pointer">
                <vs-td>{{tr.nome}}</vs-td>
                <vs-td>{{tr.email}}</vs-td>
                <vs-td v-if="tr.telefone != null">{{tr.telefone | VMask('(##) #####-####')}}</vs-td>
                <vs-td v-else></vs-td>
                <vs-td><span class="destaque">{{ tr.created_at | formatDateTime}}</span></vs-td>
                <vs-td v-if="dados.todos || dados.inativos"><span class="destaque">{{ tr.deleted_at | formatDateTime}}</span></vs-td>
            </vs-tr>
        </template>
    </vs-table>
</template>

<script>
    export default {
        name: "TableContatos",
        props: ['dados', 'items'],
        methods: {
            handleSelected(tr) {
                this.$router.push({path: '/leads/detalhe/' + tr.lead_id});
            },
        }
    }
</script>

<style scoped>

</style>