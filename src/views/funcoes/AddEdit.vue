<template>
    <div>
        <div class="vx-row mb-10">
            <div class="vx-col w-full mb-base">
                <p class="font-regular mb-3">Nome da Função</p>
                <vs-input class="w-full" v-model="funcao.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
            <div class="vx-col w-full mb-base" v-if="$acl.check('configuracao_funcao_fullprod')">
                <vs-checkbox v-model="funcao.full_products">Permitir todos os produtos</vs-checkbox>
            </div>
            <div class="vx-col w-full" v-if="!funcao.full_products">
                <p class="font-regular mb-2">Produtos Permitidos</p>
                <v-select multiple :closeOnSelect="false" v-model="produtos_permitidos" :options="all_produtos" class="bg-white"/>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div class="vx-row mt-10">
            <div class="vx-col w-full mb-5">
                <p class="font-bold text-2xl text-dark">Permissões</p>
            </div>
            <div class="vx-col w-full">
                <vs-collapse type="margin">
                    <vs-collapse-item v-for="main in modules" class="bg-white">
                        <div slot="header">
                            <vs-checkbox class="w-1/3 lg:w-1/4" v-model="main_arr_permissions" @click="checkModules(main)" :vs-value="main.id"><span class="text-xl font-bold">{{ main.module_name }}</span>
                            </vs-checkbox>
                        </div>
                        <div class="vx-row my-4">
                            <div class="vx-col w-full lg:w-1/4 mb-3" v-for="sub_module in getDependentes(main.module)">
                                <!-- Primeira Camada -->
                                <div class="flex items-center my-3">
                                    <vs-checkbox v-model="main_arr_permissions" @click="checkModules(sub_module)" :vs-value="sub_module.id"><span class="text-lg">{{ sub_module.module_name }}</span>
                                    </vs-checkbox>
                                </div>
                                <div class="ml-4 my-2" v-if="hasDependentes(sub_module.module)" v-for="ter_module in getDependentes(sub_module.module)">
                                    <!-- Segunda Camada -->
                                    <div class="flex items-center">
                                        <vs-checkbox v-model="main_arr_permissions" @click="checkModules(ter_module)" :vs-value="ter_module.id"><span class="text-md">{{ ter_module.module_name }}</span>
                                        </vs-checkbox>
                                    </div>
                                    <div class="ml-4 my-2" v-if="hasDependentes(ter_module.module)" v-for="quar_module in getDependentes(ter_module.module)">
                                        <!-- Terceira Camada -->
                                        <div class="flex items-center">
                                            <vs-checkbox v-model="main_arr_permissions" @click="checkModules(quar_module)" :vs-value="quar_module.id"><span class="text-md">{{ quar_module.module_name }}</span>
                                            </vs-checkbox>
                                        </div>
                                        <div class="ml-4 my-2" v-if="hasDependentes(quar_module.module)" v-for="quin_module in getDependentes(quar_module.module)">
                                            <!-- Quarta Camada -->
                                            <div class="flex items-center">
                                                <vs-checkbox v-model="main_arr_permissions" @click="checkModules(quin_module)" :vs-value="quin_module.id"><span class="text-md">{{
                                                        quin_module.module_name
                                                    }}</span>
                                                </vs-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
              <div class="vx-col sm:w-11/12 mb-2">
                <vs-button class="float-right mr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                           @click="$router.push({name: 'funcoes'})">
                  Cancelar
                </vs-button>
                <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                  Salvar
                </vs-button>
              </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import {Validator} from 'vee-validate';
