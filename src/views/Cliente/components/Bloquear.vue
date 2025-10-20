<template>
  <v-container>
    <v-card>
      <v-card-title>
        Aluno
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="flex-grow-1"></div>
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-mask="'###.###.###-##'"
              v-model="cpf"
              autocomplete="nope"
              autofocus
              @keypress.enter="getAluno()"
              prepend-icon="fa-search"
              label="Nome, CPF, CNPJ"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row v-if="aluno_obj != null" class="ma-3">
        <v-col>
          {{ aluno_obj.nome }} {{ aluno_obj.sobrenome }}
          <br />
          {{ $put_mask(aluno_obj.cpf, "cpf") }}
        </v-col>
        <v-col>
          {{ aluno_obj.email }}
          <br />
          {{ $put_mask(aluno_obj.telefone, "telefone") }}
        </v-col>
        <v-col>
          {{ aluno_obj.grupo }}
          <br />
          Status:
          <span class="error--text" v-if="aluno_obj.bloqueado">
            BLOQUEADO
          </span>
          <span class="success--text" v-else>
            LIBERADO
          </span>
        </v-col>
        <v-col>
            <v-btn v-if="aluno_obj.bloqueado" small color="success" @click="bloquear(false)">Liberar</v-btn>
            <v-btn v-else small color="error" @click="bloquear(true)">Bloquear</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="alunos_array"
        hide-default-footer
        no-data-text="Nenhum Aluno Bloqueado"
        class="elevation-1"
      >
      <template v-slot:item.nome="{ item }">
      {{item.nome}} {{item.sobrenome}}
      <br>
      {{ $put_mask(item.cpf, "cpf") }}

    </template>
    <template v-slot:item.email="{ item }">
      {{item.email}} <br> {{ $put_mask(item.telefone, "telefone") }}

    </template>
    <template v-slot:item.bloqueado="{ item }">
      <span class="error--text" v-if="item.bloqueado">
            BLOQUEADO
          </span>
          <span class="success--text" v-else>
            LIBERADO
          </span>

    </template>
      </v-data-table>
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
    aluno_obj: null,
    alunos_array: [],
    cpf: "",
    loading: false,
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    headers: [
      {
        text: "Nome",
        value: "nome",
      },
      {
        text: "Email/Telefone",
        sortable: true,
        value: "email",
      },
      {
        text: "Grupo",
        sortable: true,
        value: "grupo",
      },
      {
        text: "Status",
        sortable: true,
        value: "bloqueado",
      },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      aluno: (state) => state.aluno.aluno,
      alunos: (state) => state.aluno.alunos,
    }),
  },
  async mounted() {
    this.loading = true;
    this.alunos_array = []
    await this.getAlunosBloqueados();
    this.alunos_array = this.alunos
    this.aluno_obj = null;
    this.loading = false;
  },
  methods: {
    ...mapActions(["get_aluno", "get_alunos_bloqueados", "set_bloqueado"]),
    async getAluno() {
      this.loading = true;
      await this.get_aluno(this.cpf);
      if (this.aluno == false) {
        this.showSnakerbar("Aluno não encontrado!", "warning", 3000);
      } else {
        this.aluno_obj = this.aluno;
      }
      this.loading = false;
    },
    async getAlunosBloqueados() {
      await this.get_alunos_bloqueados();
    },
    async bloquear(status){
        this.loading = true;
        if(status){ // se for para bloquear adiciona o obj no array
            this.alunos_array.push(this.aluno_obj)
            this.aluno_obj.bloqueado = true;
        } else {
            // se nao, remove o obj do array
            this.alunos_array = this.alunos_array.filter((e) => {
                return e.cpf != this.aluno_obj.cpf
            })
            this.aluno_obj.bloqueado = false;
        }

        await this.set_bloqueado(this.aluno_obj)

        this.loading = false;
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
