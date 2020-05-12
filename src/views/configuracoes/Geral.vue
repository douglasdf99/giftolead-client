<template>
    <div>
        <ul>

            <router-link :to="{name: line.routername}" :class="'line'" tag="li" v-for="line in lista" :key="line.nome">

                {{line.nome}}

            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Geral",
        data() {
            return {
                lista: [
                    {
                        nome: 'Dados da Empresa',
                        routername: 'dados-empresa'
                    },
                    {
                        nome: 'Cadastrar ou alterar contas de produtos',
                        routername: 'contas'
                    },
                    {
                        nome: 'Cadastrar ou alterar produtos',
                        routername: 'produtos'
                    },
                    {
                        nome: 'Cadastrar ou alterar brindes',
                        routername: 'brindes'
                    },

                ]
            }
        },
        created() {
            console.log('rota', this.$route);
        }
    }
</script>

<style scoped>
    ul {
        margin-top: 5rem !important;
    }

    ul li a {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        font-weight: normal;
        color: #434343;
    }

    ul li {
        margin-bottom: 1rem;
    }

    .line {
        border-bottom: #70707024 solid;
        border-width: 1px;
        width: 60%;
        padding-bottom: 15px
    }

    .line:hover {
        border-bottom: #707070 solid;
        border-width: 1px;
        width: 60%;
        padding-bottom: 15px
    }

    .line {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        font-weight: normal;
        color: #000;
        cursor: pointer;
    }
</style>
