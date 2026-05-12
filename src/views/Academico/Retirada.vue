<template>
  <v-container>
    <v-card>
      <v-container>
        <h6 v-if="optionSelected == 0">
          Pedidos <span class="primary--text">Por CPF</span>
        </h6>
        <h6 v-if="optionSelected == 1">
          Pedidos <span class="warning--text">Pendentes</span>
        </h6>
        <h6 v-if="optionSelected == 2">
          Pedidos <span class="success--text">Retirados</span>
        </h6>
      </v-container>
      <v-card-title class="mt-n10">
        <v-row dense no-gutters>
          <v-col cols="6">
            <v-btn-toggle
              v-model="optionSelected"
              mandatory
              class="ml-n0"
              dense
              dark
              tile
            >
              <v-btn
                @click="emptyPedidosAluno()"
                small
                active-class="primary"
                :value="0"
                >CPF</v-btn
              >
              <v-btn
                @click="allPendentes()"
                small
                active-class="warning"
                :value="1"
                >Pendentes</v-btn
              >
              <v-btn
                @click="allRetirados()"
                small
                active-class="success"
                :value="2"
                >Retirados</v-btn
              >
            </v-btn-toggle>

            <v-menu
              v-model="menuRelatorios"
              :close-on-content-click="false"
              :nudge-width="150"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="!mobile"
                  v-on="on"
                  small
                  tile
                  class="ma-1"
                  color="grey lighten-1"
                  >relatÃ³rio<v-icon class="ml-2" small dark
                    >fas fa-chart-line</v-icon
                  >
                </v-btn>
              </template>
              <v-card>
                <v-container class="ma-0 ml-2">
                  <v-row dense>
                    <v-col>
                      <v-btn
                        color="warning"
                        @click="excel('pendentes')"
                        small
                        tile
                        >pendentes</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-btn
                        color="success"
                        @click="excel('retirados')"
                        small
                        tile
                        >retirados</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="menuRelatorios = false"
                    >Voltar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="6" v-if="!optionSelected == 0 && !mobile">
            <v-text-field
              class="uppercase"
              append-icon="fa-search"
              v-model="search"
              v-on:keyup="find(search)"
              label="Busque por: Nome, CPF ou Pedido"
              single-line
              hide-details
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle> </v-card-subtitle>
      <div>
        <v-row v-if="optionSelected == 0" justify="center" class="mt-n4">
          <v-col cols="12" sm="5" md="7" lg="7">
            <v-text-field
              ref="id_pedido"
              class="h4 ml-2 mr-2 mt-4"
              label="CPF Aluno"
              v-mask="'###.###.###-##'"
              background-color="blue lighten-5"
              v-model="cpf_aluno"
              @click="$event.target.select()"
              @keypress.enter="getPedido()"
              autofocus
              full-width
              height="50pt"
              append-icon="fa-search"
              @click:append="getPedido()"
              append-outer-icon="fas fa-key"
              @click:append-outer="getAluno()"
              type="tel"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <div class="ma-2">
          <v-row v-if="optionSelected != 0 && mobile">
            <v-col cols="12" sm="5" md="7" lg="7">
              <v-text-field
                class="uppercase"
                append-icon="fa-search"
                v-model="search"
                v-on:keyup="find(search)"
                label="Busque por: Nome, CPF ou Pedido"
                single-line
                hide-details
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-list dense>
            <template v-for="(item, index) in pedidos">
              <v-list-item :key="item.title">
                <v-list-item-content>
                  <v-list-item-title v-text="item.nome"></v-list-item-title>

                  <v-list-item-subtitle
                    v-text="'CPF:' + ' ' + putMask(item.cpf_aluno)"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="'Data:' + ' ' + item.data_pedido"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="'Pedido:' + ' ' + item.id_pedidos"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    :class="
                      item.pagamento.status_pagamento == 'NÃƒO PAGO'
                        ? 'red--text'
                        : 'success--text'
                    "
                    v-text="'Status:' + ' ' + item.pagamento.status_pagamento"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="'Total:' + ' ' + 'R$ ' + item.valor_total"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.acao"
                  ></v-list-item-action-text>
                  <v-btn
                    text
                    class="ma-2"
                    color="primary"
                    icon
                    @click="showBotoes($event, item)"
                    ><v-icon dark>fa fa-bars</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider
                v-if="index < pedidos.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </div>
      </div>
    </v-card>
    <v-dialog persistent v-model="dialogVerPedido" max-width="auto">
      <v-card>
        <v-card-title>Itens do Pedido </v-card-title>
        <v-card-text class="mt-n2">
          <span>Pedido: {{ this.objectItem.id_pedidos }}</span
          ><br />
          <span class="">Aluno: {{ this.objectItem.nome }}</span
          ><br />
          <span class="">Total: R$ {{ this.objectItem.valor_total }}</span
          ><br />
          <br />
          <q-virtual-scroll
            class="my-sticky-dynamic ma-0"
            type="table"
            style="max-height: 45vh"
            :virtual-scroll-item-size="48"
            :virtual-scroll-sticky-size-start="48"
            :virtual-scroll-sticky-size-end="32"
            :items="objectItem.itempedidos"
            flat
            dense
          >
            <template v-slot:before>
              <thead class="text-left">
                <tr>
                  <th v-for="col in headerItempedidos" :key="'1--' + col.label">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot="{ item: row, index }">
              <tr :key="index" :class="corLinha(row, index)">
                <td
                  v-for="col in headerItempedidos"
                  :key="index + '-' + col.name"
                >
                  <div v-if="col.name == 'qtd_item' && row.qtd_item != 0">
                    <span>{{ row.qtd_item }} </span>
                  </div>
                  <div v-if="col.name == 'descri_item'">
                    <span>{{ row.descri_item }} </span>
                  </div>
                  <div v-if="col.name == 'marca_item' && row.marca_item != 0">
                    <span>{{ row.marca_item }} </span>
                  </div>
                </td>
              </tr>
            </template>
          </q-virtual-scroll>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogVerPedido = false"> Fechar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="print" persistent max-width="auto">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="4" sm="4" md="4" lg="4">
              <v-btn color="error" small @click="print = false">Voltar</v-btn>
            </v-col>
            <v-col cols="8" sm="8" md="8" lg="8">
              <v-btn
                v-if="mobile"
                @click="printInfo(objectItemPedido)"
                small
                color="success"
                >Confirmar pagamento</v-btn
              >
              <v-btn
                v-else
                @click="printInfo(objectItemPedido)"
                color="success"
                :right="true"
                :absolute="true"
                >Imprimir e confirmar <br />
                pagamento</v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text id="print">
          <v-container v-if="mobile">
            <span>Aluno: {{ objectItemPedido.nome }}</span
            ><br />
            <span>Pedido: {{ objectItemPedido.id_pedidos }}</span
            ><br />
            <span>Total: R$ {{ objectItemPedido.valor_total }}</span
            ><br />
            <span>Data: {{ objectItemPedido.data_pedido }}</span
            ><br />
            <br />
          </v-container>
          <v-container v-else>
            <div class="mx-auto" style="width: 800px; height: 50%">
              <p class="text-right h5 font-weight-bold">
                {{ dateNowImpress() }}
              </p>
              <br />
              <h1 class="text-center">PAGO</h1>
              <br />
              <h3>Via Aluno</h3>
              <br />
              <h3>
                <b>{{ objectItemPedido.id_pedidos }}</b>
              </h3>
              <h3>
                {{ objectItemPedido.nome }}
              </h3>
              <h3>{{ putMask(objectItemPedido.cpf_aluno) }}</h3>
              <h3>R$ {{ objectItemPedido.valor_total }}</h3>
              <br /><br />
              <v-row>
                <v-col cols="12" md="4" sm="4"><h4>Retirado Por:</h4></v-col>
                <v-col cols="12" md="8" sm="8">
                  <input
                    class="ml-n8"
                    style="
                      border-top: 1px #000 !important;
                      border-right: 1px #000 !important;
                      border-left: 1px #000 !important;
                      width: 100%;
                      margin: auto;
                      margin-bottom: 10%;
                    "
                /></v-col>
              </v-row>
            </div>
            <hr
              style="
                border: 1px dashed #000 !important;
                width: 100%;
                margin: auto;
                margin-bottom: 10%;
              "
            />
            <div class="mx-auto" style="width: 800px; height: 40%">
              <p class="text-right h5 font-weight-bold">
                {{ dateNowImpress() }}
              </p>
              <br />
              <h1 class="text-center">PAGO</h1>
              <br />
              <h3>Via Vendedor</h3>
              <br />
              <h3>
                <b>{{ objectItemPedido.id_pedidos }}</b>
              </h3>
              <h3>
                {{ objectItemPedido.nome }}
              </h3>
              <h3>{{ putMask(objectItemPedido.cpf_aluno) }}</h3>
              <h3>R$ {{ objectItemPedido.valor_total }}</h3>
              <br /><br />
              <v-row>
                <v-col cols="12" md="4" sm="4"><h4>Retirado Por:</h4></v-col>
                <v-col cols="12" md="8" sm="8">
                  <input
                    class="ml-n8"
                    style="
                      border-top: 1px #000 !important;
                      border-right: 1px #000 !important;
                      border-left: 1px #000 !important;
                      width: 100%;
                      margin: auto;
                      margin-bottom: 10%;
                    "
                /></v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialogCancelarPagamento" max-width="490">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <span class="font-weight-bold">Deseja cancelar este pagamento?</span>
          <br />
          <br />
          <span> {{ objectItemPedido.nome }} </span><br />
          <span> Pedido: {{ objectItemPedido.id_pedidos }} </span> <br />
          <span> Total: R$ {{ objectItemPedido.valor_total }} </span> <br />
          <span> Data: {{ objectItemPedido.data_pedido }} </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogCancelarPagamento = false">
            voltar
          </v-btn>
          <v-btn color="success" @click="cancelar(objectItemPedido)">
            continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAluno" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">ALUNO ENCONTRADO</span>
        </v-card-title>
        <v-card-text class="headline">
          <b>Aluno: </b> {{ aluno.nome }} {{ aluno.sobrenome }} <br />
          <b>Senha: </b> {{ aluno.senha }}
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" text @click="dialogAluno = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu
      v-model="menuAcao"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="true"
      :close-on-click="true"
    >
      <v-list dense>
        <v-list-item class="ma-2">
          <v-btn
            @click="verPedido(objectItemMenu)"
            class="ma-0"
            color="warning"
          >
            ver itens
            <v-icon class="ml-1" dark small>far fa-eye</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item class="ma-2">
          <v-btn
            v-if="optionSelected != 2"
            @click="imprimir(objectItemMenu)"
            class="ma-0"
            color="primary"
          >
            receber
            <v-icon class="ml-1" dark small>fas fa-dollar-sign</v-icon>
          </v-btn>
          <v-btn
            v-if="optionSelected == 2"
            @click="cancelarPagamento(objectItemMenu)"
            class="ma-0"
            color="error"
          >
            cancelar
            <v-icon class="ml-1" dark small>fas fa-dollar-sign</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-snackbar
      :color="typeSnackbar"
      :timeout="timeSnackbar"
      v-model="snackbar"
    >
      {{ msgSnackbar }}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    cpf_aluno: "",
    headerPagamentosRetirada: [
      {
        name: "data_pedido",
        align: "center",
        label: "Data do pedido",
        sortable: true,
      },
      {
        name: "nome",
        align: "center",
        label: "Aluno",
        sortable: true,
      },
      {
        name: "cpf_aluno",
        align: "center",
        label: "CPF",
        sortable: true,
      },
      {
        name: "id_pedidos",
        align: "center",
        label: "Pedido",
        sortable: true,
      },
      {
        name: "valor_total",
        align: "center",
        label: "Total",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "AÃ§Ã£o",
        sortable: true,
      },
    ],
    headerItempedidos: [
      {
        name: "qtd_item",
        align: "center",
        label: "Qtd",
        sortable: true,
      },
      {
        name: "descri_item",
        align: "center",
        label: "DescriÃ§Ã£o",
        sortable: true,
      },
      {
        name: "marca_item",
        align: "center",
        label: "Marca",
        sortable: true,
      },
    ],
    objectItem: false,
    objectItemPedido: false,
    print: false,
    dialogVerPedido: false,
    dialogCancelarPagamento: false,
    dialogAluno: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    loading: false,
    mobile: false,
    optionSelected: 0,
    menuRelatorios: false,
    teste_excel: false,
    search: "",
    objectItemMenu: false,
    menuAcao: false,
    x: 0,
    y: 0,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);

    if (screen.width <= 760) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  },

  computed: {
    ...mapState({
      pedidos: (state) => state.pedidoAcademico.pedidosAluno,
      aluno: (state) => state.aluno.aluno,
      pedidosRetirada: (state) => state.pedidoAcademico.pagamentosRetirada,
      pedidosPendentes: (state) => state.pedidoAcademico.pendentesRetirada,
      error: (state) => state.pedidoAcademico.error,
    }),
  },
  methods: {
    ...mapActions([
      "get_pedido_aluno",
      "get_aluno",
      "update_pagamento_retirada",
      "get_pagamentos_retirada",
      "get_pendentes_retirada",
    ]),
    ...mapMutations(["empty_pedidosAluno", "set_PedidosAluno"]),
    emptyPedidosAluno() {
      this.empty_pedidosAluno();
    },
    async getPedido() {
      this.cpf_aluno = this.cpf_aluno.replace(/[^\d]/g, "");
      if (this.cpf_aluno.length >= 11) {
        this.loading = true;
        await this.get_pedido_aluno(this.cpf_aluno);

        if (this.error) {
          this.loading = false;
          this.showSnackbar(
            "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
            "error",
            5000
          );
        }
        if (!this.pedidos.length) {
          this.loading = false;
          this.showSnackbar(
            "AtenÃ§Ã£o! NÃ£o existem pedidos para o CPF informado!",
            "warning",
            5000
          );
        } else {
          this.loading = false;
        }
      } else {
        this.showSnackbar(
          "AtenÃ§Ã£o! Insira um numero de CPF vÃ¡lido!",
          "warning",
          3000
        );
      }
    },
    async getAluno() {
      this.cpf_aluno = this.cpf_aluno.replace(/[^\d]/g, "");
      if (this.cpf_aluno.length >= 11) {
        this.loading = true;
        await this.get_aluno(this.cpf_aluno);
        this.loading = false;
        if (!this.error) {
          if (!this.aluno) {
            this.showSnackbar("Aluno NÃ£o Encontrado!", "warning", 5000);
          } else {
            this.loading = false;
            this.dialogAluno = true;
          }
        } else {
          this.showSnackbar(
            "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
            "error",
            5000
          );
        }
      } else {
        this.showSnackbar(
          "AtenÃ§Ã£o! Insira um numero de CPF vÃ¡lido!",
          "warning",
          3000
        );
      }
    },
    verPedido(item) {
      this.objectItem = Object.assign({}, item);
      this.dialogVerPedido = true;
    },
    imprimir(item) {
      this.objectItemPedido = Object.assign({}, item);
      this.print = true;
    },
    async printInfo(objectItemPedido) {
      await this.update_pagamento_retirada(objectItemPedido);
      if (this.error) {
        this.print = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        if (!this.mobile) {
          this.$htmlToPaper("print");
        }
        this.print = false;
        this.allPendentes();
      }
    },
    cancelarPagamento(item) {
      this.objectItemPedido = Object.assign({}, item);
      this.dialogCancelarPagamento = true;
    },
    async cancelar(objectItemPedido) {
      await this.update_pagamento_retirada(objectItemPedido);
      if (this.error) {
        this.print = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        this.allRetirados();
      }
    },
    async allPendentes() {
      this.loading = true;
      await this.get_pendentes_retirada();
      if (this.error) {
        this.loading = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
      if (!this.pedidos.length) {
        this.loading = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! NÃ£o existem pedidos retirados!",
          "warning",
          5000
        );
      } else {
        this.loading = false;
      }
    },
    async allRetirados() {
      this.loading = true;
      await this.get_pagamentos_retirada();

      if (this.error) {
        this.loading = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
      if (!this.pedidos.length) {
        this.loading = false;
        this.showSnackbar(
          "AtenÃ§Ã£o! NÃ£o existem pedidos retirados!",
          "warning",
          5000
        );
      } else {
        this.loading = false;
      }
    },
    async find() {
      if (this.search.length == 0) {
        if (this.optionSelected == 1) {
          this.allPendentes();
        }
        if (this.optionSelected == 2) {
          this.allRetirados();
        }
      }
      if (this.search && this.search.length >= 4) {
        let searchPedidoCpf = [];
        let searchPedidoNome = [];
        let searchPedidoId = [];

        searchPedidoCpf = this.pedidos.filter((i) =>
          i.cpf_aluno.includes(this.search.toUpperCase())
        );
        if (searchPedidoCpf.length) {
          this.set_PedidosAluno(searchPedidoCpf);
        }

        searchPedidoNome = this.pedidos.filter((i) =>
          i.nome.includes(this.search.toUpperCase())
        );
        if (searchPedidoNome.length) {
          this.set_PedidosAluno(searchPedidoNome);
        }

        searchPedidoId = this.pedidos.filter((i) =>
          i.id_pedidos.toString().includes(this.search.toUpperCase())
        );
        if (searchPedidoId.length) {
          this.set_PedidosAluno(searchPedidoId);
        }
      }
    },
    async excel(tipo) {
      this.teste_excel = true;
      this.loading = true;
      let json = [];

      if (tipo == "pendentes") {
        await this.get_pendentes_retirada(this.teste_excel);

        this.pedidosPendentes.forEach((element) => {
          let obj = {};

          obj.nome = element.nome;
          obj.cpf = element.cpf_aluno;
          obj.data = element.data_pedido;
          obj.pedido = element.id_pedidos;
          obj.total = element.valor_total;
          obj.status = "PENDENTE";

          json.push(obj);
        });
      }
      if (tipo == "retirados") {
        await this.get_pagamentos_retirada(this.teste_excel);

        this.pedidosRetirada.forEach((element) => {
          let obj = {};

          obj.nome = element.nome;
          obj.cpf = element.cpf_aluno;
          obj.data = element.data_pedido;
          obj.pedido = element.id_pedidos;
          obj.total = element.valor_total;
          obj.status = "RETIRADOS";

          json.push(obj);
        });
      }
      if (json.length) {
        var ws = this.$XLSX.utils.json_to_sheet(json);
        var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel
        this.$XLSX.utils.book_append_sheet(wb, ws, "retirada_" + tipo); // sheetAName is name of Worksheet
        this.$XLSX.writeFile(wb, "pedidos_" + tipo + ".xlsx"); // name of the file is 'book.xlsx'
      } else {
        this.showSnackbar(
          "AtenÃ§Ã£o! NÃ£o existem pedidos retirados!",
          "warning",
          5000
        );
      }
      this.loading = false;
      this.menuRelatorios = false;
    },

    putMask(item, type) {
      return this.$mask.apply(item, "000.000.000-00");
    },
    corLinha(row, index) {
      if (row.qtd_item == 0 && row.marca_item == 0 && row.valor_item == 0) {
        return "primary text-center white--text";
      }
    },
    dateNowImpress() {
      var today = new Date().toLocaleString();
      return today;
    },
    showBotoes(e, item) {
      e.preventDefault();
      this.menuAcao = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItemMenu = { ...item };
      this.$nextTick(() => {
        this.menuAcao = true;
      });
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
  },
};
</script>
<style scoped>
.signature {
  border: 0;
  border-bottom: 1px solid #000;
}
</style>

      