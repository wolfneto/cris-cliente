<template>
  <!-- <v-data-table
    v-if="toggle"
    fixed-header
    dense
    :headers="headersProdutos"
    height="150"
    hide-default-footer
    :items="produtos"
    disable-pagination
    class="elevation-1"
  >
    <template v-slot:item.valor="{item}">R$ {{formatValues(item.valor)}}</template>
    <template v-slot:item.qtd="{item}">
      <v-text-field
        class="input-qtd-produtos input-no-details"
        dense
        @click:append="addOrRemoveItem(item)"
        @keypress.enter="addOrRemoveItem(item)"
        :append-icon="item.added ? 'fa-times error--text': 'fa-check success--text'"
        v-model="item.qtd"
      ></v-text-field>
    </template>
  </v-data-table>-->

  <q-virtual-scroll
    ref="tabela"
    type="table"
    dense
    style="max-height: 19vh"
    :virtual-scroll-sticky-size-start="24"
    :items="produtos"
  >
    <template v-slot:before>
      <thead class="thead-sticky text-left">
        <tr>
          <th v-for="col in headers" :key="'1--' + col.text">{{ col.text }}</th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, index }">
      <tr @click="selectProduto(index)" dense :key="index">
        <td v-for="col in headers" :key="index + '-' + col.text">
          <div v-if="col.value == 'codigo'">{{ row[col.value] }}</div>
          <div v-if="col.value == 'saldo' && permissoes.ver_saldo == 1">
            <b v-if="row[col.value] > 0" class="success--text">{{ row[col.value] }}</b>
            <b v-else class="error--text">{{ row[col.value] }}</b>
          </div>
          <div v-if="col.value == 'descricao'">{{ row[col.value] }}</div>
          <div v-if="col.value == 'marca'">{{ row[col.value] }}</div>
          <div v-if="col.value == 'valor' && permissoes.ver_preco == 1">{{ formatValues(row[col.value]) }}</div>
          <div v-if="col.value == 'qtd'">
            <v-text-field
              style="width: 80px"
              class="input-qtd-produtos input-no-details"
              dense
              @click:append="addOrRemoveItem(row)"
              @keypress.enter="addOrRemoveItem(row)"
              :append-icon="row.added ? 'fa-times error--text': 'fa-check success--text'"
              v-model="row.qtd"
            ></v-text-field>
          </div>
        </td>
      </tr>
    </template>
  </q-virtual-scroll>
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
        { text: "Código", value: "codigo", sortable: true },
        { text: "Saldo", value: "saldo", sortable: true },
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Marca", value: "marca", sortable: true },
        { text: "Valor", value: "valor", sortable: true },
        { text: "Qtd", value: "qtd", sortable: false, width: 100 }
      ]
    };
  },
  created() {
    this.get_permissoes({
      id_usuario: this.$usuario.value.id,
      pagina: "inserir_lista",
    });
  },
  computed: {
    ...mapState({
      permissoes: (state) => state.permissoes,
      produtos: state => state.listas.produtos
    })
  },
  methods: {
    ...mapMutations(["setProduto", "setSelectedProduto"]),
    ...mapActions(["get_permissoes"]),

    selectProduto(index) {
      this.setSelectedProduto(index);
      
    },

    formatValues(val) {
      if (!isNaN(val)) {
        val = parseFloat(val);
        return val.toFixed(2).replace(".", ",");
      }
    }
  }
};
</script>
<style scoped lang="sass">
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