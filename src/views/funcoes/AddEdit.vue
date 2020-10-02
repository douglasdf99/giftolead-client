<template>
    <div>
        <div class="vx-row mb-10">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da  Função</span>
                <vs-input class="w-full" v-model="funcao.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div class="vx-row mt-10">
            <div class="vx-col w-full mb-10">
                <p class="text-2xl font-bold text-black">Permissões</p>
            </div>
            <div class="vx-col w-full lg:w-1/3 mb-base" v-for="main in modules">
                <!-- Card permissão -->
                <vx-card class="w-full bg-white shadow-none">
                    <vs-switch class="tiny-switch float-left mr-4" v-model="main_modules" :vs-value="main"></vs-switch>
                    <p class="text-lg">{{ main.module_name }}</p>
                    <vs-divider></vs-divider>
                    <div class="vx-row my-4">
                        <div class="vx-col w-full">
                            <div v-for="sub_module in getDependentes(main.module)">
                                <!-- Primeira Camada -->
                                <div class="flex items-center">
                                    <vs-switch class="tiny-switch ml-4 mr-2 mb-1" v-model="sub_modules" :vs-value="sub_module"></vs-switch>
                                    <p>{{ sub_module.module_name }}</p>
                                </div>
                                
                                <div class="font-bold ml-4" v-if="hasDependentes(sub_module.module)" v-for="ter_module in getDependentes(sub_module.module)">
                                    <!-- Segunda Camada -->
                                    <div class="flex items-center">
                                        <vs-switch class="tiny-switch ml-4 mr-2 mb-1" v-model="ter_modules" :vs-value="ter_module"></vs-switch>
                                        <p>{{ ter_module.module_name }}</p>
                                    </div>
                                    <div class="font-bold ml-4" v-if="hasDependentes(ter_module.module)" v-for="quar_module in getDependentes(ter_module.module)">
                                        <!-- Terceira Camada -->
                                        <div class="flex items-center">
                                            <vs-switch class="tiny-switch ml-4 mr-2 mb-1" v-model="quar_modules" :vs-value="quar_module"></vs-switch>
                                            <p>{{ quar_module.module_name }}</p>
                                        </div>
                                        <div class="font-bold ml-4" v-if="hasDependentes(quar_module.module)" v-for="quin_module in getDependentes(quar_module.module)">
                                            <!-- Quarta Camada -->
                                            <div class="flex items-center">
                                                <vs-switch class="tiny-switch ml-4 mr-2 mb-1" v-model="quin_modules" :vs-value="quin_module"></vs-switch>
                                                <p>{{ quin_module.module_name }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                Salvar
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'funcoes'})">
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
import {Validator} from 'vee-validate';
import moduleFuncoes from "@/store/funcoes/moduleFuncoes";
import axios from "@/axios.js";

const dict = {
    custom: {
        nome: {
            required: 'Por favor, insira o nome da função',
        },
    }
};
Validator.localize('pt-br', dict);
export default {
    name: "Edit",
    components: {},
    data() {
        return {
            funcao: {
                nome: '',
            },
            permissoes: [],

            main_modules: [],
            sub_modules: [],
            ter_modules: [],
            quar_modules: [],
            quin_modules: []
        }
    },
    created() {
        if (!moduleFuncoes.isRegistered) {
            this.$store.registerModule('funcoes', moduleFuncoes)
            moduleFuncoes.isRegistered = true
        }

        if (this.$route.name === 'funcoes-editar') {
            this.getId(this.$route.params.id);
            this.getAllPermissoes();
        }
    },
    methods: {
        salvar() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    this.$store.dispatch('funcoes/store', this.funcao).then(response => {
                        console.log('response', response);
                        this.$vs.notify({
                            title: '',
                            text: "Atualizada com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        this.$router.push({name: 'funcoes'});
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
        getId(id) {
            this.$vs.loading()
            this.$store.dispatch('funcoes/getId', id).then(data => {
                this.funcao = {...data};
                this.$vs.loading.close();
            })
        },
        getAllPermissoes() {
            axios.get('/permissions').then(response => {
                this.permissoes = response.data.data;
            });
        },
        getDependentes(name) {
            let arr = [];
            this.permissoes.forEach(perm => {
                if (perm.module_depends == name) {
                    arr.push(perm)
                }
            });

            return arr
        },
        hasDependentes(name) {
            let tem = false;
            this.permissoes.forEach(perm => {
                if (perm.module_depends === name)
                    tem = true
            });
            return tem
        }
    },
    computed: {
        isValid() {
            return this.errors.any() || this.funcao.nome == '';
        },
        modules() {
            let arr = [];
            this.permissoes.forEach(perm => {
                if (!perm.module_depends && !perm.depends) {//Tratando módulos principais
                    arr.push(perm);
                }
            });

            return arr;
        }
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

.tiny-switch {
    transform: scale(0.7);
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
