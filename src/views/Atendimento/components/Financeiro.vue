<template>
  <div>
    <v-row class="custom-row ml-2 mr-2">
      <v-col cols="2">
        <v-text-field
          v-model="data_de"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatÃ³ria!' ] "
          placeholder="dd/mm/aaaa"
          label="De"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="data_ate"
          v-mask="'##/##/####'"
          :rules=" [v => !!v.trim() || 'Data obrigatÃ³ria!' ] "
          placeholder="dd/mm/aaaa"
          label="AtÃ©"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field autofocus v-model="cliente.razao_social" label="Nome, CPF, CNPJ"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="cliente.codigo"
          append-icon="fa-search"
          @click:append="showDialogSearch()"
          label="CÃ³digo"
          v-mask="'#####'"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedOperacao" :items="operacoes" label="OperaÃ§Ã£o"></v-select>
      </v-col>
    </v-row>
    <v-card class="mb-2">
      <div class="text-center">
        <span class="subtitle-1">
          <b>Parcelas Ã  Realizar</b>
        </span>
      </div>
      <v-data-table
        height="250"
        class="elevation-1"
        hide-default-footer
        dense
        :headers="headersRealizar"
        :items="arrayRealizar"
        fixed-header
      >
        <template v-slot:item="{ item }">
          <tr :class="item.vencido ? 'error' : 'success'">
            <td>{{item.documento}}</td>
            <td>{{item.referencia}}</td>
            <td>{{item.emissao}}</td>
            <td>{{item.valor}}</td>
            <td>{{item.valor_liquido}}</td>
            <td>{{item.vencimento}}</td>
            <td>{{item.obs}}</td>
            <td>{{item.cliente}}</td>
            <td>{{item.carteira}}</td>
            <td>{{item.banco}}</td>
            <td>{{item.financeiro}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <div class="text-center">
        <span class="subtitle-1">
          <b>Parcelas Realizadas</b>
        </span>
      </div>

      <v-data-table
        height="250"
        fixed-header
        class="elevation-1"
        hide-default-footer
        dense
        :headers="headersRealizadas"
        :items="arrayRealizadas"
      >
        <template v-slot:item="{ item }">
          <tr :class="item.vencido ? 'error' : 'success'">
            <td>{{item.documento}}</td>
            <td>{{item.referencia}}</td>
            <td>{{item.emissao}}</td>
            <td>{{item.valor}}</td>
            <td>{{item.valor_pago}}</td>
            <td>{{item.vencimento}}</td>
            <td>{{item.pagamento}}</td>
            <td>{{item.obs}}</td>
            <td>{{item.cliente}}</td>
            <td>{{item.carteira}}</td>
            <td>{{item.banco}}</td>
            <td>{{item.financeiro}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="font-weight-medium" justify="center">
      <v-col cols="2">Total Ã  Realizar: -193.568,02</v-col>
      <v-col cols="2">Total Atrazado: -572.739,60</v-col>
      <v-col cols="2">Total Realizado: 292.746,21</v-col>
      <v-col cols="2">Total de Pedidos: 1945</v-col>
      <v-col cols="2">Valor Total: 2.879.961,66</v-col>
    </v-row>
    <v-dialog v-model="dialogSearch" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Country</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">vai buscar os clientes</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error" text @click="dialogSearch = false">Voltar</v-btn>
          <v-btn color="success" text>Selecionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
      {{msgSnackbar}}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
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
    operacoes: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "COMPRA (PEDIDO)", value: "1102 P" },
      { text: "COMPRA (NOTA)", value: "1102 N" },
      { text: "* DEVOLUÃ‡ÃƒO (ESTADUAL)", value: "5202 E" },
      { text: "DEVOLUÃ‡ÃƒO (ESTADUAL)", value: "5202" }
    ],
    selectedOperacao: {}, // ficar global no Inicio.vue do tela de atendimento
    dialogSearch: false, // ficar global no Inicio.vue do tela de atendimento
    headersRealizadas: [
      { text: "Documento", value: "documento" },
      { text: "Ref", value: "referencia" },
      { text: "EmissÃ£o", value: "emissao" },
      { text: "Valor", value: "valor" },
      { text: "Pago", value: "valor_pago" },
      { text: "Vencimento", value: "vencimento" },
      { text: "Pagamento", value: "pagamento" },
      { text: "ObservaÃ§Ãµes", value: "obs" },
      { text: "Cliente", value: "cliente" },
      { text: "Carteira", value: "carteira" },
      { text: "Banco", value: "banco" },
      { text: "Financeiro", value: "financeiro" }
    ],
    arrayRealizadas: [
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: true
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs:
          "ahsdjkahsdjk hasjdhasjkdhsaj ahsjdhas ajskdh ahsjdhas ajkdhasjkdh hasjkdhasjdh asjh jsahdjkashd h  jasdhjakshdjkashdjksahdjkas",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: true
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_pago: 50.9,
        vencimento: "01/03/1993",
        pagamento: "01/03/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221392A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 450.9,
        valor_pago: 450.9,
        vencimento: "22/02/1993",
        pagamento: "22/02/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 887307,
        vencido: true
      }
    ],
    headersRealizar: [
      { text: "Documento", value: "documento" },
      { text: "Ref", value: "referencia" },
      { text: "EmissÃ£o", value: "emissao" },
      { text: "Valor", value: "valor" },
      { text: "Liquido", value: "valor_liquido" },
      { text: "Vencimento", value: "vencimento" },
      { text: "ObservaÃ§Ãµes", value: "obs" },
      { text: "Cliente", value: "cliente" },
      { text: "Carteira", value: "carteira" },
      { text: "Banco", value: "banco" },
      { text: "Financeiro", value: "financeiro" }
    ],
    arrayRealizar: [
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221679A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 50.9,
        valor_liquido: 50.9,
        vencimento: "01/03/1993",
        obs:
          "COMPRO PAGO SEILA OQ LEVO NAO SEI OQ MAIS, DEU MOEDA DE CHOCOLATE",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 888021,
        vencido: false
      },
      {
        documento: "PV 221392A / NF 999999",
        referencia: "1/1",
        emissao: "22/02/1993",
        valor: 450.9,
        valor_liquido: 450.9,
        vencimento: "22/02/1993",
        obs: "LOJA",
        cliente: "EDGAR CARDOTE",
        carteira: "Ã€ VISTA",
        banco: "SOLIDENT",
        financeiro: 887307,
        vencido: true
      }
    ]
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
<style>
</style>