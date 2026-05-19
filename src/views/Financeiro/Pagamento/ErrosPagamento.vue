<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row class="custom-row">
          <v-col cols="3">
            <v-row justify="center" class="custom-row">
              <v-col cols="5">
                <v-text-field
                  v-model="data_de"
                  v-mask="'##/##/####'"
                  :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
                  @keydown.enter="getLogErrosPagamento()"
                  placeholder="dd/mm/aaaa"
                  label="De"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="data_ate"
                  v-mask="'##/##/####'"
                  @keydown.enter="getLogErrosPagamento()"
                  :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
                  placeholder="dd/mm/aaaa"
                  label="Até"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <v-row class="mt-4 custom-row">
              <span v-if="tipo_pagamento == 0">
                Relatório de Erros Pagamentos
                <span class="success--text"><b>Acadêmico</b></span>
              </span>
              <span v-else-if="tipo_pagamento == 1">
                Relatório de Erros Pagamentos
                <span class="primary--text"><b>Varejo</b></span>
              </span>
              <v-btn
                small
                class="ml-3"
                color="grey lighten-1"
                @click="getLogErrosPagamento()"
                >Atualizar</v-btn
              >
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="uppercase"
              v-model="search"
              @click="$event.target.select()"
              v-on:keyup="find(search)"
              append-icon="fa-search"
              label=" Busque por:CPF ou CNPJ"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>
        <v-btn-toggle
          mandatory
          class="mt-4"
          @change="getLogErrosPagamento()"
          dark
          v-model="tipo_pagamento"
          tile
        >
          <v-btn small active-class="success" :value="0">Acadêmico</v-btn>
          <v-btn small active-class="primary" :value="1">Varejo</v-btn>
        </v-btn-toggle>
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
        :items="filteredPagamentos"
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
              <div v-if="col.name == 'created_at'" style="width: 100pt">
                {{ row.created_at }}
              </div>
              <div v-if="col.name == 'codigo_link'" style="width: 80pt">
                {{ row.codigo_link }}
              </div>
              <div v-if="col.name == 'numero_pedido'" style="width: 50pt">
                {{ row.numero_pedido }}
              </div>
              <div v-if="col.name == 'cpf_cnpj'" style="width: 100pt">
                <b>{{ putMask(row.cpf_cnpj) }}</b>
              </div>
              <div v-if="col.name == 'razao'" style="width: 600pt">
                {{ row.razao }}
              </div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </v-card>
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
    search: "",
    tipo_pagamento: 0,
    headers: [
      {
        name: "created_at",
        align: "center",
        label: "Data",
        sortable: true,
      },
      {
        name: "codigo_link",
        align: "center",
        label: "Codigo Link",
        sortable: true,
      },
      {
        name: "numero_pedido",
        align: "center",
        label: "# Pedido",
        sortable: true,
      },
      {
        name: "cpf_cnpj",
        align: "center",
        label: "Cpf/Cnpj",
        sortable: true,
      },
      {
        name: "razao",
        align: "center",
        label: "Erro",
        sortable: true,
      },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  async mounted() {
    await this.getDatas();
    this.getLogErrosPagamento();
  },
  computed: {
    ...mapState({
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      errosPagamento: (state) => state.errosPagamento.errosPagamento,
      error: (state) => state.errosPagamento.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    data_de: {
      get() {
        return this.data_inicial;
      },
      set(value) {
        this.$store.commit("setDataInicial", value);
      },
    },
    data_ate: {
      get() {
        return this.data_final;
      },
      set(value) {
        this.$store.commit("setDataFinal", value);
      },
    },
    filteredPagamentos: function () {     
      let data = [];
      for (const a of this.errosPagamento) {
        if (this.tipo_pagamento == 0) {
          if (a.numero_pedido) {
            data.push(a);
          }          
        }
        if (this.tipo_pagamento == 1) {
          if (!a.numero_pedido) {
            data.push(a);
          }
        }
      }   
      return data;
    },
  },
  methods: {
    ...mapActions(["getDatas", "get_log_erros_pagamento"]),
    ...mapMutations(["set_filter_erro_pagamentos", "set_snackbar", "set_loading"]),   
    async getLogErrosPagamento() {
      this.search = "";
      this.set_loading(true);
      await this.get_log_erros_pagamento({
        de: this.data_de,
        ate: this.data_ate,
      });
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
    find() {
      if (this.search.length == 0) {
        this.getLogErrosPagamento();
      }
      if (this.search && this.search.length >= 14) {
        let busca = this.search.replace(/\D/g, "");        
        let searchBycpfCnpj = [];

        searchBycpfCnpj = this.filteredPagamentos.filter((i) =>
          i.cpf_cnpj.includes(busca)
        )        
        if (searchBycpfCnpj.length) {
          this.set_filter_erro_pagamentos(searchBycpfCnpj);         
        }
      }
    },
    putMask(item, type) {
      if (item.length < 14) {
        return this.$mask.apply(item, "000.000.000-00");
      } else {
        return this.$mask.apply(item, "00.000.000/0000-00");
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