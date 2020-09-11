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
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items">
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
    </div>
</template>

<script>
    export default {
        name: "ListComissoes",
        props: ['items'],
        data() {
            return {
                selecteds: []
            }
        },
        created() {
            console.log('items', this.items);
        },
        methods: {
            handleSelected(tr) {
                console.log(tr)
            }
        }
    }
</script>

<style scoped>

</style>