<template>
    <div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                <div class="w-8/12">
                    <div>
                        <p class="span-sem-item">Nenhuma registro encontrado</p>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items" v-if="tipo == 'usuario'">
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex items-center">
                        <div class="flex items-center">
                            <img :src="get_img_api(tr.avatar)" width="50px" class="rounded-full mx-5" style="margin-left: -8%"/>
                            <p class="font-bold text-dark text-xl">{{tr.name}}</p>
                        </div>
                    </vs-td>
                    <vs-td>
                        <p class="preco">R$ {{getValComissao(tr.comissaos)}}</p>
                    </vs-td>
                    <vs-td class="td-icons">
                        <vx-tooltip position="top" text="Detalhar">
                            <vs-icon icon-pack="material-icons" icon="visibility" @click="$emit('visualizar', tr)"
                                     class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items" v-else>
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td>
                        <p>{{tr.id}}</p>
                        {{tr.user.name}}
                    </vs-td>
                    <vs-td>
                        <p class="preco">R$ {{formatPrice(tr.valor)}}</p>
                    </vs-td>
                    <vs-td class="td-icons">
                        <vx-tooltip position="top" text="Detalhar">
                            <vs-icon icon-pack="material-icons" icon="visibility" @click="$emit('visualizar', tr)"
                                     class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <transition name="fade" v-if="selecteds.length > 0">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="mr-3 float-left" color="primary" type="filled" @click="gerarOrdens" v-if="tipo == 'usuario'">
                        Gerar ordens
                    </vs-button>
                    <div class="float-right" v-if="tipo == 'usuario'">
                        <span class="font-bold text-2xl">R$ {{formatPrice(somaSelecionados)}}</span>
                        <p>valor total selecionado</p>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "ListComissoes",
        props: ['items', 'tipo'],
        data() {
            return {
                selecteds: [],
                ids: [],
            }
        },
        created() {
            console.log('items', this.items);
        },
        methods: {
            handleSelected(tr) {
            },
            getValComissao(arr) {
                let soma = 0;
                arr.forEach(item => {
                    soma = parseFloat(soma) + parseFloat(item.valor);
                });
                return this.formatPrice(parseFloat(soma));
            },
            gerarOrdens(){
                this.$vs.dialog({
                    color: 'primary',
                    title: 'Gerar ordens',
                    text: `Deseja gerar ordens a partir das comissões selecionadas?`,
                    acceptText: 'Sim',
                    accept: () => {
                        this.$emit('gerarOrdens', this.selecteds);
                        this.selecteds = [];
                    }
                })
            }
        },
        computed: {
            somaSelecionados() {
                let soma = 0;
                this.selecteds.forEach(obj => {
                    obj.comissaos.forEach(item => {
                        soma = parseFloat(soma) + parseFloat(item.valor);
                    });
                });

                return soma;
            }
        }
    }
</script>