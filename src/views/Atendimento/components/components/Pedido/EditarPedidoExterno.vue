<template>
  <div>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Editar Orçamento</v-toolbar-title>
        <v-btn @click="salvar()" class="ml-5" color="success" x-large text>
          <v-icon left>fa-save</v-icon> Salvar
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text color="error" x-large @click="close()">
            <v-icon left>fa-times</v-icon> Voltar
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <div class="ma-5">
        <ImprimirPedidoOrcamento
          v-show="showPrint"
          id="print"
        ></ImprimirPedidoOrcamento>
        <v-row justify="space-between">
          <v-col cols="2" align-self="start">
            <v-text-field
              color="orange lighten-1"
              height="12"
              dense
              hide-details
              readonly
              v-model="pedido.numero"
              label="Número do Orçamento"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              autocomplete="nope"
              readonly
              hide-details
              height="12"
              class="height-lupa"
              v-model="pedido.cliente_obj.codigo"
              @click="$event.target.select()"
              label="Código do Cliente"
              v-mask="'#####'"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field
              height="12"
              autocomplete="nope"
              dense
              hide-details
              readonly
              v-model="pedido.cliente_obj.razao_social"
              label="Cliente"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              autocomplete="nope"
              height="12"
              v-model="pedido.cliente_obj.cpf_cnpj"
              label="CPF/CNPJ"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              readonly
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              autocomplete="nope"
              height="12"
              dense
              hide-details
              v-model="pedido.cliente_obj.email"
              label="E-Mail"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <v-text-field
              dense
              type="search"
              autocomplete="off"
              height="12"
              hide-details
              @keyup="getCep(pedido.cliente_endereco)"
              hint="Digite somento números"
              v-model="pedido.cliente_endereco.cep"
              label="Cep"
              :loading="cepPrincipalLoading"
              ref="cep_principal"
              v-mask="'#####-###'"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="search"
              autocomplete="off"
              dense
              height="12"
              hide-details
              class="input-uppercase"
              hint="Rua, Avenida, Estrada..."
              v-model="pedido.cliente_endereco.logradouro"
              label="Endereço"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
              type="search"
              autocomplete="off"
              dense
              height="12"
              hide-details
              v-model="pedido.cliente_endereco.numero"
              label="Número"
              ref="numero_principal"
              required
              v-mask="'####'"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              height="12"
              type="search"
              autocomplete="off"
              dense
              hide-details
              v-model="pedido.cliente_obj.telefone"
              label="Telefone"
              v-mask="'(##)####-####'"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              height="12"
              type="search"
              autocomplete="off"
              dense
              hide-details
              v-model="pedido.cliente_obj.celular"
              label="Celular"
              v-mask="'(##)#####-####'"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              height="12"
              type="search"
              autocomplete="off"
              dense
              hide-details
              v-model="pedido.cliente_obj.observacao"
              label="Contato"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              type="search"
              autocomplete="off"
              height="12"
              hide-details
              class="input-uppercase"
              v-model="pedido.cliente_endereco.complemento"
              label="Complemento"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              type="search"
              autocomplete="off"
              hide-details
              height="12"
              class="input-uppercase"
              v-model="pedido.cliente_endereco.bairro"
              label="Bairro"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              type="search"
              autocomplete="nope"
              hide-details
              height="12"
              class="input-uppercase"
              v-model="pedido.cliente_endereco.cidade"
              label="Cidade"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
              type="search"
              autocomplete="off"
              dense
              height="12"
              hide-details
              class="input-uppercase"
              v-model="pedido.cliente_endereco.uf"
              label="Estado"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              type="search"
              autocomplete="off"
              height="40"
              hide-details
              class="input-uppercase"
              v-model="pedido.obs"
              label="Observação"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row style="background: #1976d2; color: white">
          <v-col cols="12" class="md-12">
            <v-row
              class="ml-2 mr-2"
              :class="item.editing ? 'yellow lighten-2' : ''"
            >
              <v-col cols="1">
                <v-text-field
                  dark
                  autocomplete="nope"
                  type="number"
                  min="1"
                  dense
                  ref="qtd"
                  id="qtd"
                  hide-details
                  v-model="item.qtd"
                  placeholder="Qtd"
                  label="Qtd"
                  required
                  @click="$event.target.select()"
                  @keydown.enter="$refs.cod.focus"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  dark
                  autocomplete="nope"
                  ref="cod"
                  @keydown.enter="$refs.descricao.focus"
                  dense
                  hide-details
                  v-model="item.codigo"
                  placeholder="Código"
                  v-on:keyup="findProdutoByCod($event)"
                  v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                  label="Código"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  dark
                  ref="descricao"
                  autocomplete="nope"
                  @keydown.enter="$refs.valor.focus"
                  dense
                  autofocus
                  hide-details
                  v-on:keyup="findProduto($event)"
                  v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                  v-model="item.descricao"
                  label="Buscar por: Descrição"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="1">
              <v-text-field
                ref="valor"
                @keydown.enter="$refs.add.$el.focus"
                dense
                hide-details
                v-model="item.valor"
                label="Valor"
              ></v-text-field>
            </v-col> -->
              <v-col cols="1">
                <v-btn
                  ref="add"
                  dark
                  icon
                  text
                  color="white"
                  @click="addItemPedido()"
                >
                  <v-icon>fa-check</v-icon>
                </v-btn>

                <v-btn
                  v-if="item.editing"
                  dark
                  ref="cancel"
                  icon
                  text
                  color="error"
                  @click="cancelarEdicao()"
                >
                  <v-icon>fas fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <TabelaItensExterno
              v-on:page-up="$refs.cod.focus()"
              ref="tabelaItem"
            ></TabelaItensExterno>
            <v-card>
              <div class="text-center red darken-4 caption">
                <h6>
                  <b class="white--text">Itens do Orçamento</b>
                </h6>
              </div>
              <TabelaItensPedidoExterno></TabelaItensPedidoExterno>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-dialog v-model="dialogItemRepetido" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">Atenção!</span>
        </v-card-title>
        <v-card-text class="h5"
          >O item que você está tentando substituir já consta no
          orçamento.</v-card-text
        >
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogItemRepetido = false"
            >Entendi</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <v-btn text @click="closeSnackbar()">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import TabelaItensExterno from "./TabelaItensExterno";
