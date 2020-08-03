<template>
    <div>
        <vs-row v-if="items">
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div>
                                <p class="span-sem-item">Nenhuma transação encontrada</p>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-else>
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Transação</vs-th>
                            <vs-th>Produto</vs-th>
                            <vs-th>Data e Hora</vs-th>
                            <vs-th>Comissão do Hotmart</vs-th>
                            <vs-th>Comissão Cadastrada</vs-th>
                            <vs-th>Status</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                <vs-td :data="tr.transaction">
                                    {{ tr.transaction }}
                                </vs-td>
                                <vs-td v-if="tr.produto">
                                    <vs-chip :color="tr.produto.cor || ''" class="product-order-status">
                                        {{ tr.produto.nome}}
                                    </vs-chip>
                                </vs-td>
                                <vs-td :data="tr.updated_at">
                                    <span class="destaque">{{ tr.updated_at | formatDateTime}}</span>
                                </vs-td>
                                <vs-td>
                                    <span class="preco">R$ {{formatPrice(tr.full_price)}}</span>
                                </vs-td>
                                <vs-td v-if="tr.produto">
                                    <span class="preco">R$ {{formatPrice(tr.produto.preco)}}</span>
                                </vs-td>
                                <vs-td>
                                    <vs-chip v-for="(status, index) in hotmartStatus" v-if="index === tr.status"
                                             :color="status[1]" class="product-order-status">
                                        {{ status[0]}}
                                    </vs-chip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import VueMoment from 'vue-moment'

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Index",
        props: ['items'],
        components: {
            VueMoment,
            moment,
        },
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Leads',
                dados: {
                    search: '',
                    pesquisa: '',
                    page: 1,
                    dt_inicio: '',
                    dt_fim: '',
                    status: '',
                    produto: '',
                    length: 25
                },
                dt_inicio: '',
                dt_fim: '',
                selectedProduto: null,
                selectedStatus: null,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dateRange: {},
                produtos: [],
                status: [],
                currentx: 1,
                hotmartStatus: {
                    started: ['Iniciado', '#3498db'],
                    billet_printed: ['Boleto Impresso', '#848a91'],
                    expired: ['Expirado', '#848a91'],
                    pending_analysis: ['Pendente', '#848a91'],
                    delayed: ['Atrasado', '#e74c3c'],
                    canceled: ['Cancelado', '#e74c3c'],
                    approved: ['Aprovado', '#2ecc71'],
                    completed: ['Concluído', '#2ecc71'],
                    chargeback: ['Chargeback', '#e74c3c'],
                    blocked: ['Bloqueado', '#848a91'],
                    refunded: ['Devolvido', '#e74c3c'],
                    admin_free: ['Cadastrado', '#848a91'],
                    dispute: ['Disputa', '#e74c3c']
                },
            }
        },
        created() {
            console.log('ué carai', this.items)
        },
        methods: {
            addNewData() {
                //this.$router.push({name: 'produto-criar'});
            },
            updateData(id) {
                //this.$router.push({path: '/configuracoes/produtos/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },

    }
</script>
<style scoped>
    .input-span-placeholder {
        font-size: 1rem !important;
    }
</style>