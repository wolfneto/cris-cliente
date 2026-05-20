<template>
  <v-container>
    <Tabs></Tabs>
    <v-card class="mx-auto">
      <v-row justify="center" class="ma-2">
        <v-col cols="8">
          <v-row justify="center" class="ma-2">
            <v-col cols="8">
              <v-card class="ma-6" height="auto">
                <v-row class="ma-2" justify="center" no-gutters>
                  <v-col cols="6">
                    <v-btn
                      color="warning"
                      class="ma-2"
                      large
                      @click="dialogAvisosAcademico = true"
                      ><v-icon class="mr-2">fas fa-bullhorn</v-icon> Avisos
                      Acadêmico</v-btn
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="success"
                      class="ma-2"
                      large
                      @click="gerarRelatorioListas()"
                      ><v-icon class="mr-2">far fa-file-excel</v-icon> Gerar
                      relatorio<br />
                      Listas Online</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row class="ma-2" justify="center" no-gutters>
                  <v-col cols="10">
                    <v-alert
                      v-if="title == 0"
                      dense
                      type="success"
                      prominent
                      text
                      outlined
                    >
                      <h6>
                        SITE ONLINE
                      </h6>
                    </v-alert>
                    <v-alert
                      v-else
                      dense
                      type="warning"
                      text
                      prominent
                      outlined
                    >
                      <h5>
                        SITE EM MANUTENÃ‡ÃƒO
                      </h5>
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row class="ma-2" justify="center" no-gutters>
                  <v-col cols="5">
                    <span
                      ><strong>ÃšLTIMA EDIÃ‡ÃƒO POR:</strong>
                      {{ editado_por }}</span
                    >
                  </v-col>
                  <v-col cols="4">
                    <span
                      ><strong>Em:</strong>
                      {{ $moment_format_sao_paulo(editado_em) }}</span
                    >
                  </v-col>
                </v-row>
                <v-row class="ma-2" justify="center" no-gutters>
                  <v-col cols="10">
                    <v-select
                      class="ma-2"
                      v-model="selectedStatus"
                      :items="[
                        { text: 'ONLINE', value: 0 },
                        { text: 'EM MANUTENÃ‡ÃƒO', value: 1 },
                      ]"
                      label="Site Online ou Em Manutenção"
                      required
                      filled
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="ma-2" justify="center" no-gutters>
                  <v-col cols="10">
                    <v-textarea
                      v-model="messageSite"
                      label="Mensagem"
                      rows="6"
                      row-height="25"
                      filled
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-divider class="mt-n10"></v-divider>
                <v-row justify="center" class="ma-2" no-gutters>
                  <v-btn
                    class="ma-2 mt-n1"
                    depressed
                    color="primary"
                    @click="salvar()"
                  >
                    Salvar
                  </v-btn>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="dialogAvisosAcademico" width="65%">
      <v-card>
        <v-card-title>
          <span class="text-h5">Aviso Geral Dialog Acadêmico</span>
        </v-card-title>
        <v-card-text
          class="mt-n8"
          style="max-height: 1050px; overflow-y: auto;"
        >
          <v-row justify="center" no-gutters>
            <v-col cols="8" class="ma-2">
              <v-row justify="center" no-gutters>
                <v-col cols="6" class="ma-2">
                  <v-toolbar flat dense>
                    <v-btn class="ma-0" @click="execCmd('italic')" small>
                      <v-icon class="ma-0" small>fas fa-italic</v-icon></v-btn
                    >
                    <v-btn class="ma-0" @click="execCmd('bold')" small>
                      <v-icon class="ma-0" small>fas fa-bold</v-icon></v-btn
                    >
                    <v-btn class="ma-0" @click="toggleUppercase" small>
                      <v-icon class="ma-0" small>fas fa-font</v-icon></v-btn
                    >
                    <v-btn class="ma-0" @click="toggleLowercase" small>
                      <b> a</b>
                    </v-btn>
                    <v-btn class="ma-0" @click="toggleColor" small>
                      <v-icon class="ma-0" small style="color: red;"
                        >fas fa-fill-drip</v-icon
                      >
                    </v-btn>
                    <v-btn class="ma-0" @click="execCmd('underline')" small>
                      <v-icon class="ma-0" small
                        >fas fa-underline</v-icon
                      ></v-btn
                    >
                    <v-btn class="ma-0" @click="execCmd('strikeThrough')" small>
                      <v-icon class="ma-0" small
                        >fas fa-strikethrough</v-icon
                      ></v-btn
                    >
                  </v-toolbar>
                </v-col>
              </v-row>
              <v-card class="pa-4" outlined>
                <span>Frase 1</span>
                <div
                  ref="editableDiv1"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[0].msg"
                  style="min-height: 70px; max-height: 70px; height: 70px; overflow-y: auto;"
                ></div>
                <!-- <div class="output">
                      <pre>{{ content1 }}</pre>
                    </div> -->

                <span>Frase 2</span>
                <div
                  ref="editableDiv2"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[1].msg"
                  style="min-height: 70px; max-height: 70px; height: 70px; overflow-y: auto;"
                ></div>
                <!-- <div class="output">
                  <pre>{{ content2 }}</pre>
                </div> -->
                <span>Frase 3</span>
                <div
                  ref="editableDiv3"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[2].msg"
                  style="min-height: 70px; max-height: 70px; height: 70px; overflow-y: auto;"
                ></div>
                <!-- <div class="output">
                  <pre>{{ content3 }}</pre>
                </div> -->
                <!-- <span>Frase 4</span>
                <div
                  ref="editableDiv4"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[3].msg"
                  style="min-height: 70px; max-height: 70px; height: 70px; overflow-y: auto;"
                ></div> -->
                <!-- <div class="output">
                  <pre>{{ content4 }}</pre>
                </div> -->
                <!-- <span>Frase 5</span>
                <div
                  ref="editableDiv5"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[4].msg"
                  style="min-height: 70px; max-height: 70px; height: 70px; overflow-y: auto;"
                ></div> -->
                <!-- <div class="output">
                  <pre>{{ content5 }}</pre>
                </div> -->
                <span>Frase 6</span>
                <div
                  ref="editableDiv6"
                  contenteditable="true"
                  class="editable"
                  @input="updateContent"
                  v-html="avisoGeral[5].msg"
                  style="min-height: 80px; max-height: 80px; height: 80px; overflow-y: auto;"
                ></div>
                <!-- <div class="output">
                  <pre>{{ content6 }}</pre>
                </div> -->
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialogAvisosAcademico = false"
          >
            Voltar
          </v-btn>
          <v-btn color="green darken-1" text @click="salvarAvisoGeral()"
            >Salvar</v-btn
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
import { mapState, mapActions, mapMutations } from "vuex";
import Tabs from "../../../components/academico/TabsGerenciar.vue";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    title: "",
    selectedStatus: "",
    messageSite: "",
    editado_por: "",
    editado_em: "",
    content1: "",
    content2: "",
    content3: "",
    content4: "",
    content5: "",
    content6: "",

    currentColor: "black",
    dialogAvisosAcademico: false,
    typeSnackbar: "",
    timeSnackbar: 0,
    msgSnackbar: "",
    snackbar: false,
    loading: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getManutencao();
    this.getAvisoGeralAcademico();
  },
  computed: {
    ...mapState({
      manutencao: (state) => state.manutencao.manutencao,
      relatorio_listas_online: (state) =>
        state.listas.relatorio_listas_online_site,
      avisoGeral: (state) => state.manutencao.avisoGeralAcademico,
      error: (state) => state.manutencao.error,
    }),
  },
  methods: {
    ...mapActions([
      "get_manutencao",
      "save",
      "gerar_relatorio_listas_online_site",
      "get_aviso_geral_academico",
      "save_aviso_geral_academico",
    ]),
    ...mapMutations(["set_loading", "set_snackbar"]),

    async getAvisoGeralAcademico() {
      this.loading = true;
      await this.get_aviso_geral_academico();
      this.loading = false;

      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
    },

    execCmd(command, value = null) {
      document.execCommand(command, false, value);
      this.updateContent();
    },
    toggleColor() {
      this.currentColor = this.currentColor === "red" ? "black" : "red";
      document.execCommand("foreColor", false, this.currentColor);
      this.updateContent();
    },
    toggleUppercase() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed) return; // No text selected

      // Wrap selected content in a span with uppercase style
      const span = document.createElement("span");
      span.style.textTransform = "uppercase";

      const content = range.extractContents();
      span.appendChild(content);
      range.insertNode(span);

      // Move cursor after inserted span
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      selection.addRange(newRange);

      this.updateContent();
    },
    toggleLowercase() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed) return;

      const span = document.createElement("span");
      span.style.textTransform = "lowercase";

      const content = range.extractContents();
      span.appendChild(content);
      range.insertNode(span);

      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      selection.addRange(newRange);

      this.updateContent();
    },
    updateContent() {
      if (this.$refs.editableDiv1) {
        this.content1 = this.$refs.editableDiv1.innerHTML;
      }
      if (this.$refs.editableDiv2) {
        this.content2 = this.$refs.editableDiv2.innerHTML;
      }
      if (this.$refs.editableDiv3) {
        this.content3 = this.$refs.editableDiv3.innerHTML;
      }
      if (this.$refs.editableDiv4) {
        this.content4 = this.$refs.editableDiv4.innerHTML;
      }
      if (this.$refs.editableDiv5) {
        this.content5 = this.$refs.editableDiv5.innerHTML;
      }
      if (this.$refs.editableDiv6) {
        this.content6 = this.$refs.editableDiv6.innerHTML;
      }
    },
    async salvarAvisoGeral() {
      if (this.content1.trim() === "") {
        this.content1 = this.avisoGeral[0].msg;
      }
      if (this.content2.trim() === "") {
        this.content2 = this.avisoGeral[1].msg;
      }
      if (this.content3.trim() === "") {
        this.content3 = this.avisoGeral[2].msg;
      }
      if (this.content4.trim() === "") {
        this.content4 = this.avisoGeral[3].msg;
      }
      if (this.content5.trim() === "") {
        this.content5 = this.avisoGeral[4].msg;
      }
      if (this.content6.trim() === "") {
        this.content6 = this.avisoGeral[5].msg;
      }
      let array = [
        {
          id: this.avisoGeral[0].id,
          msg: this.content1,
          modal: this.avisoGeral[0].modal,
        },
        {
          id: this.avisoGeral[1].id,
          msg: this.content2,
          modal: this.avisoGeral[1].modal,
        },
        {
          id: this.avisoGeral[2].id,
          msg: this.content3,
          modal: this.avisoGeral[2].modal,
        },
        {
          id: this.avisoGeral[3].id,
          msg: this.content4,
          modal: this.avisoGeral[3].modal,
        },
        {
          id: this.avisoGeral[4].id,
          msg: this.content5,
          modal: this.avisoGeral[4].modal,
        },
        {
          id: this.avisoGeral[5].id,
          msg: this.content6,
          modal: this.avisoGeral[5].modal,
        },
      ];
      this.loading = true;
      await this.save_aviso_geral_academico(array);
      this.loading = false;
      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        this.showSnackbar("Salvo com sucesso!", "success", 5000);
      }
      this.dialogAvisosAcademico = false;
    },
    async getManutencao() {
      this.loading = true;
      await this.get_manutencao();
      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
      this.title = this.manutencao.manutencao;
      this.selectedStatus = this.manutencao.manutencao;
      this.messageSite = this.manutencao.msg_manutencao;
      this.editado_por = this.manutencao.editado_por;
      this.editado_em = this.manutencao.editado_em;
      this.loading = false;
    },
    async salvar() {
      this.loading = true;
      let obj = {
        id: this.manutencao.id,
        manutencao: this.selectedStatus,
        msg_manutencao: this.messageSite,
        usuario: this.$usuario.value.usuario.toUpperCase(),
      };
      await this.save(obj);
      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      } else {
        this.showSnackbar("Salvo com sucesso!", "success", 5000);
      }
      this.getManutencao();
      this.loading = false;
    },
    async gerarRelatorioListas() {
      this.loading = true;
      await this.gerar_relatorio_listas_online_site();
      this.loading = false;

      this.excel();

      if (this.error) {
        this.showSnackbar(
          "Atenção! Ocorreu um erro no servidor!",
          "error",
          5000
        );
      }
    },
    excel() {
      let itens = [];

      for (let item of this.relatorio_listas_online) {
        let obj = {};
        obj.nome_faculdade = item.nome_faculdade;
        obj.nome_semestre = item.nome_semestre;
        obj.id_lista = item.id_lista;
        obj.nome_lista = item.nome_lista;
        obj.valor_total_lista = item.valor_total_lista;
        obj.date_create = item.date_create;

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
      ws["!cols"][2] = { wch: 10 };
      ws["!cols"][3] = { wch: 60 };
      ws["!cols"][4] = { wch: 10 };
      ws["!cols"][4] = { wch: 10 };

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(
        wb,
        ws,
        "relatorio_listas_online_site"
      ); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_listas_online_site.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
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
.editable {
  min-height: 100px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  white-space: pre-wrap;
  overflow-y: auto;
  margin: 10px 0;
  margin-top: -2px;
  margin-left: 10px;
  margin-right: 10px;
}
.output {
  margin-top: -1px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
