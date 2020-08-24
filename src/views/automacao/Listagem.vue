<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <div class="w-full lg:w-8/12 xlg:w-8/12 s:w-full sem-item">
                <div class="w-8/12">
                    <div>
                        <p class="span-sem-item">Nenhum registro encontrado</p>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div class="com-item" v-else>
            <vs-table :data="items" class="table-items">

                <template slot="thead">
                    <vs-th></vs-th>
                    <vs-th>Cliente</vs-th>
                    <vs-th>Inserção</vs-th>
                    <vs-th>E-mail</vs-th>
                    <vs-th>Token</vs-th>
                    <vs-th>Ordem de envio</vs-th>
                    <vs-th>Status</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr>
                        <vs-td class="flex justify-center items-center">
                            <vs-dropdown vs-trigger-click>
                                <vs-button radius color="#EDEDED" type="filled"
                                           class="btn-more-icon relative botao-menu"
                                           icon-pack="material-icons" icon="more_horiz"
                                ></vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list">
                                    <vs-dropdown-item>
                                        <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                        Editar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                        Deletar
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">Fulano</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">Nayanni</p>
                        </vs-td>
                        <vs-td>

                        </vs-td>
                    </vs-tr>
                </template>

            </vs-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Listagem",
        props: ['items', 'tipo']
    }
</script>

<style scoped>

</style>