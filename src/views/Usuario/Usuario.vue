<template>
  <v-container>
    <v-card>
      <v-card-title>
        Usuários
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        locale="pt-PT"
        :loading="loading"
        loading-text="Carregando... Espere por favor"
        :headers="headers"
        :search="search"
        :items="usuarios"
        :items-per-page="10"
        :no-data-text="'Nenhum usuário encontrado'"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50, 100],
          itemsPerPageText: 'Usuários por pagina',
        }"
        class="elevation-1"
      >
        <template v-slot:item.acao="{ item }">
          <v-btn text color="primary" @click="confirmFaculdades(item)"
            ><v-icon left>fa-graduation-cap</v-icon> Faculdades</v-btn
          >
          <v-btn text color="primary" @click="confirmPaginas(item)"
            ><v-icon left>fa-user-lock</v-icon> Permissões</v-btn
          >
          <v-btn text color="warning" @click="showDialogAlterarSenha(item)"
            ><v-icon left>fa-key</v-icon> Alterar Senha</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogFaculdades" persistent max-width="600">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogFaculdades = false">
            <v-icon>fa-window-close</v-icon>
          </v-btn>
          <v-toolbar-title>Faculdades</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn dark text @click="salvarFaculdades()">Salvar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list dense>
          <v-list-item v-for="faculdade in faculdades" :key="faculdade.id">
            <v-checkbox
              v-if="faculdade.status == true"
              checked
              v-model="faculdade.status"
              :label="faculdade.nome_exibicao_faculdade"
            ></v-checkbox>
            <v-checkbox
              v-else
              v-model="faculdade.status"
              :label="faculdade.nome_exibicao_faculdade"
            ></v-checkbox>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPaginas"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogPaginas = false">
            <v-icon>fa-window-close</v-icon>
          </v-btn>
          <v-toolbar-title>Paginas</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn dark text @click="salvarPermissoes()">Salvar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row>
          <v-col cols="12" md="3">
            <v-list dense>
              <v-list-item v-for="pagina in paginas" :key="pagina.id">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-checkbox
                      v-if="pagina.status == true"
                      checked
                      v-model="pagina.status"
                      :label="pagina.nome_pagina"
                    ></v-checkbox>
                    <v-checkbox
                      v-else
                      v-model="pagina.status"
                      :label="pagina.nome_pagina"
                    ></v-checkbox>
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon @click="buscarPermissoesPagina(pagina)"
                    >fa-arrow-right</v-icon
                  >
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
      <v-dialog v-model="dialogPermissao" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Permissões</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="permissao in permissoes" :key="permissao.id">
                <v-list-item-content>
                  <v-list-item-title>
                    <div v-if="permissao.campo == 'margem_preco'">
                      <v-text-field
                        v-model="permissao.status"
                        :rules="[(v) => !!v || 'Campo Obrigatório']"
                        :label="permissao.campo"
                        required
                      ></v-text-field>
                    </div>
                    <div v-else>
                      <v-checkbox
                        v-if="permissao.status == 1"
                        checked
                        v-model="permissao.status"
                        :label="permissao.campo"
                      ></v-checkbox>
                      <v-checkbox
                        v-else
                        v-model="permissao.status"
                        :label="permissao.campo"
                      ></v-checkbox>
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" text @click="dialogPermissao = false"
              >Voltar</v-btn
            >
            <v-btn color="success" text @click="salvarPermissoes()"
              >Salvar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
    <v-dialog v-model="dialogAlterarSenha" max-width="600">
      <v-card>
        <v-card-title class="headline">Alterar Senha</v-card-title>
        <v-card-text>
          <v-text-field
            autocomplete="off"
            type="search"
            autofocus
            v-model="novaSenha"
            @keyup.enter="alterarSenha()"
            label="Nova Senha"
          ></v-text-field>
        </v-card-text>
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
  </v-container>
</template>
<script>
export default {
  data: () => ({
    paginas: [],
    permissoes: [],
    faculdades: [],
    dialogFaculdades: false,
    dialogPaginas: false,
    dialogPermissao: false,
    dialogAlterarSenha: false,
    objectIndex: -1,
    objectItem: {},
    search: "",
	novaSenha: "",
    usuarios: [],
    loading: false,
    headers: [
      {
        text: "Nome",
        sortable: true,
        value: "nome",
      },
      {
        text: "Usuário",
        sortable: true,
        value: "usuario",
      },
      {
        text: "Criado Em",
        sortable: true,
        value: "criado_em",
      },
      {
        text: "Ação",
        align: "center",
        value: "acao",
      },
    ],
    typeSnackbar: "",
    timeSnackbar: 0,
    msgSnackbar: "",
    snackbar: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getUsuarios();
  },

  methods: {
	showDialogAlterarSenha(item) {
		this.dialogAlterarSenha = true;
		this.objectItem = {... item};
		this.dialogAlterarSenha = true;
	},
    alterarSenha() {
		this.objectItem.novaSenha = this.novaSenha;
		this.$axios
		.post("/usuario/alterarSenha", {
			usuario: this.objectItem
		}).then((res) =>{
			console.log(res.data);
		}).catch((err) => {
			console.log(err);
		})
	},
    salvarPermissoes() {
      this.$axios
        .post("/usuario/permissao/salvar", {
          id_usuario: this.objectItem.id,
          permissoes: this.permissoes,
          paginas: this.paginas,
        })
        .then((res) => {
          console.log(res.data);
          this.msgSnackbar = "Alterações Feitas Com Sucesso!";
          this.typeSnackbar = "success";
          this.snackbar = true;
          this.timeSnackbar = 2000;
          this.dialogPermissao = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    buscarPermissoesPagina(pagina) {
      if (pagina.status == true) {
        this.$axios
          .get("/usuario/permissao/pagina", {
            params: {
              id_usuario: this.objectItem.id,
              pagina: pagina.nome_pagina,
            },
          })
          .then((res) => {
            console.log(res.data);
            this.permissoes = [];
            for (var key in res.data) {
              this.permissoes.push({
                campo: key,
                status: res.data[key],
                pagina: pagina.nome_pagina,
              });
            }
            // remove os 2 primeiros registros, pois sao id e id_usuario
            this.permissoes.shift();
            this.permissoes.shift();
            this.dialogPermissao = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.permissoes = [];
      }
    },
    confirmPaginas(item) {
      this.objectIndex = this.usuarios.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogPaginas = true;
      this.getPaginas();
    },
    getPaginas() {
      this.$axios
        .get("/paginas", {
          params: {
            id_usuario: this.objectItem.id,
          },
        })
        .then((res) => {
          this.paginas = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    salvarFaculdades() {
      this.$axios
        .post("/usuario/permissao/faculdade/salvar", {
          id_usuario: this.objectItem.id,
          faculdades: this.faculdades,
        })
        .then((res) => {
          console.log(res.data);
          this.msgSnackbar = "Alterações Feitas Com Sucesso!";
          this.typeSnackbar = "success";
          this.snackbar = true;
          this.timeSnackbar = 2000;
          this.dialogFaculdades = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmFaculdades(item) {
      this.objectIndex = this.usuarios.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogFaculdades = true;
      this.getFaculdades();
    },
    getFaculdades() {
      this.$axios
        .get("/usuario/permissao/faculdades", {
          params: {
            id_usuario: this.objectItem.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.faculdades = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUsuarios() {
      this.loading = true;
      this.$axios
        .get("/usuarios")
        .then((res) => {
          this.usuarios = res.data;
          console.log(res.data);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
  },
};
</script>