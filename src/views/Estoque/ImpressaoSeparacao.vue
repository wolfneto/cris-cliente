<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="1800" height="700" elevation="4">
      <v-row class="ma-auto">
        <v-col class cols="12" md="6">
          <TabelaPedidosImprimir></TabelaPedidosImprimir>
        </v-col>
        <v-col class cols="12" md="6">
          <v-row>
            <v-col cols="12" md="3">
              <span class="headline">Historico</span>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-mask="'##/##/####'"
                placeholder="dd/mm/aaaa"
                label="De"
                required
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-mask="'##/##/####'"
                placeholder="dd/mm/aaaa"
                label="Até"
                required
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn depressed small color="primary">
                <i class="fas fa-search mr-2"></i>Buscar
              </v-btn>
            </v-col>
          </v-row>
          <div>
            <v-card elevation="2">
              <v-data-table
                :headers="headers"
                :items="pedidos"
                dense
                height="550"
                hide-default-footer
              >
                <template v-slot:top>
                  <v-dialog v-model="dialogItensPedido" max-width="800px">
                    <v-card height="800px">
                      <v-card-title>
                        <v-row>
                          <v-col cols="12" md="6">
                            <span class="headline">Itens do pedido</span>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text small @click="voltar()">Voltar</v-btn>
                            </v-card-actions>
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <!-- <v-text-field v-model="editedItem.pedido" label="Dessert name"></v-text-field> -->
                          <v-simple-table dense>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">Pedido</th>
                                  <th class="text-left">Status</th>
                                  <th class="text-left">Total</th>
                                  <th class="text-left">Cliente</th>
                                  <th class="text-left">Vendedor</th>
                                  <th class="text-left">Usuario</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="item in pedidos" :key="item.id">
                                  <td>{{ item.pedido }}</td>
                                  <td>{{ item.status }}</td>
                                  <td>{{ item.total }}</td>
                                  <td>{{ item.cliente }}</td>
                                  <td>{{ item.status }}</td>
                                  <td>{{ item.usuario }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </template>
                <template v-slot:item.visualizar="{item}">
                  <v-btn text small @click="verItensPedido(item)">
                    <i class="fas fa-eye primary--text"></i>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import TabelaPedidosImprimir from "./components/TabelaPedidosImprimir";

export default {
  components: {
    TabelaPedidosImprimir
  },
  data: () => ({
    dialogItensPedido: false,
    headers: [
      {
        text: "Ver itens",
        align: "start",
        sortable: false,
        value: "visualizar",
        width: "20px"
      },
      { text: "Pedido", value: "pedido" },
      { text: "Status", value: "status" },
      { text: "Total", value: "total" },
      { text: "Cliente", value: "cliente" },
      { text: "Vendedor", value: "vendedor" },
      { text: "Usuario", value: "usuario" },
      { text: "Usuario", value: "usuario" }

    ],
    pedidos: [
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      },
      {
        pedido: "102030A",
        status: 159,
        total: "text",
        cliente: "teste",
        vendedor: "item",
        usuario: "item2"
      }
    ],
    editedIndex: -1,
    editedItem: {
      visualizar: "",
      pedido: "",
      status: "",
      cliente: "",
      vendedor: "",
      usuario: "",
    },
    defaultItem: {
      visualizar: "",
      pedido: "",
      status: "",
      cliente: "",
      vendedor: "",
      usuario: "",
    }
  }),
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    verItensPedido(item) {
      this.editedIndex = this.pedidos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogItensPedido = true;
    },
    voltar() {
      this.dialogItensPedido = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>