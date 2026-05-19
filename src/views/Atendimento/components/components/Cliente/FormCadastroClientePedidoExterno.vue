<template>
  <v-container>
    <v-card height="600">
      <v-toolbar dense flat>
        <v-toolbar-title class="primary--text">Cadastro de Cliente</v-toolbar-title>
        <v-btn @click="validate()" color="success" class="ml-5" text>
          <v-icon left>fa-save</v-icon> Salvar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="close()" color="error" text>
          <v-icon left >fa-times</v-icon> Voltar
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-tabs vertical>
          <v-tab active-class="blue darken-2 white--text">Dados</v-tab>
          <v-tab-item>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-text>
                  <v-row class="custom-row">
                    <v-col cols="12" md="2">
                      <v-text-field
                        @keyup="checkCpfCnpj(cliente.cpf_cnpj)"
                        type="search"
                        autocomplete="off"
                        hint="Digite somento números"
                        autofocus
                        v-model="cliente.cpf_cnpj"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="CPF/CNPJ"
                        v-mask="['###.###.###-##', '##.###.###/####-##']"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="cliente.razao_social"
                        type="search"
                        autocomplete="off"
                        @keyup="cliente.fantasia = cliente.razao_social"
                        :rules="nomeRules"
                        label="Razão Social"
                        class="input-uppercase"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        hint="Digite somento números com DDD"
                        v-model="cliente.telefone"
                       type="search"
                        autocomplete="off"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Telefone"
                        v-mask="'(##) ####-####'"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.email"
                        type="search"
                        autocomplete="off"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="E-Mail"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="6">
                      <v-text-field
                        class="input-uppercase"
                        v-model="cliente.fantasia"
                        type="search"
                        autocomplete="off"
                        :rules="nomeRules"
                        label="Fantasia"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        hint="Digite somento números com DDD"
                        v-model="cliente.celular"
                        type="search"
                        autocomplete="off"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Celular/WhatsApp"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-textarea
                        :rows="2"
                        no-resize
                        label="Obs/Contato"
                        type="search"
                        autocomplete="off"
                        v-model="cliente.observacao"
                        dense
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div v-if="isCnpj">
                    <v-row class="custom-row">
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-mask="'#########'"
                         type="search"
                        autocomplete="off"
                          v-model="cliente.inscricao_estadual"
                          :rules="nomeRules"
                          label="Inscrição Estadual"
                          dense
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="cliente.inscricao_municipal"
                          type="search"
                        autocomplete="off"
                          label="Inscrição Municipal"
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
              <v-card class="mx-auto mt-3" outlined>
                <v-card-title class="primary--text"
                  >Endereço Principal</v-card-title
                >
                <v-card-text>
                  <v-row class="custom-row">
                    <v-col cols="12" md="2">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        @keyup="getCep(cliente.endereco_principal)"
                        hint="Digite somento números"
                        v-model="cliente.endereco_principal.cep"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Cep"
                        :loading="cepPrincipalLoading"
                        ref="cep_principal"
                        v-mask="'#####-###'"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="5">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        hint="Rua, Avenida, Estrada..."
                        v-model="cliente.endereco_principal.logradouro"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Endereço"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        v-model="cliente.endereco_principal.numero"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Número"
                        ref="numero_principal"
                        required
                        v-mask="'####'"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.complemento"
                        label="Complemento"
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="custom-row">
                    <v-col cols="12" md="4">
                      <v-text-field
                        class="input-uppercase"
                        type="search"
                        autocomplete="off"
                        v-model="cliente.endereco_principal.bairro"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Bairro"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.cidade"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Cidade"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        v-model="cliente.endereco_principal.uf"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        label="Estado"
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-form>
    </v-card>
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
import { mapState, mapActions, mapMutations } from "vuex";
function defaultData() {
  return {
    cliente: {
      codigo: "",
      cpf_cnpj: "",
      razao_social: "",
      fantasia: "",
      inscricao_estadual: "",
      inscricao_municipal: "",
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
        cep: "",
      },
      cliente_enderecos: [],
    },
    vendedores: [],
    nomeRules: [
      (v) => !!v || "Campo Obrigatório",
      (v) => v.length >= 3 || "Campo deve possuir 3 caracteres ou mais",
    ],
    valid: false,
    cepPrincipalLoading: false,
    isCnpj: false,
  };
}
export default {
  props: {
    showBtnVoltar: Boolean,
  },
  data: function () {
    return defaultData();
  },
  mounted() {
    //this.get_permissoes(); pagina sem permissoes no momento
    this.getVendedores();
  },
  computed: {
    ...mapState({
      error: (state) => state.cliente.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading
    }),
  },
  methods: {
    ...mapActions(["save_cliente", "get_permissoes"]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    close() {
      //Object.assign(this.$data, defaultData());
      // this.dialogContinuar = false;
      this.$emit("close-dialog");
    },

    async validate() {
      if (this.$refs.form.validate()) {
        delete this.cliente.endereco_principal.cep_ok;
        delete this.cliente.endereco_principal.disabled;

        this.cliente.cliente_enderecos.push(this.cliente.endereco_principal);

        this.cliente.criado_por = this.$usuario.value.usuario.toUpperCase();
        this.cliente.vendedor = this.$usuario.value.vendedor;

        this.set_loading(true);

        await this.save_cliente(this.cliente);

        this.set_loading(false);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          this.set_snackbar({
            show: true,
            msg: "Cadastrado Com Sucesso!",
            type: "success",
            time: 3000,
          });

          this.set_loading(false);
          this.close();
        }
      } else {
        this.set_snackbar({
          show: true,
          msg: "Preencha os campos obrigatórios.",
          type: "error",
          time: 0,
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
    getCep(item) {
      if (item.cep.length == 9) {
        this.set_loading(true);

        item.cep = item.cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + item.cep + "/json/")
          .then((res) => {
            if (res.data.erro) {
              this.set_loading(false);
              this.$refs.cep_principal.focus();

              this.set_snackbar({
                show: true,
                msg: "Cep Inválido",
                type: "warning",
                time: 2000,
              });

              return;
            }
            this.set_loading(false);
            this.cliente.endereco_principal.logradouro = res.data.logradouro.toUpperCase();
            this.cliente.endereco_principal.bairro = res.data.bairro.toUpperCase();
            this.cliente.endereco_principal.cidade = res.data.localidade.toUpperCase();
            this.cliente.endereco_principal.uf = res.data.uf.toUpperCase();
            this.$refs.numero_principal.focus();
          })
          .catch((err) => {
            this.set_loading(false);
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
        .then((res) => {
          this.vendedores.push({ text: "Selecione..", value: null });
          res.data.forEach((element) => {
            this.vendedores.push({ text: element.nome, value: element.codigo });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
<style scoped>
</style>