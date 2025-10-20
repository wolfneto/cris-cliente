<template>
	<v-content>
		<v-container fill-height fluid>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card class="elevation-12">
						<v-toolbar color="primary">
							<v-toolbar-title class="white--text">Sistema CRIS</v-toolbar-title>
							<v-spacer />
						</v-toolbar>
						<v-card-text>
							<v-form ref="form" v-model="valid" lazy-validation>
								<v-text-field
									ref="usuario"
									v-model="usuario"
									:rules="[() => !!usuario || 'Campo Obrigatório']"
									prepend-icon="fa-user"
									label="Login"
									required
								/>
								<v-text-field
									ref="senha"
									v-model="senha"
									:rules="[() => !!senha || 'Campo Obrigatório']"
									prepend-icon="fa-lock"
									type="password"
									label="Senha"
									required
									@keydown.enter="login"
								/>
							</v-form>
						</v-card-text>
						<v-divider class="mt-5" />
						<v-card-actions>
							<v-spacer />
							<v-btn align-center justify-center color="primary" @click="login">Entrar</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
			{{msgSnackbar}}
			<v-btn text @click="snackbar = false">Fechar</v-btn>
		</v-snackbar>
		<v-overlay :value="loading">
			<v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</v-content>
</template>
<script>
export default {
	data: () => ({
		valid: true,
		usuario: "",
		senha: "",
		typeSnackbar: "",
		timeSnackbar: 2000,
		snackbar: false,
		msgSnackbar: "",
		loading: false
	}),
	methods: {
		login() {
			if (this.$refs.form.validate()) {
				this.loading = true;
				this.$axios
					.post("/usuario/login", {
						usuario: this.usuario,
						senha: this.senha
					})
					.then(res => {
						this.loading = false;
						console.log(res.data);
						if (res.data === true) {
							this.showSnakerbar(
								"Usuário ou Senha Incorretos!",
								"warning",
								2000
							);
						} else if (res.data === false) {
							this.showSnakerbar(
								"Erro no Servidor, Contate o Administrador",
								"error"
							);
						} else {
							localStorage.setItem("usuario", res.data);
							localStorage.setItem("login", true);
							this.usuario = "";
							this.senha = "";
							this.$rota.push({ name: "painel" });
							this.$rota.go();
						}
					})
					.catch(err => {
						this.loading = false;
						console.log(err);
					});
			}
		},
		showSnakerbar(msg, type, time = 0) {
			this.typeSnackbar = type;
			this.timeSnackbar = time;
			this.msgSnackbar = msg;
			this.snackbar = true;
		}
	}
};
</script>