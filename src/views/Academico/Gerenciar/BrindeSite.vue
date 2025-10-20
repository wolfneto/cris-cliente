<template>
  <v-container>
    <Tabs></Tabs>
    <v-card width="auto">
      <v-container fluid>
        <v-row>
          <v-col cols="8">
            <v-btn color="grey" text @click="reset()"
              ><v-icon color="grey" class="mr-2">fas fa-sync-alt</v-icon>
              Limpar</v-btn
            >
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn color="warning" text @click="gerarRelatorioBrindes()"
              ><v-icon color="warnins" class="mr-2">fas fa-list</v-icon> Ver
              todos Brindes</v-btn
            >
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn color="primary" text @click="dialogAddBrinde()"
              ><v-icon color="blue" class="mr-2">fa-plus</v-icon> Adicionar novo
              Brinde</v-btn
            >
          </v-col>
        </v-row>

        <v-card class="ma-0" max-width="100%" height="100%" elevation="4">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="6">
                <v-autocomplete
                  v-model="selectedBrinde"
                  :items="brindes"
                  label="Selecione o brinde"
                  :item-text="(item) => `${item.codigo} - ${item.descricao}`"
                  item-value="id"
                  solo
                  return-object
                  @change="getBrindeByFaculSem()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <v-btn
                  :disabled="!selectedBrinde"
                  color="success"
                  class="ml-6 mt-2"
                  @click="dialogIncludeBrinde()"
                  >Incluir Brinde ao Semestre<v-icon class="ml-2" color="white">
                    fas fa-file-import</v-icon
                  ></v-btn
                >
              </v-col>
              <v-col cols="3" class="text-right">
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      :disabled="!selectedBrinde.img_path"
                      color="primary"
                      text
                      class="mt-0"
                      @click="showImage(selectedBrinde.img_path)"
                      ><v-icon color="primary" class="mr-2"
                        >fas fa-camera</v-icon
                      >
                      Ver imagem
                    </v-btn>
                  </v-col>
                  <v-col cols="">
                    <v-btn
                      :disabled="!selectedBrinde"
                      color="warning"
                      text
                      class="mt-0"
                      @click="editBrinde(selectedBrinde)"
                      ><v-icon color="warning" class="mr-2">fas fa-edit</v-icon>
                      Editar
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      :disabled="!selectedBrinde"
                      color="error"
                      text
                      class="mt-0"
                      @click="dialogDeleteBrinde()"
                      ><v-icon color="error" class="mr-2">fa-trash-alt</v-icon>
                      excluir
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-n4" no-gutters>
              <v-col cols="7"></v-col>
              <v-col cols="5">
                <v-text-field
                  :disabled="selectedBrinde == 0 ? true : false"
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
                  :headers="headersBrindeSemestres"
                  :items="brindes_by_semestres"
                  :search="search"
                  fixed-header
                  height="500px"
                >
                  <template v-slot:item.nome_exibicao_faculdade="{ item }">
                    <span class="text-uppercase"
                      >{{
                        item.faculdades.nome_exibicao_faculdade.toUpperCase()
                      }}
                    </span>
                    <br />
                  </template>
                  <template v-slot:item.descri_semestre="{ item }">
                    <span class="text-uppercase"
                      >{{ item.semestres.descri_semestre.toUpperCase() }}
                    </span>
                    <br />
                  </template>
                  <template v-slot:item.descricao_status="{ item }">
                    <v-chip
                      v-if="item.descricao_status == 'ATIVO'"
                      color="#B9F6CA"
                      text-color="green"
                      @click="updateStatusBrindeLista(item)"
                      >ATIVO</v-chip
                    >
                    <v-chip
                      v-else
                      color="#FFCDD2"
                      text-color="red"
                      @click="updateStatusBrindeLista(item)"
                      >BLOQUEADO</v-chip
                    >
                  </template>
                  <template v-slot:item.acumula="{ item }">
                    <v-chip
                      v-if="item.acumula == 1"
                      color="blue lighten-4"
                      text-color="blue darken-4"
                      @click="updateAcumulaBrindeLista(item)"
                      >ACUMULA</v-chip
                    >
                    <v-chip
                      v-else
                      color="orange lighten-3"
                      text-color="orange darken-4"
                      @click="updateAcumulaBrindeLista(item)"
                      >NÃO ACUMULA</v-chip
                    >
                  </template>

                  <template v-slot:item.valor="{ item }">
                    <money
                      maxlength="10"
                      class="form-control font-weight-bold text-center"
                      style="height: 75%"
                      v-model="item.valor"
                      v-bind="money"
                      @keydown.native.enter="updateValorBrindeLista(item)"
                    ></money>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" max-width="45%" persistent>
      <v-card class="mx-auto">
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="justify-center text-center">
            <v-col cols="4">
              <v-text-field
                :disabled="objectIndex != -1 ? true : false"
                autofocus
                class="uppercase"
                v-model="findCod"
                @keyup.enter="getItem()"
                @click="$event.target.select()"
                append-icon="fa-search"
                label="Busque por: Código"
                ref="input_buscar"
                filled
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            v-if="objectItem.hasOwnProperty('descricao')"
            class="mt-n4 justify-center text-center"
          >
            <v-col cols="12">
              <v-alert outlined type="success" text>
                <h6>{{ objectItem.codigo }} - {{ objectItem.descricao }}</h6>
              </v-alert>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            v-if="objectItem.hasOwnProperty('descricao') && !inputImg"
          >
            <v-col cols="12">
              <v-text-field
                class="uppercase"
                v-model="objectItem.descricao_site"
                @click="$event.target.select()"
                label="Descrição do Site"
                filled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            v-if="objectItem.hasOwnProperty('descricao') && !inputImg"
          >
            <v-col cols="12">
              <v-textarea
                class="uppercase"
                v-model="objectItem.observacao"
                @click="$event.target.select()"
                clearable
                label="Observações:"
                filled
                rows="4"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row v-if="inputImg" no-gutters class="justify-center text-center">
            <h6 outlined type="warning" text>
              Insira a imagem no campo abaixo
            </h6>
          </v-row>
          <v-row v-if="inputImg" no-gutters>
            <v-col cols="8">
              <!-- :disabled="!inputImg" -->
              <v-file-input
                chips
                class="ml-1"
                v-model="file"
                label="Selecionar imagem"
                accept="image/png, image/jpeg"
                filled
              ></v-file-input>
            </v-col>
            <v-col cols="4">
              <v-btn
                :disabled="!file"
                v-if="inputImg"
                class="ml-4 mt-2"
                color="success"
                @click="uploadImagem(objectItem.codigo, file)"
              >
                Salvar imagem
                <v-icon class="ml-2">fas fa-cloud-upload-alt</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <v-btn color="error" @click="close()">
            Voltar
          </v-btn>
          <div class="flex-grow-1"></div>
          <v-btn
            v-if="objectItem.descricao_site != null && !this.inputImg"
            @click="saveBrinde()"
            color="success"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluirBrinde" persistent max-width="50%">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text>
          <span class="text-h5">Deseja realmente excluir este Brinde? </span
          ><br /><br />
          <span class="text-h5 font-weight-black"
            >{{ objectItem.codigo }} - {{ objectItem.descricao }}</span
          >
        </v-card-text>
        <v-divider class="mt-10"></v-divider>

        <v-card-actions>
          <v-btn color="error" @click="close()">Voltar</v-btn>
          <div class="flex-grow-1"></div>
          <v-btn color="error" @click="deleteBrinde(objectItem)">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogIncluirBrinde" persistent max-width="65%">
      <v-card>
        <v-card-title class="headline">Incluir Brinde a Lista:</v-card-title>
        <v-card-text>
          <v-row class="justify-center text-center">
            <v-col cols="12">
              <span class="text-h5 font-weight-black"
                >{{ objectItem.codigo }} - {{ objectItem.descricao }}</span
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="justify-center text-center">
            <v-col cols="10">
              <v-autocomplete
                v-model="selectedFaculdade"
                :items="faculdades"
                item-text="nome_exibicao_faculdade"
                item-value="id_faculdade"
                label="Selecione a Faculdade:"
                @change="onChange()"
                filled
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="mt-n6 justify-center text-center">
            <v-col cols="10">
              <v-select
                v-model="selectedPosGraduacao"
                :disabled="selectedFaculdade == 0 ? true : false"
                @change="onChangeSelect()"
                :items="[
                  { text: 'Graduação', value: 0 },
                  { text: 'Especialização', value: 1 },
                ]"
                label="Graduação ou Especialização:"
                filled
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-n6 justify-center text-center">
            <v-col cols="10">
              <v-select
                v-model="selectedSemestre"
                :items="semestres"
                item-text="descri_semestre"
                item-value="id_semestre"
                label="Selecione o Semestre:"
                filled
              ></v-select> </v-col
          ></v-row>
          <v-row class="mt-n6 justify-center text-center">
            <v-col cols="3">
              <span>Valor Mínimo p/ Brinde</span>
              <money
                :disabled="selectedSemestre == 0 ? true : false"
                maxlength="10"
                class="form-control font-weight-bold text-center"
                v-model="valorBrinde"
                v-bind="money"
              ></money>
            </v-col>
            <v-col cols="3">
              <!-- <v-select
              :disabled="selectedSemestre == 0 ? true : false"
                v-model="selectedAcumula"
                :items="[
                  { text: 'Não Acumula', value: 0 },
                  { text: 'Acumula', value: 1 },
                ]"
                filled
                label="Brinde Acumula?"
              ></v-select> -->
              <v-checkbox
                v-model="selectedAcumula"
                label="Brinde Acumula?"
                color="info"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>

        <v-card-actions>
          <v-btn color="error" @click="close()">Voltar</v-btn>
          <div class="flex-grow-1"></div>
          <v-btn
            :disabled="valorBrinde == 0 ? true : false"
            @click="saveBrindeLista()"
            color="success"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogImage" max-width="55%">
      <v-card>
        <v-card-title>
          <span class="headline">Imagem do Brinde</span>
        </v-card-title>
        <v-card-text>
          <v-row class="justify-center text-center">
            <img v-bind:src="`${urlImg}`" width="55%" height="55%" />
          </v-row>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <v-btn color="error" @click="showDialogImage = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRelatorioBrindes" width="85%">
      <v-card>
        <v-card-title>
          <span class="text-h5">Relatório Brindes</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense fixed-header height="650px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left" width="350">
                    Faculdade
                  </th>
                  <th class="text-left">
                    Semestre
                  </th>
                  <th class="text-left">
                    Codigo
                  </th>
                  <th class="text-left">
                    Descrição
                  </th>
                  <th class="text-center" width="150">
                    Valor Acima de:
                  </th>
                  <th class="text-center">
                    Status
                  </th>
                  <th class="text-center">
                    Acumula
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in relatorioBrindes" :key="item.id_faculdade">
                  <td>{{ item.nome_exibicao_faculdade }}</td>
                  <td>{{ item.descri_semestre }}</td>
                  <td>{{ item.codigo }}</td>
                  <td>{{ item.descricao_site }}</td>
                  <td>
                    <money
                      maxlength="10"
                      class="form-control font-weight-bold text-center"
                      style="height: 95%"
                      v-model="item.valor"
                      v-bind="money"
                      @keydown.native.enter="updateValorBrindeLista(item)"
                    ></money>
                  </td>
                  <td>
                    <v-btn
                      v-if="item.descricao_status == 'ATIVO'"
                      class="text-success font-weight-bold"
                      @click="updateStatusBrindeLista(item)"
                      text
                      >{{ item.descricao_status }}</v-btn
                    >
                    <v-btn
                      v-else
                      class="text-red font-weight-bold"
                      @click="updateStatusBrindeLista(item)"
                      text
                      >{{ item.descricao_status }}</v-btn
                    >
                  </td>

                  <td>
                    <v-btn
                      v-if="item.acumula == 1"
                      class="text-primary font-weight-bold"
                      @click="updateAcumulaBrindeLista(item)"
                      text
                      >ACUMULA</v-btn
                    >
                    <v-btn
                      v-else
                      class="text-red font-weight-bold"
                      @click="updateAcumulaBrindeLista(item)"
                      text
                      >NÃO ACUMULA</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialogRelatorioBrindes = false"
          >
            Voltar
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
    search: "",
    findCod: "",
    objectIndex: -1,
    objectItem: {},
    selectedBrinde: "",
    dialog: false,
    dialogExcluirBrinde: false,
    dialogIncluirBrinde: false,
    dialogRelatorioBrindes: false,
    selectedFaculdade: "",
    selectedPosGraduacao: "",
    selectedSemestre: "",
    selectedAcumula: true,
    valorBrinde: "",
    inputImg: false,
    file: null,
    showDialogImage: false,
    urlImg: "",
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    headersBrindeSemestres: [
      {
        text: "Faculdade",
        value: "faculdades.nome_exibicao_faculdade",
        width: 300,
      },
      { text: "Semestre", value: "semestres.descri_semestre", width: 300 },
      {
        text: "Status",
        value: "descricao_status",
        align: "center",
        width: 200,
      },
      {
        text: "Brinde Acumula",
        value: "acumula",
        align: "center",
        width: 200,
      },
      {
        text: "Valor Minimo Brinde",
        value: "valor",
        align: "center",
        width: 120,
      },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.reset();
    this.getBrindes();
    this.getFacudades();
  },

  computed: {
    ...mapState({
      relatorioBrindes: (state) =>
        state.gerenciarBrindeSite.relatorio_brindes_site,
      brindes: (state) => state.gerenciarBrindeSite.brindes_site,
      faculdades: (state) => state.gerenciarFaculdades.faculdades,
      semestres: (state) => state.gerenciarSemestres.semestres,
      brindes_by_semestres: (state) =>
        state.gerenciarBrindeSite.brinde_facul_sem,
      retorno: (state) => state.gerenciarBrindeSite.retorno,
      error: (state) => state.gerenciarBrindeSite.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Brinde" : "Editar Brinde";
    },
  },
  methods: {
    ...mapActions([
      "get_relatorio_brindes_site",
      "get_brindes_site",
      "get_faculdades",
      "get_semestres",
      "create_brinde_site",
      "update_brinde_site",
      "delete_brinde_site",
      "save_brinde_lista",
      "get_brinde_by_facul_sem",
      "update_valor_brinde_lista",
      "update_status_brinde_lista",
      "update_acumula_brinde_lista",
      "saveBrindeImage",
    ]),
    ...mapMutations([
      "clean_faculdade",
      "clean_semestre",
      "clean_brindes_by_semestres",
      "set_snackbar",
      "set_loading",
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },

    async getBrindes() {
      this.set_loading(true);
      await this.get_brindes_site();
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
    async gerarRelatorioBrindes() {
      this.set_loading(true);
      await this.get_relatorio_brindes_site();
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.dialogRelatorioBrindes = true;
      }
    },
    dialogAddBrinde() {
      this.objectIndex = -1;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.dialogExcluirBrinde = false;
      this.dialogIncluirBrinde = false;
      this.findCod = "";
      this.objectItem = Object.assign({}, this.defaultItem);
      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.valorBrinde = "";
      this.file = null;
      this.inputImg = false;
      this.onChange();
    },
    async getItem() {
      this.inputImg = false;
      this.set_loading(true);
      this.$axios
        .get("/produto/getByCod", {
          params: {
            cod: this.findCod,
          },
        })
        .then((res) => {
          this.set_loading(false);
          if (res.data == false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador!",
              type: "error",
            });
          } else if (res.data == null) {
            this.objectItem = Object.assign({}, this.defaultItem);

            this.set_snackbar({
              show: true,
              msg: "Item Não Encontrado!",
              type: "warning",
            });
          } else {
            // this.inputImg = true;
            this.objectItem = res.data;
          }
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
          this.set_snackbar({
            show: true,
            msg: "Salvo com sucesso!",
            type: "success",
            time: 3000,
          });
        });
    },
    async saveBrinde() {
      if (this.objectItem.observacao != null || this.objectItem.observacao) {
        this.objectItem.observacao = this.objectItem.observacao.toUpperCase();
      }

      if (this.objectIndex != -1) {
        // edita
        let dados = {
          id: this.objectItem.id,
          descricao_site: this.objectItem.descricao_site.toUpperCase(),
          observacao: this.objectItem.observacao,
        };
        this.set_loading(true);
        await this.update_brinde_site(dados);
        this.set_loading(false);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          // this.dialog = false;
          // this.objectItem = Object.assign({}, this.defaultItem);
          await this.get_brindes_site();

          for (const i of this.brindes) {
            if (i.id == this.selectedBrinde.id) {
              this.selectedBrinde = i;
            }
          }
          this.inputImg = true;
          this.set_snackbar({
            show: true,
            msg: "BRINDE EDITADO COM SUCESSO!",
            type: "success",
            time: 3000,
          });
        }
      } else {
        // salva
        let dados = {
          codigo: this.objectItem.codigo,
          descricao: this.objectItem.descricao,
          descricao_site: this.objectItem.descricao_site.toUpperCase(),
          observacao: this.objectItem.observacao,
          usuario: this.$usuario.value.usuario.toUpperCase(),
        };
        this.set_loading(true);
        await this.create_brinde_site(dados);
        this.set_loading(false);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else if (this.retorno == false) {
          this.set_snackbar({
            show: true,
            msg: "O CODIGO PARA O BRINDE INFORMADO JÁ ESTA CADASTRADO!",
            type: "warning",
            time: 5000,
          });
        } else {
          this.inputImg = true;
          // this.close();
          // this.getBrindes();

          // this.set_snackbar({
          //   show: true,
          //   msg: "SALVO COM SUCESSO!",
          //   type: "success",
          //   time: 3000,
          // });
        }
      }
    },
    dialogDeleteBrinde() {
      this.objectItem = Object.assign({}, this.selectedBrinde);
      this.dialogExcluirBrinde = true;
    },
    async deleteBrinde() {
      this.dialogExcluirBrinde = false;
      this.set_loading(true);
      this.objectItem.usuario = this.$usuario.value.usuario.toUpperCase();
      await this.delete_brinde_site(this.objectItem);
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
          msg: "Brinde excluído com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.selectedBrinde = "";
      this.objectItem = Object.assign({}, this.defaultItem);
      this.getBrindes();
      this.clean_brindes_by_semestres();
    },
    dialogIncludeBrinde() {
      this.objectItem = Object.assign({}, this.selectedBrinde);
      this.dialogIncluirBrinde = true;
    },
    async getFacudades() {
      if (this.faculdades.length === 0) {
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
      }
    },
    async getSemestres() {
      let obj = {
        faculdade: this.selectedFaculdade,
        graduacao: this.selectedPosGraduacao,
      };
      this.set_loading(true);
      await this.get_semestres(obj);
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
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.clean_semestre();
    },
    async onChangeSelect() {
      this.selectedSemestre = "";
      this.clean_semestre();
      this.getSemestres();
    },
    async saveBrindeLista() {
      this.set_loading(true);

      let obj = {
        id_faculdade: this.selectedFaculdade,
        id_semestre: this.selectedSemestre,
        codigo: this.objectItem.codigo,
        status: 1,
        valor: this.valorBrinde,
        acumula: this.selectedAcumula,
        criado_por: this.$usuario.value.usuario.toUpperCase(),
      };

      await this.save_brinde_lista(obj);
      this.set_loading(false);

      if (this.error) {
        this.close();

        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else if (this.retorno == false) {
        this.set_snackbar({
          show: true,
          msg: "ESTE BRINDE JA FOI CADASTRADO PARA ESTA FACULDADE E SEMESTRE!",
          type: "warning",
          time: 5000,
        });
      } else {
        this.close();
        this.getBrindeByFaculSem();
        this.set_snackbar({
          show: true,
          msg: "SALVO COM SUCESSO!",
          type: "success",
          time: 3000,
        });
      }
    },
    async getBrindeByFaculSem() {
      this.set_loading(true);
      await this.get_brinde_by_facul_sem(this.selectedBrinde.codigo);
      this.set_loading(false);
      console.log("opa", this.brindes_by_semestres);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
    },
    async updateValorBrindeLista(item) {
      item.usuario = this.$usuario.value.usuario.toUpperCase();

      if (item.valor == 0) {
        this.set_snackbar({
          show: true,
          msg: "ATENÇÃO! O VALOR MÍNIMO DO BRINDE NÃO PODE SER VAZIO.",
          type: "warning",
        });
      } else {
        this.set_loading(true);
        await this.update_valor_brinde_lista(item);
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
            msg: "VALOR MINIMO EDITADO COM SUCESSO!",
            type: "success",
            time: 3000,
          });
        }
        this.getBrindeByFaculSem();
        if (this.dialogRelatorioBrindes) {
          this.gerarRelatorioBrindes();
        }
      }
    },
    async updateStatusBrindeLista(item) {
      item.usuario = this.$usuario.value.usuario.toUpperCase();
      this.set_loading(true);
      await this.update_status_brinde_lista(item);
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
          msg: "STATUS SALVO COM SUCESSO!",
          type: "success",
          time: 3000,
        });
      }
      this.getBrindeByFaculSem();
      if (this.dialogRelatorioBrindes) {
        this.gerarRelatorioBrindes();
      }
    },
    async updateAcumulaBrindeLista(item) {
      item.usuario = this.$usuario.value.usuario.toUpperCase();
      this.set_loading(true);
      await this.update_acumula_brinde_lista(item);
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
          msg: "STATUS SALVO COM SUCESSO!",
          type: "success",
          time: 3000,
        });
      }
      this.getBrindeByFaculSem();
      if (this.dialogRelatorioBrindes) {
        this.gerarRelatorioBrindes();
      }
    },
    reset() {
      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      (this.selectedBrinde = ""),
        (this.objectItem = Object.assign({}, this.defaultItem));
      this.search = "";
      this.clean_faculdade();
      this.clean_semestre();
      this.clean_brindes_by_semestres();
      this.getBrindes();
      this.getFacudades();
    },
    editBrinde(item) {
      this.objectIndex = this.brindes.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialog = true;
    },
    async uploadImagem(codigo, file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const myRenamedFile = new File([file], codigo + ".png");
        const formData = new FormData();
        formData.append("file", myRenamedFile);

        await this.saveBrindeImage(formData);

        if (this.error != false) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
          });
        } else {
          this.file = null;
          this.inputImg = false;
          this.objectItem = Object.assign({}, this.defaultItem);
          this.close();
          this.getBrindes();
          this.set_snackbar({
            show: true,
            msg: "IMAGEM INSERIDA COM SUCESSO!",
            type: "success",
            time: 5000,
          });
        }
      } else {
        this.file = null;
        this.set_snackbar({
          show: true,
          msg: "SOMENTE IMAGENS JPEG OU PNG!",
          type: "warning",
          time: 5000,
        });
      }
    },
    showImage(img) {
      this.urlImg = this.getUrl(img);
      this.showDialogImage = true;
    },
    getUrl(img) {
      return require("@/assets/produtos/" + img);
    },
  },
};
</script>
