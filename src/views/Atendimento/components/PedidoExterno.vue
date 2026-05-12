<template>
  <v-container class="mt-1">
    <v-dialog v-model="dialogBuscarCliente">
      <BuscarCliente
        v-on:close-dialog-cliente="dialogBuscarCliente = false"
      ></BuscarCliente>
    </v-dialog>
    <div>
      <ImprimirPedidoOrcamento
        v-show="showPrint"
        id="print"
      ></ImprimirPedidoOrcamento>
      <v-row justify="space-between">
        <v-col cols="12" align-self="center" class="text-center">
          <v-dialog persistent v-model="dialogCadastrar">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-4"
                style="margin-bottom: 15px"
                height="15"
                color="success"
                v-on="on"
                text
                ><v-icon left>fas fa-user-plus</v-icon>Cadastrar Cliente</v-btn
              >
            </template>
            <FormCadastroCliente
              v-if="dialogCadastrar"
              :showBtnVoltar="true"
              v-on:close-dialog="dialogCadastrar = false"
              v-on:close-continue-dialog="continueToOrcamento()"
            ></FormCadastroCliente>
          </v-dialog>
          <v-btn
            v-if="itens_pedido.length > 0 && cliente.selected === true"
            class="ml-4 mr-4"
            style="margin-bottom: 15px"
            height="15"
            text
            color="primary"
            @click="imprimir()"
          >
            <v-icon left>fa-print</v-icon> Imprimir OrÃ§amento
          </v-btn>
          <v-btn
            class="ml-4 mr-4"
            style="margin-bottom: 15px"
            height="15"
            text
            color="primary"
            @click="salvarPedido()"
          >
            <v-icon left>fa-save</v-icon> Salvar OrÃ§amento
          </v-btn>
          <v-btn
            class="ml-4 mr-4"
            style="margin-bottom: 15px"
            height="15"
            text
            color="error"
            @click="dialogLimpar = true"
          >
            <v-icon left>fa-undo-alt</v-icon> Limpar OrÃ§amento
          </v-btn>
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
            v-model="cliente.codigo"
            @keyup="findClienteByCod(cliente.codigo)"
            append-outer-icon="fa-search"
            @click:append-outer="dialogBuscarCliente = true"
            @click="$event.target.select()"
            label="CÃ³digo do Cliente"
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
            v-model="cliente.razao_social"
            @click="dialogBuscarCliente = true"
            label="Cliente"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            autocomplete="nope"
            height="12"
            @keyup="checkCpfCnpj(cliente.cpf_cnpj)"
            v-model="cliente.cpf_cnpj"
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
            readonly
            v-model="cliente.email"
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
            @keyup="getCep(cliente.endereco_principal)"
            hint="Digite somento nÃºmeros"
            v-model="cliente.endereco_principal.cep"
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
            v-model="cliente.endereco_principal.logradouro"
            label="EndereÃ§o"
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
            v-model="cliente.endereco_principal.numero"
            label="NÃºmero"
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
            v-model="cliente.telefone"
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
            v-model="cliente.celular"
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
            v-model="cliente.observacao"
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
            v-model="cliente.endereco_principal.complemento"
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
            v-model="cliente.endereco_principal.bairro"
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
            v-model="cliente.endereco_principal.cidade"
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
            v-model="cliente.endereco_principal.uf"
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
            label="ObservaÃ§Ã£o"
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
                placeholder="CÃ³digo"
                v-on:keyup="findProdutoByCod($event)"
                v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                label="CÃ³digo"
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
                label="Buscar por: DescriÃ§Ã£o"
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
                ref="cancel"
                dark
                icon
                text
                color="error"
                @click="cancelarEdicao()"
              >
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-dialog v-model="dialogItens">
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
                      placeholder="CÃ³digo"
                      v-on:keyup="findProdutoByCod($event)"
                      v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                      label="CÃ³digo"
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
                      label="Buscar por: DescriÃ§Ã£o"
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
                      ref="cancel"
                      dark
                      icon
                      text
                      color="error"
                      @click="cancelarEdicao()"
                    >
                      <v-icon>fas fa-times</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <TabelaItensExterno
              v-on:page-up="$refs.cod.focus()"
              v-on:close="dialogItens = false"
              ref="tabelaItem"
            ></TabelaItensExterno>
          </v-dialog>

          <v-card>
            <div class="text-center red darken-4 caption">
              <h6>
                <b class="white--text">Itens do Pedido</b>
              </h6>
            </div>
            <TabelaItensPedidoExterno></TabelaItensPedidoExterno>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialogLimpar" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text class="headline">
          Deseja realmente limpar o orÃ§amento?
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogLimpar = false">NÃƒO</v-btn>
          <v-btn color="success" text @click="limpar()">SIM</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNovoPedido" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">Pedido Salvo com Sucesso!</span>
        </v-card-title>
        <v-card-text class="headline"> O que deseja fazer? </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="novoPedido(true)">LIMPAR</v-btn>
          <v-btn color="success" text @click="novoPedido(false)"
            >MANTER CLIENTE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogItemRepetido" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">AtenÃ§Ã£o!</span>
        </v-card-title>
        <v-card-text class="h5"
          >O item que vocÃª estÃ¡ tentando substituir jÃ¡ consta no
          pedido.</v-card-text
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
  </v-container>
