<template>
  <v-container>
    <v-container>
      <v-row no-gutters justify="center" class="custom-row">
        <v-col cols="12" md="6">
          <v-autocomplete
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
      </v-row>
      <v-row no-gutters justify="center" class="custom-row">
        <v-col cols="12" md="6">
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
      <v-row no-gutters justify="center" class="custom-row">
        <v-col cols="12" md="6">
          <v-select
            :disabled="selectedPosGraduacao === ''"
            @change="onChangeSemestre()"
            v-model="selectedSemestre"
            :items="semestres"
            item-text="descri_semestre"
            item-value="id_semestre"
            label="Semestre"
            return-object
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-card max-width="1500" height="auto" elevation="1">
      <v-container>
        <div class="text-right">
          <v-btn
            :disabled="!selectedSemestre"
            small
            color="primary"
            @click="salvarFrete()"
          >
            <v-icon class="mr-2">fa-save</v-icon> Salvar
          </v-btn>
        </div>
        <v-row no-gutters class="pa-4" justify="space-between">
          <v-col cols="5">
            <v-treeview
              item-disabled="locked"
              dense
              hoverable
              :items="arrayZonas"
              transition
            >
              <template v-slot:prepend="{ item }">
                <v-icon v-if="!item.children"> mdi-account </v-icon>
              </template>

              <template v-slot:label="{ item }">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <b class="ma-4">{{ item.name }}</b>
                  </v-col>
                  <v-col cols="12" md="2">
                    <money
                      v-if="item.hasOwnProperty('multiplicador')"
                      maxlength="10"
                      class="form-control font-weight-bold text-center"
                      v-model="item.multiplicador"
                      v-bind="money"
                    ></money>
                  </v-col>
                  <v-col cols="12" md="2">
                    <div class="mt-2 text-center">
                      <span v-if="item.hasOwnProperty('multiplicador')">
                        <b>R$ {{ item.frete }}</b>
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-checkbox
                      hide-details
                      class="shrink mt-n1 align-end justify-end"
                      v-model="item.status"
                      @change="selectStatus(item)"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </template>
            </v-treeview>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="6">
            <v-row>
              <v-col cols="12" md="12">
                <h6 v-if="totalListasOnline.total != '0,00' && totalListasOnline.total != undefined">
                  Valor total Listas Online
                  <b>R$ {{ totalListasOnline.total }}</b>
                </h6>
                <h6 v-else class="warning--text">Não existem listas online</h6>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="5">
                <h6>Base Frete</h6>
              </v-col>
              <v-col cols="12" md="7">
                <money
                  :disabled="!selectedSemestre"
                  maxlength="10"
                  class="form-control font-weight-bold text-center"
                  style="width: 35%"
                  v-model="baseFreteSemestre"
                  v-bind="money"
                  @change="aplicarBase()"
                  @keyup.native="aplicarBase()"
                ></money>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="5">
                <h6>Frete grátis acima de</h6>
              </v-col>
              <v-col cols="12" md="7">
                <money
                  :disabled="!selectedSemestre"
                  maxlength="10"
                  class="form-control font-weight-bold text-center"
                  style="width: 35%"
                  v-model="valorMinimoFrete"
                  v-bind="money"
                ></money>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

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
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    selectedSemestre: 0,
    baseFreteSemestre: 0,
    valorMinimoFrete: 0,

    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },

    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 3000,
    loading: false,
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },
  computed: {
    ...mapState({
      faculdades: (state) => state.frete.faculdades,
      semestres: (state) => state.frete.semestres,
      zonas: (state) => state.frete.zonas,
      totalListasOnline: (state) => state.frete.total_listas_online,
      error: (state) => state.frete.error,
    }),

    arrayZonas() {
      if (Number.isNaN(this.baseFreteSemestre)) {
        this.baseFreteSemestre = 0;
      }
      this.baseFreteSemestre = parseFloat(this.baseFreteSemestre);
      this.zonas.forEach((a) => {
        if (a.hasOwnProperty("multiplicador")) {
          if (a.multiplicador == 0 || Number.isNaN(a.multiplicador)) {
            a.frete = this.baseFreteSemestre.toFixed(2).replace(".", ",");
            a.multiplicador = 1;
          } else {
            a.frete = parseFloat(a.multiplicador) * this.baseFreteSemestre;
            a.frete = a.frete.toFixed(2).replace(".", ",");
          }
        }
        if (a.hasOwnProperty("children")) {
          a.children.forEach((b) => {
            if (b.multiplicador == 0 || Number.isNaN(b.multiplicador)) {
              b.frete = this.baseFreteSemestre.toFixed(2).replace(".", ",");
              b.multiplicador = 1;
            } else {
              b.frete = parseFloat(b.multiplicador) * this.baseFreteSemestre;
              b.frete = b.frete.toFixed(2).replace(".", ",");
            }
            if (b.hasOwnProperty("children")) {
              b.children.forEach((c) => {
                if (c.multiplicador == 0 || Number.isNaN(c.multiplicador)) {
                  c.frete = this.baseFreteSemestre.toFixed(2).replace(".", ",");
                  c.multiplicador = 1;
                } else {
                  c.frete =
                    parseFloat(c.multiplicador) * this.baseFreteSemestre;
                  c.frete = c.frete.toFixed(2).replace(".", ",");
                }
              });
            }
          });
        }
      });
      return this.zonas;
    },
  },

  methods: {
    ...mapActions([
      "get_faculdades",
      "get_semestres",
      "get_frete",
      "get_total_listas",
      "salvar",
    ]),

    async getFacudades() {
      await this.get_faculdades();
      if (this.error) {
        this.loading = false;
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
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
    async onChangeSemestre() {
      this.baseFreteSemestre = this.selectedSemestre.base_frete;
      this.valorMinimoFrete = this.selectedSemestre.valor_minimo_frete;
      await this.get_frete(this.selectedSemestre.id_semestre);
      await this.get_total_listas(this.selectedSemestre.id_semestre);

      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
    },
    async salvarFrete() {
      this.loading = true;
      let obj = {
        id_semestre: this.selectedSemestre.id_semestre,
        zonas: this.zonas,
        base_frete: parseFloat(this.baseFreteSemestre),
        valor_minimo_frete: parseFloat(this.valorMinimoFrete),
      };
      await this.salvar(obj);
      if (this.error) {
        this.loading = false;
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        this.loading = false;
        this.showSnackbar("Salvo com sucesso!", "success", 5000);
      }
    },
    selectStatus(item) {
      if (item.name == "SP") {
        this.zonas.forEach((a) => {
          if (a.hasOwnProperty("children")) {
            a.children.forEach((b) => {
              if (item.status) {
                b.status = 1;
              } else {
                b.status = 0;
              }
              if (b.hasOwnProperty("children")) {
                b.children.forEach((c) => {
                  if (item.status) {
                    c.status = 1;
                  } else {
                    c.status = 0;
                  }
                });
              }
            });
          }
        });
      }
      if (item.name == "Cidade SP" || item.name == "Grande SP") {
        this.zonas.forEach((a) => {
          if (a.hasOwnProperty("children")) {
            a.children.forEach((b) => {
              if (b.hasOwnProperty("children")) {
                if (item.name == b.name) {
                  b.children.forEach((c) => {
                    if (item.name == b.name && item.status) {
                      c.status = 1;
                    } else {
                      c.status = 0;
                    }
                  });
                }
              }
            });
          }
        });
      }
    },
    async aplicarBase() {
      this.loading = true;
      await this.get_frete(this.selectedSemestre.id_semestre);
      if (this.error) {
        this.loading = false;
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        this.loading = false;
      }
    },

    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
  },
};
</script>
<style scoped>
.signature {
  border: 0;
  border-bottom: 1px solid #000;
}
</style>

      