<template>
  <div>
    <h4 class="font-bold mb-10 mt-20">Dados do contrato
    </h4>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-2/3 w-full mb-2">
        <div class="vx-row mb-6">
          <div class="vx-col w-full mb-2">
            <span class="font-regular mb-2">Nome de Contrato</span>
            <input class="vs-inputx vs-input--input large hasValue" size="large" v-validate="'required'"
                   name="nome" v-model="item.nome" type="text"/>
            <span class="text-danger text-sm"
                  v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <span class="font-regular mb-2">Cartão de postagem</span>
            <vs-input class="w-full" v-validate="'required'" name="cartaoPostagem"
                      v-model="item.cartaoPostagem" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('cartaoPostagem')">{{ errors.first('cartaoPostagem') }}</span>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <span class="font-regular mb-2">Número do contrato</span>
            <vs-input class="w-full" v-validate="'required'" name="contrato" v-model="item.contrato" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('contrato')">{{ errors.first('contrato') }}</span>

          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <span class="font-regular mb-2">Usuário SIGEP WEB</span>
            <vs-input class="w-full" v-validate="'required'" name="usuario" v-model="item.usuario" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('usuario')">{{ errors.first('usuario') }}</span>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <span class="font-regular mb-2">Senha SIGEP WEB</span>
            <vs-input class="w-full" v-validate="'required'" name="senha" v-model="item.senha" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('senha')">{{ errors.first('senha') }}</span>
          </div>
        </div>
        <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
          <u class="py-2"><span class="font-14 text-primary font-bold ml-2 mr-2">Logar no sistema do correios </span></u>
          <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="sync"></vs-button>
        </div>
      </div>
      <div class="vx-col sm:w-1/3 w-full mb-2">
        <div class="mb-6 p-5 pt-0">
          <span class="font-regular mb-3 ml-2">Logotipo da etiqueta</span>
          <div style="width: 100%;     margin-top: 4px;" @dragenter="OnDragEnter"
               @dragleave="OnDragLeave"
               @dragover.prevent
               @drop="onDrop"
               :class="{ dragging: isDragging }">
            <vx-card class="grid-view-item mb-base overflow-hidden" v-if="item.logotipo && !images.length">
              <template slot="no-body">
                <!-- ITEM IMAGE -->
                <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer">
                  <img :src="url_api(item.logotipo)" style="width: 200px" alt="logotipo" class="grid-view-img px-4">
                </div>
                <div class="item-details px-4">
                </div>
                <div class="flex flex-wrap">
                  <label
                    class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                    for="file">
                    <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                    <label class="text-sm font-semibold ml-2" for="file">Alterar Logotipo</label>
                  </label>
                </div>
              </template>
            </vx-card>
            <vx-card class="grid-view-item mb-base overflow-hidden" v-show="images.length">
              <template slot="no-body">
                <!-- ITEM IMAGE -->
                <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer"
                     v-for="(image, index) in images" :key="index">
                  <img :src="image" style="width: 200px" alt="logotipo" class="grid-view-img px-4">
                </div>
                <div class="item-details px-4">
                </div>
                <div class="flex flex-wrap">
                  <label
                    class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                    for="file">
                    <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                    <label class="text-sm font-semibold ml-2" for="file">Alterar Logotipo</label>
                  </label>
                </div>
              </template>
            </vx-card>
            <div class="uploader" v-show="!item.logotipo">
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
      <vs-divider></vs-divider>
    </div>

    <h4 class="font-bold mb-8">Configurações das formas de frete</h4>

    <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
      <u class="py-2"><span class="font-14 text-black font-bold ml-2 mr-2">Buscar formas de frete deste contrato </span></u>
      <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="sync"></vs-button>
    </div>
    <div class="row">
      <div class="col-12">
        <vs-alert :active="true" color="danger" icon-pack="feather" icon="icon-info">
          <span>Atenção, é nescessário selecionar o serviço padrão do Contrato</span>
        </vs-alert>
      </div>
    </div>
    <div class="col-12 mb-20" v-if="item.servicos.length > 0">
      <div class="com-item">
        <vs-table :data="item" class="table-items  mt-4" style="z-index: 2">

          <template slot="thead">
            <vs-th>Descricao</vs-th>
            <vs-th>Código do serviço</vs-th>
            <vs-th>Padrão</vs-th>
          </template>

          <template slot-scope="{}">
            <vs-tr :key="servico.id" v-for="servico in item.servicos" class="mb-3">
              <vs-td :data="servico.descricao">
                <span class="destaque">{{servico.descricao }}</span>
              </vs-td>
              <vs-td :data="servico.codigo">
                <span class="destaque">{{servico.codigo}}</span>
              </vs-td>
              <vs-td >
                <p class="mb-1 mt-2 mt-sm-0 font-weight-bold text-dark" v-if="item.config_padrao">
                  <a v-if="servico.codigo === item.config_padrao.servico" class="text-dark"><span class="material-icons">star</span></a>
                  <a v-else  :class="{'disabled' : salvando}"  @click="setPadrao(servico)" style="cursor: pointer;" class="text-dark">
                    <span class="material-icons">star_outline</span>
                  </a>
                </p>
                <a v-else class="" :class="{'disabled' : salvando}"  @click="setPadrao(servico)" style="cursor: pointer;">
                  <span class="material-icons">star_outline</span>
                </a>
              </vs-td>
            </vs-tr>
          </template>

        </vs-table>
      </div>
    </div>
    <div class="col-12 mb-20" v-else>
      <div class="card-box mb-0">
        <div class="row align-items-center">
          <div class="col-sm-12">
            <p class="mb-1 mt-2 mt-sm-0 font-weight-bold text-center text-dark">
              Nenhum serviço encontrado</p>
          </div>
        </div> <!-- end row -->
      </div>
    </div>

    <h4 class="font-bold mb-2">Exceções</h4>
    <h6 class="font-regular mb-8">Voocê pode criar regras alternativas de serviço postal para entregas diferenciadas</h6>
    <vx-card :key="config.id" v-for="(config, index) in item.configs">
      <span class="btn btn-dark btn-rounded font-13 text-white font-weight-bold text-ou" v-if="index > 0"><vs-button size="small" color="dark">OU</vs-button></span>
      <div class="vx-row">
        <div class="vx-col sm:w-1/12 w-full mb-2">
          <vs-dropdown vs-trigger-click>
            <vs-button radius color="#EDEDED" type="filled"
                       class="btn-more-icon relative botao-menu"
                       icon-pack="material-icons" icon="more_horiz"
            ></vs-button>
            <vs-dropdown-menu class="dropdown-menu-list">
              <vs-dropdown-item @click="updateData(config.id)">
                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                Editar
              </vs-dropdown-item>

              <vs-dropdown-item @click="deletar(config.id)">
                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                Deletar
              </vs-dropdown-item>

            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
        <div class="vx-col sm:w-1/12 w-full mb-2">
          <span class="rounded-full bg-primary py-2 px-2 text-enum text-white font-bold">{{index + 1}}</span>
        </div>
        <div class="vx-col sm:w-4/12 w-full mb-2">
          <p class="mb-0 text-base font-bold">Tipo</p>
          {{selectedtipo(config.tipo)}}
        </div>
        <div class="vx-col sm:w-3/12 w-full mb-2">
        <p class="mb-0 text-base font-bold">Variável</p>
          {{config.variavel}}
        </div>
        <div class="vx-col sm:w-3/12 w-full mb-2">
        <p class="mb-0 text-base font-bold">Serviço Aplicado</p>
          <span class="font-15 font-weight-bold">{{config.servico}}</span>
        </div>
      </div>
      <!-- end row -->
    </vx-card>

    <div class="vx-row justify-center align-center mt-10">
      <vs-button color="primary" type="filled" icon-pack="material-icons" icon="control_point" class="font-bold">Adicionar Exceção</vs-button>

    </div>

    <div class="mt-20">
      <vs-divider></vs-divider>
      <h4 class="font-bold mt-8 mb-8">Configurações de remetente do contrato</h4>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full mb-2">
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">Nome do remetente</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteNome"
                      v-model="item.remetenteNome" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteNome')">{{ errors.first('remetenteNome') }}</span>
          </div>
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">CEP</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteCep" v-model="item.remetenteCep" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteCep')">{{ errors.first('remetenteCep') }}</span>
          </div>
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">Cidade</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteCidade" v-model="item.remetenteCidade" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteCidade')">{{ errors.first('remetenteCidade') }}</span>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full mb-2">
            <span class="font-regular mb-2">Endereço</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteEndereco"
                      v-model="item.remetenteEndereco" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteEndereco')">{{ errors.first('remetenteEndereco') }}</span>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">Bairro</span>
            <vs-input class="w-full" v-validate="'required'" name="usuario" v-model="item.remetenteBairro" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteBairro')">{{ errors.first('remetenteBairro') }}</span>
          </div>
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">Unidade Federativa</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteEstado" v-model="item.remetenteEstado" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteEstado')">{{ errors.first('remetenteEstado') }}</span>
          </div>
          <div class="vx-col sm:w-1/3 w-full mb-2">
            <span class="font-regular mb-2">Número</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteNumero" v-model="item.remetenteNumero" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteNumero')">{{ errors.first('remetenteNumero') }}</span>
          </div>
        </div>

        <div class="vx-row mb-20">
          <div class="vx-col w-full mb-2">
            <span class="font-regular mb-2">Complemento</span>
            <vs-input class="w-full" v-validate="'required'" name="remetenteComplemento"
                      v-model="item.remetenteComplemento" size="large"/>
            <span class="text-danger text-sm" v-show="errors.has('remetenteComplemento')">{{ errors.first('remetenteComplemento') }}</span>
          </div>
        </div>
      </div>
    </div>


    <transition name="fade">
      <footer-doug >
        <div class="vx-col sm:w-11/12 mb-2">
          <div class="container">
            <div class="vx-row mb-2 relative">
              <vs-button class="mr-3" color="primary" type="filled" @click="updateEmpresa">Salvar</vs-button>
              <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"  @click="$router.push({name: 'contratos'})">Cancelar</vs-button>
            </div>
          </div>
        </div>
      </footer-doug>
    </transition>
  </div>

