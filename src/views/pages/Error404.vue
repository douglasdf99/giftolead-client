<!-- =========================================================================================
    File Name: Error404.vue
    Description: 404 Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center">
            <img src="@/assets/images/pages/404.png" alt="graphic-404" class="mx-auto mb-4 max-w-full">
            <h1 class="sm:mx-0 mx-4 mb-12 text-5xl d-theme-heading-color">404 - Página não encontrada</h1>
            <p class="sm:mx-0 mx-4 mb-4 sm:mb-16 d-theme-text-inverse text-dark">Aparentemente você estão tentando acessar uma página que não existe ou você não possui acesso.</p>
            <vx-tooltip position="top" :text="text" class="text-center">
                <vs-button size="large" @click="redirect">Retornar</vs-button>
            </vx-tooltip>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Error-404-page',
        data(){
            return {
                back: 'dashboard', //router-name da rota alvo
                text: 'Retornar à Dashboard', //texto a ser exibido no tooltip
                params: {}
            }
        },
        created() {
            this.$vs.loading.close();
            let local = JSON.parse(localStorage.getItem('404Params'));

            if(local != null){//Verficando existência dos parâmetros auxiliares de redirecionamento no localStorage
                this.text = local.text || '';
                this.back = local.back || '';
            } else if(this.$route.params.back || this.$route.params.text){//Recuperando parâmetros auxíliares pelos parâmetros da rota caso exista
                this.text = this.$route.params.text || '';
                this.back = this.$route.params.back || '';

                //Guardando os parâmetros auxíliares no localStorage para caso o usuário dê refresh na página
                localStorage.setItem('404Params', JSON.stringify({back: this.back, text: this.text}));
            }
        },
        methods: {
            redirect(){//Limpa o localStorage para que não haja conflito de parâmetros e redireciona o usuário
                localStorage.removeItem('404Params');
                this.$router.push({name: this.back, params: this.$route.params});
            }
        }
    }

</script>