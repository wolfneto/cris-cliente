<template>
  <v-container>
    <v-card class="mx-auto mt-2" max-width="auto" height="auto">
      <div class="pa-4">
        <v-row no-gutters>
          <v-col cols="12" md="3">
            <v-btn color="primary" text @click="verBancos()"
              ><v-icon color="primary" class="mr-2">fas fa-eye</v-icon>
              VER BANCOS
            </v-btn>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn color="success" text @click="gerarRelatorioBancos()"
              ><v-icon color="success" class="mr-2">far fa-file-excel</v-icon>
              GERAR RELATORIO EXCEL
            </v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="grey" text @click="limpar()"
              ><v-icon color="grey" class="mr-2">fas fa-retweet</v-icon>
              Limpar
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-row justify="end">
              <v-btn color="warning" class="mr-2" @click="openDialog()">
                Alterar Banco Crédito p/ todos semestres
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="5">
            <v-card class="pa-2" outlined tile style="border-radius: 8px;">
              <v-row no-gutters justify="center" class="custom-row">
                <v-col cols="12" md="12">
                  <v-select
                    v-model="selectAcademico"
                    @change="onChangeAcademico()"
                    :items="[
                      { text: 'ACADEMICO', value: 0 },
                      { text: 'VAREJO', value: 1 },
                    ]"
                    label="Acadêmico ou Varejo"
                    dense
                    filled
                  ></v-select>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" class="custom-row">
                <v-col cols="12" md="12">
                  <v-autocomplete
                    :disabled="selectAcademico === '' || selectAcademico == 1"
                    v-model="selectedFaculdade"
                    :items="faculdades"
                    item-text="nome_exibicao_faculdade"
                    item-value="id_faculdade"
                    label="Faculdade"
                    @change="onChangeFaculdade()"
                    outlined
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" class="custom-row">
                <v-col cols="12" md="12">
                  <v-select
                    :disabled="selectAcademico === '' || selectedFaculdade == 0"
                    v-model="selectedPosGraduacao"
                    @change="onChangeGraduacao()"
                    :items="[
                      { text: 'Graduação', value: 0 },
                      { text: 'Especialização', value: 1 },
                    ]"
                    label="Graduação ou Especialização"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" class="custom-row">
                <v-col cols="12" md="12">
                  <v-select
                    :disabled="
                      selectAcademico === '' || selectedPosGraduacao === ''
                    "
                    @change="onChangeSemestre()"
                    v-model="selectedSemestre"
                    :items="semestres"
                    item-text="descri_semestre"
                    item-value="id_semestre"
                    label="Semestre"
                    return-object
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="8" lg="8">
          <v-card
            v-if="selectedSemestre"
            class="pa-4 ma-4"
            outlined
            tile
            style="border-radius: 8px; background-color: #ECEFF1"
          >
            <v-row justify="center">
              <h5>
                ACADÊMICO
              </h5>
            </v-row>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" sm="8" md="4" lg="4">
                  <v-card
                    class="pa-2 ma-2"
                    outlined
                    tile
                    style="border-radius: 8px;"
                  >
                    <v-card-text class="ma-2">
                      <v-row justify="center">
                        <v-icon x-large color="light-blue darken-1">
                          fab fa-cc-visa
                        </v-icon>
                      </v-row>
                      <br />
                      <v-row justify="center">
                        <h6>
                          Cartão de Crédito
                        </h6>
                      </v-row>
                      <v-row v-for="item of credito" :key="item.id">
                        <v-col cols="12" sm="8" md="10" lg="10">
                          <v-alert
                            v-if="item.name === 'SAFRA'"
                            dense
                            dark
                            color="indigo darken-4"
                            class="text-bold text-center"
                            style="border-radius: 8px;"
                          >
                            {{ item.name }}
                          </v-alert>
                          <v-alert
                            v-if="item.name === 'SANTANDER'"
                            dense
                            dark
                            color="red accent-4"
                            class="text-bold text-center"
                            style="border-radius: 8px;"
                          >
                            {{ item.name }}
                          </v-alert>
                          <v-alert
                            v-if="item.name === 'PAGBANK'"
                            dense
                            dark
                            color="yellow accent-4"
                            class="text-bold text-center text-black"
                            style="border-radius: 8px;"
                          >
                            {{ item.name }}
                          </v-alert>
                        </v-col>

                        <v-col cols="12" sm="8" md="1" lg="1">
                          <div class="ml-n4 mt-n4">
                            <v-checkbox
                              :style="{
                                pointerEvents: item.status ? 'none' : 'auto',
                              }"
                              v-model="item.status"
                              color="primary"
                              @change="checkBancoCredito(item)"
                            ></v-checkbox>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="8" md="4" lg="4">
                  <v-card
                    class="pa-2 ma-2"
                    outlined
                    tile
                    style="border-radius: 8px;"
                  >
                    <v-card-text class="ma-2">
                      <v-row justify="center">
                        <v-icon x-large color="green darken-1"
                          >fas fa-file-invoice-dollar</v-icon
                        >
                      </v-row>
                      <br />
                      <v-row justify="center">
                        <h6>
                          Boleto
                        </h6>
                      </v-row>
                      <v-row v-for="item of boleto" :key="item.id">
                        <v-col cols="12" sm="8" md="10" lg="10">
                          <v-alert
                            v-if="item.name === 'C6'"
                            dense
                            dark
                            color="grey darken-4"
                            class="text-bold text-center"
                            style="border-radius: 8px;"
                          >
                            {{ item.name }}
                          </v-alert>
                          <v-alert
                            v-if="item.name === 'SANTANDER'"
                            dense
                            dark
                            color="red accent-4"
                            class="text-bold text-center"
                            style="border-radius: 8px;"
                          >
                            {{ item.name }}
                          </v-alert>
                        </v-col>
                        <v-col cols="12" sm="8" md="1" lg="1">
                          <div class="ml-n4 mt-n4">
                            <v-checkbox
                              :style="{
                                pointerEvents: item.status ? 'none' : 'auto',
                              }"
                              v-model="item.status"
                              color="primary"
                              @change="checkBancoBoleto(item)"
                            ></v-checkbox>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="8" md="4" lg="4">
                  <v-card
                    class="pa-2 ma-2"
                    outlined
                    tile
                    style="border-radius: 8px;"
                  >
                    <v-card-text class="ma-2">
                      <v-row justify="center">
                        <v-icon x-large color="teal accent-4"
                          >fas fa-qrcode</v-icon
                        >
                      </v-row>
                      <br />
                      <v-row justify="center">
                        <h6>
                          PIX
                        </h6>
                      </v-row>
                      <v-row v-for="item of pix" :key="item.id">
                        <v-col cols="12" sm="8" md="10" lg="10">
                          <v-alert
                            v-if="item.name === 'C6'"
                            dense
                            dark
                            color="grey darken-4"
                            class="text-bold text-center"
                            style="border-radius: 8px;"
                          >
                            C6 BANK
                          </v-alert>
                        </v-col>

                        <v-col cols="12" sm="8" md="1" lg="1">
                          <div class="ml-n4 mt-n4">
                            <v-checkbox
                              :style="{
                                pointerEvents: item.status ? 'none' : 'auto',
                              }"
                              v-model="item.status"
                              color="primary"
                            ></v-checkbox>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="salvarBancos()">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialogRelatorioBancos" width="75%">
      <v-card>
        <v-card-title>
          <span class="text-h5">Relatório Bancos</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Faculdade
                  </th>
                  <th class="text-left">
                    Semestre
                  </th>
                  <th class="text-left">
                    Credito
                  </th>
                  <th class="text-left">
                    Boleto
                  </th>

                  <th class="text-left">
                    Pix
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in allBancosAcademico" :key="item.id">
                  <td>{{ item.nome_exibicao_faculdade }}</td>
                  <td>{{ item.descri_semestre }}</td>
                  <td>{{ item.banco_credito }}</td>
                  <td>{{ item.banco_boleto }}</td>
                  <td>{{ item.banco_pix }}</td>
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
            @click="dialogRelatorioBancos = false"
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogBancoCredito" max-width="700px" persistent>
      <v-card>
        <v-card-title class="headline">
          Alterar Banco Crédito p/ todos semestres?
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" lg="8" md="8">
                <v-select
                  v-model="selectedBancoCredito"
                  :items="[
                    { text: 'SAFRA', iugu: 0, value: 1 },
                    { text: 'PAGBANK', iugu: 1, value: 2 },
                  ]"
                  label="Selecione o Banco"
                  outlined
                  return-object
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogBancoCredito = false">
            Voltar
          </v-btn>
          <v-btn
            color="primary"
            @click="salvarCreditoTodosSemestres()"
            :disabled="!selectedBancoCredito"
          >
            Salvar
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    credito: [
      { id: 0, name: "SAFRA", status: false },
      { id: 1, name: "SANTANDER", status: false },
      { id: 2, name: "PAGBANK", status: false },
    ],
    boleto: [
      { id: 0, name: "C6", status: false },
      { id: 1, name: "SANTANDER", status: false },
    ],
    pix: [{ id: 0, name: "C6", status: false }],

    selectAcademico: "",
    selectedFaculdade: "",
    selectedPosGraduacao: "",
    selectedSemestre: "",
    setBancoCredito: false,
    setBancoBoleto: false,
    setBancoPix: false,
    dialogRelatorioBancos: false,
    dialogBancoCredito: false,
    selectedBancoCredito: "",

    valid: true,
    dialog: false,
    dialogExcluir: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },

  computed: {
    ...mapState({
      faculdades: (state) => state.gerenciarFaculdades.faculdades,
      semestres: (state) => state.gerenciarSemestres.semestres,
      bancoAcademicoPgmto: (state) => state.banco.bancoAcademico,
      allBancosAcademico: (state) => state.banco.relatorioBancosAcademico,

      error: (state) => state.banco.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions([
      "get_faculdades",
      "get_semestres",
      "get_banco",
      "save_banco",
      "get_relatorio_bancos_academico",
      "save_banco_credito_todos_semestres",
    ]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
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
    onChangeAcademico() {
      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
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
    async onChangeSemestre() {
      this.set_loading(true);
      await this.get_banco(this.selectedSemestre.id_semestre);
      this.set_loading(false);

      for (let i of this.credito) {
        if (i.name === this.bancoAcademicoPgmto.banco_credito) {
          i.status = true;
          this.setBancoCredito = i.name;
        }else{
          i.status = false;
        }
      }
      for (let i of this.boleto) {
        if (i.name === this.bancoAcademicoPgmto.banco_boleto) {
          i.status = true;
          this.setBancoBoleto = i.name;
        }else {
          i.status = false;
        }
      }
      for (let i of this.pix) {
        if (i.name === this.bancoAcademicoPgmto.banco_pix) {
          i.status = true;
          this.setBancoPix = i.name;
        }
      }

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
    },
    checkBancoCredito(data) {
      for (let i of this.credito) {
        if (i.id == data.id) {
          i.status = true;
          this.setBancoCredito = data.name;
        } else {
          i.status = false;
        }
      }
    },
    checkBancoBoleto(data) {
      for (let i of this.boleto) {
        if (i.id == data.id) {
          i.status = true;
          this.setBancoBoleto = data.name;
        } else {
          i.status = false;
        }
      }
    },
    checkBancoPix(data) {
      for (let i of this.pix) {
        if (i.id == data.id) {
          i.status = true;
          this.setBancoPix = data.name;
        } else {
          i.status = false;
        }
      }
    },
    async salvarBancos() {
      let iugu = 0;
      if (this.setBancoCredito === "SAFRA") {
        iugu = 0; // SAFRA
      } else if (this.setBancoCredito === "SANTANDER") {
        iugu = 0; // SANTANDER
      } else if (this.setBancoCredito === "PAGBANK") {
        iugu = 1; // PAGBANK
      }

      let obj = {
        id_semestre: this.selectedSemestre.id_semestre,
        banco_credito: this.setBancoCredito,
        banco_boleto: this.setBancoBoleto,
        banco_pix: this.setBancoPix,
        iugu: iugu,
      };
      this.set_loading(true);
      await this.save_banco(obj);
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.onChangeSemestre();

        this.set_snackbar({
          show: true,
          msg: "Banco editado com sucesso!",
          type: "success",
          time: 3000,
        });
      }
    },
    async verBancos() {
      this.set_loading(true);
      await this.get_relatorio_bancos_academico();
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.dialogRelatorioBancos = true;
      }
    },
    async gerarRelatorioBancos() {
      this.set_loading(true);
      await this.get_relatorio_bancos_academico();
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.excel();
      }
    },
    excel() {
      let itens = [];

      for (let item of this.allBancosAcademico) {
        let obj = {};
        obj.nome_faculdade = item.nome_exibicao_faculdade;
        obj.nome_semestre = item.descri_semestre;
        obj.banco_credito = item.banco_credito;
        obj.banco_boleto = item.banco_boleto;
        obj.banco_pix = item.banco_pix;

        itens.push(obj);
      }

      const jsonKeys = Object.keys(itens[0]);
      let objectMaxLength = [];
      for (let i = 0; i < itens.length; i++) {
        let value = itens[i];
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

      var ws = this.$XLSX.utils.json_to_sheet(itens);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 30 };
      ws["!cols"][1] = { wch: 20 };
      ws["!cols"][2] = { wch: 15 };
      ws["!cols"][3] = { wch: 15 };
      ws["!cols"][4] = { wch: 10 };

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(
        wb,
        ws,
        "relatorio_bancos_by_semestre"
      ); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_bancos_by_semestre.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },
    openDialog() {
      this.dialogBancoCredito = true;
    },
    closeDialog() {
      this.selectedBancoCredito = "";
      this.dialogBancoCredito = false;
    },
    async salvarCreditoTodosSemestres() {
      let obj = {
        banco_credito: this.selectedBancoCredito.text,
        iugu: this.selectedBancoCredito.iugu,
      };
      this.set_loading(true);
      await this.save_banco_credito_todos_semestres(obj);
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
          msg: "Banco de Crédito alterado para todos os semestres com sucesso!",
          type: "success",
          time: 3000,
        });
        this.closeDialog();
      }
    },
    limpar() {
      this.selectAcademico = "";
      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
    },
  },
};
</script>
<style></style>
