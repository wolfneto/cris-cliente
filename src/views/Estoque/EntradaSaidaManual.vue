<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="1500" height="600" elevation="5">
      <div v-if="!entrada && !saida " class="text-center ma">
        <v-row justify="center">
          <v-col cols="12" md="3">
            <div
              v-ripple="{ center: true }"
              class="primary white--text text-center elevation-8 pa-6 h3"
              @click="entrada = true"
            >Entrada</div>
          </v-col>
          <v-col cols="12" md="3">
            <div
              v-ripple="{ center: true }"
              class="error white--text text-center elevation-8 pa-6 h3"
              @click="saida = true"
            >Saída</div>
          </v-col>
        </v-row>
      </div>

      <div v-if="entrada || saida" class>
        <div class>
          <v-card class="ml-n0 mr-n0" elevation="1">
            <v-row>
              <v-col cols="2">
                <v-btn
                  v-if="this.items != 0"
                  class="ma-2"
                  color="error"
                  dark
                  small
                  @click="dialogVoltar = true"
                >
                  <i class="fas fa-arrow-left mr-2"></i>
                  voltar
                </v-btn>
                <v-btn
                  v-else-if="this.items"
                  class="ma-2"
                  color="error"
                  dark
                  small
                  @click="voltar()"
                >
                  <i class="fas fa-arrow-left mr-2"></i>
                  voltar
                </v-btn>
              </v-col>
              <v-col cols="8" class="text-center ma">
                <p v-if="entrada" class="primary--text headline h5">Entrada de Material</p>
                <p v-else class="error--text headline h5">Saída de Material</p>
              </v-col>
              <v-col cols="2">
                <v-btn
                  v-if="this.items != 0"
                  class="ma-2"
                  color="primary"
                  @click="dialogSalvar = true"
                  dark
                  small
                >
                  <i class="fas fa-save mr-2"></i> Salvar
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1 text-uppercase"
          :no-data-text="'Nenhum item adicionado'"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-dialog v-model="dialogAdicionarEditar" max-width="65%">
                <template v-slot:activator="{ on }">
                  <v-btn color="success" dark small class="mb-2" v-on="on">
                    <i class="fas fa-plus mr-2"></i> Adicionar
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="2" md="2">
                          <v-text-field
                            autofocus
                            v-model="editedItem.quantidade"
                            @click="$event.target.select()"
                            :rules="[() => !!editedItem.quantidade || 'Qtd obrigatória!']"
                            :error-messages="errorMessages"
                            type="number"
                            filled
                            label="Qtd"
                            min="1"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                          <v-text-field
                            v-model="editedItem.codigo"
                            filled
                            label="Codigo"
                            class="uppercase"
                            @keypress.enter="getItem()"
                            @click="$event.target.select()"
                            :rules="[() => !!editedItem.codigo || 'Codigo obrigatório!']"
                            :error-messages="errorMessages"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="8" md="8">
                          <v-text-field
                            v-model="editedItem.descricao"
                            filled
                            label="Descrição"
                            class="uppercase"
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            :rows="5"
                            v-model="editedItem.observacao"
                            filled
                            label="Observação"
                            class="uppercase-area"
                            no-resize
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="close()">Cancelar</v-btn>
                    <v-btn
                      v-if="editedItem.quantidade == 0 || !editedItem.codigo || editedItem.codigo == 0"
                      disabled
                      color="primary"
                    >Adicionar</v-btn>
                    <v-btn v-else color="primary" @click="adicionar()">{{formBtn}}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogSalvar" max-width="290">
                <v-card>
                  <v-card-title class="headline">Atenção!</v-card-title>
                  <v-card-text>Deseja realmente salvar?</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="dialogSalvar = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="save()">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogVoltar" max-width="450">
                <v-card>
                  <v-card-title class="headline">Deseja retornar a pagina anterior?</v-card-title>
                  <br />
                  <v-card-text>Você perderá todos os dados da lista criada!</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="dialogVoltar = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="voltar()">confirmar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.acao="{ item }">
            <v-btn class="ma-2" small color="warning" @click="editItem(item)">
              <i class="far fa-edit mr-2"></i> Editar
            </v-btn>
            <v-btn class="ma-2" small color="error" @click="deleteItem(item)">
              <i class="far fa-trash-alt mr-2"></i> Deletar
            </v-btn>
          </template>
        </v-data-table>
      </div>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    entrada: false,
    saida: false,
    dialogAdicionarEditar: false,
    headers: [
      {
        align: "left",
        sortable: false,
      },
      { text: "Qtd", value: "quantidade" },
      { text: "Codigo", value: "codigo" },
      { text: "Descrição", value: "descricao" },
      { text: "Observação", value: "observacao" },
      { text: "Ação", value: "acao" },
    ],
    items: [],
    errorMessages: "",
    editedIndex: -1,
    editedItem: {
      quantidade: "",
      codigo: "",
      descricao: "",
      observacao: "",
    },
    defaultItem: {
      quantidade: "",
      codigo: "",
      descricao: "",
      observacao: "",
    },
    dialogDelete: false,
    dialogSalvar: false,
    dialogVoltar: false,
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  watch: {
    dialogAdicionarEditar(val) {
      val || this.close();
    },
  },
  computed: {
    ...mapState({
      error: (state) => state.EntradaSaidaManual.error,
      item: (state) => state.EntradaSaidaManual.item,
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Adicionar Item" : "Editar Item";
    },
    formBtn() {
      return this.editedIndex === -1 ? "Adicionar" : "Editar";
    },
  },
  methods: {
    ...mapActions(["getItemByCod", "saveItens"]),
    // ...mapMutations(["set_selected_item", "set_item"]),

    async getItem() {
      this.editedItem.codigo = this.editedItem.codigo.replace(/\s+/g, "");
      
      await this.getItemByCod(this.editedItem.codigo);
      // console.log(this.item);
      if (this.error != false) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
      } else {
        if (Object.keys(this.item).length) {
          this.editedItem.codigo = this.item.codigo;
          this.editedItem.descricao = this.item.descricao;
        } else {
          this.showSnackbar(
            "Codigo não encontrado!" +
              " - " +
              this.editedItem.codigo.toUpperCase(),
            "warning",
            3000
          );
          this.editedItem.codigo = "";
        }
      }
    },
    voltar() {
      this.entrada = false;
      this.saida = false;
      this.items = [];
      this.dialogVoltar = false;
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogAdicionarEditar = true;
    },

    async deleteItem(item) {
      let check = await this.$bvModal.msgBoxConfirm(
        "Deseja realmente excluir este item?",
        {
          title: "Atenção!",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "SIM",
          cancelTitle: "NÃO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        }
      );
      if (check == true) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      }
    },

    close() {
      this.dialogAdicionarEditar = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    adicionar() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    },

    async save() {
       this.loading = true;
      let data = {
        usuario: this.$usuario.value.usuario.toUpperCase(),
        itens: this.items,
        tipo: +this.entrada,
      };
      this.dialogSalvar = false;

      await this.saveItens(data);
      if (this.error != false) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
         this.loading = false;
      } else {
        if (this.entrada == 1) {
        this.showSnackbar("Entrada realizada com sucesso!", "success", 5000);  
        }else{
          this.showSnackbar("Saída realizada com sucesso!", "success", 5000);
        }        
        this.loading = false;
        this.voltar();
      }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
  },
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