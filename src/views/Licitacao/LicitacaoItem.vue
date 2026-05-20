<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="4">
				<v-btn small color="primary" @click="voltar">
					<i class="fas fa-arrow-left mr-2"></i> Voltar
				</v-btn>
			</v-col>
		</v-row>

		<v-row justify="center">
			<v-dialog v-model="dialogCriarEditar" persistent max-width="600px">
				<template v-slot:activator="{ on }">
					<v-row>
						<v-col class="ml-3" cols="12" md="4">
							<v-btn small color="success" v-on="on">
								<i class="fas fa-plus mr-2"></i>Cadastrar
							</v-btn>
						</v-col>
					</v-row>
				</template>
				<v-card>
					<v-card-title>
						<span class="headline">{{ formTitle }}</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form" v-model="valid" lazy-validation>
								<v-row class="custom-row">
									<v-col cols="12" md="4">
										<v-text-field
											label="Codigo"
											class="uppercase"
											v-model="editedItem.codigo"
											:rules="[v => !!v.trim() || 'Campo obrigatório!']"
											filled
											required
										></v-text-field>
									</v-col>
								</v-row>
								<v-row class="custom-row">
									<v-col cols="12" md="12">
										<v-textarea
											label="Descrição"
											class="uppercase"
											v-model="editedItem.descricao"
											:rules="[v => !!v.trim() || 'Campo obrigatório!']"
											filled
											no-resize
											rows="2"
											required
										></v-textarea>
									</v-col>
								</v-row>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<div class="flex-grow-1"></div>
						<v-btn small color="error" @click="close">Voltar</v-btn>
						<v-btn small color="success" @click="save">Salvar</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>

		<v-row>
			<v-col sm="12">
				<v-card>
					<v-card-title>
						Items
						<div class="flex-grow-1"></div>
						<v-text-field v-model="search" label="Buscar" single-line hide-details></v-text-field>
					</v-card-title>

					<v-data-table
						class="text-uppercase"
						:headers="headers"
						:items="itens"
						:items-per-page="5"
						dense
						:search="search"
						:footer-props="{ itemsPerPageOptions: [10, 20, 30], itemsPerPageText: 'Itens por pagina' }"
					>
						<template v-slot:item.codigo="{ item }">
							<v-btn text class="ml-n3" color="primary" @click="passarData(item)">{{item.codigo}}</v-btn>
						</template>

						<template v-slot:item.acao="{ item }">
							<v-btn class="ma-2" small color="warning" @click="editItem(item)">
								<i class="far fa-edit mr-2"></i> Editar
							</v-btn>

							<v-btn class="ma-2" small color="error" @click="confirmDelete(item)">
								<i class="far fa-trash-alt mr-2"></i> Deletar
							</v-btn>

							<v-dialog v-model="dialogDelete" max-width="290">
								<v-card>
									<v-card-title class="headline">Atenção!</v-card-title>
									<v-card-text>Deseja realmente excluir este item? Está ação não poderá de ser desfeita!</v-card-text>
									<v-card-actions>
										<div class="flex-grow-1"></div>
										<v-btn small color="error" @click="close">Voltar</v-btn>
										<v-btn small color="success" @click="deleteItem(editedItem)">Sim</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>

		<v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">{{msgSnackbar}}</v-snackbar>
	</v-container>
</template>
<script>
export default {
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "Cadastro Item" : "Editar Item";
		}
	},
	props: {
		id: [String]
	},

	data: () => ({
		valid: true,
		itens: [],
		dialogCriarEditar: false,
		dialogDelete: false,
		search: "",
		headers: [
			{
				align: "left",
				sortable: false
			},
			{ text: "Codigo", value: "codigo", width: 20 },
			{ text: "Descrição", value: "descricao", width: 600 },
			{ text: "Ação", value: "acao" }
		],
		editedIndex: -1,
		editedItem: {
			codigo: "",
			descricao: ""
		},
		defaultItem: {
			codigo: "",
			descricao: ""
		},
		msgSnackbar: "",
		typeSnackbar: "",
		snackbar: false,
		timeSnackbar: 2000
	}),

	mounted() {
		this.getItem();
	},
	methods: {
		getItem() {
			this.$axios
				.get("/itens_licitacao")
				.then(res => {
					this.itens = res.data;
				})
				.catch(err => {
					console.log(err);
				});
		},

		save() {
			if (this.editedIndex > -1) {
				if (this.$refs.form.validate()) {
					//edit
					this.$axios
						.put("/item_licitacao", {
							id: this.editedItem.id,
							codigo: this.editedItem.codigo,
							descricao: this.editedItem.descricao
						})
						.then(res => {
							this.$refs.form.resetValidation();
							this.close();
							this.getItem();
							this.showSnackbar("ITEM EDITADO COM SUCESSO!", "success", 2000);
						})
						.catch(err => {
							console.log(err);
						});
				}
			} else {
				if (this.$refs.form.validate()) {
					//save
					this.$axios
						.post("/item_licitacao", {
							codigo: this.editedItem.codigo,
							descricao: this.editedItem.descricao
						})
						.then(res => {
							this.close();
							this.getItem();
							this.showSnackbar(
								"ITEM CADASTRADO COM SUCESSO!",
								"success",
								2000
							);
						})
						.catch(err => {
							console.log(err);
						});
				}
			}
		},

		editItem(item) {
			this.editedIndex = this.itens.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogCriarEditar = true;
		},

		confirmDelete(item) {
			this.editedIndex = this.itens.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItem(editedItem) {
			this.$axios
				.delete("/item_licitacao", {
					data: { id: this.editedItem.id }
				})
				.then(res => {
					this.close();
					this.getItem();
					this.showSnackbar("ITEM DELETADO COM SUCESSO!", "success", 2000);
					
				})
				.catch(err => {
					console.log(err);
				});
		},

		close() {
			this.dialogCriarEditar = false;
			this.dialogDelete = false;

			this.editedItem = Object.assign({}, this.defaultItem);
			this.editedIndex = -1;
			//this.$refs.form.resetValidation();
		},
		voltar() {
			this.$router.push({ path: `/licitacao/${this.id}` });
		},

		passarData(item) {
			this.$router.push({ path: `/licitacao/${item.id}` });
		},

		showSnackbar(msg, type, time = 0) {
			this.msgSnackbar = msg;
			this.typeSnackbar = type;
			this.snackbar = true;
			this.timeSnackbar = time;
		}
	}
};
</script>
<style scope>
.uppercase input {
	text-transform: uppercase;
}
</style>