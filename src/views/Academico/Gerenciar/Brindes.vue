<template>
  <v-container>
    <Tabs></Tabs>
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">
        <v-autocomplete
          auto-select-first
          autofocus
          v-model="selectedFaculdade"
          :items="faculdades"
          item-text="nome_exibicao_faculdade"
          item-value="id_faculdade"
          label="Faculdade"
          @change="onChange()"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedPosGraduacao"
          @change="onChangeGraduacao()"
          :items="[
            { text: 'Graduação', value: 0 },
            { text: 'Especialização', value: 1 },
          ]"
          label="Graduação ou Especialização"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" class="custom-row">
      <v-col cols="12" md="6">
        <v-select
          @change="onChangeSemestre(selectedSemestre)"
          v-model="selectedSemestre"
          :items="semestres"
          item-text="descri_semestre"
          item-value="id_semestre"
          label="Semestre"
        ></v-select>
      </v-col>
    </v-row>

    <v-card width="auto">
      <v-container fluid>
        <div class="ma-2 text-right">
          <v-btn
            :disabled="!selectedSemestre"
            class="mt-n3"
            color="primary"
            @click="adicionarBrinde()"
          >
            Adicionar
          </v-btn>
        </div>
        <q-virtual-scroll
          class="my-sticky-dynamic"
          type="table"
          dense
          style="max-height: 70vh"
          virtual-scroll
          :virtual-scroll-slice-size="30"
          :virtual-scroll-item-size="47"
          :virtual-scroll-sticky-size-start="48"
          :virtual-scroll-sticky-size-end="32"
          :items="brindes"
        >
          <template v-slot:before>
            <thead class="thead-sticky text-left">
              <tr>
                <th v-for="col in headers" :key="'1--' + col.name">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot="{ item: row, index }">
            <tr :key="index">
              <td v-for="col in headers" :key="index + '-' + col.name">
                <div v-if="col.name == 'id'">{{ row.id }}</div>
                <div v-if="col.name == 'criado_em'" style="width: auto"><b>{{ row.criado_em }}</b></div>
                <div v-if="col.name == 'nome'" style="width: 90%">{{ row.nome }}</div>
                <div v-if="col.name == 'descricao'" style="width: 90%">{{ row.descricao }}</div>
                <div v-if="col.name == 'valor_desbloqueio'" style="width: 120%">
                 R$ {{ row.valor_desbloqueio }}
                </div>

                <div v-if="col.name == 'status'" style="width: 100%">
                  <v-chip v-if="row.status == 1" color="success" dark
                    ><b>Ativo</b></v-chip
                  >
                  <v-chip v-else color="error" dark><b>Inativo</b></v-chip>
                </div>

                <div v-if="col.name == 'acao'" style="width: 70%">
                  <div class="row justify-center">
                    <div class="col-4">
                      <v-btn
                        small
                        class="ma-1"
                        color="gray"
                        icon
                        @click="editarAdicionar(row)"
                      >
                        <v-icon dark>fas fa-edit</v-icon>
                      </v-btn>
                    </div>
                    <div class="col-4">
                      <v-btn small class="ma-1" color="error" icon
                        @click="deleteDialog(row)"
                      >
                        <v-icon dark>fa-trash-alt</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </q-virtual-scroll>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" persistent width="90%">
      <v-card>
        <v-card-title
          ><span class="text-h5">{{ formTitle }}</span></v-card-title
        >
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row class="custom-row">
                <v-col cols="2">
                  <v-text-field
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.nome"
                    label="Nome"
                    class="uppercase"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :rules="[(v) => !!v || 'Campo Obrigatório']"
                    v-model="objectItem.descricao"
                    label="Descrição"
                    class="uppercase"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <money
                    maxlength="10"
                    class="form-control font-weight-bold text-center"
                    style="width: 75% ; height: 50%"
                    v-model="objectItem.valor_desbloqueio"
                    v-bind="$money"
                  ></money>
                </v-col>
                <v-col cols="4">
                  <v-switch class="mt-n2" v-model="objectItem.status" inset>
                    <template v-slot:label>
                      <v-alert
                        v-if="objectItem.status == false"
                        dense
                        type="error"
                        text
                        class="mt-4"
                      >
                        Status INATIVO
                      </v-alert>
                      <v-alert v-else dense type="success" text class="mt-4">
                        Status ATIVO
                      </v-alert>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>

              <v-row class="mt-10">
                <v-col cols="12">
                  <v-data-table
                    :headers="headersBrindesMarcas"
                    :items="objectItem.brindes_marcas"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:item.codigo="{ item }">
                      <v-text-field
                        @keyup.13="getProduto($event.target.value, item)"
                        placeholder="Codigo"
                        v-model="item.codigo"
                        class="uppercase"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.descricao="{ item }">
                      <v-text-field
                        placeholder="Descrição"
                        v-model="item.descricao"
                        class="uppercase"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.valor="{ item }">
                      <money
                        type="text"
                        v-model="item.valor"
                        v-bind="$money"
                      ></money>
                    </template>
                    <template v-slot:item.img_path="{ item }">
                      <v-btn
                        :disabled="!item.img_path"
                        class="ma-0 ml-4"
                        color="primary"
                        icon
                        large
                        @click="showImage($event, item.img_path)"
                      >
                        <v-icon dark>fas fa-camera</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:item.acao="{ item }">
                      <v-icon
                        color="primary"
                        small
                        class="mr-2"
                        @click="addLinha()"
                        >fa-plus</v-icon
                      >
                      <v-icon color="error" small @click="deleteLinha(item)"
                        >fa-trash-alt</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="fechar()">Voltar</v-btn>
          <v-btn :disabled="!valid" color="primary" text @click="salvar()"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluir" persistent max-width="450">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text class="h5"
          >Deseja realmente excluir este Brinde?<br />
          <div class="ma-4 text-center">{{ this.objectItem.nome }}</div>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="excluirBrinde(objectItem)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu
      v-model="showMenuImage"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="true"
      :close-on-click="true"
    >
      <v-card>
        <img v-bind:src="`${urlImg}`" width="300" height="250" />
      </v-card>
    </v-menu>
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    headers: [
      {
        name: "id",
        align: "left",
        label: "Id",
        sortable: true,
      },
      {
        name: "criado_em",
        align: "left",
        label: "Data",
        sortable: true,
      },
      {
        name: "nome",
        align: "left",
        label: "Nome",
        sortable: true,
      },
      {
        name: "descricao",
        align: "left",
        label: "Descrição",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        sortable: true,
      },
      {
        name: "valor_desbloqueio",
        align: "center",
        label: "Valor",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "Ação",
        sortable: false,
      },
    ],
    headersBrindesMarcas: [
      { text: "Código", value: "codigo", width: 30 },
      { text: "Descrição", value: "descricao", width: 250 },
      { text: "Valor", value: "valor", width: 20 },
      { text: "Imagem", value: "img_path", width: 20 },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 50,
      },
    ],
    selectedSemestre: 0,
    semestres: [],
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    dialog: false,
    dialogExcluir: false,
    objectIndex: -1,
    objectItem: {},
    valid: false,
    showMenuImage: false,
    x: 0,
    y: 0,
    urlImg: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },
  computed: {
    ...mapState({
      permissoes: (state) => state.gerenciarBrindes.brinde,
      brinde: (state) => state.gerenciarBrindes.brinde,
      brindes: (state) => state.gerenciarBrindes.brindes,
      produto: (state) => state.gerenciarBrindes.produto,
      error: (state) => state.gerenciarBrindes.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Brinde" : "Editar Brinde";
    },
  },
  methods: {
    ...mapActions(["get_brindes", "get_produto", "salvar_brinde", "deletar_brinde"]),
    ...mapMutations(["set_snackbar", "set_loading", "set_reset_brindes"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = {};
    },
    async salvar() {        
      let checked = true;
      if (this.$refs.form.validate()) {
        this.objectItem.brindes_marcas.forEach((item) => {
          if (
            item.codigo.length <= 0 ||
            item.descricao.length <= 0 ||
            item.valor == 0
          ) {
            checked = false;
          }
        });
        if (!checked) {
          this.set_snackbar({
            show: true,
            msg: "Os campos CODIGO, DESCRIÇÃO e VALOR não podem ser vazios!",
            type: "warning",
            time: 3000,
          });
        } else {
            this.set_loading(true);

		  if (this.objectIndex > -1) {
			  this.objectItem.modificado_em = new Date();
			  this.objectItem.modificado_por = this.$usuario.value.usuario.toUpperCase();
		  }else{       
			this.objectItem.criado_por = this.$usuario.value.usuario.toUpperCase();
		  }
			  this.objectItem.id_semestre = this.selectedSemestre;
        this.objectItem.nome = this.objectItem.nome.toUpperCase();
        this.objectItem.descricao = this.objectItem.descricao.toUpperCase();

          await this.salvar_brinde(this.objectItem);
            this.fechar();
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
                msg: "Salvo com sucesso!",
                type: "success",
                time: 3000,
              });
            }
        }
      }
        this.onChangeSemestre(this.selectedSemestre);
    },    
    adicionarBrinde() {
      this.objectIndex = -1;
      this.objectItem = JSON.parse(JSON.stringify(this.brinde));
      this.dialog = true;
    },
    editarAdicionar(row) {
      this.objectIndex = this.brindes.indexOf(row);
      this.objectItem = JSON.parse(JSON.stringify(row));
      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.brindes.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
   async excluirBrinde(item) {    
      this.set_loading(true);

      await this.deletar_brinde(item);

      this.set_loading(false);
      this.dialogExcluir = false;

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      } else {
        this.onChangeSemestre(this.selectedSemestre);        
      }      
    },
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.set_reset_brindes();
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.set_reset_brindes();
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade,
            graduacao: this.selectedPosGraduacao,
          },
        })
        .then((res) => {
          this.semestres = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async onChangeSemestre(value) {
      this.set_loading(true);
      await this.get_brindes(value);
      this.set_loading(false);

      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
    },
    addLinha() {    
      let item = {
        id: this.objectItem.brindes_marcas.length,
        id_brinde: this.objectItem.id,
        codigo: "",
        descricao: "",
        img_path: null,
        valor: 0,
      };
      this.objectItem.brindes_marcas.push(item);
    },
    deleteLinha(item) {
      if (item.id != 0) {
        this.objectItem.brindes_marcas = this.objectItem.brindes_marcas.filter(
          function (element) {
            return element.id != item.id;
          }
        );
        for (let i = 0; i < this.objectItem.brindes_marcas.length; i++) {
          this.$set(this.objectItem.brindes_marcas[i], "id", i);
        }
      }
    },
    async getProduto(value, item) {
      if (value) {
        this.set_loading(true);
        await this.get_produto(value);
        this.set_loading(false);

        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        } else {
          if (Object.keys(this.produto).length == 0) {
            item.descricao = "";
            item.valor = "";
            item.img_path = null;

            this.set_snackbar({
              show: true,
              msg: "Codigo informado não existe!",
              type: "warning",
              time: 3000,
            });
          } else {
            item.codigo = this.produto.codigo.toUpperCase();
            item.descricao = this.produto.descricao;
            item.valor = this.produto.valor;
            item.img_path = this.produto.image_path;
          }
        }
      }
    },
    showImage(e, img) {
      e.preventDefault();
      this.showMenuImage = false;
      this.x = e.clientX;
      this.y = e.clientY;

      this.urlImg = this.getUrl(img);

      this.$nextTick(() => {
        this.showMenuImage = true;
      });
    },
    getUrl(img) {
      return require("@/assets/produtos/" + img);
    },
    getFacudades() {
      this.$axios
        .get("/faculdades")
        .then((res) => {
          this.faculdades = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
</style>