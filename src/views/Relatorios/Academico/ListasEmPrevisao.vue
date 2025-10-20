<template>
  <v-container>
    <v-row justify="center" class="custom-row">
      <v-col cols="3">
        <v-text-field
          v-model="data_de"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
          placeholder="dd/mm/aaaa"
          label="De"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="data_ate"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
          placeholder="dd/mm/aaaa"
          label="Até"
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="6">
        <v-autocomplete
            class="uppercase"
            auto-select-first
            autofocus
            v-model="selectedFaculdade"
            :items="faculdades"
            item-text="nome_exibicao_faculdade"
            item-value="id_faculdade"
            label="Faculdade"
            return-object
            @change="onChangeFaculdade()"
          ></v-autocomplete>
      </v-col>
    </v-row>
     <v-row justify="center" class="custom-row">
        <v-col md="6">
          <v-select
            :disabled="selectedFaculdade == 0"
            v-model="selectedPosGraduacao"
            @change="onChangeGraduacao()"
            :items="[
              { text: 'Graduação', value: 0 },
              { text: 'Especialização', value: 1 },
            ]"
            label="Graduação ou Especialização"
          ></v-select>
        </v-col>
      </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="6">
        <v-select
         :disabled="selectedPosGraduacao === ''"
          v-model="selectedSemestre"
          :items="semestres"
          item-text="descri_semestre"
          return-object
          label="Semestre"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col align-self="center" class="text-center" cols="12">
        <v-btn
          class="mr-2"
          v-if="listas.length > 0"
          @click="$htmlToPaper('print')"
          small
          color="primary"
        >Imprimir</v-btn>
        <v-btn class="mr-2" @click="getListas()" small color="primary">Buscar</v-btn>
        <v-btn v-if="listas.length > 0" class="mr-2" @click="gerarExcel()" small color="success">Gerar Excel</v-btn>
      </v-col>
    </v-row>
    <div id="print">
      <table class="table table-hover table-bordered">
        <thead class="thead-dark">
          <tr class="d-flex">
            <th class="col-1">Id Lista Original</th>
            <th class="col-1">Id Lista Online</th>
            <th class="col-4">Nome</th>
            <th class="col-2">Faculdade</th>
            <th class="col-1">Semestre</th>
            <th class="col-1">Previsao</th>
            <th class="col-1">Lista Criada em</th>
            <th class="col-1">Lucro Site</th>
          </tr>
        </thead>
        <tbody>
          <tr class="d-flex" v-for="lista of listas" :key="lista.id_lista">
            <td class="col-1">{{lista.id_lista}}</td>
            <td class="col-1">{{lista.id_lista_online}}</td>
            <td class="col-4">{{lista.nome_lista}}</td>
            <td class="col-2">{{lista.nome_faculdade}}</td>
            <td class="col-1">{{lista.nome_semestre}}</td>
            <td class="col-1">{{lista.previsao}}</td>
            <td class="col-1">{{lista.data_formated}}</td>
            <td class="col-1">{{lista.lucro_site.toFixed(2).replace('.', ',')}}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      listas: [],
      faculdades: [],
      selectedFaculdade: 0,
      selectedPosGraduacao: "",
      selectedSemestre: 0,
    };
  },
  created() {
    this.getFacudades();
    this.getDatas();
  },
  computed: {
    ...mapState({
      semestres: (state) => state.gerenciarSemestres.semestres,
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
    ...mapActions(["getDatas", "get_semestres"]),
    getListas() {
      this.$axios
        .get("/relatorio/previsao/academico/findPrevisao", {
          params: {
            de: this.data_de,
            ate: this.data_ate,
            faculdade: this.selectedFaculdade.id_faculdade,
            semestre: this.selectedSemestre.id_semestre
          }
        })
        .then(res => {
          this.listas = res.data;
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatterDate(data) {
      let d = new Date(data);
      let date =
        d.getFullYear() +
        "-" +
        (d.getMonth().toString().length > 1
          ? d.getMonth() + 1
          : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate().toString().length > 1 ? d.getDate() : "0" + d.getDate());

      return date;
    },
     onChangeFaculdade() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
    },
    async onChangeGraduacao() {
      this.selectedSemestre = "";
      let obj = {
        faculdade: this.selectedFaculdade.id_faculdade,
        graduacao: this.selectedPosGraduacao,
      };
      await this.get_semestres(obj);
      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
    },
    getFacudades() {
      this.$axios
        .get("/faculdades")
        .then(res => {
          this.faculdades = res.data;
          this.faculdadesCopiar = res.data;
        })
        .catch(err => {
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
    },
    gerarExcel() {
      this.loading = true;
      let arrayExcel = [];

      for (let item of this.listas) {
        let obj = {};
        obj.id = item.id_lista;
        obj.id_lista_online = item.id_lista_online;
        obj.lista = item.nome_lista;
        obj.faculdade = item.nome_faculdade;
        obj.semestre = item.nome_semestre;
        obj.previsao = item.previsao;
        obj.data_lista = this.$moment_format(item.date_create);
        obj.lucro_site = item.lucro_site + " " + "%";
        
        arrayExcel.push(obj);
      }
    
      const jsonKeys = Object.keys(arrayExcel[0]);
      let objectMaxLength = [];
      for (let i = 0; i < arrayExcel.length; i++) {
        let value = arrayExcel[i];
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

      var ws = this.$XLSX.utils.json_to_sheet(arrayExcel);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 10 };
      ws["!cols"][1] = { wch: 10 }; 
      ws["!cols"][2] = { wch: 40 }; 
      ws["!cols"][3] = { wch: 20 }; 
      ws["!cols"][4] = { wch: 20 }; 
      ws["!cols"][5] = { wch: 10 }; 
      ws["!cols"][6] = { wch: 20 }; 
      ws["!cols"][7] = { wch: 10 }; 

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_listas_em_previsao"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_listas_em_previsao.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      this.loading = false;
    },
  }
};
</script>

<style scoped>
</style>

