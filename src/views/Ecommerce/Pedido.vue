<template>
  <v-container>
    <v-card>
      <v-card-title>
        Pedidos - Cliente
        <v-btn class="ml-3 success" @click="getPagamentos()" >Atualizar</v-btn>
        <div class="flex-grow-1"></div>
        <v-text-field
          class="uppercase"
          v-model="search"
          v-on:keyup="filtrarPagamentos(search)"
          append-icon="fa-search"
          label="Nome, nÂº Pedido"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <div class="ma-2">
        <v-row>
          <v-col cols="12" md="1">
            <v-menu
              v-model="menu"
              :close-on-content-click="true"
              :nudge-width="200"
              transition="slide-y-transition"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn class="ml-3 d-print-none" color="indigo" dark v-on="on">Opções</v-btn>
              </template>
              <v-card>
                <v-radio-group class="ml-4" v-model="radios" :mandatory="false" dense>
                  <v-radio label="Crédito Reservado" @change="reservados()" class="mt-5"></v-radio>
                  <v-radio label="Boletos Emitidos" @change="boletosEmitidos()"></v-radio>
                  <v-radio label="Boletos Pagos" @change="boletosPago()"></v-radio>
                  <v-radio label="Ver Todos" @change="todosPagamentos()"></v-radio>
                 
                  <!-- <v-radio label="Crédito Pago" @change="creditoPago()"></v-radio>-->
                </v-radio-group>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="12" md="8">
            <div v-if="this.visualizacaoAtiva" class="ma-2">
              <span class="primary--text body-1">Você está visualizando</span>
              <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
              <span
                v-if="this.visualizacaoAtiva == '0'"
                class="primary--text lighten-1 body-1"
              >Crédito Reserva</span>             
              <span
                v-else-if="this.visualizacaoAtiva == '1'"
                class="primary--text body-1"
              >Boletos Emitidos</span>
              <span
                v-else-if="this.visualizacaoAtiva == '2'"
                class="primary--text body-1"
              >Boletos Pagos</span>
              <span
                v-else-if="this.visualizacaoAtiva == '3'"
                class="primary--text body-1"
              >Todos Pagamentos</span>
              <!-- <span
                v-else-if="this.visualizacaoAtiva == '4'"
                class="success--text body-1"
              >Crédito Pagos</span>-->
            </div>
          </v-col>
        </v-row>
      </div>

      <q-virtual-scroll
        class="my-sticky-dynamic"
        type="table"
        dense
        style="max-height: 70vh"
        virtual-scroll
        :virtual-scroll-sticky-size-start="48"
        :items="filteredPagamentos"
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
            <td v-for="col in headers" :key="index + '-' + col.name">
              <div v-if="col.prop == 'nome'">
                {{ row.nome }}
                <br />
                {{ putMask(row.teste_cliente.cpf) }}
                <br />
                <div v-if="row.status == 'PAGO'">
                  <v-chip color="success" dark>BAIXADO</v-chip>
                </div>
              </div>

              <div v-else-if="col.prop == 'status'">
                <v-menu
                  v-if="row.forma_pagamento == 'BOLETO'"
                  v-model="row.menuBoleto"
                  bottom
                  offset-y
                  :close-on-content-click="false"
                  :nudge-width="200"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip
                      v-if="row.forma_pagamento == 'BOLETO' && row.vencido == 1"
                      v-on="on"
                      class="text-center"                      
                      color="warning"
                      dark
                      large
                    >
                      BOLETO VENCIDO
                      <br />
                      {{row.teste_pagamento_boleto.expiration_date}}
                    </v-chip>

                    <v-chip
                      v-else-if="row.forma_pagamento == 'BOLETO' && row.status == 'EM ABERTO'"
                      v-on="on"
                      color="primary"
                      class="text-center"
                    >                      
                      {{row.status}}
                    </v-chip>
                    
                  </template>
                </v-menu>
               
                <v-menu
                  v-if="row.forma_pagamento == 'CREDITO' && row.reservado == 1"
                  v-model="row.menuLink"
                  bottom
                  offset-y
                  :close-on-content-click="false"
                  :nudge-width="200"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip v-if="row.forma_pagamento == 'CREDITO' && row.reservado == 1"
                     v-on="on" color="light-blue lighten-1" dark>RESERVADO</v-chip>
                  </template>
                  <v-card>
                    <v-card-text>
                      PAGAMENTO RESERVADO
                      <br />PARA COBRAR OU EXTORNAR FALAR COM EDGAR
                      <br />
                      <span
                        class="error--text"
                      >DIAS RESTANTES PARA EXTORNO AUTOMATICO: {{row.dias_restantes}} - {{row.data_extorno}}</span>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <div class="flex-grow-1"></div>

                      <v-btn text @click="row.menuLink = false">Voltar</v-btn>
                      <v-btn color="success" text @click="cobrarReserva(row.total)">Cobrar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <!-- <v-chip
                  v-else-if="row.status == 'PAGO' && row.tipo_pagamento == 'CREDITO'"
                  color="success"
                  dark
                >CRÃ‰DITO PAGO</v-chip>-->
                <v-chip
                  v-else-if="row.forma_pagamento == 'BOLETO' && row.status == 'PAGO'"
                  color="success"
                  dark
                >BOLETO PAGO</v-chip>
              </div>

              <div v-else-if="col.prop == 'id'">
                {{row[col.prop]}}              
              </div>

              <div v-else-if="col.prop == 'total'">R$ {{row[col.prop]}}</div>

              <div v-else-if="col.prop == 'acao'">
                <v-btn
                  v-if="row.status == 'EM ABERTO' || row.status == 'BOLETO VENCIDO'"
                  :disabled="checkDisabled(row)"
                  class="ma-2"
                  color="primary"
                  @click="confirmBaixar(row)"
                >
                  Baixar
                  <v-icon dark right small>fa-download</v-icon>
                </v-btn>
                <!-- <v-btn
                  v-if="row.status == 'PAGO'"
                  class="ma-2"
                  color="primary"
                  @click="confirmImprimir(row)"
                >
                  Imprimir
                  <v-icon dark right small>fa-print</v-icon>
                </v-btn>-->
                <br />
                <!-- <v-btn
                  :disabled="row.reservado == 1"
                  class="ma-2"
                  color="error"
                  @click="confirmDelete(row)"
                >
                  excluir
                  <v-icon dark right small>fa-trash-alt</v-icon>
                </v-btn> -->
              </div>
              <div v-else>{{ row[col.prop] }}</div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
      <v-dialog v-model="dialogBoleto" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Insira a Data de Pagamento do Boleto!</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                hint="Digite somente números"
                autofocus
                v-model="dataPagamentoBoleto"
                :rules="[v => !!v || 'Campo Obrigatório']"
                label="Data do Pagamento"
                v-mask="'##/##/####'"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="danger" text @click="dialogBoleto = false">Voltar</v-btn>
            <v-btn :disabled="!valid" color="success" text @click="baixarBoleto(objectItem)">baixar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <v-dialog v-model="dialogExcluir" persistent max-width="300">
        <v-card>
          <v-card-title class="headline">Atenção!</v-card-title>
          <v-card-text>Deseja realmente excluir o link?</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
            <v-btn color="error" text @click="deletar(objectItem)">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-card>    
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
      {{msgSnackbar}}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm"; 
