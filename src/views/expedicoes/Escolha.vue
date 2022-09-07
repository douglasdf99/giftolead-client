<template>
	<div>
		<div class="vx-row mt-20 flex ">
			<div class="vx-col w-full lg:w-1/2 sm:w-full text-center hover-opacidade cursor-pointer"
				  v-bind:class="{'disabled': !$store.getters['extensoes/check']('correios')}"
				  @click="tryON('correios','brindes-expedicoes')">
				<div class="tipo-conquista">
					<div class="vx-row py-5">
						<div class="vx-col lg:w-1/2 mx-auto w-full">
							<img src="@/assets/images/util/correios@2x.png" class="mx-auto w-full"/>
						</div>
						<div class="vx-col w-full text-center">
							<p class="destaque justify-center mb-3">Expedições Correios</p>
						</div>
					</div>
				</div>
			</div>
			<div class="vx-col w-full lg:w-1/2 sm:w-full text-center hover-opacidade cursor-pointer"
				  v-bind:class="{'disabled': !$store.getters['extensoes/check']('melhor_envio')}"
				  @click="tryON('melhor_envio','brindes-expedicoes-melhor-envio')">
				<div class="tipo-conquista">
					<div class="vx-row py-5">
						<div class="vx-col lg:w-1/2 mx-auto w-full">
							<img src="@/assets/images/util/melhor-envio.png" class="mx-auto w-full"/>
						</div>
						<div class="vx-col w-full text-center">
							<p class="destaque justify-center mb-3">Expedições Melhor Envio</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Escolha",
	methods: {
		tryON(ext, route) {
			this.$store.getters['extensoes/check'](ext) ? this.$router.push({name: route}) : this.$vs.notify({
				text: 'É necessário instalar a extensão.',
				color: 'warning'
			});
		}
	},
};
</script>

<style scoped>
.disabled {
	filter: saturate(0%);
	opacity: .3;
	cursor: no-drop !important;
}
</style>
