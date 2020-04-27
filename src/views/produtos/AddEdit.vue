<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome do produto</span>
                <vs-input class="w-full" v-model="produto.nome" size="large"/>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Conta atribuída no Hotmart</span>
                <vs-select v-validate="'required'" v-model="contaSelected" name="conta"
                           class="select-large-produto w-full">
                    <!--<vs-select-item :key="index" :value="item.id" :text="item.label" v-for="(item,index) in opcoesIntegracao" />-->
                    <vs-select-item key="1" value="1" text="MBR Editora"/>
                </vs-select>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Preço</span>
                <vs-input class="w-full" v-model="produto.preco" size="large"/>
            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <span class="font-regular mb-2">Código ID do produto no Hotmart</span>
                <vs-input class="w-full" v-model="produto.cod_produto"
                          size="large"/>
            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <vs-input label="REF produto no checkout" class="w-full" v-model="produto.referencia" size="large"/>
            </div>
        </div>
        <vx class="vx-row mb-20">
            <div class="vx-col w-full mb-4">
                <span>Escolha uma cor para mostrar o produto nas telas</span>
            </div>
            <div class="vx-col w-full">
                <ul class="clearfix">
                    <li class="w-10 cursor-pointer h-10 rounded-lg m-2 float-left" v-for="cor in cores"
                        :style="{backgroundColor: cor}"></li>
                </ul>
            </div>
        </vx>
        <vs-divider class="mb-20"/>
        <div class="vx-row mb-20">
            <div class="vx-col w-full lg:w-1/2">
                <h2 class="subtitulo">Configurar comissão de venda para este produto</h2>
            </div>
            <div class="vx-col w-full lg:w-1/2 mb-6">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="configComissao" class="float-right switch"/>
            </div>
            <div class="vx-col w-full lg:w-full" v-if="configComissao">
                <div class="vx-row">
                    <div class="vx-col w-full lg:w-1/2">
                        <span class="span-padrao">Tipo de Comissão</span>
                        <ul class="list-tipo-comissao mt-5">
                            <li class="my-3">
                                <vs-radio color="dark" v-model="produto.comissao_tipo" vs-value="individual">
                                    Individual
                                </vs-radio>
                            </li>
                            <li>
                                <vs-radio color="dark" v-model="produto.comissao_tipo" vs-value="partilhada">
                                    Partilhada
                                </vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <vs-divider class="mb-20"/>
        <div class="vx-row mb-20 flex items-center">
            <div class="vx-col w-full mb-4">
                <h2 class="subtitulo">Url de integração com o Hotmart</h2>
            </div>
            <div class="vx-col w-full lg:w-10/12">
                <vs-input class="w-full" size="large"></vs-input>
            </div>
            <div class="vx-col w-full lg:w-2/12">
                <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"/>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="relative">
                </div>
                <div class="container">
                    <div class="vx-row mb-2 relative">
                        <div class="seta-footer" style="">
                            <feather-icon icon="CornerLeftUpIcon" svgClasses="stroke-current text-dark-50 w-6 h-6"
                                          class="ml-2"/>
                        </div>
                        <vs-button class="mr-3" color="primary" type="filled" @click="salvar">Salvar</vs-button>
                        <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle">Cancelar
                        </vs-button>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'

    export default {
        name: "Edit",
        components: {
            'v-select': vSelect
        },
        data() {
            return {
                produto: {
                    cor: '',
                    comissao_tipo: 'individual'
                },
                contaSelected: null,
                cores: ['#21BC9C', '#1EA085', '#2FCC70', '#28AF60', '#3598DB', '#2B80B9', '#A463BF', '#8E43AD',
                    '#3D556E', '#222F3D', '#F2C512', '#F39C1A', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8'],
                configComissao: true
            }
        },
        methods: {
            salvar() {
                return true;
            }
        }
    }
</script>

<style>
    [dir] .con-select .vs-select--input {
        padding: 1.4rem 2rem !important;
    }

    .list-tipo-comissao .vs-radio--label{
        font-weight: 600;
        margin-left: 2rem;
    }
</style>