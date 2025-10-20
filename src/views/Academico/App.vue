<template>
  <v-container>
    <NotificacoesEnviadas
      v-if="showNotificacoesEnviadas"
    ></NotificacoesEnviadas>
    <div v-else>
      <v-card class="mb-2">
        <v-card-title>
          Buscar Alunos
          <div class="flex-grow-1"></div>
          <v-btn
            small
            color="primary"
            @click="
              showNotificacoesEnviadas = true;
              get_enviadas();
            "
            >Notificações Enviadas</v-btn
          >
        </v-card-title>
        <v-row justify="center">
          <v-col cols="2">
            <v-checkbox
              @change="checks()"
              v-model="checkFaculdade"
              label="Todas Faculdades"
            ></v-checkbox>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              :disabled="checkFaculdade ? true : false"
              v-model="selectedFaculdade"
              @change="getSemestres()"
              :items="faculdades"
              item-text="nome_exibicao_faculdade"
              return-object
              label="Faculdades"
              auto-select-first
            ></v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-checkbox
              @change="checks()"
              v-model="checkSemestre"
              label="Todos Semestres"
            ></v-checkbox>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              :disabled="checkSemestre ? true : false"
              v-model="selectedSemestre"
              @change="getPeriodos()"
              :items="semestres"
              item-text="descri_semestre"
              return-object
              label="Semestres"
              auto-select-first
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="2">
            <v-checkbox
              @change="checks()"
              v-model="checkPeriodo"
              label="Todos Periodos"
            ></v-checkbox>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              :disabled="checkPeriodo ? true : false"
              v-model="selectedPeriodo"
              @change="getRepresentantes()"
              :items="periodos"
              item-text="nome_periodo"
              return-object
              label="Periodos"
              auto-select-first
            ></v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-checkbox
              @change="checks()"
              v-model="checkRepresentante"
              label="Todos Representantes"
            ></v-checkbox>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              :disabled="checkRepresentante ? true : false"
              v-model="selectedRepresentante"
              :items="representantes"
              item-text="nome_representante"
              return-object
              label="Representantes"
              auto-select-first
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-btn @click="getAlunos()" class="mb-2" color="primary" dark>
            Buscar
            <v-icon right dark>fas fa-search</v-icon>
          </v-btn>
        </v-row>
      </v-card>
      <v-card v-if="alunos.length > 0">
        <v-card-title>
          <span v-if="filter == 1">
            Alunos
            <span class="primary--text">Com App</span> Acadêmico
          </span>
          <span v-else-if="filter == 0">
            Alunos
            <span class="warning--text">Sem App</span> Acadêmico
          </span>

          <div class="flex-grow-1"></div>
          <v-text-field
            class="uppercase"
            v-model="search"
            v-on:keyup="find(search)"
            append-icon="fa-search"
            label="Busque por: Nome, CPF ou GRUPO"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-subtitle>
          <v-btn-toggle mandatory class="ml-3" dark v-model="filter" tile>
            <v-btn small active-class="success" :value="1"
              >Com App ({{ comAppSize }})</v-btn
            >
            <v-btn small active-class="warning" :value="0"
              >Sem App ({{ semAppSize }})</v-btn
            >
          </v-btn-toggle>
          <v-divider></v-divider>
          <v-row class="mb-5">
            <v-col cols="6"
              ><v-btn
                absolute
                left
                v-if="filteredAlunos.length > 0 && filter == 1"
                small
                color="primary"
                @click="notificacao(null, false)"
                >Enviar Notificação P/ Todos Listados Abaixo ({{this.filteredAlunos.length}})</v-btn
              ></v-col
            >
            <v-col align-self="end" cols="6">
              <v-btn
                absolute
                right
                v-if="filteredAlunos.length > 0 && filter == 1"
                small
                color="warning"
                @click="notificacao(null, true)"
                >Enviar Notificação P/ Todos os Alunos Com / Sem App({{
                  comAppSize + semAppSize
                }})</v-btn
              >
            </v-col>
          </v-row>
        </v-card-subtitle>

        <q-virtual-scroll
          class="my-sticky-dynamic"
          type="table"
          dense
          style="max-height: 70vh"
          virtual-scroll
          :virtual-scroll-slice-size="30"
          :virtual-scroll-item-size="47"
          :virtual-scroll-sticky-size-start="48"
          :virtual-scroll-sticky-size-end="32"
          :items="filteredAlunos"
        >
          <template v-slot:before>
            <thead class="thead-sticky text-left">
              <tr>
                <th v-for="col in headers" :key="'1--' + col.name">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot="{ item: row, index }">
            <tr :key="index">
              <td v-for="col in headers" :key="index + '-' + col.name">
                <div v-if="col.name == 'nome'">
                  {{ row.nome }} {{ row.sobrenome }}
                  <br />
                  {{ putMask(row.cpf, "cpf/cnpj") }}
                  <br />
                  {{ putMask(row.celular, "celular") }}
                  <br />
                  {{ row.email }}
                </div>
                <div v-if="col.name == 'grupo'">{{ row.grupo }}</div>
                <!-- <div v-if="col.name == 'acao'">
                <v-btn
                  v-if="filter == 1"
                  small
                  class="ma-1"
                  color="primary"
                  @click="notificacao(row)"
                >
                  Notificação
                  <v-icon dark right>far fa-paper-plane</v-icon>
                </v-btn>
              </div> -->
              </td>
            </tr>
          </template>
        </q-virtual-scroll>
      </v-card>
      <v-dialog v-model="dialogNotification" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Mensagem Para o App</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row justify="center">
                  <v-col cols="6">
                    <v-text-field
                      v-model="notification.title"
                      :rules="[(v) => !!v.trim() || 'Titulo obrigatório!']"
                      label="Titulo da Notificação"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="notification.body"
                      :rules="[(v) => !!v.trim() || 'Mensagem obrigatória!']"
                      label="Mensagem da Notificação"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center">
                  <v-col cols="6">
                    <v-text-field
                      v-model="notification.titulo"
                      :rules="[(v) => !!v.trim() || 'Titulo obrigatório!']"
                      label="Titulo da Mensagem"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      no-resize
                      v-model="notification.mensagem"
                      :rules="[(v) => !!v.trim() || 'Mensagem obrigatória!']"
                      label="Mensagem"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      :items="duracoes"
                      v-model="notification.duracao"
                      label="Duração da Mensagem no App"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" text @click="dialogNotification = false"
              >Voltar</v-btn
            >
            <v-btn color="success" text @click="checkEnvioNotification()"
              >Enviar</v-btn
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
      <v-overlay z-index="10" :value="loading">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import NotificacoesEnviadas from "./components/NotificacoesEnviadas";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: {
    NotificacoesEnviadas,
  },
  data: () => ({
    duracoes: [
      { text: "1 Dia", value: 86400 },
      { text: "2 Dias", value: 172800 },
      { text: "3 Dias", value: 259200 },
      { text: "7 Dias", value: 604800 },
      { text: "15 Dias", value: 1296000 },
      { text: "30 Dias", value: 2592000 },
    ],
    headers: [
      {
        name: "nome",
        align: "center",
        label: "Nome",
        sortable: false,
      },
      {
        name: "grupo",
        align: "center",
        label: "Grupo",
        sortable: false,
      },
      // {
      //   name: "acao",
      //   align: "center",
      //   label: "Ação",
      //   sortable: false,
      // },
    ],
    filter: 1,
    search: "",
    filteredAlunos: [],
    backupAlunos: [],
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    loading: false,
    dialogNotification: false,
    notification: {
      title: "",
      body: "",
      titulo: "",
      mensagem: "",
      duracao: 86400,
    },
    objectItem: {},
    arrayItem: [],
    valid: true,
    selectedFaculdade: null,
    selectedSemestre: null,
    selectedPeriodo: null,
    selectedRepresentante: null,
    checkFaculdade: true,
    checkSemestre: true,
    checkPeriodo: true,
    checkRepresentante: true,
    comAppSize: 0,
    semAppSize: 0,
    showNotificacoesEnviadas: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFaculdades();
    this.get_enviadas();
  },
  watch: {
    filter: function () {
      if (this.filter == 1) {
        this.filteredAlunos = this.alunos.filter(
          (a) => a.token_firebase != null
        );
        this.comAppSize = this.filteredAlunos.length;
      } else {
        this.filteredAlunos = this.alunos.filter(
          (a) => a.token_firebase == null
        );
        this.semAppSize = this.filteredAlunos.length;
      }
      this.backupAlunos = this.filteredAlunos;
    },
  },
  computed: {
    ...mapState({
      alunos: (state) => state.aluno.alunos,
      faculdades: (state) => state.aluno.faculdades,
      semestres: (state) => state.aluno.semestres,
      periodos: (state) => state.aluno.periodos,
      representantes: (state) => state.aluno.representantes,
      error: (state) => state.aluno.error,
    }),
  },
  methods: {
    ...mapActions([
      "get_alunos",
      "get_faculdades",
      "get_semestres",
      "get_periodos",
      "get_representantes",
      "get_enviadas",
      "send_notification",
    ]),
    find() {
      if (this.search.length == 0) {
        this.filteredAlunos = this.backupAlunos;
      } else {
        if (this.search && this.search.length >= 2) {
          let searchNome = [];
          let searchSobrenome = [];
          let searchCpf = [];
          let searchGrupo = [];

          searchNome = this.filteredAlunos.filter((i) =>
            i.nome.includes(this.search.toUpperCase())
          );
          if (searchNome.length && this.search.length >= 3) {
            this.filteredAlunos = searchNome;
          } else {
            searchSobrenome = this.filteredAlunos.filter((i) =>
              i.sobrenome.includes(this.search.toUpperCase())
            );
            if (searchSobrenome.length) {
              this.filteredAlunos = searchSobrenome;
            } else {
              searchCpf = this.filteredAlunos.filter((i) =>
                i.cpf.includes(this.search.toUpperCase())
              );
              if (searchCpf.length) {
                this.filteredAlunos = searchCpf;
              } else {
                searchGrupo = this.filteredAlunos.filter((i) =>
                  i.grupo.includes(this.search.toUpperCase())
                );
                if (searchGrupo.length) {
                  this.filteredAlunos = searchGrupo;
                }
              }
            }
          }
        }
      }
    },
    checks() {
      if (this.checkFaculdade) {
        this.checkSemestre = true;
        this.checkPeriodo = true;
        this.checkRepresentante = true;
      } else if (this.checkSemestre) {
        this.checkPeriodo = true;
        this.checkRepresentante = true;
      } else if (this.checkPeriodo) {
        this.checkRepresentante = true;
      }
    },
    notificacao(row, all) {
      if (all) {
        this.arrayItem = this.alunos;
      } else {
        this.arrayItem = this.filteredAlunos;
      }
      this.dialogNotification = true;
    },
    async checkEnvioNotification() {
      this.loading = true;
      let dados = {
        aluno: this.objectItem,
        alunos: this.arrayItem,
        notification: this.notification,
        faculdade: this.selectedFaculdade,
        semestre: this.selectedSemestre,
        periodo: this.selectedPeriodo,
        representante: this.selectedRepresentante,
      };
      await this.send_notification(dados);
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("Mensagem Enviada Com Sucesso!", "success");
        this.dialogNotification = false;
      }
      this.loading = false;
    },
    async getAlunos() {
      this.loading = true;
      this.search = "";
      this.checkFaculdade ? (this.selectedFaculdade = null) : null;
      this.checkSemestre ? (this.selectedSemestre = null) : null;
      this.checkPeriodo ? (this.selectedPeriodo = null) : null;
      this.checkRepresentante ? (this.selectedRepresentante = null) : null;

      let dados = {
        faculdade: this.selectedFaculdade,
        semestre: this.selectedSemestre,
        periodo: this.selectedPeriodo,
        representante: this.selectedRepresentante,
      };
      await this.get_alunos(dados);
      if (this.error) {
        this.loading = false;
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.filteredAlunos = this.alunos.filter(
          (a) => a.token_firebase != null
        );
        this.backupAlunos = this.filteredAlunos;
        this.comAppSize = this.filteredAlunos.length;
        this.semAppSize = this.alunos.filter(
          (a) => a.token_firebase == null
        ).length;

        if (this.alunos.length == 0) {
          this.showSnakerbar("Nenhum Aluno Encontrado", "warning", 3000);
        }
        this.loading = false;
      }
    },
    async getFaculdades() {
      this.loading = true;
      await this.get_faculdades(this.$usuario.value.id);
      this.loading = false;
    },
    async getSemestres() {
      this.loading = true;
      await this.get_semestres(this.selectedFaculdade.id_faculdade);
      this.loading = false;
    },
    async getPeriodos() {
      this.loading = true;
      await this.get_periodos({
        faculdade: this.selectedFaculdade.id_faculdade,
        semestre: this.selectedSemestre.id_semestre,
      });
      this.loading = false;
    },
    async getRepresentantes() {
      this.loading = true;
      await this.get_representantes({
        faculdade: this.selectedFaculdade.id_faculdade,
        semestre: this.selectedSemestre.id_semestre,
        periodo: this.selectedPeriodo.cod_periodo,
      });
      this.loading = false;
    },
    putMask(item, type) {
      switch (type) {
        case "cpf/cnpj":
          if (item.length < 14) {
            return this.$mask.apply(item, "000.000.000-00");
          } else {
            return this.$mask.apply(item, "00.000.000/0000-00");
          }
          break;
        case "celular":
          if (item.length == 11) {
            return this.$mask.apply(item, "(00) 0 0000-0000");
          } else {
            return this.$mask.apply(item, "(00) 0000-0000");
          }
          break;
        default:
          break;
      }
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