<template>
    <div>
        <div class="vx-row flex items-end lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input" size="large"
                                      placeholder="Pesquisar por e-mail do lead"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
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
                    <vs-table :data="historico" class="table-items">

                        <template slot="thead">
                            <!--<vs-th></vs-th>-->
                            <vs-th>Lead</vs-th>
                            <vs-th>Assunto</vs-th>
                            <vs-th>Data e Hora</vs-th>
                            <vs-th>Status</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                <vs-td>{{tr.contato ? tr.contato.email : ''}}</vs-td>
                                <vs-td>{{tr.email.assunto}}</vs-td>
                                <vs-td><span class="destaque">{{ tr.email.created_at | formatDateTime}}</span></vs-td>
                                <vs-td>
                                    <vs-chip v-if="tr.eventos_entrega.length > 0"
                                             :color="tr.eventos_entrega[tr.eventos_entrega.length - 1].resposta === 'success' ? '#2ecc71' : '#e74c3c'"
                                             class="product-order-status">
                                        {{ tr.eventos_entrega[tr.eventos_entrega.length - 1].evento }}
                                    </vs-chip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import moduleCampCheckouts from "@/store/campanha_checkout/moduleCampCheckouts";

    export default {
        name: "Historico",
        computed: {
            items() {
                return this.$store.state.items;
            },
        },
        created() {
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            this.getId(this.$route.params.id);
        },
        data() {
            return {
                statusObj: {
                    Processado: ['#2ecc71'],
                    Cancelado: ['#e74c3c'],
                    Entregue: ['#2ecc71'],
                    Desistiu: ['#2ecc71'],
                    Pulo: ['#2ecc71'],
                    Bloqueado: ['#2ecc71'],
                    Aberto: ['#2ecc71'],
                    Clicou: ['#2ecc71'],
                    Reportado: ['#2ecc71'],
                    Cancelarsubscricao: ['#2ecc71'],
                },
                currentx: 1,
                search: '',
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                dados: {
                    search: '',
                    page: 1,
                },
                historico: []
            }
        },
        methods: {
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.dados.page = 1;
                this.pagination.current_page = 1;
                this.currentx = 1;
                this.getId(this.$route.params.id);
            },
            getId(id) {
                this.$vs.loading();
                let url = '';
                if (this.search !== '') {
                    url += 'contato.nome:' + this.search + ';';
                    url += 'contato.email:' + this.search + ';';
                    url += 'campanha.nome:' + this.search;
                }
                this.$store.dispatch('checkout/getHistorico', {id: id, search: url}).then(response => {
                    this.historico = response.data;
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                this.dados.page = this.currentx;
                this.getId(this.$route.params.id);
            }
        },
    }
</script>

<style scoped>

</style>