</template>

<script>
  import moduleContrato from '@/store/contratos/moduleContrato.js'
  // register custom messages
  import {Validator} from 'vee-validate';
  import vSelect from 'vue-select'


  const dict = {
    custom: {
      razao_social: {
        required: 'Por favor, insira a razão social',
      },
      cnpj: {
        required: 'Por favor, insira o cnpj',
      },
      email: {
        required: 'Por favor, insira o email comercial',
        email: 'O email informado está com formato inválido'
      },
      site: {
        required: 'Por favor, insira o website da empresa',
      },
      descricao: {
        max: 'O limite máximo da descrição foi atingido',
      },
      rodape: {
        max: 'O limite máximo do rodapé foi atingido',
      }
    }
  };
  Validator.localize('pt-br', dict);
  export default {
    components: {
      'v-select': vSelect,
    },
    data: () => ({
      name: "DadosEmpresa",
      item: {
        razao: '',
        cnpj: '',
        email: '',
        site: '',
        descricao: '',
        rodape: '',
      },
      estados: [
        { value: '', text: "Selecione um estado" },
        { value: "AC", text: "Acre" },
        { value: "AL", text: "Alagoas" },
        { value: "AP", text: "Amapá" },
        { value: "AM", text: "Amazonas" },
        { value: "BA", text: "Bahia" },
        { value: "CE", text: "Ceará" },
        { value: "DF", text: "Distrito Federal" },
        { value: "ES", text: "Espírito Santo" },
        { value: "GO", text: "Goiás" },
        { value: "MA", text: "Maranhão" },
        { value: "MT", text: "Mato Grosso" },
        { value: "MS", text: "Mato Grosso do Sul" },
        { value: "MG", text: "Minas Gerais" },
        { value: "PA", text: "Pará" },
        { value: "PB", text: "Paraíba" },
        { value: "PR", text: "Paraná" },
        { value: "PE", text: "Pernambuco" },
        { value: "PI", text: "Piauí" },
        { value: "RJ", text: "Rio de Janeiro" },
        { value: "RN", text: "Rio Grande do Norte" },
        { value: "RS", text: "Rio Grande do Sul" },
        { value: "RO", text: "Rondônia" },
        { value: "RR", text: "Roraima" },
        { value: "SC", text: "Santa Catarina" },
        { value: "SP", text: "São Paulo" },
        { value: "SE", text: "Sergipe" },
        { value: "TO", text: "Tocantins" }
      ],
      brindes: {},
      empresaOld: {},
      files: [],
      images: [],
      isDragging: false,
      error: 0,
      edited: false,
      counterDanger: false,
      salvando: false
    }),

    created() {
      this.getBrindes();
      if (!moduleContrato.isRegistered) {
        this.$store.registerModule('contratos', moduleContrato)
        moduleContrato.isRegistered = true
      }
      if (this.$route.name === 'contratos-editar') {
        this.getContrato(this.$route.params.id);
      }
      else {

      }
    },

    computed: {

      empresaDb() {
        return this.$store.state.empresa.empresa;
      }
    },
    mounted() {
      this.verifica();
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
    methods: {
      getBrindes(){

      },
      selectedtipo(config) {
        if (config == 'estado') {
          return 'Quando o estado for';

        }
        if (config == 'brinde'){
          return 'Quando o brinde for';

        }
      },
      successUpload(event) {
        console.log('evento sucesso', event);

        this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
      },
      errorUpload(event) {
        console.log('evento error', event);
        this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
      },
      verifica() {/*
        if (JSON.stringify(this.empresaOld) === JSON.stringify(this.empresa)) {
          this.edited = false;
        } else {
          this.edited = true;
        }*/
        console.log('funcao de verificacao')

      },
      getContrato(id) {
        this.$vs.loading()
        this.$store.dispatch('contratos/getId', id).then(data => {

          this.item = {...data};
          console.log(this.item)
          this.$vs.loading.close();

        })
      },
      updateEmpresa() {
        this.salvando=true;
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$vs.loading();
            const formData = new FormData();
            this.files.forEach(file => {
              formData.append('logotipo', file, file.name);
            });
            formData.append('_method', 'PUT');
            formData.append('nome', this.item.nome);
            formData.append('cartaoPostagem', this.item.cartaoPostagem);
            formData.append('contrato', this.item.contrato);
            formData.append('usuario', this.item.usuario);
            formData.append('senha', this.item.senha);
            formData.append('cnpj', this.item.cnpj);
            formData.append('remetenteNome', this.item.remetenteNome);
            formData.append('remetenteCep', this.item.remetenteCep);
            formData.append('remetenteCidade', this.item.remetenteCidade);
            formData.append('remetenteEndereco', this.item.remetenteEndereco);
            formData.append('remetenteBairro', this.item.remetenteBairro);
            formData.append('remetenteEstado', this.item.remetenteEstado);
            formData.append('remetenteNumero', this.item.remetenteNumero);
            formData.append('remetenteComplemento', this.item.remetenteComplemento);

            this.$store.dispatch('contratos/update', {id: 1, dados: formData})
              .then(() => {
                console.log('enviou')
                this.$vs.loading.close();
                this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Dados alterados com sucesso'})
              })
              .catch(error => {
                this.$vs.loading.close();
                this.$vs.notify({
                  title: 'Error',
                  text: error.message,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
                })
              }).finally(()=>{
              this.salvando=false;
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
        this.salvando = false;
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
        this.item.logotipo = file;
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
    }

  }
</script>

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
  .text-enum{
    height: 3rem;
    width: 3rem;
    font-size: 2rem;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    margin-right: 6px;
  }
  .text-ou{
    position: absolute;
    left: calc(50% - 127px/2);
    top: -19px;
    width: 127px;
    height: 34px;
  }
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
        cursor: pointer;
      }

      label {
        padding: 2px 5px;
      }
    }

  }
</style>
