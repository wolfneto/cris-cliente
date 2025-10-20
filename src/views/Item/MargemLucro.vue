<template>
	<v-container>
		<div>
			<v-card>
				<v-card-title>
					Buscar Item
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
					v-if="showTable"
					:footer-props="{
					itemsPerPageOptions: [10, 20, 50, -1],
					itemsPerPageText: 'Itens por pagina',
					}"
					no-data-text="Nenhum item encontrado"
					:headers="headers"
					:items="itens"
				>
					<template v-slot:item.descricao="{ item }">
						<v-btn text @click="getDetalheItem(item)">{{item.descricao}}</v-btn>
					</template>
					<template v-slot:item.valor="{ item }">
						R$ {{item.valor.toFixed(2).replace('.', ',')}}
					</template>
					<template v-slot:item.saldo="{ item }">
						<v-chip v-if="item.saldo > 0" color="success" dark>{{item.saldo}}</v-chip>
						<v-chip v-else color="error" dark>{{item.saldo}}</v-chip>
					</template>
					<template v-slot:item.valor_ultima_compra="{ item }">
						R$ {{item.valor_ultima_compra.toFixed(2).replace('.', ',')}}
					</template>
					<template v-slot:item.ipi="{ item }">
						<v-chip v-if="item.ipi > 0" color="success" dark>{{item.ipi}}</v-chip>
						<v-chip v-else color="error" dark>{{item.ipi}}</v-chip>
					</template>
					<template v-slot:item.valor_fabricante="{ item }">
						R$ {{item.valor_fabricante.toFixed(2).replace('.', ',')}}
					</template>
				</v-data-table>
				<div v-else>
					<hr />
					<v-row justify="center">
						<v-col cols="3">
							<span>
								Código:
								<b>{{item.codigo}}</b>
							</span>
                            <br>
                            <v-btn class="mt-1" color="error" small @click="showTable = true">Voltar</v-btn>
						</v-col>
						<v-col cols="5">
							<span>
								Descrição:
								<b>{{item.descricao}}</b>
							</span>
						</v-col>
						<v-col cols="3">
							<span>
								Código Fabricante:
								<b>{{item.codigo_fornecedor}}</b>
							</span>
                            <br>
                            <v-btn class="mt-1" color="success" small @click="salvar()">Salvar</v-btn>
						</v-col>
					</v-row>
					<hr />
					<div class="text-size ml-4">
						<div class="row">
							<div class="col-sm-6">
								<div class="row">
									<div class="col-sm-5">
										<div class="row">
											<div class="col-sm-4">
												<label for="formGroupExampleInput" class="font-weight-bold float-left">ICM%</label>
											</div>
											<div class="col-sm-5">
												<input
													type="number"
													oninput="value=value.slice(0,02)"
													class="form-control campo-input"
													aria-label="Sizing example input"
													aria-describedby="inputGroup-sizing-sm"
													v-model="aliquotaIcm"
													@change="calculosInputs(item)"
													@keyup="calculosInputs(item)"
													@click="calculosInputs(item)"
													step="0.01"
													min="0"
												/>
											</div>
										</div>
									</div>
									<br />
									<div class="col-sm-7 no-padding">
										<table class="table table-bordered table-sm">
											<thead class="thead-light">
												<tr>
													<th th scope="col">CREDITO</th>
													<th th scope="col">DEBITO</th>
													<th th scope="col">VALOR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class>
														<span class>{{icmCredit.toFixed(2).replace('.', ',')}}</span>
													</td>
													<td v-if="!icmDebit" class="icmDebit">
														<span>0.00</span>
													</td>
													<td v-else-if="icmDebit === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else>
														<span class="icmDebit">{{icmDebit.toFixed(2).replace('.', ',')}}</span>
													</td>

													<td v-if="!valorIcm" class>
														<span class>0.00</span>
													</td>
													<td v-else-if="valorIcm === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else>
														<span class>{{valorIcm.toFixed(2).replace('.', ',')}}</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-5">
										<div class="row">
											<div class="col-sm-4">
												<label for="formGroupExampleInput" class="font-weight-bold float-left">PIS%</label>
											</div>
											<div class="col-sm-8">
												<div class="input-group mb-3">
													<div class="input-group-prepend">
														<span v-if="item.pis == 'S'" class="input-group-text text-size" id="basic-addon1">SIM</span>
														<span v-else class="input-group-text text-size" id="basic-addon1">NÃO</span>
													</div>
													<input
														type="number"
														oninput="value=value.slice(0,04)"
														class="form-control campo-input"
														aria-label="Sizing example input"
														aria-describedby="inputGroup-sizing-sm"
														v-model="aliquotaPis"
														@change="calculosInputs(item)"
														@keyup="calculosInputs(item)"
														@click="calculosInputs(item)"
														step="0.01"
														min="0"
													/>
												</div>
											</div>
										</div>
									</div>
									<br />
									<div class="col-sm-7 no-padding">
										<table class="table table-bordered table-sm">
											<thead class="thead-light">
												<tr>
													<th th scope="col">CREDITO</th>
													<th th scope="col">DEBITO</th>
													<th th scope="col">VALOR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class>
														<span class>{{pisCredit.toFixed(2).replace('.', ',')}}</span>
													</td>
													<td v-if="!pisDebit">
														<span class>0.00</span>
													</td>
													<td v-else-if="pisDebit === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else class>
														<span class>{{pisDebit.toFixed(2).replace('.', ',')}}</span>
													</td>

													<td v-if="!valorPis">
														<span class>0.00</span>
													</td>
													<td v-else-if="valorPis === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else class>
														<span class>{{valorPis.toFixed(2).replace('.', ',')}}</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-5">
										<div class="row">
											<div class="col-sm-4">
												<label for="formGroupExampleInput" class="font-weight-bold float-left">Cofins%</label>
											</div>
											<div class="col-sm-8">
												<div class="input-group mb-3">
													<div class="input-group-prepend">
														<span
															v-if="item.cofins == 'S'"
															class="input-group-text text-size"
															id="basic-addon1"
														>SIM</span>
														<span v-else class="input-group-text text-size" id="basic-addon1">NÃO</span>
													</div>
													<input
														type="number"
														oninput="value=value.slice(0,04)"
														class="form-control campo-input"
														aria-label="Sizing example input"
														aria-describedby="inputGroup-sizing-sm"
														v-model="aliquotaCofins"
														@change="calculosInputs(item)"
														@keyup="calculosInputs(item)"
														@click="calculosInputs(item)"
														step="0.01"
														min="0"
													/>
												</div>
											</div>
										</div>
										<br />
									</div>
									<br />
									<div class="col-sm-7 no-padding">
										<table class="table table-bordered table-sm">
											<thead class="thead-light">
												<tr>
													<th th scope="col">CREDITO</th>
													<th th scope="col">DEBITO</th>
													<th th scope="col">VALOR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class>
														<span class>{{cofinsCredit.toFixed(2).replace('.', ',')}}</span>
													</td>
													<td v-if="!cofinsDebit">
														<span class>0.00</span>
													</td>
													<td v-else-if="cofinsDebit === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else class>
														<span class>{{cofinsDebit.toFixed(2).replace('.', ',')}}</span>
													</td>

													<td v-if="!valorCofins" class>
														<span class>0.00</span>
													</td>
													<td v-else-if="valorCofins === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else class>
														<span class>{{valorCofins.toFixed(2).replace('.', ',')}}</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-5">
										<div class="row">
											<div class="col-sm-4">
												<label for="formGroupExampleInput" class="font-weight-bold float-left">IPI%</label>
											</div>
											<div class="col-sm-4">
												<input
													type="number"
													oninput="value=value.slice(0,02)"
													class="form-control campo-input"
													aria-label="Sizing example input"
													aria-describedby="inputGroup-sizing-sm"
													v-model="aliquotaIpi"
													@change="calculosInputs(item); calculoValorVenda() ; calculoMargem()"
													@keyup="calculosInputs(item) ; calculoValorVenda() ; calculoMargem()"
													@click="calculosInputs(item) ; calculoValorVenda() ; calculoMargem()"
													v-on:keyup="calculosInputs() ; calculoValorVenda() ; calculoMargem()"
													step="0.01"
													min="0"
												/>
											</div>
										</div>
										<br />
									</div>
									<br />
									<div class="col-sm-7 no-padding">
										<table class="table table-bordered table-sm">
											<thead class="thead-light">
												<tr>
													<th th scope="col">
														<p class="texto-cinza">CREDITO</p>
													</th>
													<th th scope="col">
														<p class="texto-cinza">DEBITO</p>
													</th>
													<th th scope="col">VALOR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td></td>
													<td></td>
													<td class>
														<span class>{{valorIpi.toFixed(2).replace('.', ',')}}</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-5">
										<div class="row">
											<div class="col-sm-4">
												<label for="formGroupExampleInput" class="font-weight-bold float-left">IRPJ-CSSL%</label>
											</div>
											<div class="col-sm-5">
												<input
													type="number"
													oninput="value=value.slice(0,04)"
													class="form-control campo-input"
													aria-label="Sizing example input"
													aria-describedby="inputGroup-sizing-sm"
													v-model="aliquotaIrpjCssl"
													@change="calculosInputs(item)"
													@keyup="calculosInputs(item)"
													@click="calculosInputs(item)"
													step="0.01"
													min="0"
												/>
											</div>
										</div>
										<br />
									</div>
									<br />
									<div class="col-sm-7 no-padding">
										<table class="table table-bordered table-sm">
											<thead class="thead-light">
												<tr>
													<th th scope="col">
														<p class="texto-cinza">CREDITO</p>
													</th>
													<th th scope="col">
														<p class="texto-cinza">DEBITO</p>
													</th>
													<th th scope="col">VALOR</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td></td>
													<td></td>
													<td v-if="!valorIrpjCssl">
														<span class>0.00</span>
													</td>
													<td v-else-if="valorIrpjCssl === Infinity">
														<span class="icmDebit">0.00</span>
													</td>
													<td v-else class>
														<span class>{{valorIrpjCssl.toFixed(2).replace('.', ',')}}</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>

							<div class="col-sm-6">
								<div>
									<div class="row">
										<div class="col-sm">
											<ul class="list-group text-left text-size">
												<li class="list-group-item li-height">
													<div class="row">
														<div class="col-sm-3">
															<label for>Custo</label>
														</div>
														<div class="col-sm-3">
															<input
																type="number"
																class="form-control font-weight-bold campo-input"
																aria-label="Sizing example input"
																aria-describedby="inputGroup-sizing-sm"
																v-model="custo"
																@change="calculosInputs(item);  calculoValorVenda() ; calculoMargem()"
																@keyup="calculosInputs(item) ;  calculoValorVenda() ; calculoMargem()"
																@click="calculosInputs(item) ;  calculoValorVenda() ; calculoMargem()"
																v-on:keyup="calculosInputs() ; calculoValorVenda() ; calculoMargem()"
																step="0.01"
																min="0"
															/>
														</div>
														<div class="col-sm-6">
															<label class for>Custo Final c/ Ipi:&nbsp;</label>
															<span class="font-weight-bold">{{custoFinal.toFixed(2)}}</span>
														</div>
													</div>
												</li>

												<li class="list-group-item li-height">
													<div class="row">
														<div class="col-sm-3">
															<label for>Margem</label>
														</div>
														<div class="col-sm-3">
															<input
																type="number"
																oninput="value=value.slice(0,05)"
																class="form-control font-weight-bold campo-input"
																aria-label="Sizing example input"
																aria-describedby="inputGroup-sizing-sm"
																v-model="margem"
																@change="calculoValorVenda(margem) ; calculosInputs(item)"
																@keyup="calculoValorVenda(margem) ; calculosInputs(item)"
																@click="calculoValorVenda(margem) ; calculosInputs(item)"
																step="0.001"
																min="0.1"
																max="0.999"
															/>
														</div>
													</div>
												</li>

												<li class="list-group-item cor-linha li-height">
													<div class="row">
														<div class="col-sm-3">
															<label for>Valor Venda &nbsp;</label>
														</div>
														<div class="col-sm-3">
															<input
																type="number"
																class="form-control font-weight-bold campo-input"
																aria-label="Sizing example input"
																aria-describedby="inputGroup-sizing-sm"
																v-model="valorVenda"
																@change="calculosInputs(item); calculoMargem(valorVenda)"
																@keyup="calculosInputs(item) ; calculoMargem(valorVenda)"
																@click="calculosInputs(item) ; calculoMargem(valorVenda)"
																step="0.01"
																min="0.0"
															/>
														</div>
														<div class="col-sm-6">
															<label for>Valor Venda Sistema:&nbsp;</label>
															<span class="font-weight-bold">R$ {{item.valor.toFixed(2).replace('.', ',')}}</span>
														</div>
													</div>
												</li>

												<li v-if="!lucro" class="list-group-item">
													<label for></label>
													<span class="font-weight-bold">Lucro: R$ 0,00</span>
												</li>
												<li v-else-if="lucro === Infinity" class="list-group-item">
													<label for>Lucro R$:</label>
													<span class="font-weight-bold">Lucro: R$ 0,00</span>
												</li>
												<li v-else class="list-group-item">
													<span class="font-weight-bold">Lucro: R$ {{lucro.toFixed(2).replace('.', ',')}}</span>
												</li>

												<li v-if="!lucroMercadoria" class="list-group-item">
													<span class="font-weight-bold">Lucro Bruto: 0,00%</span>
												</li>
												<li v-else-if="lucroMercadoria === Infinity" class="list-group-item">
													<span class="font-weight-bold">Lucro Bruto: 0,00%</span>
												</li>
												<li v-else class="list-group-item">
													<span class="font-weight-bold">Lucro Bruto: {{lucroMercadoria.toFixed(2).replace('.', ',')}}%</span>
												</li>

												<li v-if="!lucroFaturamento" class="list-group-item">
													<span class="font-weight-bold">Lucro Liquido: 0.00%</span>
												</li>
												<li v-else-if="lucroFaturamento === Infinity" class="list-group-item">
													<span class="font-weight-bold">Lucro Liquido: 0.00%</span>
												</li>
												<li v-else-if="lucroFaturamento === -Infinity" class="list-group-item">
													<span class="font-weight-bold">Lucro Liquido: 0.00%</span>
												</li>
												<li v-else class="list-group-item">
													<span class="font-weight-bold">Lucro Liquido: {{lucroFaturamento.toFixed(2).replace('.', ',')}}%</span>
												</li>
												<li class="list-group-item">
													<span class="font-weight-bold">CST: {{item.situacao_tributaria}}</span>
												</li>
												<li class="list-group-item">
													<span class="font-weight-bold">NCM: {{item.classificacao_fiscal}}</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</v-card>
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
export default {
	data: () => ({
		search: "",
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
		item: {},
		custo: 0,
		aliquotaIcm: 0,
		aliquotaIpi: 0,
		aliquotaPis: 0,
		aliquotaCofins: 0,
		valorIpi: 0,
		icmCredit: 0,
		icmDebit: 0,
		pisCredit: 0,
		pisDebit: 0,
		valorPis: 0,
		cofinsCredit: 0,
		cofinsDebit: 0,
		valorCofins: 0,
		custoFinal: 0,
		valorIcm: 0,
		valorVenda: 0,
		margem: 0,
		aliquotaIrpjCssl: 0,
		valorIrpjCssl: 0,
		lucro: 0,
		lucroMercadoria: 0,
		lucroFaturamento: 0
	}),
	created() {
		this.$root.$emit("title", this.$rota.currentRoute.name);
		this.getPermissao();
	},
	methods: {
        salvar() {
			let item = {
				codigo: this.item.codigo,
				aliquota_icm: this.aliquotaIcm,
				aliquota_pis: this.aliquotaPis,
				aliquota_cofins: this.aliquotaCofins,
				aliquota_ipi: this.aliquotaIpi,
				aliquota_irpj_cssl: this.aliquotaIrpjCssl,
				custo: this.custo,
				margem: this.margem,
				valor_venda: this.valorVenda,
				usuario: this.$usuario.value.usuario.toUpperCase()
			};
			this.$axios
				.post("/produto/aliquota", {
					item: item
				})
				.then(res => {
					console.log(res.data);
					if(res.data === false) {
                        this.showSnackbar(
							"Erro no Servidor, Contate o Administrador",
							"error"
						);
                    } else {
                        this.showSnackbar("Salvo Com Sucesso!", "success", 2000);
                    }
				})
				.catch(err => {
					console.log(err);
				});
			
		},
		getDetalheItem(item) {
			this.cleanInputs();
			this.item = item;

			this.aliquotaIpi = item.ipi;

			if (item.valor_ultima_compra == 0) {
				this.custo = item.valor_fabricante.toFixed(2);
			} else {
				this.custo = item.valor_ultima_compra.toFixed(2);
			}

			if (item.pis == "S") {
				this.aliquotaPis = 1.65;
			}
			if (item.cofins == "S") {
				this.aliquotaCofins = 7.6;
			}

			this.$axios
				.get("/produto/aliquota", {
					params: {
						codigo: item.codigo
					}
				})
				.then(res => {
					console.log(res.data);
					if (typeof res.data == "object") {
						this.aliquotaIcm = res.data.aliquota_icm;
						this.aliquotaPis = res.data.aliquota_pis;
						this.aliquotaCofins = res.data.aliquota_cofins;
						this.aliquotaIpi = res.data.aliquota_ipi;
						this.aliquotaIrpjCssl = res.data.aliquota_irpj_cssl;
						this.custo = res.data.custo;
						this.margem = res.data.margem;
						this.valorVenda = res.data.valor_venda;
					}
					this.calculosInputs(item);
					this.showTable = false;
				})
				.catch(err => {
					console.log(err);
				});
		},
		calculosInputs() {
			this.valorIpi = (this.custo * this.aliquotaIpi) / 100;
			this.custoFinal = parseFloat(this.custo) + parseFloat(this.valorIpi);

			this.icmCredit = (this.custo * this.aliquotaIcm) / 100;

			if (this.aliquotaIcm > 0) {
				this.icmDebit = (this.valorVenda * 18) / 100;
			} else {
				this.icmDebit = 0.0;
			}

			this.valorIcm = this.icmDebit - this.icmCredit;

			this.pisCredit = (this.custo * this.aliquotaPis) / 100;
			this.pisDebit = (this.valorVenda * this.aliquotaPis) / 100;
			this.valorPis = this.pisDebit - this.pisCredit;

			this.cofinsCredit = (this.custo * this.aliquotaCofins) / 100;
			this.cofinsDebit = (this.valorVenda * this.aliquotaCofins) / 100;
			this.valorCofins = this.cofinsDebit - this.cofinsCredit;

			this.valorIrpjCssl = this.valorVenda * (this.aliquotaIrpjCssl / 100);

			this.lucro =
				this.valorVenda -
				this.valorIrpjCssl -
				this.valorCofins -
				this.valorPis -
				this.valorIcm -
				this.custoFinal;

			this.lucroMercadoria = (this.lucro / this.custoFinal) * 100;
			this.lucroFaturamento = (this.lucro / this.valorVenda) * 100;
		},
		calculoValorVenda() {
			this.valorVenda = this.custoFinal / this.margem;
			this.valorVenda = parseFloat(this.valorVenda.toFixed(2));
		},
		calculoMargem() {
			this.margem = (this.custoFinal * 100) / this.valorVenda / 100;
			this.margem = this.margem.toFixed(3);
		},
		cleanInputs() {
			this.aliquotaIcm = 0;
			this.aliquotaIpi = 0;
			this.aliquotaPis = 0;
			this.aliquotaCofins = 0;
			this.aliquotaIrpjCssl = 0;
			this.margem = 0;
			this.valorVenda = 0;
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
						pagina: "margem_lucro"
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
.texto-cinza {
	color: #e9ecef;
	height: 1px;
}
.no-padding {
    padding: 0px !important;
}
</style>