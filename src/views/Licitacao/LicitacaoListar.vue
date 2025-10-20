<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-btn small color="primary" @click="listar()">
          <i class="fas fa-list-ul mr-2"></i>Listar
        </v-btn>
        <v-row></v-row>
      </v-col>
    </v-row>

    <v-card>
      <div class="ma-5">
        <v-row class="custom-row">
          <v-col cols="12" md="2">
            <v-text-field
              v-model="item.codigo"
              label="Codigo"
              class="uppercase"
              @keyup.enter="getItem"
              filled
            ></v-text-field>
          </v-col>
          <div class="flex-grow-1"></div>
          <v-col cols="12" md="8">
            <v-textarea
              v-model="item.descricao"
              rows="4"
              label="Descrição"
              class="uppercase-area"
              no-resize
              filled
              readonly
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="custom-row">
          <v-col cols="12" md="2">
            <v-btn class="d-flex align-end flex-column" small color="primary" @click="getItem">
              <i class="fas fa-search mr-2"></i>Buscar
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <v-row>
      <v-dialog v-model="dialogCriarEditar" persistent max-width="650px">
        <template v-slot:activator="{ on }">
          <v-row>
            <v-col class="ml-6" cols="12" md="4">
              <v-btn v-if="!item.id" small color="success" disabled v-on="on">
                <i class="fas fa-plus mr-2"></i>Adicionar
              </v-btn>

              <v-btn v-else-if="item.id" small color="success" v-on="on">
                <i class="fas fa-plus mr-2"></i>Adicionar
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row class="custom-row">
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.data"
                      label="Data"
                      v-mask="'##/##/####'"
                      placeholder="dd/mm/aaaa"
                      :rules=" [v => !!v.trim() || 'Data obrigatória!' ] "
                      filled
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.nome_empresa"
                      label="Empresa"
                      class="uppercase"
                      :rules=" [v => !!v.trim() || 'Nome da empresa obrigatório!'] "
                      filled
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="custom-row">
                  <v-col cols="12" sm="6" md="4">
                    <div
                      class="v-input uppercase v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--filled v-text-field--is-booted v-text-field--enclosed"
                    >
                      <div class="v-input__control">
                        <div class="v-input__slot">
                          <div class="v-text-field__slot">
                            <label
                              for="input-244"
                              class="v-label v-label--active theme--light"
                              style="left: 0px; right: auto; position: absolute;"
                            >Valor</label>
                            <money v-model="editedItem.valor" type="text" v-bind="money"></money>
                          </div>
                        </div>
                        <div class="v-text-field__details">
                          <div class="v-messages theme--light">
                            <div class="v-messages__wrapper"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.quantidade"
                      label="Qtd"
                      type="number"
                      :rules=" [v => !!v || 'Quantidade obrigatória!'] "
                      filled
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="5">
                    <v-text-field
                      v-model="editedItem.marca"
                      label="Marca"
                      class="uppercase"
                      type="text"
                      :rules=" [v => !!v.trim() || 'Marca obrigatória!'] "
                      filled
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="custom-row">
                  <v-col cols="12" sm="6" md="7">
                    <v-text-field
                      v-model="editedItem.ms"
                      label="MS"
                      class="uppercase"
                      type="text"
                      :rules=" [v => !!v.trim() || 'MS obrigatório!'] "
                      filled
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn small color="error" @click="close">Voltar</v-btn>
            <v-btn small color="success" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-card>
      <v-card-title>
        Empresas
        <div class="flex-grow-1"></div>
        <v-text-field v-model="search" label="Buscar" single-line hide-details></v-text-field>
      </v-card-title>

      <v-data-table
        class="text-uppercase"
        :headers="headers"
        :items="empresas"
        :items-per-page="-1"
        sort-by="data"
        sort-desc
        dense
        :search="search"
        :footer-props="{ itemsPerPageOptions: [10, 20, -1], itemsPerPageText: 'Empresas por pagina' }"
      >
        <template v-slot:item.data="{ item }">{{formatDate(item.data)}}</template>
        <template v-slot:item.valor="{ item }">R$ {{ item.valor.toFixed(2).replace(".",",") }}</template>

        <template v-slot:item.acao="{ item }">
          <v-btn class="ma-2" small color="warning" @click="editItem(item)">
            <i class="far fa-edit mr-2"></i> Editar
          </v-btn>

          <v-btn class="ma-2" small color="error" @click="deleteItem(item)">
            <i class="far fa-trash-alt mr-2"></i> Deletar
          </v-btn>

        </template>
      </v-data-table>
    </v-card>

    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">{{msgSnackbar}}</v-snackbar>
  </v-container>
