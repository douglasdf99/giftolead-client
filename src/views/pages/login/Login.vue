<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-5/12 xl:w-5/12 sm:m-0 m-4 sm:h-full">
            <vx-card class="sm:h-full sm:w-full flex items-center" style="-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;">
                <div slot="no-body">
                    <div class="vx-row no-gutter justify-center items-center">
                        <div class="vx-col sm:w-full md:w-full lg:w-2/3 d-theme-dark-bg">
                            <div class="px-8 pt-8 login-tabs-container">
                                <div class="vx-card__title mb-5 flex justify-center" style="margin-bottom: 5rem !important;">
                                    <img :src="url_api('images/logo2.svg')">
                                </div>
                                <login-jwt></login-jwt>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>


<script>
    import LoginJwt from "./LoginJWT.vue"
    import LoginFirebase from "./LoginFirebase.vue"
    import LoginAuth0 from "./LoginAuth0.vue"

    export default {
        components: {
            LoginJwt,
            LoginFirebase,
            LoginAuth0
        }
    }
</script>

<style lang="scss">
    .login-tabs-container {
        min-height: 505px;

        .con-tab {
            padding-bottom: 14px;
        }

        .con-slot-tabs {
            margin-top: 1rem;
        }
    }
</style>

<style >
    #page-login {
        background-image: url("../../../assets/images/util/bg-login.jpg");
    }

    #page-login .vx-card__collapsible-content {
        width: 100% !important;
    }
</style>