<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row justify="center" class="custom-row">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data_de"
              :rules="[v => !!v || 'Campo ObrigatÃ³rio']"
              label="De"
              required
              v-mask="'##/##/####'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="data_ate"
              :rules="[v => !!v || 'Campo ObrigatÃ³rio']"
              label="AtÃ©"
              required
              v-mask="'##/##/####'"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <v-btn @click="teste()" >Busca</v-btn> -->
        <v-row justify="center" class="custom-row">
          <v-col cols="12" md="6">
            <v-select
              @change="onChangeSelect()"
              v-model="selectedFaculdade"
              :items="faculdades"
              item-text="nome_exibicao_faculdade"
              item-value="id_faculdade"
              label="Faculdade"
            ></v-select>
          </v-col>
        </v-row>
        <v-row justify="center" class="custom-row">
          <v-col cols="12" md="6">
            <v-select
              @change="onChangeSemestreSelect()"
              v-model="selectedSemestre"
              :items="semestres"
              item-text="descri_semestre"
              item-value="id_semestre"
              label="Semestre"
            ></v-select>
          </v-col>
        </v-row>
        <v-card>
          <v-card-title>Listas</v-card-title>
          <v-data-table
            locale="pt-PT"
            :loading="loading"
            loading-text="Carregando... Espere por favor"
            :headers="headersListas"
            :items="listas"
            :items-per-page="10"
            hide-default-footer
            :no-data-text="'Nenhuma lista encontrada'"
            class="elevation-1"
          >
            <template
              v-slot:item.valor_total_lista="{ item }"
            >R$ {{(item.valor_total_lista).toFixed(2).replace('.', ',')}}</template>
            <template v-slot:item.acao="{ item }">
              <v-btn class="ma-2" color="primary" @click="getItens(item)">
                Ver Itens
                <v-icon dark right>fa-chart-line</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-card class="mt-6">
          <v-card-title>
            Itens Vendidos -
            <v-btn color="primary" class="ml-3" @click="toExcel()">Excel</v-btn>
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
              append-icon="fa-search"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            locale="pt-PT"
            :loading="loading"
            loading-text="Carregando... Espere por favor"
            :headers="headersItensVendidos"
            :items="itensVendido"
            :search="search"
            :items-per-page="100"
            hide-default-footer
            :no-data-text="'Nenhum item encontrado'"
            class="elevation-1"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in searchItensVendidos" :key="item.vendido.codigo">
                  <td>
                    {{ item.vendido.codigo }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.codigo }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.vendido.qtd }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.qtd }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.vendido.descricao }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.descricao }}</span>
                    </div>
                  </td>
                  <td>
                    PrevisÃ£o:
                    <b>{{ item.vendido.previsao * item.vendido.qtd}}</b>
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span
                        class="blue--text text--lighten-1"
                      >PrevisÃ£o: {{ item.vendidoOp.previsao }}</span>
                    </div>
                  </td>
                  <td>
                    Vendidas:
                    <b>{{ item.vendido.vendidas }}</b>
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">Vendidas: {{ item.vendido.vendidas }}</span>
                    </div>
                  </td>
                  <td>
                    Total Site:
                    <b>{{ item.vendido.total_site }}</b>
                    <br />
                    <b>({{(item.vendido.total_site / vendidas * 100).toFixed()}}%)</b>
                    <br />Media:
                    <b>{{(item.vendido.total_site/vendidas).toFixed(2)}}</b>
                    <div class="blue--text text--lighten-1" v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span>Total Site: {{ item.vendidoOp.total_site }}</span>
                      <br />
                      <b>({{(item.vendidoOp.total_site / vendidas * 100).toFixed()}}%)</b>
                      <br />Media:
                      <b>{{(item.vendidoOp.total_site/vendidas).toFixed(2)}}</b>
                    </div>
                  </td>
                  <td>
                    Total Sistema:
                    <b>{{ item.vendido.total_sistema }}</b>
                    <br />
                    <b>({{(item.vendido.total_sistema / vendidas * 100).toFixed()}}%)</b>
                    <br />Media:
                    <b>{{(item.vendido.total_sistema/vendidas).toFixed(2)}}</b>
                    <div class="blue--text text--lighten-1" v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span>Total Sistema: {{ item.vendidoOp.total_sistema }}</span>
                      <br />
                      <b>({{(item.vendidoOp.total_sistema / vendidas * 100).toFixed()}}%)</b>
                      <br />Media:
                      <b>{{(item.vendidoOp.total_sistema/vendidas).toFixed(2)}}</b>
                    </div>
                  </td>
                </tr>
                <span style="display:none">{{sortedArray}}</span>
                <!-- <tr v-if="sortedArray.length > 0">
									<td colspan="7" class="text-center">
										<h2>NÃƒO VENDIDOS</h2>
									</td>
								</tr>
								
								<tr v-for="item of sortedArray" :key="item.cod_marca">
									<td>{{item.naovendido.codigo}}</td>
									<td>{{item.naovendido.qtd}}</td>
									<td>{{item.naovendido.descricao}}</td>
									<td>PrevisÃ£o: {{item.naovendido.previsao}}</td>
									<td>Vendidas: {{vendidas}}</td>
									<td>
										<b>Total Site: </b>{{item.naovendido.total_site}}
									</td>
									<td>
										<b>Total Sistema: </b>{{item.naovendido.total_sistema}}
									</td>
                </tr>-->
              </tbody>
            </template>
          </v-data-table>
        </v-card>
        <v-card class="mt-6">
          <v-card-title>
            Itens Opcionais Vendidos
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="searchOpcionais"
              append-icon="fa-search"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            locale="pt-PT"
            :loading="loading"
            loading-text="Carregando... Espere por favor"
            :headers="headersItensVendidos"
            :items="itensVendidoOpcionais"
            :search="searchOpcionais"
            :items-per-page="100"
            hide-default-footer
            :no-data-text="'Nenhum item encontrado'"
            class="elevation-1"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in searchItensVendidosOpcionais" :key="item.vendido.codigo">
                  <td>
                    {{ item.vendido.codigo }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.codigo }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.vendido.qtd }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.qtd }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.vendido.descricao }}
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">{{ item.vendidoOp.descricao }}</span>
                    </div>
                  </td>
                  <td>
                    PrevisÃ£o:
                    <b>{{ item.vendido.previsao }}</b>
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span
                        class="blue--text text--lighten-1"
                      >PrevisÃ£o: {{ item.vendidoOp.previsao }}</span>
                    </div>
                  </td>
                  <td>
                    Vendidas:
                    <b>{{vendidas }}</b>
                    <div v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span class="blue--text text--lighten-1">Vendidas: {{ vendidas }}</span>
                    </div>
                  </td>
                  <td>
                    Total Site:
                    <b>{{ item.vendido.total_site }}</b>
                    <br />
                    <b>({{(item.vendido.total_site / vendidas * 100).toFixed()}}%)</b>
                    <br />Media:
                    <b>{{(item.vendido.total_site/vendidas).toFixed(2)}}</b>
                    <div class="blue--text text--lighten-1" v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span>Total Site: {{ item.vendidoOp.total_site }}</span>
                      <br />
                      <b>({{(item.vendidoOp.total_site / vendidas * 100).toFixed()}}%)</b>
                      <br />Media:
                      <b>{{(item.vendidoOp.total_site/vendidas).toFixed(2)}}</b>
                    </div>
                  </td>
                  <td>
                    Total Sistema:
                    <b>{{ item.vendido.total_sistema }}</b>
                    <br />
                    <b>({{(item.vendido.total_sistema / vendidas * 100).toFixed()}}%)</b>
                    <br />Media:
                    <b>{{(item.vendido.total_sistema/vendidas).toFixed(2)}}</b>
                    <div class="blue--text text--lighten-1" v-if="item.hasOwnProperty('vendidoOp')">
                      <v-divider class="mt-1 mb-1"></v-divider>
                      <span>Total Sistema: {{ item.vendidoOp.total_sistema }}</span>
                      <br />
                      <b>({{(item.vendidoOp.total_sistema / vendidas * 100).toFixed()}}%)</b>
                      <br />Media:
                      <b>{{(item.vendidoOp.total_sistema/vendidas).toFixed(2)}}</b>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-form>
    <v-overlay :value="loading">
      <v-container style="width: 600px;">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="title text-center" cols="12">{{msg}}</v-col>
          <v-col cols="12">
            <v-progress-linear
              striped
              height="25"
              color="light-blue"
              v-model="value"
              :active="loading"
              :indeterminate="query"
              :query="true"
            >
              <template v-slot="{ value }">
                <strong v-if="value <= 100">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">{{msgSnackbar}}</v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    search: "",
    searchOpcionais: "",
    loading: false,
    valid: false,
    selectedFaculdade: "0",
    selectedSemestre: "",
    faculdades: [],
    semestres: [],
    listas: [],
    headersListas: [
      {
        text: "Id",
        sortable: true,
        value: "id_lista"
      },
      {
        text: "Nome",
        sortable: true,
        value: "nome_exibi_lista"
      },
      {
        text: "PrevisÃ£o",
        sortable: true,
        value: "previsao"
      },
      {
        text: "Vendidas",
        sortable: true,
        value: "vendidas"
      },
      {
        text: "Valor",
        sortable: true,
        value: "valor_total_lista"
      },
      {
        text: "AÃ§Ã£o",
        align: "center",
        sortable: false,
        value: "acao"
      }
    ],
    headersItensVendidos: [
      {
        text: "CÃ³digo",
        sortable: true,
        value: "vendido.codigo"
      },
      {
        text: "Qtd",
        sortable: true,
        value: "vendido.qtd"
      },
      {
        text: "DescriÃ§Ã£o",
        sortable: true,
        value: "vendido.descricao"
      },
      {
        text: "PrevisÃ£o",
        sortable: true,
        value: "vendido.previsao"
      },
      {
        text: "Vendidas",
        sortable: true,
        value: "vendido.vendidas"
      },
      {
        text: "Totais Site",
        sortable: true,
        value: "vendido.total_site"
      },
      {
        text: "Totais Sistema",
        sortable: true,
        value: "vendido.total_sistema"
      }
    ],
    objectIndex: -1,
    objectItem: {},
    itens: [],
    itensVendido: [],
    itensVendidoOpcionais: [],
    itensOpcionais: [],
    vendidas: 0,
    query: true,
    value: 0,
    interval: 0,
    msg: "Carregando.."
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
    this.getDatas();
  },
  computed: {
    ...mapState({
      data_inicial: state => state.config.data_inicial,
      data_final: state => state.config.data_final
    }),
    data_de: {
      get() {
        return this.data_inicial;
      },
      set(value) {
        this.$store.commit("setDataInicial", value);
      }
    },
    data_ate: {
      get() {
        return this.data_final;
      },
      set(value) {
        this.$store.commit("setDataFinal", value);
      }
    },
    searchItensVendidos: function() {
      this.search = this.search.toLowerCase();

      if (this.search.length < 3) return this.itensVendido;
      return this.search
        ? this.itensVendido.filter(
            item =>
              item.vendido.codigo.toString().includes(this.search) ||
              item.vendido.descricao.toLowerCase().includes(this.search)
          )
        : this.itensVendido;
    },
    searchItensVendidosOpcionais: function() {
      this.searchOpcionais = this.searchOpcionais.toLowerCase();

      if (this.searchOpcionais.length < 3) return this.itensVendidoOpcionais;
      return this.searchOpcionais
        ? this.itensVendidoOpcionais.filter(
            item =>
              item.vendido.codigo.toString().includes(this.searchOpcionais) ||
              item.vendido.descricao
                .toLowerCase()
                .includes(this.searchOpcionais)
          )
        : this.itensVendidoOpcionais;
    },
    sortedArray: function() {
      this.itens.forEach(item => {
        if (item.opcional_item == 1) {
          this.itensOpcionais.push(item);
        }
        if (item.hasOwnProperty("vendido")) {
          if (item.opcional_item == 0) {
            item.vendido.vendidas = this.vendidas;
            this.itensVendido.push(item);
          } else {
            this.itensVendidoOpcionais.push(item);
          }
        } else {
          console.log(item);
        }
      });

      this.itensVendido = this.itensVendido.sort(
        (a, b) =>
          (b.vendido.total_site / this.vendidas) * 100 -
          parseFloat((a.vendido.total_site / this.vendidas) * 100)
      );
      this.itensVendidoOpcionais = this.itensVendidoOpcionais.sort(
        (a, b) =>
          (a.vendido.total_site / this.vendidas) * 100 -
          parseFloat((b.vendido.total_site / this.vendidas) * 100)
      );

      console.log(this.itensVendido.length);
      return this.itens.filter(item => {
        return !item.hasOwnProperty("vendido") && item.opcional_item == 0;
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions(["getDatas"]),
    // teste() {
    // 	this.$axios
    // 		.post("/relatorio/itens/pedidosxfaturados/get", {
    // 			todas: true,
    // 			faculdade: 0,
    // 			semestre: 0,
    // 			id_lista: 0,
    // 			id_lista_original: 0,
    // 			de: this.data_de,
    // 			ate: this.data_ate
    // 		})
    // 		.then(res => {
    // 			console.log(res.data);
    // 			if (res.data != false) {
    // 				this.itens = res.data;
    // 				this.vendidas = this.objectItem.vendidas;
    // 				this.nomeLista = this.objectItem.nome_exibi_lista.toUpperCase();
    // 				this.closeLoading();
    // 			} else {
    // 				this.showSnakerbar(
    // 					"Erro no Servidor, Contate o Administrador",
    // 					"error",
    // 					4000
    // 				);
    // 				this.closeLoading();
    // 			}
    // 		})
    // 		.catch(err => {
    // 			this.closeLoading();
    // 			console.log(err);
    // 		});
    // },
    toExcel() {
      let itens = [];

      for (let item of this.itensVendido) {
        let objItem = {
          codigo: "",
          descricao: "",
          qtd: "",
          previsao: "",
          listas_vendidas: "",
          total_vendido_site: "",
          total_vendido_sistema: ""
        };
        objItem.codigo = item.vendido.codigo;
        objItem.descricao = item.vendido.descricao;
        objItem.qtd = item.vendido.qtd;
        objItem.previsao = item.previsao * item.vendido.qtd;
        objItem.listas_vendidas = this.vendidas;
        objItem.total_vendido_site = item.vendido.total_site;
        objItem.total_vendido_sistema = item.vendido.total_sistema;

        itens.push(objItem);
      }

      var ws = this.$XLSX.utils.json_to_sheet(itens);

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio.xlsx"); // name of the file is 'book.xlsx'
    },
    async closeLoading() {
      this.value = 100;
      await new Promise(res => setTimeout(res, 500));
      clearInterval(this.interval);
      this.loading = false;
      this.msg = "Carregando..";
    },
    startLoading() {
      this.loading = true;
      this.value = 0;
      this.query = false;

      this.interval = setInterval(() => {
        if (this.value > 100) {
          this.msg = "Ajustando o relatÃ³rio";
          this.query = true;
        }
        this.value += 3;
      }, 1000);
    },

    getItens(item) {
      this.startLoading();
      this.objectIndex = this.listas.indexOf(item);
      this.objectItem = Object.assign({}, item);

      this.itens = [];
      this.itensVendido = [];
      this.itensVendidoOpcionais = [];
      this.itensOpcionais = [];

      let todas = false;
      if (!this.selectedFaculdade) {
        todas = true;
      }

      this.$axios
        .post("/relatorio/itens/pedidosxfaturados/get", {
          todas: todas,
          faculdade: this.selectedFaculdade,
          semestre: this.selectedSemestre,
          id_lista: this.objectItem.id_lista,
          id_lista_original: this.objectItem.id_lista_original,
          de: this.data_de,
          ate: this.data_ate
        })
        .then(res => {
          console.log(res.data);
          if (res.data != false) {
            this.itens = res.data;
            this.vendidas = this.objectItem.vendidas;
            this.nomeLista = this.objectItem.nome_exibi_lista.toUpperCase();
            this.closeLoading();
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error",
              4000
            );
            this.closeLoading();
          }
        })
        .catch(err => {
          this.closeLoading();
          console.log(err);
        });
    },
    onChangeSelect() {
      console.log(this.selectedFaculdade);
      this.selectedSemestre = "0";
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade
          }
        })
        .then(res => {
          this.semestres = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeSemestreSelect() {
      this.listas = [];
      this.itens = [];
      this.$axios
        .get("/relatorio/itens/pedidosxfaturados/getListas", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre,
            de: this.data_de,
            ate: this.data_ate
          }
        })
        .then(res => {
          console.log(res.data);
          this.listas = res.data;
          if (res.data.length == 0) {
            this.showSnakerbar(
              "Nenhuma Lista Vendida No Periodo Selecionado!",
              "warning",
              4000
            );
            this.selectedFaculdade = "0";
            this.selectedSemestre = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFacudades() {
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id
          }
        })
        .then(res => {
          this.faculdades = res.data;
        })
        .catch(err => {
          console.log(err);
        });
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