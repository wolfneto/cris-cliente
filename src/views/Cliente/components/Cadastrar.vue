<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
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
                label="Condição"
                persistent-hint
                outlined
                hint="Condição Financeira"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select v-model="cliente.tipo" :items="tipos" label="Tipo" outlined disabled></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select v-model="cliente.atividade" :items="atividades" label="Atividade" outlined></v-select>
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
              <v-textarea :rows="2" no-resize label="Obs/Contato" v-model="cliente.observacao"></v-textarea>
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
                <v-text-field v-model="cliente.inscricao_municipal" label="Inscrição Municipal"></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-row class="custom-row">
            <v-col cols="12" md="2">
              <v-text-field
                @keyup="getCep(cliente.cliente_enderecos[0].cep, cliente.cliente_enderecos[0].tipo)"
                hint="Digite somento números"
                v-model="cliente.cliente_enderecos[0].cep"
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
                v-model="cliente.cliente_enderecos[0].logradouro"
                :rules="[v => !!v || 'Campo Obrigatório']"
                label="Endereço"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <v-text-field
                v-model="cliente.cliente_enderecos[0].numero"
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
                v-model="cliente.cliente_enderecos[0].complemento"
                label="Complemento"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="custom-row">
            <v-col cols="12" md="4">
              <v-text-field
                class="input-uppercase"
                v-model="cliente.cliente_enderecos[0].bairro"
                :rules="[v => !!v || 'Campo Obrigatório']"
                label="Bairro"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                class="input-uppercase"
                v-model="cliente.cliente_enderecos[0].cidade"
                :rules="[v => !!v || 'Campo Obrigatório']"
                label="Cidade"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <v-text-field
                class="input-uppercase"
                v-model="cliente.cliente_enderecos[0].uf"
                :rules="[v => !!v || 'Campo Obrigatório']"
                label="Estado"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-checkbox v-model="cliente.hasEnderecoEntrega" label="Possui endereço de entrega"></v-checkbox>
            </v-col>
          </v-row>
          <div v-if="cliente.hasEnderecoEntrega" class="blue lighten-5">
            <div class="m-3">
              <v-divider></v-divider>
              <div class="title mb-n4">Entrega</div>
              <v-row class="custom-row">
                <v-col cols="12" md="2">
                  <v-text-field
                    @keyup="getCep(cliente.cliente_enderecos[1].cep, cliente.cliente_enderecos[1].tipo)"
                    hint="Digite somento números"
                    v-model="cliente.cliente_enderecos[1].cep"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Cep"
                    :loading="cepEntregaLoading"
                    ref="cep_entrega"
                    v-mask="'#####-###'"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    class="input-uppercase"
                    hint="Rua, Avenida, Estrada..."
                    v-model="cliente.cliente_enderecos[1].logradouro"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Endereço"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                  <v-text-field
                    v-model="cliente.cliente_enderecos[1].numero"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Número"
                    ref="numero_entrega"
                    required
                    maxlength="4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    class="input-uppercase"
                    v-model="cliente.cliente_enderecos[1].complemento"
                    label="Complemento"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="custom-row">
                <v-col cols="12" md="4">
                  <v-text-field
                    class="input-uppercase"
                    v-model="cliente.cliente_enderecos[1].bairro"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Bairro"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    class="input-uppercase"
                    v-model="cliente.cliente_enderecos[1].cidade"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Cidade"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                  <v-text-field
                    class="input-uppercase"
                    v-model="cliente.cliente_enderecos[1].uf"
                    :rules="[v => !!v || 'Campo Obrigatório']"
                    label="Estado"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="d-flex flex-row-reverse">
            <v-btn :disabled="!valid" color="success" class="ml-4 mt-4" @click="validate()">Salvar</v-btn>
            <v-btn v-if="showBtnVoltar" color="error" class="ml-4 mt-4" @click="close()">Voltar</v-btn>
          </div>
        </v-container>
      </v-form>
    </v-card>

    <v-dialog v-model="dialogContinuar" max-width="290">
      <v-card>
        <v-card-title class="headline">Deseja fazer um Orçamento para este cliente?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="close()">Não</v-btn>

          <v-btn color="green darken-1" text @click="closeAndContinue()">Sim</v-btn>
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
	  hasEnderecoEntrega: false,
      cliente_enderecos: [
        {
          tipo: 1,
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: ""
        },
        {
          tipo: 2,
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: ""
        }
      ]
    },
    show: true,
    
    tipos: [],
    atividades: [],
    condicoes: [
      { text: "ATIVO", value: true },
      { text: "BLOQUEADO", value: false }
    ],
    vendedores: [],
    nomeRules: [
      v => !!v || "Campo Obrigatório",
      v => v.length >= 3 || "Campo deve possuir 3 caracteres ou mais"
    ],
    valid: false,
    cepPrincipalLoading: false,
    cepEntregaLoading: false,
    isCnpj: false,
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    permissoes: {}
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
    //this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
    this.getVendedores();
    this.getAtividades();
    this.getTipos();
  },
  methods: {
    close() {
      //Object.assign(this.$data, defaultData());
      this.dialogContinuar = false;
      this.$emit("close-dialog");
    },
    closeAndContinue() {
      this.$emit("update:cliente", this.cliente);
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        this.$axios
          .post("/cliente", {
            cliente: this.cliente
          })
          .then(res => {
            console.log(res.data);
            this.loading = false;
            if (res.data === false) {
              this.showSnackbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else {
              this.showSnackbar("Cadastrado Com Sucesso!", "success", 2000);
              this.close();
            }
          })
          .catch(err => {
            this.loading = false;
            this.showSnackbar("Error " + err, "error");
            console.log(err);
          });
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
    getCep(cep, tipo) {
      if (cep.length == 9) {
        if (tipo == 1) {
          this.cepPrincipalLoading = true;
        } else {
          this.cepEntregaLoading = true;
        }

        cep = cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + cep + "/json/")
          .then(res => {
            if (res.data.erro) {
              if (tipo == 1) {
                this.cepPrincipalLoading = false;
                this.$refs.cep_principal.focus();
              } else {
                this.cepEntregaLoading = false;
                this.$refs.cep_entrega.focus();
              }
              this.showSnackbar("Cep Inválido", "warning", 2000);
              return;
            }
            if (tipo == 1) {
              this.cepPrincipalLoading = false;
              this.cliente.cliente_enderecos[0].logradouro =
                res.data.logradouro;
              this.cliente.cliente_enderecos[0].bairro = res.data.bairro;
              this.cliente.cliente_enderecos[0].cidade = res.data.localidade;
              this.cliente.cliente_enderecos[0].uf = res.data.uf;
              this.$refs.numero_principal.focus();
            } else {
              this.cepEntregaLoading = false;
              this.cliente.cliente_enderecos[1].logradouro =
                res.data.logradouro;
              this.cliente.cliente_enderecos[1].bairro = res.data.bairro;
              this.cliente.cliente_enderecos[1].cidade = res.data.localidade;
              this.cliente.cliente_enderecos[1].uf = res.data.uf;
              this.$refs.numero_entrega.focus();
            }
          })
          .catch(err => {
            this.cepPrincipalLoading = false;
            console.log(err);
          });
      }
    },
    getVendedores() {
      this.$axios
        .get("/cliente/vendedores")
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
    getAtividades() {
      this.$axios
        .get("/cliente/atividades")
        .then(res => {
          res.data.forEach(element => {
            this.atividades.push({
              text: element.descricao,
              value: element.id
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTipos() {
      this.$axios
        .get("/cliente/tipos")
        .then(res => {
          res.data.forEach(element => {
            this.tipos.push({ text: element.descricao, value: element.id });
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