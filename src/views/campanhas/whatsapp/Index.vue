<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{ campanha.status ? 'Ativado' : 'Desativado' }}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch"
                           :disabled="!$acl.check('planos_campanhas_editar')"/>
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
                    <div class="vx-col w-full">
                        <span class="font-regular mb-2">Telefone do Remetente</span>
                        <phone-number :key="campanha.telefone" :ddi.sync="campanha.ddi" :phone.sync="campanha.telefone"/>
                    </div>
                </div>
                <div class="vx-row mb-3">
                    <div class="vx-col w-full relative">
                        <div class="flex justify-between items-center">
                            <span class="font-regular mb-2">Mensagem a ser recebida</span>
                            <vx-tooltip text="Variáveis" position="top"
                                        style="position: absolute;right: 1%;top: 10%;z-index: 1;">
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
                        <vs-textarea v-model="campanha.mensagem" id="text-area" class="w-full bg-white" name="textarea"
                                     rows="6" v-validate="'required|max:130'"
                                     placeholder="Digite a mensagem que seu cliente irá mandar para você para solicitar um contato nesta campanha."/>
                        <span class="text-danger text-sm -mt-2"
                              v-show="errors.has('textarea')">Máximo de 130 caracteres</span>
                    </div>
                </div>
                <div class="relative">
                    <div class="not-finished-config" v-if="not_configured">
                        <span class="text-xl">
                            Termine a configuração <br> para ter acesso ao formulário
                        </span>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full relative" v-if="!campanha.infusion">
                            <vs-tabs>
                                <vs-tab label="Sem estilo">
                                    <i class="material-icons text-white mt-5" id="copy-icon"
                                       @click="copyText">file_copy</i>
                                    <prism language="markup" class="rounded-lg">
                                        {{ codigohtml() }}
                                    </prism>
                                </vs-tab>
                                <vs-tab label="Widget">
                                    <i class="material-icons text-black mt-5" id="copy-icon" @click="copyScripts">file_copy</i>
                                    <div class="w-full bg-white rounded-lg p-5">
                                        <p class="font-regular text-lg" v-for="(val, index) in scripts" :key="index">
                                            {{ val }}
                                        </p>
                                    </div>
                                </vs-tab>
                            </vs-tabs>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-4/12 vs-con-loading__container" ref="metrics">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('respondidos')">
                        <vx-card class="shadow-none">
                            <span class="destaque">Nº de contatos respondidos</span>
                            <!-- contatos_count neste caso traz quem não foi respondido pelo chat -->
                            <p class="font-bold text-3xl my-5">{{ metrics.contatos_respondidos_count }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('pendentes')">
                        <vx-card class="shadow-none">
                            <span class="destaque">Nº de contatos não respondidos</span>
                            <p class="font-bold text-3xl my-5">{{ metrics.contatos_pendentes_count }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card class="shadow-none">
                            <span class="destaque">Vendas recuperadas</span>
                            <p class="font-bold text-3xl my-5">{{ metrics.tickets_vendidos }}</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full text-center cursor-pointer" @click="verMaisCards = true"
                         v-if="!verMaisCards">
                        <p class="destaque text-primary">Ver mais</p>
                    </div>
                    <transition name="fade">
                        <div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('todos')"
                             v-if="verMaisCards">
                            <vx-card class="shadow-none">
                                <span class="destaque">Nº total de contatos</span>
                                <p class="font-bold text-3xl my-5">
                                    {{ metrics.contatos_pendentes_count + metrics.contatos_respondidos_count }}</p>
                            </vx-card>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div class="vx-col w-full mb-4" v-if="verMaisCards">
                            <vx-card class="shadow-none">
                                <span class="destaque">Valor recuperado</span>
                                <p class="font-bold text-3xl my-5">R$ {{ formatPrice(metrics.valor_recuperado) }}</p>
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
                               @click="$router.push({
                                name: 'planos-gerenciar' , params:{plan_id: campanha.campanhas[0].plano_id}})">
                        Cancelar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar"
                               :disabled="isInvalid && !$acl.check('planos_campanhas_editar')">
                        Salvar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select';
