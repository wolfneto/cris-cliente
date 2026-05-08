<template>
  <div ref="tabelaitenspedido" tabindex="0">
    <q-virtual-scroll
      ref="tabela"
      type="table"
      dense
      style="max-height: 22vh"
      :virtual-scroll-item-size="24"
      :virtual-scroll-sticky-size-start="24"
      :virtual-scroll-sticky-size-end="16"
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
          @click="selectItem(row, index)"
          dense
          :key="index"
          :class="{ 'blue lighten-4': index === selected_item }"
        >
          <td v-for="col in headers" :key="index + '-' + col.name">
            <v-text-field
                dense
                hide-details
                v-model="row[col.prop]"
                v-if="col.prop == 'qtd'"
                @click="$event.target.select()"
                @keyup="onRemove(index)"
                v-mask="'####'"
                height="10"
                style="width:40px"
             ></v-text-field>
             <div v-else-if="col.prop == 'valor'">
              R$ {{(row[col.prop]).toFixed(2).replace('.', ',')}}
            </div>
            <div v-else-if="col.prop == 'total'">
              R$ {{((row.valor).toFixed(2) * row.qtd ).toFixed(2).replace('.', ',')}}
            </div>
            <div v-else>{{ row[col.prop] }}</div>
          </td>
        </tr>
      </template>
    </q-virtual-scroll>
    <v-row class="font-weight-medium" justify="center">
      <v-col justify="start" cols="2">
        <v-btn @click="editItem()" class="mr-3" text icon color="green darken-2">
          <v-icon>fa-arrow-alt-circle-up</v-icon>
        </v-btn>
        <v-btn @click="removeItem()" class="mr-3" text icon color="red darken-2">
          <v-icon>fa-times</v-icon>
        </v-btn>
        <v-btn text icon color="green darken-2">
          <v-icon>fa-file-excel</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">Fat. mÃ©dio 12 meses: 1.506,84</v-col>
      <v-col cols="2">Financeiro atrasado: 292.746,21</v-col>
      <v-col cols="2">Margem: 73,20%</v-col>
      <v-col cols="2">Itens: 5</v-col>
      <v-col cols="2">Total: 581.800,00</v-col>
    </v-row>
  </div>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    QVirtualScroll
  },
  data: function() {
    return {
      headers: [
        {
          name: "qtd",
          prop: "qtd",
          align: "center",
          label: "Qtd",
          field: "qtd",
          sortable: true
        },
        {
          name: "codigo",
          prop: "codigo",
          align: "center",
          label: "CÃ³digo",
          field: "codigo",
          sortable: true
        },
        {
          name: "descricao",
          prop: "descricao",
          align: "center",
          label: "DescriÃ§Ã£o",
          field: "descricao",
          sortable: true
        },
        {
          name: "marca",
          prop: "marca",
          align: "center",
          label: "Marca",
          field: "marca",
          sortable: true
        },
        {
          name: "saldo",
          prop: "saldo",
          align: "center",
          label: "Saldo",
          field: "saldo",
          sortable: true
        },
        {
          name: "valor",
          prop: "valor",
          align: "center",
          label: "Valor",
          field: "valor",
          sortable: true
        },
        {
          name: "total",
          prop: "total",
          align: "center",
          label: "Total",
          field: "total",
          sortable: true
        }
      ]
    };
  },
  mounted() {
    this.event();
    //this.updateAllContent();
  },
  computed: {
    ...mapState({
      itens: state => state.pedidoAtendimento.itens_pedido,
      item: state => state.pedidoAtendimento.item,
      selected_item: state => state.pedidoAtendimento.selected_item_pedido
    })
  },
  methods: {
    ...mapMutations([
      "set_item_pedido",
      "set_selected_item_pedido",
      "set_item"
    ]),
    onRemove(index) {
      if (this.itens.length > 1 && this.itens[index].qtd.length === 0 || this.itens[index].qtd == 0) {
        this.$delete(this.itens, index);
        //this.updateAllContent();
      }
    },
    updateAllContent() {
      this.itens.forEach((c, index) => {
        const el = document.getElementById(`content-${index}`);
        el.innerText = c.qtd;
      });
    },

    removeItem() {
      this.$delete(this.itens, this.selected_item);
    },

    editItem() {
      let item = this.itens[this.selected_item];

      item.editing = true;
      item.valido = false;
      item.index = this.selected_item;
      this.set_item(item);
    },

    selectItem(row, index) {
      let produto = {
        codigo: this.itens[index].codigo,
        descricao: this.itens[index].descricao,
        marca: this.itens[index].marca,
        saldo: this.itens[index].saldo,
        valor: this.itens[index].valor
      };
      this.set_item_pedido(produto);
      this.set_selected_item_pedido(index);
    },
    move(index, dest) {
      this.set_selected_item_pedido(index);

      if (dest == "prev") {
        if (this.selected_item < 0) {
          this.set_selected_item_pedido(0);
        }
      } else {
        if (this.selected_item >= this.itens.length) {
          this.set_selected_item_pedido(this.itens.length - 1);
          this.selectedItem = this.itens.length - 1;
        }
      }

      this.$refs.tabela.scrollTo(this.selected_item);

      let produto = {
        codigo: this.itens[this.selected_item].codigo,
        descricao: this.itens[this.selected_item].descricao,
        marca: this.itens[this.selected_item].marca,
        saldo: this.itens[this.selected_item].saldo,
        valor: this.itens[this.selected_item].valor
      };
      this.set_item_pedido(produto);
    },
    event() {
      let isso = this;
      document;
      this.$refs.tabelaitenspedido.addEventListener("keydown", function(e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item - 1, "prev");
        }
      });
    }
  }
};
</script>
<style lang="sass" scoped>
.thead-sticky tr > *,
.tfoot-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1
  background: white
  color: black

.thead-sticky tr:last-child > *
  top: 0

.tfoot-sticky tr:first-child > *
  bottom: 0
</style>