<template>
  <v-container>
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
      <v-col cols="2">
        <v-select v-model="selectedAtendente" :items="atendentes" label="Atendente"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedStatus" :items="status" label="Status"></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field autofocus v-model="nome" label="Nome, CPF, CNPJ"></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-text-field
          v-model="codigo"
          append-icon="fa-search"
          @click:append="showDialogSearch()"
          label="CÃ³digo"
          v-mask="'#####'"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-tabs @change="onChangeTabs($event)" dark :slider-size="10" dense grow>
      <v-tab class="blue lighten-1">Pedidos</v-tab>
      <v-tab class="orange lighten-1">OrÃ§amentos</v-tab>
      <v-tab-item>
        <v-card>
          <div class="text-center blue lighten-4">
            <span class="subtitle-1">
              <b>Pedidos</b>
            </span>
          </div>
          <v-data-table
            height="270"
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
                <td>{{item.status}}</td>
                <td>{{item.emissao}}</td>
                <td>{{item.nota}}</td>
                <td>{{item.emissao_nota}}</td>
                <td>{{item.total}}</td>
                <td>{{item.codigo_cliente}}</td>
                <td>{{item.nome_cliente}}</td>
                <td>{{item.vendedor}}</td>
                <td>{{item.atendente}}</td>
                <td>{{item.usuario}}</td>
                <td>{{item.operacao}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-card>
          <div class="text-center blue lighten-4">
            <span class="subtitle-1">
              <b>Itens do Pedido</b>
            </span>
          </div>
          <v-data-table
            height="200"
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
                <td>{{item.status}}</td>
                <td>{{item.descricao}}</td>
                <td>{{item.marca}}</td>
              </tr>
            </template>
            <template v-slot:footer>
              <v-row class="text-center" justify="center">
                <v-col cols="3">Pedidos do Cliente: 5</v-col>
                <v-col cols="3">Total: R$ 9.058,87</v-col>
                <v-col cols="3">Total de Pedidos: 100</v-col>
                <v-col cols="3">Total: R$ 143,751,02</v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <v-tab-item>
          <v-card>
          <div class="text-center blue lighten-4">
            <span class="subtitle-1">
              <b>OrÃ§amentos</b>
            </span>
          </div>
          <v-data-table
            height="270"
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
                <td>{{item.status}}</td>
                <td>{{item.emissao}}</td>
                <td>{{item.nota}}</td>
                <td>{{item.emissao_nota}}</td>
                <td>{{item.total}}</td>
                <td>{{item.codigo_cliente}}</td>
                <td>{{item.nome_cliente}}</td>
                <td>{{item.vendedor}}</td>
                <td>{{item.atendente}}</td>
                <td>{{item.usuario}}</td>
                <td>{{item.operacao}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-card>
          <div class="text-center blue lighten-4">
            <span class="subtitle-1">
              <b>Itens do OrÃ§amento</b>
            </span>
          </div>
          <v-data-table
            height="200"
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
                <td>{{item.status}}</td>
                <td>{{item.descricao}}</td>
                <td>{{item.marca}}</td>
              </tr>
            </template>
            <template v-slot:footer>
              <v-row class="text-center" justify="center">
                <v-col cols="3">Pedidos do Cliente: 5</v-col>
                <v-col cols="3">Total: R$ 9.058,87</v-col>
                <v-col cols="3">Total de Pedidos: 100</v-col>
                <v-col cols="3">Total: R$ 143,751,02</v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>

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
export default {
  data: () => ({
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    data_de: "01/01/2019",
    data_ate: "31/12/2019",
    nome: "",
    codigo: "",
    status: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "PENDENTE", value: "1" },
      { text: "APROVADO", value: "2" },
      { text: "EMITIDO", value: "3" },
      { text: "FATURADO", value: "4" }
    ],
    selectedStatus: {}, // ficar global no Inicio.vue do tela de atendimento
    atendentes: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "GISLANE", value: "1" },
      { text: "CINTIA", value: "2" },
      { text: "CARLOS", value: "3" },
      { text: "DANIELA", value: "4" }
    ],
    selectedAtendente: {}, // ficar global no Inicio.vue do tela de atendimento
    headersPedidos: [
      { text: "Pedido", value: "pedido", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "EmissÃ£o", value: "emissao", sortable: true },
      { text: "Nota", value: "nota", sortable: true },
      { text: "EmissÃ£o", value: "emissao_nota", sortable: true },
      { text: "Total", value: "total", sortable: true },
      { text: "Codigo", value: "codigo_cliente", sortable: true },
      { text: "Cliente", value: "nome_cliente", sortable: true },
      { text: "Vendedor", value: "vendedor", sortable: true },
      { text: "Atendente", value: "atendente", sortable: true },
      { text: "UsuÃ¡rio", value: "usuario", sortable: true },
      { text: "OperaÃ§Ã£o", value: "operacao", sortable: true }
    ],
    pedidos: [
      {
        pedido: "222561A",
        status: "FATURADO",
        emissao: "04/12/2019",
        nota: "107454",
        emissao_nota: "04/12/2019",
        total: 144.42,
        codigo_cliente: "33214",
        nome_cliente: "LUARA FABRICIO DA SILVA",
        vendedor: "DANIELA",
        atendente: "DANIELA",
        usuario: "UIARA",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222569A",
        status: "PENDENTE",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 1395.01,
        codigo_cliente: "3380",
        nome_cliente: "ANGELINA MIGLIORE",
        vendedor: "CINTIA",
        atendente: "CINTIA",
        usuario: "CINTIA",
        operacao: "* VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      },
      {
        pedido: "222574A",
        status: "SEPARADO",
        emissao: "04/12/2019",
        nota: "",
        emissao_nota: "",
        total: 501.35,
        codigo_cliente: "11923",
        nome_cliente: "LIZANDRA ZUIM",
        vendedor: "GISLANE",
        atendente: "GISLANE",
        usuario: "GISLANE",
        operacao: "VENDA (ESTADUAL)"
      }
    ],
    headersItens: [
      { text: "Qtd", value: "qtd", sortable: false },
      { text: "CÃ³digo", value: "codigo", sortable: false },
      { text: "Valor", value: "valor", sortable: true },
      { text: "Total", value: "total", sortable: true },
      { text: "Status", value: "status", sortable: true },
      { text: "DescriÃ§Ã£o", value: "descricao", sortable: true },
      { text: "Marca", value: "marca", sortable: true }
    ],
    itens: [
      {
        qtd: 3,
        codigo: "07399B",
        valor: 15.6,
        total: 46.8,
        status: "ativo",
        descricao: "BABADOR BEST CARE CX C/ 100 UNIDADES BRANCO",
        marca: "BIODINAMICA"
      },
      {
        qtd: 3,
        codigo: "07399B",
        valor: 15.6,
        total: 46.8,
        status: "ativo",
        descricao: "BABADOR BEST CARE CX C/ 100 UNIDADES BRANCO",
        marca: "BIODINAMICA"
      },
      {
        qtd: 3,
        codigo: "07399B",
        valor: 15.6,
        total: 46.8,
        status: "ativo",
        descricao: "BABADOR BEST CARE CX C/ 100 UNIDADES BRANCO",
        marca: "BIODINAMICA"
      },
      {
        qtd: 3,
        codigo: "07399B",
        valor: 15.6,
        total: 46.8,
        status: "ativo",
        descricao: "BABADOR BEST CARE CX C/ 100 UNIDADES BRANCO",
        marca: "BIODINAMICA"
      },
      {
        qtd: 3,
        codigo: "07399B",
        valor: 15.6,
        total: 46.8,
        status: "ativo",
        descricao: "BABADOR BEST CARE CX C/ 100 UNIDADES BRANCO",
        marca: "BIODINAMICA"
      }
    ]
  }),
  created() {
    //this.$root.$emit("title", this.$rota.currentRoute.name);
  }, 
  methods: {
      onChangeTabs(event){
          // 1 = pedidos
          // 2 = orÃ§amentos
          console.log(event);
          
      }
  }
};
</script>