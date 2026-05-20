<template>
  <v-container>
    <v-card class="mx-auto" max-width="1000" height="650" elevation="5">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="!divEmissaoFaturamento"
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="Número pedido"
            v-mask="'######A'"
            ref="numeroPedido"
            v-model="numeroPedido"
            @keypress.enter="showDivFaturamento(numeroPedido)"
            filled
            dense
            autofocus
          ></v-text-field>
          <v-text-field
            v-else
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="Número pedido"
            v-mask="'######A'"
            v-model="numeroPedido"
            filled
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col v-if="divEmissaoFaturamento" cols="12" md="8" class="mt-2 text-right">
          <v-btn class="error ma-1" @click="dialogCancelarFaturamento = true" small>cancelar</v-btn>
          <v-btn class="success ma-1" @click="dialogSalvarFaturamento = true" small>salvar</v-btn>
          <v-btn class="primary ma-1" @click="dialogFaturar = true" small>faturar</v-btn>
        </v-col>
      </v-row>

      <div v-if="divEmissaoFaturamento">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8">
            
              <v-row class="mt-n8" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Status</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="['Emitido', 'Separando', 'Separado', 'Conferindo', 'Pausado', 'Conferido', 'Faturado', 'Expedido', 'Entregue', 'Saldo', 'Cancelado', 'Devolução', 'Denegado', 'Atrasado', 'Separado Parcial', 'Operacional']"
                     background-color="grey lighten-2"                   
                    required
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Carteira</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="['BOLETO BANCÁRIO', 'CHEQUE', 'CRÃ‰DITO CONTA', 'DEPÃ“SITO', 'DINHEIRO', 'ELO', 'MASTER', 'MENSALISTA', 'VISA']"
                     background-color="grey lighten-2"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Natureza de Operação</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="['*VENDA (ESTADUAL)', '*VENDA (INTERESTADUAL)', 'COMPRA (CONCORRÃŠNCIA)', 'COMPRA (NOTA)', 'DEVOLUÃ‡ÃƒO DE MERCADORIAS', 'DEVOLUÃ‡ÃƒO DE MERCADORIAS', 'DEVOLUÃ‡ÃƒO (ESTADUAL)',
                 'DEVOLUÃ‡ÃƒO (INTERESTADUAL)', 'DEVOLUÃ‡ÃƒO (INTERESTADUAL)', 'DEVOLUÃ‡ÃƒO DE DEMONSTRAÃ‡ÃƒO', 'REMESSA DE MERCADORIA PARA CONSERTO(ESTADUAL)', 'REMESSA DE MERCADORIA PARA CONSERTO(ESTADUAL)',
                  'SIMPLES REMESSA(ESTADUAL)', 'TROCA', '*VENDA (INTERESTADUAL)', '*VENDA CONTRIBUINTE (INTERESTADUAL)', 'DEVOLUÃ‡ÃƒO (INTERESTADUAL)', 'REMESSA MERCADORIA PARA CONSERTO (INTERESTADUAL)', 
                  'DEVOLUÃ‡ÃƒO (INTERESTADUAL)', 'SIMPLES REMESSA (INTERESTADUAL)', 'TROCA (INTERESTADUAL)', 'ESTORNO ENTREGA FUTURA (INTERESTADUAL)' ]"
                   background-color="grey lighten-2"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Nota Fiscal</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field @focus="$event.target.select()" background-color="grey lighten-2" type="number" min="1"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="2">
                  <v-subheader>Peso</v-subheader>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field @focus="$event.target.select()" background-color="grey lighten-2" type="number" min="1"></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-subheader>Volume</v-subheader>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field @focus="$event.target.select()" background-color="grey lighten-2" type="number" min="1"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Separador</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select :items="['FULANO', 'MARIO']"  background-color="grey lighten-2" required></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="4">
                  <v-subheader>Conferente</v-subheader>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select :items="['FULANO', 'MARIO']"  background-color="grey lighten-2"  required></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n10" align="center" justify="center">
                <v-col cols="12" md="9">
                  <v-textarea
                    class="ma-4"
                    background-color="grey lighten-2"
                    filled
                    label="Observações"
                    rows="4"
                    row-height="30"
                    readonly
                  ></v-textarea>
                </v-col>
              </v-row>
            
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-dialog v-model="dialogCancelarFaturamento" max-width="500" persistent>
      <v-card>
        <v-card-title class="body-3">Deseja realmente cancelar está Faturamento?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >O faturamento será cancelado e os dados não serão salvos!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogCancelarFaturamento = false">cancelar</v-btn>
          <v-btn color="primary" @click="cancelarFaturamento()">confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSalvarFaturamento" max-width="500" persistent>
      <v-card>
        <v-card-title class="body-3">Salvar Faturamento?</v-card-title>
        <v-card-text>
          <span class="subtitle-1 font-weight-medium">Os dados do faturamento serão salvos!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogSalvarFaturamento = false">cancelar</v-btn>
          <v-btn color="primary" @click="dialogSalvarFaturamento = false">salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogFaturar" max-width="500" persistent>
      <v-card>
        <v-card-title class="body-3">Deseja Faturar?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >Após confirmar este faturamento não será mais possível alterá-lo!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogFaturar = false">cancelar</v-btn>
          <v-btn color="primary" @click="dialogFaturar = false">Faturar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    numeroPedido: "",
    divEmissaoFaturamento: false,
    dialogCancelarFaturamento: false,
    dialogSalvarFaturamento: false,
    dialogFaturar: false
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    showDivFaturamento(numeroPedido) {
      if (numeroPedido.length >= 7) {
        this.divEmissaoFaturamento = true;
      }
    },
    cancelarFaturamento() {
      this.divEmissaoFaturamento = false;
      this.dialogCancelarFaturamento = false;
      this.numeroPedido = "";
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
  