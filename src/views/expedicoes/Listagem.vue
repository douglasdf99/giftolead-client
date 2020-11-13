<template>
    <div>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" v-if="tipo != 'aprovado'" class="table-items">
            <template slot="thead">
                <vs-th v-if="tipo == 'pendente'"></vs-th>
                <vs-th>Número</vs-th>
                <vs-th>Número de Objetos</vs-th>
                <vs-th>Brinde</vs-th>
                <vs-th>Peso Bruto (Kg)</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center">
                        <vs-dropdown vs-trigger-click v-if="checkPerm">
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="$router.push({path: `/brindes/expedicoes/${tr.id}`})" v-if="$acl.check('brinde_expedicao_detalhar')">
                                    <vs-icon icon-pack="material-icons" icon="visibility"></vs-icon>
                                    Detalhar Expedição
                                </vs-dropdown-item>
<!--                                <vs-dropdown-item @click="$emit('editar', tr)" v-if="!tr.fechado && $acl.check('brinde_expedicao_editar')">-->
<!--                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>-->
<!--                                    Editar-->
<!--                                </vs-dropdown-item>-->
<!--                                <vs-dropdown-item @click="$emit('deletar', tr)" v-if="$acl.check('brinde_expedicao_deletar')">-->
<!--                                    <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>-->
<!--                                    Deletar-->
<!--                                </vs-dropdown-item>-->
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>{{ tr.automacaos.length }}</vs-td>
                    <vs-td>{{ tr.automacaos.length }}</vs-td>
                    <vs-td>
                        <vs-chip color="primary" class="text-md py-2 font-bold">
                            {{ tr.brinde.nome }}
                        </vs-chip>
                    </vs-td>
                    <vs-td v-if="tr.brinde.hasembalagem">{{ tr.brinde.peso * tr.automacaos.length}}</vs-td>
                    <vs-td v-else>{{ tr.brinde.peso * tr.automacaos.length}}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande text-warning" v-if="!tr.fechado"></vs-icon>
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande text-success" v-else></vs-icon>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-table :data="items" class="table-items" v-else>
            <template slot="thead">
                <vs-th v-if="tipo == 'pendente'"></vs-th>
                <vs-th>Número</vs-th>
                <vs-th>Número de Objetos</vs-th>
                <vs-th>Brinde</vs-th>
                <vs-th>Peso Bruto (Kg)</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center" v-if="tipo == 'pendente'">
                        <vs-dropdown vs-trigger-click v-if="$acl.check('brinde_expedicao_gerarplp') || $acl.check('brinde_expedicao_editar') || $acl.check('brinde_expedicao_deletar')">
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="$emit('gerarPlp', tr)" v-if="$acl.check('brinde_expedicao_gerarplp')">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Gerar PLP
                                </vs-dropdown-item>
                                <vs-divider></vs-divider>
                                <vs-dropdown-item @click="$emit('editar', tr)" v-if="$acl.check('brinde_expedicao_editar')">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="$emit('deletar', tr)" v-if="$acl.check('brinde_expedicao_deletar')">
                                    <vs-icon icon-pack="material-icons" icon="trash"></vs-icon>
                                    Deletar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td>25</vs-td>
                    <vs-td>{{ tr.automacaos.length }}</vs-td>
                    <vs-td>
                        <vs-chip color="primary" class="text-md py-2 font-bold">
                            {{ tr.brinde.nome }}
                        </vs-chip>
                    </vs-td>
                    <vs-td>{{ tr.brinde.peso }}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="icon-grande" v-bind:style="{color: tr.fechado ? 'success' : 'warning'}"></vs-icon>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <transition name="fade" v-if="selecteds.length > 0">
            <footer-doug>
                <div class="vx-col sm:w-2/12 mb-2">
                    <p class="float-left mt-3 mr-4 text-lg">Peso Total: {{somaPesoTotal}}</p>
                </div>
                <div class="vx-col sm:w-9/12 mb-2">
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="$emit('fecharVarias', selecteds, 'fechar', tipo)"
                               v-if="tipo == 'pendente'" :disabled="!$acl.check('brinde_expedicao_gerarplp')">
                        Fechar Expedições
                    </vs-button>
                    <p class="float-right mt-3 mr-4 text-lg">{{ selecteds.length }} selecionadas</p>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
export default {
    name: "Listagem",
    props: ['items', 'tipo'],
    data() {
        return {
            selecteds: []
        }
    },
    methods: {
        handleSelected(tr) {},
        checkPerm() {
            return this.$acl.check('brinde_expedicao_editar') || this.$acl.check('brinde_expedicao_detalhar') || this.$acl.check('brinde_expedicao_deletar')
        }
    },
    computed: {
        somaPesoTotal(){
            console.log('selecionados', this.selecteds);
            let soma = 0;
            this.selecteds.forEach((item, index) => {
                soma = item.brinde.peso * this.selecteds[index].automacaos.length;
            });
            return parseFloat(soma).toFixed(2).toString().replace(".", ",") + ' Kg'
        }
    }
}
</script>

<style scoped>

</style>
