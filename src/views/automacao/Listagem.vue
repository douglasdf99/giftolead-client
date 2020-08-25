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
                    <vs-tr v-for="tr in data">
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
                            <p class="font-bold">{{tr.lead.nome}}</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{getResponsavel(tr)}}</p>
                        </vs-td>
                        <vs-td>
                            <vs-icon icon-pack="material-icons" icon="cancel" color="danger" v-if="tr.eventos.length == 0" class="text-2xl"/>
                        </vs-td>
                        <vs-td>
                            {{tr.uuid}}
                        </vs-td>
                        <vs-td>
                            <p class="font-bold flex items-center" v-bind:class="getOrdemColor(tr)">
                                {{getOrdemEnvio(tr)}}
                                <i class="material-icons ml-3" v-bind:class="getOrdemColor(tr)">fiber_manual_record</i>
                            </p>
                        </vs-td>
                        <vs-td class="flex">
                            <img src="@/assets/images/util/delivery-icon.svg" width="40px" class="mr-2" v-if="tr.rastreio != null">
                            <img src="@/assets/images/util/expedicao-icon.svg" width="25px" v-if="tr.expedicao && tr.expedicao != null">
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
        props: ['items', 'tipo'],
        methods: {
            getResponsavel(obj){
                switch (obj.responsavel_type) {
                    case 'App\\Models\\User':
                        return obj.responsavel.name;
                    default:
                        return obj.responsavel.nome;
                }
            },
            getOrdemEnvio(obj){
                if(obj.endereco == null)
                    return 'Pendente'
                else
                    return 'Preenchida'
            },
            getOrdemColor(obj){
                if(obj.endereco == null)
                    return 'text-warning'
                else
                    return 'text-blue'
            }
        }
    }
</script>

<style scoped>

</style>