import TabelaItensPedidoExterno from "./TabelaItensPedidoExterno";
import ImprimirPedidoOrcamento from "./ImprimirPedidoOrcamento";
export default {
  components: {
    TabelaItensExterno,
    TabelaItensPedidoExterno,
    ImprimirPedidoOrcamento,
  },
  data: () => ({
    showPrint: false,
    cepPrincipalLoading: false,
    dialogItemRepetido: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapGetters({
      itens_pedido: "itensPedido",
      qdt_total_pedido: "qtdItens",
      valor_total_pedido: "totalPedido",
      desconto: "desconto"
    }),
    ...mapState({
      pedido: (state) => state.pedidoAtendimento.pedido_editar,
      itens: (state) => state.pedidoAtendimento.itens,
      item: (state) => state.pedidoAtendimento.item,
      cliente: (state) => state.pedido.cliente_obj.cliente,
      error: (state) => state.pedidoAtendimento.error,
      item_repetido: (state) => state.pedidoAtendimento.item_repetido,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["getProdutos", "getProdutoByCod", "calcular_itens_pedido", "edit_orcamento"]),
    ...mapMutations([
      "set_deselect_cliente",
      "set_empty_cliente",
      "set_cliente",
      "set_pedido_editar",
      "set_itens",
      "set_itens_pedido_editar",
      "set_itens_pedido_impressao",
      "set_cliente_selected",
      "push_itens_pedido",
      "set_item_null",
      "change_itens_pedido",
      "set_qtd_total_itens_pedido",
      "set_valor_total_itens_pedido",
      "check_item_repetido",
      "set_snackbar",
      "set_loading",
      "set_editar",
      "set_tem_desconto"
    ]),
    async close() {
      //Object.assign(this.$data, defaultData());
      // this.dialogContinuar = false;

      this.$emit("close-dialog");
      // await this.set_pedido_editar({});
      await this.set_itens_pedido_editar([]);
      await this.set_editar(false);
      await this.set_tem_desconto(false);
      await this.set_item_null();
      await this.set_itens([]);
      // await this.set_qtd_total_itens_pedido(0);
      // await this.set_valor_total_itens_pedido(0);
    },
    async salvar(){
      if (this.pedido.orcamento_itens.length == 0) {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Item no Orçamento",
          type: "error",
          time: 0,
        });
      } else {
        this.set_loading(true);
        let orcamento = {
          desconto: this.desconto,
          valor_total: this.valor_total_pedido,
          pedido: this.pedido,
          usuario: this.$usuario.value,
        };
        await this.edit_orcamento(orcamento)
        console.log('salvar', orcamento);
        this.set_loading(false);
        this.set_snackbar({
          show: true,
          msg: "Orçamento Salvo!",
          type: "success",
          time: 3000,
        });
      }
      
    },
    findProdutoByCod(event) {
      if (
        this.item.codigo &&
        this.item.codigo.length >= 4 &&
        event.key != "PageDown" &&
        event.key != "PageUp"
      ) {
        this.item.descricao = "";
        this.item.valido = false;
        setTimeout(() => {
          this.getProdutoByCod(this.item.codigo);
        }, 800);
      }
    },
    findProduto(event) {
      if (
        this.item.descricao &&
        this.item.descricao.length >= 4 &&
        event.key != "PageDown" &&
        event.key != "PageUp"
      ) {
        this.item.codigo = "";
        this.item.valido = false;
        setTimeout(() => {
          this.getProdutos(this.item.descricao);
        }, 500);
      }
    },
    addItemPedido() {
      if (this.item.valido) {
        if (this.item.qtd == 0) {
          this.item.qtd = 1;
        }
        let ordem = this.itens_pedido.length;
        let insertProduto = {};

        insertProduto.ordem = ordem;
        insertProduto.qtd = this.item.qtd;
        insertProduto.codigo = this.item.codigo;
        insertProduto.descricao = this.item.descricao;
        insertProduto.saldo = this.item.saldo;
        insertProduto.marca = this.item.marca;
        insertProduto.valor = this.item.valor;
        insertProduto.valor_original = this.item.valor;
        insertProduto.valor_ultima_compra = this.item.valor_ultima_compra;
        insertProduto.ipi = this.item.ipi;
        insertProduto.valor_fabricante = this.item.valor_fabricante;
        insertProduto.desconto_original = this.item.desconto;
        insertProduto.total =
          parseInt(this.item.qtd) * parseFloat(this.item.valor);

        if (this.item.editing) {
          this.check_item_repetido(insertProduto);
          if (this.item_repetido) {
            this.dialogItemRepetido = true;
          } else {
            this.item.desconto = "";
            this.item.valor_original = this.item.valor;
            this.item.editing = false;
            this.item.total =
              parseInt(this.item.qtd) * parseFloat(this.item.valor);
            this.change_itens_pedido(this.item);
          }
        } else {
          this.push_itens_pedido(insertProduto);

          //this.$refs.qtd.focus();
          //document.querySelector("#qtd").select();
        }
        this.calcular_itens_pedido();
        this.set_item_null();
      }
    },
    cancelarEdicao() {
      this.item.codigo = "";
      this.item.descricao = "";
      this.item.editing = false;
    },
    getCep(item) {
      if (item.cep.length == 9) {
        // if (item.tipo == 1) {
        //   this.cepPrincipalLoading = true;
        // }
        // else {
        //   this.cepEntregaLoading = true;
        // }

        item.cep = item.cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + item.cep + "/json/")
          .then((res) => {
            if (res.data.erro) {
              //   if (item.tipo == 1) {
              this.cepPrincipalLoading = false;
              this.$refs.cep_principal.focus();
              //   }
              //   else {
              //     this.cepEntregaLoading = false;
              //   }
              this.set_snackbar({
                show: true,
                msg: "Cep Inválido",
                type: "warning",
                time: 3000,
              });
              return;
            }

            // if (item.tipo == 1) {
            this.cepPrincipalLoading = false;
            this.pedido.cliente_endereco.logradouro = res.data.logradouro.toUpperCase();
            this.pedido.cliente_endereco.bairro = res.data.bairro.toUpperCase();
            this.pedido.cliente_endereco.cidade = res.data.localidade.toUpperCase();
            this.pedido.cliente_endereco.uf = res.data.uf.toUpperCase();
            this.$refs.numero_principal.focus();
            // } else {
            // //   item.cep_ok = true;
            // //   item.logradouro = res.data.logradouro.toUpperCase();
            // //   item.bairro = res.data.bairro.toUpperCase();
            // //   item.cidade = res.data.localidade.toUpperCase();
            // //   item.uf = res.data.uf.toUpperCase();
            // }
          })
          .catch((err) => {
            this.cepPrincipalLoading = false;
            console.log(err);
          });
      } else {
        item.cep_ok = false;
        item.disabled = true;
        item.logradouro = "";
        item.bairro = "";
        item.cidade = "";
        item.uf = "";
      }
    },
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
  },
};
</script>