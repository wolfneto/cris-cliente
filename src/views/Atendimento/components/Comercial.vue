<template>
  <v-container>
    <v-row class="custom-row ml-2 mr-2">
      <v-col cols="2">
        <v-text-field
          v-model="data_de"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
          placeholder="dd/mm/aaaa"
          label="De"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="data_ate"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
          placeholder="dd/mm/aaaa"
          label="Até"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field autofocus v-model="cliente.razao_social" label="Nome, CPF, CNPJ"></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-text-field
          v-model="cliente.codigo"
          append-icon="fa-search"
          @click:append="showDialogSearch()"
          label="Código"
          v-mask="'#####'"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedStatus" :items="status" label="Status"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedOperacao" :items="operacoes" label="Operação"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <div class="text-center">
            <span class="subtitle-1">
              <b>Resumo dos Itens</b>
            </span>
          </div>
          <v-data-table
            height="500"
            class="elevation-1"
            hide-default-footer
            dense
            :headers="headersItens"
            :items="itens"
            fixed-header
            :items-per-page="-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.qtd}}</td>
                <td>{{item.codigo}}</td>
                <td>{{item.valor}}</td>
                <td>{{item.total}}</td>
                <td>{{item.descricao}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <div class="text-center">
            <span class="subtitle-1">
              <b>Resumo de Pedidos</b>
            </span>
          </div>
          <v-data-table
            height="500"
            class="elevation-1"
            hide-default-footer
            dense
            :headers="headersPedidos"
            :items="pedidos"
            fixed-header
            :items-per-page="-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.pedido}}</td>
                <td>{{item.emissao}}</td>
                <td>{{item.qtd}}</td>
                <td>{{item.valor}}</td>
                <td>{{item.total}}</td>
                <td>{{item.nota}}</td>
                <td>{{item.emissao_nota}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
      {{msgSnackbar}}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    data_de: "01/01/2019",
    data_ate: "31/12/2019",
    headersItens: [
      { text: "Qtd", value: "qtd", sortable: false },
      { text: "Código", value: "codigo", sortable: true },
      { text: "Valor", value: "valor", sortable: true },
      { text: "Total", value: "total", sortable: true },
      { text: "Descrição", value: "descricao", sortable: true }
    ],
    itens: [
      {
        qtd: 2,
        codigo: "11062",
        valor: 80.37,
        total: 160.74,
        descricao: "AGENTE SINGLE BOND 3M REFIL COD.1105"
      },
      {
        qtd: 1,
        codigo: "00212",
        valor: 87.98,
        total: 87.98,
        descricao: "AGULHA GENGIVAL 30G CURTA TERUMO"
      },
      {
        qtd: 1,
        codigo: "01265",
        valor: 62.91,
        total: 62.91,
        descricao: "ALGINATO HYDROGUM FIVE 453GRS ZHERMACK"
      }
    ],
    headersPedidos: [
      { text: "Pedido", value: "pedido", sortable: false },
      { text: "Emissão", value: "emissao", sortable: true },
      { text: "Qtd", value: "qtd", sortable: true },
      { text: "Valor", value: "valor", sortable: true },
      { text: "Total", value: "total", sortable: true },
      { text: "Nota", value: "nota", sortable: true },
      { text: "Emissão", value: "emissao_nota", sortable: true }
    ],
    pedidos: [
      {
        pedido: "222180A",
        emissao: "27/11/2019",
        qtd: 1,
        valor: 52.62,
        total: 52.62,
        nota: '999999',
        emissao_nota: "28/11/2019",
      },
      {
        pedido: "223220A",
        emissao: "20/05/2019",
        qtd: 1,
        valor: 78.5,
        total: 78.5,
        nota: '107488',
        emissao_nota: "20/11/2019",
      }
    ],
    operacoes: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "COMPRA (PEDIDO)", value: "1102 P" },
      { text: "COMPRA (NOTA)", value: "1102 N" },
      { text: "* DEVOLUÇÃO (ESTADUAL)", value: "5202 E" },
      { text: "DEVOLUÇÃO (ESTADUAL)", value: "5202" }
    ],
    selectedOperacao: {}, // ficar global no Inicio.vue do tela de atendimento
    status: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "PENDENTE", value: "1" },
      { text: "COMPRA (NOTA)", value: "1102 N" },
      { text: "* DEVOLUÇÃO (ESTADUAL)", value: "5202 E" },
      { text: "DEVOLUÇÃO (ESTADUAL)", value: "5202" }
    ],
    selectedStatus: {}, // ficar global no Inicio.vue do tela de atendimento
    dialogSearch: false // ficar global no Inicio.vue do tela de atendimento
  }),
  created() {
    //this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      error: state => state.cliente.error,
      cliente: state => state.cliente.cliente
    })
  },
  methods: {
    ...mapActions(["get_cliente", "get_cliente_by_code"]),
    ...mapMutations(["set_cliente"]),
    showDialogSearch() {

      this.dialogSearch = true;
    }
  }
};
</script>