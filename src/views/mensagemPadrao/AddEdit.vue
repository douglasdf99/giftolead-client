<template>
  <div>
    <div class="vx-row mb-4">
      <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{mensagem.status ? 'Ativado' : 'Desativado'}}</span>
        <vs-switch vs-icon-on="check" color="#0FB599" v-model="mensagem.status" class="float-right switch"/>
        <!--<span class="float-right mt-1 mx-4" style="font-weight: bold">Status</span>-->
      </div>
    </div>
    <div class="vx-row mb-3">
      <div class="vx-col w-full xlg:w-8/12 lg:w-8/12">
        <div class="vx-row mb-3">
          <div class="vx-col w-full lg:w-5/12 md:w-1/2">
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
            <vs-textarea v-model="mensagem.mensagem" id="text-area" class="w-full bg-white" rows="6"/>
          </div>
          <div class="vx-col w-full" v-else>
            <span class="font-regular mb-2">Mensagem</span>
            <quill-editor id="quill-editor" v-model="mensagem.mensagem_email" class="bg-white"
                          @ready="onEditorReady($event)"></quill-editor>
          </div>
        </div>
      </div>
      <div class="vx-col w-full xlg:w-4/12 lg:w-4/12">
        <div class="mb-3 p-5 pt-0">
          <span class="font-regular">Inserir no corpo da mensagem:</span>
          <ul class="variaveis-msg">
            <li class="variavel" @click="addVarText('[NOME_LEAD]')">
              <span>Nome do Lead</span>
            </li>
            <li class="variavel" @click="addVarText('[NOME_ATENDENTE]')">
              <span>Nome do Atendente</span>
            </li>
            <li class="variavel" @click="addVarText('[NOME_PRODUTO]')">
              <span>Nome do Produto</span>
            </li>
            <li class="variavel" @click="addLinkCheckoutVarText">
              <span>Links do Sistema</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <transition name="fade">
      <footer-doug>
        <div class="vx-col sm:w-11/12 mb-2">
          <vs-button class="float-rightmr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                     @click="$router.push({name: 'mensagem-padrao'})">
            Cancelar
          </vs-button>
          <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
            Salvar
          </vs-button>
        </div>
      </footer-doug>
    </transition>
    <vs-prompt
      @cancel="clearValMultiple"
      @accept="selectLink"
      @close="close"
      :acceptText="'Salvar'"
      :cancelText="'Cancelar'"
      title="Selecionar link"
      :max-width="'600px'"
      :active.sync="modal">
      <div class="con-exemple-prompt">
        <div class="mt-3">
          <span class="font-regular mb-2">Link</span>
          <v-select v-model="linkSelected" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                    :options="links" v-validate="'required'" name="tipo"/>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
  import vSelect from 'vue-select'
  import moduleMensagem from '@/store/mensagemPadrao/moduleMensagem.js'
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
      if (!moduleMensagem.isRegistered) {
        this.$store.registerModule('mensagem', moduleMensagem)
        moduleMensagem.isRegistered = true
      }
      this.getOpcoes();

      if (this.$route.name === 'mensagem-padrao-editar') {
        this.funcaoSelected = {id: null, label: ''};
        this.getMensagem(this.$route.params.id);
      }

      this.$store.dispatch('getLinks').then(response => {
        let arr = [...response];
        arr.forEach(item => {
          this.links.push({id: item.identidade, label: item.descricao});
        });
      });
    },
    data() {
      return {
        mensagem: {
          empresa_id: 1,
          tipo: 'whatsapp',
          titulo: '',
          assunto: '',
          mensagem: '',
          mensagem_email: '',
          status: true
        },
        editor: '',
        selectTipo: {id: 'whatsapp', label: 'WhatsApp'},
        tipos: [{id: 'whatsapp', label: 'WhatsApp'}, {id: 'email', label: 'E-mail'}],
        modal: false,
        links: [],
        linkSelected: {id: null, label: 'Selecione o link'}
      }
    },
    methods: {
      addLinkCheckoutVarText() {
        this.modal = true;
      },
      clearValMultiple() {
        this.linkSelected = {id: null, label: 'Selecione o link'};
      },
      selectLink() {
        this.addVarText('[LINK_' + this.linkSelected.id + ']');
        this.linkSelected = {id: null, label: 'Selecione o link'};
      },
      close() {
        this.modal = false;
      },
      salvar() {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$vs.loading();
            const formData = new FormData();
            formData.append('tipo', this.mensagem.tipo);
            formData.append('titulo', this.mensagem.titulo);
            if (this.mensagem.assunto)
              formData.append('assunto', this.mensagem.assunto);
            if (this.mensagem.tipo === 'whatsapp')
              formData.append('mensagem', this.mensagem.mensagem);
            else
              formData.append('mensagem', this.mensagem.mensagem_email);

            formData.append('status', (this.mensagem.status ? 1 : 0));

            if (this.mensagem.id !== undefined) {
              formData.append('_method', 'PUT');
              this.$store.dispatch('mensagem/update', {
                dados: formData,
                id: this.mensagem.id
              }).then(response => {
                console.log('response', response);
                this.$vs.notify({
                  title: 'Sucesso',
                  text: "Atualizado com sucesso.",
                  iconPack: 'feather',
                  icon: 'icon-check-circle',
                  color: 'success'
                });
                this.$router.push({name: 'mensagem-padrao'});
              }).catch(erro => {
                this.$vs.notify({
                  title: 'Error',
                  text: erro.response.data.message,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
                })
              })
            } else {
              this.$store.dispatch('addItem', {item: formData, rota: 'mensagem_padraos'}).then(response => {
                console.log('response', response);
                this.$vs.notify({
                  title: 'Sucesso',
                  text: "Criado com sucesso.",
                  iconPack: 'feather',
                  icon: 'icon-check-circle',
                  color: 'success'
                });
                this.$router.push({name: 'mensagem-padrao'});
              }).catch(erro => {
                this.$vs.notify({
                  title: 'Error',
                  text: erro.response.data.message,
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
      getOpcoes() {
        this.opcoesFuncoes = [];
        /*this.$store.dispatch('contas/get').then(response => {
            let arr = [...response];
            arr.forEach(item => {
                this.opcoesFuncoes.push({id: item.id, label: item.nome})
            });
        })*/
      },
      getMensagem(id) {
        this.$vs.loading()
        this.$store.dispatch('mensagem/getId', id).then(data => {
          this.mensagem = {...data};
          if (this.mensagem.tipo === 'email')
            this.mensagem.mensagem_email = this.mensagem.mensagem;
          this.selectTipo = {id: this.mensagem.tipo, label: this.mensagem.tipo}
          this.$vs.loading.close();

        })
      },
      addVarText(value) {
        if (this.mensagem.tipo == 'whatsapp') {
          //Text Area
          var $txt = document.getElementById('text-area');
          var textAreaTxt = $txt.value;
          var caretPos = $txt.selectionStart;
          $txt.value = (textAreaTxt.substring(0, caretPos) + value + textAreaTxt.substring(caretPos));
          this.mensagem.mensagem = $txt.value;
        } else {
          //Quill Editor
          var $txt2 = this.editor.getSelection(true);
          this.editor.insertText($txt2.index, value, '', true);
        }
      },
      onEditorReady(editor) {
        console.log('editor', editor.getSelection());
        this.editor = editor;
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
      selectTipo(val) {
        this.mensagem.tipo = val.id
      }
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
