<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-text>
        <v-row dense justify="center">
          <v-col cols="5">
            <v-text-field
              filled
              prepend-inner-icon="fa-user"
              autocomplete="nope"
              dense
              :hide-details="true"
              height="10"
              v-model="cliente.razao_social"
              @click="dialogCliente = true"
              label="Cliente"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              height="10"
              :hide-details="true"
              autocomplete="nope"
              filled
              prepend-inner-icon="fa-id-card"
              v-model="cliente.cpf_cnpj"
              label="CPF/CNPJ"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              readonly
              dense
            ></v-text-field>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn tile color="success">
              <v-icon left>fa-user-edit </v-icon>
              Editar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto">
      <v-card-text>
        <v-row dense>
          <v-col>
            <v-expansion-panels flat popout accordion>
              <v-expansion-panel @click="focusInputSearch()">
                <v-expansion-panel-header eager>
                  <template v-slot:default>
                    <v-row dense justify="center" no-gutters>
                      <v-col
                        class="text-center font-weight-black text-h6"
                        cols="12"
                      >
                        Buscar Produto
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content eager>
                  <v-text-field
                    dense
                    placeholder="Busque por código ou descrição"
                    ref="searchinput"
                    outlined
                    hide-details
                    v-model="searchProduto"
                  ></v-text-field>
                  <q-virtual-scroll
                    ref="tabelaItens"
                    type="table"
                    dense
                    style="max-height: 23vh"
                    :virtual-scroll-slice-size="100"
                    :virtual-scroll-item-size="100"
                    :virtual-scroll-sticky-size-start="48"
                    :virtual-scroll-sticky-size-end="32"
                    :items="items"
                  >
                    <template v-slot:before>
                      <thead class="thead-sticky bg-header-item text-left">
                        <tr>
                          <th
                            v-for="col in headersItens"
                            :key="'1--' + col.name"
                          >
                            {{ col.name }}
                          </th>
                        </tr>
                      </thead>
                    </template>
                    <template v-slot="{ item: row, index }">
                      <tr
                        class="bg-table-item"
                        ref="linha"
                        @click="selectItem(row, index)"
                        dense
                        :key="index"
                        :class="{
                          'blue lighten-4': index === selected_item.index,
                        }"
                      >
                        <td
                          v-for="col in headersItens"
                          :key="index + '-' + col.name"
                        >
                          <div
                            v-if="col.prop == 'saldo' && permissoes.ver_saldo"
                          >
                            <span
                              :class="
                                row[col.prop] > 0
                                  ? 'success--text'
                                  : 'error--text'
                              "
                              >{{ row[col.prop] }}</span
                            >
                          </div>
                          <div v-else-if="col.prop == 'valor'">
                            {{
                              new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(row[col.prop])
                            }}
                          </div>
                          <div v-else>{{ row[col.prop] }}</div>
                        </td>
                      </tr>
                    </template>
                  </q-virtual-scroll>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <q-virtual-scroll
          v-if="entries.length > 0"
          ref="tabelaItensPedido"
          type="table"
          dense
          style="max-height: 44vh"
          :virtual-scroll-item-size="24"
          :virtual-scroll-sticky-size-start="24"
          :virtual-scroll-sticky-size-end="16"
          :items="itens_pedido"
        >
          <template v-slot:before>
            <thead class="thead-sticky bg-header-item-pedido text-left">
              <tr>
                <th v-for="col in headersItensPedido" :key="'1--' + col.name">
                  {{ col.name }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:after>
            <tfoot class="tfooter-sticky text-left">
              <tr>
                <th>PRODUTOS: {{ qtd_total }}</th>
                <th></th>
                <th colspan="4">
                  LUCRO:
                  {{
                    new Intl.NumberFormat("pt-BR", {
                      style: "percent",
                      minimumFractionDigits: 2,
                    }).format(lucro_site)
                  }}
                </th>
                <th>
                  TOTAL:
                  {{
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valor_total)
                  }}
                </th>
                 <th></th>
              </tr>
            </tfoot>
          </template>
          <template v-slot="{ item: row, index }">
            <tr
              @click="selectItem(row, index)"
              dense
              :key="index"
              :class="{ 'blue lighten-4': index === selected_item }"
            >
              <td
                v-for="col in headersItensPedido"
                :key="index + '-' + col.name"
              >
                <div v-if="col.prop == '#'">
                  <v-btn
                    @click="removeItem(index)"
                    x-small
                    icon
                    color="red darken-2"
                  >
                    <v-icon>fa-times</v-icon>
                  </v-btn>
                  -
                  {{ index + 1 }}
                </div>
                <div v-if="col.prop == 'qtd'">
                  <v-text-field
                    dense
                    hide-details
                    v-model="row[col.prop]"
                    @click="
                      $event.target.select();
                      calcular_itens_pedido();
                    "
                    @keyup="
                      onRemove(index);
                      calcular_itens_pedido();
                    "
                    @change="calcular_itens_pedido()"
                    v-mask="'####'"
                    height="10"
                    style="width: 40px"
                  ></v-text-field>
                </div>
                <div v-else-if="col.prop == 'desconto'">
                  <v-text-field
                    :disabled="tem_desconto"
                    autocomplete="nope"
                    @click="$event.target.select()"
                    @keyup="
                      calcDesconto(row);
                      calcular_itens_pedido();
                    "
                    @change="calcular_itens_pedido()"
                    dense
                    height="10"
                    style="width: 60px"
                    hide-details
                    suffix="%"
                    v-model="row.desconto"
                  ></v-text-field>
                </div>
                <div v-else-if="col.prop == 'valor'">
                  {{
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(row[col.prop])
                  }}
                </div>
                <div v-else-if="col.prop == 'total'">
                  {{
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(row.valor * row.qtd)
                  }}
                </div>
                <div v-else-if="col.prop == 'descricao'">
                  {{ row.descricao }}
                  <div v-if="row.sem_saldo">
                    <v-chip
                      x-small
                      class="text-center"
                      color="error"
                      dark
                      heigth="40"
                      >SOB ENCOMENDA</v-chip
                    >
                  </div>
                </div>
                <div v-else>{{ row[col.prop] }}</div>
              </td>
            </tr>
          </template>
        </q-virtual-scroll>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { QVirtualScroll } from "quasar/dist/quasar.esm";
