<template>
  <v-container>
    <div>
      <div>
        <v-row>
          <v-col class="text-left" cols="6">
            <div>
              <span class="font-weight-bold" style="font-size: 1.5rem"
                >ORÃ‡AMENTO {{pedido_imprimir.id == false ? '':pedido_imprimir.id}}</span
              >
            </div>
          </v-col>
          <v-col class="text-left" cols="3">
            <span class="font-weight-bold" style="font-size: 1.5rem"
              >{{pedido_imprimir.id == false ? 'EM ANÃLISE':'PENDENTE'}}</span
            >
          </v-col>
          <v-col class="text-right" cols="3"> </v-col>
        </v-row>
        <v-row>
          <v-col class="text-left no-padding-up-down" cols="1">Cliente:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold"
              >{{ pedido_imprimir.cliente.codigo }} -
              {{ pedido_imprimir.cliente.razao_social }}</span
            >
          </v-col>
          <v-col class="text-left no-padding-up-down" cols="1">EndereÃ§o:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold"
              >{{ pedido_imprimir.cliente.cliente_enderecos.logradouro }},
              {{ pedido_imprimir.cliente.cliente_enderecos.numero }}
              {{ pedido_imprimir.cliente.cliente_enderecos.complemento }}</span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-left no-padding-up-down" cols="1">Fantasia:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold">{{
              pedido_imprimir.cliente.fantasia
            }}</span>
          </v-col>
               <v-col class="text-left no-padding-up-down" cols="1">Bairro:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold">{{
              pedido_imprimir.cliente.cliente_enderecos.bairro
            }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-left no-padding-up-down" cols="1">CPF/CNPJ:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold">{{
              pedido_imprimir.cliente.cpf_cnpj
            }}</span>
          </v-col>
              <v-col class="text-left no-padding-up-down" cols="1"
            >Cidade/UF:</v-col
          >
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold"
              >{{ pedido_imprimir.cliente.cliente_enderecos.cidade }} -
              {{ pedido_imprimir.cliente.cliente_enderecos.uf }} -
              {{ pedido_imprimir.cliente.cliente_enderecos.cep }}</span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-left no-padding-up-down" cols="1">Fone/Cel:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold"
              >{{ pedido_imprimir.cliente.telefone }} /
              {{ pedido_imprimir.cliente.celular }}</span
            >
          </v-col>
                    <v-col class="text-left no-padding-up-down" cols="1">Email:</v-col>
          <v-col class="text-left no-padding-up-down" cols="5">
            <span class="font-weight-bold">{{
              pedido_imprimir.cliente.email
            }}</span>
          </v-col>
        </v-row>
      </div>
      <v-divider></v-divider>
      <div style="border: 1px solid black">
        <v-row>
          <v-col class="text-left no-padding-up-down" cols="9">
            <small
              >IMPRESSO EM {{ dateNowFormatted() }} POR
              {{ pedido_imprimir.usuario.toUpperCase() }}</small
            >
            <br />
          </v-col>
          <v-col class="text-right no-padding-up-down" cols="3">
            <div style="font-size: 1.2rem; margin-right: 5px">
              <span class="font-weight-bold">TOTAL:</span>
              <span class="font-weight-bold">{{
                moneyFormatted(pedido_imprimir.total)
              }}</span>
            </div>
          </v-col>
        </v-row>
      </div>
      <table
        style="
          width: 100%;
          border-collapse: collapse;
          border-spacing: 5px;
          margin-bottom: 455px;
        "
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
                <table
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 5px;
                  "
                >
                  <thead style="border: 1px solid #000000">
                    <tr>
                      <th style="text-align: center">QTD</th>
                      <th>ITEM</th>
                      <th style="text-align: center">COD</th>
                      <th style="text-align: center">VALOR</th>
                      <th style="text-align: center">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in pedido_imprimir.itens" :key="item.ordem">
                      <td class="font-weight-bold" style="text-align: center">
                        {{ parseInt(item.qtd) }}
                      </td>
                      <td>{{ item.descricao }}</td>
                      <td style="border: 1px solid black; text-align: center">
                        <span style="margin: 4px">{{ item.codigo }}</span>
                      </td>
                      <td class="font-weight-bold" style="text-align: center">
                        {{ moneyFormatted(item.valor).replace("R$&nbsp;", "") }}
                      </td>
                      <td class="font-weight-bold" style="text-align: center">
                        {{
                          moneyFormatted(
                            parseInt(item.qtd) * parseFloat(item.valor)
                          ).replace("R$&nbsp;", "")
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <v-divider></v-divider>
                <div style="border: 1px solid black">
                  <v-row>
                    <v-col class="text-left no-padding-up-down" cols="9">
                      <small
                        >IMPRESSO EM {{ dateNowFormatted() }} POR
                        {{ pedido_imprimir.usuario.toUpperCase() }}</small
                      >
                      <br />
                    </v-col>
                    <v-col class="text-right no-padding-up-down" cols="3">
                      <div style="font-size: 1.2rem; margin-right: 5px">
                        <span class="font-weight-bold">TOTAL:</span>
                        <span class="font-weight-bold">{{
                          moneyFormatted(pedido_imprimir.total)
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  props: {
    pedido: Object,
  },
  data: function () {
    return {
      pedido_imprimir: this.pedido,
      headers: [
        { text: "QTD", value: "qtd" },
        { text: "[][]", value: "" },
        { text: "ITEM", value: "descricao" },
        { text: "COD", value: "codigo" },
        { text: "END", value: "endereco" },
        { text: "VALOR", value: "valor" },
        { text: "TOTAL", value: "total" },
      ],
    };
  },
  created() {
    if(this.pedido_imprimir.id != false) {
      this.pedido_imprimir.cliente.cliente_enderecos = this.pedido_imprimir.endereco;
    }
  },
  computed: {
    ...mapState({
      error: (state) => state.pedidoAtendimento.error,
    }),
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