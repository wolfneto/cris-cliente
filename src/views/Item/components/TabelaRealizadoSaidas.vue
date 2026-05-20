<template>
  <v-container>
    <div ref="tabelaSaidas" tabindex="1">
      <q-virtual-scroll
        ref="tabelaSaida"
        class="my-sticky-dynamic"
        type="table"
        style="max-height: 20vh"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="itens_realizado_saida"
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
            @click="selectItemSaida(row, index)"
            dense
            :key="index"
            :class="{ 'blue lighten-4': index === selected_item_realizado_saida }"
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
      { text: "Mês", sortable: true, value: "mes" },
      { text: "Ano", sortable: true, value: "ano" },
      { text: "Total", sortable: true, value: "total" },
    ],
  }),
  mounted() {
    this.event();
  },
  created() {
    this.set_selected_item_realizado_saida(null);
    this.getSaidas();
  },
  computed: {
    ...mapState({
      item: (state) => state.item.item,
      itens_realizado_saida: (state) => state.item.itens_realizado_saida,
      selected_item_realizado_saida: (state) =>
        state.item.selected_item_realizado_saida,
    }),
  },
  methods: {
    ...mapActions(["getRealizadoSaida"]),
    ...mapMutations([
      "set_itens_historico",
      "set_selected_item_realizado_saida",
      "set_selected_item_realizado_entrada",
      "set_selected_item_pendente_entrada",
      "set_selected_item_pendente_saida",
    ]),

    selectItemSaida(row, index) {
      this.set_itens_historico(this.itens_realizado_saida[index].registros);
      this.set_selected_item_realizado_saida(index);
      this.set_selected_item_realizado_entrada(null);
      this.set_selected_item_pendente_entrada(null);
      this.set_selected_item_pendente_saida(null);
    },
    move(index, dest) {
      this.set_selected_item_realizado_saida(index);
      if (dest == "prev") {
        if (this.selected_item_realizado_saida < 0) {
          this.set_selected_item_realizado_saida(0);
          index = 0;
        }
      } else {
        if (
          this.selected_item_realizado_saida >=
          this.itens_realizado_saida.length
        ) {
          this.set_selected_item_realizado_saida(
            this.itens_realizado_saida.length - 1
          );
          index = this.itens_realizado_saida.length - 1;
        }
      }
      this.$refs.tabelaSaida.scrollTo(this.selected_item_realizado_saida);
      this.set_itens_historico(this.itens_realizado_saida[index].registros);
    },
    event() {
      let isso = this;
      this.$refs.tabelaSaidas.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item_realizado_saida + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item_realizado_saida - 1, "prev");
        }
      });
    },
    async getSaidas() {
      await this.getRealizadoSaida(this.item);
    },
  },
};
</script>
