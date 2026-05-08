<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span v-if="emitido == 1">
          Resgates
          <span class="primary--text">Emitidos</span> Fidelidade -
        </span>
        <span v-else>
          Resgates
          <span class="warning--text">Pendentes</span> Fidelidade -
        </span>
        <v-btn small class="ml-3" @click="getResgates()">Atualizar</v-btn>
        <v-btn
          v-if="emitido == 1"
          small
          class="ml-3 warning"
          @click="changeTableResgates()"
          >Ir p/ Pendentes</v-btn
        >
        <v-btn v-else small class="ml-3 primary" @click="changeTableResgates()"
          >Ir p/ Emitidos</v-btn
        >
        <v-btn class="success ml-2" @click="excel()" small>Gerar Excel</v-btn>
        <div class="flex-grow-1"></div>
        <v-text-field
          class="uppercase"
          v-model="search"
          v-on:keyup="find(search)"
          append-icon="fa-search"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-subtitle>
        <v-menu
          v-model="menuFiltros"
          :close-on-content-click="false"
          :nudge-width="400"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn color="indigo" dark v-on="on">Filtros</v-btn>
          </template>
          <v-card>
            <v-container>
              <v-row dense>
                <v-col>
                  <!-- <v-select
                    @change="changeFilter"
                    v-model="selectedGrupo"
                    dense
                    multiple
                    hide-details
                    :items="grupos"
                    label="Grupos"
                  ></v-select>-->
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <!-- <v-select
                    @change="changeFilter"
                    multiple
                    v-model="selectedStatusPagamento"
                    dense
                    hide-details
                    :items="statusPagamento"
                    label="Status"
                  ></v-select>-->
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="warning" @click="clearFilter(true)"
                >Limpar Filtros</v-btn
              >
              <v-btn text @click="menuFiltros = false">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <span class="primary--text body-1 ml-3">Filtro Ativo:</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoGrupo" class="red--text body-1">{{
          filtroAtivoGrupo
        }}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoStatus" class="red--text body-1">{{
          filtroAtivoStatus
        }}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoSistema" class="red--text body-1">{{
          filtroAtivoSistema
        }}</span>
      </v-card-subtitle>

      <q-virtual-scroll
        class="my-sticky-dynamic"
        type="table"
        dense
        style="max-height: 70vh"
        virtual-scroll
        :virtual-scroll-slice-size="50"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="filteredResgates"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headersResgates" :key="'1--' + col.name">
                {{ col.label }}
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item: row, index }">
          <tr :key="index">
            <td v-for="col in headersResgates" :key="index + '-' + col.name">
              <div v-if="col.name == 'aluno'">
                {{ row.aluno.nome }} {{ row.aluno.sobrenome }}
                <br />
                {{ putMask(row.aluno.cpf) }}
                <br />
                Vendedor: <b>{{ row.aluno.vendedor_site.nome }}</b>
              </div>
              <div v-if="col.name == 'pedido_dcinfo'">
                {{ row.pedido_dcinfo }}
              </div>
              <div v-if="col.name == 'tipo_resgate'">
                <span
                  v-if="row.tipo_resgate == 'voucher'"
                  class="primary--text"
                >
                  <b>VOUCHER</b>
                </span>
                <span
                  v-else-if="row.tipo_resgate == 'vale'"
                  class="success--text"
                >
                  <b>VALE COMPRAS</b>
                </span>
                <span
                  v-else-if="row.tipo_resgate == 'produto'"
                  class="warning--text"
                >
                  <b>PRODUTO</b>
                </span>
              </div>

              <div v-if="col.name == 'status'">
                <v-chip
                  v-if="row.status == 'PENDENTE'"
                  color="warning"
                  dark
                  small
                  >{{ row.status }}</v-chip
                >
                <v-chip
                  v-else-if="row.status == 'EMITIDO'"
                  color="primary"
                  dark
                  small
                  >{{ row.status }}</v-chip
                >
              </div>
              <div v-if="col.name == 'nome_produto'">
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Produtos Resgatados
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <span v-for="item in row.itens" :key="item.id_resgate">
                        id: <b>{{ item.id_resgate }}</b>
                        <br />
                        Qtd: <b>{{ item.qtd }}</b>
                        <br />
                        Nome: <b>{{ item.nome }}</b>
                        <br />
                        CÃ³digo: <b>{{ item.codigo }}</b>
                        <v-divider></v-divider>
                      </span>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              <div v-if="col.name == 'create_at'">{{ row.create_at }}</div>
              <div v-if="col.name == 'emitido_em' && emitido == 1">
                {{ row.emitido_em }}
              </div>
              <div v-if="col.name == 'emitido_por' && emitido == 1">
                {{ row.emitido_por }}
              </div>
              <div v-if="col.name == 'acao'">
                <v-btn
                  v-if="emitido == 0"
                  small
                  class="ma-1"
                  color="primary"
                  @click="confirmEmitir(row)"
                >
                  Emitir
                  <v-icon dark right small>fa-download</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </v-card>

    <v-dialog v-model="dialogEmitir" persistent max-width="400">
      <v-card>
        <v-card-title class="headline error--text">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <h6>Deseja realmente emitir resgate?</h6>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" @click="dialogEmitir = false">NÃ£o</v-btn>
          <v-btn color="success" @click="emitirResgate(objectItem)">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNumeroPedido" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">RESGATE EMITIDO</span>
        </v-card-title>
        <v-card-text class="headline">
          {{ nPedido }}
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" text @click="dialogNumeroPedido = false"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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

