<template>
  <div>
    <div ref="tabelaItens" tabindex="1">
      <q-virtual-scroll
        ref="tabela"
        type="table"
        dense
        style="max-height: 23vh"
        :virtual-scroll-slice-size="100"
        :virtual-scroll-item-size="100"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="itens"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headers" :key="'1--' + col.name">{{ col.name }}</th>
            </tr>
          </thead>
        </template>
        <template v-slot="{ item: row, index }">
          <tr
            ref="linha"
            @click="selectItem(row, index)"
            dense
            :key="index"
            :class="{ 'blue lighten-4': index === selected_item }"
          >
            <td v-for="col in headers" :key="index + '-' + col.name">
              <div v-if="col.prop == 'saldo'">
                <span
                style="cursor: pointer"
                  @click="getHistoricoItem(row)"
                  :class="row[col.prop] > 0 ? 'success--text': 'error--text'"
                >{{row[col.prop]}}</span>
              </div>
              <div
                v-else-if="col.prop == 'valor'"
              >R$ {{(row[col.prop]).toFixed(2).replace('.', ',')}}</div>
              <div v-else>{{ row[col.prop] }}</div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </div>
    <v-dialog v-model="dialogHistorico" max-width="800">
      <v-card>
        <v-card-title class="headline">Histórico de Compras</v-card-title>

        <v-card-text>aqui vai ter os historicos de saidas e entradas do item {{objectItem.descricao}}</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialogHistorico = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    QVirtualScroll,
  },
  data: function () {
    return {
      dialogHistorico: false,
      objectItem: {},
      headers: [
        {
          name: "codigo",
          prop: "codigo",
          align: "center",
          label: "Código",
          field: "codigo",
          sortable: true,
        },
        {
          name: "descricao",
          prop: "descricao",
          align: "center",
          label: "Descrição",
          field: "descricao",
          sortable: true,
        },
        {
          name: "marca",
          prop: "marca",
          align: "center",
          label: "Marca",
          field: "marca",
          sortable: true,
        },
        {
          name: "saldo",
          prop: "saldo",
          align: "center",
          label: "Saldo",
          field: "saldo",
          sortable: true,
        },
        {
          name: "valor",
          prop: "valor",
          align: "center",
          label: "Valor",
          field: "valor",
          sortable: true,
        },
        {
          name: "estoque",
          prop: "estoque",
          align: "center",
          label: "Estoque",
          field: "estoque",
          sortable: true,
        },
        {
          name: "armazem",
          prop: "armazem",
          align: "center",
          label: "Armazem",
          field: "armazem",
          sortable: true,
        },
        {
          name: "cod_barra",
          prop: "cod_barra",
          align: "center",
          label: "Barras",
          field: "cod_barra",
          sortable: true,
        },
        {
          name: "classificacao_fiscal",
          prop: "classificacao_fiscal",
          align: "center",
          label: "Fiscal",
          field: "classificacao_fiscal",
          sortable: true,
        },
        {
          name: "codigo_fornecedor",
          prop: "codigo_fornecedor",
          align: "center",
          label: "Cod Forn",
          field: "codigo_fornecedor",
          sortable: true,
        },
      ],
    };
  },
  mounted() {
    this.event();
  },
  computed: {
    ...mapState({
      itens: (state) => state.pedidoAtendimento.itens,
      item: (state) => state.pedidoAtendimento.item,
      itens_pedido: (state) => state.pedidoAtendimento.itens_pedido,
      selected_item: (state) => state.pedidoAtendimento.selected_item,
    }),
  },
  methods: {
    ...mapMutations([
      "set_item",
      "set_selected_item",
      "change_itens_pedido",
      "push_itens_pedido",
      "set_item_null",
    ]),

    getHistoricoItem(item) {
      this.objectItem = {... item};
      this.dialogHistorico = true;
    },

    addItemPedido() {
      if (this.item.valido) {
        let ordem = this.itens_pedido.length;
        let insertProduto = {};

        insertProduto.ordem = ordem;
        insertProduto.qtd = this.item.qtd;
        insertProduto.codigo = this.item.codigo;
        insertProduto.descricao = this.item.descricao;
        insertProduto.saldo = this.item.saldo;
        insertProduto.marca = this.item.marca;
        insertProduto.valor = this.item.valor;
        insertProduto.total =
          parseInt(this.item.qtd) * parseFloat(this.item.valor);

        if (this.item.editing) {
          this.item.editing = false;
          this.item.total =
            parseInt(this.item.qtd) * parseFloat(this.item.valor);
          this.change_itens_pedido(this.item);
        } else {
          this.push_itens_pedido(insertProduto);

          //this.$refs.qtd.focus();
          //document.querySelector("#qtd").select();
        }
        this.set_item_null();
      }
    },

    selectItem(row, index) {
      let produto = {
        qtd: 1,
        codigo: this.itens[index].codigo,
        descricao: this.itens[index].descricao,
        marca: this.itens[index].marca,
        saldo: this.itens[index].saldo,
        valor: this.itens[index].valor,
        valido: true,
        editing: false,
      };

      if (this.item.editing) {
        produto.qtd = this.item.qtd;
        produto.editing = true;
      }
      this.set_item(produto);
      this.set_selected_item(index);
    },
    move(index, dest) {
      this.set_selected_item(index);

      if (dest == "prev") {
        if (this.selected_item < 0) {
          this.set_selected_item(0);
        }
      } else {
        if (this.selected_item >= this.itens.length) {
          this.set_selected_item(this.itens.length - 1);
          this.selectedItem = this.itens.length - 1;
        }
      }

      this.$refs.tabela.scrollTo(this.selected_item);

      let produto = {
        qtd: 1,
        codigo: this.itens[this.selected_item].codigo,
        descricao: this.itens[this.selected_item].descricao,
        marca: this.itens[this.selected_item].marca,
        saldo: this.itens[this.selected_item].saldo,
        valor: this.itens[this.selected_item].valor,
        valido: true,
        editing: false,
      };
      if (this.item.editing) {
        produto.qtd = this.item.qtd;
        produto.editing = true;
      }
      this.set_item(produto);
    },
    event() {
      let isso = this;
      this.$refs.tabelaItens.addEventListener("keydown", function (e) {
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
          isso.addItemPedido();
        }
        if (key == 33) {
          isso.$emit("page-up");
        }
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1
  background: #1A237E
  color: white

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>