<template>
	<v-container>
		<v-data-table
			:no-data-text="'Nenhum produto encontrado'"
			locale="pt-PT"
			:footer-props="{
					itemsPerPageOptions: [10, 20, 50, -1],
					itemsPerPageText: 'Produtos por pagina',
			}"
			:headers="headers"
			:items="produtos"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title>Produtos</v-toolbar-title>
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
													v-model="editedItem.nome"
													label="Descrição"
												></v-text-field>
											</v-col>
										</v-row>
										<v-row class="custom-row">
											<v-col cols="12" md="4">
												<v-text-field
													v-mask="'######'"
													maxlength="6"
													:rules=" [v => !!v || 'Pontos Obrigatórios!'] "
													v-model="editedItem.pontos"
													label="Pontos"
												></v-text-field>
											</v-col>
											<v-col cols="12" md="4">
												<div
													class="v-input v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted"
												>
													<div class="v-input__control">
														<div class="v-input__slot">
															<div class="v-text-field__slot">
																<label
																	for="input-205"
																	class="v-label v-label--active theme--light"
																	style="left: 0px; right: auto; position: absolute;"
																>Pontos</label>
																<money v-model="editedItem.valor" type="text" v-bind="$money"></money>
															</div>
														</div>
														<div class="v-text-field__details">
															<div class="v-messages theme--light">
																<div class="v-messages__wrapper"></div>
															</div>
														</div>
													</div>
												</div>
											</v-col>
											<v-col cols="12" md="4">
												<v-switch color="success" v-model="editedItem.status">
													<template v-slot:label>
														<span v-if="editedItem.status" class="success--text">Ativo</span>
														<span v-else class="error--text">Inativo</span>
													</template>
												</v-switch>
											</v-col>
										</v-row>
										<v-row class="custom-row">
											<v-col cols="12" md="4">
												<v-text-field
													v-mask="'##/##/####'"
													placeholder="dd/mm/aaaa"
													:rules=" [v => !!v || 'Data obrigatória!' ] "
													v-model="editedItem.data_de"
													label="De"
												></v-text-field>
											</v-col>
											<v-col cols="12" md="4">
												<v-text-field
													v-mask="'##/##/####'"
													placeholder="dd/mm/aaaa"
													:rules=" [v => !!v || 'Data obrigatória!' ] "
													v-model="editedItem.data_ate"
													label="Até"
												></v-text-field>
											</v-col>
											<v-col cols="12" md="4">
												<v-text-field
													v-mask="'##/##/####'"
													placeholder="dd/mm/aaaa"
													:rules=" [v => !!v || 'Data obrigatória!' ] "
													v-model="editedItem.data_limite"
													label="Limite"
												></v-text-field>
											</v-col>
										</v-row>
										<v-row class="custom-row">
											<v-col cols="12" md="4">
												<v-text-field
													:rules=" [v => !!v || 'Estoque Obrigatórios!'] "
													v-model="editedItem.estoque"
													label="Estoque"
												></v-text-field>
											</v-col>	
											<v-col cols="12" md="8">
												<v-select
													v-model="editedItem.categoria_fidelidade"
													item-text="nome_categoria"
													:rules=" [v => !!v || 'Categoria Obrigatória!'] "
													return-object
													:items="categorias"
													label="Categoria"
												></v-select>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="12">
												<v-textarea
													rows="4"
													no-resize
													counter
													:rules=" [v => !!v || 'Descrição Obrigatória!', v => v.length <= 1000 || 'Descrição Obrigatória!' ] "
													maxlength="1000"
													v-model="editedItem.descricao_detalhada"
													label="Descrição Detalhada"
												></v-textarea>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" md="12">
												<v-textarea
													rows="4"
													no-resize
													counter
													:rules=" [v => !!v || 'Informação Obrigatória!', v => v.length <= 1000 || 'Informação Obrigatória!' ] "
													maxlength="1000"
													v-model="editedItem.info_adicional"
													label="Informação Adicional"
												></v-textarea>
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
			<template
				v-slot:item.categoria_fidelidade="{ item }"
			>{{item.categoria_fidelidade.nome_categoria}}</template>
			<template v-slot:item.data_de="{ item }">
				<b>De:</b>
				{{item.data_de}}
				<br />
				<b>Até:</b>
				{{item.data_ate}}
				<br />
				<b>Limite:</b>
				{{item.data_limite}}
			</template>
			<template v-slot:item.valor="{ item }">R$ {{item.valor.toFixed(2).replace('.', ',')}}</template>
			<template v-slot:item.status="{ item }">
				<span v-if="item.status == 1" class="success--text">Ativo</span>
				<span v-else class="error--text">Inativo</span>
			</template>
			<template v-slot:item.estoque="{ item }">				
				<span v-if="item.estoque >= 1" class="black--text">{{ item.estoque}}</span>	
				<span v-if="item.estoque < 1" class="error--text">{{ item.estoque}}</span>
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
		produtos: [],
		categorias: [],
		dialog: false,
		headers: [
			{ text: "Descrição", value: "nome" },
			{ text: "Categoria", value: "categoria_fidelidade" },
			{ text: "Valor", value: "valor" },
			{ text: "Status", value: "status" },
			{ text: "Estoque", value: "estoque" },
			{ text: "Validade", value: "data_de" },
			{ text: "Ação", value: "acao" }
		],
		editedIndex: -1,
		editedItem: {
			nome: "",
			tipo: "",
			descricao_detalhada: "",
			info_adicional: "",
			valor: 0,
			pontos: 0,
			status: 0,
			estoque: 0,
			categoria_fidelidade: null,
			data_de: "",
			data_ate: ""
		},
		defaultItem: {
			nome: "",
			tipo: "",
			descricao_detalhada: "",
			info_adicional: "",
			valor: 0,
			pontos: 0,
			status: 0,
			estoque: 0,
			categoria_fidelidade: null,
			data_de: "",
			data_ate: ""
		}
	}),
	created() {
		this.$root.$emit("title", this.$rota.currentRoute.name);
		this.getPermissao();
		this.getProdutos();
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
						.put("/fidelidade/produto", {
							produto: this.editedItem
						})
						.then(res => {
                            this.loading = false;
                            this.getProdutos();
							this.showSnackbar(
								"Produto Editado Com Sucesso!",
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
						.post("/fidelidade/produto", {
							produto: this.editedItem
						})
						.then(res => {
                            this.loading = false;
                            this.getProdutos();
							this.showSnackbar(
								"Produto Inserido Com Sucesso!",
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
		getProdutos() {
			this.$axios
				.get("/fidelidade/produtos", {})
				.then(res => {
					this.produtos = res.data;
					console.log(res.data);
				})
				.catch(err => {
					console.log(err);
				});
		},
		editItem(item) {
			this.editedIndex = this.produtos.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},
		async deleteItem(item) {
			let check = await this.$bvModal
				.msgBoxConfirm("Você tem certeza que deseja deletar este produto?", {
					title: "Confirmação!",
					size: "sm",
					buttonSize: "sm",
					okVariant: "success",
					okTitle: "SIM",
					cancelTitle: "NÃƒO",
					footerClass: "p-2",
					hideHeaderClose: false,
					centered: true
				});
			if (check == true) {
                this.loading = true;
				this.$axios
					.delete("/fidelidade/produto", {
						data: { id: item.id }
					})
					.then(res => {
                        this.loading = false;
						this.getProdutos();
						this.showSnackbar("Produto Deletado Com Sucesso!", "success", 2000);
					})
					.catch(err => {
                        this.loading = false;
						console.log(err);
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
						pagina: "fidelidade_produtos"
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