<template>
  <v-container>
    <v-row class="d-flex flex-row justify-center">
      <v-col cols="12" md="4">
        <div class="d-flex justify-center title">Buscar por Clientes</div>
        <v-text-field
          @keyup.enter="buscarPedidos($event.target.value, 'cliente')"
          class="input-uppercase"
          label="Código"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <div class="d-flex justify-center title">Buscar por Pedido</div>
        <v-text-field
          v-mask="'######A'"
          class="input-uppercase"
          @keyup.enter="buscarPedidos($event.target.value, 'pedido')"
          label="Número do Pedido"
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <div v-if="mostraLinkPedido">
      <v-row class="custom-row d-flex justify-center">
        <v-col cols="12" md="1">
          <v-text-field
            v-model="pedido.yCodCli"
            label="Código"
            readonly
            filled
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="pedido.yNomCli"
            label="Nome"
            readonly
            filled
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="cliente.yEmail1"
            label="E-mail"
            readonly
            filled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="custom-row d-flex justify-center">
        <v-col cols="12" md="2">
          <v-text-field
            v-model="cliente.yCGCCPF"
            label="CPF/CNPJ"
            readonly
            filled
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            :success="pedido.yStatus == 4 ? true : false"
            :error="pedido.yStatus == 4 ? false : true"
            :color="pedido.yStatus == 4 ? 'primary' : 'error'"
            :suffix="pedido.yStatus == 4 ? 'FATURADO' : 'NÃO FATURADO'"
            v-model="pedido.yNumero"
            label="Pedido"
            readonly
            filled
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            ref="price"
            v-money="$money"
            v-model="valor"
            label="Valor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="1">
          <v-select
            v-model="parcelas"
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
            label="Parcelas"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="formasPagamento"
            :items="arrayFormasPagamento"
            label="Formas de pagamento"
            outlined
            @change="selectFormasPagamentoChange()"
          ></v-select>
        </v-col>
      </v-row>
      
      <v-row
        v-if="boletoSelected"
        class="custom-row d-flex justify-center mb-6"
      >
        <v-col cols="12" md="9">
          <v-textarea
            class="text-uppercase"
            no-resize
            rows="3"
            outlined
            counter
            label="Observações do Boleto"
            :rules="[(va) => va.length <= 800 || 'Maximo 800 caracteres']"
            v-model="descricaoBoleto"
          ></v-textarea>
        </v-col>
      </v-row>
      <!-- <v-row
        v-else
        class="custom-row d-flex justify-center mb-6"
      >
        <v-col cols="12" md="9">
          <v-textarea
            class="text-uppercase"
            no-resize
            rows="3"
            outlined
            counter
            label="Descrição P/ Painel Iugu"
            :rules="[(va) => va.length <= 800 || 'Maximo 800 caracteres']"
            v-model="descricaoIugu"
          ></v-textarea>
        </v-col>
      </v-row> -->
      <v-row class="justify-center mt-6">
        <v-btn @click="gerarLink()" :disabled="disabledBtn" color="success"
          >Gerar</v-btn
        >
        <!-- <v-btn @click="reserva ? checkReserva():gerarLink()"  :disabled="disabledBtn" color="success">Gerar</v-btn> -->
      </v-row>
    </div>
    <div v-if="mostrarClientesPedidos">
      {{ pedidosNaoPagos }}
      <v-data-table
        v-model="pedidosSelected"
        :headers="headersPedidos"
        :items="pedidosCliente"
        item-key="yNumero"
        show-select
        hide-default-footer
        :items-per-page="pedidosCliente.length"
        class="elevation-1"
      >
        <template v-slot:top="{ items }">
          <v-container>
            <v-row class="custom-row">
              <v-col cols="12" md="1">
                <v-text-field
                  v-model="cliente.yCodCli"
                  label="Código"
                  readonly
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="cliente.yNomCli"
                  label="Nome"
                  readonly
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="cliente.yEmail1"
                  label="E-mail"
                  readonly
                  filled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="custom-row">
              <v-col cols="12" md="2">
                <v-text-field
                  :value="$put_mask(cliente.yCGCCPF, 'cpf')"
                  label="CPF/CNPJ"
                  readonly
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  ref="price2"
                  v-money="$money"
                  v-model="valor"
                  label="Valor"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-select
                  v-model="parcelas"
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                  label="Parcelas"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  :disabled="pedidosSelected.length ? false : true"
                  v-model="formasPagamento"
                  :items="arrayFormasPagamento"
                  label="Formas de pagamento"
                  outlined
                  @change="selectFormasPagamentoChange()"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  @click="gerarLink()"
                  large
                  :disabled="disabledBtn"
                  color="success"
                  >Gerar</v-btn
                >
                <!-- <v-btn @click="reserva ? checkReserva():gerarLink()" large :disabled="disabledBtn" color="success">Gerar</v-btn> -->
              </v-col>
            </v-row>
            <v-row v-if="boletoSelected" class="custom-row mb-6">
              <v-col cols="12" md="12">
                <v-textarea
                  class="text-uppercase"
                  no-resize
                  rows="3"
                  outlined
                  counter
                  label="Observações do Boleto"
                  :rules="[(v) => v.length <= 800 || 'Maximo 800 caracteres']"
                  v-model="descricaoBoleto"
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- <v-row v-else class="custom-row mb-6">
              <v-col cols="12" md="12">
                <v-textarea
                  class="text-uppercase"
                  no-resize
                  rows="3"
                  outlined
                  counter
                  label="Descrição P/ Painel Iugu"
                  :rules="[(v) => v.length <= 800 || 'Maximo 800 caracteres']"
                  v-model="descricaoIugu"
                ></v-textarea>
              </v-col>
            </v-row> -->
          </v-container>
        </template>
        <template v-slot:item.yStatus="{ item }">
          <v-chip v-if="item.yStatus == 4" color="success" dark
            >FATURADO</v-chip
          >
          <v-chip v-else color="error" dark>NÃO FATURADO</v-chip>
        </template>
        <template v-slot:item.yValTot="{ item }">
          <div>
            {{ $money_format(item.yValTot) }}
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- <v-dialog v-model="dialogReserva" persistent max-width="600">
      <v-card>
        <v-card-title class="headline error--text">ATENÇÃO</v-card-title>
        <v-card-text>
         <div class="title">
           Você está criando um link em que sera feita uma <br> <span class="error--text">RESERVA</span> no cartão do cliente e <span class="error--text">NÃO UMA COBRANÇA</span>
         <br>
         Você tem certeza disso?
         </div>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="danger" text @click="dialogReserva = false">Voltar</v-btn>
          <v-btn color="success" text @click="gerarLink(); dialogReserva = false">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->
    <v-dialog v-model="dialogEmail" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Link Criado Com Sucesso!</v-card-title>
        <v-card-text>
          <span>{{ urlLink }}</span>
          <v-btn @click="copyLink()" text icon color="pink">
            <v-icon>fa-copy</v-icon>
          </v-btn>
          <input type="hidden" id="linkCopy" :value="urlLink" />
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="danger" text @click="dialogEmail = false">Voltar</v-btn>
          <v-btn color="success" text @click="enviarEmail()"
            >Enviar E-Mail</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
