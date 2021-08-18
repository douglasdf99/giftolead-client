<template>
    <div class="w-full">
        <div class="carousel-example w-full">
            <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
                <swiper-slide v-for="(img, index) in imagens" class="relative">
                    <vs-icon icon-pack="material-icons" icon="cancel" class="icon-grande text-danger cursor-pointer remove-img" v-if="remove" @click="removeImg(img.id, index)"></vs-icon>
                    <img class="responsive" style="cursor: zoom-in" :src="get_img_api(img.arquivo)" :alt="img.descricao" @click="modalGaleria = true; imgExpandida = img">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>

        <vs-popup id="pdf-with-loading" class="popup-galeria vs-con-loading__container text-center" :active.sync="modalGaleria">
            <img :src="get_img_api(imgExpandida.arquivo)" :alt="imgExpandida.descricao" class="img-expandida w-full">
        </vs-popup>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css'
import {swiper, swiperSlide} from 'vue-awesome-swiper'

export default {
    props: ['imagens', 'remove'],
    data() {
        return {
            swiperOption: {
                slidesPerView: 5,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    }
                }
            },

            modalGaleria: false,
            imgExpandida: {}
        }
    },
    methods: {
        removeImg(id, index) {
            this.$vs.loading();
            this.$store.dispatch('mcomissoes/removeImagem', id).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'Imagem removida com sucesso.'
                });
                this.imagens.splice(index, 1);
            }).finally(() => this.$vs.loading.close());
        }
    },
    components: {
        swiper,
        swiperSlide
    }
}
</script>

<style lang="scss" scoped>
.remove-img {
    font-size: 1.5rem;
    position: absolute;
    right: -20px;
    top: 15px;
}
</style>