</template>
<script>
import FormCadastroCliente from "./components/Cliente/FormCadastroClientePedidoExterno";
import TabelaItensExterno from "./components/Pedido/TabelaItensExterno";
import BuscarCliente from "./components/Cliente/BuscarCliente";
import TabelaItensPedidoExterno from "./components/Pedido/TabelaItensPedidoExterno";
import ImprimirPedidoOrcamento from "./components/Pedido/ImprimirPedidoOrcamento";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: {
    FormCadastroCliente,
    TabelaItensExterno,
    TabelaItensPedidoExterno,
    ImprimirPedidoOrcamento,
    BuscarCliente,
  },
  data: () => ({
    dialogItens: false,
    dialogBuscarCliente: false,
    dialogCadastrar: false,
    dialogLimpar: false,
    dialogNovoPedido: false,
    showPrint: false,
    cepPrincipalLoading: false,
    isCnpj: true,
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
      desconto: "desconto",
    }),
    ...mapState({
      pedido: (state) => state.pedidoAtendimento.pedido,
      next_id: (state) => state.pedidoAtendimento.next_id,
      itens: (state) => state.pedidoAtendimento.itens,
      item: (state) => state.pedidoAtendimento.item,
      cliente: (state) => state.cliente.cliente,
      vendedores: (state) => state.cliente.vendedores,
      error: (state) => state.pedidoAtendimento.error,
      item_repetido: (state) => state.pedidoAtendimento.item_repetido,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions([
      "get_pedido",
      "getProdutos",
      "getProdutoByCod",
      "get_atividades",
      "get_vendedores",
      "update_cliente",
      "save_orcamento",
      "delete_pedido",
      "get_cliente_by_cod",
      "calcular_itens_pedido",
      "get_next_id",
    ]),
    ...mapMutations([
      "set_deselect_cliente",
      "set_empty_cliente",
      "set_cliente",
      "set_pedido_externo",
      "set_itens_pedido",
      "set_itens_pedido_impressao",
      "set_cliente_impressao",
      "set_cliente_selected",
      "push_itens_pedido",
      "set_item_null",
      "change_itens_pedido",
      "set_qtd_total_itens_pedido",
      "set_valor_total_itens_pedido",
      "check_item_repetido",
      "set_snackbar",
      "set_loading",
      "set_previa",
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    limpar(novo) {
      this.set_valor_total_itens_pedido(0);
      this.set_qtd_total_itens_pedido(0);
      this.set_empty_cliente();
      this.set_pedido_externo({ editar: false });
      this.set_itens_pedido([]);
      this.dialogLimpar = false;
      this.set_snackbar({
        show: true,
        msg: "OrÃ§amento Limpo!",
        type: "success",
        time: 3000,
      });
    },

    async novoPedido(novo) {
      if (novo) {
        this.set_valor_total_itens_pedido(0);
        this.set_qtd_total_itens_pedido(0);
        this.set_empty_cliente();
        this.set_pedido_externo({ editar: false });
        this.set_itens_pedido([]);
      } else {
        this.set_valor_total_itens_pedido(0);
        this.set_qtd_total_itens_pedido(0);
        this.set_pedido_externo({ editar: false });
        this.set_itens_pedido([]);
      }
      await this.get_next_id();
      this.dialogNovoPedido = false;
    },

    async imprimir() {
      await this.set_itens_pedido_impressao(this.itens_pedido);
      await this.set_cliente_impressao(this.cliente);
      await this.set_previa(true);
      this.showPrint = true;
      this.$htmlToPaper("print");
      this.showPrint = false;
    },

    async salvarPedido() {
      if (!this.cliente.selected) {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Cliente Selecionado",
          type: "error",
          time: 0,
        });
      } else if (this.itens_pedido.length == 0) {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Item no Pedido",
          type: "error",
          time: 0,
        });
      } else {
        this.set_loading(true);
        await this.get_next_id();
        let objPedido = {
          numero: this.next_id,
          obs: this.pedido.obs,
        };
        let orcamento = {
          desconto: this.desconto,
          valor_total: this.valor_total_pedido,
          pedido: objPedido,
          cliente: this.cliente,
          itens: this.itens_pedido,
          usuario: this.$usuario.value,
        };
        console.log("salvar", orcamento);
        await this.save_orcamento(orcamento);
        this.set_loading(false);
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "NÃ£o Foi PossÃ­vel Salvar o OrÃ§amento",
            type: "error",
            time: 0,
          });
        } else {
          this.set_snackbar({
            show: true,
            msg: "OrÃ§amento Salvo Com Sucesso!",
            type: "success",
            time: 3000,
          });
          this.dialogNovoPedido = true;
          // modal para proximo passo, tirar novo pedido para mesmo cliente? novo pedido novo cliente
        }
      }
    },

    async salvarCliente() {
      if (this.$refs.formCliente.validate()) {
        delete this.cliente.endereco_principal.id;
        delete this.cliente.endereco_principal.cep_ok;
        delete this.cliente.endereco_principal.disabled;

        this.cliente.cliente_enderecos = [];

        this.cliente.cliente_enderecos.push(this.cliente.endereco_principal);

        // if (this.enderecosEntrega.length > 0) {
        //   this.enderecosEntrega.forEach((item) => {
        //     delete item.id;
        //     delete item.cep_ok;
        //     delete item.disabled;
        //     this.cliente.cliente_enderecos.push(item);
        //   });
        // }

        // if (this.contatos.length > 0) {
        //   this.cliente.cliente_contatos = [];
        //   this.contatos.forEach((item) => {
        //     delete item.id;
        //     delete item.acao;
        //     item.codigo_cliente = this.cliente.codigo;
        //     this.cliente.cliente_contatos.push(item);
        //   });
        // }
        this.cliente.editado_por = this.$usuario.value.usuario.toUpperCase();

        this.set_loading(true);

        await this.update_cliente(this.cliente);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          this.set_snackbar({
            show: true,
            msg: "Cliente Atualizado Com Sucesso!",
            type: "success",
            time: 3000,
          });
        }

        this.set_loading(false);
      }
    },

    // loadEnderecosEntrega() {
    //   if (this.cliente.enderecos_entrega.length == 0) {
    //     this.enderecosEntrega.push({
    //       id: 1,
    //       codigo_cliente: this.cliente.codigo,
    //       tipo: 2,
    //       logradouro: "",
    //       numero: "",
    //       complemento: "",
    //       bairro: "",
    //       cidade: "",
    //       uf: "",
    //       cep: "",
    //       text: "",
    //       acao: "",
    //       cep_ok: false,
    //       disabled: true,
    //     });
    //   } else {
    //     this.enderecosEntrega = this.cliente.enderecos_entrega;
    //   }
    // },

    // loadContatos() {
    //   if (this.cliente.cliente_contatos.length == 0) {
    //     this.contatos.push({
    //       id: 1,
    //       nome: "",
    //       email: "",
    //       telefone: "",
    //       celular: "",
    //       obs: "",
    //       acao: "",
    //     });
    //   } else {
    //     this.contatos = this.cliente.cliente_contatos;
    //   }
    // },

    // addContato() {
    //   let id = 1;
    //   if (this.contatos.length > 0) {
    //     id = this.contatos.length + 1;
    //   }
    //   let contato = {
    //     id: id,
    //     nome: "",
    //     email: "",
    //     telefone: "",
    //     celular: "",
    //     obs: "",
    //     acao: "",
    //   };

    //   this.contatos.push(contato);
    // },

    // deleteContato(contato) {
    //   if (this.contatos.length > 1) {
    //     this.contatos = this.contatos.filter((item) => {
    //       return item.id != contato.id;
    //     });

    //     for (let i = 0; i < this.contatos.length; i++) {
    //       this.contatos[i].id = i + 1;
    //     }
    //   } else {
    //     this.contatos = [];
    //   }
    // },

    // addEnderecoEntrega() {
    //   let id = 1;

    //   if (this.enderecosEntrega.length > 0) {
    //     id = this.enderecosEntrega[this.enderecosEntrega.length - 1].id + 1;
    //   }

    //   let endereco = {
    //     id: id,
    //     codigo_cliente: "",
    //     tipo: 2,
    //     logradouro: "",
    //     numero: "",
    //     complemento: "",
    //     bairro: "",
    //     cidade: "",
    //     uf: "",
    //     cep: "",
    //     text: "",
    //     acao: "",
    //     cep_ok: false,
    //     disabled: true,
    //   };

    //   endereco.text = endereco.logradouro + ", " + endereco.numero;

    //   this.enderecosEntrega.push(endereco);
    // },

    // deleteEnderecoEntrega(endereco) {
    //   if (this.enderecosEntrega.length > 1) {
    //     this.enderecosEntrega = this.enderecosEntrega.filter((item) => {
    //       return item.id != endereco.id;
    //     });

    //     for (let i = 0; i < this.enderecosEntrega.length; i++) {
    //       this.enderecosEntrega[i].id = i + 1;
    //     }
    //   } else {
    //     this.enderecosEntrega = [];
    //   }
    // },

    checkCpfCnpj(cpfCnpj) {
      // nao vai ser usado por enquanto
      // if (cpfCnpj.length > 14) {
      //   this.isCnpj = true;
      //   this.cliente.tipo = 2;
      // } else {
      //   this.isCnpj = false;
      //   this.cliente.tipo = 1;
      // }
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
                msg: "Cep InvÃ¡lido",
                type: "warning",
                time: 3000,
              });
              return;
            }

            // if (item.tipo == 1) {
            this.cepPrincipalLoading = false;
            this.cliente.endereco_principal.logradouro = res.data.logradouro.toUpperCase();
            this.cliente.endereco_principal.bairro = res.data.bairro.toUpperCase();
            this.cliente.endereco_principal.cidade = res.data.localidade.toUpperCase();
            this.cliente.endereco_principal.uf = res.data.uf.toUpperCase();
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
    // voltar() {
    //   this.set_deselect_cliente();
    //   this.telaPedidoOrcamento = false;
    // },
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
    nextItemPedido(event) {},
    prevItemPedido(event) {},
    selectItemPedido(item) {},

    async findClienteByCod() {
      if (this.cliente.codigo.length == 5) {
        await this.get_cliente_by_cod(this.cliente.codigo);
        if (this.error) {
          console.log("vazio");
          this.set_snackbar({
            show: true,
            msg: "Cliente nÃ£o encontrado",
            type: "warning",
            time: 3000,
          });
        }
        console.log(this.cliente);
      }
      // if (this.cliente.length > 0) {

      // }else{
      //   console.log("tamo nada");
      // }
      // console.log(this.cliente);
    },
    // showDialogSearch() {
    //   // global
    // },
    // async showPedidoOrcamento() {
    //   console.log(this.numero);

    //   await this.get_pedido(this.numero);

    //   if (this.error) {
    //     console.log("deu erro");
    //   } else {
    //     console.log(this.pedido);
    //     //this.pedido.isOrcamento = true;
    //     //this.pedido.isPedido = false;
    //     this.set_cliente_selected(this.pedido.clientes[0]);
    //     this.telaPedidoOrcamento = true;
    //   }
    // },
    // showTelaPedidoOrcamento(tipo) {
    //   console.log(this.cliente);
    //   if (tipo.isPedido) {
    //     this.pedido.isPedido = true;
    //     this.pedido.isOrcamento = false;
    //   } else {
    //     this.pedido.isOrcamento = true;
    //     this.pedido.isPedido = false;
    //   }
    //   this.telaPedidoOrcamento = true;
    // },

    // clearSelect() {
    //   this.itens.forEach((item) => {
    //     item.selected = false;
    //     item.status_color = "white";
    //   });
    // },
    // showDadosItem(item) {
    //   this.objectIndex = this.itens.indexOf(item);
    //   this.objectItem = Object.assign({}, item);
    //   this.dialogDadosItem = true;
    // },
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
          this.dialogItens = true;
          this.getProdutos(this.item.descricao);
        }, 500);
      }
    },
  },
};
</script>
<style>
.v-text-field__prefix {
  color: #ffa726;
}
.height-lupa .v-input__append-outer {
  height: 5px;
  margin-top: -15px;
}
.upper input {
  text-transform: uppercase;
}
</style>