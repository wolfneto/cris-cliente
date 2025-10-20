<template>
  <v-container>
    <q-virtual-scroll
      class="my-sticky-dynamic"
      type="table"
      style="max-height: 40vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="arrayHistorico"
      flat
      dense
    >
      <template v-slot:before>
        <thead class="text-left">
          <tr>
            <th v-for="col in headerHistoricoPedido" :key="'1--' + col.name">{{ col.name }}</th>
          </tr>
        </thead>
      </template>
      <template v-slot="{ item: row, index }">
        <tr :key="index">
          <td
            v-for="column in headerHistoricoPedido"
            :key="index + '-' + column.name"
          >{{ row[column.prop] }}</td>
        </tr>
      </template>
    </q-virtual-scroll>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    headerHistoricoPedido: [
      { name: "Pedido", prop: "id" },
      { name: "Quantidade", prop: "quantidade" },
      { name: "Observação", prop: "observacao" },
      { name: "Cliente/Fornecedor", prop: "cliente_fornecedor" },
      { name: "Inserido por", prop: "criado_por" },
      { name: "Data", prop: "date_create" },
    ],
  }),
  created() {
    this.set_itens_historico(null);
  },
  computed: {
    ...mapState({
      itens_historico: (state) => state.item.itens_historico,
    }),
    arrayHistorico() {
      if (this.itens_historico) {
        this.itens_historico.forEach((element) => {
          element.itens_entrada_saida_manuals.forEach((i) => {
            element.observacao = i.observacao;
            element.quantidade = i.quantidade;
          });
        });
        return this.itens_historico;
      }
    },
  },
  methods: {
    ...mapMutations(["set_itens_historico"]),
  },
};
</script>