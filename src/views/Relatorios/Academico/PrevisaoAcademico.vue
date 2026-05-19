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
    <v-row class="custom-row">
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
            @change="onChangeFaculdade()"
          ></v-autocomplete>      
      </v-col>
      <v-col align-self="center" class="text-center" cols="6">
        <span class="title">Data Pedidos de Compra</span>
      </v-col>
    </v-row>
     <v-row class="custom-row">
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
    <v-row class="custom-row">
      <v-col cols="6">
        <v-select
         :disabled="selectedPosGraduacao === ''"
          @change="onChangeSemestre()"
          v-model="selectedSemestre"
          :items="semestres"
          item-text="descri_semestre"
          return-object
          label="Semestre"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-row justify="center" class="custom-row">
          <v-col cols="6">
            <v-text-field
              v-model="data_compra_de"
              v-mask="'##/##/####'"
              :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
              placeholder="dd/mm/aaaa"
              label="De"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="data_compra_ate"
              v-mask="'##/##/####'"
              :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
              placeholder="dd/mm/aaaa"
              label="Até"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="custom-row">
      <v-col cols="6">
        <v-select
          v-model="selectedLista"
          :items="listas"
          item-text="nome_lista"
          item-value="id_lista"
          return-object
          label="Lista"
        >
          <template v-slot:item="{ item }">{{item.id_lista}} - {{item.nome_lista}}</template>
          <template v-slot:selection="{ item }">{{item.id_lista}} - {{item.nome_lista}}</template>
        </v-select>
      </v-col>
      <v-col cols="6">
        <v-radio-group row v-model="selectedNat" dense :mandatory="true">
          <v-radio dense label="1102 (Todos)" value="1102"></v-radio>
          <v-radio dense label="1102 N (Normal)" value="1102  N"></v-radio>
          <v-radio dense label="1102 C (Concorrencia)" value="1102  C"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col align-self="center" class="text-center" cols="12">
        <v-btn @click="getDados()" small color="primary">Gerar Relatório</v-btn>
        <v-btn to="/relatorios/listasEmPrevisao" small color="primary">Listas Em Previsão</v-btn>
        <v-btn
          class="ml-3"
          v-if="dados.length > 0"
          @click="exportExcel()"
          small
          color="success"
        >Excel</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :items-per-page="20"
      :footer-props="{
					itemsPerPageOptions: [20, 50, 100, -1],
					itemsPerPageText: 'Itens por pagina',
					}"
      no-data-text="Nenhum item encontrado"
      :sort-by="['marca', 'descricao']"
      fixed-header
      :headers="headers"
      :items="dados"
    >
      <template v-slot:item="{ item }">
        <tr v-if="item.id_lista != null">
          <td>{{item.total}}</td>
          <td></td>
          <td>{{item.marca}}</td>
          <td>{{item.descricao}}</td>
          <td>{{item.nome_lista}}</td>
          <td>
            {{item.nome_faculdade}}
            <br />
            {{item.nome_semestre}}
          </td>
          <td>{{item.cod_marca}}</td>
        </tr>
        <tr class="blue lighten-4" v-else>
          <td>{{item.total}}</td>
          <td>{{item.saldo}}</td>
          <td></td>
          <td>{{item.descricao}}</td>
          <td></td>
          <td></td>
          <td>{{item.cod_marca}}</td>
        </tr>
      </template>
    </v-data-table>
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
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    permissoes: {},
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    selectedSemestre: 0,
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    listas: [],
    selectedLista: 0,
    selectedNat: "1102",
    headers: [
      { text: "Qtd", value: "total" },
      { text: "Saldo", value: "saldo" },
      { text: "Fornecedor", value: "pontos_produto" },
      { text: "Descrição", value: "status" },
      { text: "Lista", value: "tipo_resgate" },
      { text: "Faculdade", value: "create_at" },
      { text: "Código", value: "acao" }
    ],
    dados: [],
    data_compra_ate: "",
    data_compra_de: ""
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
    this.getFacudades();
    this.getDatas();
    this.setDataCompraFunction();
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

    setDataCompraFunction() {
      this.data_compra_ate = this.data_final;
      this.data_compra_de = this.data_inicial;
    },
    exportExcel() {
      let json = [];

      this.dados.forEach(dado => {
        dado.total = parseInt(dado.total)
        dado.saldo = parseInt(dado.saldo)
        dado.comprar = parseInt(dado.comprar)
        if (dado.id_lista == null) {
          dado.linha_total = true;
        } else {
          dado.linha_total = false;
          dado.comprar = "";
          dado.pedido_compra = "";
        }

        if (dado.descricao == null) {
          dado.saldo = null;
          dado.marca = null;
          dado.nome_faculdade = null;
          dado.nome_semestre = null;
          dado.cod_marca = null;
          // dado.atraso = null;
        }
      });
      var ws = this.$XLSX.utils.json_to_sheet(this.dados);

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "previsao"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "previsao.xlsx"); // name of the file is 'book.xlsx'
    },
    getDados() {      
      this.loading = true;
      this.$axios
        .get("/relatorio/previsao/academico/find", {
          params: {
            de: this.data_de,
            ate: this.data_ate,
            de_compra: this.data_compra_de,
            ate_compra: this.data_compra_ate,
            nat: this.selectedNat,
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre.id_semestre,
            lista: this.selectedLista.id_lista
          }
        })
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.dados = res.data;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    onChangeSemestre() {
      this.selectedLista = 0;
      this.$axios
        .get("/relatorio/previsao/academico/listas", {
          params: {
            de: this.data_de,
            ate: this.data_ate,
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre.id_semestre
          }
        })
        .then(res => {
          console.log(res.data);
          this.listas = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeFaculdade() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
    },
    async onChangeGraduacao() {
      this.selectedSemestre = "";
      let obj = {
        faculdade: this.selectedFaculdade,
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
    }
  }
};
</script>