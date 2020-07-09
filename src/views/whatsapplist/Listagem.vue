<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                <div class="w-8/12">
                    <div>
                        <p class="span-sem-item">Nenhum item foi encontrado</p>
                        <p class="text-sem-item mt-6">
                            Para inserir novos registros você <br> pode clicar em incluir conta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <vs-table :data="items" class="table-items" v-else
                  style="border-spacing: 0 8px;border-collapse: separate;">

            <template slot="thead">
                <vs-th class="lg:w-1/12"></vs-th>
                <vs-th>Nome</vs-th>
                <vs-th>Produto</vs-th>
                <vs-th>Campanha</vs-th>
                <vs-th>Data</vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3 relative">
                    <vs-td class="flex justify-center items-center relative w-full">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <span class="span-identifica-item-dropdown">Nº {{tr.id}}</span>

                                <vs-dropdown-item @click="deletar(tr.id)">
                                    <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                    Deletar
                                </vs-dropdown-item>

                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td :data="tr.nome" class="relative">
                        <span class="destaque">{{ tr.lead.nome }}</span>
                    </vs-td>
                    <vs-td :data="tr" v-if="tr.campanhable" class="relative">
                        <vs-chip :color="tr.campanhable.produto.cor || ''" class="product-order-status">
                            {{ tr.campanhable.produto.nome}}
                        </vs-chip>
                    </vs-td>
                    <vs-td>
                        {{tr.campanhable.nome}}
                    </vs-td>
                    <vs-td>
                        <span class="destaque">{{ tr.created_at | formatDate}}</span>
                    </vs-td>
                    <vs-td :data="tr.status" class="relative flex justify-start items-center">
                        <vx-tooltip :text="'Campanha de ' + (tr.campanhable.mensagem ? 'Whatsapp' : 'Boleto')" position="top" class="text-center inline-block">
                            <i class="fas fa-file-invoice text-3xl mx-2 text-black" v-if="!tr.campanhable.mensagem"></i>
                            <i class="fab fa-whatsapp text-3xl mx-2" style="color: #37B468" v-else></i>
                        </vx-tooltip>
                        <vx-tooltip text="Respondido" position="top" class="text-center inline-block" v-if="tr.resposta">
                            <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                     class="icon-grande text-success cursor-default"></vs-icon>
                        </vx-tooltip>
                        <vx-tooltip text="Pendente" position="top" class="text-center inline-block" v-else>
                            <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande text-warning cursor-default"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip text="Transformar em Ticket" position="top" class="text-center inline-block mx-4">
                            <vs-icon icon-pack="material-icons" icon="wrap_text" v-if="tr.resposta && (tr.resposta.responsavel_id == $store.state.AppActiveUser.uid)"
                                     class="icon-grande m-0 text-black cursor-pointer" @click="$emit('transformar', tr)"></vs-icon>
                        </vx-tooltip>
                        <vx-tooltip :text="tr.resposta ? 'Visualizar' : 'Responder'" position="top" class="text-center inline-block mx-4">
                            <vs-icon icon-pack="material-icons" :icon="tr.resposta ? 'visibility' : 'reply'"
                                     class="icon-grande m-0 text-black cursor-pointer" @click="$emit('responder', tr)"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>
    export default {
        name: "Listagem",
        props: ['items'],
    }
</script>

<style scoped>

</style>