<template>
    <div>
        <!--<div class="vx-row flex items-center lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        &lt;!&ndash; SEARCH INPUT &ndash;&gt;
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large"
                                      placeholder="Pesquisar por nome"/>
                            &lt;!&ndash; SEARCH LOADING &ndash;&gt;
                            &lt;!&ndash; SEARCH ICON &ndash;&gt;
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                &lt;!&ndash;<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />&ndash;&gt;
                            </div>
                        </form>
                    </div>

                </div>
                &lt;!&ndash; SEARCH INPUT &ndash;&gt;
            </div>
        </div>-->
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <p class="span-sem-item">Nenhuma notificação encontrada</p>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="com-item mt-10" v-else>
                    <div class="vx-row bg-white p-4 rounded-lg w-full my-3 lg:w-8/12 mx-auto" v-for="ntf in paginados">
                        <div class="vx-col w-1/12 flex justify-center">
                            <vs-icon :icon="ntf.data.icon" icon-pack="material-icons" class="icon-grande text-xl" v-bind:class="`text-${ntf.data.category}`"
                                     :svgClasses="[`text-${ntf.data.category}`, 'stroke-current mr-1 h-6 w-6']"></vs-icon>
                        </div>
                        <div class="vx-col w-3/12">
                            <span class="font-medium block notification-title" :class="[`text-${ntf.data.category}`]">{{ ntf.data.title }}</span>
                        </div>
                        <div class="vx-col w-4/12">
                            <small>{{ ntf.data.message }}</small>
                        </div>
                        <div class="vx-col w-4/12 text-right">
                            {{ elapsedTime(ntf.data.time) }}
                        </div>
                    </div>
                    <div class="vx-row mt-10" v-if="paginados.length != items.length">
                        <div class="vx-col w-full text-center">
                            <vs-button @click="carregarMais" color="primary" size="medium" class="font-bold">Carregar mais</vs-button>
                        </div>
                    </div>
                    <!--<vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>-->
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import moduleNotificacoes from "@/store/notificacoes/moduleNotificacoes";

export default {
    name: "Index",
    data() {
        return {
            dados: {
                search: '',
                page: 1
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            items: [],
            count: 10,
            currentx: 1
            //items: {}
        }
    },
    created() {
        this.$vs.loading()
        if (!moduleNotificacoes.isRegistered) {
            this.$store.registerModule('notificacoes', moduleNotificacoes)
            moduleNotificacoes.isRegistered = true
        }

        this.getItems();
    },
    methods: {
        getItems() {
            this.$vs.loading();
            this.$store.dispatch('notificacoes/getAll', this.dados).then(response => {
                this.items = response;
                //this.dados.page = this.pagination.current_page
            }).catch(erro => {
                console.log('erro', erro.response);
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        carregarMais(){
            this.count += 10;
        }
    },
    computed: {
        paginados(){
            let arr = [];
            for(let i = 0; i <= this.count; i++){//Inserindo os primeiros 10
                if(this.items[i])
                    arr.push(this.items[i]);
            }
            return arr;
        }
    }
}
</script>
