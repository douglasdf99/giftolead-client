<template>
    <div>
        <side-bar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
        <vs-row class="mb-3">
            <vs-col vs-w="5">
                <vs-col vs-type="flex">
                    <vs-input type="text" placeholder="Pesquisar por contas" class="w-full"/>
                    <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search"
                               class="btn-search"></vs-button>
                </vs-col>
            </vs-col>
            <vs-col vs-w="2" vs-offset="5" class="relative">
                <vs-button color="primary" type="filled" class="btn-incluir" @click="addNewData">Incluir conta
                </vs-button>
                <img :src="url_api('images/check-incluir.svg') " class="check-incluir">
                <!--<img src="@/assets/images/util/check-incluir.svg" >-->
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-w="12">
                <div class="sem-item" v-show="items.length === 0">
                    <img :src="url_api('images/sem-item-cadastrado.png')">
                    <p class="text-sem-item">
                        Para inserir novos registros você <br> pode clicar em incluir conta.
                    </p>
                </div>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                            <vs-th>Nome</vs-th>
                            <vs-th>Token</vs-th>
                            <vs-th></vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>

                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].token }}
                                </vs-td>

                                <vs-td class="flex justify-center items-center">
                                    <vs-dropdown>
                                        <vs-button radius color="#EDEDED" type="filled" class="btn-more-icon"
                                                   icon-pack="feather" icon="icon-more-horizontal"></vs-button>
                                        <vs-dropdown-menu>
                                            <vs-dropdown-item @click="updateData(data[indextr])">
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
                            </vs-tr>
                        </template>

                    </vs-table>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import moduleContas from '@/store/contas/moduleContas.js'

    export default {
        name: "Index",
        components: {SideBar},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }

            this.getContas();
        },
        methods: {
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getContas() {
                this.$store.dispatch('getVarios', 'contas').then(() => {
                    console.log('retornado com sucesso', this.items)
                    this.$vs.loading.close()
                });
            }
        },
        computed: {
            items() {
                return this.$store.state.items;
            }
        }
    }
</script>
