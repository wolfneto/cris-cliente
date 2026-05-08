<template>
	<div>
		<v-app-bar dense :height="35" app color="deep-purple accent-4" dark>
			<v-toolbar-title>{{title}}</v-toolbar-title>

			<div class="flex-grow-1"></div>

			<v-menu left bottom>
				<template v-slot:activator="{ on }">
					<v-btn icon v-on="on">
						<v-icon>fa-ellipsis-v</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item @click="logout()">
						<v-list-item-icon>
							<v-icon>fa-sign-out-alt</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Sair</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
	</div>
</template>
<script>
export default {
	data: () => ({title: 'Inicio'}),
	mounted() {
		this.$root.$on("title", text => {
			this.title = text;
		});
	},
	methods: {
		logout() {
			this.$usuario.value = false;
			localStorage.removeItem("usuario");
			localStorage.setItem("login", false);
			this.$rota.push({ name: "login" });
			this.$rota.go();
		}
	}
};
</script>
