<template>
	<v-container>
		<v-card v-if="showTable">
			<v-card-title>
				Buscar Item - <v-btn class="ml-2" small color="primary" @click="showTableRelatorio = true; showTable = false; mostrarCamposDiferenca = false">Relatório</v-btn>
				<v-spacer></v-spacer>
				<v-text-field
					v-model="search"
					append-icon="fa-search"
					label="Código, Fabricante ou Descrição"
					single-line
					hide-details
					autofocus
					@keypress.enter="getItens()"
				></v-text-field>
			</v-card-title>
			<v-data-table
				:footer-props="{
					itemsPerPageOptions: [10, 20, 50, -1],
					itemsPerPageText: 'Itens por pagina',
					}"
				no-data-text="Nenhum item encontrado"
				:headers="headers"
				:items="itens"
			>
				<template v-slot:item.descricao="{ item }">
					<v-btn text @click="itemClick(item)">{{item.descricao}}</v-btn>
				</template>
				<template v-slot:item.valor="{ item }">R$ {{item.valor.toFixed(2).replace('.', ',')}}</template>
				<template v-slot:item.saldo="{ item }">
					<v-chip v-if="item.saldo > 0" color="success" dark>{{item.saldo}}</v-chip>
					<v-chip v-else color="error" dark>{{item.saldo}}</v-chip>
				</template>
				<template
					v-slot:item.valor_ultima_compra="{ item }"
				>R$ {{item.valor_ultima_compra.toFixed(2).replace('.', ',')}}</template>
				<template v-slot:item.ipi="{ item }">
					<v-chip v-if="item.ipi > 0" color="success" dark>{{item.ipi}}</v-chip>
					<v-chip v-else color="error" dark>{{item.ipi}}</v-chip>
				</template>
				<template
					v-slot:item.valor_fabricante="{ item }"
				>R$ {{item.valor_fabricante.toFixed(2).replace('.', ',')}}</template>
			</v-data-table>
		</v-card>
		<v-card v-if="showTableRelatorio">
			<v-card-title>
				Relatório Por Marca - <v-btn class="ml-2" small color="error" @click="showTable = true; showTableRelatorio = false">Voltar</v-btn>
				<v-spacer></v-spacer>
				<v-text-field
					v-model="searchMarca"
					append-icon="fa-search"
					label="Marca"
					single-line
					hide-details
					autofocus
					@keypress.enter="getRelatorio()"
				></v-text-field>
			</v-card-title>
			<v-data-table
				:footer-props="{
					itemsPerPageOptions: [10, 20, 50, -1],
					itemsPerPageText: 'Itens por pagina',
					}"
				no-data-text="Nenhum item encontrado"
				:headers="headersRelatorio"
				:items="relatorio"
			>
				<template v-slot:item.descricao="{ item }">
					<v-btn text @click="itemClick(item)">{{item.descricao}}</v-btn>
				</template>
				<template v-slot:item.valor="{ item }">R$ {{item.valor.toFixed(2).replace('.', ',')}}</template>
				<template v-slot:item.saldo="{ item }">
					<v-chip v-if="item.saldo > 0" color="success" dark>{{item.saldo}}</v-chip>
					<v-chip v-else color="error" dark>{{item.saldo}}</v-chip>
				</template>
				<template
					v-slot:item.valor_ultima_compra="{ item }"
				>R$ {{item.valor_ultima_compra.toFixed(2).replace('.', ',')}}</template>
				<template v-slot:item.ipi="{ item }">
					<v-chip v-if="item.ipi > 0" color="success" dark>{{item.ipi}}</v-chip>
					<v-chip v-else color="error" dark>{{item.ipi}}</v-chip>
				</template>
				<template
					v-slot:item.valor_fabricante="{ item }"
				>R$ {{item.valor_fabricante.toFixed(2).replace('.', ',')}}</template>
			</v-data-table>
		</v-card>
		<div class="div-content">

			<div class="container" v-if="mostrarCamposDiferenca">
				<div class="row">
					<div class="col text-left">
						<label>Código: &nbsp;</label>
						<span class="font-weight-bold">&nbsp;{{item.codigo}}</span>
						<br />
						<label>Descrição: &nbsp;</label>
						<span class="font-weight-bold">&nbsp;{{item.descricao}}</span>
						<br />
						<label>Custo Sistema: &nbsp;</label>
						<span
							v-if="item.valor_ultima_compra == 0"
							class="font-weight-bold"
						>&nbsp;R$ {{item.valor_fabricante.toString().replace('.', ',')}}</span>
						<span
							v-else
							class="font-weight-bold"
						>&nbsp;R$ {{item.valor_ultima_compra.toString().replace('.', ',')}}</span>
					</div>
				</div>
				<div class="row mt-3">
					<div class="col">
						<div class="form-group">
							<input type="text" v-model="fornecedor1" class="form-control" placeholder="Fornecedor 1" />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<input type="text" v-model="fornecedor2" class="form-control" placeholder="Fornecedor 2" />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<input type="text" v-model="fornecedor3" class="form-control" placeholder="Fornecedor 3" />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<b>Qtd</b>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<b>{{fornecedor1}}</b>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<b>{{fornecedor2}}</b>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<b>{{fornecedor3}}</b>
						</div>
					</div>
				</div>
				<div class="row text-center">
					<div class="col">
						<div class="form-group">
							<input
								v-model="valor1"
								min="0.00"
								step="0.01"
								type="number"
								class="form-control"
								placeholder="Valor 1"
							/>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<input
								v-model="valor2"
								min="0.00"
								step="0.01"
								type="number"
								class="form-control"
								placeholder="Valor 2"
							/>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<input
								v-model="valor3"
								min="0.00"
								step="0.01"
								type="number"
								class="form-control"
								placeholder="Valor 3"
							/>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<input type="number" v-model="qtd" min="0" class="form-control" placeholder="QTD" />
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<span>{{numberToReal(valor1 * qtd)}}</span>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<span>{{numberToReal(valor2 * qtd)}}</span>
						</div>
					</div>
					<div class="col">
						<div class="form-group">
							<span>{{numberToReal(valor3 * qtd)}}</span>
						</div>
					</div>
				</div>
				<hr />
				<div class="row text-center">
					<div class="col">
						<button
							@click="mostrarCamposDiferenca = false; mostrarBuscaCodigo = true; mostrarBotoes = true; mostrarRelatorio = false; cleanInputs();"
							type="button"
							class="btn btn-outline-danger"
						>Voltar</button>
						<button type="button" class="btn btn-outline-primary" @click="salvar()">Salvar</button>
					</div>
				</div>
			</div>
		</div>
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
import axios from "axios";
import XLSX from "xlsx";
export default {
	data() {
		return {
			search: "",
			searchMarca: "",
			item: {},
			itens: [],
			loading: false,
			msgSnackbar: "",
			typeSnackbar: "",
			snackbar: false,
			timeSnackbar: 2000,
			itens: [],
			headers: [
				{ text: "Codigo", value: "codigo" },
				{ text: "Descrição", value: "descricao" },
				{ text: "Marca", value: "marca" },
				{ text: "Valor", value: "valor" },
				{ text: "Saldo", value: "saldo" },
				{ text: "Ultima Compra", value: "valor_ultima_compra" },
				{ text: "IPI", value: "ipi" },
				{ text: "Fabricante", value: "valor_fabricante" }
			],
			showTable: true,
			showTableRelatorio: false,
			codigo: "",
			descricao: "",
			codigoFabricante: "",
			mostrarCamposDiferenca: false,
			fornecedor: "",
			fornecedor1: "",
			fornecedor2: "",
			fornecedor3: "",
			qtd: 0,
			valor1: 0,
			valor2: 0,
			valor3: 0,
			marca: "",
			relatorio: [],
			headersRelatorio: [
				{ text: "Codigo", value: "codigo" },
				{ text: "Descrição", value: "descricao" },
				{ text: "Fornecedor 1", value: "fornecedor1" },
				{ text: "Fornecedor 2", value: "fornecedor2" },
				{ text: "Fornecedor 3", value: "fornecedor3" },
				{ text: "Qtd", value: "qtd" },
				{ text: "Valor 1", value: "valor1" },
				{ text: "Valor 2", value: "valor2" },
				{ text: "Valor 3", value: "valor3" }
			]
		};
	},
	created() {
		this.$root.$emit("title", this.$rota.currentRoute.name);
		this.getPermissao();
	},
	methods: {
		getRelatorio() {
			this.loading = true;
			this.$axios
				.get("/produto/relatorioComparaFornecedor", {
					params: {
						marca: this.searchMarca.trim()
					}
				})
				.then(res => {
					this.loading = false;
					console.log(res.data);
					this.relatorio = res.data;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		salvar() {
			let item = {
				codigo: this.item.codigo,
				fornecedor1: this.fornecedor1.trim(),
				fornecedor2: this.fornecedor2.trim(),
				fornecedor3: this.fornecedor3.trim(),
				qtd: this.qtd,
				valor1: this.valor1,
				valor2: this.valor2,
				valor3: this.valor3,
				usuario: this.$global.usuario.usuario.toUpperCase()
			};
			axios
				.post("/produto/comparaFornecedor", {
					item: item
				})
				.then(res => {
					console.log(res.data);
					if (typeof res.data === "object") {
						this.modalSalvo();
					} else {
						this.modalError(res.data);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},

		itemClick(item) {
			this.loading = true;
			this.$axios
				.get("/produto/comparaFornecedor", {
					params: {
						codigo: item.codigo
					}
				})
				.then(res => {
					this.loading = false;
					console.log(res.data);
					if (res.data === false) {
						this.showSnackbar(
							"Erro no Servidor, Contate o Administrador",
							"error"
						);
					} else {
						this.cleanInputs();
						this.item = item;
						this.mostrarBuscaCodigo = false;
						this.mostrarCamposDiferenca = true;
						this.fornecedor1 = res.data.fornecedor1;
						this.fornecedor2 = res.data.fornecedor2;
						this.fornecedor3 = res.data.fornecedor3;
						this.qtd = res.data.qtd;
						this.valor1 = res.data.valor1;
						this.valor2 = res.data.valor2;
						this.valor3 = res.data.valor3;
					}
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		cleanInputs() {
			this.fornecedor1 = "";
			this.fornecedor2 = "";
			this.fornecedor3 = "";
			this.qtd = 0;
			this.valor1 = 0;
			this.valor2 = 0;
			this.valor3 = 0;
		},
		numberToReal(numero) {
			numero.toFixed(2);
			var numero = numero.toFixed(2).split(".");
			numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join(".");
			return numero.join(",");
		},
		getItens() {
			this.loading = true;
			this.$axios
				.get("/produtos", {
					params: {
						search: this.search
					}
				})
				.then(res => {
					this.loading = false;
					if (res.data === false) {
						this.showSnackbar(
							"Erro no Servidor, Contate o Administrador",
							"error"
						);
					} else {
						this.itens = res.data;
						this.showTable = true;
					}
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
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
						pagina: "comparar_preco_fornecedor"
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
<style scoped>
</style>