export default {
  data: () => ({
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    loading: false,
    search: "",
    emitido: 0,
    headersResgates: [
      {
        name: "aluno",
        align: "center",
        label: "Aluno",
        sortable: true,
      },
      {
        name: "pedido_dcinfo",
        align: "center",
        label: "Pedido",
        sortable: true,
      },
      {
        name: "tipo_resgate",
        align: "center",
        label: "Tipo",
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        sortable: true,
      },
      {
        name: "nome_produto",
        align: "center",
        label: "Produto",
        sortable: true,
      },
      {
        name: "create_at",
        align: "center",
        label: "Data resgate",
        sortable: false,
      },
      {
        name: "emitido_em",
        align: "center",
        label: "Emitido em",
        sortable: true,
      },
      {
        name: "emitido_por",
        align: "center",
        label: "Emitido por",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "AÃ§Ã£o",
        sortable: false,
      },
    ],
    dialogEmitir: false,
    dialogNumeroPedido: false,
    objectIndex: -1,
    objectItem: {},
    menuFiltros: false,
    showSelectGrupo: false,
    showSelectStatus: false,
    selectedGrupo: [],
    selectedStatusPagamento: [],
    filteredResgates: [],
    filtroAtivoGrupo: false,
    filtroAtivoStatus: false,
    filtroAtivoSistema: false,
    nPedido: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  mounted() {
    this.getResgates();
  },

  methods: {
    getResgates() {
      this.loading = true;
      this.$axios
        .get("/fidelidade/resgates", {
          params: {
            emitido: this.emitido,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            console.log(res.data);
            this.filteredResgates = res.data;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    changeTableResgates() {
      if (this.emitido == 1) {
        this.emitido = 0;
      } else {
        this.emitido = 1;
      }
      this.getResgates();
    },
    find() {
      if (this.search.length == 0) {
        // if (
        //   this.filtroAtivoGrupo ||
        //   this.filtroAtivoStatus ||
        //   this.filtroAtivoSistema
        // ) {
        //   this.changeFilter();
        // } else {
        //   this.clearFilter();
        // }
        this.getResgates();
      }
      if (this.search && this.search.length >= 4) {
        let searchResgateCpf = [];
        let searchResgateTipo = [];
        let searchResgateProduto = [];

        searchResgateCpf = this.filteredResgates.filter((i) =>
          i.cpf_aluno.includes(this.search.toUpperCase())
        );
        if (searchResgateCpf.length) {
          this.filteredResgates = searchResgateCpf;
        }
        searchResgateTipo = this.filteredResgates.filter((i) =>
          i.tipo_resgate.includes(this.search.toLowerCase())
        );
        if (searchResgateTipo.length) {
          this.filteredResgates = searchResgateTipo;
        }

        searchResgateProduto = this.filteredResgates.filter((i) =>
          i.nome_produto.toUpperCase().includes(this.search.toUpperCase())
        );
        if (searchResgateProduto.length) {
          this.filteredResgates = searchResgateProduto;
        }
      }
    },
    confirmEmitir(item) {
      this.objectIndex = this.filteredResgates.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogEmitir = true;
    },
    emitirResgate(item) {
      item.usuario = this.$usuario.value.usuario;
      this.loading = true;
      this.$axios
        .post("/fidelidade/emitir", {
          resgate: item,
        })
        .then((res) => {
          this.loading = false;
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.dialogEmitir = false;
            this.nPedido = res.data;
            this.dialogNumeroPedido = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    // clearFilter(all) {
    //   // this.filtroAtivoGrupo = "";
    //   // this.filtroAtivoStatus = "";
    //   // this.filtroAtivoSistema = "";
    //   // this.selectedGrupo = [];
    //   // this.selectedStatusPagamento = [];

    //   this.filteredResgates = this.resgates;
    // },
    // changeFilter() {
    //   console.log(this.selectedGrupo);
    //   if (
    //     this.selectedGrupo.length > 0 &&
    //     this.selectedStatusPagamento.length > 0
    //   ) {
    //     this.filteredResgates = this.pedidos.filter(
    //       p =>
    //         this.selectedGrupo.includes(p.grupo) &&
    //         this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
    //     );
    //     this.filtroAtivoGrupo = this.selectedGrupo;
    //     this.filtroAtivoStatus = this.selectedStatusPagamento;
    //   } else if (this.selectedGrupo.length > 0) {
    //     this.filteredResgates = this.pedidos.filter(p =>
    //       this.selectedGrupo.includes(p.grupo)
    //     );
    //     this.filtroAtivoGrupo = this.selectedGrupo;
    //   } else if (this.selectedStatusPagamento.length > 0) {
    //     this.filteredResgates = this.pedidos.filter(p =>
    //       this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
    //     );
    //     this.filtroAtivoStatus = this.selectedStatusPagamento;
    //   } else {
    //     this.clearFilter();
    //   }
    // },
    putMask(item, type) {
      if (item.length < 14) {
        return this.$mask.apply(item, "000.000.000-00");
      }
    },
    excel() {
      this.loading = true;
      let json = [];

      for (let item of this.filteredResgates) {
        let obj = {};

        obj.id = item.id;
        obj.cpf = item.cpf_aluno;
        obj.tipo = item.tipo_resgate;
        obj.produto = item.nome_produto;
        obj.pontos = item.pontos_produto;
        obj.total = item.valor_total;
        obj.data_resgate = item.create_at;
        obj.valor_produto = item.valor_produto;

        json.push(obj);
      }
      this.loading = false;

      const jsonKeys = Object.keys(json[0]);
      let objectMaxLength = [];
      for (let i = 0; i < json.length; i++) {
        let value = json[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(json);
      ws["!cols"] = wscols;

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel
      this.$XLSX.utils.book_append_sheet(wb, ws, "resgates_fidelidade"); // sheetAName is name of Worksheet

      if (this.emitido == 1) {
        this.$XLSX.writeFile(wb, "resgates_fidelidade_emitidos.xlsx"); // name of the file is 'book.xlsx'
      } else {
        this.$XLSX.writeFile(wb, "resgates_fidelidade_pendentes.xlsx"); // name of the file is 'book.xlsx'
      }
    },
  },
  showSnakerbar(msg, type, time = 0) {
    this.typeSnackbar = type;
    this.timeSnackbar = time;
    this.msgSnackbar = msg;
    this.snackbar = true;
  },
};
</script>
<style>
.v-text-field__prefix {
  padding: 4px 4px 8px !important;
  color: #000000 !important;
}
</style>