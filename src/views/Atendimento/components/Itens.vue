<template>
  <v-container>
    <v-tabs dense grow>
      <v-tab>Itens</v-tab>
      <v-tab>Historico</v-tab>
      <v-tab-item>
        <v-row class="custom-row ml-2 mr-2">
          <v-col cols="2">
            <v-text-field
              v-model="codigo"
              placeholder="Código"
              v-on:keyup="findProdutoByCod()"
              label="Código"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="10">
            <v-text-field
              autofocus
              v-on:keyup="findProduto()"
              v-model="descricao"
              label="Descrição"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          height="250"
          class="elevation-1"
          hide-default-footer
          dense
          :headers="headers"
          :items="produtos"
          fixed-header
          :items-per-page="-1"
        >
          <template v-slot:item="{ item }">
            <tr :class="item.status_color" @click="selectItem(item)">
              <td>
                <v-btn @click="showEstoque(item)" text x-small icon color="primary">
                  <v-icon>fa-search</v-icon>
                </v-btn>
              </td>
              <td>{{item.codigo}}</td>
              <td>{{item.descricao}}</td>
              <td>{{item.marca}}</td>
              <td>
                <span :class="item.saldo != 0 ? '':'error--text'">{{item.saldo}}</span>
              </td>
              <td>{{item.valor.toFixed(2).replace('.', ',')}}</td>
              <td>G1GA999</td>
              <td>S01-SUP</td>
              <td>3456789123770</td>
              <td>{{item.classificacao_fiscal}}</td>
              <td>{{item.codigo_fornecedor}}</td>
            </tr>
          </template>
        </v-data-table>
        <v-row justify="center">
          <v-col cols="6">
            <v-row align="center" justify="center">
              <v-img
                src="https://picsum.photos/id/11/500/300"
                lazy-src="https://picsum.photos/id/11/10/6"
                class="grey lighten-2"
                max-width="450"
                max-height="450"
              ></v-img>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-textarea
              solo
              readonly
              no-resize
              rows="13"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis odio quis libero efficitur facilisis. Ut scelerisque lacinia erat, et facilisis enim ullamcorper vel. Proin vel accumsan dolor, in varius neque. Sed sit amet auctor justo, quis dignissim nisl. Vestibulum imperdiet consequat vestibulum. Ut pharetra consequat mi et egestas. Ut viverra eros eu ex eleifend mollis. Quisque lectus velit, consequat quis fringilla fringilla, sodales ac diam. "
            ></v-textarea>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogEstoque">
          <v-card>
            <v-card-title>{{objectItem.descricao}}</v-card-title>
            <v-card-text>
              <div class="subtitle-1 font-weight-bold">
                <h5>Marca: {{objectItem.marca}}</h5>
                <h5>Estoque: A040502</h5>
                <h5>Armazem: S03-01-07</h5>
                <h5
                  :class="objectItem.saldo == 0 ? 'error--text' : 'success--text'"
                >Disponível: {{objectItem.saldo}}</h5>
              </div>
              <v-row>
                <v-col cols="3">
                  <v-card>
                    <div class="text-center">
                      <span class="subtitle-1">
                        <b>Saídas</b>
                      </span>
                    </div>
                    <v-data-table
                      height="300"
                      class="elevation-1"
                      hide-default-footer
                      dense
                      :headers="headersSaidasEntradas"
                      :items="saidas"
                      fixed-header
                      :items-per-page="-1"
                    >
                      <template v-slot:item="{ item }">
                        <tr>
                          <td>{{item.pedido}}</td>
                          <td>{{item.entrega}}</td>
                          <td>{{item.qtd}}</td>
                          <td>{{item.status}}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
                <v-col cols="3">
                  <v-card>
                    <div class="text-center">
                      <span class="subtitle-1">
                        <b>Entradas</b>
                      </span>
                    </div>
                    <v-data-table
                      height="300"
                      class="elevation-1"
                      hide-default-footer
                      dense
                      :headers="headersSaidasEntradas"
                      :items="entradas"
                      fixed-header
                      :items-per-page="-1"
                    >
                      <template v-slot:item="{ item }">
                        <tr>
                          <td>{{item.pedido}}</td>
                          <td>{{item.entrega}}</td>
                          <td>{{item.qtd}}</td>
                          <td>{{item.status}}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-row align="center" justify="center">
                    <v-img
                      src="https://picsum.photos/id/11/500/300"
                      lazy-src="https://picsum.photos/id/11/10/6"
                      class="grey lighten-2"
                      max-width="450"
                      max-height="450"
                    ></v-img>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" text @click="dialogEstoque = false">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <v-col cols="12">
            <h3>descrição do item selecionado</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-card>
              <div class="text-center">
                <span class="subtitle-1">
                  <b>Resumo por Meses</b>
                </span>
              </div>
              <v-data-table
                height="300"
                class="elevation-1"
                hide-default-footer
                dense
                :headers="headersResumoMeses"
                :items="resumos"
                fixed-header
                :items-per-page="-1"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{item.ano}}</td>
                    <td>{{item.mes}}</td>
                    <td>{{item.qtd}}</td>
                    <td>{{item.total}}</td>
                  </tr>
                </template>
                <template v-slot:footer>
                  <v-row class="text-center" justify="center">
                    <v-col cols="6">Total Meses: 2</v-col>
                    <v-col cols="6">Total: R$ 600,00</v-col>
                  </v-row>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <div class="text-center">
                <span class="subtitle-1">
                  <b>Resumo por Clientes</b>
                </span>
              </div>
              <v-data-table
                height="300"
                class="elevation-1"
                hide-default-footer
                dense
                :headers="headersResumoClientes"
                :items="clientes"
                fixed-header
                :items-per-page="-1"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{item.cliente}}</td>
                    <td>{{item.grupo}}</td>
                    <td>{{item.qtd}}</td>
                    <td>{{item.total}}</td>
                  </tr>
                </template>
                <template v-slot:footer>
                  <v-row class="text-center" justify="center">
                    <v-col cols="6">Total Clientes: 2</v-col>
                    <v-col cols="6">Total: R$ 600,00</v-col>
                  </v-row>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card>
              <div class="text-center">
                <span class="subtitle-1">
                  <b>Resumo por Vendedores</b>
                </span>
              </div>
              <v-data-table
                height="300"
                class="elevation-1"
                hide-default-footer
                dense
                :headers="headersResumoVendedores"
                :items="vendedores"
                fixed-header
                :items-per-page="-1"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{item.vendedor}}</td>
                    <td>{{item.qtd}}</td>
                    <td>{{item.total}}</td>
                  </tr>
                </template>
                <template v-slot:footer>
                  <v-row class="text-center" justify="center">
                    <v-col cols="6">Total Vendedores: 2</v-col>
                    <v-col cols="6">Total: R$ 600,00</v-col>
                  </v-row>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>

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
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    codigo: '',
    descricao: '',
    produtos: [],
    headers: [
      { text: "#", value: "codigo", sortable: false },
      { text: "Código", value: "codigo", sortable: true },
      { text: "Descrição", value: "descricao", sortable: true },
      { text: "Marca", value: "marca", sortable: true },
      { text: "Saldo", value: "saldo", sortable: true },
      { text: "Valor", value: "valor", sortable: true },
      { text: "Estoque", value: "estoque", sortable: true },
      { text: "Armazem", value: "armazem", sortable: true },
      { text: "Barras", value: "cod_barra", sortable: true },
      { text: "Fiscal", value: "classificacao_fiscal", sortable: true },
      { text: "Cod Forn", value: "codigo_fornecedor", sortable: true }
    ],
    headersSaidasEntradas: [
      { text: "Pedido", value: "pedido", sortable: true },
      { text: "Entrega", value: "entrega", sortable: true },
      { text: "Qtd", value: "qtd", sortable: true },
      { text: "Status", value: "status", sortable: true }
    ],
    saidas: [
      { pedido: "223301A", entrega: "23/10/2019", qtd: -1, status: "saldo" },
      { pedido: "224477A", entrega: "02/12/2019", qtd: -5, status: "separado" }
    ],
    entradas: [
      { pedido: "875A", entrega: "23/10/2019", qtd: 2, status: "pendente" },
      { pedido: "987A", entrega: "02/12/2019", qtd: 3, status: "pendente" }
    ],
    clientes: [
      {
        cliente: "EDGAR CARDOTE",
        grupo: "3D-UNINOVE",
        qtd: "2",
        total: "200,00"
      },
      { cliente: "JOÃƒO SILVA", grupo: "VAREJO", qtd: "3", total: "300,00" }
    ],
    vendedores: [
      { vendedor: "GISLANE", qtd: "3", total: "300,00" },
      { vendedor: "WILSON", qtd: "2", total: "200,00" }
    ],
    resumos: [
      {
        ano: "2019",
        mes: "05",
        qtd: "5",
        total: "500,00"
      },
      {
        ano: "2019",
        mes: "08",
        qtd: "2",
        total: "100,00",
        clientes: [
          {
            cliente: "MARIA SILVA",
            grupo: "TURMA 99",
            qtd: "1",
            total: "50,00"
          },
          { cliente: "JOSE SILVA", grupo: "VAREJO", qtd: "1", total: "50,00" }
        ],
        vendedores: [
          { vendedor: "EDUARDO", qtd: "1", total: "50,00" },
          { vendedor: "CINTIA", qtd: "1", total: "50,00" }
        ]
      }
    ],
    headersResumoMeses: [
      { text: "Ano", value: "ano", sortable: true },
      { text: "Mês", value: "mes", sortable: true },
      { text: "Qtd", value: "qtd", sortable: true },
      { text: "Total", value: "total", sortable: true }
    ],
    headersResumoClientes: [
      { text: "Cliente", value: "cliente", sortable: true },
      { text: "Grupo", value: "grupo", sortable: true },
      { text: "Qtd", value: "qtd", sortable: true },
      { text: "Total", value: "total", sortable: true }
    ],
    headersResumoVendedores: [
      { text: "Vendedor", value: "vendedor", sortable: true },
      { text: "Qtd", value: "qtd", sortable: true },
      { text: "Total", value: "total", sortable: true }
    ],
    dialogEstoque: false,
    objectIndex: -1,
    objectItem: {}
  }),
  created() {
    //this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    selectItem(item) {
      this.clearSelect();
      if (item.selected == false) {
        item.selected = true;
        this.produto = item;
        this.codigo = item.codigo;
        this.descricao = item.descricao;
        item.status_color = "blue lighten-4";
      } else {
        item.selected = false;
        item.status_color = "white";
      }
    },
    clearSelect() {
      this.produtos.forEach(produto => {
        produto.selected = false;
        produto.status_color = "white";
      });
    },
    showEstoque(item) {
      this.objectIndex = this.produtos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogEstoque = true;
    },
    findProdutoByCod() {
      if (this.codigo && this.itemCodigo.length >= 4) {
        this.itemDescricao = "";
        setTimeout(
          () =>
            this.$axios
              .get("/produto/findByCod", {
                params: {
                  codigo: this.itemCodigo
                }
              })
              .then(res => {
                if (res.data !== false) {
                  this.produtos = res.data;
                }
              })
              .catch(err => {
                console.log(err);
              }),
          800
        );
      }
    },
    findProduto() {
      if (
        this.descricao &&
        this.descricao.length >= 4
      ) {
        this.itemCodigo = "";
        setTimeout(
          () =>
            this.$axios
              .get("/produto/find", {
                params: {
                  descricao: this.descricao
                }
              })
              .then(res => {
                if (res.data !== false) {
                  this.produtos = res.data;
                }
              })
              .catch(err => {
                console.log(err);
              }),
          800
        );
      }
    }
  }
};
</script>