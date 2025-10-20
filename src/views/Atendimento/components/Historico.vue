<template>
  <div>
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
      <v-col cols="4">
        <v-text-field autofocus v-model="cliente.razao_social" label="Nome, CPF, CNPJ"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="cliente.codigo"
          append-icon="fa-search"
          @click:append="showDialogSearch()"
          label="Código"
          v-mask="'#####'"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedOperacao" :items="operacoes" label="Operação"></v-select>
      </v-col>
    </v-row>
    <v-card>
      <div class="text-center">
        <span class="subtitle-1">
          <b>Pedidos</b>
        </span>
      </div>
      <v-data-table
        height="200"
        class="elevation-1"
        hide-default-footer
        dense
        :headers="headersPedidos"
        :items="arrayPedidos"
        fixed-header
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{item.pedido}}</td>
            <td>{{item.status}}</td>
            <td>{{item.data}}</td>
            <td>{{item.nota}}</td>
            <td>{{item.data_nota}}</td>
            <td>{{item.total}}</td>
            <td>{{item.cliente}}</td>
            <td>{{item.vendedor}}</td>
            <td>{{item.usuario}}</td>
            <td>{{item.operacao}}</td>
            <td>{{item.online}}</td>
          </tr>
        </template>
        <template v-slot:footer>
          <v-row justify="center">
            <v-col cols="2">Pendentes: 10</v-col>
            <v-col cols="2">Total: R$ 7890,55</v-col>
            <v-col cols="2">Pedidos: 5</v-col>
            <v-col cols="2">Total: R$ 2890,55</v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="custom-row">
      <v-col cols="6">
        <v-card>
          <div class="text-center">
            <span class="subtitle-1">
              <b>Itens do Pedido</b>
            </span>
          </div>
          <v-data-table
            height="325"
            class="elevation-1"
            hide-default-footer
            dense
            :headers="headersItens"
            :items="arrayItens"
            fixed-header
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.qtd}}</td>
                <td>{{item.codigo}}</td>
                <td>{{item.unitario}}</td>
                <td>{{item.total}}</td>
                <td style="white-space: nowrap;">{{item.descricao}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-textarea
          class="input-no-details"
          outlined
          no-resize
          rows="2"
          dense
          label="Observações do Pedido"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>
        <v-card class="mb-2">
          <div class="text-center">
            <span class="caption">
              <b>Parcelas à Realizar</b>
            </span>
          </div>
          <v-data-table
            height="125"
            class="elevation-1"
            hide-default-footer
            dense
            :headers="headersRealizar"
            :items="arrayRealizar"
            fixed-header
          >
            <template v-slot:item="{ item }">
              <tr :class="item.vencido ? 'error' : 'success'">
                <td>{{item.financeiro}}</td>
                <td>{{item.emissao}}</td>
                <td>{{item.vencimento}}</td>
                <td>{{item.valor}}</td>
                <td>{{item.valor_liquido}}</td>
                <td style="white-space: nowrap;">{{item.documento}}</td>
                <td style="white-space: nowrap;">{{item.obs}}</td>
                <td style="white-space: nowrap;">{{item.cliente}}</td>
                <td style="white-space: nowrap;">{{item.carteira}}</td>
                <td>{{item.banco}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-card>
          <div class="text-center">
            <span class="caption">
              <b>Parcelas Realizadas</b>
            </span>
          </div>

          <v-data-table
            height="125"
            fixed-header
            class="elevation-1"
            hide-default-footer
            dense
            :headers="headersRealizadas"
            :items="arrayRealizadas"
          >
            <template v-slot:item="{ item }">
              <tr :class="item.vencido ? 'error' : 'success'">
                <td>{{item.financeiro}}</td>
                <td>{{item.emissao}}</td>
                <td>{{item.vencimento}}</td>
                <td>{{item.pagamento}}</td>
                <td>{{item.valor}}</td>
                <td>{{item.valor_pago}}</td>
                <td style="white-space: nowrap;">{{item.documento}}</td>
                <td style="white-space: nowrap;">{{item.obs}}</td>
                <td style="white-space: nowrap;">{{item.cliente}}</td>
                <td style="white-space: nowrap;">{{item.carteira}}</td>
                <td>{{item.banco}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
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
      { text: "* DEVOLUÇÃO (ESTADUAL)", value: "5202 E" },
      { text: "DEVOLUÇÃO (ESTADUAL)", value: "5202" }
    ],
    selectedOperacao: {}, // ficar global no Inicio.vue do tela de atendimento
    dialogSearch: false, // ficar global no Inicio.vue do tela de atendimento
    headersPedidos: [
      { text: "Pedido", value: "pedido" },
      { text: "Status", value: "status" },
      { text: "Data", value: "data" },
      { text: "NF", value: "nf" },
      { text: "Data NF", value: "data_nf" },
      { text: "Total", value: "total" },
      { text: "Cliente", value: "cliente" },
      { text: "Vendedor", value: "vendedor" },
      { text: "Usuário", value: "usuario" },
      { text: "Operação", value: "operacao" },
      { text: "Online", value: "online" }
    ],
    arrayPedidos: [
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "EMITIDO",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 75.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "CINTIA",
        usuario: "CINTIA",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "PENDENTE",
        data: "22/02/1993",
        nf: "0",
        data_nf: "",
        total: 15.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)",
        online: ""
      },
      {
        pedido: "221679A",
        status: "FATURADO",
        data: "22/02/1993",
        nf: "999999",
        data_nf: "22/02/1993",
        total: 789.85,
        cliente: "EDGAR CARDOTE",
        vendedor: "DANIELA",
        usuario: "CINTIA",
        operacao: "* VENDA (ESTADUAL)",
        online: ""
      }
    ],
    headersRealizadas: [
      { text: "Num", value: "financeiro" },
      { text: "Emissão", value: "emissao" },
      { text: "Venc", value: "vencimento" },
      { text: "Pgto", value: "pagamento" },
      { text: "Val", value: "valor", width: "70" },
      { text: "Pag", value: "valor_pago", width: "70" },
      { text: "Documento", value: "documento" },
      { text: "Observações", value: "obs" },
      { text: "Cliente", value: "cliente" },
      { text: "Cart", value: "carteira" },
      { text: "Banco", value: "banco" }
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
        banco: "SOLIDENT",
        financeiro: 887307,
        vencido: true
      }
    ],
    headersRealizar: [
      { text: "Num", value: "financeiro" },
      { text: "Emissão", value: "emissao" },
      { text: "Venc", value: "vencimento" },
      { text: "Val", value: "valor" },
      { text: "Liq", value: "valor_liquido" },
      { text: "Documento", value: "documento" },
      { text: "Observações", value: "obs" },
      { text: "Cliente", value: "cliente" },
      { text: "Cart", value: "carteira" },
      { text: "Banco", value: "banco" }
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
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
        carteira: "À VISTA",
        banco: "SOLIDENT",
        financeiro: 887307,
        vencido: true
      }
    ],
    headersItens: [
      { text: "Qtd", value: "qtd" },
      { text: "Código", value: "codigo" },
      { text: "Unitário", value: "unitario" },
      { text: "Total", value: "total" },
      { text: "Descrição", value: "descricao" }
    ],
    arrayItens: [
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS "
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao:
          "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN DSFSDFSDFSDFSDFSDF DASFSDFS"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      },
      {
        qtd: 2,
        codigo: "08010",
        unitario: 20,
        total: 40,
        descricao: "WHITENESS HP BLUE 35% FGM 1 SERINGA + TOPDAM GREEN"
      }
    ]
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
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