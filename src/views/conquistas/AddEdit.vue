<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{conquista.ativo ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="conquista.ativo" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome do produto</span>
                <vs-input class="w-full" v-model="conquista.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="!conquista.global && conquista.global != null">
                <span class="font-regular mb-2">Produto</span>

                <v-select v-model="produtoSelected" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="produtos" v-validate="'required'" name="produto"/>
                <span class="text-danger text-sm" v-show="errors.has('produto')">Este campo é obrigatírio</span>
            </div>
        </div>
        <div class="vx-row mt-10 mb-3 justify-around flex" v-if="!prosseguiu">
            <div class="vx-col w-full mb-10">
                <h2 class="subtitulo">Escolha o tipo de conquista</h2>
            </div>
            <div class="vx-col w-full lg:w-5/12 sm:w-full text-center cursor-pointer tipo-conquista"
                 :class="{'conquista-ativa': (!conquista.global && conquista.global != null)}"
                 @click="conquista.global = 0">
                <div class="vx-row py-5">
                    <div class="vx-col w-full">
                        <img src="@/assets/images/util/conquista-prod.svg" alt="">
                    </div>
                    <div class="vx-col w-full text-center">
                        <p class="destaque mb-3">Conquista Produto</p>
                        <p>Gamefication e bonificações por <br> vendas vinculadas a um produto</p>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-5/12 sm:w-full text-center cursor-pointer tipo-conquista"
                 :class="{'conquista-ativa': (conquista.global)}" @click="conquista.global = 1">
                <div class="vx-row py-5">
                    <div class="vx-col w-full">
                        <img src="@/assets/images/util/conquista-global.svg" alt="">
                    </div>
                    <div class="vx-col w-full">
                        <p class="destaque mb-3">Conquista Global</p>
                        <p>Gamefication e bonificações por <br> vendas de qualquer produto</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="vx-row mt-10 mb-5">
                <div class="vx-col w-full lg:w-1/2">
                    <span class="span-destaque">Perfil da Comissão</span>
                    <ul class="list-tipo-comissao mt-10">
                        <li class="my-3">
                            <vs-radio color="dark" v-model="conquista.perfil" vs-value="Atendente">
                                Atendente
                            </vs-radio>
                        </li>
                        <li>
                            <vs-radio color="dark" v-model="conquista.perfil" vs-value="Responsavel">
                                Responsável
                            </vs-radio>
                        </li>
                    </ul>
                </div>
                <div class="vx-col w-full lg:w-1/2">
                    <span class="span-destaque">Tipo de Comissão</span>
                    <div class="flex items-center mt-10">
                        <vs-button color="primary" type="border" class="mr-6 w-full py-4"
                                   v-bind:class="{'btn-selecionado' : (conquista.tipo === 'valor')}"
                                   @click="selecionaTipoComissao('valor')">Valor (R$)
                        </vs-button>
                        <vs-button color="primary" type="border" class="w-full py-4"
                                   v-bind:class="{'btn-selecionado' : (conquista.tipo === 'percentual')}"
                                   @click="selecionaTipoComissao('percentual')">Percentual (%)
                        </vs-button>
                    </div>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-full lg:w-8/12 sm:w-full">
                    <div class="vx-row">
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="conquista.tipo === 'valor'">
                            <span class="font-regular mb-2">Aumento em reais</span>
                            <vs-input class="w-full" v-model="conquista.valor" size="large" v-money="money"
                                      v-validate="'required'"/>
                        </div>
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="conquista.tipo === 'percentual'">
                            <span class="font-regular mb-2">Aumento percentual</span>
                            <vs-input class="w-full" v-model="conquista.porcentagem" size="large" v-money="percent"
                                      v-validate="'required'"/>
                        </div>
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2">
                            <span class="font-regular mb-2">Nº de vendas</span>
                            <vs-input class="w-full" v-model="conquista.quantidade" size="large"
                                      v-validate="'required'" @keypress="isNumber"/>
                        </div>
                        <div class="vx-col w-full mt-10">
                            <span class="font-regular mb-2">Descrição da conquista</span>
                            <vs-textarea v-model="conquista.descricao" id="text-area" class="w-full bg-white" rows="5"/>
                        </div>
                    </div>
                </div>
                <div class="vx-col w-full lg:w-4/12 sm:w-full">
                    <div class="mb-6 p-5 pt-0">
                        <span class="font-regular mb-3 ml-2">Selo do Reconhecimento</span>
                        <div style="width: 100%;     margin-top: 4px;" @dragenter="OnDragEnter"
                             @dragleave="OnDragLeave"
                             @dragover.prevent
                             @drop="onDrop"
                             :class="{ dragging: isDragging }">
                            <vx-card class="grid-view-item mb-base overflow-hidden"
                                     v-if="conquista.imagem && !images.length">
                                <template slot="no-body">
                                    <!-- ITEM IMAGE -->
                                    <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer">
                                        <img :src="url_api(conquista.imagem)" style="width: 200px" alt="avatar"
                                             class="grid-view-img px-4">
                                    </div>
                                    <div class="item-details px-4">
                                    </div>
                                    <div class="flex flex-wrap">
                                        <label
                                                class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                                for="file">
                                            <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                                            <label class="text-sm font-semibold ml-2" for="file">Alterar avatar</label>
                                        </label>
                                    </div>
                                </template>
                            </vx-card>

                            <vx-card class="grid-view-item mb-base overflow-hidden" v-show="images.length">
                                <template slot="no-body">
                                    <!-- ITEM IMAGE -->
                                    <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer"
                                         v-for="(image, index) in images" :key="index">
                                        <img :src="image" style="width: 200px" alt="avatar" class="grid-view-img px-4">
                                    </div>
                                    <div class="item-details px-4">
                                    </div>
                                    <div class="flex flex-wrap">
                                        <label class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                               for="file">
                                            <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                                            <label class="text-sm font-semibold ml-2" for="file">Alterar Selo</label>
                                        </label>
                                    </div>
                                </template>
                            </vx-card>
                            <div class="uploader" v-show="!conquista.imagem">
                                <div v-show="!images.length">
                                    <label for="file">
                                        <i class="fa fa-cloud-upload"></i>
                                        <img :src="url_api('images/upload.png')">
                                        <p class="text-lg">Arraste e solte ou clique aqui</p>
                                        <div class="file-input">
                                            <input type="file" id="file" @change="onInputChange">
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                {{!prosseguiu ? 'Prosseguir' : 'Salvar'}}
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'conquistas'})">
                                Cancelar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleConquistas from '@/store/conquistas/moduleConquistas.js'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'
    import {Validator} from 'vee-validate';
    import saveleadsConfig from "../../../saveleadsConfig";

    const dict = {
        custom: {
            nome: {
                required: 'Por favor, insira o nome do produto',
            },
        }
    };
    Validator.localize('pt-br', dict);
    export default {
        name: "Edit",
        components: {
            'v-select': vSelect
        },
        created() {
            if (!moduleConquistas.isRegistered) {
                this.$store.registerModule('conquistas', moduleConquistas)
                moduleConquistas.isRegistered = true
            }
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }

            this.getOpcoes();

            if (this.$route.name === 'conquista-editar') {
                this.getId(this.$route.params.id);
            }
        },
        data() {
            return {
                url: saveleadsConfig.url_api,
                produtoSelected: null,
                conquista: {
                    ativo: 1,
                    tipo: 'valor',
                    global: null,
                    perfil: 'atendente',
                    valor: 0,
                    porcentagem: 0,
                    quantidade: 0,
                    imagem: null
                },
                produtos: [],
                images: [],
                files: [],
                isDragging: false,
                prosseguiu: false,
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: 'R$ ',
                    suffix: '',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
                percent: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '%',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (!this.prosseguiu) {
                            this.prosseguiu = true;
                        } else {
                            this.$vs.loading();
                            const formData = new FormData();
                            this.files.forEach(file => {
                                formData.append('imagem', file, file.name);
                            });
                            if (this.produtoSelected != null)
                                formData.append('produto_id', this.produtoSelected.id);

                            formData.append('nome', this.conquista.nome);
                            formData.append('descricao', this.conquista.descricao);
                            formData.append('quantidade', this.conquista.quantidade);
                            formData.append('valor', this.conquista.valor);
                            formData.append('porcentagem', this.conquista.porcentagem);
                            formData.append('tipo', this.conquista.tipo);
                            formData.append('perfil', this.conquista.perfil);
                            formData.append('global', this.conquista.global);
                            formData.append('ativo', this.conquista.ativo);

                            if (this.conquista.id !== undefined) {
                                formData.append('_method', 'PUT');
                                this.$store.dispatch('conquistas/update', {
                                    id: this.conquista.id,
                                    dados: formData
                                }).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: '',
                                        text: "Atualizada com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({name: 'conquistas'});
                                }).catch(erro => {
                                    this.$vs.notify({
                                        title: '',
                                        text: erro.message,
                                        iconPack: 'feather',
                                        icon: 'icon-alert-circle',
                                        color: 'danger'
                                    })
                                })
                            } else {
                                this.$store.dispatch('conquistas/store', formData).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: 'Sucesso',
                                        text: "Criada com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({name: 'conquistas'});
                                }).catch(erro => {
                                    this.$vs.notify({
                                        title: 'Error',
                                        text: erro.message,
                                        iconPack: 'feather',
                                        icon: 'icon-alert-circle',
                                        color: 'danger'
                                    })
                                })
                            }
                        }
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'verifique os erros específicos',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }
                })
            },
            selecionaTipoComissao(val) {
                this.conquista.tipo = val;
            },
            getOpcoes() {
                this.produtos = [];
                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome})
                    });
                });
            },
            getId(id) {
                this.$vs.loading()
                this.$store.dispatch('conquistas/getId', id).then(data => {
                    this.conquista = {...data};
                    this.conquista.valor *= 100;
                    this.conquista.porcentagem *= 100;
                    console.log('conquista', this.conquista)
                    if(this.conquista.produto)
                        this.produtoSelected = {id: data.produto.id, label: data.produto.nome};
                    this.prosseguiu = true;
                    this.$vs.loading.close();
                })
            },

            //drag
            OnDragEnter(e) {
                e.preventDefault();
                this.dragCount++;
                this.isDragging = true;
                return false;
            },
            OnDragLeave(e) {
                e.preventDefault();
                this.dragCount--;
                if (this.dragCount <= 0)
                    this.isDragging = false;
            },
            onInputChange(e) {
                const files = e.target.files;
                Array.from(files).forEach(file => this.addImage(file));
            },
            onDrop(e) {
                e.preventDefault();
                e.stopPropagation();
                this.isDragging = false;
                const files = e.dataTransfer.files;
                Array.from(files).forEach(file => this.addImage(file));
            },
            addImage(file) {
                this.files.pop();
                if (!file.type.match('image.*')) {
                    this.$vs.notify({
                        title: 'Error',
                        text: file.name + " não é uma imagem compatível",
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                    return;
                }
                this.files.push(file);
                this.conquista.imagem = file;
                const img = new Image(),
                    reader = new FileReader();
                this.images.pop();
                reader.onload = (e) => this.images.push(e.target.result);
                reader.readAsDataURL(file);
            },
            getFileSize(size) {
                const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
                let i = 0;

                while (size > 900) {
                    size /= 1024;
                    i++;
                }
                return `${(Math.round(size * 100) / 100)} ${fSExt[i]}`;
            },
        },
        computed: {
            isValid() {
                return this.errors.any() && this.conquista.global != null;
            },
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getContas();
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle
            },
            produto: {
                handler(val) {
                    console.log('mudou');
                    if (val) {
                        console.log('watch', val);
                    }
                },
                deep: true
            },
        },
    }
