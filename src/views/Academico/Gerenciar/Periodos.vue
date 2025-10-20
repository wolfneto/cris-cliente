<template>
  <v-container>
    <Tabs></Tabs>
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">        
        <v-autocomplete
          auto-select-first
          autofocus          
          v-model="selectedFaculdade"
          :items="faculdades"
          item-text="nome_exibicao_faculdade"
          item-value="id_faculdade"
          label="Faculdade"
          @change="onChange()"
        ></v-autocomplete>
      </v-col>
    </v-row>
     <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">
        <v-select
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
      <v-col cols="12" md="6">
        <v-select
          @change="onChangeSemestre()"
          v-model="selectedSemestre"
          :items="semestres"
          item-text="descri_semestre"
          item-value="id_semestre"
          label="Semestre"
        ></v-select>
      </v-col>
    </v-row>
    <v-data-table
      hide-default-footer
      :items-per-page="-1"
      :headers="headers"
      :items="periodos"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Periodos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="selectedSemestre == 0 ? true : false"
                color="primary"
                dark
                class="mb-2"
                v-on="on"
              >Adicionar Periodo</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row class="custom-row">
                      <v-col cols="12">
                        <v-select
                          v-model="objectItem.cod_periodo"
                          :items="dadosPeriodos"
                          item-text="nome"
                          item-value="id"
                          label="Periodo"
                          return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="custom-row">
                      <v-col cols="12">
                        <v-select
                          v-model="objectItem.codigo_vendedor"
                          :items="vendedores"
                          item-text="nome"
                          item-value="codigo"
                          label="Vendedor"
                          return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="custom-row mt-5">
                      <v-col cols="12" md="4">
                        <v-radio-group label="Status" v-model="objectItem.status_periodo" mandatory>
                          <v-radio label="Ativo" value="1"></v-radio>
                          <v-radio label="Inativo" value="0"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-radio-group
                          label="Situação"
                          v-model="objectItem.situacao_periodo"
                          mandatory
                        >
                          <v-radio label="Ativo" value="1"></v-radio>
                          <v-radio label="Inativo" value="0"></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error" text @click="fechar()">Voltar</v-btn>
                <v-btn color="success" text @click="salvar()">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.codigo_vendedor="{ item }">{{item.nome_vendedor}}</template>
      <template v-slot:item.cod_periodo="{ item }">{{ item.cod_periodo.id }}</template>
      <template v-slot:item.status_periodo="{ item }">
        <v-chip v-if="item.status_periodo == 1" color="success" dark>Ativo</v-chip>
        <v-chip v-else color="error" dark>Inativo</v-chip>
      </template>
      <template v-slot:item.situacao_periodo="{ item }">
        <v-chip v-if="item.situacao_periodo == 1" color="success" dark>Ativo</v-chip>
        <v-chip v-else color="error" dark>Inativo</v-chip>
      </template>
      <template v-slot:item.acao="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editPeriodo(item)">fa-edit</v-icon>
        <v-icon color="error" small @click="deleteDialog(item)">fa-trash-alt</v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogExcluir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text>Deseja realmente excluir o periodo?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="deletePeriodo(objectItem)">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
export default {
  components: {
    Tabs
  },
  data: () => ({
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    dialogExcluir: false,
    loading: false,
    headers: [
      { text: "ID", value: "id_periodo" },
      { text: "ID Faculdade", value: "id_faculdade_periodo" },
      { text: "ID Semestre", value: "id_semestre_periodo" },
      { text: "Descrição", value: "nome_periodo" },
      { text: "Vendedor", value: "codigo_vendedor" },
      { text: "Código", value: "cod_periodo" },
      { text: "Status", value: "status_periodo", align: "center" },
      { text: "Situação", value: "situacao_periodo", align: "center" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100
      }
    ],
    periodos: [],
    semestres: [],
    selectedSemestre: 0,
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "", 
    dialog: false,
    objectIndex: -1,
    dadosPeriodos: [
      { id: 1, nome: "DIURNO" },
      { id: 2, nome: "VESPERTINO" },
      { id: 3, nome: "NOTURNO" },
      { id: 4, nome: "INTEGRAL" }
    ],
    objectItem: {
      cod_periodo: 0,
      codigo_vendedor: 0,
      status_periodo: "0",
      situacao_periodo: "0"
    },
    vendedores: [],
    valid: false
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
    this.getVendedores();
  },
  computed: {
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Periodo" : "Editar Periodo";
    }
  },
  methods: {
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign({}, {});
    },
    salvar() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.objectIndex > -1) {
          this.$axios
            .put("/periodo", {
              periodo: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre
            })
            .then(res => {
              this.loading = false;
              this.fechar();
              this.onChangeSemestre();
              this.showSnakerbar(
                "Periodo Editado Com Sucesso!",
                "success",
                3000
              );
            })
            .catch(err => {
              this.loading = false;
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
              console.log(err);
            });
        } else {
          this.$axios
            .post("/periodo", {
              periodo: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre
            })
            .then(res => {
              this.loading = false;
              this.fechar();
              this.onChangeSemestre();
              this.showSnakerbar(
                "Periodo Adicionado Com Sucesso!",
                "success",
                3000
              );
            })
            .catch(err => {
              this.loading = false;
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
              console.log(err);
            });
        }
      }
    },
    editPeriodo(item) {
      this.objectIndex = this.periodos.indexOf(item);
      this.objectItem = Object.assign({}, item);

      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.periodos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    deletePeriodo() {
      this.dialogExcluir = false;
      this.loading = true;
      this.$axios
        .delete("/periodo", {
          data: {
            id: this.objectItem.id_periodo
          }
        })
        .then(res => {
          if (res.data) {
            this.onChangeSemestre();
            this.loading = false;
            this.showSnakerbar(
              "Periodo Deletado Com Sucesso!",
              "success",
              3000
            );
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    onChange(){
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.periodos = [];
    },
    onChangeGraduacao() {
       this.selectedSemestre = "";
      this.periodos = [];
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade,
            graduacao: this.selectedPosGraduacao,
          }
        })
        .then(res => {
          this.semestres = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeSemestre() {
      this.$axios
        .get("/periodo/findallbyfaculdadesemestre", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre
          }
        })
        .then(res => {
          this.periodos = res.data;

          this.periodos.forEach(periodo => {
            periodo.cod_periodo = {
              id: periodo.cod_periodo,
              nome: periodo.nome_periodo
            };
            periodo.codigo_vendedor = {
              codigo: periodo.codigo_vendedor,
              nome: periodo.nome_vendedor
            };
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getVendedores() {
      this.$axios
        .get("/periodo/getvendedores")
        .then(res => {
          this.vendedores = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFacudades() {
      this.$axios
        .get("/faculdades")
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
<style scoped>
</style>