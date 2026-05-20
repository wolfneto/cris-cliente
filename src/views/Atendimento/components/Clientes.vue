<template>
  <v-container>
    <v-card>
      <v-card-title>
        Clientes
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog persistent v-model="dialogCadastrar">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Novo Cliente</v-btn>
          </template>
          <FormCadastroCliente
            v-if="dialogCadastrar"
            :showBtnVoltar="true"
            v-on:close-dialog="dialogCadastrar = false"
            v-on:close-continue-dialog="continueToOrcamento()"
          ></FormCadastroCliente>
        </v-dialog>
        <div class="flex-grow-1"></div>
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              autofocus
              v-model="searchAll"
              @keyup="searchCliente($event.target.value, $event)"
              prepend-icon="fa-search"
              label="Nome, CPF, CNPJ"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="searchCod"
              @keyup.enter="searchClienteByCod($event.target.value)"
              prepend-icon="fa-user"
              label="Código"
              v-mask="'#####'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <q-virtual-scroll
        type="table"
        dense
        style="max-height: 65vh"
        :virtual-scroll-item-size="24"
        :virtual-scroll-sticky-size-start="24"
        :virtual-scroll-sticky-size-end="16"
        :items="clientes"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headers" :key="'1--' + col.text">{{ col.text }}</th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item: row, index }">
          <tr
            @click="selectCliente(row, index)"
            dense
            :class="row.selected ? 'blue lighten-4' : ''"
            :key="index"
          >
            <td v-for="col in headers" :key="index + '-' + col.text">
              <div v-if="col.value == 'cpf_cnpj'">{{ putMask(row[col.value], 'cpf/cnpj') }}</div>
              <div v-else-if="col.value == 'telefone'">{{ putMask(row[col.value], 'telefone') }}</div>
              <div v-else-if="col.value == 'celular'">{{ putMask(row[col.value], 'celular') }}</div>
              <div v-else>{{ row[col.value] }}</div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
      <!-- <v-data-table
        height="450"
        fixed-header
        item-key="codigo"
        locale="pt-PT"
        :loading="loading"
        :page.sync="page"
        loading-text="Carregando... Espere por favor"
        :headers="headers"
        :items="clientes"
        :items-per-page="itensPerPage"
        :server-items-length="totalClientes"
        :options.sync="options"
        :no-data-text="'Nenhum cliente encontrado'"
        hide-default-footer
        @page-count="pageCount = $event"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr :class="item.selected ? 'blue lighten-4' : ''" @click="selectCliente(item)">
            <td>{{item.codigo}}</td>
            <td>{{ putMask(item.cpf_cnpj, 'cpf/cnpj') }}</td>
            <td>{{item.razao_social}}</td>
            <td>{{item.fantasia}}</td>
            <td>{{ putMask(item.telefone, 'telefone') }}</td>
            <td>{{ putMask(item.celular, 'celular') }}</td>
            <td>{{item.email}}</td>
          </tr>
        </template>
      </v-data-table>-->
      <!-- <div class="text-center mt-3">
        <v-pagination
          @next="set_cliente(null)"
          prev-icon="fa-caret-left"
          next-icon="fa-caret-right"
          :total-visible="5"
          v-model="page"
          :length="pageCount"
        ></v-pagination>
      </div>-->
    </v-card>
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
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import FormCadastroCliente from "./components/Cliente/FormCadastroCliente";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    FormCadastroCliente,
    QVirtualScroll
  },

  data: () => ({
    dialogCadastrar: false,
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    searchAll: "",
    searchCod: "",
    page: 1,
    hideFooter: false,
    itensPerPage: 10,
    options: {},
    pageCount: 0,
    headers: [
      {
        text: "Codigo",
        sortable: true,
        value: "codigo"
      },
      {
        text: "CPF/CNPJ",
        sortable: true,
        width: 160,
        value: "cpf_cnpj"
      },
      {
        text: "Razão Social",
        sortable: true,
        value: "razao_social"
      },
      {
        text: "Fantasia",
        sortable: true,
        value: "fantasia"
      },
      {
        text: "Telefone",
        sortable: true,
        width: 160,
        value: "telefone"
      },
      {
        text: "Celular",
        sortable: true,
        width: 160,
        value: "celular"
      },
      {
        text: "E-Mail",
        sortable: true,
        value: "email"
      }
    ]
  }),
  mounted() {
    this.getClientes();
  },
  computed: {
    ...mapState({
      tab: state => state.index_tabs,
      error: state => state.cliente.error,
      clientes: state => state.cliente.clientes,
      cliente: state => state.cliente.cliente,
      totalClientes: state => state.cliente.total_clientes
    })
  },
  methods: {
    ...mapActions(["get_clientes", "get_cliente", "get_cliente_by_code"]),
    ...mapMutations([
      "set_cliente",
      "set_total_clientes",
      "set_cliente_selected",
      "set_index_tabs"
    ]),

    continueToOrcamento() {
      this.dialogCadastrar = false;
      this.set_index_tabs(6);
    },

    selectCliente(item) {
      this.clearSelect();
      if (item.selected == false) {
        item.selected = true;
        //colocar o set cliente aqui oporra
        this.set_cliente(item);
        this.set_cliente_selected(item);
        this.searchAll = item.razao_social;
        this.searchCod = item.codigo;
      } else {
        item.selected = false;
      }
    },
    clearSelect() {
      this.clientes.forEach(cliente => {
        cliente.selected = false;
      });
    },
    async searchCliente(value, event) {
      if (value.length > 3) {
        if (event.key != "Backspace") {
          this.loading = true;

          try {
            await this.get_cliente({ value: value, vendedor: this.$usuario.value.vendedor });
            if (this.error) {
              // mostrar msg erro com snakbar
              console.log("erro interno");
            } else {
              if (this.clientes.length == 1) {
                console.log(this.clientes[0]);

                this.clientes[0].selected = true;
                this.set_cliente(this.clientes[0]);
                this.searchAll = this.clientes[0].razao_social;
                this.searchCod = this.clientes[0].codigo;
              }
              this.hideFooter = true;
              this.itensPerPage = this.clientes.length;
            }
          } catch (error) {
            console.log(error);
            // mostrar msg erro com snakbar
          }

          this.loading = false;
        }
      } else if (value.length == 0) {
        this.hideFooter = false;
        this.getClientes();
      }
    },
    async searchClienteByCod(value) {
      this.loading = true;
      try {
        await this.get_cliente_by_code(value);
        this.searchAll = this.clientes[0].razao_social;
        this.searchCod = this.clientes[0].codigo;

        this.hideFooter = true;
        this.itensPerPage = this.clientes.length;
      } catch (error) {
        // mostrar msg erro com snakbar
      }
      this.loading = false;
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

    async getClientes() {
      //this.cliente = null;
      this.loading = true;
      await this.get_clientes(this.$usuario.value);
      this.loading = false;
    }
  }
};
</script>