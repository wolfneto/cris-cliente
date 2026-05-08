<template>
  <v-container>
    <EditarItem v-if="editar"></EditarItem>
    <div v-if="!editar">
      <v-card>
        <v-card-title>
          Items
          <v-divider class="mx-4" inset vertical></v-divider>
          <!-- <v-btn color="primary" dark class="mb-2">Novo Item</v-btn>
          <v-btn
            :disabled="!btnDesconto"
            @click="dialogDesconto()"
            class="ml-2 mb-2"
            >Desconto Geral</v-btn
          > -->
          <div class="flex-grow-1"></div>
          <v-text-field
            class="uppercase"
            v-model="search"
            @click="$event.target.select()"
            append-icon="fa-search"
            label="Busque por: CÃ³digo, DescriÃ§Ã£o, Marca"
          ></v-text-field>
        </v-card-title>
        <div ref="tabelaItens" tabindex="1">
          <q-virtual-scroll
            ref="tabela"
            class="my-sticky-dynamic"
            type="table"
            dense
            style="max-height: 80vh"
            :virtual-scroll-slice-size="50"
            :virtual-scroll-item-size="48"
            :virtual-scroll-sticky-size-start="48"
            :virtual-scroll-sticky-size-end="32"
            :items="items"
            tabindex="2"
          >
            <template v-slot:before>
              <thead class="thead-sticky text-left">
                <tr>
                  <th v-for="col in headers" :key="'1--' + col.text">
                    {{ col.text }}
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot="{ item: row, index }">
              <tr
                @click="selectItem(row, index)"
                dense
                :key="index"
                :class="corLinha(row, index, selected_item)"
              >
                <td v-for="col in headers" :key="index + '-' + col.text">
                  <div v-if="col.value == 'valor'">
                    <span>{{
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.valor)
                    }}</span>
                  </div>
                  <div v-else-if="col.value == 'status' && row.status === 1">
                    Ativo
                  </div>
                  <div v-else-if="col.value == 'status' && row.status === 2">
                    Inativo
                  </div>
                  <div v-else-if="col.value == 'status' && row.status === 3">
                    Bloqueado
                  </div>
                  <div v-else>{{ row[col.value] }}</div>
                </td>
              </tr>
            </template>
          </q-virtual-scroll>
        </div>
      </v-card>

      <v-dialog v-model="dialog" persistent max-width="80%">
        <v-card>
          <v-card-title class="headline">
            <v-row>
              <v-col cols="12" md="5"
                ><p class="ma-2 text-center">
                  Aplicar desconto nos itens selecionados
                </p></v-col
              >
              <v-col cols="12" md="1">
                <v-text-field
                  v-model="descontoGeral"
                  @click="$event.target.select()"
                  suffix="%"
                >
                  fas fa-check
                </v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  class="ma-2"
                  color="success"
                  @click="dialogDescontoSalvar()"
                  >Aplicar
                  <v-icon class="ml-2">fas fa-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <div>
              <q-virtual-scroll
                class="my-sticky-dynamic"
                type="table"
                dense
                style="max-height: 50vh"
                :virtual-scroll-slice-size="50"
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                :virtual-scroll-sticky-size-end="32"
                :items="itemsDesconto"
                tabindex="2"
              >
                <template v-slot:before>
                  <thead class="thead-sticky text-left">
                    <tr>
                      <th v-for="col in headerDesconto" :key="'1--' + col.text">
                        {{ col.text }}
                      </th>
                    </tr>
                  </thead>
                </template>
                <template v-slot="{ item: row, index }">
                  <tr dense :key="index">
                    <td
                      v-for="col in headerDesconto"
                      :key="index + '-' + col.text"
                    >
                      <div v-if="col.value">{{ row[col.value] }}</div>
                    </td>
                  </tr>
                </template>
              </q-virtual-scroll>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="closeDialogDesconto()"> voltar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" max-width="600" persistent>
        <v-card>
          <v-card-title class="headline"> AtenÃ§Ã£o! </v-card-title>
          <v-card-text>
            <span class="title"
              >Deseja realmente aplicar desconto nos itens selecionados?</span
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialog2 = false"> cancelar </v-btn>
            <v-btn color="success" @click="saveDescontoGeral()">
              continuar
            </v-btn>
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
    </div>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
import EditarItem from "./Editar";

