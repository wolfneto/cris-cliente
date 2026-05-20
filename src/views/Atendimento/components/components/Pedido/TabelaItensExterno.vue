<template>
  <div>
    <div ref="tabelaItens" tabindex="1">
      <q-virtual-scroll
        ref="tabela"
        type="table"
        dense
        style="max-height: 63vh;height: 63vh;"
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
              <div v-if="col.prop == 'saldo' && permissoes.ver_saldo">
                <span                               
                  :class="row[col.prop] > 0 ? 'success--text': 'error--text'"
                >{{row[col.prop]}}</span>
              </div>
              <div
                v-else-if="col.prop == 'valor'"
              >{{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row[col.prop])}}</div>
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
    <v-dialog v-model="dialogItemRepetido" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">Atenção!</span>
        </v-card-title>
        <v-card-text class="h5">O item que você está tentando substituir já consta no pedido.</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogItemRepetido = false"
            >Entendi</v-btn>    
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
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
      dialogItemRepetido: false
    };
  },
  mounted() {
    this.event();
  },
  computed: {
    ...mapGetters({
      itens_pedido: "itensPedido",
    }),
    ...mapState({
      itens: (state) => state.pedidoAtendimento.itens,
      item: (state) => state.pedidoAtendimento.item,
      itens_pedido: (state) => state.pedidoAtendimento.itens_pedido,
      selected_item: (state) => state.pedidoAtendimento.selected_item,
      item_repetido: (state) => state.pedidoAtendimento.item_repetido,
      permissoes: (state) => state.permissoes,
    }),
  },
  methods: {
    ...mapActions(["calcular_itens_pedido"]),
    ...mapMutations([
      "set_item",
      "set_selected_item",
      "change_itens_pedido",
      "push_itens_pedido",
      "set_item_null",
      "check_item_repetido",
    ]),

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
        this.set_item_null();
      }
      this.calcular_itens_pedido();
    },

    selectItem(row, index) {
      let produto = {
        // qtd: 1,
        codigo: this.itens[index].codigo,
        descricao: this.itens[index].descricao,
        marca: this.itens[index].marca,
        saldo: this.itens[index].saldo,
        valor: this.itens[index].valor,
        valido: true,
        editing: false,
        desconto: this.itens[index].desconto,
        valor_ultima_compra: this.itens[index].valor_ultima_compra,
        ipi: this.itens[index].ipi,
        valor_fabricante: this.itens[index].valor_fabricante,
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
        // qtd: 1,
        codigo: this.itens[this.selected_item].codigo,
        descricao: this.itens[this.selected_item].descricao,
        marca: this.itens[this.selected_item].marca,
        saldo: this.itens[this.selected_item].saldo,
        valor: this.itens[this.selected_item].valor,
        valido: true,
        editing: false,
        desconto: this.itens[index].desconto,
        valor_ultima_compra: this.itens[index].valor_ultima_compra,
        ipi: this.itens[index].ipi,
        valor_fabricante: this.itens[index].valor_fabricante,
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
          isso.$emit("close");
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