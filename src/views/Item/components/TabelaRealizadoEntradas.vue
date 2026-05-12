<template>
  <v-container>
    <div ref="tabelaEntradas" tabindex="1">
      <q-virtual-scroll
        ref="tabelaEntrada"
        class="my-sticky-dynamic"
        type="table"
        style="max-height: 20vh"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="itens_realizado_entrada"
        flat
        dense
        tabindex="2"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headers" :key="'1--' + col.text">{{ col.text }}</th>
            </tr>
          </thead>
        </template>

        <template v-slot="{ item: row, index }">
          <tr
            @click="selectItemEntrada(row, index)"
            dense
            :key="index"
            :class="{ 'blue lighten-4': index === selected_item_realizado_entrada }"
          >
            <td v-for="col in headers" :key="index + '-' + col.text">
              <div>{{ row[col.value] }}</div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </div>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    headers: [
      { text: "MÃªs", sortable: true, value: "mes" },
      { text: "Ano", sortable: true, value: "ano" },
      { text: "Total", sortable: true, value: "total" },
    ],
  }),
  mounted() {
    this.event();
  },
  created() {
    this.set_selected_item_realizado_entrada(null);
    this.getEntradas();
  },
  computed: {
    ...mapState({
      item: (state) => state.item.item,
      // itens_historico: (state) => state.item.itens_historico,
      itens_realizado_entrada: (state) => state.item.itens_realizado_entrada,
      selected_item_realizado_entrada: (state) =>
        state.item.selected_item_realizado_entrada,
    }),
  },
  methods: {
    ...mapActions(["getRealizadoEntrada"]),
    ...mapMutations([
      "set_itens_historico",
      "set_selected_item_realizado_entrada",
      "set_selected_item_realizado_saida",
      "set_selected_item_pendente_entrada",
      "set_selected_item_pendente_saida",
    ]),

    selectItemEntrada(row, index) {
      this.set_itens_historico(this.itens_realizado_entrada[index].registros);
      this.set_selected_item_realizado_entrada(index);
      this.set_selected_item_realizado_saida(null);
      this.set_selected_item_pendente_entrada(null);
      this.set_selected_item_pendente_saida(null);
    },
    move(index, dest) {
      this.set_selected_item_realizado_entrada(index);
      if (dest == "prev") {
        if (this.selected_item_realizado_entrada < 0) {
          this.set_selected_item_realizado_entrada(0);
          index = 0;
        }
      } else {
        if (
          this.selected_item_realizado_entrada >=
          this.itens_realizado_entrada.length
        ) {
          this.set_selected_item_realizado_entrada(
            this.itens_realizado_entrada.length - 1
          );
          index = this.itens_realizado_entrada.length - 1;
        }
      }
      this.$refs.tabelaEntrada.scrollTo(this.selected_item_realizado_entrada);
      this.set_itens_historico(this.itens_realizado_entrada[index].registros);
    },
    event() {
      let isso = this;
      this.$refs.tabelaEntradas.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item_realizado_entrada + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item_realizado_entrada - 1, "prev");
        }
      });
    },
    async getEntradas() {
      await this.getRealizadoEntrada(this.item);
    },
  },
};
</script>
 