</script>

<style scoped lang="scss">
    .uploader {
        width: 100%;
        background: #fff;
        color: #0c0808;
        padding: 40px 15px;
        text-align: center;
        border-radius: 10px;
        border: 3px dashed #fff;
        font-size: 20px;
        position: relative;

        &.dragging {
            background: #fff;
            color: #2196F3;
            border: 3px dashed #e7e7e7;

            .file-input label {
                background: #f0f2f4;
                color: #fff;
            }
        }

        i {
            font-size: 85px;
        }

        .file-input {
            width: 200px;
            margin: auto;
            height: 68px;
            position: relative;

            label,
            input {
                background: #f1f5f7;
                color: #0c0808;
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                font-size: 18px;
                padding: 10px;
                border-radius: 4px;
                margin-top: 7px;
                cursor: pointer;
            }

            input {
                opacity: 0;
                z-index: -2;
            }
        }

        .images-preview {
            display: flex;
            flex-wrap: wrap;

            .img-wrapper {
                width: auto;
                display: flex;
                /*/flex-direction: column;*/
                margin: 10px;

                justify-content: space-between;
                background: #fff0;
                //box-shadow: 5px 5px 20px #3e3737;
                img {
                    max-height: 200px;
                    max-width: 200px;
                    width: 100%;
                }
            }

            .details {
                font-size: 12px;
                background: #fff;
                color: #000;
                display: flex;
                flex-direction: column;
                padding: 3px 6px;

                .name {
                    overflow: hidden;
                    height: 18px;
                }
            }
        }

        .upload-control {
            button, label {
                background: #7e57c2;
                border: 2px solid #7e57c2;
                border-radius: 3px;
                color: #fff;
                font-size: 15px;
                cursor: pointer !important;
            }

            label {
                padding: 2px 5px;
            }
        }

    }
</style>

<style>
    [dir] .con-select .vs-select--input {
        padding: 1.4rem 2rem !important;
    }

    .list-tipo-comissao .vs-radio--label {
        font-weight: 600;
        margin-left: 2rem;
    }

    #copy-icon {
        position: absolute;
        top: 0.7rem;
        position: absolute;
        right: 30px;
        cursor: pointer;
    }
</style>
