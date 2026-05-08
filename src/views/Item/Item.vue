<template>
  <v-container>
    <v-card>
      <v-card-title>
        Itens P/ Controle de Saldo
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="flex-grow-1"></div>
        <v-btn color="success" @click="excel()" text><v-icon color="success" class="mr-2" >far fa-file-excel</v-icon> Gerar Excel</v-btn>       
        <v-btn @click="showDialogAdd()" color="primary"><v-icon class="mr-2" >fas fa-plus</v-icon>Adicionar Item</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select             
              :items="[{ id: 2, nome: 'TODOS'},{ id: 0, nome: 'INATIVO'}, { id: 1, nome: 'ATIVO'}]"
              item-text="nome"
              item-value="id"
              label="Filtrar por STATUS"
              return-object
              outlined
              filled
              v-model="filterStatus"
              @change="filtrarPorStatus(filterStatus.id)"
            ></v-select>
          </v-col>
          <v-col cols="10">
            <v-text-field
              class="uppercase"
              append-icon="fa-search"
              v-model="busca"
              label="Buscar"
              single-line
              hide-details
              clearable
              filled
              rounded
              @click="$event.target.select()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          hide-default-footer
          :items-per-page="-1"
          :headers="headers"
          :items="filteredArray"
          :search="busca"
          height="650px"
        >
          <template v-slot:item.codigo="{ item }">
            <span class="text-uppercase"
              ><b>{{ item.codigo }}</b>
            </span>
          </template>
          <template v-slot:item.saldo_dcinfo="{ item }">
            <span :class="item.saldo_dcinfo <= 0 ? 'error--text':'primary--text'">
              <b>{{ item.saldo_dcinfo }}</b>
            </span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-row no-gutters class="mt-n4">
              <v-col cols="3" class="mt-2">
                <v-switch
                  v-model="item.status"
                  inset
                  color="success"
                  @change="updateStatus(item)"
                  small
                >
                </v-switch>
              </v-col>
              <v-col cols="7" class="mt-8">
                <span
                  class="error--text font-weight-black ma-2"
                  v-if="!item.status"
                  >INATIVO</span
                >
                <span class="success--text font-weight-black ma-2" v-else>
                  ATIVO</span
                >
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.acao="{ item }">
            <v-row no-gutters>
              <v-col cols="6">
                <v-btn color="primary" small @click="alterar(item)"
                  >Alterar
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="warning" small @click="verItemListas(item.codigo)"
                  >Ver Listas
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>        
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAdd" max-width="600" persistent>
      <v-card class="mx-auto">
        <v-card-title>
          Buscar
          <v-divider></v-divider>
          <div class="flex-grow-1"></div>
          <v-text-field
            autofocus
            class="uppercase"
            v-model="search"
            @keyup.enter="getItem()"
            @click="$event.target.select()"
            append-icon="fa-search"
            label="Busque por: CÃ³digo"
            ref="input_buscar"
          ></v-text-field>
        </v-card-title>
        <v-card-text v-if="item.hasOwnProperty('descricao')">
          <v-row class="justify-center text-center">
            <v-col cols="12">{{ item.codigo }} - {{ item.descricao }}</v-col>
          </v-row>
          <v-row class="text-center">
            <v-col cols="12">
              <v-text-field
                v-model="saldo"
                @keyup.enter="addItem()"
                ref="input_saldo"
                label="Saldo"
                hide-details
                type="number"
                outlined
                filled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error"
            @click="
              dialogAdd = false;
              item = {};
              saldo = '';
            "
          >
            Voltar
          </v-btn>
          <div class="flex-grow-1"></div>
          <v-btn
            v-if="item.hasOwnProperty('descricao')"
            @click="addItem()"
            color="success"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogItemLista" persistent max-width="75%">
      <v-card>
        <v-card-title class="text-h5">
          O Codigo {{ codDialog }} consta nas listas Online:
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Faculdade
                  </th>
                  <th class="text-left">
                    Semestre
                  </th>
                  <th class="text-left">
                    id lista
                  </th>
                  <th class="text-left">
                    Nome Lista
                  </th>
                  <th class="text-left">
                    Descricao item Site
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in itensLista" :key="i.id_lista">
                  <td>{{ i.nome_exibicao_faculdade }}</td>
                  <td>{{ i.nome_semestre }}</td>
                  <td>{{ i.id_lista }}</td>
                  <td>{{ i.nome_lista }}</td>
                  <td>{{ i.descri_item }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="dialogItemLista = false">
            fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :color="typeSnackbar"
      :timeout="timeSnackbar"
      v-model="snackbar"
    >
      {{ msgSnackbar }}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-overlay :value="loading">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    itens: [],
    item: {},
    search: "",
    saldo: "",
    dialogAdd: false,
    dialogItemLista: false,
    codDialog: "",
    itensLista: [],
    busca: "",
    headers: [
      { text: "Codigo", value: "codigo" },
      { text: "DescriÃ§Ã£o", value: "descricao" },
      { text: "Marca", value: "marca" },
      { text: "Disponivel", value: "saldo", align: "center" },
      { text: "Saldo DC-Info", value: "saldo_dcinfo", align: "center" },
      { text: "Status", value: "status" },
      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 250,
      },
    ],
    filterStatus: "",
    filteredArray: [],
  }),
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    await this.getItens();
  },
  methods: {
    async getItens() {      
      this.itens = [];
      this.loading = true;
      this.$axios
        .get("/produto/getItensControlarSaldo")
        .then((res) => {
          this.loading = false;
          this.itens = res.data;
          this.filteredArray = res.data;
          if (this.filterStatus != '') {
            this.filtrarPorStatus(this.filterStatus.id);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    async updateStatus(item) {
      this.loading = true;
      this.$axios
        .post("/produto/updateStatusItem", {
          item: item,
        })
        .then((res) => {
          this.loading = false;
          if (res.data == false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.loading = false;
            this.getItens();            
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    async verItemListas(item) {
      this.codDialog = item;
      this.itensLista = [];
      this.loading = true;
      this.$axios
        .post("/produto/verItemListasSite", {
          item: item,
        })
        .then((res) => {
          console.log(res.data);
          this.loading = false;
          if (res.data == false) {
            this.showSnakerbar(
              "CODIGO NÃƒO FOI ENCONTRADO EM LISTAS ONLINE!",
              "warning"
            );
          } else {
            this.loading = false;
            this.dialogItemLista = true;
            this.itensLista = res.data;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    filtrarPorStatus(filterStatus){        
     let searchProdutoStatus = [];
     
     if (filterStatus == 2) {
       this.filteredArray = this.itens;
     }else{
       for (const i of this.itens) {
         if (filterStatus == i.status) {
          searchProdutoStatus.push(i);
         }
       }
       this.filteredArray = searchProdutoStatus; 
     }     
   },
    alterar(item) {
      this.$router.push("/item_controlar_saldo/" + item.codigo);
    },
    async getItem() {
      this.loading = true;
      this.$axios
        .get("/produto/getByCod", {
          params: {
            cod: this.search,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data == false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else if (res.data == null) {
            this.showSnakerbar("Item NÃ£o Encontrado!", "warning");
          } else {
            this.item = res.data;
            this.$nextTick(() => this.$refs.input_saldo.focus());
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    async addItem() {
      if (this.saldo.trim() != "") {
        let dados = {
          usuario: this.$usuario.value.usuario,
          item: this.item,
          saldo: this.saldo,
        };
        this.loading = true;
        this.$axios
          .post("/produto/salvarItemSaldo", {
            dados: dados,
          })
          .then((res) => {
            this.loading = false;
            console.log("oba", res.data);
            if (res.data == false) {
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else if (res.data == null) {
              this.showSnakerbar("Item Repedido!", "warning");
            } else {
              this.showSnakerbar("Item Adicionado", "success");
              this.getItens();
              this.dialogAdd = false;
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          });
      } else {
        this.showSnakerbar("Saldo Ã© ObrigatÃ³rio", "warning");
      }
    },
    async deleteItem(codigo) {
      this.loading = true;
      this.$axios
        .delete("/produto/deletarItemSaldo", {
          params: {
            codigo: codigo,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data == false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.showSnakerbar("Item Removido", "success");
            this.getItens();
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    showDialogAdd() {
      this.search = "";
      this.saldo = "";
      this.item = {};
      this.dialogAdd = true;
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
    excel() {
      this.loading = true;
      let itens = [];

      for (let item of this.filteredArray) {
        let obj = {};
        obj.codigo = item.codigo;
        obj.saldo = item.saldo;
        obj.saldo_dcinfo = item.saldo_dcinfo;
        obj.descricao = item.descricao;
        obj.marca = item.marca;
        
        if (item.status == null || item.status == 0) {
          obj.status = 'INATIVO'
        }else{
          obj.status = 'ATIVO'
        }
        itens.push(obj);
      }
    
      const jsonKeys = Object.keys(itens[0]);
      let objectMaxLength = [];
      for (let i = 0; i < itens.length; i++) {
        let value = itens[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(itens);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 20 }; // tamanho da coluna cod
      ws["!cols"][1] = { wch: 10 }; // tamanho da saldo
      ws["!cols"][2] = { wch: 10 }; // tamanho da saldo_dcinfo
      ws["!cols"][3] = { wch: 40 }; // tamanho da coluna descricao
      ws["!cols"][4] = { wch: 20 }; // tamanho da coluna marca
      ws["!cols"][5] = { wch: 10 }; // tamanho da coluna status

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "itens_controle_saldo"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "itens_controle_saldo.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      this.loading = false;
    },
  },
};
</script>
