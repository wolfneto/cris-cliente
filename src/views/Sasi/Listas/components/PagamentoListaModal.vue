<template>
  <v-dialog v-model="dialog" persistent width="90%">
    <v-card>
      <v-card-title class="headline text-center"
        >Gerenciar Formas de Pagamento</v-card-title
      >
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <v-row justify="center">
              <v-switch hide-details dense v-model="lista.venda_semestre">
                <template v-slot:label>
                  <span v-if="lista.venda_semestre" class="success--text"
                    >Aceitar Pagamento Online</span
                  >
                  <span v-else class="error--text"
                    >Não Aceitar Pagamento Online</span
                  >
                </template>
              </v-switch>
            </v-row>
          </v-col>
        </v-row>
        <!-- <v-divider></v-divider> -->
        <v-row v-if="lista.venda_semestre">
          <v-col cols="4">
            <v-card outlined tile class="pa-3" height="85%">
              <v-row justify="center">
                <v-switch
                  dense
                  hide-details
                  v-model="lista.semestre_pagamento.credito"
                >
                  <template v-slot:label>
                    <span
                      v-if="lista.semestre_pagamento.credito"
                      class="success--text"
                      >Aceitar Cartão de Crédito</span
                    >
                    <span v-else class="error--text"
                      >Não Aceitar Cartão de Crédito</span
                    >
                  </template>
                </v-switch>
              </v-row>
              <v-divider></v-divider>
              <v-row v-if="lista.semestre_pagamento.credito">
                <v-col cols="8">
                  <v-radio-group
                    class="mt-n1"
                    dense
                    hide-details
                    v-model="lista.reserva_semestre"
                  >
                    <v-radio
                      color="indigo"
                      label="Venda por Reserva"
                      :value="true"
                    ></v-radio>
                    <v-radio
                      color="success"
                      label="Venda Direta"
                      :value="false"
                    ></v-radio>
                  </v-radio-group>
                  <v-checkbox
                    class="mt-n1"
                    v-model="lista.semestre_pagamento.dois_cartoes"
                    label="Dois cartões"
                    color="primary"
                  ></v-checkbox>
                  <v-checkbox
                    class="mt-n8"
                    v-model="lista.semestre_pagamento.iugu"
                    label="PAGBANK"
                    color="primary"
                  ></v-checkbox>
                </v-col>
                <!-- <v-col cols="3">
                  <v-select
                    v-model="lista.semestre_pagamento.max_parcelas"
                    :items="[
                    {text: '1x', value: 1}, 
                    {text: '2x', value: 2}, 
                    {text: '3x', value: 3}, 
                    {text: '4x', value: 4}, 
                    {text: '5x', value: 5}, 
                    {text: '6x', value: 6}, 
                    {text: '7x', value: 7}, 
                    {text: '8x', value: 8}, 
                    {text: '9x', value: 9}, 
                    {text: '10x', value: 10},
                    {text: '11x', value: 11},
                    {text: '12x', value: 12}]"
                    label="Max. Parcelas"
                    dense
                    hide-details
                  ></v-select>
                </v-col> -->
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="pa-3" outlined tile height="200">
              <v-row justify="center">
                <v-switch
                  dense
                  hide-details
                  v-model="lista.semestre_pagamento.boleto"
                >
                  <template v-slot:label>
                    <span
                      v-if="lista.semestre_pagamento.boleto"
                      class="success--text"
                      >Aceitar Boleto Ã  Vista</span
                    >
                    <span v-else class="error--text">Não Aceitar Boleto</span>
                  </template>
                </v-switch>
              </v-row>
              <v-divider></v-divider>
              <v-row v-if="lista.semestre_pagamento.boleto">
                <v-col cols="4">
                  <div style="max-width: 100px">
                    <v-text-field
                      @click="$event.target.select()"
                      v-model="lista.semestre_pagamento.desconto_boleto"
                      dense
                      hide-details
                      type="number"
                      suffix="%"
                      label="Desconto"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mt-n4" style="max-width: 100px">
                    <span class="caption font-weight-light"
                      >Valor Min boleto</span
                    >
                    <money
                      style="
                        border-left: none;
                        border-right: none;
                        border-top: none;
                        border-bottom: 1px solid gray;
                        height: 30px;
                      "
                      maxlength="10"
                      class="mt-n0 form-control rounded-0 text-center"
                      v-model="lista.semestre_pagamento.valor_minimo_boleto"
                      v-bind="money"
                    ></money>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div style="max-width: 100px">
                    <v-text-field
                      @click="$event.target.select()"
                      v-model="lista.semestre_pagamento.max_boleto_por_cpf"
                      dense
                      hide-details
                      type="number"
                      label="Max boleto CPF"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
              <v-row justify="center">
                <span class="subtitle-1"
                  ><b
                    >Total Listas Online R$
                    {{ this.totalListasOnline.toFixed(2).replace(".", ",") }}</b
                  ></span
                >
              </v-row>
            </v-card>
          </v-col>
          <!-- <v-col cols="4">
            <v-card class="pa-3" outlined tile height="200">
              <v-row align="center" justify="center">
                <v-switch dense hide-details v-model="lista.semestre_pagamento.entrada">
                  <template v-slot:label>
                    <span
                      v-if="lista.semestre_pagamento.entrada"
                      class="success--text"
                    >Aceitar Pagamento Entrada</span>
                    <span v-else class="error--text">Não Aceitar Entrada</span>
                  </template>
                </v-switch>
              </v-row>
              <v-divider></v-divider>
              <v-row v-if="lista.semestre_pagamento.entrada">
                <v-col cols="6">
                  <div style="max-width: 100px">
                    <v-text-field
                      @click="$event.target.select()"
                      v-model="lista.semestre_pagamento.valor_entrada"
                      dense
                      hide-details
                      type="number"
                      suffix="%"
                      label="Desconto"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col> -->
          <v-col cols="4">
            <v-card class="pa-3" outlined tile height="200">
              <v-row justify="center">
                <v-switch
                  dense
                  hide-details
                  v-model="lista.semestre_pagamento.pix"
                >
                  <template v-slot:label>
                    <span
                      v-if="lista.semestre_pagamento.pix"
                      class="success--text"
                      >Aceitar Pagamento PIX</span
                    >
                    <span v-else class="error--text">Não Aceitar PIX</span>
                  </template>
                </v-switch>
              </v-row>
              <v-divider></v-divider>
              <v-row v-if="lista.semestre_pagamento.pix">
                <v-col cols="6">
                  <div style="max-width: 100px">
                    <v-text-field
                      @click="$event.target.select()"
                      v-model="lista.semestre_pagamento.desconto_pix"
                      dense
                      hide-details
                      type="number"
                      suffix="%"
                      label="Desconto"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-n0" v-if="lista.semestre_pagamento.credito" no-gutters justify="center">
          <v-col cols="6">
            <v-card
              outlined
              tile
              class="pa-4"
              height="360px"
              v-if="lista.venda_semestre"
            >
              <div class="text-center mt-n2">
                <v-btn
                  :disabled="
                    this.lista.parcelas_pagamento_credito[
                      this.lista.parcelas_pagamento_credito.length - 1
                    ].valor_ate == 0
                  "
                  class="ma-2"
                  fab
                  outlined
                  x-small
                  color="blue"
                  @click="addRowParcela()"
                >
                  <v-icon>fa-plus</v-icon>
                </v-btn>
                <v-btn
                  :disabled="this.lista.parcelas_pagamento_credito.length == 1"
                  class="ma-2"
                  fab
                  outlined
                  x-small
                  color="red "
                  @click="deleteRowParcela()"
                >
                  <v-icon>fa-minus</v-icon>
                </v-btn>
              </div>
              <v-row no-gutters>
                <v-col>
                  <v-row class="mt-n2" justify="center" no-gutters>
                    <v-col><span class="caption">Valor De:</span></v-col>
                    <v-col><span class="caption">Valor Até:</span></v-col>
                    <v-col cols="2"
                      ><span class="caption">Parcelas</span></v-col
                    >
                    <v-col cols="2"
                      ><span class="caption">Juros %</span></v-col
                    >
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters style="height: 280px; overflow: auto">
                <v-col cols="12">
                  <div
                    v-for="row in lista.parcelas_pagamento_credito"
                    :key="row.id"
                  >
                    <v-row class="mt-2" no-gutters>
                      <v-col cols="4">
                        <money
                          maxlength="10"
                          class="form-control font-weight-bold text-center"
                          style="width: 75%; height: 95%"
                          v-model="row.valor_de"
                          v-bind="money"
                          readonly
                        ></money>
                      </v-col>
                      <v-col cols="4">
                        <money
                          maxlength="10"
                          class="form-control font-weight-bold text-center"
                          style="width: 75%; height: 95%"
                          v-model="row.valor_ate"
                          v-bind="money"
                          :readonly="
                            lista.parcelas_pagamento_credito.indexOf(row) !=
                            lista.parcelas_pagamento_credito.length - 1
                          "
                        ></money>
                      </v-col>
                      <v-col cols="1">
                        <v-text-field
                          :readonly="
                            lista.parcelas_pagamento_credito.indexOf(row) !=
                            lista.parcelas_pagamento_credito.length - 1
                          "
                          @click="$event.target.select()"
                          v-model="row.qtd_parcela"
                          dense
                          outlined
                          hide-details
                          type="number"
                          @change="checkArrayParcelas(row)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" class="ml-9">
                        <money
                          maxlength="10"
                          @click="$event.target.select()"
                          class="form-control font-weight-bold text-center"
                          style="width: 75%; height: 95%"
                          v-model="row.acrescimo"
                          v-bind="money"
                          dense
                          outlined
                          hide-details
                        ></money>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Voltar</v-btn>
        <v-btn color="success" text @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    lista: [Object],
  },
  data: () => ({
    dialog: true,
    checkValor: false,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
  }),
  computed: {
    ...mapState({
      totalListasOnline: (state) => state.listas.valor_total_listas_online,
    }),
  },
  methods: {
    salvar() {
      if (
        !this.lista.semestre_pagamento.credito &&
        !this.lista.semestre_pagamento.boleto &&
        !this.lista.semestre_pagamento.entrada &&
        this.lista.venda_semestre
      ) {
        this.$parent.showSnakerbar(
          "Selecione pelo menos uma forma de pagamento",
          "warning"
        );
      }
      if (!this.checkValorAte()) {
        this.$parent.showSnakerbar(
          "ATENÇÃO: NO ULTIMO REGISTRO DE PARCELAS, O CAMPO ' VALOR ATÃ‰ ' SEMPRE SERÁ ' 0 ' !",
          "warning"
        );
      } else if (
        this.lista.parcelas_pagamento_credito[
          this.lista.parcelas_pagamento_credito.length - 1
        ].valor_ate != 0
      ) {
        this.$parent.showSnakerbar(
          "ATENÇÃO: NO ULTIMO REGISTRO DE PARCELAS, O CAMPO ' VALOR ATÃ‰ ' SEMPRE SERÁ ' 0 ' !",
          "warning"
        );
      } else {
        if (
          this.lista.semestre_pagamento.valor_minimo_boleto >
          this.totalListasOnline
        ) {
          this.$parent.showSnakerbar(
            "O valor minimo do boleto não pode ser maior que o total das listas online!",
            "warning"
          );
        } else {
          let dados = {
            id_semestre: this.lista.id_semestre_lista,
            venda_semestre: this.lista.venda_semestre,
            reserva_semestre: this.lista.reserva_semestre,
            semestre_pagamento: this.lista.semestre_pagamento,
            parcelas_pagamento_credito: this.lista.parcelas_pagamento_credito,
          };
          this.$axios
            .post("/lista/salvarListaPagamento", {
              dados: dados,
            })
            .then((res) => {
              if (res.data) {
                this.$parent.showSnakerbar("Salvo com Sucesso", "success");
                this.dialog = false;
                this.$emit("close-dialog");
              } else {
                this.$parent.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              }
            });
        }
      }
    },
    close() {
      this.dialog = false;
      this.$emit("close-dialog");
    },
    addRowParcela() {
      if (this.checkValorAte()) {
        this.lista.parcelas_pagamento_credito.push({
          valor_de:
            this.lista.parcelas_pagamento_credito[
              this.lista.parcelas_pagamento_credito.length - 1
            ].valor_ate + 0.01,
          valor_ate: 0,
          acrescimo: 0,
          qtd_parcela:
            parseInt(
              this.lista.parcelas_pagamento_credito[
                this.lista.parcelas_pagamento_credito.length - 1
              ].qtd_parcela
            ) + 1,
        });
      } else {
        this.$parent.showSnakerbar(
          "ATENÇÃO: AO INSERIR UMA NOVA LINHA, O CAMPO ' VALOR ATÃ‰ ' NÃO PODE SER MENOR OU IGUAL O CAMPO ' VALOR DE ' !",
          "warning"
        );
      }
    },
    deleteRowParcela() {
      this.lista.parcelas_pagamento_credito.pop();
    },
    checkValorAte() {
      let lastRow =
        this.lista.parcelas_pagamento_credito[
          this.lista.parcelas_pagamento_credito.length - 1
        ];

      if (lastRow.valor_ate != 0 && lastRow.valor_de >= lastRow.valor_ate) {
        return false;
      }
      return true;
    },
    checkArrayParcelas(row) {
      if (row.qtd_parcela == "") {
        row.qtd_parcela = 0;
      }
      row.qtd_parcela =
        parseInt(row.qtd_parcela) > 12 ? 12 : parseInt(row.qtd_parcela);
      if (this.lista.parcelas_pagamento_credito.indexOf(row) != 0) {
        if (
          row.qtd_parcela <=
          parseInt(
            this.lista.parcelas_pagamento_credito[
              this.lista.parcelas_pagamento_credito.indexOf(row) - 1
            ].qtd_parcela
          )
        ) {
          row.qtd_parcela =
            parseInt(
              this.lista.parcelas_pagamento_credito[
                this.lista.parcelas_pagamento_credito.indexOf(row) - 1
              ].qtd_parcela
            ) + 1;
        }
      }
    },
  },
};
</script>
