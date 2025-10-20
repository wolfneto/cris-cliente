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
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">
        <v-select
          @change="onChangePeriodo()"
          v-model="selectedPeriodo"
          :items="periodos"
          item-text="nome_periodo"
          item-value="cod_periodo"
          label="Periodo"
        ></v-select>
      </v-col>
    </v-row>
    <v-data-table
      hide-default-footer
      :items-per-page="-1"
      :headers="headers"
      :items="representantes"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Representantes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="selectedPeriodo == 0 ? true : false"
                color="primary"
                dark
                class="mb-2"
                v-on="on"
                >Adicionar Representante</v-btn
              >
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
                        <v-text-field
                          :rules="[(v) => !!v || 'Campo Obrigatório']"
                          v-model="objectItem.nome_representante"
                          label="Nome"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="custom-row mt-5">
                      <v-col cols="12" md="4">
                        <v-radio-group
                          label="Status"
                          v-model="objectItem.status_representante"
                          mandatory
                        >
                          <v-radio label="Ativo" value="1"></v-radio>
                          <v-radio label="Inativo" value="0"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-radio-group
                          label="Situação"
                          v-model="objectItem.situacao_representante"
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
      <template v-slot:item.status_representante="{ item }">
        <v-chip v-if="item.status_representante == 1" color="success" dark
          >Ativo</v-chip
        >
        <v-chip v-else color="error" dark>Inativo</v-chip>
      </template>
      <template v-slot:item.situacao_representante="{ item }">
        <v-chip v-if="item.situacao_representante == 1" color="success" dark
          >Ativo</v-chip
        >
        <v-chip v-else color="error" dark>Inativo</v-chip>
      </template>
      <template v-slot:item.acao="{ item }">
        <v-icon
          color="primary"
          small
          class="mr-2"
          @click="editRepresentante(item)"
          >fa-edit</v-icon
        >
        <v-icon color="error" small @click="deleteDialog(item)"
          >fa-trash-alt</v-icon
        >
      </template>
    </v-data-table>
    <v-dialog v-model="dialogExcluir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text>Deseja realmente excluir o representante?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="deleteRepresentante(objectItem)"
            >Excluir</v-btn
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    dialogExcluir: false,
    loading: false,
    headers: [
      { text: "ID", value: "id_representante" },
      { text: "ID Faculdade", value: "id_faculdade_representante" },
      { text: "ID Semestre", value: "id_semestre_representante" },
      { text: "Descrição", value: "nome_representante" },
      { text: "Periodo", value: "nome_periodo" },
      { text: "Status", value: "status_representante", align: "center" },
      { text: "Situação", value: "situacao_representante", align: "center" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    representantes: [],
    periodos: [],
    selectedPeriodo: 0,
    selectedSemestre: 0,
    semestres: [],
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    dialog: false,
    objectIndex: -1,
    objectItem: {
      nome_representante: "",
      status_representante: "0",
      situacao_representante: "0",
    },
    valid: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },
  computed: {
    formTitle() {
      return this.objectIndex === -1
        ? "Adicionar Representante"
        : "Editar Representante";
    },
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
            .put("/representante", {
              representante: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
              periodo: this.selectedPeriodo,
            })
            .then((res) => {
              this.loading = false;
              this.fechar();
              this.onChangePeriodo();
              this.showSnakerbar(
                "Representante Editado Com Sucesso!",
                "success",
                3000
              );
            })
            .catch((err) => {
              this.loading = false;
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
              console.log(err);
            });
        } else {
          this.$axios
            .post("/representante", {
              representante: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
              periodo: this.selectedPeriodo,
            })
            .then((res) => {
              this.loading = false;
              this.fechar();
              this.onChangePeriodo();
              this.showSnakerbar(
                "Representante Adicionado Com Sucesso!",
                "success",
                3000
              );
            })
            .catch((err) => {
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
    editRepresentante(item) {
      this.objectIndex = this.representantes.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.representantes.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    deleteRepresentante() {
      this.dialogExcluir = false;
      this.loading = true;
      this.$axios
        .delete("/representante", {
          data: {
            id: this.objectItem.id_representante,
          },
        })
        .then((res) => {
          if (res.data) {
            this.onChangePeriodo();
            this.loading = false;
            this.showSnakerbar(
              "Representante Deletado Com Sucesso!",
              "success",
              3000
            );
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.periodos = [];
      this.representantes = [];
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.periodos = [];
      this.representantes = [];
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade,
            graduacao: this.selectedPosGraduacao,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.semestres = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChangeSemestre() {
      this.selectedPeriodo = "";
      this.periodos = [];
      this.representantes = [];
      this.$axios
        .get("/periodo/findallbyfaculdadesemestre", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.periodos = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChangePeriodo() {
      this.representantes = [];
      this.$axios
        .get("/representante/findallbyfaculdadesemestreperiodo", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre,
            periodo: this.selectedPeriodo,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.representantes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFacudades() {
      this.$axios
        .get("/faculdades")
        .then((res) => {
          this.faculdades = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
  },
};
</script>
<style scoped>
</style>