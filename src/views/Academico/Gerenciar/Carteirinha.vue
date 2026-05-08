<template>
  <v-container>
    <Tabs></Tabs>
    <v-card width="auto">
      <v-container fluid>
        <v-card class="ma-0" max-width="100%" height="100%" elevation="4">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6"></v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                  class="uppercase"
                  append-icon="fa-search"
                  v-model="search"
                  label="Buscar"
                  hide-details
                  dense
                  filled
                  rounded
                  @click="$event.target.select()"
                ></v-text-field> </v-col
            ></v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="12" lg="12">
                <v-data-table
                  hide-default-footer
                  :items-per-page="-1"
                  :headers="headersSemestres"
                  :items="semestres"
                  :search="search"
                  fixed-header
                  height="600px"
                  dense
                >
                  <template v-slot:item.nome_exibicao_faculdade="{ item }">
                    <span class="text-uppercase"
                      >{{ item.nome_exibicao_faculdade.toUpperCase() }}
                    </span>
                    <br />
                  </template>
                  <template v-slot:item.descri_semestre="{ item }">
                    <span class="text-uppercase"
                      >{{ item.descri_semestre.toUpperCase() }}
                    </span>
                    <br />
                  </template>
                  <template v-slot:item.valor="{ item }">
                    <span v-if="item.valor">
                      {{
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.valor)
                      }}
                    </span>
                  </template>

                  <template v-slot:item.img="{ item }">
                    <v-icon
                      v-if="item.status == 1"
                      :disabled="!item.status"
                      color="success"
                      >far fa-id-card</v-icon
                    >
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      v-if="item.status == 1"
                      color="#B9F6CA"
                      text-color="green"
                      small
                      >ATIVO</v-chip
                    >
                    <v-chip v-else color="#FFCDD2" text-color="red" small
                      >INATIVO</v-chip
                    >
                  </template>
                  <template v-slot:item.acao="{ item }">
                    <v-row>
                      <v-col cols="4">
                        <v-icon
                          :disabled="item.status == 1"
                          color="success"
                          small
                          @click="editarAdicionar(item)"
                          >fas fa-plus</v-icon
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-icon
                          :disabled="!item.status"
                          color="warning"
                          small
                          @click="editarAdicionar(item)"
                          >fa-edit</v-icon
                        >
                      </v-col>
                      <v-col cols="4">
                        <v-icon
                          :disabled="!item.status"
                          color="error"
                          small
                          @click="deleteDialog(item)"
                          >fa-trash-alt</v-icon
                        >
                      </v-col>
                    </v-row>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>
    <v-dialog v-model="dialog" persistent width="45%">
      <v-card>
        <v-card-title
          ><span class="text-h5">{{ formTitle }}</span></v-card-title
        >
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row class="custom-row" no-gutters>
                <v-col cols="6">
                  <h5>{{ objectItem.nome_exibicao_faculdade }}</h5>
                </v-col>
                <v-col cols="6">
                  <h5>{{ objectItem.descri_semestre }}</h5>
                </v-col>
              </v-row>
              <v-row class="custom-row">
                <v-col md="6" offset-md="3">
                  <span>Valor mÃ­nimo</span>
                  <money
                    maxlength="10"
                    class="form-control font-weight-bold text-center"
                    style="width: 80%"
                    v-model="objectItem.valor"
                    v-bind="$money"
                  ></money>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="fechar()">Voltar</v-btn>
          <v-btn :disabled="!valid" color="primary" text @click="salvar()"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" persistent max-width="40%">
      <v-card>
        <v-card-title class="text-h5">
          ATENÃ‡ÃƒO!
        </v-card-title>
        <v-card-text class="text-h5">
          Deseja excluir a opÃ§Ã£o de Carteirinha desse semestre? <br />
          <b
            >{{ objectItem.nome_exibicao_faculdade }} -
            {{ objectItem.descri_semestre }}
          </b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialogDelete = false">
            voltar
          </v-btn>
          <v-btn color="primary" text @click="deleteCarteirinha()">
            excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    search: "",
    objectItem: {},
    headersSemestres: [
      { text: "Faculdade", value: "nome_exibicao_faculdade" },
      { text: "Semestre", value: "descri_semestre", align: "left" },
      { text: "valor", value: "valor", align: "center" },
      { text: "img", value: "img", align: "center" },
      { text: "Status", value: "status", align: "center" },

      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    adicionar: false,
    dialog: false,
    dialogDelete: false,
    valid: false,
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getSemestres();
  },

  computed: {
    ...mapState({
      semestres: (state) => state.gerenciarCarteirinha.semestres,
      error: (state) => state.gerenciarCarteirinha.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.adicionar ? "Adicionar" : "Editar";
    },
  },
  methods: {
    ...mapActions([
      "get_faculdade_semestre_carteirinha",
      "delete_carteirinha",
      "editar_carteirinha",
      "criar_carteirinha",
    ]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async getSemestres() {
      this.search = "";
      this.set_loading(true);
      await this.get_faculdade_semestre_carteirinha();
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
    },
    deleteDialog(item) {
      this.objectItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteCarteirinha() {
      this.dialogDelete = false;
      this.set_loading(true);
      await this.delete_carteirinha(this.objectItem);
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.set_snackbar({
          show: true,
          msg: "Registro excluido com sucesso!",
          type: "success",
          time: 5000,
        });
        this.getSemestres();
      }
    },

    editarAdicionar(item) {
      item.usuario = this.$usuario.value.usuario.toUpperCase();
      this.objectItem = Object.assign({}, item);

      if (this.objectItem.valor == null) {
        this.objectItem.valor = 0;
        this.adicionar = true;
      } else {
        this.adicionar = false;
      }
      this.dialog = true;
    },
    async salvar() {
      if (this.$refs.form.validate()) {
        this.set_loading(true);
        if (!this.adicionar) {
          await this.editar_carteirinha(this.objectItem);
        } else {
          await this.criar_carteirinha(this.objectItem);
        }
        this.fechar();
        this.set_loading(false);
        this.getSemestres();

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          this.set_snackbar({
            show: true,
            msg: "Salvo com sucesso!",
            type: "success",
            time: 3000,
          });
        }
      }
    },
    fechar() {
      this.dialog = false;
      this.objectItem = Object.assign({}, this.defaultItem);
    },
  },
};
</script>
