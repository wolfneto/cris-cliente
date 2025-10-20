<template>
	<v-container>
		<v-tabs grow icons-and-text >
			<v-tabs-slider></v-tabs-slider>

			<v-tab to="/academico/gerenciar/inicio">
				Inicio
				<v-icon small>fa-home</v-icon>
			</v-tab>

			<v-tab to="/academico/gerenciar/faculdades">
				Faculdades
				<v-icon small>fa-graduation-cap</v-icon>
			</v-tab>

			<v-tab to="/academico/gerenciar/semestres">
				Gerenciar 
				<v-icon small>fa-list-ol</v-icon>
			</v-tab>
			<!-- <v-tab to="/academico/gerenciar/periodos">
				Periodos
				<v-icon>fa-clock</v-icon>
			</v-tab> -->
			<!-- <v-tab to="/academico/gerenciar/representantes">
				Representantes
				<v-icon small>fa-briefcase</v-icon>
			</v-tab> -->
			<v-tab to="/academico/gerenciar/brindeSite">
				Brindes
				<v-icon>fa-gifts</v-icon>
			</v-tab>
			<!-- <v-tab to="/academico/gerenciar/avisos">
				Avisos
				<v-icon small>fa-exclamation-triangle</v-icon>
			</v-tab> -->
			<v-tab to="/academico/gerenciar/Carteirinha">
				Carteirinha
				<v-icon>fas fa-id-card</v-icon>
			</v-tab>
			<!-- <v-tab to="/academico/gerenciar/Equipamentos">
				Equipamentos
				<v-icon>fa-toolbox</v-icon>
			</v-tab> -->
		</v-tabs>
	</v-container>
</template>
<script>
export default {
	data: () => ({})
};
</script>
<style scoped>
</style>