<template>
	<v-container>
		<v-card>
			<v-form ref="form" v-model="valid" lazy-validation>
				<v-container>
					<v-row justify="center" class="custom-row">
						<v-col cols="12" md="4">
							<v-text-field
								autofocus
								v-model="usuario.nome"
								:rules="[v => !!v || 'Campo Obrigatório']"
								label="Nome"
								required
							></v-text-field>
						</v-col>
					</v-row>
					<v-row justify="center" class="custom-row">
						<v-col cols="12" md="4">
							<v-text-field
								v-model="usuario.usuario"
								:rules="[v => !!v || 'Campo Obrigatório']"
								label="Usuário"
								required
							></v-text-field>
						</v-col>
					</v-row>
					<v-row justify="center" class="custom-row">
						<v-col cols="12" md="4">
							<v-text-field
								v-model="usuario.senha"
								type="password"
								:rules="[v => !!v || 'Campo Obrigatório']"
								label="Senha"
								required
							></v-text-field>
						</v-col>
					</v-row>

					<div class="d-flex flex-row-reverse">
						<v-btn :disabled="!valid" color="success" class="ml-4 mt-4" @click="validate">Salvar</v-btn>
					</div>
				</v-container>
			</v-form>
		</v-card>
		<v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
			{{msgSnackbar}}
			<v-btn text @click="snackbar = false">Fechar</v-btn>
		</v-snackbar>
	</v-container>
</template>
<script>
export default {
	data: () => ({
		valid: false,
		usuario: {
			nome: "",
			usuario: "",
			senha: ""
		},
		typeSnackbar: "",
		timeSnackbar: 0,
		msgSnackbar: "",
		snackbar: false
	}),
	created() {
		this.$root.$emit("title", this.$rota.currentRoute.name);
	},
	methods: {
		validate() {
			if (this.$refs.form.validate()) {
				this.$axios
					.post("/usuario/cadastrar", {
						nome: this.usuario.nome.toUpperCase(),
						usuario: this.usuario.usuario,
						senha: this.usuario.senha
					})
					.then(res => {
						this.msgSnackbar = "Usuário Cadastrado Com Sucesso!";
						this.typeSnackbar = "success";
						this.snackbar = true;
						this.timeSnackbar = 2000;
						this.usuario.nome = "";
						this.usuario.usuario = "";
						this.usuario.senha = "";
						this.configurarPaginas(res.data.id);
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		configurarPaginas(id) {
			this.$axios
				.post("/usuario/configurarPaginas", {
					id_usuario: id
				})
				.then(res => {
					console.log(res.data);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>