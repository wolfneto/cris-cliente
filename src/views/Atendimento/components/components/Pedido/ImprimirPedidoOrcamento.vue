<template>
  <v-container>
      <div v-for="(pedidoTeste, index) in itens_pedido" :key="pedidoTeste.ordem">
        <!-- <div style="position: fixed;top: 0;height: 255px;width: 100%;"> -->
        <div>
          <v-row>
            <v-col class="text-left" cols="6">
              <div>
                <span class="font-weight-bold" style="font-size: 1.5rem">ORÃ‡AMENTO</span>
                <span
                v-if="!previa"
                  class="font-weight-bold"
                  style="font-size: 1.5rem"
                > {{pedido.numero}}</span>
              </div>
              <!-- <span
                style="font-size: 1.3rem"
                class="font-weight-bold"
              >{{pedidoDcinfo.cliente.ygrucli}}</span> -->
            </v-col>
            <v-col class="text-left" cols="3">
                <span class="font-weight-bold" style="font-size: 1.5rem">EM ANÁLISE</span>
            </v-col>
            <v-col class="text-right" cols="3">
              <barcode :height="30" :display-value="false" v-bind:value="next_id"></barcode>
              Página {{index +1}}/{{itens_pedido.length}}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Cliente:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span
                class="font-weight-bold"
              >{{cliente.codigo}} - {{cliente.razao_social}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Fantasia:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{cliente.fantasia}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Operação:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">* VENDA (ESTADUAL)</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Endereço:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span
                class="font-weight-bold"
              >{{cliente.endereco_principal.logradouro}}, {{cliente.endereco_principal.numero}} {{cliente.endereco_principal.complemento}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Vendedor:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{arrayTeste[0][0].yusaped}}</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Bairro:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{cliente.endereco_principal.bairro}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Atendente:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{arrayTeste[0][0].yusaped}}</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Cidade/UF:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span
                class="font-weight-bold"
              >{{cliente.endereco_principal.cidade}} - {{cliente.endereco_principal.uf}} - {{cliente.endereco_principal.cep}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Pgto:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <div v-if="pedidoDcinfo.pagamento.tipo == 'BOLETO'">
                <span class="font-weight-bold">BOLETO Á VISTA</span>
              </div>
              <div v-else>
                <span class="font-weight-bold">CARTÃƒO {{pedidoDcinfo.pagamento.number_installments}}x</span>
              </div>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">CPF/CNPJ:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span class="font-weight-bold">{{cliente.cpf_cnpj}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Fone/Cel:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span
                class="font-weight-bold"
              >{{cliente.telefone}} / {{cliente.celular}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Email:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span class="font-weight-bold">{{cliente.email}}</span>
            </v-col>
          </v-row>
        </div>
        <table
          style="width:100%; border-collapse: collapse; border-spacing: 5px; margin-bottom: 455px;"
        >
          <thead>
            <tr>
              <td>
                <!-- <div style="height: 250px;">&nbsp;</div> -->
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="mt-3">
                  <table style="width:100%; border-collapse: collapse; border-spacing: 5px;">
                    <thead style="border: 1px solid #000000;">
                      <tr>
                        <th style="text-align: center;">QTD</th>
                        <th>ITEM</th>
                        <th style="text-align: center;">COD</th>
                        <th style="text-align: center;">VALOR</th>
                        <th style="text-align: center;">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in pedidoTeste" :key="item.ordem">
                        <td
                          class="font-weight-bold"
                          style="text-align: center;"
                        >{{parseInt(item.qtd)}}</td>
                        <td>{{item.descricao}}</td>
                        <td style="border: 1px solid black;text-align: center;">
                          <span style="margin:4px">{{item.codigo}}</span>
                        </td>
                        <td
                          class="font-weight-bold"
                          style="text-align: center;"
                        >{{moneyFormatted(item.valor).replace('R$&nbsp;', '')}}</td>
                        <td
                          class="font-weight-bold"
                          style="text-align: center;"
                        >{{moneyFormatted(parseInt(item.qtd) * parseFloat(item.valor)).replace('R$&nbsp;', '')}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <v-divider></v-divider>
                  <div v-if="(index + 1) == itens_pedido.length" style="border: 1px solid black;">
                    <v-row>
                      <!-- <v-col class="text-left no-padding-up-down" cols="9">
                        <small>INCLUIDO EM {{arrayTeste[0][0].ydatped}} {{arrayTeste[0][0].yhorped}} por {{arrayTeste[0][0].yusaped}}</small>
                        <br />
                        <small>IMPRESSO EM {{dateNowFormatted()}}</small>
                        <br />
                      </v-col> -->
                      <v-col class="text-right no-padding-up-down" cols="3">
                        <div style="font-size: 1.2rem; margin-right:5px">
                          <span class="font-weight-bold">TOTAL:</span>
                          <span
                            class="font-weight-bold"
                          >{{moneyFormatted(valor_total_pedido)}}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <!-- <div style="height: 250px;">&nbsp;</div> -->
              </td>
            </tr>
          </tfoot>
        </table>
        <!-- <div style="position: fixed;bottom: 0;height: 255px;width: 100%;"> -->
        <div style="position: fixed;bottom: 0;height: 300px;width: 100%;">
          <v-row>
            <v-col class="text-left" cols="6">
              <div>
                <span class="font-weight-bold" style="font-size: 1.5rem">ORÃ‡AMENTO</span>
                <span
                  class="font-weight-bold"
                  style="font-size: 1.5rem"
                ></span>
              </div>
              <!-- <span
                style="font-size: 1.3rem"
                class="font-weight-bold"
              >{{pedidoDcinfo.cliente.ygrucli}}</span> -->
            </v-col>
            <v-col class="text-left" cols="3">
                <span class="font-weight-bold" style="font-size: 1.5rem">EM ANÁLISE</span>
            </v-col>
            <v-col class="text-right" cols="3">
              <barcode :height="30" :display-value="false" v-bind:value="next_id"></barcode>
              <br />
              Página {{index +1}}/{{itens_pedido.length}}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Cliente:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span
                class="font-weight-bold"
              >{{cliente.codigo}} - {{cliente.razao_social}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Fantasia:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{cliente.fantasia}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Operação:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">* VENDA (ESTADUAL)</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Endereço:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span
                class="font-weight-bold"
              >{{cliente.endereco_principal.logradouro}}, {{cliente.endereco_principal.numero}} {{cliente.endereco_principal.complemento}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Vendedor:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{arrayTeste[0][0].yusaped}}</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Bairro:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{cliente.endereco_principal.bairro}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Atendente:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span class="font-weight-bold">{{arrayTeste[0][0].yusaped}}</span>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Cidade/UF:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <span
                class="font-weight-bold"
              >{{cliente.endereco_principal.cidade}} - {{cliente.endereco_principal.uf}} - {{cliente.endereco_principal.cep}}</span>
            </v-col>
            <!-- <v-col class="text-left no-padding-up-down" cols="1">Pgto:</v-col>
            <v-col class="text-left no-padding-up-down" cols="5">
              <div v-if="pedidoDcinfo.pagamento.tipo == 'BOLETO'">
                <span class="font-weight-bold">BOLETO Á VISTA</span>
              </div>
              <div v-else>
                <span class="font-weight-bold">CARTÃƒO {{pedidoDcinfo.pagamento.number_installments}}x</span>
              </div>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">CPF/CNPJ:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span class="font-weight-bold">{{cliente.cpf_cnpj}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Fone/Cel:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span
                class="font-weight-bold"
              >{{cliente.telefone}} / {{cliente.celular}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-left no-padding-up-down" cols="1">Email:</v-col>
            <v-col class="text-left no-padding-up-down" cols="6">
              <span class="font-weight-bold">{{cliente.email}}</span>
            </v-col>
          </v-row>
         <!-- <v-row style="padding-top: 5px;">
             <v-col class="text-left" cols="6">
              <v-row>
                <v-col cols="6">[ ] MANHÃ‚</v-col>
                <v-col cols="6">[ ] ENTREGAR E RECEBER</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">[ ] TARDE</v-col>
                <v-col cols="6">[ ] SÃ“ ENTREGAR</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">[ ] DIA TODO</v-col>
                <v-col cols="6">[ ] SÃ“ RECEBER</v-col>
              </v-row>
              <v-row>
                <v-col cols="12">[ ] TROCA DE MATERIAL</v-col>
              </v-row>
            </v-col> -->
            <!-- <v-col cols="6">
              <div style="border-style: solid; border-width: 1px; max-height: 120px;">
                <div v-if="pedidoDcinfo.pagamento.tipo == 'RESERVA'">
                  <div style="margin: 0px 5px 0px;">
                      RESERVA ON-LINE {{pedidoDcinfo.pagamento.id_pedido}} R$ {{pedidoDcinfo.pagamento.amount}}
                    <br />
                    {{pedidoDcinfo.pagamento.bandeira}} {{pedidoDcinfo.pagamento.number_installments}}x
                    <br />
                    AUTORIZAÃ‡ÃƒO {{pedidoDcinfo.pagamento.authorization_code}}
                    <br />
                    {{pedidoDcinfo.pagamento.authorized_at}}
                    <br />
                  </div>
                </div>
                <div v-else-if="pedidoDcinfo.pagamento.tipo == 'CREDITO PAGO'">
                  <div style="margin: 0px 5px 0px;">
                    CREDITO PAGO ON-LINE {{pedidoDcinfo.pagamento.id_pedido}} R$ {{pedidoDcinfo.pagamento.amount}}
                  <br />
                  {{pedidoDcinfo.pagamento.bandeira}} {{pedidoDcinfo.pagamento.number_installments}}x
                  <br />
                  AUTORIZAÃ‡ÃƒO {{pedidoDcinfo.pagamento.authorization_code}}
                  <br />
                  {{pedidoDcinfo.pagamento.authorized_at}}
                  <br />
                  </div>
                  
                </div>
                <div v-else-if="pedidoDcinfo.pagamento.tipo == 'BOLETO'">
                  <div style="margin: 0px 5px 0px;">
                    BOLETO ON-LINE {{pedidoDcinfo.pagamento.id_pedido}} R$ {{pedidoDcinfo.pagamento.amount}}
                  <br />
                  NOSSO NUMERO: {{pedidoDcinfo.pagamento.our_number}}
                  <br />
                  EMITIDO EM: {{pedidoDcinfo.pagamento.issue_date}}
                  <br />
                  VENCIMENTO: {{pedidoDcinfo.pagamento.expiration_date}}
                  <br />
                  RECEBIDO EM: {{pedidoDcinfo.pagamento.received_at}}
                  <br />
                  </div>
                  
                </div>
              </div>
            </v-col> 
          </v-row>-->
        </div>
      </div>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import VueBarcode from "vue-barcode";
export default {
  components: {
    barcode: VueBarcode,
  },
  data: () => ({
    headers: [
      { text: "QTD", value: "qtd" },
      { text: "[][]", value: "" },
      { text: "ITEM", value: "descricao" },
      { text: "COD", value: "codigo" },
      { text: "END", value: "endereco" },
      { text: "VALOR", value: "valor" },
      { text: "TOTAL", value: "total" },
    ],
  }),

  computed: {
    ...mapState({
      previa: (state) => state.pedidoAtendimento.previa,
      next_id: (state) => state.pedidoAtendimento.next_id,
      pedido: (state) => state.pedidoAtendimento.pedido,
      itens_pedido: (state) => state.pedidoAtendimento.itens_pedido_impressao,
      cliente: (state) => state.pedidoAtendimento.cliente_impressao,
      valor_total_pedido: (state) =>
        state.pedidoAtendimento.valor_total_itens_pedido,
      error: (state) => state.pedidoAtendimento.error,
    })
  },
  methods: {
    moneyFormatted(number) {
      return new Intl.NumberFormat("pt", {
        style: "currency",
        currency: "BRL",
      }).format(number);
    },
    dateNowFormatted() {
      let formatter = new Intl.DateTimeFormat("pt-BR", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        formatter.format(Date.now()) +
        " por " +
        this.$usuario.value.usuario.toUpperCase()
      );
    },
    dateFormatted(data) {
      let formatter = new Intl.DateTimeFormat("pt-BR", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return formatter.format(data);
    },
  },
};
</script>