<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-center lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <label class="destaque">Selecione o produto</label>
                        <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="false" class="bg-white"
                                  :options="produtos"/>
                    </div>
                </div>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-10 sem-item" v-if="items.length === 0">
                  <nenhum-registro></nenhum-registro>
                </div>
                <div class="com-item mt-10" v-else>
                    <vx-card :key="link.id" class=" mb-1 unsetshadow-setborder p-0" v-for="link in items">
                        <div class="vx-row">
                            <div class="vx-col sm:w-8/12 w-full">
                                <p class="mb-0 text-base font-bold pl-4 pt-2 "> {{ link.descricao }}</p>
                            </div>
                            <div class="vx-col sm:w-4/12 w-full">
                                <div class="vx-col w-full relative py-0">
                                    <vx-input-group v-if="getlink(link)">
                                        <vs-input :value="getlink(link)" disabled/>
                                        <template slot="append">
                                            <div class="append-text btn-addon">
                                                <vs-button color="black" type="border" @click="copyText(getlink(link))"><i class="material-icons icone-input">file_copy</i></vs-button>
                                                <vs-button color="black" type="border" @click="goto(getlink(link))"><i class="material-icons icone-input">trending_flat</i></vs-button>
                                            </div>
                                        </template>
                                    </vx-input-group>
                                    <vs-button color="primary" type="flat" @click="gerarLink(link)" v-else><span class="font-bold">Gerar Link</span></vs-button>
                                </div>
                            </div>
                        </div>
                        <!-- end row -->
                    </vx-card>
                    <vs-pagination class="mt-10" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import SideBar from './SideBar'
import moduleProdutos from '@/store/produtos/moduleProdutos.js'
import moduleLinks from '@/store/links/moduleLinks.js'
import vSelect from 'vue-select'
import NenhumRegistro from "../components/NenhumRegistro";

export default {
    name: "Index",

    components: {NenhumRegistro, SideBar, 'v-select': vSelect},

    data() {
        return {
            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            routeTitle: 'Contas',
            produto: {},
            selectedProduto: {id: null, label: 'Selecione um produto'},
            produtos: [],
            dados: {
                search: '',
                page: 1
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            currentx: 1
            //items: {}
        }
    },
    created() {
        this.$vs.loading()
        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos)
            moduleProdutos.isRegistered = true
        }
        if (!moduleLinks.isRegistered) {
            this.$store.registerModule('links', moduleLinks)
            moduleLinks.isRegistered = true
        }
        this.dados.produto = this.$route.params.id;
        //this.getProduto(this.$route.params.id);
        this.getOpcoes();
        this.getItems();

    },
    methods: {
        getOpcoes() {
            //Produtos
            this.$store.dispatch('produtos/get').then(response => {
                let arr = [...response];
                arr.forEach(item => {
                    this.produtos.push({id: item.id, label: item.nome})
                    if (item.id == this.$route.params.id) {
                        this.selectedProduto = {id: item.id, label: item.nome}
                    }
                });
            });
        },
        getProduto(id) {
            this.$store.dispatch('produtos/getId', id).then(data => {
                this.produto = {...data};
            })
        },
        getlink(item) {
            let link = '';
            let user = JSON.parse(localStorage.getItem("userInfo"));
            item.linksexternos.forEach(ext => {
                if (ext.user_id == user.uid) {
                    link = 'https://svlds.me/' + ext.codigo;
                }
            });
            return link;
        },
        meulink() {

        },
        copyText(text) {
            const thisIns = this;
            this.$copyText(text).then(function () {
                thisIns.$vs.notify({
                    title: 'Success',
                    text: 'URL copiada para sua área de transferência',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                })
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar link',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                })
            })
        },
        goto(text) {
            window.open(text, '_blank');
        },
        gerarLink(link) {
            let data = {};
            data.codigo_id = link.identidade;
            this.$store.dispatch('links/gerarlink', data).then(() => {
                this.$vs.notify({
                    color: 'success',
                    title: 'Sucesso',
                    text: 'O link foi gerado com sucesso'
                });
                this.getItems();
            }).catch(erro => {
                console.log(erro)
                this.$vs.notify({
                    color: 'danger',
                    title: 'Erro',
                    text: 'Algo deu errado ao gerar o link. Contate o suporte.'
                })
            })
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        getItems() {
            this.$vs.loading();
            this.$store.dispatch('getVarios', {rota: 'links', params: this.dados}).then(response => {
                this.pagination = response;
                this.$vs.loading.close()
            });
        },
        deletar(id) {
            this.$vs.dialog({
                color: 'danger',
                title: `Deletar origem id: ${id}`,
                text: 'Deseja deletar esta Origem? Procedimento irreversível',
                acceptText: 'Sim, deletar!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('deleteItem', {id: id, rota: 'links'}).then(() => {
                        this.$vs.notify({
                            color: 'success',
                            title: 'Sucesso',
                            text: 'A Origem foi deletada com sucesso'
                        });
                        this.getItems();
                    }).catch(erro => {
                        console.log(erro)
                        this.$vs.notify({
                            color: 'danger',
                            title: 'Erro',
                            text: 'Algo deu errado ao deletar a conta. Contate o suporte.'
                        })
                    })
                }
            })
        },
        pesquisar(e) {
            e.preventDefault();
            this.$vs.loading();
            this.getItems();
        }
    },
    watch: {
        currentx(val) {
            this.$vs.loading();
            console.log('val', val);
            this.dados.page = this.currentx;
            this.getItems();
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
        },
        selectedProduto: function (val) {
            console.log('val', val);
            this.dados.produto = val.id;
            this.getProduto(val.id);
            this.getItems();
        },
    },

    computed: {
        items() {
            return this.$store.state.items;
        }
    },

}
</script>
<style scoped>
[dir] .vx-card .vx-card__collapsible-content .vx-card__body {
    padding: 0.8rem;
}

.unsetshadow-setborder {
    border: unset;
}

.unsetshadow-setborder:hover {
    border: unset;
    filter: brightness(0.95);
}

.btn-addon:active {
    color: #333333;
}

.vs-button-border.isActive .icone-input {
    color: #333333 !important;
}
</style>
