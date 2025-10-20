<template>
  <v-container>
    <v-tabs @change="atualizar()" v-model="tab" dense grow>
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        active-class="blue darken-2 white--text"
        v-for="item in tabs"
        :key="item.id"
      >
        <v-icon class="mr-2">{{ item.icon }}</v-icon>
        {{ item.text }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabs" :key="item.id">
        <component
          :ref="item.component == 'Status' ? 'status' : ''"
          :key="item.component == 'Pedido' ? cliente_selected.selecionado : ''"
          v-bind:is="item.component"
        ></component>
      </v-tab-item>
    </v-tabs-items>

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
import { mapState, mapMutations, mapActions } from "vuex";
// import Clientes from "./components/Clientes";
// import Itens from "./components/Itens";
// import Financeiro from "./components/Financeiro";
// import Historico from "./components/Historico";
// import Comercial from "./components/Comercial";
import Status from "./components/Status";
import Pedido from "./components/PedidoExterno";
export default {
  components: {
    // Clientes,
    // Itens,
    // Financeiro,
    // Historico,
    // Comercial,
    Status,
    Pedido,
  },
  data: () => ({
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    expanded: [],
    search: "",
    itemCodigo: "",
    itemDescricao: "",
    produtos: [],
    produto: {},
    clientesSearch: [],
    tabs: [
      // { id: 1, text: "Clientes", icon: "fa-users", component: "Clientes" },
      // { id: 2, text: "Itens", icon: "fa-info", component: "Itens" },
      // {
      //   id: 3,
      //   text: "Financeiro",
      //   icon: "fa-dollar-sign",
      //   component: "Financeiro"
      // },
      // { id: 4, text: "Histórico", icon: "fa-history", component: "Historico" },
      // {
      //   id: 5,
      //   text: "Comercial",
      //   icon: "fa-cart-arrow-down",
      //   component: "Comercial"
      // },
      {
        id: 1,
        text: "Status",
        icon: "fab fa-free-code-camp",
        component: "Status",
      },
      { id: 2, text: "Pedido", icon: "fa-list", component: "Pedido" },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.get_permissoes({
      id_usuario: this.$usuario.value.id,
      pagina: "pedido_externo",
    });
  },

  computed: {
    ...mapState({
      cliente_selected: (state) => state.cliente.cliente_selected,
    }),
    tab: {
      get() {
        return this.$store.state.index_tabs;
      },
      set(value) {
        this.set_index_tabs(value);
      },
    },
  },

  methods: {
    ...mapMutations(["set_index_tabs"]),
    ...mapActions(["get_permissoes", "get_pedidos_externo"]),
    async atualizar() {
      if (this.tab == 0) {
        await this.$refs.status[0].getPedidos();
      }
    },
  },
};
</script>
<style  scoped>
.fixed-tabs-bar .v-tabs__bar {
  position: -webkit-sticky;
  position: sticky;
  top: 4rem;
  z-index: 2;
}
</style>