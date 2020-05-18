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
        name: "Tickets",
        data() {
            return {
                lista: [
                    {
                        nome: 'Cadastrar ou alterar Origens',
                        routername: 'origens'
                    },
                    {
                        nome: 'Cadastrar ou alterar Tipo de Dúvidas',
                        routername: 'TipoDeDuvida'
                    },
                    {
                        nome: 'Cadastrar ou alterar Motivos de Perda',
                        routername: 'motivoDePerda'
                    },
                    {
                        nome: 'Cadastrar ou alterar Status de Finalização',
                        routername: 'statusDeFinalizacao'
                    },
                    {
                        nome: 'Cadastrar ou alterar Mensagem Padrão',
                        routername: 'mensagemPadrao'
                    },
                ]
            }
        },
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
