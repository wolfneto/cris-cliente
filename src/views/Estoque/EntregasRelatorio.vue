<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row justify="center">
          <v-col cols="5">
            <v-text-field
              v-model="data_de"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
              @keydown.enter="getEntregas()"
              placeholder="dd/mm/aaaa"
              label="De"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field
              v-model="data_ate"
              v-mask="'##/##/####'"
              @keydown.enter="getEntregas()"
              :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
              placeholder="dd/mm/aaaa"
              label="AtÃ©"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="getEntregas()" color="success"
              ><v-icon left>fa-search</v-icon>Buscar</v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-row justify="center" v-if="entregas.length > 0">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-btn @click="excel()" block color="primary"
            ><v-icon left>fa-file-excel</v-icon>Gerar Excel</v-btn
          >
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-data-table
          :headers="header"
          :items="entregas"
          hide-default-footer
          dense
          no-data-text="NÃ£o hÃ¡ entregas no periodo."
        >
          <template v-slot:[`item.dados`]="{ item }">
            <b>Recebido por: {{ item.nome_recebedor }}</b>
            <br />
            <b>RG: {{ item.rg_recebedor }}</b>
            <br />
            <b>Entregue em: {{ $moment_format_time(item.entregue_em) }}</b>
            <br />
            <b>Entregue por: {{ item.entregue_por }}</b>
          </template>
        </v-data-table>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    header: [
      {
        text: "NÂ° Online",
        align: "center",
        value: "pedido_online",
      },
      { text: "NÂ° DCInfo", value: "pedido_dcinfo" },
      { text: "Grupo", value: "pedido_grupo" },
      { text: "Dados", value: "dados" },
      { text: "Vendedor", value: "vendedor" },
      { text: "EndereÃ§o", value: "endereco_completo" },
    ],
  }),
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    await this.getDatas();
  },
  computed: {
    ...mapState({
      entregas: (state) => state.estoque.entregas,
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
      error: (state) => state.estoque.error,
    }),

    data_de: {
      get() {
        return this.data_inicial;
      },
      set(value) {
        this.$store.commit("setDataInicial", value);
      },
    },
    data_ate: {
      get() {
        return this.data_final;
      },
      set(value) {
        this.$store.commit("setDataFinal", value);
      },
    },
  },
  methods: {
    ...mapMutations(["set_snackbar", "set_loading"]),
    ...mapActions(["get_entregas", "getDatas"]),
    async getEntregas() {
      this.set_loading(true);
      await this.get_entregas({ de: this.data_de, ate: this.data_ate });
      this.set_loading(false);
      console.log("oba", this.entregas);
    },
    excel() {
      const jsonKeys = Object.keys(this.entregas[0]);
      let objectMaxLength = [];
      for (let i = 0; i < this.entregas.length; i++) {
        let value = this.entregas[i];
        value.entregue_em = this.$moment_format_time(value.entregue_em)
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

      var ws = this.$XLSX.utils.json_to_sheet(this.entregas);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 12 }; // tamanho da coluna para data
      // ws["!cols"][2] = { wch: 9 };
      ws["!cols"][11] = { wch: 17 }; // tamanho da coluna para data
      ws["!cols"][22] = { wch: 17 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_entregas"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_entregas.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },
  },
};
</script>
<style scoped>
</style>