export default {
  components: {
    QVirtualScroll,
  },
  data() {
    return {
      qtd_total: 0.0,
      valor_total: 0.0,
      lucro_site: 0.0,
      tem_desconto: false,
      selected_item: {},
      descriptionLimit: 60,
      item_selecionado: null,
      entries: [],
      autocompleteLoading: false,
      searchProduto: null,
      dialogCliente: false,
      headersItensPedido: [
        {
          name: "QTD",
          prop: "qtd",
          align: "center",
          sortable: false,
        },
        {
          name: "CÃ“DIGO",
          prop: "codigo",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCRIÃ‡ÃƒO",
          prop: "descricao",
          align: "center",
          sortable: true,
        },
        {
          name: "MARCA",
          prop: "marca",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCONTO",
          prop: "desconto",
          align: "center",
          sortable: true,
        },
        {
          name: "VALOR",
          prop: "valor",
          align: "center",
          sortable: true,
        },
        {
          name: "TOTAL",
          prop: "total",
          align: "center",
          sortable: true,
        },
        {
          name: "#",
          prop: "#",
          align: "center",
          sortable: false,
        },
      ],
      headersItens: [
        {
          name: "CÃ“DIGO",
          prop: "codigo",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCRIÃ‡ÃƒO",
          prop: "descricao",
          align: "center",
          sortable: true,
        },
        {
          name: "MARCA",
          prop: "marca",
          align: "center",
          sortable: true,
        },
        {
          name: "Saldo",
          prop: "saldo",
          align: "center",
          sortable: true,
        },
        {
          name: "VALOR",
          prop: "valor",
          align: "center",
          sortable: true,
        },
      ],
    };
  },
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.get_permissoes({
      id_usuario: this.$usuario.value.id,
      pagina: "orcamento",
    });
  },
  mounted() {
    this.event();
  },

  computed: {
    ...mapState({
      cliente: (state) => state.cliente.cliente,
      itens_pedido: (state) => state.pedidoAtendimento.itens_pedido,
      permissoes: (state) => state.permissoes,
    }),
    items() {
      let arr = this.entries;
      let filteredItems = [];

      filteredItems = arr.filter((i) =>
        i.descricao.includes(this.searchProduto.toUpperCase())
      );
      let searchArr =
        this.searchProduto == null ? [] : this.searchProduto.split(" ");
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
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.marca.includes(this.searchProduto.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo.includes(this.searchProduto.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo_fornecedor.includes(this.searchProduto.toUpperCase())
          );
        }
      }

      return filteredItems;
    },
  },
  watch: {
    searchProduto(val) {
      // Items have already been loaded
      if (this.entries.length > 0) return;

      // Items have already been requested
      if (this.autocompleteLoading) return;

      this.autocompleteLoading = true;
      // Lazily load input items
      this.$axios
        .get("/produto/findAll")
        .then((res) => {
          this.count = res.data.length;
          this.entries = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.autocompleteLoading = false));
    },
  },
  methods: {
    ...mapMutations(["set_selected_item", "set_item", "push_itens_pedido"]),
    ...mapActions(["get_permissoes"]),
    event() {
      let isso = this;
      this.$refs.tabelaItens.$el.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.moveTabelaItens(isso.selected_item.index + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.moveTabelaItens(isso.selected_item.index - 1, "prev");
        }
        if (key == 13) {
          e.preventDefault();
          isso.addItemPedido();
          //isso.$emit("close");
        }
        // if (key == 33) {
        //   isso.$emit("page-up");
        // }
      });
    },
    moveTabelaItens(index, dest) {
      if (index >= 0 && index < this.items.length) {
        this.selected_item = this.items[index];
        this.selected_item.index = index;

        if (dest == "prev") {
          if (this.selected_item.index < 0) {
            this.selected_item.index = 0;
          }
        } else {
          if (this.selected_item.index >= this.items.length) {
            this.selected_item.index = this.items.length - 1;
          }
        }

        this.$refs.tabelaItens.scrollTo(this.selected_item.index);
      }
    },
    focusInputSearch() {
      setTimeout(() => this.$refs.searchinput.$refs.input.focus(), 100);
    },
    add_item(item) {
      console.log("oporra", item);
    },
    selectItem(row, index) {
      if (this.items[index] != undefined) {
        this.selected_item = this.items[index];
        this.selected_item.index = index;
        console.log("item selecionado", this.selected_item);
      }
    },
    addItemPedido() {
      this.selected_item.qtd = 1;
      let ordem = this.itens_pedido.length;
      let insertProduto = {};
      insertProduto.ordem = ordem;
      insertProduto.qtd = this.selected_item.qtd;
      insertProduto.codigo = this.selected_item.codigo;
      insertProduto.descricao = this.selected_item.descricao;
      insertProduto.saldo = this.selected_item.saldo;
      insertProduto.marca = this.selected_item.marca;
      insertProduto.valor = this.selected_item.valor;
      insertProduto.valor_original = this.selected_item.valor;
      insertProduto.valor_ultima_compra =
        this.selected_item.valor_ultima_compra;
      insertProduto.ipi = this.selected_item.ipi;
      insertProduto.valor_fabricante = this.selected_item.valor_fabricante;
      insertProduto.desconto_original = this.selected_item.desconto;
      insertProduto.total =
        parseInt(this.selected_item.qtd) * parseFloat(this.selected_item.valor);

      this.push_itens_pedido(insertProduto);
      console.log("item inserido", insertProduto);

      //this.$refs.qtd.focus();
      //document.querySelector("#qtd").select();

      this.calcular_itens_pedido();
    },
    calcular_itens_pedido() {
      let qtd_total = 0;
      let valor_total = 0;
      let ultima_compra = 0;
      let total_ultima_compra = 0;
      let lucro_site = 0;
      let itens = [];

      // if (context.state.editar) {
      //     itens = context.state.itens_pedido_editar
      // } else {
      //     itens = context.state.itens_pedido
      // }

      this.itens_pedido.forEach((i) => {
        //i.qtd = parseInt(i.qtd)
        ultima_compra = parseFloat(i.valor_ultima_compra);
        if (ultima_compra == 0) {
          ultima_compra = parseFloat(i.valor_fabricante);
        } else {
          ultima_compra =
            parseFloat(i.valor_ultima_compra) *
            ((100 + parseFloat(i.ipi)) / 100);
        }

        qtd_total += parseInt(i.qtd);
        valor_total += parseFloat(i.valor).toFixed(2) * i.qtd;
        total_ultima_compra += parseFloat(ultima_compra).toFixed(2) * i.qtd;

        // if (i.saldo < i.qtd || i.saldo <= 0) {
        //     i.sem_saldo = true;
        // } else {
        //     i.sem_saldo = false;
        // }
      });
      lucro_site = (valor_total / total_ultima_compra) * 100 - 100;

      lucro_site = lucro_site.toFixed(2);

      if (isNaN(lucro_site)) {
        lucro_site = 0;
      }

      this.qtd_total = qtd_total;
      this.valor_total = valor_total;
      this.lucro_site = lucro_site;
      // context.commit('set_qtd_total_itens_pedido', qtd_total);
      // context.commit('set_valor_total_itens_pedido', valor_total);
      // context.commit('set_lucro_total_itens_pedido', lucro_site);
    },
    calcDesconto() {},
    onRemove() {},
  },
};
</script>
<style scoped>
.v-card__text,
.v-card__title {
  padding: 0px !important;
}
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 30px !important;
}
.v-expansion-panel-header {
  padding: 0px 24px !important;
  min-height: 30px !important;
}
.thead-sticky {
  position: sticky;
  z-index: 1;
  top: 0px;
  opacity: 1;
  color: white;
}
.tfooter-sticky {
  position: sticky;
  z-index: 1;
  bottom: 0px;
  opacity: 1;
  background-color: #28a745;
  color: white;
}
.bg-table-item {
  background-color: #d3d3d37a;
}
.bg-header-item {
  background-color: #565555;
}
.bg-header-item-pedido {
  background-color: #28a745;
}
</style>
