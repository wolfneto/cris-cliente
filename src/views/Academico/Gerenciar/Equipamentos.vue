<template>
  <v-container>
    <Tabs></Tabs>
    <v-card width="auto">
      <v-container fluid>
        <div class="ma-2 text-right">
          <v-btn color="primary" text @click="adicionarEquipamento()"
            ><v-icon color="blue" class="mr-2">fa-plus</v-icon> Adicionar</v-btn
          >
        </div>
        <v-card class="ma-0" max-width="100%" height="100%" elevation="4">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" sm="11" md="11" lg="11">
                <v-select
                  v-model="selectedEquipamento"
                  :items="equipamentos"
                  label="Selecione Equipamento"
                  item-text="descricao"
                  item-value="id"
                  filled
                  return-object
                  dense
                  @change="getSemestres"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="1" md="1" lg="1" class="text-right">
                <v-btn
                  :disabled="!selectedEquipamento"
                  color="primary"
                  text
                  class="mt-4"
                  @click="editarAdicionar()"
                  ><v-icon color="blue" class="mr-2">fas fa-eye</v-icon> Ver
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6"></v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-text-field
                :disabled="selectedEquipamento == 0 ? true : false"
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
                  height="500px"
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
                  <template v-slot:item.status_online="{ item }">
                    <v-chip
                      v-if="item.status_online == 1"
                      color="#B9F6CA"
                      text-color="green"
                      small
                      >ATIVO</v-chip
                    >
                    <v-chip
                      v-else
                      color="#FFCDD2"
                      text-color="red"
                      small
                      @click="setEquipamentoOnline(item)"
                      >INATIVO</v-chip
                    >
                  </template>

                  <template v-slot:item.acao="{ item }">
                    <v-icon
                      :disabled="!item.status_online"
                      color="error"
                      small
                      @click="deleteEquipamentoOnline(item)"
                      >fa-trash-alt</v-icon
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" persistent width="90%">
      <v-card>
        <v-card-title
          ><span class="text-h5">{{ formTitle }}</span></v-card-title
        >
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row class="custom-row">
                <v-row class="custom-row">
                  <v-col cols="12">
                    <v-text-field
                      :rules="[(v) => !!v || 'Campo Obrigatório']"
                      v-model="objectItem.descricao"
                      label="Descrição"
                      class="uppercase"
                      solo
                      @keyup="check()"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-row>
              <v-row class="mt-10">
                <v-col cols="12">
                  <v-data-table
                    :headers="headersTiposEquipamentos"
                    :items="tiposEquipamentos"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:item.codigo="{ item }">
                      <v-text-field
                        @keyup.13="getProduto($event.target.value, item)"
                        placeholder="Codigo"
                        v-model="item.codigo"
                        class="uppercase mt-6"
                        solo
                      ></v-text-field>
                    </template>
                    <template v-slot:item.imagem="{ item }">
                      <v-row no-gutters>
                        <v-col cols="12" md="2">
                          <v-btn
                            :disabled="!item.imagem"
                            class="ma-0 ml-4"
                            color="primary"
                            icon
                            large
                            @click="showImage($event, item.imagem)"
                          >
                            <v-icon dark>fas fa-camera</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:item.valor="{ item }">
                      <money
                        type="text"
                        v-model="item.valor"
                        v-bind="$money"
                      ></money>
                    </template>
                    <template v-slot:item.qtd_disponivel="{ item }">
                      <v-text-field
                        v-model="item.qtd_disponivel"
                        type="number"
                        class="mt-6"
                        solo
                      ></v-text-field>
                    </template>
                    <template v-slot:item.acao="{ item }">
                      <v-icon
                        color="primary"
                        small
                        class="mr-2"
                        @click="addLinha()"
                        >fa-plus</v-icon
                      >
                      <v-icon color="error" small @click="deleteLinha(item)"
                        >fa-trash-alt</v-icon
                      >
                    </template>
                  </v-data-table>
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
    search: "",
    objectIndex: -1,
    objectItem: {},
    headersTiposEquipamentos: [
      { text: "Código", value: "codigo", width: 200 },
      { text: "Saldo", value: "saldo" },
      { text: "Descrição", value: "descricao" },
      { text: "Imagem", value: "imagem", width: 150 },
      { text: "Valor", value: "valor" },
      { text: "Qtd Disponível", value: "qtd_disponivel", width: 150 },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    headersSemestres: [
      { text: "Faculdade", value: "nome_exibicao_faculdade" },
      { text: "Semestre", value: "descri_semestre", align: "left" },
      { text: "Status", value: "status_online", align: "center" },

      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    tiposEquipamentos: [],
    selectedEquipamento: "",
    adicionar: false,
    dialog: false,
    valid: false,
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getEquipamentos();
  },

  computed: {
    ...mapState({
      equipamentos: (state) => state.gerenciarEquipamentos.equipamentos,
      produto: (state) => state.gerenciarEquipamentos.produto,
      semestres: (state) => state.gerenciarEquipamentos.semestres,
      error: (state) => state.gerenciarEquipamentos.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar" : "Editar";
    },
  },
  methods: {
    ...mapActions([
      "set_equipamento_online",
      "get_equipamentos",
      "get_produto",
      "get_faculdade_semestre",
      "editar_equipamento",
      "adicionar_equipamento",
      "delete_equipamento_online",
    ]),
    ...mapMutations(["set_snackbar", "set_loading", "clean_semestres"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async setEquipamentoOnline(item) {
      let obj = {
        equipamento: this.selectedEquipamento,
        id_faculdade: item.id_faculdade,
        id_semestre: item.id_semestre,
      };
      this.set_loading(true);
      await this.set_equipamento_online(obj);
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
      this.getSemestres();
    },
    async deleteEquipamentoOnline(item) {
      this.set_loading(true);
      await this.delete_equipamento_online(item);
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.getSemestres();
      }
    },
    async getEquipamentos() {
      this.clean_semestres();
      this.set_loading(true);
      await this.get_equipamentos();
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
    adicionarEquipamento() {
      this.tiposEquipamentos = [];
      this.adicionar = true;
      this.tiposEquipamentos.push({
        id: "",
        codigo: "",
        descricao: "",
        imagem: null,
        valor: 0,
        saldo: "",
        qtd_disponivel: 0,
      });
      this.editarAdicionar();
    },
    editarAdicionar() {
      this.objectIndex = this.equipamentos.indexOf(this.selectedEquipamento);
      this.objectItem = Object.assign({}, this.selectedEquipamento);
      if (!this.adicionar) {
        this.tiposEquipamentos = this.objectItem.tipos_equipamentos;
      }
      this.adicionar = false;
      this.dialog = true;
    },
    addLinha() {
      let item = {
        id: this.tiposEquipamentos.length,
        id_equipamento: this.objectItem.id,
        codigo: "",
        qtd: 1,
        descricao: "",
        imagem: null,
        valor: 0,
        saldo: 0,
        qtd_disponivel: 0,
      };
      this.tiposEquipamentos.push(item);
    },
    deleteLinha(item) {
      if (item.id != 0) {
        this.tiposEquipamentos = this.tiposEquipamentos.filter(function (
          element
        ) {
          return element.id != item.id;
        });
        for (let i = 0; i < this.tiposEquipamentos.length; i++) {
          this.$set(this.tiposEquipamentos[i], "id", i);
        }
      }
    },
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign({}, this.defaultItem);
      this.tiposEquipamentos = [];
    },
    async getProduto(value, item) {
      if (value) {
        this.set_loading(true);
        await this.get_produto(value);
        this.set_loading(false);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          if (Object.keys(this.produto).length == 0) {
            item.descricao = "";
            item.valor = "";
            item.saldo = "";
            item.imagem = null;
            item.qtd_disponivel = 0;

            this.set_snackbar({
              show: true,
              msg: "Codigo informado não existe!",
              type: "warning",
              time: 3000,
            });
          } else {
            item.codigo = this.produto.codigo.toUpperCase();
            item.descricao = this.produto.descricao;
            item.imagem = this.produto.image_path;
            item.valor = this.produto.valor;
            item.saldo = this.produto.saldo;
            item.qtd_disponivel = 0;
          }
        }
      }
    },
    async getSemestres() {
      this.search = "";
      this.set_loading(true);
      await this.get_faculdade_semestre(this.selectedEquipamento.id);
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
    check() {
      this.objectItem.descricao = this.objectItem.descricao
        .trim()
        .toUpperCase();
    },
    async salvar() {
      if (this.$refs.form.validate()) {
        if (!this.tiposEquipamentos.length) {
          this.fechar();
          this.set_snackbar({
            show: true,
            msg: "Os tipos equipamentos não pode ser vazio!",
            type: "warning",
            time: 3000,
          });
        } else {
          this.set_loading(true);
          if (this.objectIndex > -1) {
            this.objectItem.tipos_equipamentos = this.tiposEquipamentos;
            await this.editar_equipamento(this.objectItem);
          } else {
            let data = {
              descricao: this.objectItem.descricao,
              tipos_equipamentos: this.tiposEquipamentos,
            };
            await this.adicionar_equipamento(data);
          }
          this.fechar();
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
              msg: "Salvo com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        }
      }
      this.getEquipamentos();
    },
  },
};
</script>

