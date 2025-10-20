<template>
  <v-container>
    <v-row justify="center" class="mt-n4">
      <v-col cols="12" sm="5" md="7" lg="7">
        <v-text-field
          class="h4 ml-2 mr-2 mt-4"
          label="CPF do Aluno"
          v-mask="'###.###.###-##'"
          background-color="blue lighten-5"
          v-model="cpf"
          @click="$event.target.select()"
          @keypress.enter="getSenha()"
          autofocus
          full-width
          height="50pt"
          append-outer-icon="fas fa-key"
          @click:append-outer="getSenha()"
          type="tel"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogAluno" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">ALUNO ENCONTRADO</span>
        </v-card-title>
        <v-card-text class="headline">
          <b>Aluno: </b> {{aluno.nome}} {{aluno.sobrenome}} <br>
          <b>Senha: </b> {{aluno.senha}}
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" text @click="dialogAluno = false">Ok</v-btn>
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
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    cpf: "",
    dialogAluno: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      aluno: (state) => state.aluno.aluno,
      error: (state) => state.aluno.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["get_aluno"]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    async getSenha() {
      this.set_loading(true);
      await this.get_aluno(this.cpf);
      this.set_loading(false);
      if (!this.error) {
        if (!this.aluno) {
          this.set_snackbar({
            show: true,
            msg: "Aluno Não Encontrado!",
            type: "warning",
            time: 0,
          });
        } else {
          this.dialogAluno = true;
          this.cpf = "";
        }
      } else {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
    },
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
  },
};
</script>