import Prism from 'vue-prism-component';
import saveleadsConfig from "../../../../saveleadsConfig";
import PhoneNumber from '@/components/PhoneNumber';

export default {
    name: "Whatsapp",
    components: {
        'v-select': vSelect, PhoneNumber, Prism
    },
    data() {
        return {
            campanha: {
                nome: '',
                produto: '',
                status: false,
                checkout: '',
                infusion: false,
                telefone: '',
                ddi: '',
            },
            metrics: {
                contatos_respondidos_count: 0,
                contatos_pendentes_count: 0,
                tickets_vendidos: 0,
                valor_recuperado: 0,
            },
            not_configured: true,
            customcor: '',
            html: '',
            verMaisCards: false,
            scripts: [],
        };
    },
    mounted() {
        this.getId(this.$route.params.id);
    },
    methods: {
        validateInputsToScript() {
            let {ddi, telefone} = this.campanha;
            if(ddi && telefone) this.not_configured = false;
        },
        salvar() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    this.campanha.plano_id = this.campanha.campanhas[0].plano_id;
                    this.campanha._method = 'PUT';
                    if (this.campanha.id !== undefined) {
                        this.$store.dispatch('campaign_whatsapp/update', {
                            id: this.campanha.id,
                            dados: this.campanha
                        }).then(() => {
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
                                text: erro.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        }).finally(() => this.$vs.loading.close());
                    } else {
                        this.$store.dispatch('campaign_whatsapp/store', this.campanha).then(() => {
                            this.$vs.notify({
                                title: '',
                                text: "Criado com sucesso.",
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                                color: 'success'
                            });
                            this.$router.push({
                                name: 'planos-gerenciar' , params:{plan_id: this.campanha.campanhas[0].plano_id}});
                        }).catch(erro => {
                            this.$vs.notify({
                                title: 'Error',
                                text: erro.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        });
                    }
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                }
            });

        },
        selecionaTipoComissao(val) {
            this.campanha.comissao_tipo = val;
        },
        getId(id) {
            this.$vs.loading();
            this.$store.dispatch('campaign_whatsapp/getId', id).then(response => {
                this.campanha = response;
                this.setScripts();
                this.validateInputsToScript();
            }).catch(erro => {
                //Redirecionando caso 404
                if (erro.response.status == 404) this.$router.push({
                    name: 'page-error-404',
                    params: {back: 'meus-planos', text: 'Retornar à listagem de Planos'}
                });
            }).finally(() => this.$vs.loading.close());

            this.$vs.loading({
                container: this.$refs.metrics,
                scale: 0.5,
            });
            this.$store.dispatch('campaign_whatsapp/metrics', id).then(response => {
                this.metrics = response;
            }).catch(error => {
                this.$vs.notify({
					text: error.message,
					iconPack: 'feather',
					icon: 'icon-alert-circle',
					color: 'danger'
				});
            }).finally(() => this.$vs.loading.close(this.$refs.metrics));
        },
        setScripts() {
            this.scripts = [];

            var scripts = [
                saveleadsConfig.url_cdn + "/widgets/whatsapp/form.js",
            ];
            scripts.forEach((script) => {
                let tag = document.createElement("script");
                tag.setAttribute("type", 'text/javascript');
                tag.setAttribute("src", script);
                tag.setAttribute("token", this.campanha.token);
                tag.setAttribute("slug", this.$route.params.company_slug);
                this.scripts.push(tag.outerHTML);
            });
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',');
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        codigohtml() {
            this.html = `
<form accept-charset="UTF - 8" action="${this.url_api(this.$route.params.company_slug + '/campanhawhatsapp/' + this.campanha.token)}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" required name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" required name="email" id="email" placeholder="Insira seu melhor e-mail">
    <label for="email">Whatsapp</label>
    <input type="text" name="ddi" id="ddi" value="+55">
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
                });
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                });
            });
        },
        copyScripts() {
            var thisIns = this;
            let str = '';
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
                });
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                });
            });
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
                });
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                });
            });
        },
        contatos(val) {
            this.$router.push({
                name: `campanha-config-whatsapp-contatos-${val}`, params:{id: this.$route.params.id}});
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
        isInvalid() {
            return this.errors.any();
        },
    },
    watch: {
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle;
        },
    },
};
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
