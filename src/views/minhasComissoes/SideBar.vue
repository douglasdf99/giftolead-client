<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Comprovação de venda</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-10">
                <div class="vx-row">
                    <div class="vx-col w-full mb-5">
                        <span class="font-bold mb-3 ml-2 text-lg">Imagens (clique na caixa ou arraste e solte a imagem para dentro)</span>
                        <div style="width: 100%;     margin-top: 4px;" @dragenter="OnDragEnter" @dragleave="OnDragLeave" @dragover.prevent @drop="onDrop" :class="{ dragging: isDragging }">
                            <div class="uploader py-3 mt-3">
                                <label for="file">
                                    <div class="vx-row">
                                        <div class="vx-col w-full text-center">
                                            <i class="fa fa-cloud-upload" v-if="images.length == 0"></i>
                                            <img :src="get_img_api('images/upload.png')" v-if="images.length == 0">
                                            <p class="text-lg">Clique aqui para anexar imagens</p>
                                            <div class="file-input hidden">
                                                <input type="file" id="file" multiple @change="onInputChange">
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="vx-row my-3 px-3" style="max-height: 280px; overflow: auto">
                                <div v-show="images.length > 0" class="item-img-container bg-white h-32 flex items-center justify-center lg:w-1/3 w-full relative my-3"
                                     v-for="(image, index) in images" :key="index">
                                    <vs-icon icon-pack="material-icons" icon="cancel" class="icon-grande text-danger cursor-pointer remove-img" @click="removeImg(index)"></vs-icon>
                                    <img :src="image" style="max-width: 200px; max-height: 100px" alt="logotipo" class="grid-view-img px-4">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vx-col w-full">
                        <p class="font-bold mb-3 ml-2 text-lg">Descrição</p>
                        <vs-textarea v-model="obj.descricao" id="text-area" class="w-full bg-white" rows="6"/>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6 font-bold text-white" color="primary" @click="salvar" :disabled="files.length == 0 || obj.descricao == ''">
                Salvar
            </vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import vSelect from 'vue-select'

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
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar,
    },
    data() {
        return {
            files: [],
            images: [],
            isDragging: false,
            error: 0,
            edited: false,
            counterDanger: false,

            obj: {
                descricao: ''
            }
        }
    },
    created() {
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar')
                    // this.$validator.reset()
                    // this.initValues()
                }
            }
        },
    },
    methods: {
        salvar() {
            this.$vs.loading();
            const formData = new FormData();
            this.files.forEach(file => {
                formData.append('arquivo[]', file, file.name);
            });
            formData.append('pre_comissao_id', this.data.id);
            formData.append('descricao', this.obj.descricao);
            this.$store.dispatch('mcomissoes/setAnexos', formData).then(() => {
                this.$emit('closeSidebar');
                this.$vs.loading.close();
            });
        },
        successUpload(event) {
            console.log('evento sucesso', event);
            this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
        },
        errorUpload(event) {
            console.log('evento error', event);
            this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
        },
        removeImg(id) {
            this.images.splice(id, 1);
            this.files.splice(id, 1);
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
            if (!file.type.match('image.*')) {
                this.$toastr.e(`${file.name} is not an image`);
                return;
            }
            this.files.push(file);
            const img = new Image(),
                reader = new FileReader();
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
}
</script>

<style lang="scss" scoped>
.remove-img {
    font-size: 1.5rem;
    position: absolute;
    right: 5px;
    top: 0;
}

.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 5200;
    }

    ::v-deep .vs-sidebar {
        z-index: 52000;
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

.card-images {
    overflow-x: hidden;
    max-height: 300px;
}

.card-images .vx-card__collapsible-content {
    display: flex !important;
    flex-wrap: wrap !important;
}
</style>
<style>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
    opacity: 0;
}

.con-input-upload.disabled-upload {
    display: none;
}

.con-img-upload {
    width: 100%;
    background: unset;
    margin-top: 5px;
    padding-right: 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-column-gap: 5px;
    -moz-column-gap: 5px;
    column-gap: 5px;
}

.con-input-upload {
    background: #ffffff;
    width: 300px;
    height: 300px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
    -webkit-transition: all .25s ease;
    transition: all .25s ease;
    border: 1px dashed rgba(0, 0, 0, .1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0px;
}

.con-img-upload .img-upload {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: rgba(0, 80, 0, .5);
    background: #fff;
    -webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 300px;
    height: 300px;
    margin: 5px;
    cursor: pointer;
}

.vs-con-textarea {
    background: white;
    width: 100%;
    position: relative;
    border: 1px solid rgba(0, 0, 0, .08);
    -webkit-box-shadow: 0 0 0 0 transparent;
    box-shadow: 0 0 0 0 transparent;
    border-radius: 6px;
    -webkit-transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, transform .25s ease, -webkit-transform .25s ease;
    -webkit-transform: translate(0);
    transform: translate(0);
    margin-bottom: 16px;
}
</style>
<style lang="scss" scoped>
.botaofechar {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 5px;
}

.uploader {
    width: 100%;
    background: #fff;
    color: #0c0808;
    padding: 40px 15px;
    text-align: center;
    border-radius: 10px;
    border: 3px dashed #C7C7C7;
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
            cursor: pointer;
        }

        label {
            padding: 2px 5px;
        }
    }

}
</style>