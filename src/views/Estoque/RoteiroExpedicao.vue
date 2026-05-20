<template>
  <v-container>
    <v-card>
      <h4 class="text-center">Roteiro de Expedição</h4>
      <v-row justify="center" class="mt-n4">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-text-field
            autofocus
            full-width
            height="50pt"
            class="uppercase h4 ml-2 mr-2 mt-4"
            background-color="blue lighten-5"
            append-icon="fa-search"
            v-model="pedido"
            v-on:keyup.enter="getRoteiro()"
            label="Numero do Pedido"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="pedidos.length > 0">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-btn @click="excel()" block color="primary"
            ><v-icon left>fa-file-excel</v-icon>Gerar Excel</v-btn
          >
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row v-if="pedidos.length > 0" justify="center">
        <v-btn @click="reset_pedidos" color="warning"
          ><v-icon left>fa-trash-alt</v-icon>Limpar</v-btn
        >
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-data-table
          :headers="header"
          :items="pedidos"
          hide-default-footer
          dense
          no-data-text="Não há pedidos no momento."
        >
          <template v-slot:[`item.total`]="{ item }">
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.total)
            }}
          </template>
          <template v-slot:[`item.acao`]="{ item }">
            <v-btn @click="remove_pedido(item.numero_pedido)" icon color="error"
          ><v-icon>fa-times</v-icon></v-btn
        >
          </template>
        </v-data-table>
      </v-row>
    </v-card>

    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <v-btn text @click="closeSnackbar()">Fechar</v-btn>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    pedido: "",
    header: [
      {
        text: "NÂ° Pedido",
        align: "left",
        value: "numero_pedido",
      },
      { text: "Cliente", value: "cliente" },
      { text: "Grupo", value: "grupo" },
      { text: "Total", value: "total" },
      { text: "Nota", value: "nota" },
      { text: "Endereço", value: "endereco_completo" },
      { text: "Vendedor", value: "vendedor" },
      { text: "Ação", value: "acao"}
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      pedidos: (state) => state.estoque.pedidos,
      error: (state) => state.estoque.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["get_roteiro"]),
    ...mapMutations(["set_loading", "set_snackbar", "reset_pedidos", "remove_pedido"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async getRoteiro() {
      if (this.pedido.length < 7) {
        this.set_snackbar({
          show: true,
          msg: "Numero de Pedido Incorreto",
          type: "error",
          time: 3000,
        });
      } else {
        if (this.pedidos.some((e) => e.numero_pedido === this.pedido.trim())) {
          this.set_snackbar({
            show: true,
            msg: "Pedido Já Adicionado",
            type: "warning",
            time: 3000,
          });
        } else {
          this.set_loading(true);
          await this.get_roteiro(this.pedido.toUpperCase());
          this.set_loading(false);
          this.pedido = "";
        }
      }
    },
    excel() {
      let json = [];

      for (let pedido of this.pedidos) {
        let obj = {
          DESTINATARIO: pedido.cliente,
          ENDERECO: pedido.endereco.replace(",", "") + " " + pedido.numero,
          CEP: pedido.cep,
          BAIRRO: pedido.bairro,
          CIDADE: pedido.cidade,
          ENDERECO_COMPLERO: pedido.endereco_completo,
          PEDIDO: pedido.numero_pedido,
          TOTAL: pedido.total,
          ACAO: "SÃ“ ENTREGAR RETIRAR MATERIAL ENTREGAR E RECEBE TROCAR MATERIAL",
          TELEFONE_CELULAR: pedido.telefone + ' - ' +pedido.celular,
          GRUPO: pedido.grupo
        };
        json.push(obj);
      }

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

      var ws = this.$XLSX.utils.json_to_sheet(json);

      var fmt = "0.00";
      var range = this.$XLSX.utils.decode_range(ws["!ref"]);
      for (var R = range.s.r; R <= range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
          var cell = ws[this.$XLSX.utils.encode_cell({ r: R, c: C })];
          if (!cell || cell.t != "n") continue; // only format numeric cells
          cell.z = fmt;
        }
      }

      for (var C = range.s.c; C <= range.e.c; ++C) {
        var address = this.$XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C
        if (!ws[address]) continue;
        ws[address].s = {
          fill: {
            fgColor: {
              rgb: "fffb01",
            },
          },
        };
      }

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "roteiro"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "roteiro.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },
  },
};
</script>