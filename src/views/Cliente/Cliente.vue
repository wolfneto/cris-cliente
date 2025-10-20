<template>
  <v-container>
    <v-card>
      <v-card-title>
        Clientes
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialogCadastrar">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on"
              >Novo Cliente</v-btn
            >
          </template>
          <Cadastrar
            v-if="dialogCadastrar"
            :showBtnVoltar="true"
            v-on:close-dialog="dialogCadastrar = false"
          ></Cadastrar>
        </v-dialog>
        <div class="flex-grow-1"></div>
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              autocomplete="nope"
              autofocus
              @keyup="searchCliente($event.target.value, 'all')"
              prepend-icon="fa-search"
              label="Nome, CPF, CNPJ"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              autocomplete="nope"
              @keyup="searchCliente($event.target.value, 'cod')"
              prepend-icon="fa-user"
              label="Código"
              v-mask="'#####'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        show-expand
        single-expand
        :expanded.sync="expanded"
        item-key="codigo"
        locale="pt-PT"
        :loading="loading"
        loading-text="Carregando... Espere por favor"
        :headers="headers"
        :items="clientes"
        :items-per-page="itensPerPage"
        :server-items-length="totalClientes"
        :options.sync="options"
        :no-data-text="'Nenhum cliente encontrado'"
        :hide-default-footer="hideFooter"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50, 100],
          itemsPerPageText: 'Clientes por pagina',
        }"
        class="elevation-1"
      >
        <template v-slot:expanded-item="{ item }">
          <td colspan="3">
            <b>Tipo:</b>
            {{ item.cliente_tipo.descricao }}
          </td>
          <td colspan="3">
            <b>Atividade:</b>
            {{ item.cliente_atividade.descricao }}
          </td>
          <td colspan="3">
            <b>Condição:</b>
            <span v-if="item.condicao">ATIVO</span>
            <span v-else>BLOQUEADO</span>
          </td>
        </template>
        <template v-slot:item.cpf_cnpj="{ item }">{{
          putMask(item.cpf_cnpj, "cpf/cnpj")
        }}</template>
        <template v-slot:item.telefone="{ item }">{{
          putMask(item.telefone, "telefone")
        }}</template>
        <template v-slot:item.celular="{ item }">{{
          putMask(item.celular, "celular")
        }}</template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import Cadastrar from "./components/Cadastrar";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    Cadastrar,
  },
  data: () => ({
    dialogCadastrar: false,
    hideFooter: false,
    itensPerPage: 10,
    options: {},
    pageCount: 0,
    expanded: [],
    search: "",
    clientesSearch: [],
    headers: [
      {
        text: "Codigo",
        sortable: true,
        value: "codigo",
      },
      {
        text: "CPF/CNPJ",
        sortable: true,
        width: 160,
        value: "cpf_cnpj",
      },
      {
        text: "Razão Social",
        sortable: true,
        value: "razao_social",
      },
      {
        text: "Fantasia",
        sortable: true,
        value: "fantasia",
      },
      {
        text: "Telefone",
        sortable: true,
        width: 160,
        value: "telefone",
      },
      {
        text: "Celular",
        sortable: true,
        width: 160,
        value: "celular",
      },
      {
        text: "E-Mail",
        sortable: true,
        value: "email",
      },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  watch: {
    options: {
      handler() {
        this.buscarClientes();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      clientes: (state) => state.cliente.clientes,
      totalClientes: (state) => state.cliente.total,
      loading: (state) => state.cliente.loading,
    }),
  },
  mounted() {
    this.buscarClientes();
  },
  methods: {
    ...mapActions(["getClientes", "findCliente", "findClienteByCod"]),
    searchCliente(value, type) {
      if (value.length > 3) {
        if (type == "all") {
          this.findCliente(value);
        } else {
          this.findClienteByCod(value);
        }

        this.hideFooter = true;
        this.itensPerPage = this.totalClientes;
      } else if (value.length == 0) {
        this.hideFooter = false;
        this.buscarClientes();
      }
    },
    putMask(item, type) {
      if (type == "cpf/cnpj") {
        if (item.length < 14) {
          return this.$mask.apply(item, "000.000.000-00");
        } else {
          return this.$mask.apply(item, "00.000.000/0000-00");
        }
      }
      if (type == "telefone") {
        return this.$mask.apply(item, "(00) 0000-0000");
      }
      if (type == "celular") {
        return this.$mask.apply(item, "(00) 0 0000-0000");
      }
    },
    buscarClientes() {
      this.getClientes(this.options);
    },
  },
};
</script>