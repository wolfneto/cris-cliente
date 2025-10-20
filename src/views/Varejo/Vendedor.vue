<template>
  <v-container fluid>
    <v-card class="mx-auto">
      <v-card-title>
        Vendedores
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="uppercase"
          append-icon="fa-search"
          v-model="search"
          label="Buscar"
          hide-details
          dense
          filled
          rounded
          @click="$event.target.select()"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = true" text
          ><v-icon color="blue" class="mr-2">fa-plus</v-icon> Vendedor</v-btn
        >
      </v-card-title>
      <v-data-table
        hide-default-footer
        :items-per-page="-1"
        :headers="headersVendedores"
        :items="filteredVendedores"
        class="elevation-1"
        fixed-header
        :search="search"
        height="500px"
        dense
      >
        <template v-slot:item.codigo="{ item }">
          <b> {{ item.codigo }}</b>
        </template>
        <template v-slot:item.nome="{ item }">
          <span class="font-weight-black">{{ item.nome }}</span>
        </template>
        <template v-slot:item.celular="{ item }">
          <span class="font-weight-black">{{
            $put_mask(item.celular, "celular")
          }}</span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-row no-gutters>
            <span
              class="error--text font-weight-black h6 mt-2"
              v-if="!item.status"
              >INATIVO</span
            >
            <span class="success--text font-weight-black h6 mt-2" v-else>
              ATIVO</span
            >
          </v-row>
          <v-row no-gutters class="mt-n6">
            <v-switch
              v-model="item.status"
              color="success"
              @change="updateStatus(item)"
            >
            </v-switch>
          </v-row>
        </template>
        <template v-slot:item.acao="{ item }">
          <v-icon color="warning" @click="editVendedor(item)">fa-edit</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      v-model="dialog"
      max-width="1200px"
      style="overflow-y: hidden"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="2">
                  <v-text-field
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.codigo"
                    label="Codigo"
                    hint="codigo do vendedor"
                    dense
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    class="uppercase"
                    required
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.nome"
                    label="Nome Vendedor"
                    dense
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    required
                    v-model="objectItem.celular"
                    v-mask="'(##) # ####-####'"
                    label="Celular"
                    dense
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-select
                    v-model="objectItem.status"
                    :items="[
                      { text: 'Inativo', value: 0 },
                      { text: 'Ativo', value: 1 },
                    ]"
                    label="status"
                    required
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="fechar()">Voltar</v-btn>
          <v-btn color="success" text @click="salvar()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <v-btn text @click="closeSnackbar()">Fechar</v-btn>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    search: "",
    filteredVendedores: [],
    headersVendedores: [
      { text: "Código", value: "codigo" },
      { text: "Nome", value: "nome" },
      { text: "Celular", value: "celular" },
      { text: "Status", value: "status" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    dialog: false,
    objectIndex: -1,
    objectItem: {
      codigo: "",
      nome: "",
      celular: "",
      status: 0,
    },
    valid: true,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getVendedores();
  },
  computed: {
    ...mapState({
      vendedores_varejo: (state) => state.vendedorVarejo.vendedores_varejo,

      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Vendedor" : "Editar Vendedor";
    },
  },
  methods: {
    ...mapActions([
      "get_vendedores_varejo",
      "create_vendedor_varejo",
      "update_vendedor_varejo",
      "update_status_vendedor_varejo",
    ]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign(
        {},
        {
          codigo: "",
          nome: "",
          celular: "",
          status: 0,
        }
      );
    },
    editVendedor(item) {
      this.objectIndex = this.vendedores_varejo.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialog = true;
    },
    async salvar() {
      if (this.$refs.form.validate()) {
        this.objectItem.nome = this.objectItem.nome.toUpperCase();
        this.objectItem.celular = this.objectItem.celular.replace(/\D/g, "");

        if (this.objectIndex > -1) {
          this.set_loading(true);
          await this.update_vendedor_varejo(this.objectItem);
          this.set_loading(false);
          this.fechar();
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
              msg: "Vendedor(a) editado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } else {
          this.set_loading(true);
          await this.create_vendedor_varejo(this.objectItem);
          this.set_loading(false);
          this.fechar();
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
              msg: "Vendedor criado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        }
        this.getVendedores();
      }
    },
    async updateStatus(item) {
      this.set_loading(true);
      await this.update_status_vendedor_varejo(item);
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
          msg: "Status editado com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getVendedores();
    },
    async getVendedores() {
      this.set_loading(true);
      await this.get_vendedores_varejo();
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
      this.filteredVendedores = this.vendedores_varejo;
    },
  },
};
</script>
