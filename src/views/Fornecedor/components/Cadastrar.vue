<template>
  <v-container>
    <v-card height="900">
      <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>Cadastro de Fornecedor</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="validate()">fa-save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-tabs vertical v-model="tab">
          <v-tab active-class="blue darken-2 white--text">Dados</v-tab>
          <v-tab active-class="blue darken-2 white--text">Endereços</v-tab>
          <v-tab active-class="blue darken-2 white--text">Contatos</v-tab>
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" height="auto" outlined>
                <v-card-text>
                  <v-row class="custom-row">
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="text"
                        autofocus
                        @keyup="verifyFornecedor(fornecedor.codigo)"
                        v-model="fornecedor.codigo"
                        :loading="codLoading"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Codigo"
                        v-mask="'#########'"
                        class="input-uppercase"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="text"
                        ref="cnpj"
                        hint="Digite somento números"
                        v-model="fornecedor.cnpj"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="CNPJ"
                        v-mask="'##.###.###/####-##'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="fornecedor.razao_social"
                        @keyup="fornecedor.fantasia = fornecedor.razao_social"
                        :rules="nomeRules"
                        label="Razão Social"
                        class="input-uppercase"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="8">
                      <v-text-field
                        class="input-uppercase"
                        v-model="fornecedor.fantasia"
                        :rules="nomeRules"
                        label="Fantasia"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row class="custom-row">
                    <v-col cols="12" md="4">
                      <v-text-field
                        type="text"
                        v-model="fornecedor.inscricao_estadual"
                        v-mask="'#########'"
                        label="Inscrição Estadual"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="fornecedor.inscricao_municipal"
                        class="input-uppercase"
                        label="Inscrição Municipal"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-title class="primary--text">
                  Endereços - Fornecedor
                  <v-btn small class="ml-3 success" @click="addEndereco()">Adicionar Endereço</v-btn>
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    height="auto"
                    class="elevation-1"
                    hide-default-footer
                    :headers="headersEnderecos"
                    :items="enderecos"
                    fixed-header
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{item.id}}</td>
                        <td>
                          <v-text-field
                            type="text"
                            @keyup="getCep(item, item.cep)"
                            v-model="item.cep"
                            v-mask="'#####-###'"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            :loading="cepLoading"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.logradouro"
                            class="input-uppercase"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            readonly
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            ref="numero"
                            v-model="item.numero"
                            type="number"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.complemento"
                            class="input-uppercase"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.bairro"
                            class="input-uppercase"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            readonly
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="item.cidade"
                            class="input-uppercase"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            readonly
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            type="text"
                            v-model="item.uf"
                            v-mask="'AA'"
                            class="input-uppercase"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            readonly
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-btn
                            text
                            icon
                            class="ma-2"
                            small
                            color="error"
                            @click="deleteEndereco(item)"
                          >
                            <i class="far fa-trash-alt mr-2"></i>
                          </v-btn>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-title class="primary--text">
                  Contatos - Fornecedor
                  <v-btn small class="ml-3 success" @click="addContato()">Adicionar Contato</v-btn>
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table
                  height="auto"
                  class="elevation-1"
                  hide-default-footer
                  :headers="headersContatos"
                  :items="contatos"
                  fixed-header
                  :items-per-page="-1"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{item.id}}</td>
                      <td>
                        <v-text-field
                          class="input-uppercase"
                          v-model="item.nome"
                          :rules="[v => !!v || 'Campo Obrigatório']"
                          autofocus
                          required
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field v-model="item.email" :rules="emailRules"></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          type="text"
                          v-model="item.telefone"
                          hint="Digite somento números com DDD"
                          v-mask="'(##)####-####'"
                          :rules="[v => !!v || 'Campo Obrigatório']"
                          required
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          type="text"
                          v-model="item.celular"
                          hint="Digite somento números com DDD"
                          v-mask="'(##)#####-####'"
                          :rules="[v => !!v || 'Campo Obrigatório']"
                          required
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          class="input-uppercase"
                          v-model="item.obs"
                          :rules="[v => !!v || 'Campo Obrigatório']"
                          required
                        ></v-text-field>
                      </td>
                      <td>
                        <v-btn
                          text
                          icon
                          class="ma-2"
                          small
                          color="error"
                          @click="deleteContato(item)"
                        >
                          <i class="far fa-trash-alt mr-2"></i>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-form>
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
function defaultData() {
  return {
    tab: null,
    fornecedor: {
      codigo: "",
      razao_social: "",
      fantasia: "",
      cnpj: "",
      inscricao_estadual: "",
      inscricao_municipal: ""
    },
    nomeRules: [
      v => !!v || "Campo Obrigatório",
      v => v.length >= 3 || "Campo deve possuir 3 caracteres ou mais"
    ],
    emailRules: [
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      }
    ],
    valid: false,
    codLoading: false,
    cepLoading: false,

    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    permissoes: {},

    headersEnderecos: [
      { text: "#", value: "id", sortable: false },
      { text: "CEP", value: "cep", sortable: true },
      {
        text: "Logradouro",
        value: "logradouro",
        width: "300",
        sortable: false
      },
      { text: "Numero", value: "numero", width: "100", sortable: true },
      { text: "Complemento", value: "complemento", sortable: true },
      { text: "Bairro", value: "bairro", width: "200", sortable: true },
      { text: "Cidade", value: "cidade", width: "200", sortable: true },
      { text: "UF", value: "uf", width: "100", sortable: true },
      { text: "Ação", value: "acao", sortable: true }
    ],
    enderecos: [
      {
        id: 1,
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        acao: ""
      }
    ],
    headersContatos: [
      { text: "#", value: "id", sortable: false },
      { text: "Nome", value: "nome", sortable: false },
      { text: "Email", value: "email", width: "200", sortable: true },
      { text: "Telefone", value: "telefone", width: "150", sortable: true },
      { text: "Celular", value: "celular", width: "150", sortable: true },
      { text: "Obs", value: "obs", sortable: true },
      { text: "Ação", value: "acao", sortable: true }
    ],
    contatos: [
      {
        id: 1,
        nome: "",
        email: "",
        telefone: "",
        celular: "",
        obs: "",
        acao: ""
      }
    ]
  };
}
export default {
  data: function() {
    return defaultData();
  },
  mounted() {
    this.getPermissao();
  },
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      error: state => state.fornecedor.error,
      findFornecedor: state => state.fornecedor.findFornecedor
    })
  },
  methods: {
    ...mapActions(["checkFornecedor", "saveFornecedor"]),
    addEndereco() {
      let endereco = {
        id: this.enderecos.length + 1,
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        acao: ""
      };
      this.enderecos.push(endereco);
    },
    addContato() {
      let contato = {
        id: this.contatos.length + 1,
        nome: "",
        email: "",
        telefone: "",
        celular: "",
        obs: "",
        acao: ""
      };
      this.contatos.push(contato);
    },
    deleteEndereco(item) {
      if (this.enderecos.length != 1) {
        this.enderecos = this.enderecos.filter(i => {
          return item.id != i.id;
        });

        for (let i = 0; i < this.enderecos.length; i++) {
          this.enderecos[i].id = i + 1;
        }
      }
    },
    deleteContato(item) {
      if (this.contatos.length != 1) {
        this.contatos = this.contatos.filter(i => {
          return item.id != i.id;
        });

        for (let i = 0; i < this.contatos.length; i++) {
          this.contatos[i].id = i + 1;
        }
      }
    },
    async verifyFornecedor(codigo) {
      if (codigo.length == 9) {
        this.codLoading = true;
        await this.checkFornecedor(codigo);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
          this.codLoading = false;
        } else {
          if (this.findFornecedor) {
            this.showSnackbar(
              "Atenção! Fornecedor já cadastrado.",
              "warning",
              5000
            );
            this.fornecedor.codigo = "";
            this.codLoading = false;
          } else {
            let input = this.$refs.cnpj;
            input.focus();
          }
        }
        this.codLoading = false;
      }
    },

    async validate() {
      if (this.$refs.form.validate()) {
        this.fornecedor = Object.assign(
          this.fornecedor,
          { inserido_por: this.$usuario.value.usuario.toUpperCase() },
          { enderecos: this.enderecos },
          { contatos: this.contatos }
        );
        this.loading = true;

        await this.saveFornecedor(this.fornecedor);

        if (this.error) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.showSnackbar("Cadastrado Com Sucesso!", "success", 5000);

          Object.assign(this.$data, defaultData());
          this.$refs.form.resetValidation();
        }
        this.loading = false;
      }
    },

    getCep(item, cep) {
      if (cep.length == 9) {
        cep = cep.replace("-", "");
        this.cepLoading = true;
        this.$axios
          .get("https://viacep.com.br/ws/" + cep + "/json/")
          .then(res => {
            if (res.data.erro == true) {
              this.enderecos.forEach(e => {
                if (item.id == e.id) {
                  item.logradouro = "";
                  item.bairro = "";
                  item.cidade = "";
                  item.uf = "";
                }
              });
              this.showSnackbar("Cep Inválido", "warning", 5000);
              return;
            } else {
              this.enderecos.forEach(e => {
                if (item.id == e.id) {
                  item.logradouro = res.data.logradouro;
                  item.bairro = res.data.bairro;
                  item.cidade = res.data.localidade;
                  item.uf = res.data.uf;
                }
              });
              this.cepLoading = false;

              let input = this.$refs.numero;
              input.focus();
            }
          })
          .catch(err => {
            this.cepLoading = false;
            console.log(err);
          });
      }
    },

    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "cadastrar_cliente"
          }
        })
        .then(res => {
          this.permissoes = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
</style>