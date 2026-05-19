<template>
  <v-container>
    <ImprimirPedidoOrcamento
      v-show="showPrint"
      id="print"
    ></ImprimirPedidoOrcamento>
    <v-card>
      <v-card-title>
        <span v-if="status == 1">
          Orçamentos Externos <span class="warning--text">Pendentes</span>
        </span>
        <span v-else>
          Orçamentos Externos <span class="primary--text">Emitidos</span>
        </span>
        <v-btn text class="ml-5" color="success" @click="getPedidos()"
          ><v-icon left>fas fa-sync</v-icon> Atualizar</v-btn
        >
        <div class="flex-grow-1"></div>
        <v-text-field
          class="uppercase"
          v-model="search"
          v-on:keyup="find(search)"
          append-icon="fa-search"
          label="Busque por: Nome, CPF, Pedido ou Status"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-subtitle>
        <v-btn-toggle
          mandatory
          class="ml-3"
          @change="getPedidos()"
          dark
          v-model="status"
          tile
        >
          <v-btn small active-class="warning" :value="1">Pendentes</v-btn>
          <v-btn small active-class="primary" :value="2">Emitidos</v-btn>
        </v-btn-toggle>
      </v-card-subtitle>

      <q-virtual-scroll
        class="my-sticky-dynamic"
        type="table"
        dense
        style="max-height: 70vh"
        virtual-scroll
        :virtual-scroll-slice-size="30"
        :virtual-scroll-item-size="47"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="filteredPedidos"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headers" :key="'1--' + col.name">
                {{ col.label }}
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item: row, index }">
          <tr :key="index">
            <td
              :class="col.name == 'valor_total' ? 'width-td' : ''"
              v-for="col in headers"
              :key="index + '-' + col.name"
            >
              <div v-if="col.name == 'criado_em'">
                <v-sheet>{{ row.criado_em }}</v-sheet>
              </div>
              <div v-if="col.name == 'cliente'">
                <span>{{ row.cliente_obj.razao_social }}</span>
                <br />
                <span>{{ putMask(row.cliente_obj.cpf_cnpj, "cpf") }}</span>
                <br />
                <span>{{ row.cliente_obj.email }}</span>
                <br />
                <span>{{ putMask(row.cliente_obj.celular, "celular") }}</span>
              </div>
              <div v-if="col.name == 'obs'">
                <span v-if="row.obs != null">{{ row.obs.toUpperCase() }}</span>
              </div>
              <div v-if="col.name == 'pedido'">
                <span>{{ row.numero }}</span>
              </div>
              <div v-if="col.name == 'valor_total'">
                R$ {{ row.total.toFixed(2).replace(".", ",") }}
              </div>
              <div v-if="col.name == 'status'">
                <v-chip
                  @click="showStatus($event, row)"
                  :color="
                    colorStatusSistema(row.orcamento_pedido_status.descricao)
                  "
                  dark
                  >{{ row.orcamento_pedido_status.descricao }}</v-chip
                >
              </div>
              <div v-if="col.name == 'acao'">
                <v-btn
                  small
                  class="ma-1"
                  color="primary"
                  icon
                  @click="showBotoes($event, row)"
                >
                  <v-icon dark right>fa fa-bars</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </v-card>
    <!-- MENUS DA TABELA -->

    <!--- MENU BOTOES --->
    <v-menu
      v-model="showMenuBotoes"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="true"
      :close-on-click="true"
    >
      <v-list>
        <v-list-item v-if="objectItem.status == 1">
          <v-btn small class="ma-1" color="primary" @click="editar(objectItem)">
            Editar
            <v-icon dark right>far fa-edit</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item v-if="objectItem.status == 1">
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="confirmBaixar(objectItem)"
          >
            Emitir
            <v-icon dark right>fa-download</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item v-if="objectItem.status == 1">
          <v-btn
            small
            class="ma-1"
            color="error"
            @click="confirmDelete(objectItem)"
          >
            Excluir
            <v-icon dark right>fa-trash-alt</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="imprimir(objectItem)"
          >
            Imprimir
            <v-icon dark right>fa-print</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- MENU BOTOES -->
    <!-- MENUS DA TABELA -->
    <v-dialog v-model="dialogBaixar" persistent max-width="300">
      <v-card>
        <v-card-title class="headline error--text">Atenção!</v-card-title>
        <v-card-text
          >Deseja realmente enviar o pedido para o DC-INFO?</v-card-text
        >
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogBaixar = false">Não</v-btn>
          <v-btn color="success" text @click="baixarPedido(objectItem)"
            >Sim</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline error--text">Atenção!</v-card-title>
        <v-card-text>Deseja realmente excluir o pedido?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="excluirPedido(objectItem)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNumeroPedido" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">ATENÃ‡ÃƒO</span>
        </v-card-title>
        <v-card-text class="headline">
          {{ numeroPedido }}
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" text @click="dialogNumeroPedido = false"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEditar"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <EditarPedidoExterno
        v-on:close-dialog="
          dialogEditar = false;
          getPedidos();
        "
      ></EditarPedidoExterno>
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
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import ImprimirPedidoOrcamento from "./components/Pedido/ImprimirPedidoOrcamento";
import EditarPedidoExterno from "./components/Pedido/EditarPedidoExterno";
export default {
  components: {
    ImprimirPedidoOrcamento,
    EditarPedidoExterno,
  },
  data: () => ({
    valid: true,
    validReserva: true,
    search: "",
    status: 1,
    entregue: 0,
    headers: [
      {
        name: "criado_em",
        align: "center",
        label: "Data",
        sortable: true,
      },
      {
        name: "cliente",
        align: "center",
        label: "Cliente",
        sortable: true,
      },
      {
        name: "obs",
        align: "center",
        label: "Obs",
        sortable: true,
      },
      {
        name: "pedido",
        align: "center",
        label: "Pedido",
        sortable: true,
      },
      {
        name: "valor_total",
        align: "center",
        label: "Total",
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "Status Sistema",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "Ação",
        sortable: false,
      },
    ],
    print: false,
    dadosEndereco: {},
    dialogExcluir: false,
    dialogBaixar: false,
    dialogNumeroPedido: false,
    dialogEditar: false,
    objectIndex: -1,
    objectItem: {},
    filteredPedidos: [],
    showMenu: false,
    showMenuStatus: false,
    showMenuBotoes: false,
    x: 0,
    y: 0,
    numeroPedido: "",
    showPrint: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  mounted() {
    this.getPedidos();
  },
  computed: {
    ...mapGetters(["colorStatusSistema", "formatDateToExcel"]),
    ...mapState({
      pedidos: (state) => state.pedidoAtendimento.pedidos,
      pedido: (state) => state.pedidoAtendimento.pedido,
      error: (state) => state.pedidoAtendimento.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["get_pedidos_externo", "emitir_pedido_externo"]),
    ...mapMutations([
      "set_itens_pedido_editar",
      "set_itens_pedido_impressao",
      "set_previa",
      "set_cliente_impressao",
      "set_valor_total_itens_pedido",
      "set_qtd_total_itens_pedido",
      "set_pedido_externo",
      "set_pedido_editar",
      "set_index_tabs",
      "set_cliente",
      "set_item_null",
      "set_itens",
      "set_editar",
      "set_desconto",
      "set_tem_desconto",
      "set_snackbar",
      "set_loading"
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async editar(pedido) {
      await this.set_editar(true);
      await this.set_pedido_editar(pedido);
      await this.set_desconto(pedido.desconto);
      if (pedido.desconto != 0) {
        this.set_tem_desconto(true);
      }
      await this.set_valor_total_itens_pedido(pedido.total);
      await this.set_qtd_total_itens_pedido(pedido.orcamento_itens.length);
      await this.set_itens_pedido_editar(pedido.orcamento_itens);

      this.dialogEditar = true;
    },
    async imprimir(pedido) {
      await this.set_pedido_externo(pedido);
      await this.set_itens_pedido_impressao(pedido.orcamento_itens);
      pedido.cliente_obj.endereco_principal = pedido.cliente_endereco;
      await this.set_cliente_impressao(pedido.cliente_obj);
      await this.set_previa(false);
      console.log("oporra", this.pedido);
      this.showPrint = true;
      this.$htmlToPaper("print");
      this.showPrint = false;
    },
    showDialogCancelar(e, row) {
      e.preventDefault();
      this.dialogCancelar = false;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.dialogCancelar = true;
      });
    },
    show(e, row) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    showBotoes(e, row) {
      e.preventDefault();
      this.showMenuBotoes = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.showMenuBotoes = true;
      });
    },
    async showStatus(e, row) {
      e.preventDefault();
      if (row.status_aluno == "FATURADO" || row.status_aluno == "CONFERIDO") {
         this.set_loading(true);
        await this.getInfoPedidosSaldo(row.id_pedidos);
        await this.getStatusPedidoDcInfo(row);
        this.showMenuStatus = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.objectItem = { ...row };
        this.$nextTick(() => {
          this.showMenuStatus = true;
           this.set_loading(false);
        });
      } else if (
        this.status == 1 &&
        row.status_aluno != "CANCELADO" &&
        row.status_aluno != "RETIRADA"
      ) {
         this.set_loading(true);
        await this.getStatusPedidoDcInfo(row);
         this.set_loading(false);
      }
    },
    async getStatusPedidoDcInfo(row) {
      if (row.entregue == 0) {
        await this.get_status_pedido_dcinfo(row.pedido_dcinfo);
        row.status_aluno = this.alteraNomeStatus(
          this.statusPedidoDcInfo.ystatus
        );
        if (row.status_aluno == "CONFERIDO") {
          row.valor_faturado = parseFloat(this.statusPedidoDcInfo.yvaltot);
        }
      }
    },
    async getInfoPedidosSaldo(pedido) {
      this.empty_pedidosSaldoDcInfo();

      await this.get_info_pedido_saldo_dcinfo(pedido);
      console.log(this.pedidosSaldoDcInfo);
    },

    clearFilter(all) {
      this.filtroAtivoGrupo = "";
      this.filtroAtivoStatus = "";
      this.filtroAtivoSistema = "";
      this.selectedGrupo = [];
      this.selectedStatusPagamento = [];

      this.filteredPedidos = this.pedidos;
    },
    changeFilter() {
      console.log(this.selectedGrupo);
      if (
        this.selectedGrupo.length > 0 &&
        this.selectedStatusPagamento.length > 0
      ) {
        this.filteredPedidos = this.pedidos.filter(
          (p) =>
            this.selectedGrupo.includes(p.grupo) &&
            this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
        );
        this.filtroAtivoGrupo = this.selectedGrupo;
        this.filtroAtivoStatus = this.selectedStatusPagamento;
      } else if (this.selectedGrupo.length > 0) {
        this.filteredPedidos = this.pedidos.filter((p) =>
          this.selectedGrupo.includes(p.grupo)
        );
        this.filtroAtivoGrupo = this.selectedGrupo;
      } else if (this.selectedStatusPagamento.length > 0) {
        this.filteredPedidos = this.pedidos.filter((p) =>
          this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
        );
        this.filtroAtivoStatus = this.selectedStatusPagamento;
      } else {
        this.clearFilter();
      }
    },
    find() {
      if (this.search.length == 0) {
        this.clearFilter();
      }
      if (this.search && this.search.length >= 3) {
        let searchPedidoNome = [];
        let searchPedidoSobrenome = [];
        let searchPedidoCpf = [];
        let searchPedidoId = [];
        let searchPedidoStatus = [];

        searchPedidoNome = this.pedidos.filter((i) =>
          i.cliente_obj.razao_social.includes(this.search.toUpperCase())
        );
        if (searchPedidoNome.length) {
          this.filteredPedidos = searchPedidoNome;
        }

        searchPedidoSobrenome = this.pedidos.filter((i) =>
          i.cliente_obj.fantasia.includes(this.search.toUpperCase())
        );
        if (searchPedidoSobrenome.length) {
          this.filteredPedidos = searchPedidoSobrenome;
        }

        searchPedidoCpf = this.pedidos.filter((i) =>
          i.cliente_obj.cpf_cnpj.includes(this.search.toUpperCase())
        );
        if (searchPedidoCpf.length) {
          this.filteredPedidos = searchPedidoCpf;
        }

        searchPedidoId = this.pedidos.filter((i) =>
          i.numero.toString().includes(this.search)
        );
        if (searchPedidoId.length) {
          this.filteredPedidos = searchPedidoId;
        }

        searchPedidoStatus = this.pedidos.filter((i) =>
          i.orcamento_pedido_status.descricao.includes(
            this.search.toUpperCase()
          )
        );
        if (searchPedidoStatus.length) {
          this.filteredPedidos = searchPedidoStatus;
        }
      }
    },
    printInfo() {
      this.$htmlToPaper("print");
    },
    enviarEmailLink(item) {
       this.set_loading(true);
      this.$axios
        .post("/academico/pedido/emailLink", {
          pedido: item,
        })
        .then((res) => {
           this.set_loading(false);
          item.menuBoleto = false;
          item.menuLink = false;
          if (res.data) {
            this.set_snackbar({
              show: true,
              msg: "Email Enviado com Sucesso!",
              type: "success",
              time: 3000,
            });
          } else {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          }
        })
        .catch((err) => {
           this.set_loading(false);
          console.log(err);
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        });
    },
    confirmBaixar(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);

      this.dialogBaixar = true;
    },

    async baixarPedido(item) {
      this.dialogBaixar = false;
      item.usuario = this.$usuario.value;
      console.log(item);
     

       this.set_loading(true);
      await this.emitir_pedido_externo(item);
       this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        if (this.pedido.duplicate) {
          let numeros = "";
          this.pedido.data.forEach((element) => {
            numeros += element.ynumero + " ";
          });
          this.numeroPedido = "PEDIDO BAIXO EM DUPLICIDADE: " + numeros;
        } else {
          this.numeroPedido = "PEDIDO BAIXADO: " + this.pedido.data.ynumero;
        }
        this.dialogNumeroPedido = true;
        this.getPedidos();
      }
    },
    confirmDelete(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    excluirPedido(item) {
      this.dialogExcluir = false;
      this.set_loading(true);
      this.$axios
        .delete("/pedido", {
          data: {
            dados: {
              id: this.objectItem.id,
              usuario: this.$usuario.value.usuario.toUpperCase(),
            },
          },
        })
        .then((res) => {
           this.set_loading(false);
          if (res.data != false) {
             this.set_loading(false);
            this.set_snackbar({
              show: true,
              msg: "Orçamento Excluido!",
              type: "success",
              time: 0,
            });
            this.getPedidos();
          } else {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          }
        })
        .catch((err) => {
           this.set_loading(false);
          console.log(err);
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        });
    },
    putMask(item, type) {
      if (type == "cpf") {
        if (item.length < 14) {
          return this.$mask.apply(item, "000.000.000-00");
        } else {
          return this.$mask.apply(item, "00.000.000/0000-00");
        }
      } else if (type == "telefone") {
        return this.$mask.apply(item, "(00) 0000-0000");
      } else if (type == "celular") {
        return this.$mask.apply(item, "(00) 0 0000-0000");
      }
    },
    async getPedidos() {
       this.set_loading(true);
      await this.get_pedidos_externo({
        status: this.status,
        usuario: this.$usuario.value,
      });
       this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        console.log(this.pedidos);
        this.filteredPedidos = this.pedidos;
      }
    },
    async excel(tipo) {
       this.set_loading(true);
      let json = [];

      await this.getPedidos();
      let pedidos = this.filteredPedidos;
      if (tipo == "reserva_paga") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("RESERVA PAGA")
        );
      } else if (tipo == "reservado") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("RESERVADO")
        );
      } else if (tipo == "boleto_em_aberto") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("EM ABERTO")
        );
      } else if (tipo == "boleto_pago") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("BOLETO PAGO")
        );
      } else if (tipo == "pago") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("CREDITO PAGO")
        );
      } else {
        for (let item of pedidos) {
          let obj = {};

          obj.data = this.formatDateToExcel(
            item.data_pedido + " " + item.hora_pedido
          );
          obj.data_status = this.formatDateToExcel(
            item.data_pedido_dcinfo + " 06:00:00"
          );
          obj.on_line = item.id_pedidos;
          obj.dc_info = item.pedido_dcinfo;
          obj.nome = item.aluno.nome + " " + item.aluno.sobrenome;
          obj.grupo = item.grupo;
          obj.valor_pedido = parseFloat(item.valor_total);
          obj.valor_boleto = 0;
          obj.valor_cobrado = 0;
          obj.status_pgto = item.pagamento.status_pagamento;
          obj.status_sistema = item.status_aluno;
          obj.valor_conf_fat = item.valor_faturado;
          obj.faturado_em = this.formatDateToExcel(
            item.faturado_em + " 06:00:00"
          );
          if (item.credito != null) {
            if (item.credito.status == "CONFIRMED") {
              obj.data_cobranca = this.formatDateToExcel(
                item.credito.confirm_date
              );
              obj.valor_cobrado = item.credito.amount;
              obj.parcelas =
                item.credito.bandeira +
                " - " +
                item.credito.number_installments +
                "x";
              obj.autorizacao = item.credito.terminal_nsu;
              obj.n_comprovante = item.credito.acquirer_transaction_id;
            } else if (item.credito.status == "AUTHORIZED") {
              obj.parcelas =
                item.credito.bandeira +
                " - " +
                item.credito.number_installments +
                "x";
              obj.autorizacao = item.credito.terminal_nsu;
              obj.n_comprovante = item.credito.acquirer_transaction_id;
            }
          } else if (item.boleto != null) {
            if (item.boleto.status == "PENDING") {
            } else if (item.boleto.status == "PAGO") {
              obj.valor_boleto = item.boleto.amount;
              obj.documento = item.boleto.document_number;
              obj.nosso_numero = item.boleto.our_number;
              obj.desconto_aplicado = item.boleto.desconto;
              obj.status_em = this.formatDateToExcel(item.boleto.issue_date);
              obj.vencimento_em = this.formatDateToExcel(
                item.boleto.expiration_date
              );
              obj.recebido_em = this.formatDateToExcel(item.boleto.received_at);
            }
          }

          json.push(obj);
        }
      }

       this.set_loading(false);

      const jsonKeys = Object.keys(json[0]);
      let objectMaxLength = [];
      for (let i = 0; i < json.length; i++) {
        let value = json[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(json, { dateNF: "DD/MM/YYYY" });
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 12 }; // tamanho da coluna para data
      // ws["!cols"][2] = { wch: 9 };
      ws["!cols"][11] = { wch: 17 }; // tamanho da coluna para data
      ws["!cols"][22] = { wch: 17 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_" + tipo); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_" + tipo + ".xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },

    alteraNomeStatus(status) {
      let retorno = "";
      switch (status) {
        case "2":
          retorno = "status";
          break;
        case "3":
          retorno = "status";
          break;
        case "13":
          retorno = "SEPARANDO";
          break;
        case "17":
          retorno = "SEPARADO"; //PARCIAL
          break;
        case "8":
          retorno = "SEPARADO";
          break;
        case "14":
          retorno = "CONFERINDO";
          break;
        case "11":
          retorno = "PAUSADO"; // pausado
          break;
        case "9":
          retorno = "CONFERIDO";
          break;
        case "4":
          retorno = "FATURADO";
          break;
        case "10":
          retorno = "CANCELADO";
          break;
        case "1":
          retorno = "PENDENTE";
          break;
        case "7":
          retorno = "SALDO";
          break;

        default:
          break;
      }

      return retorno;
    },
  },
};
</script>
<style>
.v-text-field__prefix {
  padding: 4px 4px 8px !important;
  color: #000000 !important;
}
.warning-conferido {
  background: rgb(2, 0, 36) !important;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 87%,
    rgba(250, 247, 0, 1) 87%
  ) !important;
}
.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: normal !important;
}
.width-td {
  width: 100px;
}
</style>