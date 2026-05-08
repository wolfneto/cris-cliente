<template>
  <v-container>
    <h4 class="text-center">RelatÃ³rio Financeiro AcadÃªmico Excel</h4>
    <h5 class="text-center">Somente pedidos pagos pelo site.</h5>
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="2">
        <v-text-field
          v-model="de"
          v-mask="'##/##/####'"
          :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
          placeholder="dd/mm/aaaa"
          label="De"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="ate"
          v-mask="'##/##/####'"
          :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
          placeholder="dd/mm/aaaa"
          label="AtÃ©"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" @click="getRelatorio()">
          Gerar Excel
          <v-icon dark right>far fa-file-excel</v-icon>
        </v-btn>
      </v-col>
    </v-row>
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
    de: "",
    ate: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      financeiro_academico: (state) => state.financeiro.financeiro_academico,
      error: (state) => state.pedidoAtendimento.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["get_financeiro_academico"]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async getRelatorio() {
      if (this.de.length == 10 && this.ate.length == 10) {
        this.set_loading(true);
        await this.get_financeiro_academico({
          de: this.de,
          ate: this.ate,
        });
        this.set_loading(false);
        console.log(this.financeiro_academico);
        if (this.financeiro_academico == false) {
          this.set_snackbar({
            show: true,
            msg: "Nenhum Pedido Encontrado no Periodo",
            type: "warning",
            time: 3000,
          });
        } else {
          this.excel();
        }
      } else {
        this.set_snackbar({
          show: true,
          msg: "Data Incorreta",
          type: "warning",
          time: 3000,
        });
      }
    },
    excel() {
      const jsonKeys = Object.keys(this.financeiro_academico[0]);
      let objectMaxLength = [];
      for (let i = 0; i < this.financeiro_academico.length; i++) {
        let value = this.financeiro_academico[i];
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

      var ws = this.$XLSX.utils.json_to_sheet(this.financeiro_academico, {
        dateNF: "DD/MM/YYYY",
      });
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 12 }; // tamanho da coluna para data
      // ws["!cols"][2] = { wch: 9 };
      ws["!cols"][5] = { wch: 17 }; // tamanho da coluna para data

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

      for (var R = range.s.r; R <= range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
          let address = this.$XLSX.utils.encode_cell({ r: R, c: C });
          var cell = ws[address];
          if (typeof cell != "undefined") {
            if (cell.v === true) {
              for (var Col = range.s.c; Col <= range.e.c; ++Col) {
                let address_cor = this.$XLSX.utils.encode_cell({
                  r: R,
                  c: Col,
                });
                if (typeof ws[address_cor] != "undefined") {
                  ws[address_cor].s = {
                    fill: {
                      fgColor: {
                        rgb: "00B0F0",
                      },
                    },
                  };
                }
              }
            }
          }
        }
      }

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },
  },
};
</script>