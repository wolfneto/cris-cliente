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
            <th v-for="col in headers" :key="'1--' + col.name">
              {{ col.name }}
            </th>
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
            <div v-if="col.prop == '#'">
              <!-- <v-btn
                @click="
                  selectItem(row, index);
                  editItem(index);
                "
                class="mr-2"
                x-small
                icon
                color="green darken-2"
              >
                <v-icon>fa-arrow-alt-circle-up</v-icon>
              </v-btn> -->
              <v-btn
                @click="removeItem(index)"
                x-small
                icon
                color="red darken-2"
              >
                <v-icon>fa-times</v-icon>
              </v-btn>
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
                :disabled="temDesconto"
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
    <v-row align="center" justify="space-around" no-gutters>
      <v-col v-if="permissoes.ver_lucro" class="text-center" cols="2">
        <h6>Lucro: {{ lucro }} %</h6>
      </v-col>
      <v-col class="text-center" cols="2"
        ><h6>Itens: {{ qdt_total_pedido }}</h6></v-col
      >
      <v-col class="text-center" cols="2"
        ><h6>
          Total:
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(valor_total_pedido)
          }}
        </h6>
      </v-col>
      <v-col cols="4">
        <div style="width: 300px; margin: auto">
          <v-row v-if="permissoes.ver_desconto" justify="space-around">
            <v-col cols="12" md="6">
              <span>Desconto Geral</span>
              <v-text-field
                autocomplete="nope"
                :disabled="!podeDesconto"
                @keypress.enter="callDescontoGeral()"
                @click="$event.target.select()"
                v-model="descontoGeral"
                class="input-qtd-produtos"
                suffix="%"
                :append-icon="
                  temDesconto ? 'fas fa-times' : 'fas fa-check randonly'
                "
                @click:append="callDescontoGeral()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <label>Resetar % unitário</label>
              <v-btn
                :disabled="podeDesconto"
                class="mt-n2 white--text"
                color="warning"
                @click="resetarDesconto()"
                style="margin-left: 25%; margin-right: 25%"
                small
                ><v-icon x-small>fas fa-percent</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
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
      headers: [
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
      objectItem: {},
      desconto: 0,
      podeDesconto: true,
      showModalPrevisao: false,
      loading: false,
      msgSnackbar: "",
      typeSnackbar: "",
      snackbar: false,
      timeSnackbar: 2000,
    };
  },
  mounted() {
    this.event();
    //this.updateAllContent();
  },
  computed: {
    ...mapGetters({
      itens: "itensPedido",
      qdt_total_pedido: "qtdItens",
      valor_total_pedido: "totalPedido",
    }),
    ...mapState({
      item: (state) => state.pedidoAtendimento.item,
      item_previsao: (state) => state.pedidoAtendimento.item_previsao,
      selected_item: (state) => state.pedidoAtendimento.selected_item_pedido,
      lucro: (state) => state.pedidoAtendimento.lucro_total_itens_pedido,
      permissoes: (state) => state.permissoes,
    }),
    descontoGeral: {
      get() {
        return this.$store.getters.desconto;
      },
      set(value) {
        this.$store.commit("set_desconto", value);
      },
    },
    temDesconto: {
      get() {
        return this.$store.state.pedidoAtendimento.tem_desconto
      },
      set(value) {
        this.$store.commit("set_tem_desconto", value);
      }
    }
  },
  created() {
    console.log('oporra desconto', this.temDesconto, this.teste);
    this.itens.forEach((val) => {
      this.$watch(() => val, this.handleChange, { deep: true });
    });
  },
  // watch: {
  //   "itens.length"(val) {
  //      if (this.itens[val - 1].saldo <= 0) {
  //       this.itens[val - 1].sem_saldo = true;
  //     }
  //     this.$refs.tabela.scrollTo(val);
  // }
  // },
  watch: {
    itens(val) {
      this.podeDesconto = true;
      val.forEach((element) => {
        if (element.desconto) {
          this.podeDesconto = false;
        }
      });

      if (val.length == 0) {
        this.podeDesconto = true;
        this.set_desconto(0);
      }
    },
  },
  methods: {
    ...mapActions(["calcular_itens_pedido", "get_previsao"]),
    ...mapMutations([
      "set_item_pedido",
      "set_selected_item_pedido",
      "set_item",
      "set_desconto",
    ]),
    // async getPrevisao(row) {
    //   this.loading = true;
    //   await this.get_previsao(row.codigo);
    //   this.objectItem = { ...this.item_previsao };
    //   this.loading = false;
    //   this.showModalPrevisao = true;
    // },
    callDescontoGeral() {
      if (!this.temDesconto) {
        try {
          this.set_desconto(this.descontoGeral.replace(",", "."));
          this.set_desconto(parseFloat(this.descontoGeral));
          if (
            this.descontoGeral <= 0 ||
            isNaN(this.descontoGeral) ||
            this.descontoGeral > 99.99
          ) {
            this.showSnakerbar("Valor de desconto incorreto!", "warning", 2000);
            this.set_desconto(0);
          } else {
            let margemFloat = parseFloat(this.permissoes.margem_preco);
            if (this.descontoGeral > margemFloat) {
              this.set_desconto(margemFloat);
            }
            for (let item of this.itens) {
              let valorAtual = parseFloat(item.valor);
              let valorComDesconto =
                valorAtual - valorAtual * (this.descontoGeral / 100);
              item.valor = valorComDesconto.toFixed(2);
            }
            this.calcular_itens_pedido();
            this.temDesconto = true;
          }
        } catch (error) {
          console.log(error);
          this.set_desconto(0);
          this.showSnakerbar("Valor de desconto incorreto!", "warning", 2000);
        }
      } else {
        this.itens.forEach((element) => {
          element.valor = element.valor_original;
          element.desconto = "";
        });
        this.temDesconto = false;
        this.set_desconto("");
        this.calcular_itens_pedido();
      }
    },
    calcDesconto(row) {
      console.log("oba", row);
      try {
        if (this.temDesconto) {
          console.log("oi", this.temDesconto);
          this.temDesconto = true;
          this.callDescontoGeral();
        }
        let val = row.desconto.replace(",", ".");
        let valFloat = parseFloat(val);
        let margemFloat = parseFloat(this.permissoes.margem_preco);
        if (row.desconto == 0) {
          row.desconto = "";
        }
        if (row.desconto == "") {
          row.valor = row.valor_original;
        }
        if (row.desconto_original > margemFloat) {
          margemFloat = row.desconto_original;
        }
        if (valFloat > margemFloat) {
          valFloat = margemFloat;
          row.desconto = margemFloat;
        }
        if (
          val.match(
            /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
          ) != null
        ) {
          row.valor =
            row.valor_original - row.valor_original * (valFloat / 100);
          this.calcular_itens_pedido();
        }
        let check = [];
        for (let item of this.itens) {
          if (
            item.desconto == 0 ||
            item.desconto == "" ||
            item.desconto == "undefined"
          ) {
            check.push(true);
          } else {
            check.push(false);
          }
        }
        if (check.every((i) => i)) {
          this.podeDesconto = true;
        } else {
          this.podeDesconto = false;
          this.set_desconto(0);
        }
      } catch (error) {}
    },
    resetarDesconto() {
      for (let item of this.itens) {
        delete item.desconto;
        item.valor = item.valor_original;
      }
      this.calcular_itens_pedido();
      this.podeDesconto = true;
    },
    handleChange(newVal) {
      this.calcular_itens_pedido();
    },
    onRemove(index) {
      if (
        (this.itens.length > 1 && this.itens[index].qtd.length === 0) ||
        this.itens[index].qtd == 0
      ) {
        this.$delete(this.itens, index);
        //this.updateAllContent();
        this.calcular_itens_pedido();
      }
    },
    // updateAllContent() {
    //   this.itens.forEach((c, index) => {
    //     const el = document.getElementById(`content-${index}`);
    //     el.innerText = c.qtd;
    //   });
    // },

    removeItem(index) {
      //this.$delete(this.itens, this.selected_item);
      this.$delete(this.itens, index);
      this.calcular_itens_pedido();
    },

    // em manutenção
    editItem(index) {
      //let item = this.itens[this.selected_item];
      // let item = this.itens[index];
      // item.editing = true;
      // item.valido = false;
      // item.index = this.selected_item;
      // this.set_item(item);
    },

    selectItem(row, index) {
      if (this.itens[index] != undefined) {
        let produto = {
          codigo: this.itens[index].codigo,
          descricao: this.itens[index].descricao,
          marca: this.itens[index].marca,
          saldo: this.itens[index].saldo,
          valor: this.itens[index].valor,
        };
        this.set_item_pedido(produto);
        this.set_selected_item_pedido(index);
      }
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
        valor: this.itens[this.selected_item].valor,
      };
      this.set_item_pedido(produto);
    },
    event() {
      let isso = this;
      document;
      this.$refs.tabelaitenspedido.addEventListener("keydown", function (e) {
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