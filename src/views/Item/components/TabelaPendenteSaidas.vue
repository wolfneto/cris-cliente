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
        :items="saidas"
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
            :class="{ 'blue lighten-4': index === selected_item_pendente_saida }"
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
    saidas: [
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
      selected_item_pendente_saida: (state) => state.item.selected_item_pendente_saida,
    }),
  },
  methods: {
  ...mapMutations(["set_selected_item_pendente_saida", "set_item_pendente_saida", "set_selected_item_realizado_entrada", "set_selected_item_realizado_saida", "set_selected_item_pendente_entrada"]),

    selectItemSaida(row, index) {
      this.saida = {
        mes: this.saidas[index].codigo,
        ano: this.saidas[index].mes,
        saldo: this.saidas[index].ano,
      };

      this.set_item_pendente_saida(this.saida);
      this.set_selected_item_pendente_saida(index);
       this.set_selected_item_realizado_entrada(null);
      this.set_selected_item_realizado_saida(null);
      this.set_selected_item_pendente_entrada(null);
    },
    move(index, dest) {
      this.set_selected_item_pendente_saida(index);
      if (dest == "prev") {
        if (this.selected_item_pendente_saida < 0) {
          this.set_selected_item_pendente_saida(0);
          index = 0;
        }
      } else {
        if (this.selected_item_pendente_saida >= this.saidas.length) {
          this.set_selected_item_pendente_saida(this.saidas.length - 1);
          this.selectedSaida = this.saidas.length - 1;
          index = this.saidas.length - 1;
        }
      }
      this.$refs.tabelaSaida.scrollTo(this.selected_item_pendente_saida);

      this.saida = {
        mes: this.saidas[index].codigo,
        ano: this.saidas[index].mes,
        saldo: this.saidas[index].ano,
      };

      this.set_item_pendente_saida(this.saida);
    },
    event() {
      let isso = this;
      this.$refs.tabelaSaidas.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.move(isso.selected_item_pendente_saida + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.move(isso.selected_item_pendente_saida - 1, "prev");
        }
      });
    },
  },
};
</script>
