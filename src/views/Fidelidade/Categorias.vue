<template>
	<v-container>
		<v-data-table
			:no-data-text="'Nenhuma categoria encontrado'"
			locale="pt-PT"
			:footer-props="{
					itemsPerPageOptions: [10, 20, 50, -1],
					itemsPerPageText: 'Categorias por pagina',
			}"
			:headers="headers"
			:items="categorias"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title>Categorias</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on }">
							<v-btn color="primary" dark class="mb-2" v-on="on">Adicionar</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-form ref="form" v-model="valid" lazy-validation>
										<v-row class="custom-row">
											<v-col cols="12" md="12">
												<v-text-field
													counter
													:rules=" [v => !!v || 'Descrição Obrigatória!', v => v.length <= 45 || 'Descrição Obrigatória!' ] "
													maxlength="45"
													v-model="editedItem.nome_categoria"
													label="Descrição"
                                                    v-on:keydown.enter.prevent="save()"
												></v-text-field>
											</v-col>
										</v-row>
									</v-form>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="error" @click="close()">Voltar</v-btn>
								<v-btn color="success" @click="save()">Salvar</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.acao="{ item }">
				<v-btn class="mr-2" small color="warning" @click="editItem(item)">
					<i class="far fa-edit"></i>
				</v-btn>

				<v-btn small color="error" @click="deleteItem(item)">
					<i class="far fa-trash-alt"></i>
				</v-btn>
			</template>
		</v-data-table>
		<v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
				{{msgSnackbar}}
				<v-btn text @click="snackbar = false">Fechar</v-btn>
			</v-snackbar>
		<v-overlay :value="loading">
			<v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</v-container>
</template>
<script>
export default {
	data: () => ({
		loading: false,
		valid: true,
		msgSnackbar: "",
		typeSnackbar: "",
		snackbar: false,
		timeSnackbar: 2000,
		categorias: [],
		dialog: false,
		headers: [
            { text: "Id", value: "id" },
            { text: "Descrição", value: "nome_categoria" },
            { text: "Ação", value: "acao" }
        ],
		editedIndex: -1,
		editedItem: {
			nome_categoria: "",
		},
		defaultItem: {
			nome_categoria: "",
		}
	}),
	created() {
		this.$root.$emit("title", this.$rota.currentRoute.name);
		this.getPermissao();
		this.getCategorias();
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "Adicionar" : "Editar";
		}
	},
	watch: {
		dialog(val) {
			val || this.close();
		}
	},
	methods: {
		save() {
			if (this.$refs.form.validate()) {
				this.loading = true;
				if (this.editedIndex > -1) {
                    //edita
                    this.$axios
						.put("/fidelidade/categoria", {
							categoria: this.editedItem
						})
						.then(res => {
                            this.loading = false;
                            this.getCategorias();
							this.showSnackbar(
								"Categoria Editado Com Sucesso!",
								"success",
								2000
							);
						})
						.catch(err => {
							console.log(err);
							this.loading = false;
						});
				} else {
					//salva
					this.$axios
						.post("/fidelidade/categoria", {
							categoria: this.editedItem
						})
						.then(res => {
                            this.loading = false;
                            this.getCategorias();
							this.showSnackbar(
								"Categoria Inserido Com Sucesso!",
								"success",
								2000
							);
						})
						.catch(err => {
							console.log(err);
							this.loading = false;
						});
				}
				
				this.close();
			}
		},
		getCategorias() {
			this.$axios
				.get("/fidelidade/categorias", {})
				.then(res => {
					this.categorias = res.data;
					console.log(res.data);
				})
				.catch(err => {
					console.log(err);
				});
		},
		editItem(item) {
			this.editedIndex = this.categorias.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},
		deleteItem(item) {
            let check = confirm("Você tem certeza que deseja deletar esta categoria?");
            console.log(check);
			if (check == true) {
                this.loading = true;
				this.$axios
					.delete("/fidelidade/categoria", {
						data: { id: item.id }
					})
					.then(res => {
                        this.loading = false;
						this.getCategorias();
						this.showSnackbar("Categoria Deletado Com Sucesso!", "success", 2000);
					})
					.catch(err => {
                        console.log(err);
                        this.loading = false;
					});
			}
		},
		close() {
			this.dialog = false;
			this.editedItem = Object.assign({}, this.defaultItem);
			this.editedIndex = -1;
			this.$refs.form.resetValidation();
		},
		showSnackbar(msg, type, time = 0) {
			this.msgSnackbar = msg;
			this.typeSnackbar = type;
			this.snackbar = true;
			this.timeSnackbar = time;
		},
		getPermissao() {
			this.$axios
				.get("/usuario/permissao/pagina", {
					params: {
						id_usuario: this.$usuario.value.id,
						pagina: "fidelidade_categorias"
					}
				})
				.then(res => {
					this.permissoes = res.data;
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>