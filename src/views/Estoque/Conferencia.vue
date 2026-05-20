<template>
  <v-container>
    <v-card class="mx-auto" max-width="1000" height="650" elevation="5">
      <v-row>
        <v-col class cols="12" md="3">
          <v-text-field
            v-if="!showDivConferencia"
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="Numero pedido"
            v-mask="'######A'"
            ref="numeroPedido"
            v-model="numeroPedido"
            @keypress.enter="showConferencia()"
            filled
            dense
            autofocus
          ></v-text-field>
          <v-text-field
            v-else
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="Numero pedido"
            v-mask="'######A'"
            v-model="numeroPedido"
            filled
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col v-if="showDivConferencia" cols="12" md="3">
          <v-text-field
            class="ml-n4 uppercase"
            ref="codigo"
            v-model="codigo"
            @keypress.enter="nextTickQtd()"
            filled
            dense
            label="Codigo"
          ></v-text-field>
        </v-col>
        <v-col v-if="showDivConferencia" cols="12" md="2">
          <v-text-field
            class="ml-n8"
            type="number"
            ref="quantidade"
            v-model="quantidade"
            @focus="$event.target.select()"            
            @keypress.enter="insere(codigo, quantidade)"
            filled
            dense
            label="Qtd"
            min="1"
          ></v-text-field>
        </v-col>
        <v-col v-if="showDivConferencia" cols="12" md="4" class="mt-2">
          <v-btn class="error ma-1" @click="dialogCancelarConferencia = true" small>cancelar</v-btn>
          <v-btn class="warning ma-1" @click="dialogPausarConferencia = true" small>pausar</v-btn>
          <v-btn class="primary ma-1" @click="dialogEncerrarConferencia = true" small>encerrar</v-btn>
        </v-col>
      </v-row>

      <q-virtual-scroll
        v-if="this.pedido != 0"
        class="my-sticky-dynamic ma-2"
        type="table"
        dense
        style="max-height: 1000px"
        virtual-scroll
        :virtual-scroll-sticky-size-start="48"
        :items="pedido"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th v-for="col in headers" :key="'1--' + col.name">{{ col.label }}</th>
            </tr>
          </thead>
        </template>

        <template v-slot="{ item: row, index }">
          <tr>
            <td
              v-for="col in headers"
              :key="index + '-' + col.name"
              v-bind:class="checkRowClass(row)"
            >
              <div v-if="col.prop == 'codigo'" class="div-cod text-uppercase">{{row.codigo}}</div>
              <div
                v-else-if="col.prop == 'descricao'"
                class="div-descricao text-body2"
              >{{row.descricao}}</div>
              <div v-else-if="col.prop == 'entrada'">{{row.entrada}} - {{ row.conferente}}</div>

              <div v-else-if="col.prop =='acao' && row.removido == true">
                <v-btn
                  v-if="row.pedido"
                  class="ma-2"
                  @click="confirmAdd(row)"
                  color="success"
                  x-small
                >
                  adicionar
                  <i class="fas fa-plus" small></i>
                </v-btn>
              </div>

              <div v-else-if="col.prop == 'acao' && row.removido == false">
                <v-btn class="ma-2" @click="confirmDelete(row)" color="error" x-small>
                  remover
                  <i class="fas fa-minus-circle ml-2" small></i>
                </v-btn>
              </div>

              <div v-else>{{row[col.prop]}}</div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </v-card>
    <v-dialog v-model="dialogCancelarConferencia" max-width="460" persistent>
      <v-card>
        <v-card-title class="body-3">Deseja realmente cancelar está conferência?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >A conferência será cancelada e todos itens conferidos não serão salvos no pedido!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogCancelarConferencia = false">cancelar</v-btn>
          <v-btn color="primary" @click="cancelarConferencia()">confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPausarConferencia" max-width="460" persistent>
      <v-card>
        <v-card-title class="body-3">Deseja pausar está conferência?</v-card-title>
        <v-card-text>
          <span class="subtitle-1 font-weight-medium">O itens conferidos serão salvos no pedido!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogPausarConferencia = false">cancelar</v-btn>
          <v-btn color="primary" @click="dialogPausarConferencia = false">pausar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEncerrarConferencia" max-width="460" persistent>
      <v-card>
        <v-card-title class="body-3">Deseja encerrar está conferência?</v-card-title>
        <v-card-text>
          <span class="subtitle-1 font-weight-medium">O itens conferidos serão salvos no pedido!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogEncerrarConferencia = false">cancelar</v-btn>
          <v-btn color="primary" @click="dialogEncerrarConferencia = false">encerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRemoverItem" max-width="490" persistent>
      <v-card>
        <v-card-title class="headline">Remover este item do pedido?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >{{objectItem.quantidade}} - {{objectItem.codigo}} - {{objectItem.descricao}}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogRemoverItem = false">cancelar</v-btn>
          <v-btn color="primary" @click="removeItem(objectItem)">remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAddItem" max-width="520" persistent>
      <v-card>
        <v-card-title class="headline">Adicionar este item no pedido novamente?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >{{objectItem.quantidade}} - {{objectItem.codigo}} - {{objectItem.descricao}}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogAddItem = false">cancelar</v-btn>
          <v-btn color="primary" @click="addItem(objectItem)">adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogItemNaoPertencePedido" max-width="380" persistent>
      <v-card>
        <v-card-title class="body-3">Este item não pertence ao Pedido!</v-card-title>
        <div class="pa-4 text-center">
          <v-btn color="primary" width="120px" @click="nextTickCod()">Ok</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    showDivConferencia: false,
    numeroPedido: "",
    codigo: "",
    quantidade: 1,
    pedido: [],
    headers: [
      {
        name: "quantidade",
        prop: "quantidade",
        align: "center",
        label: "Qtd",
        field: "quantidade",
        sortable: true
      },
      {
        name: "codigo",
        prop: "codigo",
        align: "center",
        label: "Codigo",
        field: "codigo",
        sortable: true
      },
      {
        name: "descricao",
        prop: "descricao",
        align: "center",
        label: "Descrição",
        field: "descricao",
        sortable: true
      },
      {
        name: "entrada",
        prop: "entrada",
        align: "center",
        label: "Data e Hora",
        field: "entrada",
        sortable: true
      },
      {
        name: "acao",
        prop: "acao",
        align: "center",
        label: "Ação",
        field: "acao",
        sortable: true
      }
    ],
    dialogItemNaoPertencePedido: false,
    dialogCancelarConferencia: false,
    dialogPausarConferencia: false,
    dialogEncerrarConferencia: false,
    dialogRemoverItem: false,
    dialogAddItem: false,
    objectItem: {},
    id: 0
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    checkRowClass(row) {
      let rowClass = "";
      if (row.pedido && row.removido == false) {
        rowClass = "bg-green-5 text-white";
      }
      if (row.pedido && row.removido != false) {
        rowClass = "bg-red-12 text-white";
      }
      if (row.pedido == false) {
        rowClass = "bg-amber-14 text-black";
      }
      return rowClass;
    },
    nextTickCod() {
      this.dialogItemNaoPertencePedido = false;
      this.$nextTick(() => this.$refs.codigo.focus());
    },
    nextTickQtd() {
      this.$nextTick(() => this.$refs.quantidade.focus());
    },
    showConferencia() {
      this.showDivConferencia = true;
      this.$nextTick(() => this.$refs.codigo.focus());
    },
    insere(codigo, quantidade) {
      codigo = codigo.replace(/\s/g, "");
    
      if (codigo.length >= 4 && this.quantidade != 0) {
        let checkCodigo = this.pedido.find(i => i.codigo == codigo);
        // se ja repetido add quantidade
        if (checkCodigo) {
          this.pedido.forEach(i => {
            // add qtd item nao pertence pedido
            if (i.codigo == codigo && i.pedido == false) {
              this.dialogItemNaoPertencePedido = true;
              i.quantidade = parseInt(i.quantidade) + parseInt(quantidade);
            }
            // add qtd item pertence pedido
            if (i.codigo == codigo && !i.pedido == false) {
              i.quantidade = parseInt(i.quantidade) + parseInt(quantidade);
            }
            // add qtd item pertence a pedido e foi removido
            if (
              i.codigo == codigo &&
              !i.pedido == false &&
              !i.removido == false
            ) {
              i.quantidade = parseInt(i.quantidade);
            }
          });
          this.codigo = "";
          this.quantidade = 1;
          this.$nextTick(() => this.$refs.codigo.focus());
        } else {
          // se nao item nao esta no pedido add e pinta linha de vermelho
          if (codigo == "teste" || codigo == "123456") {
            this.dialogItemNaoPertencePedido = true;

            this.pedido.push({
              pedido: false,
              id: this.pedido.length + 1,
              quantidade: quantidade,
              codigo: codigo,
              descricao:
                "Autofocus processing was blocked because a document already.",
              entrada: this.dateNowImpress(),
              conferente: "Leonardo da Vinci",
              removido: true
            });
            this.codigo = "";
            this.quantidade = 1;
            this.$nextTick(() => this.$refs.codigo.focus());
          } else {
            //  add to pedido
            this.pedido.push({
              pedido: true,
              id: this.pedido.length + 1,
              quantidade: quantidade,
              codigo: codigo,
              descricao:
                "Autofocus processing was blocked because a document already has a focused element.",
              entrada: this.dateNowImpress(),
              conferente: "Leonardo da Vinci",
              removido: false
            });
            this.codigo = "";
            this.quantidade = 1;
            this.$nextTick(() => this.$refs.codigo.focus());
          }
        }
      }
    },
    confirmDelete(item) {
      this.objectIndex = this.pedido.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogRemoverItem = true;
    },
    removeItem(item) {
      let i = 0;
      for (i of this.pedido) {
        if (i.codigo == item.codigo) {
          i.removido = true;
        }
      }
      this.dialogRemoverItem = false;
      this.$nextTick(() => this.$refs.codigo.focus());
    },
    confirmAdd(item) {
      this.objectIndex = this.pedido.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogAddItem = true;
    },
    addItem(item) {
      let i = 0;
      for (i of this.pedido) {
        if (i.codigo == item.codigo) {
          i.removido = false;
        }
      }
      this.dialogAddItem = false;
      this.$nextTick(() => this.$refs.codigo.focus());
    },
    cancelarConferencia() {
      this.numeroPedido = "";
      this.pedido = [];
      this.showDivConferencia = false;
      this.dialogCancelarConferencia = false;
      this.$nextTick(() => this.$refs.numeroPedido.focus());
    },
    dateNowImpress() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var seconds = today.getSeconds();

      today =
        dd +
        "/" +
        mm +
        "/" +
        yyyy +
        " - " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

      return today;
    }
  }
};
</script>
   <style scope>
/* .uppercase input {
  text-transform: uppercase;
} */
</style>
<style>
.uppercase input {
  text-transform: uppercase;
}

.div-descricao {
  max-width: 500px;
  white-space: normal;
}
</style>