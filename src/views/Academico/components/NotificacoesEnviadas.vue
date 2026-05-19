<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn
          small
          color="error"
          @click="$parent.showNotificacoesEnviadas = false"
          >Voltar</v-btn
        >
        <div class="flex-grow-1"></div>
        <v-text-field
          class="uppercase"
          v-model="search"
          v-on:keyup="find(search)"
          append-icon="fa-search"
          label="Busque por: GRUPO"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
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
        :items="filteredEnviadas"
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
                <div v-if="col.name == 'id'">
                {{ row.id }}
              </div>
              <div v-if="col.name == 'data_msg'">
                {{ row.data_msg }} - {{ row.hora_msg }}
              </div>
              <div v-if="col.name == 'grupo'">{{ row.grupo }}</div>
              <div v-if="col.name == 'duracao'">
                <!-- {{ row.duracao }}
                <br /> -->
                <v-chip small v-if="row.status == 1" color="success"
                  >Ativa</v-chip
                >
                <v-chip small v-else color="error">Cancelada</v-chip>
              </div>
              <div v-if="col.name == 'titulo_not'">
                {{ row.titulo_not }}
              </div>
              <div v-if="col.name == 'msg_not'">
                {{ row.msg_not }}
              </div>
              <div v-if="col.name == 'titulo'">
                {{ row.titulo }}
              </div>
              <div v-if="col.name == 'msg'">
                {{ row.msg }}
              </div>

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
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    headers: [
        {
        name: "id",
        align: "center",
        label: "ID",
        sortable: false,
      },
      {
        name: "data_msg",
        align: "center",
        label: "Data/Hora",
        sortable: false,
      },
      {
        name: "grupo",
        align: "center",
        label: "Grupo",
        sortable: false,
      },
      {
        name: "duracao",
        align: "center",
        label: "Status",
        sortable: false,
      },
      {
        name: "titulo_not",
        align: "center",
        label: "Titulo Notificação",
        sortable: false,
      },
      {
        name: "msg_not",
        align: "center",
        label: "Mensagem Notificação",
        sortable: false,
      },
      {
        name: "titulo",
        align: "center",
        label: "Titulo Mensagem",
        sortable: false,
      },
      {
        name: "msg",
        align: "center",
        label: "Mensagem",
        sortable: false,
      },
      // {
      //   name: "acao",
      //   align: "center",
      //   label: "Ação",
      //   sortable: false,
      // },
    ],
    filteredEnviadas: [],
    search: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.filteredEnviadas = this.enviadas;
  },
  computed: {
    ...mapState({
      enviadas: (state) => state.aluno.enviadas,
    }),
  },
  methods: {
    find() {
      if (this.search.length == 0) {
        this.filteredEnviadas = this.enviadas;
      } else {
        if (this.search && this.search.length >= 2) {
          let searchGrupo = [];

          searchGrupo = this.filteredEnviadas.filter((i) =>
            i.grupo.includes(this.search.toUpperCase())
          );
          if (searchGrupo.length) {
            this.filteredAlunos = searchNome;
          }
        }
      }
    },
  },
};
</script>