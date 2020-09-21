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
        <vs-table v-model="selecteds" @selected="handleSelected" v-else :data="items" class="table-items" multiple>
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="w-2/12">
                        <vs-chip class="bg-primary p-2 text-white"># {{tr.id}}</vs-chip>
                    </vs-td>
                    <vs-td class="flex items-center">
                        <div class="flex items-center">
                            <img :src="get_img_api(tr.user.avatar)" width="40px" class="rounded-full mx-5" style="margin-left: -8%"/>
                            <p class="font-bold text-dark text-xl">{{tr.user.name}}</p>
                        </div>
                    </vs-td>
                    <vs-td class="w-2/12">
                        <p class="preco">R$ {{getValComissao(tr.comissaos)}}</p>
                    </vs-td>
                    <vs-td class="td-icons w-2/12">
                        <div class="flex items-center">
                            <vx-tooltip position="top" text="Detalhar">
                                <vs-icon icon-pack="material-icons" icon="visibility" @click="$emit('visualizar', tr)"
                                         class="icon-grande font-bold mx-3 cursor-pointer"></vs-icon>
                            </vx-tooltip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <transition name="fade" v-if="selecteds.length > 0">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="mr-3 float-left" color="primary" type="filled" @click="action('payOrdens')" v-if="tipo == 'pagar'">
                        Pagar ordens
                    </vs-button>
                    <vs-button class="mr-3 float-left" color="primary" type="filled" @click="action('unpayOrdens')" v-if="tipo == 'pago'">
                        Reverter ordens
                    </vs-button>
                    <vs-button class="mr-3 float-left" color="primary" type="filled" @click="imprimirPDF()">
                        Imprimir Ordens
                    </vs-button>
                    <div class="float-right">
                        <span class="font-bold text-2xl">R$ {{formatPrice(somaSelecionados)}}</span>
                        <p>valor total selecionado</p>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import axios from "@/axios.js"

    export default {
        name: "Listagem",
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
            action(method) {
                this.$vs.dialog({
                    color: 'primary',
                    title: method == 'payOrdens' ? 'Pagar' : 'Reverter' + ' ordens',
                    text: `Deseja ${method == 'payOrdens' ? 'pagar' : 'reverter'} estas ordens selecionadas?`,
                    acceptText: 'Sim',
                    accept: () => {
                        console.log('selecionados', this.selecteds, 'método', method);
                        this.$emit('action', {ids: this.selecteds, method: method});
                        this.selecteds = [];
                    }
                })
            },
            nameCriador(obj) {
                if (obj.origem_type == 'App\\Models\\User') return obj.origem.name; else return (obj.origem) ? obj.origem.nome : 'Sem origem';
            },
            imprimirPDF() {
                this.$vs.loading();
                let ids = this.selecteds.map(item => {
                    return item.id
                });

                axios.get(`/ordems/imprimir`, {params: {ids: ids}, responseType: 'arraybuffer'})
                    .then((response) => {
                        var blob = new Blob([response.data], {
                            type: 'application/pdf'
                        });
                        var url = window.URL.createObjectURL(blob);
                        window.open(url);
                        this.$vs.loading.close();
                    })
                    .catch((error) => {
                        console.log(error)
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

<style scoped>

</style>