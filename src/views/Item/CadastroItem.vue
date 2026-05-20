<template>
  <v-container>
    <v-card max-width="1500" height="650" elevation="2">
      <v-row class="ma-2 mt-10">
        <v-col cols="12" md="12">
          <div class="text-right">
            <v-btn
              class="ml-6 mr-6"
              style="margin-bottom: 15px;"
              height="15"
              text
              icon
              color="success"
            >
              <v-icon>fa-chevron-circle-left</v-icon>
            </v-btn>
            <v-btn
              class="mr-6"
              @click="cadastrarItem()"
              style="margin-bottom: 15px;"
              height="15"
              text
              icon
              color="primary"
            >
              <v-icon>fa-save</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-form class="ma-4" ref="form" v-model="valid" lazy-validation>
        <v-row class="mt-n10">
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  class="uppercase"
                  label="Código"
                  ref="codigo"
                  v-model="item.codigo"
                  :rules="[regras]"
                  required
                  dense
                  autofocus
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="12" md="6">
                <v-text-field
                  class="uppercase"
                  label="Código Fornecedor"
                  v-model="item.codigo_fornecedor"
                  :rules="[regras]"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :search-input.sync="getFornecedor"
                  v-model="item.selectedFornecedor"
                  :items="fornecedores"
                  item-text="descricao"
                  :rules="[select]"
                  @change="onChangeMarcas()"
                  return-object
                  label="Fornecedor"
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="12" md="12">
                <v-text-field
                  class="uppercase"
                  label="Descrição"
                  v-model="item.descricao"
                  :rules="[regras]"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="12" md="6">
                <v-select
                  class="uppercase"
                  label="Marca"
                  v-model="item.selectedMarca"
                  :rules="[select]"
                  :items="marcas"
                  return-object
                  item-text="descricao"
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  class="uppercase"
                  label="Status"
                  v-model="item.selectedStatus"
                  :rules="[select]"
                  :items="status"
                  item-text="descricao"
                  return-object
                  dense
                ></v-select>
              </v-col>
            </v-row>

            <v-row class="mt-n6">
              <v-col cols="12" md="6">
                <v-text-field
                  class="uppercase"
                  label="Código de Barras"
                  v-model="item.codigo_barras"
                  :rules="[regras]"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="12" md="6">
                <v-autocomplete
                  :search-input.sync="getEndereco"
                  v-model="item.selectedItemEndereco"
                  :items="item_endereco"
                  item-text="descricao"
                  :rules="[select]"
                  return-object
                  label="Endereço"
                  dense
                ></v-autocomplete>               
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  :search-input.sync="getArmazem"
                  v-model="item.selectedItemArmazem"
                  :items="item_armazem"
                  item-text="descricao"
                  :rules="[select]"
                  return-object
                  label="Armazém"
                  dense
                ></v-autocomplete>                
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-snackbar :color="typeSnackbar" :timeout="timeSnackbar" v-model="snackbar">
      {{msgSnackbar}}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    valid: true,
    item: {
      codigo: "",
      codigo_fornecedor: "",
      selectedFornecedor: 0,
      descricao: "",
      selectedMarca: 0,
      selectedStatus: 0,
      codigo_barras: "",
      selectedItemEndereco: 0,
      selectedItemArmazem: 0
    },
    getFornecedor: null,
    getEndereco: null,
    getArmazem: null,
    regras: val => (val || "").length >= 4 || "*Campo obrigatório",
    select: v => !!v || "Item is required",
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: ""
  }),

  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getStatus();
  },
  computed: {
    ...mapState({
      error: state => state.item.error,
      fornecedores: state => state.item.fornecedores,
      marcas: state => state.item.marcas,
      status: state => state.item.status,
      item_endereco: state => state.item.enderecos,
      item_armazem: state => state.item.armazens
    })
  },
  watch: {
    getFornecedor() {
      this.getFornecedores();
    },
    getEndereco() {
      this.getItemEnderecos();
    },
    getArmazem() {
      this.getItemArmazens();
    }
  },

  methods: {
    ...mapActions([
      "saveItem",
      "getFornecedores",
      "getMarcas",
      "getStatus",
      "getItemEnderecos",
      "getItemArmazens"
    ]),

    async cadastrarItem() {
      if (this.$refs.form.validate()) {
        await this.saveItem(this.item);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.showSnackbar("Item cadastrado com sucesso!", "success", 5000);
          this.item = {};
          this.$refs.form.reset();
          this.$nextTick(() => this.$refs.codigo.focus());
        }
      }
    },
    async onChangeMarcas() {
           
      if (this.item.selectedFornecedor) {
        await this.getMarcas(this.item.selectedFornecedor.id);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        }
      }
    },

    showSnackbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    }
  }
};
</script>
    <style scope>
</style>