</template>
<script>
export default {
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Cadastro Empresa" : "Editar Empresa";
    }
  },
  watch: {
    dialogCriarEditar(val) {
      val || this.close();
    }
  },
  props: {
    id: [String]
  },
  mounted() {
    this.getItem();
  },

  data: () => ({
    valid: true,
    idNovo: "",
    idVolta: "",
    item: {
      id: 0,
      codigo: "",
      descricao: ""
    },
    empresas: [],
    dialogCriarEditar: false,
    dialogDelete: false,
    search: "",

    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Data", value: "data" },
      { text: "Empresa", value: "nome_empresa" },
      { text: "Valor", value: "valor" },
      { text: "Qtd", value: "quantidade" },
      { text: "Marca", value: "marca" },
      { text: "MS", value: "ms" },
      { text: "Ação", value: "acao" }
    ],

    editedIndex: -1,
    editedItem: {
      data: "",
      nome_empresa: "",
      valor: "",
      quantidade: "",
      marca: "",
      ms: ""
    },
    defaultItem: {
      data: "",
      nome_empresa: "",
      valor: "",
      quantidade: "",
      marca: "",
      ms: ""
    },
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,

    money: {
      decimal: ",",
      thousands: ".",
      precision: 2,
      masked: false,
      prefix: "R$"
    }
  }),

  methods: {
    formatDate(data) {
      data = data.slice(0, 10);
      let array = data.split("-");
      return array[2] + "/" + array[1] + "/" + array[0];
    },
    getItem() {
      if (this.id != 0 || this.item.codigo) {
        if (this.id || this.item.codigo) {
          this.idNovo = this.id;
          if (this.item.codigo) this.idNovo = "";

          this.$axios
            .get("/item_licitacao&empresa", {
              params: {
                id: this.idNovo,
                codigo: this.item.codigo
              }
            })
            .then(res => {
              console.log(res.data);
              if (res.data === false) {
                this.showSnackbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              } else if (res.data === null) {
                this.showSnackbar("Item não encontrado!", "warning", 2000);
              } else {
                this.item = res.data;
                this.empresas = this.item.licitacao_empresas;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          this.$axios
            //edit
            .put("/empresa", {
              empresa: this.editedItem
            })
            .then(res => {
              this.close();
              this.getItem();
              this.showSnackbar("ITEM EDITADO COM SUCESSO!", "success", 2000);
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        if (this.$refs.form.validate()) {
          //save
          this.$axios
            .post("/empresa", {
              empresa: this.editedItem,
              id_item: this.item.id
            })
            .then(res => {
              this.close();
              this.getItem();
              this.showSnackbar("ITEM SALVO COM SUCESSO!", "success", 2000);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    editItem(item) {
      this.editedIndex = this.empresas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.data = this.formatDate(this.editedItem.data);
      this.dialogCriarEditar = true;
    },

    deleteItem(item) {
      let check = confirm(
        "Você tem certeza que deseja deletar este item?"
      );
      if (check == true) {
        this.loading = true;
        this.$axios
          .delete("/empresa", {
            data: { id: item.id }
          })
          .then(res => {
			this.loading = false;
            this.getItem();
            this.showSnackbar("ITEM DELETADO COM SUCESSO!", "success", 2000);
          })
          .catch(err => {
			  this.loading = false;
            console.log(err);
          });
      }
    },

    listar() {
      this.idVolta = this.id;

      if (
        this.idVolta == undefined ||
        this.idVolta == "undefined" ||
        this.idVolta == "0" ||
        typeof this.idVolta == "string"
      ) {
        if (this.item.length != 0) {
          this.idVolta = this.item.id;
        } else {
          this.idVolta = "0";
        }
      } else {
        this.idVolta = this.item.id;
      }

      this.$router.push({ path: `/licitacao/listar/${this.idVolta}` });
    },

    close() {
      this.dialogCriarEditar = false;
      this.dialogDelete = false;

      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.$refs.form.resetValidation();
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    }
  }
};
</script>
<style scope>
.uppercase input {
  text-transform: uppercase;
}
.uppercase-area textarea {
  text-transform: uppercase;
}
</style>