<template>
  <v-container>
    <v-card class="mx-auto" max-width="1000" height="650" elevation="5">
      <v-row>
        <v-col cols="12" md="3">       
          <v-text-field
            v-if="!divCancelarNotaFiscal"
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="NÃºmero pedido"
            v-mask="'######A'"
            v-model="numeroPedido"
             ref="numeroPedido"
            @keypress.enter="showDivCancelarNotaFiscal(numeroPedido)"
            filled
            dense  
            autofocus          
          ></v-text-field>
           <v-text-field
            v-else
            class="ml-4 uppercase"
            append-icon="fa-search"
            label="NÃºmero pedido"
            v-mask="'######A'"
            v-model="numeroPedido"
            filled
            dense
            readonly
          ></v-text-field>
        </v-col>
        <v-col v-if="divCancelarNotaFiscal" cols="12" md="8" class="mt-2 text-right">
          <v-btn class="error ma-1" @click="dialogCancelarNotaFiscal = true" small>voltar</v-btn>          
          <v-btn class="primary ma-1" @click="dialogConcluirCancelamentoNotaFiscal = true" small>Concluir Cancelamento</v-btn>
        </v-col>
      </v-row>      

      <div v-if="divCancelarNotaFiscal">
          <v-row align="center" justify="center">
        <v-col cols="12" md="10">
          <v-row class="mt-n8" align="center" justify="center">
                  
            <v-col cols="12" md="4">
               <v-select
                :items="['Pendente', 'Aprovado', 'Emitido', 'Separando', 'Separado', 'Conferido', 'Pausado', 'Conferindo', 'Faturado', 'Expedido', 'Entregue', 'Saldo',
                'Cancelado', 'DevoluÃ§Ã£o', 'Denegado', 'Atrasado', 'Separado Parcial', 'Operacional' ]"                
                label="Status"
                filled
                dense
              ></v-select>
              </v-col>    
               <v-col cols="12" md="4">
                 <v-text-field               
                type="number"
                min="0"
                 label="Nota Fiscal"  
                 @focus="$event.target.select()"             
                filled
                dense
              ></v-text-field>
                 </v-col>        
          </v-row>
           <v-row class="mt-n10" align="center" justify="center">
            <v-col cols="12" md="8">
              <v-text-field     
                class="uppercase"          
                label="Cliente ou Fornecedor"               
                filled
                dense
              ></v-text-field>
            </v-col>
          </v-row>        
                
          <v-row class="mt-n10" align="center" justify="center">
            <v-col cols="12" md="8">
              <v-textarea        
                class="uppercase-area"         
                filled
                label="ObservaÃ§Ãµes"
                rows="4"
                row-height="30"  
                :rules="rules" hide-details="auto"              
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      </div>
    </v-card>

    <v-dialog v-model="dialogCancelarNotaFiscal" max-width="500" persistent>
      <v-card>
        <v-card-title class="body-3">Voltar a pÃ¡gina anterior?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >EstÃ¡ nota fiscal nÃ£o serÃ¡ cancelada.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogCancelarNotaFiscal = false">nÃ£o</v-btn>
          <v-btn color="primary" @click="cancelarNotaFiscal()">sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialogConcluirCancelamentoNotaFiscal" max-width="500" persistent>
      <v-card>
        <v-card-title class="body-3">Concluir o cancelamento desta nota fiscal?</v-card-title>
        <v-card-text>
          <span
            class="subtitle-1 font-weight-medium"
          >ApÃ³s confirmaÃ§Ã£o de exclusÃ£o nÃ£o serÃ¡ possÃ­vel desfazÃª-la!</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogConcluirCancelamentoNotaFiscal = false">nÃ£o</v-btn>
          <v-btn color="primary" @click="dialogConcluirCancelamentoNotaFiscal = false">sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>
<script>
export default {
  data: () => ({
    numeroPedido: "",
    divCancelarNotaFiscal: false,
    dialogCancelarNotaFiscal: false,
    dialogConcluirCancelamentoNotaFiscal: false,
    rules: [        
        value => (value && value.length >= 10) || 'Escreva o motivo do cancelamento',
      ],
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },

  methods: {
    showDivCancelarNotaFiscal(numeroPedido) {
      if (numeroPedido.length >= 7) {
        this.divCancelarNotaFiscal = true;
      }
    },

    cancelarNotaFiscal() {
      this.divCancelarNotaFiscal = false;
      this.dialogCancelarNotaFiscal = false;
      this.numeroPedido = "";
      this.$nextTick(() => this.$refs.numeroPedido.focus());
    }
    
  }
};
</script>
    <style scope>
.uppercase-area textarea {
  text-transform: uppercase;
}
</style>