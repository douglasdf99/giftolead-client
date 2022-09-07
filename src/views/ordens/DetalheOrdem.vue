<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Valores a comissionar</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row mb-5 flex items-center">
                    <div class="vx-col w-1/2">
                        <img :src="get_img_cdn(empresa.logo)" width="35%" class="mx-5"/>
                    </div>
                    <div class="vx-col w-1/2 text-right">
                        <p class="font-bold text-2xl">Ordem: {{data.id}}</p>
                        <p>Data: <b>{{data.created_at | formatDateTime}}</b></p>
                        <vs-chip class="text-white text-lg float-right mt-3" v-bind:class="{'bg-success' : data.pago, 'bg-warning' : !data.pago}">{{data.pago ? 'pago' : 'pendente'}}</vs-chip>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full lg:w-1/2">
                        <div class="flex items-center">
                            <p class="font-bold text-dark tex t-xl">{{data.user.name}}</p>
                        </div>
                        <p class="mt-4">{{empresa.descricao}}</p>
                    </div>
                </div>
                <div class="vx-row my-5 mt-10">
                    <div class="vx-col w-full">
                        <vs-table :data="listaComissao" class="table-items">

                            <template slot="thead">
                                <vs-th>Item</vs-th>
                                <vs-th>Quantidade</vs-th>
                                <vs-th>Ticket médio</vs-th>
                                <vs-th>Comissão</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr" v-bind:class="{'row-table-disabled': true}">
                                    <vs-td>
                                        Produto: {{ tr.nome }} <br/>
                                        Motivo: {{ tr.motivo }}
                                    </vs-td>
                                    <vs-td :data="tr.updated_at">
                                        {{ tr.quantidade }}
                                    </vs-td>
                                    <vs-td>
                                        R$ {{ formatPrice( tr.valor / tr.quantidade) }}
                                    </vs-td>
                                    <vs-td class="font-bold">
                                        R$ {{ formatPrice(tr.valor) }}
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
                <div class="vx-row flex items-center mt-5">
                    <div class="vx-col w-full lg:w-1/2">
                        <p class="text-gray text-sm">
                            Notas: {{empresa.rodape}}
                        </p>
                    </div>
                    <div class="vx-col w-full lg:w-1/2">
                        <h3 class="float-right text-right">Valor Total: <b>R$ {{somaComissao}}</b></h3>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6 text-lg flex items-center" color="primary" @click="imprimir(data.id)">
                Imprimir Ordem
            </vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import axios from "@/axios";

    export default {
        props: {
            isSidebarActive: {
                type: Boolean,
                required: true
            },
            data: {
                type: Object,
                default: () => {
                },
            },
            empresa: {
                type: Object,
                default: () => {
                },
            },
        },
        data() {
            return {};
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive;
                },
                set(val) {
                    if (!val) {
                        this.$emit('closeSidebar');

                    }
                }
            },
            somaComissao() {
                let soma = 0.0;
                this.data.comissaos.forEach(item => {
                    soma += parseFloat(item.valor);
                });
                return this.formatPrice(soma);
            },
            listaComissao() {
                let nomes = [];
                this.data.comissaos.forEach(item => {
                    nomes.push(item.produto.nome);
                });
                let prods = [...new Set(nomes)];
                let arrFinal = [];
                prods.forEach(prod => {
                    let quantidadeAtendimento = 0;
                    let valorAtendimento = 0;
                    let quantidadInsercao = 0;
                    let valorInsercao = 0;
                    this.data.comissaos.forEach(item => {
                        if (item.produto.nome == prod) {
                            if (item.natureza == 'Atendimento') {
                                quantidadeAtendimento++;
                                valorAtendimento += parseInt(item.valor);
                            } else {
                                quantidadInsercao++;
                                valorInsercao += parseInt(item.valor);
                            }
                        }
                    });
                    let insercaoProduto = {
                        'nome': prod,
                        'motivo': 'Inserção',
                        'valor': valorInsercao,
                        'quantidade': quantidadInsercao,
                    };
                    let atendimentoProduto = {
                        'nome': prod,
                        'motivo': 'Atendimento',
                        'valor': valorAtendimento,
                        'quantidade': quantidadeAtendimento,
                    };
                    if (quantidadInsercao > 0)
                        arrFinal.push(insercaoProduto);

                    if (quantidadeAtendimento > 0)
                        arrFinal.push(atendimentoProduto);
                });
                return arrFinal;
            }
        },
        methods: {
            getResponsavel(val) {
                switch (val) {
                    case 'App\\Models\\PreComissao':
                        return 'Pré Comissão';
                    default:
                        return val;
                }
            },
            somaConquistas(val) {
                let valor = 0;
                val.forEach((item) => {
                    valor += parseFloat(item.valor);
                });
                return valor;
            },
            imprimir(id) {
                this.$vs.loading();
                let ids = [id];

                axios.get(`/ordems/imprimir`, {params: {ids: ids}, responseType: 'arraybuffer'})
                    .then((response) => {
                        var blob = new Blob([response.data], {
                            type: 'application/pdf'
                        });
                        var url = window.URL.createObjectURL(blob);
                        window.open(url);
                        this.$vs.loading.close();
                    });
            }
        },
        components: {
            VuePerfectScrollbar,
        },
    };
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
            z-index: 52010;
        }

        ::v-deep .vs-sidebar {
            z-index: 52010;
            width: 750px;
            max-width: 90vw;

            .img-upload {
                margin-top: 2rem;

                .con-img-upload {
                    padding: 0;
                }

                .con-input-upload {
                    width: 100%;
                    margin: 0;
                }
            }
        }
    }

    .scroll-area--data-list-add-new {
        // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
        height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
    }
</style>

<style>
    .vs-sidebar--background {
        background: rgba(0, 0, 0, .2) !important;
    }
</style>
