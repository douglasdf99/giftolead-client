<template>
    <div>
        <side-bar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
        <vs-row class="mb-3">
            <vs-col vs-w="5">
                <vs-col vs-type="flex">
                    <vs-input type="text" placeholder="Pesquisar por contas" class="w-full"/>
                    <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search" class="btn-search"></vs-button>
                </vs-col>
            </vs-col>
            <vs-col vs-w="2" vs-offset="5" class="relative">
                <vs-button color="primary" type="filled" class="btn-incluir" @click="addNewData">Incluir conta</vs-button>
                <img src="@/assets/images/util/check-incluir.svg" class="check-incluir">
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-w="12">
                <div class="sem-item">
                    <img src="@/assets/images/util/sem-item-cadastrado.png">
                    <p class="text-sem-item">
                        Para inserir novos registros você <br> pode clicar em incluir conta.
                    </p>
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
        data(){
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
            }
        },
        created(){
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }
        },
        methods: {
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            }
        }
    }
</script>

<style scoped>

</style>