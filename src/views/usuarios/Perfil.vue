<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-8/12 lg:w-8/12">
                <div class="vx-row mb-3">
                    <div class="vx-col w-full">
                        <span class="font-regular mb-2">Nome</span>
                        <vs-input class="w-full" v-model="usuario.name" size="large" v-validate="'required'"/>
                        <span class="text-danger text-sm" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2 mb-2">
                        <span class="font-regular mb-2">Senha</span>
                        <vs-input class="w-full" v-model="usuario.password" size="large" type="password" v-validate="enableValidate"/>
                        <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2 mb-2">
                        <span class="font-regular mb-2">Confirmação da senha</span>
                        <vs-input class="w-full" v-model="usuario.password_confirmed" size="large" type="password" v-validate="enableValidate"/>
                        <span class="text-danger text-sm" v-show="usuario.password !== usuario.password_confirmed">Confirme corretamente a senha</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2">
                        <span class="font-regular mb-2">E-mail</span>
                        <vs-input class="w-full" v-model="usuario.email" size="large" type="email" disabled/>
                    </div>
                    <div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2">
                        <span class="font-regular mb-2">Função</span>
                        <vs-input class="w-full" v-model="usuario.roles.nome" size="large" type="text" disabled/>
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col w-full mt-4" v-if="slack">
                        <span class="font-regular mb-2">WebHook Slack</span>
                        <vs-input class="w-full" v-model="usuario.url_slack" size="large" name="url" type="text" v-validate="'url:require_protocol'"/>
                        <span class="text-danger text-sm" v-show="errors.has('url')">{{ errors.first('url') }}</span>
                    </div>
                    <div class="vx-col w-full my-4" v-if="slack">
                        <div class="p-5 rounded-lg bg-white">
                            <p>
                                Importante: a URL do Webhook individual pode ser encontrada
                                <a target="_blank" href="https://slack.com/services/new/incoming-webhook" style="text-decoration: none">aqui</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full xlg:w-4/12 lg:w-4/12">
                <div class="mb-6 p-5 pt-0">
                    <span class="font-regular mb-3 ml-2">Avatar</span>
                    <div style="width: 100%;     margin-top: 4px;" @dragenter="OnDragEnter"
                         @dragleave="OnDragLeave"
                         @dragover.prevent
                         @drop="onDrop"
                         :class="{ dragging: isDragging }">
                        <vx-card class="grid-view-item mb-base overflow-hidden" v-if="usuario.avatar && !images.length">
                            <template slot="no-body">
                                <!-- ITEM IMAGE -->
                                <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer">
                                    <img :src="get_img_api(usuario.avatar)" style="width: 200px" alt="avatar"
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
                                        <label class="text-sm font-semibold ml-2" for="file">Alterar avatar</label>
                                    </label>
                                </div>
                            </template>
                        </vx-card>
                        <div class="uploader" v-show="!usuario.avatar">
                            <div v-show="!images.length">
                                <label for="file">
                                    <i class="fa fa-cloud-upload"></i>
                                    <img :src="get_img_api('images/upload.png')">
                                    <p class="text-lg">Arraste e solte ou clique aqui</p>
                                    <div class="file-input" style="display: none">
                                        <input type="file" id="file" @change="onInputChange">
                                    </div>
                                </label>
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
                                Salvar
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'usuarios'})">
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

const dict = {
    custom: {
        name: {
            required: 'Por favor, insira o nome',
        },
        password: {
            required: 'Por favor, insira o senha',
        },
        password_confirmed: {
            required: 'Por favor, confirme a senha',
        },
        url: {
            url: 'Formato de URL inválido'
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
        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario)
            moduleUsuario.isRegistered = true
        }
        this.verificaExt();
        this.getUsuario();
    },
    data() {
        return {
            customcor: '',
            usuario: {
                name: '',
                email: '',
                status: true,
                password: '',
                password_confirmed: '',
                avatar: '',
                sck: '',
                url_slack: ''
            },
            opcoesFuncoes: [],
            funcaoSelected: null,
            files: [],
            images: [],
            isDragging: false,
            slack: false
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
                    formData.append('sck', this.usuario.sck);
                    formData.append('url_slack', this.usuario.url_slack);
                    formData.append('status', (this.usuario.status ? 1 : 0));

                    if (this.usuario.password == this.usuario.password_confirmed)
                        formData.append('password', this.usuario.password);

                    if (this.usuario.id !== undefined) {
                        formData.append('_method', 'PUT');
                        this.$store.dispatch('users/update', {dados: formData, id: this.usuario.id}).then(response => {
                            console.log('response', response);
                            this.$vs.notify({
                                title: 'Sucesso',
                                text: "O usuario foi atualizado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.$router.push({name: 'dashboard'});
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
            });
        },
        enableValidate() {
            if (this.$route.name === 'usuario-editar')
                return ''
            else
                return 'required'
        },
        getUsuario() {
            let user = JSON.parse(localStorage.getItem('userInfo'));
            this.$vs.loading()
            this.$store.dispatch('users/getId', user.uid).then(data => {
                this.usuario = data;
                this.usuario.password = ''
                this.usuario.password_confirmed = ''
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
                this.$toastr.e(`${file.name} is not an image`);
                return;
            }
            this.files.push(file);
            this.usuario.avatar = file;
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
        verificaExt() {
            this.verficaExtesoes().then(response => {
                this.slack = response.includes('slack');
            });
        }
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
                console.log('mudou2');
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
