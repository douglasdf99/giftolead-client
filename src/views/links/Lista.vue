<template>
   <div>
      <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                :data="sidebarData"/>
      <div class="vx-row">
         <div class="vx-col w-full  mb-10">
            <h4 class="text-black">Produto: {{ produto.nome }}
               <vs-button color="#423b3b" class="float-right botao-incluir" type="filled" @click="voltar">
                  <vs-icon icon-pack="material-icons" icon="keyboard_backspace" class="icon-grande"></vs-icon>
                  Voltar
               </vs-button>
            </h4>
            <!-- <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="false" class="bg-white"
                       :options="produtos"/>-->
         </div>
         <vx-card class="mb-10 unsetshadow-setborder">
            <div class="vx-row">
               <div class="vx-col sm:w-1/12 w-full">
                  <span class="rounded-full bg-primary py-2 px-2 text-enum text-white font-bold"><i
                     class="material-icons">star</i></span>
               </div>
               <div class="vx-col sm:w-1/12 w-full py-2 px-2">
                  <p class="mb-0 text-base font-bold">Checkout:</p>
               </div>
               <div class="vx-col sm:w-10/12 w-full py-2 px-2">
                  <p class="mb-0 text-base font-bold text-dark-50">{{
                        produto.conta.integracao.checkout_base
                     }}{{ produto.checkout }}</p>
               </div>
            </div>
            <!-- end row -->
         </vx-card>
      </div>
      <div class="vx-row flex items-center" v-if="$acl.check('configuracao_link_incluir')">
         <div class="vx-col w-full ">
            <div class="flex justify-center align-center">
               <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                  <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                  Adicionar variável de link
               </vs-button>
               <!-- SEARCH INPUT -->
            </div>
            <!-- SEARCH INPUT -->
         </div>
      </div>
      <vs-row>
         <vs-col vs-w="12">
            <div class="com-item mt-20" v-show="items.length > 0">
               <vx-card :key="link.id" class="mb-1 unsetshadow-setborder bg-card-gray" v-for="link in items">
                  <div class="vx-row items-center">
                     <div class="vx-col sm:w-1/12 w-full mb-2 text-center"
                          v-if="$acl.check('configuracao_link_editar') || $acl.check('configuracao_link_deletar')">
                        <vs-dropdown vs-trigger-click>
                           <vs-button radius color="#423b3b" type="filled"
                                      class="btn-more-icon relative botao-menu"
                                      icon-pack="material-icons" icon="more_horiz"
                           ></vs-button>
                           <vs-dropdown-menu class="dropdown-menu-list">
                              <span class="span-identifica-item-dropdown">Nº {{ link.id }}</span>
                              <vs-dropdown-item @click="updateData(link.id)"
                                                v-if="$acl.check('configuracao_link_editar')">
                                 <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                 Editar
                              </vs-dropdown-item>

                              <vs-dropdown-item @click="deletar(link.id)"
                                                v-if="$acl.check('configuracao_link_deletar')">
                                 <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                 Deletar
                              </vs-dropdown-item>

                           </vs-dropdown-menu>
                        </vs-dropdown>

                     </div>
                     <div class="vx-col sm:w-3/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">Descrição </p>
                        {{ link.descricao }}
                     </div>
                     <div class="vx-col sm:w-3/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">SRC</p>
                        {{ link.src }}
                     </div>
                     <div class="vx-col sm:w-2/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">Oferta</p>
                        {{ link.codigo_oferta }}
                     </div>
                     <div class="vx-col sm:w-2/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">Parcelas</p>
                        <span class="font-15 font-weight-bold">{{ link.split }}x</span>
                     </div>
                     <div class="vx-col sm:w-1/12 w-full">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande mx-auto my-auto"
                                 :class="`text-${link.status == 1 ? 'success' : 'dark'}`"></vs-icon>
                     </div>
                  </div>
                  <!-- end row -->
               </vx-card>

            </div>
         </vs-col>
      </vs-row>
   </div>
</template>

<script>
import SideBar from './SideBar';
import moduleProdutos from '@/store/produtos/moduleProdutos.js';
import vSelect from 'vue-select';

export default {
   name: "Index",

   components: {SideBar, 'v-select': vSelect,},
   data() {
      return {
         // Data Sidebar
         addNewDataSidebar: false,
         sidebarData: {},
         routeTitle: 'Contas',
         produto: {},
         selectedProduto: null,
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
      };
   },
   created() {
      this.$vs.loading();
      if (!moduleProdutos.isRegistered) {
         this.$store.registerModule('produtos', moduleProdutos);
         moduleProdutos.isRegistered = true;
      }
      this.dados.produto = this.$route.params.id;
      this.getProduto(this.$route.params.id);
      this.getOpcoes();
      // this.getItems();

   },
   mounted() {

      /*   Echo.channel('lista-ticket')
           .listen('ListaTicket',(e) => {
             this.getProjects();
           });*/
   },
   methods: {
      getOpcoes() {
         //Produtos
         this.$store.dispatch('produtos/get').then(response => {
            let arr = [...response];
            arr.forEach(item => {
               this.produtos.push({id: item.id, label: item.nome});
               if (item.id == this.$route.params.id) {
                  this.selectedProduto = {id: item.id, label: item.nome};
               }
            });
         });
      },
      getProduto(id) {
         this.$store.dispatch('produtos/getId', id).then(data => {
            this.produto = {...data};
         });
      },
      voltar() {
         this.$router.push({name: 'links'});
      },
      addNewData() {
         this.$router.push({name: 'links-produto-criar',params:{id: this.produto.id}});
      },
      updateData(id) {
         this.$router.push({name: 'links-produto-editar',params:{id: this.produto.id, link:id }});
      },
      toggleDataSidebar(val = false) {
         this.addNewDataSidebar = val;
      },
      getItems() {
         this.$vs.loading();
         this.$store.dispatch('getVarios', {rota: 'links', params: this.dados}).then(response => {
            this.pagination = response;
            this.$vs.loading.close();
         });
      },
      deletar(id) {
         this.$vs.dialog({
            color: 'danger',
            title: `Deletar Item`,
            text: 'Deseja deletar este Item? Procedimento irreversível',
            acceptText: 'Sim, deletar!',
            accept: () => {
               this.$vs.loading();
               this.$store.dispatch('deleteItem', {id: id, rota: 'links'}).then(() => {
                  this.$vs.notify({
                     color: 'success',
                     title: 'Sucesso',
                     text: 'O item foi deletada com sucesso'
                  });
                  this.getItems();
               }).catch(() => {
                  this.$vs.notify({
                     color: 'danger',
                     title: 'Erro',
                     text: 'Algo deu errado ao deletar o item. Contate o administrador.'
                  });
               });
            }
         });
      },
      pesquisar(e) {
         this.dados.page = 1;
         e.preventDefault();
         this.$vs.loading();
         this.getItems();
      }
   },
   watch: {
      currentx() {
         this.$vs.loading();
         this.dados.page = this.currentx;
         this.getItems();
      },
      "$route"() {
         this.routeTitle = this.$route.meta.pageTitle;
      },
      selectedProduto: function (val) {
         this.$router.push({name: 'links-produto',params:{id: val.id}});
         this.dados.produto = val.id;
         this.getProduto(val.id);
         this.getItems();
      },
   },

   computed: {

      items() {
         return this.$store.state.items;
      },
      /*pagination() {
          return this.$store.state.pagination;
      },*/
   },

};
</script>
<style scoped>
.botao-menu {
   color: #FFFFFF;
}
</style>