import moduleFuncoes from "@/store/funcoes/moduleFuncoes";
import axios from "@/axios.js";
import moduleProdutos from "@/store/produtos/moduleProdutos";
import vSelect from 'vue-select';

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
    components: {'v-select': vSelect},
    data() {
        return {
            funcao: {
                nome: '',
                permissions: [],
                role_produtos: [],
                produtos: []
            },
            permissoes: [],
            main_modules: [],
            sub_modules: [],
            ter_modules: [],
            quar_modules: [],
            quin_modules: [],
            main_arr_permissions: [],
            all_produtos: [],
            produtos_permitidos: []
        }
    },
    created() {
        if (!moduleFuncoes.isRegistered) {
            this.$store.registerModule('funcoes', moduleFuncoes)
            moduleFuncoes.isRegistered = true
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos)
            moduleProdutos.isRegistered = true
        }

        this.getProdutos();

        if (this.$route.name === 'funcoes-editar') {
            this.getAllPermissoes();
            this.getId(this.$route.params.id);
        }
    },
    methods: {
        salvar() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.funcao.produtos = this.produtos_permitidos.map(item => {
                        console.log('produto setado', item)
                        return item.id
                    });
                    this.funcao.permissions = [...this.main_arr_permissions];
                    this.$vs.loading();
                    this.$store.dispatch('funcoes/store', this.funcao).then(response => {
                        console.log('response criado', response);
                        this.$vs.notify({
                            title: '',
                            text: "Atualizada com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        this.$vs.loading.close();
                      this.$router.push({path: '/configuracoes/funcoes/editar/' + response.id});
                        this.getAllPermissoes();
                        this.getId(response.id);
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
        setPermission(permissoes){
          return Promise.resolve().then(function () {
            localStorage.removeItem("permissoes");
            localStorage.setItem("permissoes", JSON.stringify(permissoes));
          });
        },
        getId(id) {
            this.$vs.loading()
            this.$store.dispatch('funcoes/getId', id).then(data => {
                this.funcao = {...data};
                this.setProdutosPermitidos();
                this.tratarPermissions(data.permission_roles);
                this.$vs.loading.close();
            })
        },
        getAllPermissoes() {
            axios.get('/permissions').then(response => {
                this.permissoes = response.data.data;
            });
        },
        hasDependentes(name) {//Verifica se o módulo possui módulos dependentes dele
            let tem = false;
            this.permissoes.forEach(perm => {
                if (perm.module_depends === name)
                    tem = true
            });
            return tem
        },
        getDependentes(name) {//Busca os módulos dependentes do verificado
            let arr = [];
            this.permissoes.forEach(perm => {
                if (perm.module_depends === name) {
                    arr.push(perm)
                }
            });

            return arr
        },
        hasPai(name) {//Verifica se o módulo em questão é dependente de outro
            let tem = false;
            this.permissoes.forEach(perm => {
                if (perm.module === name)
                    tem = true
            });
            return tem
        },
        getPai(name) {//Resgata módulo pai
            let obj = null;
            this.permissoes.forEach(perm => {
                if (perm.module === name) {
                    obj = perm;
                }
            });

            return obj
        },
        clicked(name) {
            let clicado = false;
            this.main_arr_permissions.forEach(perm => {
                if (perm === name)
                    clicado = true
            });
            return clicado
        },
        removeDependes(id) {
            let index = this.main_arr_permissions.indexOf(id);
            this.main_arr_permissions.splice(index, 1);
        },
        checkModules(modulo) {//Executado ao clicar no checkbox.
            if (this.clicked(modulo.id)) {//Caso ele esteja "preenchido"
                this.removeOption(modulo)//Remove ele do array fazendo suas verificações de herança
            } else {
                this.checkPai(modulo);//Rotina de verificação "parental"
                this.pushOption(modulo);
            }
        },
        checkPai(modulo) {//Função executada em loop até encontrar toda a árvore de herança ascendente a ser colocada no array de permissões
            if (this.hasPai(modulo.module_depends)) {
                let obj = this.getPai(modulo.module_depends);//Pega as informações do módulo pai
                if (this.main_arr_permissions.indexOf(obj.id) === -1) {//Verifica a existência dele no array
                    this.main_arr_permissions.push(obj.id);//Caso não encontrado, insere ele. Marcando-o também visualmente
                    this.checkPai(obj);//Finaliza a rotina chamando ele mesmo até que não entre na condição acima
                }
            }
        },
        pushOption(modulo) {//Rotina de inserção de dependentes no array de permissões ao clicar em alguma que seja "pai" de outras
            if (this.hasDependentes(modulo.module)) {
                let array = [];
                array = this.getDependentes(modulo.module);//Pega o array que de dependentes do módulo
                array.forEach(item => {
                    if (this.main_arr_permissions.indexOf(item.id) === -1) {//Verifica se já não se encontra no array principal
                        this.main_arr_permissions.push(item.id);//Caso não, o insere
                        this.pushOption(item);//Chama ela mesmo mais uma vez até que não entre mais na condição acima
                    }
                })
            }
        },
        removeOption(modulo) {//Rotina similar à anterior, porém, buscando remover os módulos dependentes.
            if (this.hasDependentes(modulo.module)) {
                let array = [];
                array = this.getDependentes(modulo.module);
                array.forEach(item => {
                    if (this.main_arr_permissions.indexOf(item.id) !== -1) {
                        this.removeDependes(item.id)
                        this.removeOption(item);
                    }
                })
            }
        },
        tratarPermissions(array) {//Joga as permissões que a Função já possui dentro do array principal.
            this.main_arr_permissions = array.map(item => {
                return item.permission_id;
            })
        },
        getProdutos() {
            this.$store.dispatch('produtos/get', {}).then(response => {
                this.all_produtos = [...this.arraySelect(response)];
                console.log('produtos', this.all_produtos);
            });
        },
        setProdutosPermitidos(){//Aloca os produtos que a função já tem acesso
            if (this.funcao.role_produtos.length > 0) {
                console.log('produtos array', this.funcao.role_produtos);
                this.produtos_permitidos = this.funcao.role_produtos.map(item => {
                    console.log('produto resgatado', item)
                    return {id: item.produto_id, label: item.produto.nome};
                })
                //this.produtos_permitidos = [...this.arraySelect(this.funcao.role_produtos)];
            }
        }
    },
    computed: {
        isValid() {
            return this.errors.any() || this.funcao.nome === '';
        },
        modules() {//Tratando módulos principais
            let arr = [];
            this.permissoes.forEach(perm => {
                if (!perm.module_depends && !perm.depends) {//módulos que não possuem ascendência são considerados "principais". Ex.: Configurações, Tickets, Brindes
                    arr.push(perm);
                }
            });

            return arr;
        }
    },
    watch: {
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
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
