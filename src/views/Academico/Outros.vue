<template>
  <v-container fluid>
    <v-card class="mx-auto">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            class="uppercase ma-2"
            append-icon="fa-search"
            v-model="search"
            @keydown.enter="getPedidos()"
            @click="$event.target.select()"
            label="Buscar por CPF"
            hide-details
            dense
            filled
            rounded
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-alert v-if="aluno_pedido_outros" type="success" text>
            <h6>
              {{ aluno_pedido_outros.nome }}
              {{ aluno_pedido_outros.sobrenome }} -
              {{ aluno_pedido_outros.grupo }}
            </h6>
          </v-alert>
        </v-col>
      </v-row>
      <v-data-table
        v-if="aluno_pedido_outros.pedidos"
        hide-default-footer
        :items-per-page="-1"
        :headers="headersPedidosOutros"
        :items="aluno_pedido_outros.pedidos"
        class="elevation-1"
        fixed-header
        height="500px"
        dense
      >
        <template v-slot:top>
          <v-toolbar flat color="white" dense>
            <v-toolbar-title>Pedidos Outros</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <div class="flex-grow-1"></div>
          </v-toolbar>
        </template>
        <template v-slot:item.id_pedidos="{ item }">
          <b># {{ item.id_pedidos }}</b>
        </template>
        <template v-slot:item.cpf_aluno="{ item }">
          <span>{{ putMask(item.cpf_aluno) }}</span>
        </template>
        <template v-slot:item.valor_total="{ item }">
          <b>R$ {{ item.valor_total }}</b>
        </template>
        <template v-slot:item.itempedidos="{ item }">
          <v-btn class="ma-1" small depressed>
            <v-icon
              small
              color="primary"
              @click="verPagamento(item.itempedidos)"
              >fas fa-list-ol</v-icon
            >
          </v-btn>
        </template>
        <template v-slot:item.acao="{ item }">
          <v-btn class="ma-1" small depressed>
            <v-icon small color="primary" @click="dialogEnviarPedido(item)"
              >far fa-paper-plane</v-icon
            >
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog1" width="75%">
      <v-card>
        <v-card-title class="text-h5">
          <span>Itens do Pedido</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <div>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                    Qtd
                  </th>
                  <th class="text-left">
                    Codigo
                  </th>
                  <th class="text-left">
                    Descrição
                  </th>
                  <th class="text-left">
                    Marca
                  </th>
                  <th class="text-left">
                    Valor
                  </th>
                  <th class="text-left">
                    status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in objectItem" :key="item.id_item">
                  <td  v-if="item.qtd_item != 0">{{ item.qtd_item }}</td>
                  <td><span v-if="item.cod_item != 0">{{ item.cod_item }}</span></td>
                  <td>{{ item.descri_item }}</td>
                  <td><span v-if="item.marca != 0">{{ item.marca }}</span></td>
                  <td><span v-if="item.valor_item != 0">R$: {{ item.valor_item }}</span></td>           
                  <td>
                    <v-chip class="error" v-if="item.bloqueado" small>BLOQUEADO</v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog1 = false">
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" persistent width="55%">
      <v-card>
        <v-card-title>
          <h5>Atenção!</h5>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <h6>
            Enviar Pedido <b>N° {{ objectItemDialog.id_pedidos }}</b> para Tela
            Outros?
          </h6>
          <v-alert v-if="arrayItemsBloqueados.length > 0 " type="error"> OS ITEM(S) ABAIXO ESTÃO BLOQUEADOS E SERÃO REMOVIDOS DO PEDIDO!</v-alert>
          <v-divider></v-divider>
          <v-simple-table v-if="arrayItemsBloqueados.length > 0 " dense>
            <thead>
              <tr>
                <th class="text-left">
                  Codigo
                </th>
                <th class="text-left">
                  Descrição
                </th>
                <th class="text-left">
                  Marca
                </th>
                <th class="text-left">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in objectItemDialog.itemsBloqueadosPedido" :key="item.id_item">
                <td><span>{{ item.cod_item }}</span></td>
                <td>{{ item.descri_item }}</td>
                <td><span>{{ item.marca }}</span></td>
                <td><span>R$: {{ item.valor_item }}</span></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="closeDialog2()">
            voltar
          </v-btn>
          <div class="flex-grow-1 ma-8"></div>
          <v-btn color="success" @click="enviarPedido(objectItemDialog)">
            Enviar
          </v-btn>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    search: "",
    headersPedidosOutros: [
      { text: "ID Pedido", value: "id_pedidos" },
      { text: "CPF", value: "cpf_aluno" },
      { text: "Data Pedido", value: "data_pedido" },
      { text: "Status", value: "status_aluno" },
      { text: "Grupo", value: "grupo" },
      { text: "Ver Itens Pedido", value: "itempedidos" },
      { text: "Total Pedido", value: "valor_total" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    objectItem: {},
    objectItemDialog: {},
    dialog1: false,
    dialog2: false,
    arrayItemsBloqueados: [],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      aluno_pedido_outros: (state) => state.pedidoOutros.aluno_pedido_outros,

      error: (state) => state.pedidoOutros.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions(["get_aluno_pedidos_outros", "set_pedido_outros"]),
    ...mapMutations(["clean_aluno_pedido_outros","set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async getPedidos() {
      let cpf = this.search.replace(/[^A-Z0-9]/gi, "");
      let data = {
        cpf: cpf,
      };
      this.set_loading(true);
      await this.get_aluno_pedidos_outros(data);
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        if (Object.keys(this.aluno_pedido_outros).length == 0) {
          this.set_snackbar({
            show: true,
            msg: "NÃO EXISTE CADASTRO PARA O CPF INFORMADO!",
            type: "warning",
            time: 5000,
          });
        }
      }
    },
    dialogEnviarPedido(data) {
      this.objectItemDialog = Object.assign({}, data);

      for (const i of data.itempedidos) {
        if (i.bloqueado) {
          this.arrayItemsBloqueados.push(i);
        }
      }
      this.objectItemDialog.itemsBloqueadosPedido = this.arrayItemsBloqueados;
      this.dialog2 = true;
    },
    async enviarPedido(data) {      
      this.set_loading(true);
      await this.set_pedido_outros(data);
      this.set_loading(false);
      
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.closeDialog2();
        this.clean_aluno_pedido_outros();
        this.set_snackbar({
          show: true,
          msg: "Pedido enviado para (OUTROS) com sucesso!",
          type: "success",
          time: 10000,
        });
      }
    },
    closeDialog2() {
      this.dialog2 = false;
      this.objectItemDialog = {};
      this.arrayItemsBloqueados = [];
    },
    async verPagamento(value) {
      this.objectItem = Object.assign({}, value);
      this.dialog1 = true;
    },
    putMask(item, type) {
      if (type == "celular") {
        if (item != null) {
          item = item.replace(/\D/g, "");
        }
        return this.$mask.apply(item, "(00) 0 0000-0000");
      } else {
        if (item.length < 14) {
          return this.$mask.apply(item, "000.000.000-00");
        } else {
          return this.$mask.apply(item, "00.000.000/0000-00");
        }
      }
    },
  },
};
</script>
