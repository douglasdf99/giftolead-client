<template>
    <div>
        <ul>
            <div v-for="line in lista">
                <li><router-link :to="line.url">{{line.nome}}</router-link></li>
                <hr class="line">
            </div>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Geral",
        data(){
            return {
                lista: [
                    {
                        nome: 'Dados da Empresa',
                        url: 'geral/dados-empresa'
                    },
                    {
                        nome: 'Cadastrar ou alterar contas de produtos',
                        url: 'geral/contas'
                    }
                ]
            }
        },
        created(){
            console.log('rota', this.$route);
        }
    }
</script>

<style scoped>
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
        width: 40%;
        margin: 1rem 0;
        border-width: 2px;
        opacity: 25%;
    }
</style>