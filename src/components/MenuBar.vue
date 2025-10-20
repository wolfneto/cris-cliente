<template>
	<!-- expand-on-hover -->
	<v-navigation-drawer :mini-variant.sync="mini" permanent app>
		<template v-slot:prepend>
			<v-list @click.stop="mini = !mini">
				<v-list-item>
					<v-list-item-avatar>
						<v-img :src="require('@/assets/logo.png')"></v-img>
					</v-list-item-avatar>
				</v-list-item>

				<v-list-item two-line>
					<v-list-item-content>
						<v-list-item-title class="title">{{$usuario.value.nome}}</v-list-item-title>
						<v-list-item-subtitle>
							<small>{{$usuario.value.nome}}@dentalsolident.com.br</small>
						</v-list-item-subtitle>
					</v-list-item-content>
					<v-btn icon @click.stop="mini = !mini">
						<v-icon>fa-chevron-left</v-icon>
					</v-btn>
				</v-list-item>
			</v-list>
		</template>

		<v-divider></v-divider>

		<v-list>
			<div v-for="menu in menus" :key="menu.id">
				<v-list-item active-class="primary--text" v-if="!menu.child.length" :to="menu.href">
					<v-list-item-icon>
						<v-icon>{{menu.icon}}</v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{menu.title}}</v-list-item-title>
				</v-list-item>

				<v-list-group active-class="primary" color="white" v-else :prepend-icon="menu.icon">
					<template v-slot:activator>
						<v-list-item-title >{{menu.title}}</v-list-item-title>
					</template>

					<v-list-item @click="mini = !mini" color="primary" v-for="child in menu.child" :key="child.id" :to="child.href">
						<v-list-item-title>{{child.title}}</v-list-item-title>
						<v-list-item-icon>
							<v-icon>{{child.icon}}</v-icon>
						</v-list-item-icon>
						
					</v-list-item>
				</v-list-group>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>
<script>
export default {
	data: () => ({
		menus: [],
		drawer: true,
		mini: false
	}),
	created() {
		this.getMenu();
	},
	methods: {
		getMenu() {
			this.$axios
				.get("/menu", {
					params: {
						id_usuario: this.$usuario.value.id
					}
				})
				.then(res => {
					this.menus = res.data;
				})
				.catch(err => {
					this.$dialogs
						.alert("Ops, algo deu errado menu: " + err, this.optionsAlert)
						.then(res => {});
				});
		}
	}
};
</script>
<style scoped>
.v-list-item__title {
	text-overflow: initial !important;
	white-space: normal !important;
}
.v-application--is-ltr
	.v-list-group--no-action
	> .v-list-group__items
	> div
	> .v-list-item {
	padding-left: 25px !important;
}
.border {
	border: 2px dashed orange;
}
</style>