<template>
  <v-container>
    <v-card height="600">
      <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>Cadastro de Cliente</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="validate()">fa-save</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click="close()">fa-times</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-tabs vertical>
          <v-tab active-class="blue darken-2 white--text">Dados</v-tab>
          <v-tab active-class="blue darken-2 white--text">Endereços</v-tab>
          <v-tab active-class="blue darken-2 white--text">Contatos</v-tab>
          <v-tab-item>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-text>
                  <v-row class="custom-row">
                    <v-col cols="12" md="2">
                      <v-text-field
                        @keyup="checkCpfCnpj(cliente.cpf_cnpj)"
                        hint="Digite somento números"
                        autofocus
                        v-model="cliente.cpf_cnpj"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="CPF/CNPJ"
                        v-mask="['###.###.###-##', '##.###.###/####-##']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-select
                        v-model="cliente.condicao"
                        :items="condicoes"
                        item-text="descricao"
                        item-value="id"
                        label="Condição"
                        persistent-hint
                        outlined
                        hint="Condição Financeira"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-select
                        v-model="cliente.tipo"
                        :items="tipos"
                        item-text="descricao"
                        item-value="id"
                        label="Tipo"
                        outlined
                        disabled
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-select
                        v-model="cliente.atividade"
                        item-text="descricao"
                        item-value="id"
                        :items="atividades"
                        label="Atividade"
                        outlined
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-select
                        required
                        v-model="cliente.vendedor"
                        :items="vendedores"
                        label="Vendedor"
                        outlined
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        label="Limite"
                        required
                        v-money="$money"
                        v-model.lazy="cliente.limite_credito"
                        maxlength="13"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="cliente.razao_social"
                        @keyup="cliente.fantasia = cliente.razao_social"
                        :rules="nomeRules"
                        label="Razão Social"
                        class="input-uppercase"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        hint="Digite somento números com DDD"
                        v-model="cliente.telefone"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Telefone"
                        v-mask="'(##) ####-####'"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.email"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="E-Mail"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="6">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.fantasia"
                        :rules="nomeRules"
                        label="Fantasia"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        hint="Digite somento números com DDD"
                        v-model="cliente.celular"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Celular/WhatsApp"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-textarea
                        :rows="2"
                        no-resize
                        label="Obs/Contato"
                        v-model="cliente.observacao"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div v-if="isCnpj">
                    <v-row class="custom-row">
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-mask="'#########'"
                          v-model="cliente.inscricao_estadual"
                          :rules="nomeRules"
                          label="Inscrição Estadual"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="cliente.inscricao_municipal"
                          label="Inscrição Municipal"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-title class="primary--text">Endereço Principal</v-card-title>
                <v-card-text>
                  <v-row class="custom-row">
                    <v-col cols="12" md="2">
                      <v-text-field
                        @keyup="getCep(cliente.endereco_principal)"
                        hint="Digite somento números"
                        v-model="cliente.endereco_principal.cep"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Cep"
                        :loading="cepPrincipalLoading"
                        ref="cep_principal"
                        v-mask="'#####-###'"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="5">
                      <v-text-field
                        class="input-uppercase"
                        hint="Rua, Avenida, Estrada..."
                        v-model="cliente.endereco_principal.logradouro"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Endereço"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        v-model="cliente.endereco_principal.numero"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Número"
                        ref="numero_principal"
                        required
                        v-mask="'####'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.complemento"
                        label="Complemento"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.bairro"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Bairro"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.cidade"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Cidade"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.uf"
                        :rules="[v => !!v || 'Campo Obrigatório']"
                        label="Estado"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-checkbox
                        @change="hasEnderecoEntrega(cliente.hasEnderecoEntrega)"
                        v-model="cliente.hasEnderecoEntrega"
                        label="Possui endereço de entrega"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="cliente.hasEnderecoEntrega" class="mx-auto mt-2" outlined>
                <v-card-title class="primary--text">
                  Endereços de Entrega -
                  <v-btn small class="ml-3 success" @click="addEnderecoEntrega()">Adicionar Endereço</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    height="200"
                    class="elevation-1"
                    hide-default-footer
                    dense
                    :headers="headersEnderecoEntrega"
                    :items="enderecosEntrega"
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>
                          <v-text-field
                            height="12"
                            hide-details
                            @keyup="getCep(item)"
                            hint="Digite somento números"
                            v-model="item.cep"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Cep"
                            :loading="item.loading"
                            ref="cep_entrega"
                            v-mask="'#####-###'"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            hint="Rua, Avenida, Estrada..."
                            v-model="item.logradouro"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Endereço"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            v-model="item.numero"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Número"
                            required
                            maxlength="4"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.complemento"
                            label="Complemento"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.bairro"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Bairro"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.cidade"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Cidade"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.uf"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="UF"
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
                            @click="deleteEnderecoEntrega(item)"
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
          <v-tab-item>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-title class="primary--text">
                  Contatos -
                  <v-btn small class="ml-3 success" @click="addContato()">Adicionar Contato</v-btn>
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table
                  height="200"
                  class="elevation-1"
                  hide-default-footer
                  dense
                  :headers="headersContatos"
                  :items="contatos"
                  fixed-header
                  :items-per-page="-1"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{item.id}}</td>
                      <td>
                        <v-text-field dense height="12" hide-details v-model="item.nome"></v-text-field>
                      </td>
                      <td>
                        <v-text-field dense height="12" hide-details v-model="item.email"></v-text-field>
                      </td>
                      <td>
                        <v-text-field dense height="12" hide-details v-model="item.telefone"></v-text-field>
                      </td>
                      <td>
                        <v-text-field dense height="12" hide-details v-model="item.celular"></v-text-field>
                      </td>
                      <td>
                        <v-textarea dense hide-details :rows="2" no-resize v-model="item.obs"></v-textarea>
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

    <v-dialog v-model="dialogContinuar" max-width="290">
      <v-card>
        <v-card-title class="headline">Atenção</v-card-title>
        <v-card-text>Deseja fazer um Orçamento para este cliente?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class="error--text" text @click="close()">Não</v-btn>

          <v-btn class="success--text" text @click="closeAndContinue()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { mapState, mapActions } from "vuex";
