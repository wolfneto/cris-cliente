<template>
  <v-container>
    <v-card>
      <h4 class="text-center">Controle de Entregas</h4>
      <v-row justify="center" class="mt-n4">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-text-field
            autofocus
            full-width
            height="50pt"
            class="uppercase h4 ml-2 mr-2 mt-4"
            background-color="blue lighten-5"
            append-icon="fa-search"
            v-model="pedido"
            v-on:keyup.enter="setEntrega()"
            label="Numero do Pedido"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-n4">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-btn @click="$router.push('/estoque/entregas_relatorio')" block color="primary"
            ><v-icon left>fa-file-chart</v-icon>RelatÃ³rios</v-btn
          >
        </v-col>
      </v-row>
      <v-row justify="center" v-if="pedidos.length > 0">
        <v-col cols="12" sm="5" md="7" lg="7">
          <v-btn @click="salvar()" block color="success"
            ><v-icon left>fa-file-save</v-icon>Salvar</v-btn
          >
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row v-if="pedidos.length > 0" justify="center">
        <v-btn @click="reset_pedidos" color="warning"
          ><v-icon left>fa-trash-alt</v-icon>Limpar</v-btn
        >
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-data-table
          :headers="header"
          :items="pedidos"
          hide-default-footer
          dense
          no-data-text="NÃ£o hÃ¡ pedidos no momento."
        >
          <template v-slot:[`item.cliente`]="{ item }">
            <b>{{ item.cliente }}</b>
            <br />
            {{ item.endereco_completo }}
            <br />
            <b>Entregue em: {{ $moment_now() }}</b>
            <br />
            <b>Entregue por: {{ $usuario.value.usuario.toUpperCase() }}</b>
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ $money_format(item.total) }}
          </template>
          <template v-slot:[`item.dados`]="{ item }">
            <v-text-field
              label="Recebido por"
              height="10px"
              dense
              hide-details
              filled
              v-model="item.nome_recebedor"
            ></v-text-field>
            <v-text-field
              label="RG"
              height="10px"
              dense
              hide-details
              filled
              v-model="item.rg_recebedor"
            ></v-text-field>
          </template>

          <template v-slot:[`item.acao`]="{ item }">
            <v-btn @click="remove_pedido(item.numero_pedido)" icon color="error"
              ><v-icon>fa-times</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-row>
    </v-card>
    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <v-btn text @click="close_snackbar()">Fechar</v-btn>
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
    pedido: "",
    header: [
      {
        text: "NÂ° Pedido",
        align: "center",
        value: "numero_pedido",
      },
      { text: "Cliente", value: "cliente" },
      { text: "Grupo", value: "grupo" },
      { text: "Total", value: "total", align: "center" },
      { text: "Nota", value: "nota", align: "center" },
      { text: "Dados", value: "dados", align: "center" },
      { text: "Vendedor", value: "vendedor", align: "center" },
      { text: "AÃ§Ã£o", value: "acao" },
    ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      pedidos: (state) => state.estoque.pedidos,
      error: (state) => state.estoque.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["close_snackbar", "get_roteiro", "salvar_entregas"]),
    ...mapMutations([
      "set_loading",
      "set_snackbar",
      "reset_pedidos",
      "remove_pedido",
    ]),
    async salvar() {
      this.set_loading(true);
      await this.salvar_entregas({pedidos: this.pedidos, usuario: this.$usuario.value.usuario.toUpperCase()});
      this.set_loading(false);
      if (!this.error) {
        this.set_snackbar({
          show: true,
          msg: "Pedidos Entregues com Sucesso!",
          type: "success",
          time: 3000,
        });
        this.reset_pedidos();
      }
    },
    async setEntrega() {
      if (this.pedido.length < 7) {
        this.set_snackbar({
          show: true,
          msg: "Numero de Pedido Incorreto",
          type: "error",
          time: 3000,
        });
      } else if (
        this.pedidos.some((e) => e.numero_pedido === this.pedido.trim())
      ) {
        this.set_snackbar({
          show: true,
          msg: "Pedido JÃ¡ Adicionado",
          type: "warning",
          time: 3000,
        });
      } else {
        this.set_loading(true);
        await this.get_roteiro(this.pedido.toUpperCase());
        this.set_loading(false);
        this.pedido = "";
        console.log("oporra", this.pedidos);
      }
    },
  },
};
</script>
<style scoped>
</style>