<template>
    <div>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" v-if="tipo != 'aprovado'" class="table-items">
            <template slot="thead">
                <vs-th v-if="tipo == 'pendente'"></vs-th>
                <vs-th>Número</vs-th>
                <vs-th>Número de Objetos</vs-th>
                <vs-th>Brinde</vs-th>
                <vs-th>Peso Bruto (Kg)</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center" v-if="tipo == 'pendente'">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="$emit('editar', tr)">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>15</vs-td>
                    <vs-td>{{tr.automacaos.length}}</vs-td>
                    <vs-td>
                        <vs-chip color="primary" class="text-md py-2 font-bold">
                            {{tr.brinde.nome}}
                        </vs-chip>
                    </vs-td>
                    <vs-td>{{tr.brinde.peso}}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande text-warning" v-if="!tr.fechado"></vs-icon>
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande text-success" v-else></vs-icon>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-table :data="items" class="table-items" v-else>
            <template slot="thead">
                <vs-th v-if="tipo == 'pendente'"></vs-th>
                <vs-th>Número</vs-th>
                <vs-th>Número de Objetos</vs-th>
                <vs-th>Brinde</vs-th>
                <vs-th>Peso Bruto (Kg)</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center" v-if="tipo == 'pendente'">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="$emit('editar', tr)">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>25</vs-td>
                    <vs-td>{{tr.automacaos.length}}</vs-td>
                    <vs-td>
                        <vs-chip color="primary" class="text-md py-2 font-bold">
                            {{tr.brinde.nome}}
                        </vs-chip>
                    </vs-td>
                    <vs-td>{{tr.brinde.peso}}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande" v-bind:style="{color: tr.fechado ? 'success' : 'warning'}"></vs-icon>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <transition name="fade" v-if="selecteds.length > 0">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative flex items-center">
                            <p class="mr-4 text-lg">{{selecteds.length}} selecionadas</p>
                            <vs-button class="mr-3" color="primary" type="filled" @click="$emit('fecharVarias', selecteds, 'fechar', tipo)" v-if="tipo == 'pendente'">
                                Fechar Expedições
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Listagem",
        props: ['items', 'tipo'],
        data() {
            return {
                selecteds: []
            }
        },
        methods: {
            handleSelected(tr) {

            }
        }
    }
</script>

<style scoped>

</style>