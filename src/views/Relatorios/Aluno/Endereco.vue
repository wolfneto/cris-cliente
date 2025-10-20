<template>
  <v-container>
    <v-row justify="center" class="custom-row">
      <v-col cols="3">
        <v-text-field v-model="data_de" v-mask="'##/##/####'" :rules="[v => !!v.trim() || 'Data obrigatória!']"
          placeholder="dd/mm/aaaa" label="De" required></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="data_ate" v-mask="'##/##/####'" :rules="[v => !!v.trim() || 'Data obrigatória!']"
          placeholder="dd/mm/aaaa" label="Até" required></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="6">
        <v-autocomplete auto-select-first autocomplete="off" v-model="selectedFaculdade" :items="faculdades"
          class="text-uppercase" label="Selecione a Faculdade" item-text="nome_exibicao_faculdade" return-object
          @change="onChange()"></v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="6">
        <v-select v-model="selectedPosGraduacao" @change="onChangeGraduacao()" :items="[
          { text: 'GRADUAÇÃO', value: 0 },
          { text: 'ESPECIALIZAÇÃO', value: 1 },
        ]" class="text-uppercase" label="Graduação ou Especialização"></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="6">
        <v-select v-model="selectedSemestre" :items="semestres" class="text-uppercase" label="Selecione o Semestre"
          item-text="descri_semestre" return-object></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col align-self="start" class="text-center" cols="8">
        <v-btn color="success" @click="excel()">Gerar Excel</v-btn>
      </v-col>
    </v-row>
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
      {{ msgSnackbar }}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      objectIndex: -1,
      objectItem: {},
      selectedFaculdade: {},
      faculdades: [],
      selectedPosGraduacao: "",
      selectedSemestre: {},
      semestres: [],
      pedidos: [],
      typeSnackbar: "",
      timeSnackbar: 2000,
      snackbar: false,
      msgSnackbar: "",
      loading: false,
    };
  },
  created() {
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
    }
  },
  methods: {
    ...mapActions(["getDatas"]),
    async excel() {
      this.loading = true;
      let res = await this.$axios.get("/academico/pedidos_enderecos", {
        params: {
          dados: { faculdade: this.selectedFaculdade, semestre: this.selectedSemestre, de: this.data_de, ate: this.data_ate },
        },
      })
      if(res.data.length == 0){
        this.msgSnackbar = "Nenhum Pedido Encontrado!";
        this.typeSnackbar = "warning";
        this.snackbar = true;
        this.timeSnackbar = 2000;
      } else {
        let pedidos = res.data

      const jsonKeys = Object.keys(pedidos[0]);
      let objectMaxLength = [];
      for (let i = 0; i < pedidos.length; i++) {
        let value = pedidos[i];
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

      var ws = this.$XLSX.utils.json_to_sheet(pedidos);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 30 }; // tamanho da coluna para data
      ws["!cols"][1] = { wch: 9 };
      ws["!cols"][2] = { wch: 12 };
      ws["!cols"][3] = { wch: 9 }; // tamanho da coluna para data
      ws["!cols"][4] = { wch: 12 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "pedidos_enderecos"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "pedidos_enderecos.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      }
      
      this.loading = false;
    },
    getFacudades() {
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id,
          },
        })
        .then((res) => {
          this.faculdades = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
    },
    onChangeGraduacao() {
      this.loading = true;
      this.selectedSemestre = "";
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade.id_faculdade,
            graduacao: this.selectedPosGraduacao,
          },
        })
        .then((res) => {
          this.semestres = res.data;
          this.loading = false;
        })
        .catch((err) => {
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
            pagina: "previsao_academico"
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