export default {
  data: () => ({
    permissoes: {},
    cliente: 0,
    codigoLink: 0,
    urlLink: "",
    iugu: false,
    retornoIugu: {},
    dialogEmail: false,
    //dialogReserva: false,
    disabledBtn: true,
    mostraLinkPedido: false,
    mostrarClientesPedidos: false,
    parcelas: 1,
    formasPagamento: 0,
    boletoSelected: false,
    descricaoBoleto: "",
    descricaoIugu: "",
    //reserva: false,
    arrayFormasPagamento: [
      { text: "Boleto", value: 1 },
      { text: "Credito", value: 2 },
      // { text: "Reserva", value: 3 },
      { text: "Pix", value: 4 },
    ],
    valor: 0,
    loading: false,
    snackbar: false,
    msgSnackbar: "",
    typeSnackbar: "",
    timeSnackbar: 0,
    pedido: {},
    pedidosCliente: [],
    pedidosSelected: [],
    headersPedidos: [
      {
        text: "Pedidos",
        value: "yNumero",
        width: "50",
      },
      {
        text: "Status",
        value: "yStatus",
        width: "50",
      },
      {
        text: "Valor",
        value: "yValTot",
      },
    ],
  }),
  watch: {
    pedidosSelected: function (pedidos) {
      if (pedidos.length > 0) {
        this.disabledBtn = false;
        let total = 0.0;
        let obs = "";
        pedidos.forEach((pedido) => {
          total += parseFloat(pedido.yValTot);
          pedido.cliente = this.cliente;
          obs += pedido.yNumero + " ";
        });
        this.descricaoBoleto = obs;
        this.$refs.price2.$el.getElementsByTagName("input")[0].value =
          total.toFixed(2);
      } else {
        this.disabledBtn = true;
        this.descricaoBoleto = "";
      }
    },
  },
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
  },
  computed: {
    pedidosNaoPagos: function () {
      function compare(a, b) {
        if (a.yNumero > b.yNumero) return -1;
        if (a.yNumero < b.yNumero) return 1;
        return 0;
      }
      return this.pedidosCliente
        .filter((item) => !item.hasOwnProperty("yValTot"))
        .sort(compare);
    },
  },
  methods: {
    selectFormasPagamentoChange() {
      if (this.formasPagamento === 1) {
        this.boletoSelected = true;
        if (!this.mostrarClientesPedidos) {
          this.descricaoBoleto = this.pedido.yNumero.trim() + " ";
        }
      } else {
        this.descricaoBoleto = "";
        this.boletoSelected = false;
      }
      // AQUI MUDA IUGU PARA SAFRA
      if (this.formasPagamento === 2) {
        this.iugu = true;
      }
    },
    copyLink() {
      let copy = document.querySelector("#linkCopy");
      copy.setAttribute("type", "text");
      copy.select();
      try {
        let success = document.execCommand("copy");
        if (success) {
          this.showSnackbar("Link Copiado", "success", 2000);
        } else {
          this.showSnackbar("Erro ao Copiar", "error");
        }
      } catch (error) {
        this.showSnackbar(error, "error");
      }

      copy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    enviarEmail() {
      if (!this.iugu) {
        this.dialogEmail = false;
        this.loading = true;
        this.$axios
          .post("/cliente/pagamento/email", {
            pedidos: this.pedidosCliente,
            codigo_link: this.codigoLink,
          })
          .then((res) => {
            this.loading = false;
            console.log("", res.data);
            if (res.data == true) {
              this.showSnackbar("Email Enviado com Sucesso!", "success", 2000);
            } else {
              this.showSnackbar("Erro ao Enviar Email", "warning");
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    // checkReserva() {
    //   this.dialogReserva = true;
    // },
    gerarLink() {
      let pedidos = [];
      console.log("oba", this.valor.replace(/\D/g, ""));
      if (this.valor.replace(/\D/g, "") > 0) {
        if (this.formasPagamento == 0) {
          this.showSnackbar("Selecione Uma Forma de Pagamento", "warning");
        } else {
          this.loading = true;
          if (this.pedidosSelected.length > 0) {
            pedidos = this.pedidosSelected;
          } else {
            this.pedido.cliente = this.cliente;
            pedidos.push(this.pedido);
          }
          this.$axios
            .post("/cliente/pagamento/gerarLink", {
              pedidos: pedidos,
              valor: this.valor,
              parcelas: this.parcelas,
              formasPagamento: this.formasPagamento,
              descricaoBoleto: this.descricaoBoleto,
              descricaoIugu: this.descricaoIugu,
              iugu: this.iugu,
            })
            .then((res) => {
              this.pedidosCliente = res.data.pedidos;
              if (this.iugu) {
                this.retornoIugu = res.data.iugu;
                this.urlLink = this.retornoIugu.url;
              } else {
                this.urlLink =
                  "https://solident.com.br/pagamento/" +
                  res.data.pedidos[0].pagamento.codigo_link;
              }

              this.codigoLink = this.iugu
                ? this.retornoIugu.external_reference
                : res.data.pedidos[0].pagamento.codigo_link;
              this.dialogEmail = true;
              this.loading = false;
              this.mostraLinkPedido = false;
              this.mostrarClientesPedidos = false;
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      } else {
        this.showSnackbar("Valor Incorreto", "warning");
      }
    },
    async buscarPedidos(value, type) {
      this.pedidosSelected = [];
      this.valor = 0;
      if (type == "pedido") {
        if (value.length == 5 || value.length == 7) {
          this.loading = true;
          let retornoPedido;
          let cliente = "";
          if (value.length == 7) {
            retornoPedido = await this.$axios.get(
              "http://solident.ddns.net:36730/dc-info/API/pedido?pedido=" +
                value
            );
          } else if (value.length == 5) {
            retornoPedido = await this.$axios.get(
              "http://solident.ddns.net:36730/dc-info/API/pedido?seupedido=ON-LINE%200" +
                value
            );

            if (retornoPedido.data.length == 0) {
              let resPedido = await this.$axios.get("/academico/pedido", {
                params: {
                  numero_online: value,
                },
              });
              if (
                resPedido.data.length != 0 &&
                resPedido.data.length != "undefined"
              ) {
                let resAluno = await this.$axios.get("/aluno/getAluno", {
                  params: {
                    cpf: resPedido.data.cpf_aluno,
                  },
                });
                console.log("cacete", resPedido.data, resAluno.data);
                retornoPedido.data[0] = resPedido.data;
                cliente = resAluno.data; // preencher com os YseilaDoFred, ver logs do cliente abaixo
              }
            }
          }

          if (retornoPedido.data.length > 0) {
            this.mostraLinkPedido = true;
            this.mostrarClientesPedidos = false;
            let pedido = retornoPedido.data[0];
            if (cliente.length == 0) {
              let retornoCliente = await this.$axios.get(
                "http://solident.ddns.net:36730/dc-info/API/clientefornecedor?codigo=" +
                  pedido.yCodCli
              );
              console.log(retornoCliente);
              cliente = retornoCliente.data[0];
            }

            this.disabledBtn = false;
            this.pedido = pedido;
            this.cliente = cliente;
            this.valor = pedido.yValTot * 100;
            this.$refs.price.$el.getElementsByTagName("input")[0].value =
              pedido.yValTot;
            
          } else {
            this.disabledBtn = true;
            this.showSnackbar("Pedido Não Encontrado!", "warning");
          }
          this.loading = false;
        } else {
          this.pedido = {};
          this.showSnackbar("Número do Pedido Inválido", "warning");
          this.disabledBtn = true;
        }
      } else {
        this.mostraLinkPedido = false;
        this.disabledBtn = true;
        this.loading = true;
        let retornoCliente = await this.$axios.get(
          "http://solident.ddns.net:36730/dc-info/API/clientefornecedor?codigo=" +
            value
        );
        if (retornoCliente.data.length > 0) {
          this.cliente = retornoCliente.data[0];

          let retornoPedido = await this.$axios.get(
            "http://solident.ddns.net:36730/dc-info/API/pedido?codigocliente=" +
              this.cliente.yCodCli
          );
          this.pedidosCliente = retornoPedido.data;
          if (this.pedidosCliente.length > 0) {
            this.parcelas = 1;
            this.valor = 0;
            this.mostrarClientesPedidos = true;

            console.log("cliente", this.cliente);
            console.log("pedidos", this.pedidosCliente);
          } else {
            this.pedidosCliente = [];
            this.showSnackbar("Nenhum Pedido Encontrado", "warning");
            this.disabledBtn = true;
          }
        } else {
          this.cliente = {};
          this.showSnackbar("Nenhum Cliente Encontrado", "warning");
          this.disabledBtn = true;
        }
        this.loading = false;
      }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "gerar_pagamento",
          },
        })
        .then((res) => {
          this.permissoes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped></style>
