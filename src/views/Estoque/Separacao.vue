<template>
  <v-container>
    <v-row class="ma-auto">
      <v-col>
        <v-card class="mx-auto mt-10" max-width="750">
          <v-card-text>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-row>
                  <v-col class="ml-0" cols="12" md="4" lg="4">
                    <v-text-field
                      v-on:keyup="checkPedidoEmSeparacao()"
                      v-model="numeroPedido"
                      placeholder="NÂ° Pedido"
                      v-mask="'######A'"
                      filled
                      dense
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <v-col class="ml-2" cols="12" md="4" lg="4">
                    <v-select
                      item-text="nome"
                      v-model="separador"
                      :items="separadores"
                      label="Separador"
                      return-object
                      filled
                      dense
                    ></v-select>
                  </v-col>
                  <v-col class="ml-10" cols="12" md="2" lg="2">
                    <v-btn
                      v-if="btnIniciarFinalizar"
                      color="success"
                      dark
                      class="ml-auto mt-2"
                      @click="iniciarSeparacao()"
                    >Iniciar</v-btn>
                    <v-btn
                      v-if="!btnIniciarFinalizar"
                      color="error"
                      dark
                      class="ml-1 mt-2"
                      @click="finalizarSeparacao()"
                    >Finalizar</v-btn>
                  </v-col>
                </v-row>
              </v-toolbar-title>
            </v-toolbar>

            <div class="mt-n0">
              <v-data-table
                :headers="headerPedidosEmSeparacao"
                :items="pedidosSeparacao"
                hide-default-footer
                dense
                no-data-text="Não há pedidos em separação no momento."
              ></v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-dialog v-model="dialogFinalizarSeparacao" width="400">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Atenção!</v-card-title>
          <br />
          <v-card-text>
            <b>Separação finalizada com sucesso!</b>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" small @click="dialogFinalizarSeparacao = false">finalizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    btnIniciarFinalizar: true,
    numeroPedido: "",
    finalizarPedidoSeparacao: "",
    separador: {},
    separadores: [{ nome: "FULANO" }, { nome: "SICLANO" }, { nome: "FULANO" }],
    headerPedidosEmSeparacao: [
      {
        text: "NÂ° Pedido",
        align: "left",
        value: "numero_pedido"
      },
      { text: "Status", value: "status" },
      { text: "Separador", value: "separador" }
    ],
    pedidosSeparacao: [],
    dialogFinalizarSeparacao: false
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    checkPedidoEmSeparacao() {
      if (this.numeroPedido.length >= 7) {
        let checkPedido = this.pedidosSeparacao.find(
          i => i.numero_pedido == this.numeroPedido
        );

        if (checkPedido) {
          this.btnIniciarFinalizar = false;
          this.finalizarPedidoSeparacao = checkPedido.numero_pedido;
        }
      } else {
        this.btnIniciarFinalizar = true;
      }
    },
    iniciarSeparacao() {
      if (this.numeroPedido.length >= 7 && this.separador.nome != null) {
        this.pedidosSeparacao.push({
          numero_pedido: this.numeroPedido,
          status: "SEPARANDO",
          separador: this.separador.nome
        });
        this.numeroPedido = "";
        this.separador = "";
      }
    },
    finalizarSeparacao() {
      this.pedidosSeparacao = this.pedidosSeparacao.filter(
        i => i.numero_pedido != this.finalizarPedidoSeparacao
      );
      this.dialogFinalizarSeparacao = true;
      this.btnIniciarFinalizar = true;
      this.numeroPedido = "";
      this.separador = "";
    }
  }
};
</script>