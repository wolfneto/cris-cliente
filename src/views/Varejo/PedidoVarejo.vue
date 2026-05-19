<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row class="custom-row">
          <v-col cols="2">
            <v-text-field
              v-model="data_de"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
              @keydown.enter="getPedidosVarejo()"
              placeholder="dd/mm/aaaa"
              label="De"
              required
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="data_ate"
              v-mask="'##/##/####'"
              @keydown.enter="getPedidosVarejo()"
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
              placeholder="dd/mm/aaaa"
              label="Até"
              required
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="7">
            <v-text-field
              class="uppercase"
              v-model="search"
              v-on:keyup="find(search)"
              append-icon="fa-search"
              label="Busque por: Nome, CPF, Pedido ou Status"
              hide-details
                  clearable                 
                  filled
                  rounded
            ></v-text-field>
          </v-col>
          <v-col cols="1">        
            <v-btn class="ma-2" outlined rounded color="blue-grey" @click="getPedidosVarejo()"">
              <v-icon>fas fa-sync-alt</v-icon>update</v-btn>
          </v-col>

        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row no-gutter>
          <v-btn-toggle
            mandatory
            class="ml-3"
            @change="getPedidosVarejo()"
            dark
            v-model="emitido"
            tile
          >
            <v-btn small active-class="primary" :value="0">Pendentes</v-btn>
            <v-btn small active-class="success" :value="1">Emitidos</v-btn>
          </v-btn-toggle>
        </v-row>
        <v-row>
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
        :items="filteredPedidosVarejo"
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
              <div v-if="col.name == 'criado_em'">Pedido: {{ $moment_format_sub_2(row.criado_em) }}</div>
              <div v-if="col.name == 'cliente'"><b> {{ row.cliente.nome }} {{ row.cliente.sobrenome }}</b><br>
                {{ $put_mask(row.cliente.cpf_cnpj, "cpf") }} <br>
                {{ $put_mask(row.cliente.celular, "celular") }} {{ row.cliente.email }} 
              </div>
              <div v-if="col.name == 'vendedor'">{{ row.cliente.vendedor }} </div>
              <div v-if="col.name == 'id'"># <b>{{ row.id }}</b> </div>
              <div v-if="col.name == 'valor'"> {{ $money_format(row.valor) }} </div>
              <div v-if="col.name == 'desconto'">{{ $money_format(row.desconto) }} </div>
              <div v-if="col.name == 'frete'"> {{ $money_format(row.frete) }} </div>
              <div v-if="col.name == 'valor_total'">{{ $money_format(row.pagamento.pagamentos_boleto.valor) }} </div>
              <div v-if="col.name == 'status_pagamento'"> 
                <v-chip
                      class="mt-1 mb-1"
                      :color="
                        row.pagamento.status_pagamento == 'PENDENTE'
                          ? 'warning'
                          : row.pagamento.status_pagamento == 'ANALISAR'
                          ? 'success'
                          : 'error'
                      "
                      text-color="white"
                    >
                    {{ row.pagamento.status_pagamento.toUpperCase() }}                    
                    </v-chip> 
                  </div>
              <div v-if="col.name == 'status_sistema'">
                <v-chip                     
                      class="mt-1 mb-1"
                      :color="
                        row.status_pagamento == 'Aguardando Pagamento'
                          ? 'warning'
                          : row.status_pagamento == 'ANALISAR'
                          ? 'success'
                          : 'error'
                      "
                      text-color="white"
                    >
                    {{row.status_pagamento.toUpperCase()  }}                    
                    </v-chip>
                    </div>
              <div v-if="col.name == 'acao'">
                <v-btn                 
                  small
                  class="ma-1"
                  color="primary"
                  icon                 
                >
                  <v-icon dark right>fa fa-bars</v-icon>
                </v-btn>
              </div>
              </td>
              </tr>
        </template>
      </q-virtual-scroll>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    emitido: 0,
    search: "",
    filteredPedidosVarejo: [],
    headers: [
      {
        name: "criado_em",
        align: "center",
        label: "Data",
        sortable: true,
      },
      {
        name: "cliente",
        align: "center",
        label: "Cliente",
        sortable: true,
      },
      {
        name: "vendedor",
        align: "center",
        label: "Vendedor",
        sortable: true,
      },
      {
        name: "id",
        align: "center",
        label: "Pedido",
        sortable: true,
      },
      {
        name: "valor",
        align: "center",
        label: "Valor Pedido",
        sortable: true,
      },
      {
        name: "desconto",
        align: "center",
        label: "Descontos",
        sortable: true,
      },
      {
        name: "frete",
        align: "center",
        label: "Frete",
        sortable: true,
      },
      {
        name: "valor_total",
        align: "center",
        label: "Valor Total",
        sortable: true,
      },
      {
        name: "status_pagamento",
        align: "center",
        label: "Status Pagamento",
        sortable: true,
      },
      {
        name: "status_sistema",
        align: "center",
        label: "Status Sistema",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "Ação",
        sortable: false,
      },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    // this.getPermissao();
  },
  async mounted() {
    await this.getDatas();
    this.getPedidosVarejo();
  },
  computed: {
    ...mapState({
      pedidos_varejo: (state) => state.pedidoVarejo.pedidos_varejo,
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,

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
  },
  methods: {
    ...mapActions(["getDatas", "get_pedidos_varejo"]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },

    async getPedidosVarejo() {
      this.set_loading(true);
      await this.get_pedidos_varejo({
        de: this.data_de,
        ate: this.data_ate,
        emitido: this.emitido,
        usuario: this.$usuario.value.id,
      });
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }else{
        this.filteredPedidosVarejo = this.pedidos_varejo;
        console.log(this.filteredPedidosVarejo);
      }
      
    },
  },
};
</script>
