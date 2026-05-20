<template>
	<v-container>
		<v-card style="margin-bottom: 90px !important;">
			<v-card-title>
				Faculdade - Semestre - Nome da Lista
				<v-btn class="ml-3 error" @click="$parent.editar = false">Voltar</v-btn>
			</v-card-title>
			<v-banner single-line class="blue lighten-5" sticky width="100%">
				<div class="blue lighten-5" style="width:100%">
					<v-card class="blue lighten-5">
						<v-card-title style="padding: 0px 0px 0px !important;">
							<v-row>
								<v-col cols="12" sm="5">
									<v-text-field
										v-model="descricao"
										v-on:keyup="findProduto()"
										prepend-icon="fa-edit"
										label="Buscar por descrição"
										single-line
										hide-details
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="5">
									<v-text-field
										v-model="codigo"
										prepend-icon="fa-search"
										label="Buscar por código"
										single-line
										hide-details
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="2">
									<v-btn v-if="toggle" color="warning" @click="toggle = false">Fechar</v-btn>
									<v-btn v-else-if="produtos.length > 0" color="primary" @click="toggle = true">Mostrar</v-btn>
								</v-col>
							</v-row>
						</v-card-title>

						<v-data-table
							v-if="toggle"
							fixed-header
							dense
							:headers="headersProdutos"
							height="150"
							hide-default-footer
							:items="produtos"
							disable-pagination
							class="elevation-1"
						>
							<template v-slot:item.valor="{item}">{{item.valor.toFixed(2).replace('.', ',')}}</template>
							<template v-slot:item.qtd="{item}">
								<v-text-field
									class="input-qtd-produtos input-no-details"
									dense
									@click:append="addOrRemoveItem(item)"
									@keypress.enter="addOrRemoveItem(item)"
									:append-icon="item.added ? 'fa-times error--text': 'fa-check success--text'"
									v-model="item.qtd"
								></v-text-field>
							</template>
						</v-data-table>
					</v-card>
				</div>
			</v-banner>
			<v-divider></v-divider>
			<v-data-table
				:headers="headers"
				hide-default-footer
				:items="orderedItens"
				disable-pagination
				class="elevation-1"
			>
				<template v-slot:item.cod="{item}">
					<div v-if="!item.titulo">
						<h3>{{item.id}}</h3>
						<v-text-field
							@keypress.enter="getProduto($event.target.value, item)"
							@keyup="$event.target.value.length === 0 ? item.disponivel_item = 0 : ''"
							:ref="item.id.toString() + 'input-codigo'"
							label="Código"
							class="label"
							:value="item.cod"
						></v-text-field>
						<v-text-field
							label="Código Marca 2"
							class="label"
							background-color="blue lighten-4"
							v-if="item.marcaOpcional"
							v-model="item.codMarcaOpcional"
						></v-text-field>
					</div>
				</template>
				<template v-slot:item.qtd_item="{item}">
					<div v-if="!item.titulo">
						<v-text-field class="input-no-details" v-mask="'##'" solo v-model="item.qtd_item"></v-text-field>
						<h4 :class="item.saldo > 0 ? 'success--text' : 'error--text'">Saldo: {{item.saldo}}</h4>
						<h4>Lucro: {{item.lucro}}</h4>
					</div>
				</template>
				<template v-slot:item.descri_item="{item}">
					<div v-if="!item.titulo">
						<v-textarea
							label="Descrição Sistema"
							class="label"
							auto-grow
							:rows="1"
							v-model="item.descri_item"
						></v-textarea>
						<v-textarea label="Descrição Site" class="label" auto-grow :rows="1" v-model="item.descricao"></v-textarea>
						<v-textarea
							background-color="blue lighten-4"
							v-if="item.marcaOpcional"
							label="Descrição Marca 2"
							class="label"
							auto-grow
							:rows="1"
							v-model="item.descricaoMarcaOpcional"
						></v-textarea>
						<div v-if="item.kit" style="border-style: solid; border-width: 2px; border-color: #fb8c00;">
							<div class="ma-3">
								<h4>Conteudo do Kit</h4>
								<div v-for="(row, index) in item.rowsKits" :key="index">
									<v-row>
										<v-col cols="12" md="3">
											<v-text-field
												class="input-no-details input-qtd-produtos"
												v-mask="'##'"
												v-model="row.qtd"
											></v-text-field>
										</v-col>
										<v-col cols="12" md="9">
											<v-textarea
												class="input-no-details input-qtd-produtos"
												auto-grow
												:rows="1"
												v-model="row.descricao"
												@click:append="row.button == '+' ? addRowKit(item) : removeRowKit(item)"
												:append-icon="row.button == '+' ? 'fa-plus success--text': 'fa-minus error--text'"
											></v-textarea>
										</v-col>
									</v-row>
								</div>
							</div>
						</div>
					</div>
					<div v-else>
						<v-textarea label="Titulo" class="label" auto-grow :rows="1" v-model="item.descricao"></v-textarea>
					</div>
				</template>
				<template v-slot:item.valor="{item}">
					<div v-if="!item.titulo">
						<div class="text-left">
							<label class="label-text">Valor Sistema</label>
							<br />
							<span>R$ {{(parseFloat(item.valor)).toFixed(2).replace('.', ',')}}</span>
						</div>
						<div
							style="font-size: 14px !important;"
							class="v-input label v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted"
						>
							<div class="v-input__control">
								<div class="v-input__slot">
									<div class="v-text-field__slot">
										<label
											for="input-money"
											class="v-label v-label--active theme--light"
											style="left: 0px; right: auto; position: absolute;"
										>Valor Site</label>
										<money
											v-model="item.valor_site"
											id="input-money"
											v-bind="$money"
											:class="item.checked ? 'white' : 'warning'"
											@change="calcTotalItens(); checkLimiteValorSite($event.target.value, item);checkIfChecked(item)"
											@keyup.native="calcTotalItens(); checkIfChecked(item); checkLimiteValorSite($event.target.value, item)"
											@click="calcTotalItens(); checkIfChecked(item)"
											@blur="calcTotalItens(); checkIfChecked(item)"
											@focus="calcTotalItens(); checkIfChecked(item)"
										></money>
									</div>
								</div>
								<div class="v-text-field__details">
									<div class="v-messages theme--light">
										<div class="v-messages__wrapper"></div>
									</div>
								</div>
							</div>
						</div>
						<div
							v-if="item.marcaOpcional"
							style="font-size: 14px !important;"
							class="v-input label v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted"
						>
							<div class="v-input__control">
								<div class="v-input__slot blue lighten-4">
									<div class="v-text-field__slot">
										<label
											for="input-money"
											class="v-label v-label--active theme--light"
											style="left: 0px; right: auto; position: absolute;"
										>Valor Marca 2</label>
										<money v-model="item.valorMarcaOpcional" id="input-money" v-bind="$money"></money>
									</div>
								</div>
								<div class="v-text-field__details">
									<div class="v-messages theme--light">
										<div class="v-messages__wrapper"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-slot:item.marca="{item}">
					<div v-if="!item.titulo">
						<div v-if="item.luva">
							<div class="ma-2" style="border-style: solid; border-width: 2px; border-color: #4caf50;">
								<v-autocomplete
									v-model="item.luvaCodigos"
									:items="arrayLuvas"
									color="success"
									auto-select-first
									hide-no-data
									outlined
									dense
									chips
									deletable-chips
									item-text="codigo"
									item-value="codigo"
									small-chips
									label="Código"
									class="label mt-2 ml-1 mr-1 input-qtd-produtos"
									multiple
									:search-input.sync="searchLuva"
								></v-autocomplete>
								<v-autocomplete
									v-model="item.luvaTamanhos"
									:items="['PP', 'P', 'M', 'G', '6,5', '7,0', '7,5', '8,0', '8,5']"
									outlined
									color="success"
									dense
									chips
									deletable-chips
									small-chips
									label="Tamanho"
									class="label ml-1 mr-1 input-qtd-produtos"
									multiple
								></v-autocomplete>
							</div>
						</div>

						<div v-else>
							<v-textarea label="Marca 1" class="label" auto-grow :rows="1" v-model="item.marca"></v-textarea>
							<v-textarea
								background-color="blue lighten-4"
								v-if="item.marcaOpcional"
								label="Marca 2"
								class="label"
								auto-grow
								:rows="1"
								v-model="item.nomeMarcaOpcional"
							></v-textarea>
						</div>
					</div>
				</template>
				<template v-slot:item.obs_item="{item}">
					<v-textarea
						v-if="!item.titulo"
						label="Obs"
						class="label"
						auto-grow
						:rows="1"
						v-model="item.obs_item"
					></v-textarea>
				</template>
				<template v-slot:item.disponivel_item="{item}">
					<v-switch v-if="!item.titulo" dense v-model="item.disponivel_item" color="primary">
						<template v-slot:label>
							<span class="primary--text" v-if="item.disponivel_item">Disponível: SIM</span>
							<span class="error--text" v-else>Disponível: NÃƒO</span>
						</template>
					</v-switch>
					<v-switch dense v-model="item.opcional_item" color="primary">
						<template v-slot:label>
							<span class="primary--text" v-if="item.opcional_item">Opcional: SIM</span>
							<span class="error--text" v-else>Opcional: NÃƒO</span>
						</template>
					</v-switch>
					<v-checkbox v-model="item.trava_qtd_item" label="Travar Qtd"></v-checkbox>
				</template>
				<template v-slot:item.acao="{item}">
					<v-icon @click="addRow(item)" small color="success">fa-plus</v-icon>
					<v-divider class="ma-3"></v-divider>
					<v-icon @click="removeRow(item)" small color="error">fa-minus</v-icon>
					<v-divider class="ma-3"></v-divider>
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-icon v-on="on" small color="primary">fa-cogs</v-icon>
						</template>
						<v-list>
							<v-list-item v-if="!item.titulo && !item.luva && !item.marcaOpcional">
								<v-list-item-title @click="item.marcaOpcional = true">
									<v-btn text color="primary" small>Marca 2</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="item.marcaOpcional">
								<v-list-item-title>
									<v-btn @click="item.marcaOpcional = false" text color="primary" small>Remover Marca 2</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="!item.titulo && !item.luva && !item.kit">
								<v-list-item-title>
									<v-btn @click="item.kit = true" text color="warning" small>Ã¨ um KIT</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="item.kit">
								<v-list-item-title>
									<v-btn @click="item.kit = false" text color="warning" small>Não Ã¨ um KIT</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="!item.titulo && !item.luva && !item.marcaOpcional && !item.kit">
								<v-list-item-title>
									<v-btn @click="item.luva = true" text color="success" small>Ã¨ uma LUVA</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="item.luva">
								<v-list-item-title class="primary--text">
									<v-btn @click="item.luva = false" text color="success" small>Não Ã¨ uma LUVA</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="!item.titulo && !item.luva && !item.marcaOpcional && !item.kit">
								<v-list-item-title class="primary--text">
									<v-btn @click="item.titulo = true" text color="primary" small>Titulo</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="item.titulo">
								<v-list-item-title class="primary--text">
									<v-btn @click="item.titulo = false" text color="primary" small>Não é Titulo</v-btn>
								</v-list-item-title>
							</v-list-item>
							<v-list-item>
								<v-list-item-title>
									<v-btn text color="primary" small>Destacar</v-btn>
								</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</template>
			</v-data-table>
		</v-card>
		<v-footer style="padding-left: 260px" fixed>
			<v-row>
				<v-col cols="12" md="2">
					<div>
						<b>Lucro Site:</b>
						<span>{{lucroSite}}</span>
					</div>
					<div>
						<b>Lucro Sistema:</b>
						<span>{{lucroSistema}}</span>
					</div>
				</v-col>
				<v-col cols="12" md="2">
					<div>
						<b>Total Site:</b>
						<span>{{valorTotalSite}}</span>
					</div>
					<div>
						<b>Total Sistema:</b>
						<span>{{valorTotalSistema}}</span>
					</div>
				</v-col>
				<v-col cols="12" md="2">
					<div>
						<b>Itens:</b>
						<span>{{totalItens}}</span>
					</div>
					<div>
						<b>Opcionais:</b>
						<span>{{totalItensOpcionais}}</span>
					</div>
				</v-col>
				<v-divider vertical light></v-divider>
				<v-col cols="12" md="2">
					<v-text-field
						@keypress.enter="callDescontoGeral()"
						v-model="descontoGeral"
						label="Desconto Geral"
						class="input-qtd-produtos"
						suffix="%"
					></v-text-field>
					<v-btn v-if="temDesconto" class="ml-3 warning" @click="callDescontoGeral()">Resetar</v-btn>
					<v-btn v-else class="ml-3 primary" @click="callDescontoGeral()">Aplicar</v-btn>
				</v-col>
				<v-col cols="12" md="1">
					<v-btn class="ma-1 success" @click="salvarLista()">Salvar</v-btn>
					<v-btn class="ma-1 primary">Imprimir</v-btn>
				</v-col>
				<v-col cols="12" md="2">
					<v-btn class="ma-1 error" @click="$parent.editar = false">Voltar</v-btn>
					<v-btn class="ma-1 primary" @click="pedidoDCInfo()">Pedido DC-Info</v-btn>
				</v-col>
			</v-row>
		</v-footer>

		<v-dialog v-model="itemRepetidoDialog" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Item Repetido</v-card-title>
				<v-card-text>O Item {{objectItem.codigo}} - {{objectItem.descricao}} já se encontra na lista, o que deseja fazer?</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" text @click="itemRepetidoDialog = false">Voltar</v-btn>
					<v-btn color="primary" text @click="somarItemRepetido(objectItem)">Somar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

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
	props: {
		lista: [Object],
		completa: [Boolean],
		original: [Boolean]
	},
	data: () => ({
		permissoes: {},
		typeSnackbar: "",
		timeSnackbar: 0,
		msgSnackbar: "",
		snackbar: false,
		loading: false,
		search: "",
		itens: [],
		headersProdutos: [
			{ text: "Código", value: "codigo", sortable: true },
			{ text: "Saldo", value: "saldo", sortable: true },
			{ text: "Descrição", value: "descricao", sortable: true },
			{ text: "Marca", value: "marca", sortable: true },
			{ text: "Valor", value: "valor", sortable: true },
			{ text: "Qtd", value: "qtd", sortable: false, width: 100 }
		],
		headers: [
			{
				text: "Código",
				value: "cod",
				align: "center",
				sortable: true,
				width: 180
			},
			{
				text: "Qtd",
				value: "qtd_item",
				align: "center",
				sortable: false,
				width: 80
			},
			{ text: "Descrição", value: "descri_item", sortable: false, width: 300 },
			{
				text: "Valor",
				value: "valor",
				align: "center",
				sortable: false,
				width: 150
			},
			{ text: "Marca", value: "marca", sortable: false },
			{ text: "Obs", value: "obs_item", sortable: false },
			{
				text: "Disponivel/Opcional",
				align: "center",
				value: "disponivel_item",
				sortable: false
			},
			{
				text: "Ação",
				align: "center",
				value: "acao",
				sortable: false,
				width: 50
			}
		],
		descricao: "",
		codigo: "",
		produtos: [],
		toggle: false,
		rowId: 0,
		itemRepetidoDialog: false,
		objectIndex: -1,
		objectItem: {},
		valorTotalSite: 0,
		valorTotalSistema: 0,
		lucroSistema: 0,
		lucroSite: 0,
		totalItens: 0,
		totalItensOpcionais: 0,
		descontoGeral: "",
		temDesconto: false,
		luvas: [],
		searchLuva: null,
		headersAux: []
	}),
	created() {
		this.$root.$emit("title", "Editar Lista");
		this.getPermissao();
		this.getItensLista();
	},
	computed: {
		orderedItens: function() {
			function compare(a, b) {
				if (a.id < b.id) return -1;
				if (a.id > b.id) return 1;
				return 0;
			}

			this.itens.forEach(item => {
				item.checked = true;
				if (item.luva) {
					item.luvaCodigos.forEach(cod => {
						this.luvas.push(cod);
					});
				}
			});

			return this.itens.sort(compare);
		},
		arrayLuvas: function() {
			return this.luvas;
		}
	},
	watch: {
		searchLuva(val) {
			this.getLuva(val);
		}
	},
	methods: {
		checkIfChecked(item) {
			if (item.valor_site) {
				item.checked = true;
			}
		},
		checkLimiteValorSite(valor_digitado, item) {
			valor_digitado = parseFloat(valor_digitado.replace(",", "."));
			//100   *   (10   Ã·   100)
			let maximo =
				parseFloat(item.valor) * (this.permissoes.margem_preco / 100) +
				parseFloat(item.valor);

			let minimo =
				parseFloat(item.valor) -
				parseFloat(item.valor) * (this.permissoes.margem_preco / 100);

			if (valor_digitado > maximo) {
				item.valor_site = maximo.toFixed(2);
			}
			if (valor_digitado < minimo) {
				item.valor_site = minimo.toFixed(2);
			}

			this.calcTotalItens();
		},
		calcTotalItens() {
			let itens = 0;
			let itensOpcionais = 0;
			let valoresSite = 0;
			let valoresSistema = 0;
			let ultimaCompra = 0;
			let totalUltimaCompra = 0;
			this.itens.forEach(item => {
				ultimaCompra = parseFloat(item.valorUltimaCompra);

				if (ultimaCompra == 0) {
					ultimaCompra = parseFloat(item.valorFabricante);
				} else {
					ultimaCompra =
						parseFloat(item.valorUltimaCompra) *
						((100 + parseFloat(item.ipi)) / 100);
				}

				// if (!item.valor_site) {
				// 	item.disponivel_item = 0;
				// }

				if (
					item.disponivel_item == 1 &&
					item.opcional_item == 0 &&
					!item.titulo
				) {
					if (!item.qtd_item) {
						item.qtd = 1;
					}
					if (item.valor_site < 0) {
						item.valor_site = 0;
					}
					itens += parseInt(item.qtd_item);
					valoresSite += parseFloat(item.valor_site) * item.qtd_item;
					valoresSistema += parseFloat(item.valor) * item.qtd_item;
					totalUltimaCompra += ultimaCompra * item.qtd_item;

					let lucro = (item.valor_site / ultimaCompra) * 100 - 100;
					item.lucro = lucro.toFixed(2) + "%";
				} else {
					if (item.opcional_item == 1) {
						itensOpcionais += parseInt(item.qtd_item);
					}
				}
			});
			this.valorTotalSite = valoresSite.toFixed(2);
			this.valorTotalSistema = valoresSistema.toFixed(2);
			this.totalItens = itens;
			this.totalItensOpcionais = itensOpcionais;

			this.lucroSistema =
				(this.valorTotalSistema / totalUltimaCompra) * 100 - 100;
			this.lucroSite = (this.valorTotalSite / totalUltimaCompra) * 100 - 100;

			this.lucroSistema = this.lucroSistema.toFixed(2) + "%";
			this.lucroSite = this.lucroSite.toFixed(2) + "%";
		},
		callDescontoGeral() {
			if (!this.temDesconto) {
				if (this.descontoGeral.indexOf(",") > -1) {
					this.descontoGeral.replace(",", ".");
				}
				if (
					this.descontoGeral == 0 ||
					isNaN(this.descontoGeral) ||
					this.descontoGeral == ""
				) {
					// this.$dialogs
					// 	.alert("Valor de desconto incorreto!", this.optionsAlert)
					// 	.then(res => {});
				} else {
					this.descontoGeral = parseFloat(this.descontoGeral);
					this.itens.forEach(element => {
						let valorAtual = parseFloat(element.valor_site);
						let valorComDesconto =
							valorAtual - valorAtual * (this.descontoGeral / 100);
						element.valor_site = valorComDesconto.toFixed(2);
					});
					this.calcTotalItens();
					this.temDesconto = true;
				}
			} else {
				this.itens.forEach(element => {
					element.valor_site = element.valor_original_site;
				});
				this.temDesconto = false;
				this.descontoGeral = "";
				this.calcTotalItens();
			}
		},
		checkEditValue(item, data) {
			const options = {
				title: "Atenção",
				size: "sm",
				okLabel: "Usar Valor Sistema",
				cancelLabel: "Manter Valor"
			};
			this.$dialogs.confirm("O que você deseja fazer?", options).then(res => {
				if (res.ok) {
					item.valor_site = data.valor;
					item.valor = data.valor;
					item.valor_original_site = data.valor;
					item.cod = data.codigo;
					item.descri_item = data.descricao;
					item.descricao = data.descricao;
					item.marca = data.marca;
					item.saldo = data.saldo;
					item.valorUltimaCompra = data.valor_ultima_compra;
					item.ipi = data.ipi;
					item.valorFabricante = data.valor_fabricante;
				} else {
					item.cod = data.codigo;
					item.descri_item = data.descricao;
					item.descricao = data.descricao;
					item.valor = data.valor;
					item.marca = data.marca;
					item.saldo = data.saldo;
					item.valorUltimaCompra = data.valor_ultima_compra;
					item.ipi = data.ipi;
					item.valorFabricante = data.valor_fabricante;
				}
				item.disponivel_item = 1;
				//this.calcTotalItens();
			});
			//item.markDescricao = true;
		},
		getLuva(codigo) {
			if (codigo && codigo.length >= 4) {
				setTimeout(
					() =>
						this.$axios
							.get("/produto/findByCod", {
								params: {
									codigo: codigo
								}
							})
							.then(res => {
								console.log(res.data);
								this.luvas = res.data;
							})
							.catch(err => {
								console.log(err);
							}),
					500
				);
			}
		},
		getProduto(value, item) {
			if (value) {
				this.$axios
					.get("/produto/getByCod", {
						params: {
							cod: value
						}
					})
					.then(res => {
						if (res.data === false) {
							//item nao encontrado
							this.showSnakerbar("Produto Não Encontrado!", "warning", 2000);
						} else {
							item.cod = "";
							item.descricao = "";
							item.descri_item = "";
							// item.valor_site = "";
							item.valor_original_site = "";
							item.valor = "";
							item.marca = "";
							item.saldo = "";
							item.valorUltimaCompra = "";
							item.ipi = "";
							item.valorFabricante = "";
							item.disponivel_item = 0;
							if (this.itens.some(e => e.cod == res.data.codigo)) {
								this.showSnakerbar(
									"Produto " +
										res.data.codigo +
										" - " +
										res.data.descricao +
										" Repetido!",
									"warning"
								);
							} else {
								if (item.valor_site) {
									this.checkEditValue(item, res.data);
								} else {
									item.cod = res.data.codigo;
									item.descricao = res.data.descricao;
									item.descri_item = res.data.descricao;
									item.valor_site = res.data.valor;
									item.valor_original_site = res.data.valor;
									item.valor = res.data.valor;
									item.marca = res.data.marca;
									item.saldo = res.data.saldo;
									item.valorUltimaCompra = res.data.valor_ultima_compra;
									item.ipi = res.data.ipi;
									item.valorFabricante = res.data.valor_fabricante;
									item.disponivel_item = 1;

									//this.insertRowLuva(res.data.codigo);
								}
							}
							this.calcTotalItens();
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		removeRow(item) {
			if (this.itens.length !== 1) {
				this.itens = this.itens.filter(function(element) {
					return element.id != item.id;
				});
				for (let i = 0; i < this.itens.length; i++) {
					this.$set(this.itens[i], "id", i);
				}
				this.totalItens -= item.qtd_item;
				this.calcTotalItens();
			}
		},
		addRow(item) {
			var row = {
				id: item.id + 1,
				cod: "",
				qtd_item: 1,
				saldo: 0,
				descricao: "",
				descri_item: "",
				valor: 0,
				valor_site: 0,
				valor_original_site: 0,
				marca: "",
				obs_item: "",
				disponivel_item: 0,
				opcional_item: 0,
				markDescricao: false,
				marcaOpcional: false,
				descricaoMarcaOpcional: "",
				nomeMarcaOpcional: "",
				valorMarcaOpcional: "",
				codMarcaOpcional: "",
				luva: false,
				luvaCodigos: [],
				luvaTamanhos: [],
				kit: false,
				rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
				trava_qtd_item: false,
				titulo: false,
				valorUltimaCompra: 0,
				ipi: 0,
				valorFabricante: 0
			};

			let i = item.id + 1;
			for (i; i < this.itens.length; i++) {
				this.$set(this.itens[i], "id", this.itens[i].id + 1);
			}

			this.itens.push(row);
			this.rowId = this.itens.length;
			this.totalItens += row.qtd;
			this.calcTotalItens();

			this.$nextTick(() => {
				let index = item.id + 1 + "input-codigo";
				let input = this.$refs[index];
				input.focus();
				this.$nextTick(() => {
					window.scrollBy(0, -50);
				});
			});
		},
		addRowKit(item) {
			if (item.rowsKits.length >= 1) {
				item.rowsKits.push({ qtd: 1, descricao: "", button: "-" });
			}
		},
		removeRowKit(item) {
			item.rowsKits.pop();
		},
		somarItemRepetido(itemRepetido) {
			this.itens.forEach(item => {
				if (item.cod === itemRepetido.codigo) {
					console.log("oba");
					item.qtd_item = item.qtd_item + 1;
				}
			});
			this.itemRepetidoDialog = false;
		},
		addOrRemoveItem(produto) {
			if (!produto.added) {
				if (this.itens.some(e => e.cod === produto.codigo)) {
					this.objectItem = produto;
					this.itemRepetidoDialog = true;
				} else {
					this.rowId = this.itens.length;
					var row = {
						id: this.rowId,
						cod: produto.codigo,
						qtd_item: produto.qtd,
						saldo: produto.saldo,
						descricao: produto.descricao,
						descri_item: produto.descricao,
						valor: produto.valor,
						valor_site: produto.valor,
						valor_original_site: produto.valor,
						marca: produto.marca,
						obs_item: "",
						disponivel_item: 1,
						opcional_item: 0,
						markDescricao: false,
						marcaOpcional: false,
						descricaoMarcaOpcional: "",
						nomeMarcaOpcional: "",
						valorMarcaOpcional: "",
						codMarcaOpcional: "",
						luva: false,
						luvaCodigos: [],
						luvaTamanhos: [],
						kit: false,
						rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
						trava_qtd_item: false,
						titulo: false,
						valorUltimaCompra: produto.valor_ultima_compra,
						ipi: produto.ipi,
						valorFabricante: produto.valor_fabricante
					};

					this.itens.push(row);

					produto.added = true;
					produto.row = this.rowId;
					this.rowId = this.itens.length;
					this.totalItens += parseInt(produto.qtd);
				}
			} else {
				// remover
				this.itens = this.itens.filter(function(element) {
					return element.cod != produto.codigo;
				});
				for (let i = 0; i < this.itens.length; i++) {
					this.$set(this.itens[i], "id", i);
				}
				produto.added = false;
				this.totalItens -= parseInt(produto.qtd);
			}

			this.calcTotalItens();
		},
		findProduto() {
			if (this.descricao && this.descricao.length >= 4) {
				setTimeout(
					() =>
						this.$axios
							.get("/produto/find", {
								params: {
									descricao: this.descricao
								}
							})
							.then(res => {
								console.log(res.data);
								this.produtos = res.data;
								this.toggle = true;
							})
							.catch(err => {
								console.log(err);
							}),
					500
				);
			}
		},
		findProdutoByCod() {
			if (this.codigo && this.codigo.length >= 4) {
				setTimeout(
					() =>
						this.$axios
							.post("/produto/findByCod", {
								codigo: this.codigo
							})
							.then(res => {
								console.log(res.data);
								this.produtos = res.data;
								this.toggle = true;
							})
							.catch(err => {
								console.log(err);
							}),
					500
				);
			}
		},
		getItensLista() {
			console.log(this.lista);
			this.loading = true;
			this.$axios
				.post("/lista/getItens", {
					id: this.lista.id_lista,
					original: this.original
				})
				.then(res => {
					this.loading = false;
					console.log(res.data);
					if (res.data === false) {
						this.showSnakerbar(
							"Erro no Servidor, Contate o Administrador",
							"error"
						);
					} else {
						this.itens = res.data;
						this.rowId = res.data.length;
						this.calcTotalItens();
					}
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		showSnakerbar(msg, type, time = 0) {
			this.typeSnackbar = type;
			this.timeSnackbar = time;
			this.msgSnackbar = msg;
			this.snackbar = true;
		},
		getPermissao() {
			this.$axios
				.get("/usuario/permissao/pagina", {
					params: {
						id_usuario: this.$usuario.value.id,
						pagina: "ver_lista"
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
<style scope>
.label-text {
	font-weight: 600;
	font-size: 14px;
	color: black !important;
}
</style>