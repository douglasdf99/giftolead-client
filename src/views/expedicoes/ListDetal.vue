<template>
  <div>
    <detalhe v-if="addNewDataSidebar" :expedicao="expedicao" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
             :data="sidebarData"/>
    <div class="vx-row mb-5">
      <div class="vx-col w-full lg:w-3/4">
        <div class="flex items-center justify-around" v-if="expedicao">
          <p class="flex items-center">
            {{expedicao.fechado ? 'fechada' : 'pendente'}}
            <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                     class="ml-5 icon-grande" v-bind:style="{color: expedicao.fechado ? '#4DE98A' : '#E7BE00'}"></vs-icon>
          </p>
          <p>PLP: <b>{{expedicao.plp || 'Sem PLP gerada'}}</b></p>
          <p class="flex items-center">Produto:
            <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor"> {{expedicao.brinde.produto.nome}}</vs-chip>
          </p>
          <p class="flex items-center">Brinde:
            <span> {{expedicao.brinde.nome}}</span>
          </p>
          <p class="flex items-center">Contrato:
            <span> {{expedicao.contrato.nome}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="vx-row flex items-center">
      <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
        <div class="flex items-center">
          <div class="relative w-full">
            <!-- SEARCH INPUT -->
            <form >
              <vs-input autocomplete
                        class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                        v-model="dados.pesquisa" id="dadospesquisa" size="large"
                        placeholder="Pesquisar"/>
              <!-- SEARCH LOADING -->
              <!-- SEARCH ICON -->
              <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                <button type="button" class="btn-search-bar">
                  <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                </button>
                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
              </div>
            </form>
          </div>
        </div>
        <!-- SEARCH INPUT -->
      </div>
    </div>
    <vs-table :data="list" class="table-items">
      <template slot="thead">
        <vs-th></vs-th>
        <vs-th>Destinatário</vs-th>
        <vs-th>E-mail</vs-th>
        <vs-th>Objeto nos correios</vs-th>
        <vs-th>CEP</vs-th>
        <vs-th></vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
          <vs-td class="flex justify-center items-center">
            <vs-dropdown vs-trigger-click>
              <vs-button radius color="#EDEDED" type="filled"
                         class="btn-more-icon relative botao-menu"
                         icon-pack="material-icons" icon="more_horiz"
              ></vs-button>
              <vs-dropdown-menu class="dropdown-menu-list">
                <vs-dropdown-item @click="visualizar(tr)">
                  <vs-icon icon-pack="material-icons" icon="visibility"></vs-icon>
                  Detalhar
                </vs-dropdown-item>
                <vs-dropdown-item @click="imprimir(tr.id)" v-if="expedicao.fechado">
                  <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                  Imprimir Etiqueta
                </vs-dropdown-item>
                <vs-dropdown-item @click="editarEndereco(tr)">
                  <vs-icon icon-pack="material-icons" icon="home"></vs-icon>
                  Editar Endereço
                </vs-dropdown-item>
                <vs-dropdown-item @click="enviarRastreio(tr.id)">
                  <vs-icon icon-pack="material-icons" icon="email"></vs-icon>
                  Enviar Rastreio
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>
          <vs-td><span class="font-bold">{{tr.nome_destinatario}}</span></vs-td>
          <vs-td>{{tr.email_destinatario}}</vs-td>
          <vs-td><span class="cursor-pointer font-bold text-primary"> {{tr.rastreio}} </span></vs-td>
          <vs-td>{{tr.endereco.cep | VMask('##.###-###')}}</vs-td>
          <vs-td class="td-icons flex flex-col items-center justify-center">
            <vs-icon icon-pack="material-icons" icon="check_circle_outline" v-if="tr.erro == null"
                     class="icon-grande font-bold" style="color: #00ACC1"></vs-icon>
            <vs-icon icon-pack="material-icons" icon="highlight_off" v-else
                     class="icon-grande font-bold text-danger"></vs-icon>

          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <transition name="fade">
      <footer-doug>
        <div class="vx-col sm:w-11/12 mb-2">
          <div class="container">
            <div class="vx-row mb-2 relative">
              <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="gerarPlp" v-if="!expedicao.plp">Gerar PLP</vs-button>
              <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="imprimirPlp" v-else>Imprimir PLP</vs-button>
              <vs-dropdown vs-trigger-click>
                <vs-button color="primary" class="text-white px-6 py-4" v-if="expedicao.fechado">Imprimir Etiquetas</vs-button>
                <vs-dropdown-menu class="dropdown-menu-list">
                  <vs-dropdown-item @click="imprimirEtiquetas('single')">
                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                    Imprimir 4x4
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="imprimirEtiquetas('multi')">
                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                    Imprimir A4
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
              <vs-button class="ml-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                         @click="$router.push({path: '/brindes/expedicoes'})">
                Voltar
              </vs-button>
            </div>
          </div>
        </div>
      </footer-doug>
    </transition>
    <vs-popup class="popup-iframe" style="overflow: hidden" title="Imprimindo etiquetas" :active.sync="modalIframe">
      <iframe :src="urlIframe" width="100%" height="100%" title="Imprimindo Etiqueta"></iframe>
    </vs-popup>
    <vs-popup class="popup-endereco" style="overflow: hidden" title="Editando endereço" :active.sync="modalEndereco">
      <div class="">
        <div class="p-6 pt-0">
          <h3 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 my-3">Suas informações pessoais</h3>
          <form class="w-full px-6">
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Destinatário</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" v-model="endereco.nome" type="text" required/>
            </div>
            <div class="vx-row mt-2">
              <div class="vx-col w-3/12">
                <p class="gray-wdc mb-2 text-lg font-bold">DDD</p>
                <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                          v-model="endereco.ddd" type="text" required v-mask="'##'" @keypress="isNumber"/>
              </div>
              <div class="vx-col w-9/12">
                <p class="gray-wdc mb-2 text-lg font-bold">Telefone</p>
                <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                          v-model="endereco.telefone" type="text" required v-mask="['####-####', '#####-####']" @keypress="isNumber"/>
              </div>
            </div>
          </form>
          <h3 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 mb-3 mt-5">Suas informações de entrega</h3>
          <form class="w-full px-6 vs-con-loading__container" @submit="buscaCep" id="div-with-loading">
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">CEP (CÓDIGO POSTAL)</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                        v-model="endereco.cep" type="text" required @keypress="isNumber" v-mask="'########'"/>
            </div>
            <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4" v-if="!valido" type="submit">
              Buscar
            </vs-button>
            <div class="flex flex-col mt-8">
              <p class="gray-wdc mb-2 text-lg font-bold">Estado</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.estado"
                        :disabled="true"/>
            </div>
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Cidade</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.cidade"
                        :disabled="true"/>
            </div>
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Bairro</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.bairro"
                        :disabled="true"/>
            </div>
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Endereco</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.endereco"
                        :disabled="true"/>
            </div>
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Complemento</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.complemento"/>
            </div>
            <div class="flex flex-col">
              <p class="gray-wdc mb-2 text-lg font-bold">Número</p>
              <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.numero" @keypress="isNumber"/>
            </div>
            <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4" type="submit" @click="storeEndereco"
                       :disabled="invalidoEntrega">
              Confirmar dados
            </vs-button>
          </form>
        </div>
      </div>
    </vs-popup>
    <!-- inicio popup-->
    <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="" v-show="modalGerarPlp">
      <div class="vs-popup--background"></div>
      <div class="vs-popup" style="background: rgb(255, 255, 255);">
        <header class="vs-popup--header">
          <div class="vs-popup--title">
          </div>
        </header>
        <div class="vs-popup--content">
          <div class="vx-col w-full">
            <vx-card class="p-2">
              <div class="text-left mb-10">
                <h2 class="text-center"> Gerando PLP </h2>
                <h6 class="mb-2 mt-4"><b>Numero da Expedição :</b> #{{expedicao.id}}</h6>
                <h6 class="mb-2"><b>Brinde a ser enviado :</b> {{expedicao.brinde.nome}}</h6>
                <h6 class="mb-2 flex"><b>Pertencente ao produto :</b>
                  <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor">{{expedicao.brinde.produto.nome}}</vs-chip>
                </h6>
                <p class="mb-2"></p>
              </div>
              <vs-divider/>

              <div class="flex items-center">
                <div class="fill-row-loading w-full" v-if="step == 0">
                  <h6 class="mb-6"><b>Status atual:</b> <span> Verificando etiquetas </span></h6>
                  <h6 class="text-center mb-2"> {{count}}/{{expedicao.automacaos.length}} </h6>
                  <vs-progress :height="12" :percent="percent" color="success"></vs-progress>

                </div>

                <!--                steep2-->
                <div class="fill-row-loading w-full" v-if="step == 1">
                  <div class="" v-if="!plpGerada">
                    <h6 class="mb-6"><b>Status atual:</b> <span> Realizando comunicação com o sistema de correios </span></h6>
                    <vs-progress indeterminate color="primary"></vs-progress>
                  </div>
                  <div class="" v-if="plpGerada == 5">
                    <h6 class="mb-6"><b>Status atual:</b> <span class="text-daner"> A PLP não pode ser gerada </span></h6>
                    <vs-divider border-style="dotted" color="primary">Detalhamento</vs-divider>
                    <div class="" v-if="automacaosErros.length > 0">
                      <h6 class="mb-6"><b></b></h6>
                      <vs-list-header :title="'Etiquetas com erro ('+ automacaosErros.length +') :'"></vs-list-header>
                      <vs-list-item  v-for="(automacao, index) in automacaosErros" :key="index" :title="automacao.nome_destinatario" :subtitle="automacao.email_destinatario">
                        <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled"
                                   icon-pack="material-icons" icon="remove_red_eye">
                        </vs-button>
                      </vs-list-item>
                      <div class="flex justify-center flex-wrap mt-10">
                        <vs-button color="warning" type="filled" icon-pack="material-icons" icon="close" @click="atualiza">Fechar</vs-button>
                        <vs-button color="warning" type="filled" icon-pack="material-icons" icon="sync" @click="gerarPlp">Tentar novamente</vs-button>
                      </div>
                    </div>
                    <div class="" v-else>
                      <h5 class="text-danger text-center" v-if="erroMensage">{{erroMensage}}</h5>
                      <h5 class="text-danger text-center" v-else>Por favor tente novamente mais tarde</h5>
                    </div>
                  </div>
                  <div class="" v-if="plpGerada == 10">
                    <h6 class="mb-6"><b>Status atual:</b> <span class="text-daner"> PLP GERADA </span></h6>
                    <h5 class="text-center text-success"> PLP GERADA COM SUCESSO!</h5>
                    <vs-progress :height="12" :percent="100" color="success"></vs-progress>
                    <div class="flex justify-center flex-wrap mt-10">
                      <vs-button color="success" type="filled" icon-pack="material-icons" icon="call_made" @click="atualiza">Ir para Expedição</vs-button>
                    </div>
                  </div>
                </div>
              </div>
            </vx-card>
          </div>
        </div>
      </div>
    </div>
    <!-- fim popup-->
  </div>
</template>

<script>
  import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
  import detalhe from './Detalhe'
  import saveleadsConfig from "../../../saveleadsConfig";

  const {consultarCep} = require("correios-brasil");

  export default {
    name: "ListDetal",
    channel: `laravel_database_listarautomacao`,
    components: {
      detalhe
    },
    data() {
      return {
        expedicao: {
          brinde: {
            produto: {}
          },
          automacaos: [],
          contrato: {}
        },
        automacaosErros: [],
        city_id: '',
        dados: {
          pesquisa: '',
        },
        //Iframe de impressões
        modalIframe: false,
        urlIframe: '',

        //Editando endereco
        modalEndereco: false,
        modalGerarPlp: false,
        percent: 0,
        count: 0,
        step: 0,
        erroMensage: false,
        plpGerada: false,
        endereco: {
          telefone: ''
        },
        valido: true,
        antigoCep: '',

        // Data Sidebar
        addNewDataSidebar: false,
        sidebarData: {},
      }
    },
    mounted() {
      this.channel.listen('ListarAutomacao', (e) => {
        console.log('teste');
        console.log(e);
        if (this.step < 1) {
          if (e.automacao.status == 'fechado') {
            this.count++
            this.percent = (this.count / this.expedicao.automacaos.length) * 100;
            console.log(this.count, this.percent);
          }
          if (e.automacao.status == 'error') {
            this.count++
            this.percent = (this.count / this.expedicao.automacaos.length) * 100;
            console.log(this.count, this.percent);
            this.automacaosErros.push(e.automacao);
          }
        }

        if (e.automacao.status == 'sucesso') {
          this.plpGerada = 10
        }

        if (e.automacao.status == 'ngerada') {
          if (e.automacao.erroMensage) {
            this.erroMensage = e.automacao.erroMensage
          }
          this.plpGerada = 5
        }

        if (this.percent == 100) {
          this.step++;
          this.percent = 0;
          this.count = 0;
        }
      });
    },
    created() {
      if (!moduleExpedicoesBrindes.isRegistered) {
        this.$store.registerModule('expedicao', moduleExpedicoesBrindes);
        moduleExpedicoesBrindes.isRegistered = true;
      }

      this.getId(this.$route.params.id);
      console.log('valido', this.valido)
    },
    methods: {

      getId(id) {
        this.$vs.loading();
        this.$store.dispatch('expedicao/getId', id).then(response => {
          console.log(response);
          this.expedicao = {...response};
          this.$vs.loading.close();
        });
      },
      atualiza(){
        this.modalGerarPlp = false;
        this.getId(this.expedicao.id);
        this.$vs.loading.close();

      },
      pesquisar(e) {
        e.preventDefault();
        this.$vs.loading();
        this.getId(this.$route.params.id);
      },
      toggleDataSidebar(val = false) {
        this.addNewDataSidebar = val
      },
      visualizar(obj) {
        this.sidebarData = obj
        this.toggleDataSidebar(true);
      },
      imprimir(id) {
        this.modalIframe = true;
        this.urlIframe = saveleadsConfig.url_api + `/expedicaos/imprimiretiqueta?expedicao_id=${this.$route.params.id}&automacao_id=${id}&tipo=multi`;
      },
      imprimirEtiquetas(tipo) {
        this.modalIframe = true;
        this.urlIframe = saveleadsConfig.url_api + `/expedicaos/imprimiretiqueta?expedicao_id=${this.$route.params.id}&tipo=${tipo}`;
        console.log('url', this.urlIframe);
      },
      enviarRastreio(id) {
        this.$vs.loading();
        this.$store.dispatch('expedicao/enviarRastreio', {expedicao_id: this.expedicao.id, automacao_id: id}).then(() => {
          this.$vs.notify({
            color: 'success',
            text: 'Rastreio enviado com sucesso.'
          });
          this.getId(this.expedicao.id);
        }).catch(erro => {
          console.log('erro', erro);
          this.$vs.notify({
            color: 'danger',
            text: 'Algo deu errado. Contate o suporte'
          });
          this.$vs.loading.close();
        });
      },
      gerarPlp() {
        // this.$vs.loading();
        this.modalGerarPlp = true
        this.$store.dispatch('expedicao/gerarPlp', this.expedicao.id).then(() => {

        }).catch(erro => {
          console.log('erro', erro);
          this.$vs.notify({
            color: 'danger',
            text: 'Algo deu errado ao gerar a PLP. Contate o suporte'
          });

        });
      },
      imprimirPlp() {
        this.modalIframe = true;
        this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimirplp?expedicao_id=' + this.$route.params.id;
      },

      //Editar endereço da automação
      editarEndereco(obj) {
        this.endereco = {...obj.endereco};
        this.endereco.ddd = this.endereco.telefone.substring(0, 2);
        this.endereco.telefone = this.endereco.telefone.replace(this.endereco.ddd, '');
        this.modalEndereco = true;
      },
      buscaCep(e) {
        e.preventDefault();
        if (this.valido) {
          console.log('teste')
        } else {
          this.endereco.complemento = '';
          this.endereco.numero = '';
          consultarCep(this.endereco.cep).then(response => {
            console.log('resposta', response);
            this.valido = true;
            this.antigoCep = this.endereco.cep;
            this.endereco.cidade = this.removeAccents(response.localidade);
            this.endereco.bairro = this.removeAccents(response.bairro);
            this.endereco.endereco = this.removeAccents(response.logradouro);
            this.endereco.estado = this.removeAccents(response.uf);
          }).catch(erro => {
            console.log(erro);
            this.$vs.notify({
              title: '',
              color: 'danger',
              text: erro.message
            })
          });
        }
      },
      storeEndereco() {
        this.endereco.nome = this.removeAccents(this.endereco.nome);
      }
    },
    computed: {
      invalidoEntrega() {
        return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length <= 8)
      },
      list(){
        return this.expedicao.automacaos.filter(automacao => {
          return automacao.email_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) || automacao.rastreio.toLowerCase().includes(this.dados.pesquisa.toLowerCase())|| automacao.nome_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase())
        })
      }
    },
    watch: {
      endereco: {
        handler: function (e) {
          if (e.cep != this.antigoCep) {
            this.valido = false;
          }
        },
        deep: true
      }
    }
  }
</script>

<style>
  .popup-iframe .vs-popup {
    width: 100vw !important;
    height: 100vh !important;
  }

  .popup-iframe .vs-popup--content {
    height: 100% !important;
    overflow: hidden;
  }

  .popup-endereco .vs-popup--content {
    background-color: rgb(238 232 232) !important;
    margin-top: 0;
  }
</style>