export default {
  data: () => ({
    permissoes: {},
    // print: false,
    objectIndex: -1,
    objectItem: { codigo_link: "" },
    dialogBoleto: false,
    dataPagamentoBoleto: "",
    valid: false,
    search: "",
    typeSnackbar: "",
    timeSnackbar: 0,
    msgSnackbar: "",
    snackbar: false,
    loading: false,
    // dialogExcluir: false,
    pagamentos: [],
    filteredPagamentos: [],
    headers: [
      {
        name: "criado_em",
        prop: "criado_em",
        align: "center",
        label: "Data",
        field: "criado_em",
        sortable: true
      },
      {
        name: "nome",
        prop: "nome",
        align: "center",
        label: "Nome/CPF_CNPJ",
        field: "nome",
        sortable: true
      },
      {
        name: "status",
        prop: "status",
        align: "center",
        label: "Status",
        field: "status",
        sortable: true
      },
      {
        name: "id",
        prop: "id",
        align: "center",
        label: "Pedido",
        field: "id",
        sortable: true
      },
      {
        name: "total",
        prop: "total",
        align: "center",
        label: "Total",
        field: "total",
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
    menu: false,
    checkVazio: {},
    radios: false,
    visualizacaoAtiva: ""
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
    this.getPagamentos();
  },
  methods: {
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "ver_pagamentos"
          }
        })
        .then(res => {
          this.permissoes = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPagamentos() {
      this.loading = true;
      this.$axios
        .get("/ecommerce/pagamento/getPagamentos")
        .then(res => {
          this.loading = false;
          console.log("todos pagamentos", res.data);
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.pagamentos = res.data;
            this.filteredPagamentos = [];
            this.filtrarPagamentos(this.visualizacaoAtiva);
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    // cobrarReserva(item) {
    // 	this.$axios
    //     .post("/cliente/pagamento/cobrar", {
    //       pagamento: item
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       console.log(err);
    //     });
    // },
    checkDisabled(item) {
      if (item.status != "EM ABERTO" && item.status != "VENCIDO" ) {
        return true;
      }
      return false;
    },
    confirmBaixar(item) {
      this.objectIndex = this.pagamentos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogBoleto = true;
    },
    baixarBoleto(item) {
      if (this.$refs.form.validate()) {
        item.received_at = this.dataPagamentoBoleto;
        this.objectItem.received_at = this.dataPagamentoBoleto;
        
        this.loading = true;
        this.$axios
          .post("/ecommerce/pagamento/baixar", {
            pagamento: item
          })
          .then(res => {
            this.loading = false;
            this.dialogBoleto = false;
            console.log(res.data);
            if (res.data) {
              this.getPagamentos();
              // this.print = true;
              this.showSnackbar("Boleto Baixado com Sucesso!", "success", 2000);
            } else {
              this.showSnackbar("Erro ao Baixar!", "warning");
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    // confirmDelete(item) {
    //   console.log("item", item);
    //   this.objectIndex = this.pagamentos.indexOf(item);
    //   this.objectItem = Object.assign({}, item);
    //   this.dialogExcluir = true;
    // },
    // deletar(item) {
    //   this.dialogExcluir = false;
    //   this.loading = true;
    //   this.$axios
    //     .post("/cliente/pagamento/deletarLink", {
    //       codigo: item.codigo_link
    //     })
    //     .then(res => {
    //       this.getPagamentos();
    //       this.showSnackbar("Link Excluido", "success", 2000);
    //       this.loading = false;
    //       console.log(res.data);
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       console.log(err);
    //     });
    // },
    // copyLink() {
    //   let copy = document.querySelector("#linkCopy");
    //   copy.setAttribute("type", "text");
    //   copy.select();
    //   try {
    //     let success = document.execCommand("copy");
    //     if (success) {
    //       this.showSnackbar("Link Copiado", "success", 2000);
    //     } else {
    //       this.showSnackbar("Erro ao Copiar", "error");
    //     }
    //   } catch (error) {
    //     this.showSnackbar(error, "error");
    //   }

    //   copy.setAttribute("type", "hidden");
    //   window.getSelection().removeAllRanges();
    // },
    putMask(item) {
      if (item.length < 14) {
        return this.$mask.apply(item, "000.000.000-00");
      } else {
        return this.$mask.apply(item, "00.000.000/0000-00");
      }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },  
    reservados() {
      this.search = "";
      this.filteredPagamentos = this.pagamentos.filter(
        i => i.forma_pagamento == "CREDITO" && i.reservado === 1
      );
      this.visualizacaoAtiva = "0";
    },
    boletosEmitidos() {
      this.search = "";
      this.filteredPagamentos = this.pagamentos.filter(        
        i => i.forma_pagamento == "BOLETO" && i.status == "EM ABERTO" 
      );
      this.visualizacaoAtiva = "1";
    },
    boletosPago() {
      this.search = "";
      this.filteredPagamentos = this.pagamentos.filter(
        i => i.forma_pagamento == "BOLETO" && i.status == "PAGO"
      );
      this.visualizacaoAtiva = "2";
    },
    todosPagamentos() {
      this.search = "";
      this.filteredPagamentos = this.pagamentos;
      this.visualizacaoAtiva = "3";
    },
    // creditoPago() {
    //   this.search = "";
    //   this.filteredPagamentos = this.pagamentos.filter(
    //     // i => i.tipo_pagamento == "CREDITO" && i.status == "PAGO"
    //     i => i.forma_pagamento == "CREDITO"
    //   );
    //   this.visualizacaoAtiva = "4";
    // },
    

    filtrarPagamentos() {
      if (this.search.length == 0) {
        
        if (this.visualizacaoAtiva === "0") {
          this.reservados();
        }
        if (this.visualizacaoAtiva === "1") {
          this.boletosEmitidos();
        }
        if (this.visualizacaoAtiva === "2") {
          this.boletosPago();
        }
        if (this.visualizacaoAtiva === "3") {
          this.todosPagamentos();
        }
        // if (this.visualizacaoAtiva === "4") {
        //   this.creditoPago();
        // }
      }
      if (this.search && this.search.length >= 4) {
        this.filteredPagamentos = this.pagamentos.filter(i =>
          i.nome.includes(this.search.toUpperCase())
        );
      }
      if (this.search && this.search.length == 7) {
        var i = 0;
        var p = 0;
        for (i of this.pagamentos) {
          for (p of i.pedidos) {
            if (p.pedido == this.search.toLocaleUpperCase()) {
              this.filteredPagamentos.push(i);
            }
          }
        }
      }
    }
  }
};
</script>
<style lang="sass">
.my-sticky-dynamic  
  thead tr:first-child th
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1 
  thead tr:last-child th  
    height: 50px
    top: 48px
  thead tr:first-child th
    top: 0
</style>