function defaultData() {
  return {
    dialogContinuar: false,
    cliente: {
      codigo: "",
      cpf_cnpj: "",
      tipo: 1,
      atividade: 1,
      condicao: true,
      razao_social: "",
      fantasia: "",
      inscricao_estadual: "",
      inscricao_municipal: "",
      limite_credito: 100000,
      vendedor: null,
      observacao: "",
      telefone: "",
      celular: "",
      email: "",
      endereco_principal: {
          tipo: 1,
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: ""
        },
      cliente_enderecos: [],
      cliente_contatos: []
    },
    show: true,
    vendedores: [],
    nomeRules: [
      v => !!v || "Campo Obrigatório",
      v => v.length >= 3 || "Campo deve possuir 3 caracteres ou mais"
    ],
    valid: false,
    cepPrincipalLoading: false,
    isCnpj: false,
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    permissoes: {},
    headersEnderecoEntrega: [
      { text: "Cep", value: "cep", sortable: false, width: 150 },
      { text: "Endereço", value: "logradouro", sortable: false },
      { text: "Nº", value: "numero", sortable: false, width: 100 },
      {
        text: "Complemento",
        value: "complemento",
        sortable: false,
        width: 150
      },
      { text: "Bairro", value: "bairro", sortable: false },
      { text: "Cidade", value: "cidade", sortable: false },
      { text: "UF", value: "uf", sortable: false, width: 70 },
      { text: "Ação", value: "acao", sortable: true }
    ],
    enderecosEntrega: [],
    headersContatos: [
      { text: "#", value: "id", sortable: false },
      { text: "Nome", value: "nome", sortable: false },
      { text: "Email", value: "email", sortable: true },
      { text: "Telefone", value: "telefone", sortable: true },
      { text: "Celular", value: "celular", sortable: true },
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
  props: {
    showBtnVoltar: Boolean
  },
  data: function() {
    return defaultData();
  },
  mounted() {
    this.getPermissao();
    this.getVendedores();
    this.get_atividades();
    this.get_condicoes();
    this.get_tipos();
  },
  computed: {
    ...mapState({
      error: state => state.cliente.error,
      condicoes: state => state.cliente.condicoes,
      atividades: state => state.cliente.atividades,
      tipos: state => state.cliente.tipos
    })
  },
  methods: {
    ...mapActions([
      "save_cliente",
      "get_condicoes",
      "get_atividades",
      "get_tipos"
    ]),

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

    deleteContato(item) {
      if (this.contatos.length != 1) {
        this.contatos = this.contatos.filter(item => {
          return item.id != contato.id;
        });

        for (let i = 0; i < this.contatos.length; i++) {
          this.contatos[i].id = i + 1;
        }
      }
    },

    hasEnderecoEntrega(hasEnderecoEntrega) {
      if (!hasEnderecoEntrega) {
        this.enderecosEntrega = [];
      } else {
        this.enderecosEntrega.push({
          id: 1,
          codigo_cliente: "",
          tipo: 2,
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: "",
          text: "",
          acao: "",
          cep_ok: false,
          disabled: true
        });
      }
    },
    addEnderecoEntrega() {
      let endereco = {
        id: this.enderecosEntrega[this.enderecosEntrega.length - 1].id + 1,
        codigo_cliente: "",
        tipo: 2,
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        text: "",
        acao: "",
        cep_ok: false,
        disabled: true
      };

      endereco.text = endereco.logradouro + ", " + endereco.numero;

      this.enderecosEntrega.push(endereco);
    },

    deleteEnderecoEntrega(endereco) {
      if (this.enderecosEntrega.length != 1) {
        this.enderecosEntrega = this.enderecosEntrega.filter(item => {
          return item.id != endereco.id;
        });

        for (let i = 0; i < this.enderecosEntrega.length; i++) {
          this.enderecosEntrega[i].id = i + 1;
        }
      }
    },
    close() {
      //Object.assign(this.$data, defaultData());
      this.dialogContinuar = false;
      this.$emit("close-dialog");
    },
    closeAndContinue() {
      // continuar para o pedido
      this.dialogContinuar = false;
      this.$emit("close-continue-dialog");
    },
    async validate() {
      if (this.$refs.form.validate()) {

        delete this.cliente.endereco_principal.cep_ok;
        delete this.cliente.endereco_principal.disabled;

        this.cliente.cliente_enderecos.push(this.cliente.endereco_principal);

        if(this.cliente.hasEnderecoEntrega) {
          this.enderecosEntrega.forEach(item => {
            delete item.id;
            delete item.cep_ok;
            delete item.disabled;
            this.cliente.cliente_enderecos.push(item);
          });
        }
        
        this.contatos.forEach(item => {
          if(item.nome.trim().length > 0) {
            delete item.id;
            delete item.acao;
            this.cliente.cliente_contatos.push(item);
          }
        });
        
        this.cliente.criado_por = this.$usuario.value.usuario.toUpperCase();
        
        this.loading = true;

        await this.save_cliente(this.cliente);

        if (this.error) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.showSnackbar("Cadastrado Com Sucesso!", "success", 2000);
          this.dialogContinuar = true;
        }

        this.loading = false;
      }
    },
    checkCpfCnpj(cpfCnpj) {
      if (cpfCnpj.length > 14) {
        this.isCnpj = true;
        this.cliente.tipo = 2;
      } else {
        this.isCnpj = false;
        this.cliente.tipo = 1;
      }
    },
    getCep(item) {
      if (item.cep.length == 9) {
        if (item.tipo == 1) {
          this.cepPrincipalLoading = true;
        } else {
          this.cepEntregaLoading = true;
        }

        item.cep = item.cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + item.cep + "/json/")
          .then(res => {
            if (res.data.erro) {
              if (item.tipo == 1) {
                this.cepPrincipalLoading = false;
                this.$refs.cep_principal.focus();
              } else {
                this.cepEntregaLoading = false;
              }
              this.showSnackbar("Cep Inválido", "warning", 2000);
              return;
            }

            if (item.tipo == 1) {
              this.cepPrincipalLoading = false;
              this.cliente.endereco_principal.logradouro = res.data.logradouro.toUpperCase();
              this.cliente.endereco_principal.bairro = res.data.bairro.toUpperCase();
              this.cliente.endereco_principal.cidade = res.data.localidade.toUpperCase();
              this.cliente.endereco_principal.uf = res.data.uf.toUpperCase();
              this.$refs.numero_principal.focus();
            } else {
              item.cep_ok = true;
              item.logradouro = res.data.logradouro.toUpperCase();
              item.bairro = res.data.bairro.toUpperCase();
              item.cidade = res.data.localidade.toUpperCase();
              item.uf = res.data.uf.toUpperCase();
            }
          })
          .catch(err => {
            this.cepPrincipalLoading = false;
            console.log(err);
          });
      } else {
        item.cep_ok = false;
        item.disabled = true;
        item.logradouro = "";
        item.bairro = "";
        item.cidade = "";
        item.uf = "";
      }
    },
    getVendedores() {
      this.$axios
        .get("/vendedores")
        .then(res => {
          this.vendedores.push({ text: "Selecione..", value: null });
          res.data.forEach(element => {
            this.vendedores.push({ text: element.nome, value: element.codigo });
          });
        })
        .catch(err => {
          console.log(err);
        });
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