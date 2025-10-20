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
      :items="avisos"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Avisos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog persistent v-model="dialog" max-width="60%">
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="selectedSemestre == 0 ? true : false"
                color="primary"
                dark
                class="mb-2"
                v-on="on"
                >Adicionar Aviso</v-btn
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
                          v-model="objectItem.titulo_aviso"
                          label="Titulo"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="custom-row">
                      <v-col cols="12">
                        <v-textarea
                          :rows="4"
                          no-resize
                          :rules="[(v) => !!v || 'Campo Obrigatório']"
                          v-model="objectItem.mensagem_aviso"
                          label="Mensagem"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1 ma-8"></div>
                <v-btn color="error" text @click="fechar()">Voltar</v-btn>
                <v-btn color="success" text @click="salvar()">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.acao="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editAviso(item)"
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
        <v-card-text>Deseja realmente excluir o aviso?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="deleteAviso(objectItem)"
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
      { text: "ID", value: "id_aviso" },
      { text: "ID Faculdade", value: "id_faculdade_aviso" },
      { text: "ID Semestre", value: "id_semestre_aviso" },
      { text: "Titulo", value: "titulo_aviso" },
      { text: "Mensagem", value: "mensagem_aviso" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    avisos: [],
    selectedSemestre: 0,
    semestres: [],
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    dialog: false,
    objectIndex: -1,
    objectItem: {
      titulo_aviso: "",
      mensagem_aviso: "",
    },
    valid: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },
  computed: {
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Aviso" : "Editar Aviso";
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
            .put("/aviso", {
              aviso: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
            })
            .then((res) => {
              this.loading = false;
              if (res.data) {
                this.fechar();
                this.onChangeSemestre();
                this.showSnakerbar(
                  "Aviso Editado Com Sucesso!",
                  "success",
                  3000
                );
              } else {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              }
            })
            .catch((err) => {
              this.loading = false;

              console.log(err);
            });
        } else {
          this.$axios
            .post("/aviso", {
              aviso: this.objectItem,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
            })
            .then((res) => {
              this.loading = false;
              if (res.data) {
                this.fechar();
                this.onChangeSemestre();
                this.showSnakerbar(
                  "Aviso Adicionado Com Sucesso!",
                  "success",
                  3000
                );
              } else {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              }
            })
            .catch((err) => {
              this.loading = false;

              console.log(err);
            });
        }
      }
    },
    editAviso(item) {
      this.objectIndex = this.avisos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.avisos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    deleteAviso() {
      this.dialogExcluir = false;
      this.loading = true;
      this.$axios
        .delete("/aviso", {
          data: {
            id: this.objectItem.id_aviso,
          },
        })
        .then((res) => {
          this.onChangeSemestre();
          this.loading = false;
          if (res.data) {
            this.showSnakerbar("Aviso Deletado Com Sucesso!", "success", 3000);
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
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
    onChange(){
    this.selectedPosGraduacao = "";      
     this.semestres = [];
     this.avisos = [];
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.avisos = [];
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
      this.$axios
        .get("/aviso/findallbyfaculdadesemestre", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.avisos = res.data;
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