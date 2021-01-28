<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{ campanha.status ? 'Ativado' : 'Desativado' }}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch" :disabled="!$acl.check('planos_campanhas_editar')"/>
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
            <div class="vx-col w-full lg:w-8/12">
                <div class="vx-row mb-3">
                    <div class="vx-col w-full relative">
                        <div class="flex justify-between items-center">
                            <span class="font-regular mb-2">Mensagem a ser recebida</span>
                            <vx-tooltip text="Variáveis" position="top" style="position: absolute;right: 1%;top: 10%;z-index: 1;">
                                <vs-dropdown vs-trigger-click>
                                    <i class="material-icons text-4xl text-gray p-4 cursor-pointer">sms</i>
                                    <vs-dropdown-menu class="dropdown-menu-list dropdown-usuario dropdown-chat">
                                        <span class="span-identifica-item-dropdown mb-0">Variáveis</span>
                                        <vs-dropdown-item>
                                            <span @click="addVarText('[NOME_LEAD]')">Nome do Lead</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <span @click="addVarText('[EMAIL_LEAD]')">E-mail do Lead</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <span @click="addVarText('[TELEFONE_LEAD]')">Telefone do Lead</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <span @click="addVarText('[PRODUTO]')">Produto</span>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </vx-tooltip>
                        </div>
                        <vs-textarea v-model="campanha.mensagem" id="text-area" class="w-full bg-white" name="textarea" rows="6" v-validate="'required|max:130'"
                                     placeholder="Digite a mensagem que seu cliente irá mandar para você para solicitar um contato nesta campanha."/>
                        <span class="text-danger text-sm -mt-2"
                              v-show="errors.has('textarea')">Máximo de 130 caracteres</span>
                    </div>
                </div>
                <div class="vx-row mb-4">

                    <div class="vx-col w-2/12">
                        <vs-input class="w-full" id="input-ddi" v-mask="'+####'" v-model="campanha.ddi" placeholder="DDI" size="large" name="nome" v-validate="'required'"/>
                    </div>
                  <div class="vx-col w-2/12">
                        <vs-input class="w-full" id="input-ddd" v-mask="'(##)'" v-model="campanha.ddd" placeholder="DDD" size="large" name="nome" v-validate="'required'"/>
                    </div>
                    <div class="vx-col w-8/12">
                        <vs-input class="w-full" id="input-telefone" v-mask="'#####-####'" v-model="campanha.telefone" placeholder="Telefone" size="large" name="nome" v-validate="'required'"/>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full relative" v-if="!campanha.infusion">
                        <vs-tabs>
                            <vs-tab label="Sem estilo">
                                <i class="material-icons text-white mt-5" id="copy-icon" @click="copyText">file_copy</i>
                                <prism language="markup" class="rounded-lg">
                                    {{ codigohtml() }}
                                </prism>
                            </vs-tab>
                            <vs-tab label="Widget">
                                <i class="material-icons text-black mt-5" id="copy-icon" @click="copyScripts">file_copy</i>
                                <div class="w-full bg-white rounded-lg p-5">
                                    <p class="font-regular text-lg" v-for="val in scripts">
                                        {{ val }}
                                    </p>
                                </div>
                            </vs-tab>
                        </vs-tabs>

                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <div class="my-8">
                            <vs-checkbox color="dark" v-model="campanha.infusion"><span class="label-bold-underline">Utilizar minha ferramenta de e-mail</span>
                            </vs-checkbox>
                            <small class="flex mt-2 ml-3"><i class="material-icons text-base mr-2">info_outline</i>Esta opção habilita a a associação com sua ferramenta de e-mail</small>
                        </div>
                    </div>
                </div>
                <vx-card class="mb-8">
                    <div class="vx-row mb-6" v-if="campanha.infusion">
                        <div class="vx-col w-full ">
                            <h5 class="mb-4">Campos do Formulário</h5>
                            <div class="vx-row">
                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Nome</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_nome" v-model="campanha.campo_nome" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_nome')">{{ errors.first('campo_nome') }}</span>
                                </div>

                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Email</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_email" v-model="campanha.campo_email" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_email')">{{ errors.first('campo_email') }}</span>
                                </div>

                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Whatsapp</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_whatsapp" v-model="campanha.campo_whatsapp" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_whatsapp')">{{ errors.first('campo_whatsapp') }}</span>
                                </div>

                            </div>
                        </div>
                    </div>

                </vx-card>
                <div class="vx-row">
                    <div class="vx-col w-full" v-if="campanha.infusion">
                        <img src="@/assets/images/util/infusion-help.png" class="border-dark shadow mb-3" width="100%">
                        <p class="flex mb-2 ml-3 font-bold text-warning">
                            <i class="material-icons text-base mr-2">info_outline</i>Insira esta URL como sua página de obrigado e
                            marque o checkbox que se encontra logo abaixo. Veja no exemplo acima.
                        </p>
                        <div class="w-full relative">
                            <span class="font-regular mb-2">Url Infusion:</span>
                            <vs-input class="w-full mb-4" :value="this.url_api('campanhawhatsapp/'+this.campanha.token).substr(0, 65) + '...'" placeholder="https://" size="large" name="urlInfusion"
                                      id="urlInfusion" disabled/>
                            <i class="material-icons" id="copy-icon-input" @click="copyUrl">file_copy</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-4/12">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('respondidos')">
                        <vx-card class="shadow-none">
                            <span class="destaque">Nº de contatos respondidos</span>
                            <!-- contatos_count neste caso traz quem não foi respondido pelo chat -->
                            <p class="font-bold text-3xl my-5">{{ campanha.contatos_respondidos_count }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('pendentes')">
                        <vx-card class="shadow-none">
                            <span class="destaque">Nº de contatos não respondidos</span>
                            <p class="font-bold text-3xl my-5">{{ campanha.contatos_pendentes_count }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card class="shadow-none">
                            <span class="destaque">Vendas recuperadas</span>
                            <p class="font-bold text-3xl my-5">{{ campanha.tickets_vendidos.length }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full text-center cursor-pointer" @click="verMaisCards = true" v-if="!verMaisCards">
                        <p class="destaque text-primary">Ver mais</p>
                    </div>
                    <transition name="fade">
                        <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('todos')" v-if="verMaisCards">
                            <vx-card class="shadow-none">
                                <span class="destaque">Nº total de contatos</span>
                                <p class="font-bold text-3xl my-5">{{ campanha.contatos_pendentes_count + campanha.contatos_respondidos_count }}</p>
                            </vx-card>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div class="vx-col w-full mb-4" v-if="verMaisCards">
                            <vx-card class="shadow-none">
                                <span class="destaque">Valor recuperado</span>
                                <p class="font-bold text-3xl my-5">R$ {{ formatPrice(campanha.valor_recuperado) }}</p>
                            </vx-card>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                               @click="$router.push({path: '/planos/gerenciar/' + campanha.campanhas[0].plano_id})">
                        Cancelar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar"
                               :disabled="isValid && !$acl.check('planos_campanhas_editar')" v-if="edited">
                        Salvar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import Prism from 'vue-prism-component'
import moduleCampWhatsapp from "../../../store/campanha_whatsapp/moduleCampWhatsapp";
import moduleWhatsList from "../../../store/whatsapplist/moduleWhatsList";

export default {
    name: "Whatsapp",
    components: {
        'v-select': vSelect,
        Prism
    },
    created() {
        if (!moduleCampWhatsapp.isRegistered) {
            this.$store.registerModule('whatsapp', moduleCampWhatsapp)
            moduleCampWhatsapp.isRegistered = true
        }
        if (!moduleWhatsList.isRegistered) {
            this.$store.registerModule('whatsapplist', moduleWhatsList)
            moduleWhatsList.isRegistered = true
        }
        this.getId(this.$route.params.id);
    },
    data() {
        return {
            campanha: {
                nome: '',
                produto: '',
                status: null,
                checkout: '',
                infusion: false
            },
            campanhaOld: {},
            edited: false,
            customcor: '',
            html: '',
            verMaisCards: false,
            scripts: []
        }
    },
    mounted() {
        this.verifica()


    },
    methods: {
        verifica() {
            if (JSON.stringify(this.campanha) === JSON.stringify(this.campanhaOld))
                this.edited = false;
            else
                this.edited = true;
        },
        salvar() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    this.campanha.plano_id = this.campanha.campanhas[0].plano_id;
                    this.campanha._method = 'PUT';
                    if (this.campanha.id !== undefined) {
                        this.$store.dispatch('whatsapp/update', {id: this.campanha.id, dados: this.campanha}).then(response => {
                            console.log('response', response);
                            this.$vs.notify({
                                title: '',
                                text: "Atualizado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.getId(this.$route.params.id);
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
                        this.$store.dispatch('whatsapp/store', this.campanha).then(response => {
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
            this.$store.dispatch('whatsapp/getId', id).then(response => {
                this.campanha = JSON.parse(JSON.stringify(response));
                this.campanhaOld = JSON.parse(JSON.stringify(response));
                this.$vs.loading.close();
                var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';

                var scripts = [
                    "https://d1nc450dx9gaoz.cloudfront.net/widgets/whatsapp/form.js",
                ];
                scripts.forEach((script, index) => {
                    let tag = document.createElement("script");
                    tag.setAttribute("type", 'text/javascript');
                    tag.setAttribute("src", script);
                    tag.setAttribute("token", this.campanha.token);
                    tag.setAttribute("slug", subdomain);
                    console.log(tag.outerHTML);
                    this.scripts.push(tag.outerHTML)
                });
            });
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        codigohtml(value) {
            this.html = `
<form accept-charset="UTF - 8" action="${this.url_api('campanhawhatsapp/' + this.campanha.token)}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" required name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" required name="email" id="email" placeholder="Insira seu melhor e-mail">
    <label for="email">Whatsapp</label>
    <input type="text" name="ddi" id="ddi" value="+55">
    <input type="text" name="ddd" id="ddd">
    <input type="text" name="telefone" id="telefone" placeholder="Insira seu Whatsapp">
    <button type="submit">Enviar</button>
</form>
                `;
            return this.html;
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
        },
        copyScripts() {
            var thisIns = this;
            let str = ''
            this.scripts.forEach(val => {
                str += val + '\n';
            });
            this.$copyText(str).then(function () {
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
        },
        copyUrl() {
            const thisIns = this;
            let value = this.url_api('campanhawhatsapp/' + this.campanha.token);
            this.$copyText(value).then(function () {
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
        },
        contatos(val) {
            this.$router.push({path: `/campanha/configurar-whatsapp/${this.$route.params.id}/contatos-${val}`});
        },
        addVarText(value) {
            //Text Area
            var $txt = document.getElementById('text-area');
            var textAreaTxt = $txt.value;
            var caretPos = $txt.selectionStart;
            $txt.value = (textAreaTxt.substring(0, caretPos) + value + textAreaTxt.substring(caretPos));
            this.campanha.mensagem = $txt.value;
        },
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
        empresa: {
            handler(val) {
                if (val) {
                    this.verifica();
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
    top: .7rem;
    right: 30px;
    cursor: pointer;
}

#copy-icon-input {
    position: absolute;
    top: 2.2rem;
    right: 30px;
    cursor: pointer;
}
</style>
