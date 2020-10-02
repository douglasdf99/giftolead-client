<template>
    <div>
        <div class="vx-row my-6">
            <div class="vx-col w-full mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="$router.push({path: '/configuracoes/funcoes/criar'})">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Função
                </vs-button>
            </div>
        </div>
        <nenhum-registro text="Nenhum registro encontrado" v-if="items.length === 0"/>
        <vs-table v-else :data="items" class="table-items">
            <template slot="thead">
                <vs-th class="w-2/12"></vs-th>
                <vs-th>Nome</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td class="flex justify-center items-center">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="$router.push({path: '/configuracoes/funcoes/editar/' + tr.id})">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>
                        <p>{{tr.nome}}</p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import OptionFuncoes from '../components/OptionsFuncoes'
import moduleFuncoes from "@/store/funcoes/moduleFuncoes";
import NenhumRegistro from "@/views/components/NenhumRegistro";

export default {
    name: 'Funcoes',
    components: {
        NenhumRegistro,
        'v-select': vSelect,
        'option-funcoes': OptionFuncoes,
    },
    data() {
        return {
            items: [],
        }
    },
    computed: {},
    created() {
        if (!moduleFuncoes.isRegistered) {
            this.$store.registerModule('funcoes', moduleFuncoes)
            moduleFuncoes.isRegistered = true
        }

        this.$vs.loading();
        this.getItems();
    },
    mounted() {
    },
    methods: {
        getItems() {
            this.$store.dispatch('funcoes/get').then(response => {
                console.log('olha elas aí', response);
                this.items = response;
                this.$vs.loading.close();
            });
        },
        calcelar() {
            this.$router.push({name: 'configuracoes-geral'})
        },
    }
}
</script>
