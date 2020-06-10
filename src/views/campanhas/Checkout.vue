<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{campanha.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da campanha</span>
                <vs-input class="w-full" v-model="campanha.nome" size="large" name="nome"/>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Produto da campanha</span>
                <vs-input class="w-full" v-model="campanha.produto.nome" size="large" name="produto" disabled/>
            </div>
        </div>
        <div class="vx-row my-10">
            <div class="vx-col w-full lg:w-7/12">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">Checkout no Hotmart (página de obrigado)</span>
                        <vs-input class="w-full" id="search_input_trans" v-model="campanha.checkout" placeholder="https://" size="large" name="nome"/>
                    </div>
                    <div class="vx-col w-full relative">
                        <i class="material-icons text-white mt-5" id="copy-icon" @click="copyText">file_copy</i>
                        <prism language="markup" class="rounded-lg">
                          {{formularioinfusion()}}

&lt;script type="text/javascript" src="https://cr244.infusionsoft.app/app/webTracking/getTrackingCode"&gt; &lt;/script&gt;
&lt;script type="text/javascript" src="https://cr244.infusionsoft.com/app/timezone/timezoneInputJs?xid={{campanha.form_id}}"&gt; &lt;/script&gt;


&lt;script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"&gt; &lt;/script&gt;


&lt;script&gt;
$(document).ready(function() {
  $('#{{campanha.form_id}}').submit(function(e) {
    let serializeDados = $('#{{campanha.form_id}}').serialize();

      $.ajax({
        url: 'https://saveleads.com.br/form_brinde',
        dataType: 'html',
        type: 'POST',
        data: serializeDados,
        success: function(data, textStatus) {
          console.log('enviou sistema');
        },
        error: function(xhr,er) {
          console.log('erro sistema',v);
        }
      });

  });
})
&lt;/script&gt;

                        </prism>

                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-5/12">

                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Nº de contatos na campanha</span>
                            <p class="font-bold text-3xl my-5">1456</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Vendas recuperadas</span>
                            <p class="font-bold text-3xl my-5">23</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Valor recuperado</span>
                            <p class="font-bold text-3xl my-5">R$ {{formatPrice(35424.43)}}</p>
                        </vx-card>
                    </div>
                </div>
            </div>

        </div>
      <div class="vx-row ">
          <div class="vx-col w-full">
            <div class="my-8">
              <vs-checkbox color="dark" v-model="campanha.infusion"><span class="label-bold-underline">Integrar este formulário com minha ferramenta de e-mail</span>
              </vs-checkbox>
              <small class="flex mt-2 ml-3"><i class="material-icons text-base mr-2">info_outline</i>Esta opção habilita a a associação com sua ferramenta de e-mail</small>
            </div>
          </div>
      </div>
      <vx-card>
        <div class="vx-row mb-6" v-if="campanha.infusion">
          <div class="vx-col w-full mb-6">
            <h5 class="mb-4">Configuração do Formulário</h5>
            <div class="vx-row">
              <div class="vx-col sm:w-1/4 w-full mb-2">
                <span class="font-regular mb-2">Form_id</span>
                <vs-input class="w-full" v-validate="'required'" name="form_id"
                          v-model="campanha.form_id" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('form_id')">{{ errors.first('form_id') }}</span>
              </div>
              <div class="vx-col sm:w-1/4 w-full mb-2">
                <span class="font-regular mb-2">Form_name</span>
                <vs-input class="w-full" v-validate="'required'" name="form_name" v-model="campanha.form_name" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('form_name')">{{ errors.first('form_name') }}</span>
              </div>

              <div class="vx-col sm:w-1/4 w-full mb-2">
                <span class="font-regular mb-2">Form_conta</span>
                <vs-input class="w-full" v-validate="'required'" name="form_conta" v-model="campanha.form_conta" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('form_conta')">{{ errors.first('form_conta') }}</span>
              </div>

              <div class="vx-col sm:w-1/4 w-full mb-2">
                <span class="font-regular mb-2">Form_versão</span>
                <vs-input class="w-full" v-validate="'required'" name="form_versao" v-model="campanha.form_versao" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('form_versao')">{{ errors.first('form_versao') }}</span>
              </div>

            </div>
          </div>
          <div class="vx-col w-full ">
            <h5 class="mb-4">Campos do Formulário</h5>
            <div class="vx-row">
              <div class="vx-col sm:w-1/3 w-full mb-2">
                <span class="font-regular mb-2">Campo_nome</span>
                <vs-input class="w-full" v-validate="'required'" name="campo_nome" v-model="campanha.campo_nome" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('campo_nome')">{{ errors.first('campo_nome') }}</span>
              </div>

              <div class="vx-col sm:w-1/3 w-full mb-2">
                <span class="font-regular mb-2">Campo_email</span>
                <vs-input class="w-full" v-validate="'required'" name="campo_email" v-model="campanha.campo_email" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('campo_email')">{{ errors.first('campo_email') }}</span>
              </div>

              <div class="vx-col sm:w-1/3 w-full mb-2">
                <span class="font-regular mb-2">Campo_whatsapp</span>
                <vs-input class="w-full" v-validate="'required'" name="campo_whatsapp" v-model="campanha.campo_whatsapp" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('campo_whatsapp')">{{ errors.first('campo_whatsapp') }}</span>
              </div>

            </div>
          </div>


        </div>

      </vx-card>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                Salvar
                            </vs-button>
                            <vs-button icon-pack="material-icons" icon="email" class="mr-3" color="dark" type="flat"
                                       @click="$router.push({path: '/campanha/configurar-checkout/' + campanha.id + '/emails'})" v-if="campanha.id">
                                Configurar e-mails da campanha
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/planos/gerenciar/' + campanha.campanhas[0].plano_id})">
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
    import moduleCampCheckouts from "@/store/campanha_checkout/moduleCampCheckouts";
    import Prism from 'vue-prism-component'

    export default {
        name: "Checkout",
        components: {
            'v-select': vSelect,
            Prism
        },
        created() {
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            this.getId(this.$route.params.id);
        },
        data() {
            return {
                campanha: {
                    nome: '',
                    produto: '',
                    status: null,
                    checkout: ''
                },
                customcor: '',
                html: `
                <form>
                    <label for="nome">Nome</label>
                    <input type="text" name="nome" id="input-nome" placeholder="Nome completo">
                    <label for="email">E-mail</label>
                    <input type="email" name="email" id="input-email" placeholder="Insira seu melhor email">
                </form>
                `
            }
        },
        methods: {
            formulario(){
              if (this.campanha.infusion) {
                return this.formularioinfusion();
              }
              else{
                return this.formularioPadrao();
              }
            },
            formularioPadrao(){
              let form =`
<form accept-charset="UTF - 8" action="${this.url_api('recovery-cart')}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" placeholder="Insira seu melhor email">
    <label for="email">Whatsapp</label>
    <input type="text" name="whatsapp" id="whatsapp" placeholder="Insira seu whatsapp">
</form>
              `;
              return form;
            },
            formularioinfusion(){
              let form =`
<form accept-charset="UTF - 8" action="https://cr244.infusionsoft.com/app/form/process/${this.campanha.form_id}" class="mbr-class" id="${this.campanha.form_id}" method="POST">
    <input name="token" value="${this.campanha.token}" type="hidden" />
    <input name="inf_form_xid" type="hidden" value="${this.campanha.form_id}" />
    <input name="inf_form_name" type="hidden" value="${this.campanha.form_name}" />
    <div>
        <label for="inf_field_FirstName">Nome Completo*</label>
        <input class="mbr-class" id="${this.campanha.campo_nome}" name="${this.campanha.campo_nome}" placeholder="Nome Completo *" type="text" />
    </div>
    <div>
        <label for="inf_field_Email">Email *</label>
        <input class="mbr-class" id="${this.campanha.campo_email}" name="${this.campanha.campo_email}" placeholder="Email *" type="email" />
    </div>
    <div>
        <label for="inf_custom_DDD">Whatsapp *</label>
        <input class="mbr-class" id="${this.campanha.campo_whatsapp}" name="${this.campanha.campo_whatsapp}" placeholder="Whatsapp" type="text" />
    </div>
    <div>
        <button type='submit' class='enviar'>Enviar</button>
    </div>
</form>
`;
              return form;
            },
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.campanha.plano_id = this.$route.params.id;
                        this.campanha._method = 'PUT';
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('checkout/update', {id: this.campanha.id, dados: this.campanha}).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/planos/gerenciar/' + this.campanha.campanhas[0].plano_id});
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
                            this.$store.dispatch('checkout/store', this.campanha).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/planos/gerenciar/' + this.campanha.campanhas[0].plano_id});
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
            selecionaTipoComissao(val) {
                this.campanha.comissao_tipo = val;
                console.log(this.campanha.comissao_tipo)
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getId', id).then(response => {
                    this.campanha = {...response};
                    this.$vs.loading.close();
                });
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            copyText() {
                const thisIns = this;
                this.$copyText(this.html).then(function () {
                    thisIns.$vs.notify({
                        title: '',
                        text: 'Copiado para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
                }, function () {
                    thisIns.$vs.notify({
                        title: 'Failed',
                        text: 'Erro ao copiar',
                        color: 'danger',
                        iconPack: 'feather',
                        position: 'top-center',
                        icon: 'icon-alert-circle'
                    })
                })
            }
        },
        computed: {
            isValid() {
                return this.errors.any();
            },
        },
        watch: {
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

<style>
    [dir] .con-select .vs-select--input {
        padding: 1.4rem 2rem !important;
    }

    #copy-icon {
        position: absolute;
        top: 0.7rem;
        right: 30px;
        cursor: pointer;
    }
</style>
