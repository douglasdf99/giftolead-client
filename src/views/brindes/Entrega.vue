<template>
    <div>
        <div class="vx-row flex items-end mb-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-6/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form>
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquise por nome do Lead ou Token"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-4">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form>
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por inserção"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-4">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <label class="vs-input--label">Brinde</label>
                <v-select v-model="selectedStatus" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="status"/>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vs-tabs color="primary">
                    <vs-tab color="primary" value="10" :label="'pendentes (' + 10 + ')'">
                        <div class="com-item" v-if="items.length > 0">
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
                            <!--<vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>-->
                        </div>
                        <div class="vx-row mt-20 flex justify-center" v-else>
                            <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                                <div class="w-8/12">
                                    <div v-if="dados.search === null">
                                        <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                        <p class="text-sem-item">
                                            Para inserir novos registros você <br> pode clicar em incluir conta.
                                        </p>
                                    </div>
                                    <div v-else>
                                        <p class="span-sem-item">Nenhum item foi encontrado</p>
                                        <p class="text-sem-item mt-6">
                                            Para inserir novos registros você <br> pode clicar em incluir conta.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vs-tab>
                    <vs-tab color="primary" value="10" :label="'com erro (' + 10 + ')'"></vs-tab>
                    <vs-tab color="primary" value="10" :label="'preenchida (' + 10 + ')'"></vs-tab>
                    <vs-tab color="primary" value="10" :label="'com expedição (' + 10 + ')'"></vs-tab>
                    <vs-tab color="primary" value="10" :label="'todos (' + 10 + ')'"></vs-tab>
                </vs-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import vSelect from 'vue-select'

    export default {
        name: "ListEntrega",
        components: {
            'v-select': vSelect
        },
        data(){
            return {
                dados: {},
                items: [{
                    id: 1
                }],
            }
        }
    }
</script>

<style scoped>

</style>