export default {
  components: {
    EditarItem,
  },
  data: () => ({
    search: "",
    filteredItems: [],
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    editar: false,
    headers: [
      {
        text: "Codigo",
        sortable: true,
        value: "codigo",
      },
      {
        text: "Codigo Fornecedor",
        sortable: true,
        value: "codigo_fornecedor",
      },
      {
        text: "DescriÃ§Ã£o",
        sortable: true,
        value: "descricao",
      },
      {
        text: "Marca",
        sortable: true,
        value: "marca",
      },
      {
        text: "Valor",
        sortable: true,
        value: "valor",
      },
      {
        text: "Saldo",
        sortable: true,
        value: "saldo",
      },
      {
        text: "Status",
        sortable: true,
        value: "status",
      },
    ],
    headerDesconto: [
      {
        text: "Codigo",
        sortable: true,
        value: "codigo",
      },
      {
        text: "DescriÃ§Ã£o",
        sortable: true,
        value: "descricao",
      },
      {
        text: "Marca",
        sortable: true,
        value: "marca",
      },
      {
        text: "Valor",
        sortable: true,
        value: "valor",
      },
      {
        text: "Saldo",
        sortable: true,
        value: "saldo",
      },
    ],
    itemsDesconto: [],
    btnDesconto: false,
    descontoGeral: "0",
    dialog: false,
    dialog2: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getItens();
  },
  mounted() {
    this.$refs.tabela.$el.focus();
  },
  computed: {
    ...mapState({
      error: (state) => state.item.error,
      itens: (state) => state.item.itens,
      selected_item: (state) => state.item.selected_item,
    }),
    items() {
      let arr = this.itens;
      let filteredItems = [];
      this.btnDesconto = false;

      filteredItems = arr.filter((i) =>
        i.descricao.includes(this.search.toUpperCase())
      );
      let searchArr = this.search == null ? [] : this.search.split(" ");
      if (!filteredItems.length || searchArr.length > 1) {
        filteredItems = arr.filter((i) =>
          i.descricao.includes(searchArr[0].toUpperCase())
        );
        filteredItems = filteredItems.filter((i) =>
          i.descricao.includes(searchArr[1].toUpperCase())
        );
        if (searchArr.length > 2) {
          filteredItems = filteredItems.filter((i) =>
            i.descricao.includes(searchArr[2].toUpperCase())
          );
        }
        if (searchArr.length > 3) {
          filteredItems = filteredItems.filter((i) =>
            i.descricao.includes(searchArr[3].toUpperCase())
          );
        }
        if (searchArr.length > 4) {
          filteredItems = filteredItems.filter((i) =>
            i.descricao.includes(searchArr[4].toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.marca.includes(this.search.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo.includes(this.search.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo_fornecedor.includes(this.search.toUpperCase())
          );
        }
      }
      this.btnDesconto = true;
      return filteredItems;
    },
  },
  methods: {
    ...mapActions(["getItensDCInfo", "save_desconto_geral"]),
    ...mapMutations(["set_selected_item", "set_item"]),

    corLinha(row, index, selected_item) {
      if (index === selected_item) {
        return "blue lighten-4";
      }
      if (row.status === 3) {
        return "red lighten-3 text-white";
      }
      if (row.saldo === 0) {
        return "yellow lighten-4";
      }
      if (row.saldo === 0 && selected_item) {
        return "green lighten-4";
      }
    },
    selectItem(row, index) {
      this.set_item(this.filteredItems[index]);
      this.set_selected_item(index);
    },
    move(index, dest) {
      this.set_selected_item(index);

      if (dest == "prev") {
        if (this.selected_item < 0) {
          this.set_selected_item(0);
          index = 0;
        }
      } else {
        if (this.selected_item >= this.filteredItems.length) {
          this.set_selected_item(this.filteredItems.length - 1);
          this.selectedItem = this.filteredItems.length - 1;
          index = this.filteredItems.length - 1;
        }
      }
      this.$refs.tabela.scrollTo(this.selected_item);

      this.item = {
        codigo: this.filteredItems[index].codigo,
        codigo_fornecedor: this.filteredItems[index].codigo_fornecedor,
        descricao: this.filteredItems[index].descricao,
        marca: this.filteredItems[index].marca,
        valor: this.filteredItems[index].valor.toFixed(2).replace(".", ","),
        saldo: this.filteredItems[index].saldo,
        status: this.filteredItems[index].status,
      };

      this.set_item(this.item);
    },
    event() {
      let isso = this;
      this.$refs.tabelaItens.addEventListener("keydown", function(e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item - 1, "prev");
        }
        if (key == 13) {
          e.preventDefault();
          isso.editar = true;
        }
      });
    },
    async getItens() {
      this.loading = true;
      await this.getItensDCInfo();
      this.loading = false;
      this.$refs.tabela.$el.focus();
      this.event();
      this.filteredItems = this.itens;
    },
    async volta() {
      this.loading = true;
      await this.getItensDCInfo();
      this.loading = false;
      this.event();
      this.filteredItems = this.itens;
      this.$refs.tabela.scrollTo(this.selected_item);
      if (this.search) {
        this.$refs.tabela.scrollTo(this.selected_item);
      }
    },
    dialogDescontoSalvar() {
      this.dialog2 = true;
    },
    async saveDescontoGeral() {
      this.descontoGeral = this.descontoGeral.replace(/\,/g, ".");
      this.descontoGeral = parseFloat(this.descontoGeral);
      if (isNaN(this.descontoGeral) || this.descontoGeral > 99.99) {
        this.showSnakerbar("Valor de desconto incorreto!", "warning", 2000);
        this.descontoGeral = "0";
        this.dialog2 = false;
      } else {
        let objDesconto = {
          desconto: this.descontoGeral,
          items: this.itemsDesconto,
        };
        await this.save_desconto_geral(objDesconto);

        if (this.error) {
          this.showSnakerbar("Ocorreu um erro no servidor!", "error", 2000);
        } else {
          this.volta();
          this.showSnakerbar("Salvo com sucesso!", "success", 2000);
        }
        this.dialog2 = false;
        this.closeDialogDesconto();
      }
    },
    dialogDesconto() {
      this.dialog = true;
      this.itemsDesconto = this.items;
    },
    closeDialogDesconto() {
      this.dialog = false;
      this.descontoGeral = "0";
      this.itemsDesconto = [];
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
  },
};
</script>
