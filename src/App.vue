<template>
	<v-app>
		<div v-if="logged == 'true'">
			<menuBar></menuBar>
			<appBar></appBar>
		</div>

		<login v-else></login>

		<v-content style="height:100vh">
			<router-view class="low-padding" />
		</v-content>
	</v-app>
</template>

<script>
import jwrDecode from "jwt-decode";
export default {
	name: "App",
	data: () => ({
		usuario: null,
		logged: localStorage.login
	}),
	created() {
		if (this.logged == "true") {
			this.usuario = jwrDecode(localStorage.usuario);
			this.$usuario.value = this.usuario;
		}
	}
};
</script>
<style>
.input-uppercase input {
	text-transform: uppercase;
}
.custom-row {
	height: 70px;
}
.v-banner__text {
	width: 100%;
}
.input-no-details .v-text-field__details {
	display: none;
}
.input-qtd-produtos .v-input__slot {
	margin-bottom: 0 !important;
}
.input-qtd-produtos {
	padding-top: 0 !important;
	margin-top: 0 !important;
}
.label .v-label {
	font-weight: 600;
	font-size: 18px;
	color: black !important;
}
.container {
    max-width: 1500px !important;
}
.low-padding {
	padding: 6px !important;
}
.no-padding {
	padding: 0px !important;
}
.no-padding-up-down {
	padding: 0px 15px 0px 15px !important;
}
</style>
