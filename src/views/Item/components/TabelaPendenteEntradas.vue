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
        :items="entradas"
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
            :class="{ 'blue lighten-4': index === selected_item_pendente_entrada }"
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
      { text: "Saldo", sortable: true, value: "saldo" },
    ],
    entradas: [
      {
        codigo: "01",
        mes: "12",
        ano: "2010",
        saldo: "100",
      },
      {
        codigo: "02",
        mes: "10",
        ano: "2019",
        saldo: "99",
      },
    ],
  }),
  mounted() {
    this.event();
  },
  computed: {
    ...mapState({
      //   error: (state) => state.item.error,
      selected_item_pendente_entrada: (state) => state.item.selected_item_pendente_entrada,
    }),
  },
  methods: {
    ...mapMutations(["set_selected_item_pendente_entrada", "set_item_pendente_entrada", "set_selected_item_realizado_entrada", "set_selected_item_realizado_saida", "set_selected_item_pendente_saida" ]),

    selectItemEntrada(row, index) {
      this.entrada = {
        mes: this.entradas[index].codigo,
        ano: this.entradas[index].mes,
        saldo: this.entradas[index].ano,
      };

      this.set_item_pendente_entrada(this.entrada);
      this.set_selected_item_pendente_entrada(index);
      this.set_selected_item_realizado_entrada(null);
      this.set_selected_item_realizado_saida(null);
      this.set_selected_item_pendente_saida(null);
    },
    move(index, dest) {
      this.set_selected_item_pendente_entrada(index);
      if (dest == "prev") {
        if (this.selected_item_pendente_entrada < 0) {
          this.set_selected_item_pendente_entrada(0);
          index = 0;
        }
      } else {
        if (this.selected_item_pendente_entrada >= this.entradas.length) {
          this.set_selected_item_pendente_entrada(this.entradas.length - 1);
          this.selectedEntrada = this.entradas.length - 1;
          index = this.entradas.length - 1;
        }
      }
      this.$refs.tabelaEntrada.scrollTo(this.selected_item_pendente_entrada);

      this.entrada = {
        mes: this.entradas[index].codigo,
        ano: this.entradas[index].mes,
        saldo: this.entradas[index].ano,
      };

      this.set_item_pendente_entrada(this.entrada);
    },
    event() {
      let isso = this;
      this.$refs.tabelaEntradas.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item_pendente_entrada + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item_pendente_entrada - 1, "prev");
        }
      });
    },
  },
};
</script>
