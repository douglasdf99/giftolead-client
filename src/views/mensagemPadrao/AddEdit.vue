<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-8/12 lg:w-8/12">
                <div class="vx-row mb-3">
                    <div class="vx-col w-full lg:w-3/12">
                        <span class="font-regular mb-2">Selecione o tipo</span>
                        <v-select v-model="selectTipo" :class="'select-large-base'" :clearable="false"
                                  :options="tipos" v-validate="'required'" name="tipo" style="background-color: white"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('tipo')">{{ errors.first('tipo') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col w-1/2">
                        <span class="font-regular mb-2">Título</span>
                        <vs-input class="w-full" v-model="mensagem.titulo" size="large" v-validate="'required'"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('titulo')">{{ errors.first('titulo') }}</span>
                    </div>
                    <div class="vx-col w-1/2" v-if="selectTipo.id === 'email'">
                        <span class="font-regular mb-2">Assunto</span>
                        <vs-input class="w-full" v-model="mensagem.assunto" size="large"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('assunto')">{{ errors.first('assunto') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col w-full" v-if="selectTipo.id == 'whatsapp'">
                        <span class="font-regular mb-2">Mensagem</span>
                        <vs-textarea v-model="mensagem.mensagem" class="w-full bg-white"/>
                    </div>
                    <div class="vx-col w-full" v-else>
                        <span class="font-regular mb-2">Mensagem</span>
                        <quill-editor v-model="mensagem.mensagem" class="bg-white"></quill-editor>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full xlg:w-4/12 lg:w-4/12">
                <div class="mb-3 p-5 pt-0">
                    <span class="font-regular">Inserir no corpo da mensagem:</span>
                    <ul class="variaveis-msg">
                        <li class="variavel">
                            <span>Nome do Cliente</span>
                        </li>
                        <li class="variavel">
                            <span>Nome do Brinde</span>
                        </li>
                        <li class="variavel">
                            <span>Código de Rastreio</span>
                        </li>
                        <li class="variavel">
                            <span>Link rastreio dos Correios</span>
                        </li>
                    </ul>
                </div>
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
                                       @click="$router.push({name: 'mensagem-padrao'})">
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
    import moduleUsuario from '@/store/usuarios/moduleUsuario.js'
    import {Validator} from 'vee-validate';
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'

    const dict = {
        custom: {
            name: {
                required: 'Por favor, insira o nome',
            },
            email: {
                required: 'Por favor, insira o e-mail',
            },
            password: {
                required: 'Por favor, insira o senha',
            },
            password_confirmed: {
                required: 'Por favor, confirme a senha',
            },
        }
    };
    Validator.localize('pt-br', dict);
    export default {
        name: "Edit",
        components: {
            'v-select': vSelect,
            quillEditor
        },
        created() {
            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('usuarios', moduleUsuario)
                moduleUsuario.isRegistered = true
            }
            this.getOpcoes();

            if (this.$route.name === 'usuario-editar') {
                this.funcaoSelected = {id: null, label: ''};
                this.getUsuario(this.$route.params.id);
            }
        },
        data() {
            return {
                mensagem: {
                    empresa_id: 1,
                    tipo: '',
                    titulo: '',
                    assunto: '',
                    mensagem: '',
                },
                selectTipo: {id: 'whatsapp', label: 'WhatsApp'},
                tipos: [{id: 'whatsapp', label: 'WhatsApp'}, {id: 'email', label: 'E-mail'}]
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        //this.usuario.role_id = this.funcaoSelected.id;
                        const formData = new FormData();
                        this.files.forEach(file => {
                            formData.append('avatar', file, file.name);
                        });
                        formData.append('name', this.usuario.name);
                        formData.append('email', this.usuario.email);
                        formData.append('role_id', 1);
                        formData.append('status', (this.usuario.status ? 1 : 0));

                        if (this.usuario.password)
                            formData.append('password', this.usuario.password);

                        if (this.usuario.id !== undefined) {
                            formData.append('_method', 'PUT');
                            this.$store.dispatch('usuarios/update', {
                                dados: formData,
                                id: this.usuario.id
                            }).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O usuario foi atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'usuarios'});
                            }).catch(erro => {
                                this.$vs.notify({
                                    title: 'Error',
                                    text: erro.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            })
                        } else {
                            this.$store.dispatch('addItem', {item: formData, rota: 'users'}).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O usuario foi criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'usuarios'});
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
            enableValidate() {
                if (this.$route.name === 'usuario-editar')
                    return ''
                else
                    return 'required'
            },
            getOpcoes() {
                this.opcoesFuncoes = [];
                /*this.$store.dispatch('contas/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesFuncoes.push({id: item.id, label: item.nome})
                    });
                })*/
            },
            getUsuario(id) {
                this.$vs.loading()
                this.$store.dispatch('usuarios/getId', id).then(data => {
                    this.usuario = {...data};
                    this.usuario.password = ''
                    this.usuario.password_confirmed = ''
                    this.$vs.loading.close();

                })
            },
        },
        computed: {
            isValid() {
                return this.errors.any();
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
            usuario: {
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
