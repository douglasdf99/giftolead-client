<template>
    <div>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items">
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th>Destinatário</vs-th>
                <vs-th>E-mail</vs-th>
                <vs-th>Brinde</vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="updateData(data[indextr])">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>{{tr.nome_destinatario}}</vs-td>
                    <vs-td>{{tr.email_destinatario}}</vs-td>
                    <vs-td>
                        <vs-chip color="primary" class="text-md py-2 font-bold">
                            {{tr.brinde.nome}}
                        </vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].status" class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande" v-bind:style="{color: getStatus(tr.status)}"
                                 v-if="data[indextr].status"></vs-icon>
                    </vs-td>
                    <vs-td>
                        <vs-icon icon-pack="material-icons" icon="visibility" class="icon-grande" @click="$emit('visualizar', tr)"></vs-icon>
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
                            <vs-button class="mr-3" color="primary" type="filled" @click="$emit('aprovarVarias', selecteds, 'aprovar')" v-if="tipo == 'pendente'">
                                Aprovar Etiquetas
                            </vs-button>
                            <vs-button class="mr-3 text-black" color="danger" type="border" icon-pack="material-icons" icon="close" @click="$emit('aprovarVarias', selecteds, 'reprovar')" v-if="tipo == 'pendente'">
                                Reprovar Etiquetas
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
            getStatus(status) {
                switch (status) {
                    case 'pendente':
                        return '#ff9f43'
                    case 'aprovado':
                        return 'red'
                    default:
                        return ''
                }
            },
            handleSelected(tr) {
                console.log(this.selecteds)
            }
        }
    }
</script>

<style scoped>

</style>