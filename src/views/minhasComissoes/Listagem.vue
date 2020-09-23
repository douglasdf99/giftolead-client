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
        <div v-else class="vx-row bg-white p-4 my-5 rounded-lg" v-for="item in items">
            <div class="vx-col w-3/12">
                <p>{{ item.id }}</p>
                <p class="destaque text-lg">{{ item.ticket.lead.nome }}</p>
                <vs-chip :color="item.lead_produto.produto.cor || ''">{{ item.lead_produto.produto.nome }}</vs-chip>
            </div>
            <div class="vx-col w-3/12">
                <p class="mt-2">comissão</p>
                <p class="preco">R$ {{ formatPrice(item.comissao_criador + item.comissao_atendente) }}</p>
            </div>
            <div class="vx-col w-3/12">
                <p class="mt-2">{{ item.ticket.lead.email }}</p>
                <p class="font-bold">{{ item.ticket.lead.ddd + item.ticket.lead.telefone | VMask('(##) ####-####') }}</p>
            </div>
            <div class="vx-col w-1/12 flex items-center justify-center">
                <vx-tooltip position="top" :text="item.anexos.length > 0 ? 'Anexar mais imagens' : 'Anexar imagens'">
                    <vs-icon icon-pack="material-icons" :icon="item.anexos.length > 0 ? 'attach_file' : 'publish'" @click="item.action = 1;$emit('updateData', item);"
                             class="icon-grande font-bold mx-3 cursor-pointer text-black"></vs-icon>
                </vx-tooltip>
                <vx-tooltip position="top" text="Visualizar">
                    <vs-icon icon-pack="material-icons" icon="visibility" @click="item.action = 2;$emit('updateData', item);"
                             class="icon-grande font-bold mx-3 cursor-pointer text-black"></vs-icon>
                </vx-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Listagem",
    props: ['items', 'tipo', 'colorx'],
    data() {
        return {
            currentx: 1,
        }
    },
    methods: {
        nameCriador(obj) {
            switch (obj.criador_type) {
                case 'App\\Models\\Users':
                    return obj.criador.name;
                default:
                    return obj.criador.nome;
            }
        }
    }
}
</script>

<style scoped>
.linha {
    transition-duration: .2s;
}

.linha:hover {
    background-color: transparent !important;
    transition-duration: .2s;
}

.img-criador:hover {
    z-index: 5000 !important;
}

.clicavel:hover {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
}
</style>