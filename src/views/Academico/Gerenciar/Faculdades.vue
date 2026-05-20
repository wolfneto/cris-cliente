<template>
  <v-container>
    <Tabs></Tabs>
    <v-card class="ma-0" max-width="100%" height="100%" elevation="4">
      <v-card-title>
        Faculdades
        <v-spacer></v-spacer>
        <v-text-field
          class="uppercase"
          append-icon="fa-search"
          v-model="search"
          label="Buscar"
          hide-details
          clearable
          dense
          filled
          rounded
          @click="$event.target.select()"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = true" text
          ><v-icon color="blue" class="mr-2">fa-plus</v-icon> Faculdade</v-btn
        >
      </v-card-title>
      <v-data-table
        hide-default-footer
        :items-per-page="-1"
        :headers="headers"
        :items="faculdades"
        :search="search"
        height="600px"
      >
        <template v-slot:item.nome_exibicao_faculdade="{ item }">
          <span class="text-uppercase"
            ><b>{{ item.nome_exibicao_faculdade }}</b>
          </span>
          <br />
          <span class="caption"> {{ item.sigla }} </span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status == 1"
            @click="updateStatus(item)"
            color="#B9F6CA"
            text-color="green"
            >ATIVO</v-chip
          >
          <v-chip
            v-else
            @click="updateStatus(item)"
            color="#FFCDD2"
            text-color="red"
            >BLOQUEADO</v-chip
          >
        </template>
        <template v-slot:item.situacao_faculdade="{ item }">
          <v-chip
            v-if="item.situacao_faculdade == 1"
            @click="updateSituacao(item)"
            color="#B9F6CA"
            text-color="green"
            >VISÍVEL</v-chip
          >
          <v-chip
            v-else
            @click="updateSituacao(item)"
            color="#FFCDD2"
            text-color="red"
            >INVISÍVEL</v-chip
          >
        </template>
        <template v-slot:item.grupo="{ item }">
          {{ item.grupo_faculdade }}
          <v-chip v-if="item.grupo == 0">{{ item.grupo }}</v-chip>
          <v-chip v-else dark>{{ item.grupo }}</v-chip>
        </template>
        <template v-slot:item.acao="{ item }">
          <v-icon color="primary" class="mr-2" @click="editFaculdade(item)"
            >fa-edit</v-icon
          >
          <v-icon
            :disabled="permissoes.btn_excluir_faculdade != 1"
            color="error"
            @click="deleteDialog(item)"
            >fa-trash-alt</v-icon
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      v-model="dialog"
      max-width="1200px"
      style="overflow-y: hidden"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.nome_faculdade"
                    label="Nome"
                    hint="Por examplo, anhanguerasantana"
                    dense
                    clearable
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n6">
                  <v-text-field
                    required
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.nome_exibicao_faculdade"
                    label="Nome de Exibição"
                    hint="Por examplo, Anhanguera Santana"
                    dense
                    clearable
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n6">
                  <v-text-field
                    required
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.sigla"
                    label="Sigla Faculdade"
                    hint="USP, FMU e etc."
                    dense
                    clearable
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n6">
                  <v-textarea
                    :rows="4"
                    no-resize
                    label="Mensagem"
                    v-model="objectItem.mensagem"
                    clearable
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row class="mt-n10">
                <v-col cols="12" md="2">
                  <v-radio-group
                    label="Status"
                    v-model="objectItem.status"
                    mandatory
                  >
                    <v-radio label="Ativo" value="1"></v-radio>
                    <v-radio label="Bloqueado" value="0"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="2"> 
                  <v-radio-group
                    label="Situação"
                    v-model="objectItem.situacao_faculdade"
                    mandatory
                  >
                    <v-radio label="Visivel" value="1"></v-radio>
                    <v-radio label="Invisível" value="0"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="mt-4">
                    <span class="body-1 ml-2">Grupo</span>
                    <v-select
                      class="ma-0 mt-4"
                      v-model="objectItem.grupo"
                      :items="grupos"
                      item-text="grupo"
                      item-value="value"
                      label="Tipo do grupo"
                      dense
                      outlined
                    ></v-select>
                  </div>
                </v-col>
                <v-col cols="12" md="5">
                  <div class="mt-4">
                    <v-alert border="left" dense text type="info">
                      Ao selecionar o tipo de grupo, este é o formato que
                      aparecerá no pedido.<br />
                      Tipo 0 - Ex: <b>1N - Brasil</b><br />
                      Tipo 1 - Ex: <b>Turma 125 - USP</b>
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider class="mt-n10"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="fechar()">Voltar</v-btn>
          <v-btn color="success" text @click="salvar()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluir" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text
          ><span class="text-h5">Deseja realmente excluir esta faculdade?</span
          ><br /><br />
          <span class="text-h5 font-weight-black">{{
            objectItem.nome_exibicao_faculdade
          }}</span>
        </v-card-text>

        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="deleteFaculdade(objectItem)"
            >Excluir</v-btn
          >
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
    grupos: [
      { grupo: "Tipo 0", value: 0 },
      { grupo: "Tipo 1", value: 1 },
    ],
    dialogExcluir: false,
    search: "",
    headers: [
      { text: "ID", value: "id_faculdade" },
      { text: "Nome", value: "nome_exibicao_faculdade" },
      { text: "Status", value: "status", align: "center" },
      { text: "Situação", value: "situacao_faculdade", align: "center" },
      { text: "Grupo", value: "grupo", sortable: false },
      { text: "Mensagem", value: "mensagem", sortable: false },
      { text: "Imagem", value: "imagem_path", sortable: false },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    dialog: false,
    objectIndex: -1,
    objectItem: {
      nome_faculdade: "",
      nome_exibicao_faculdade: "",
      sigla: "",
      mensagem: "",
      status: "0",
      situacao_faculdade: "0",
      grupo: 0,
    },
    valid: true,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
    this.getFacudades();
  },
  computed: {
    ...mapState({
      faculdades: (state) => state.gerenciarFaculdades.faculdades,
      error: (state) => state.gerenciarFaculdades.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1
        ? "Adicionar Faculdade"
        : "Editar Faculdade";
    },
  },
  methods: {
    ...mapActions([
      "get_faculdades",
      "create_faculdade",
      "update_faculdade",
      "update_status",
      "update_situacao",
      "delete_faculdade",
    ]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign(
        {},
        {
          nome_faculdade: "",
          nome_exibicao_faculdade: "",
          sigla: "",
          mensagem: "",
          status: "0",
          situacao_faculdade: "0",
          grupo: 0,
        }
      );
    },
    async salvar() {
      if (this.$refs.form.validate()) {
        if (this.objectIndex > -1) {
          this.set_loading(true);
          await this.update_faculdade(this.objectItem);
          this.set_loading(false);
          this.fechar();
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
              msg: "Faculdade editada com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } else {
          this.set_loading(true);
          await this.create_faculdade(this.objectItem);
          this.set_loading(false);
          this.fechar();
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
              msg: "Faculdade criada com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        }
        this.getFacudades();
      }
    },
    editFaculdade(item) {
      this.objectIndex = this.faculdades.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.faculdades.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    async deleteFaculdade() {
      console.log(this.$usuario.value.usuario.toUpperCase());
      // this.dialogExcluir = false;
      // this.set_loading(true);
      // await this.delete_faculdade(this.objectItem);
      // this.set_loading(false);

      // if (this.error) {
      //   this.set_snackbar({
      //     show: true,
      //     msg: "Erro no Servidor, Contate o Administrador",
      //     type: "error",
      //     time: 0,
      //   });
      // } else {
      //   this.set_snackbar({
      //     show: true,
      //     msg: "Faculdade excluida com sucesso!",
      //     type: "success",
      //     time: 3000,
      //   });
      // }
      //   this.getFacudades();
    },
    async getFacudades() {
      this.set_loading(true);
      await this.get_faculdades();
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
    async updateStatus(item) {
      this.set_loading(true);
      await this.update_status(item);
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
          msg: "Status editado com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getFacudades();
    },
    async updateSituacao(item) {
      this.set_loading(true);
      await this.update_situacao(item);
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
          msg: "Situação editada com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getFacudades();
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "gerenciar_site",
          },
        })
        .then((res) => {
          this.permissoes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped></style>
