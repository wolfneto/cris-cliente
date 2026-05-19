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
          @change="onChangeSemestre()"
          v-model="selectedSemestre"
          :items="semestres"
          item-text="descri_semestre"
          item-value="id_semestre"
          label="Semestre"
        ></v-select>
      </v-col>
    </v-row>
    <v-data-table
      hide-default-footer
      :items-per-page="-1"
      :headers="headers"
      :items="kits"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Kits</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="flex-grow-1"></div>
          <v-dialog persistent v-model="dialog" width="90%">
            <template v-slot:activator="{ on }">
              <v-btn
                @click="openAdicionar()"
                :disabled="selectedSemestre == 0 ? true : false"
                color="primary"
                dark
                class="mb-2"
                v-on="on"
              >Adicionar Kit</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row class="custom-row">
                      <v-col cols="12">
                        <v-text-field
                          :rules="[v => !!v || 'Campo Obrigatório']"
                          v-model="objectItem.nome_kit"
                          label="Nome"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="custom-row">
                      <v-col cols="12">
                        <v-textarea
                          :rows="5"
                          no-resize
                          label="Descrição"
                          v-model="objectItem.descricao_kit"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row class="custom-row mt-12">
                      <v-col cols="12" md="5">
                        <v-radio-group
                          row
                          label="Status: "
                          v-model="objectItem.status_kit"
                          mandatory
                        >
                          <v-radio label="Ativo" :value="1"></v-radio>
                          <v-radio label="Inativo" :value="0"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Total"
                          readonly
                          prefix="R$ "
                          v-model="objectItem.total_kit"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-checkbox
                          @change="openModal()"
                          v-model="objectItem.pagamento_online"
                          label="Pagamento Online"
                        ></v-checkbox>
                        <v-dialog v-model="dialogAjustarFormas" width="500">
                          <v-card>
                            <v-card-title class="headline" primary-title>Formas de Pagamento</v-card-title>

                            <v-card-text>
                              <v-select
                                @change="onChangeParcelas()"
                                v-model="selectedParcela"
                                :items="parcelas"
                                label="Parcelas"
                              ></v-select>
                              <v-list dense>
                                <v-list-item-group color="primary">
                                  <v-list-item v-for="item in formasPagamento" :key="item.id">
                                    <v-list-item-content>
                                      <v-list-item-title v-text="item.tipo"></v-list-item-title>
                                      <money type="text" v-model="item.valor" v-bind="$money"></money>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                              <div class="flex-grow-1"></div>
                              <v-btn color="primary" text @click="dialogAjustarFormas = false">Ok</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                    </v-row>
                    <v-row class="mt-5">
                      <v-col cols="12">
                        <v-data-table
                          :headers="headersItensKit"
                          :items="itensKit"
                          hide-default-footer
                          class="elevation-1"
                        >
                          <template v-slot:item.codigo="{ item }">
                            <v-text-field
                              @keyup.13="getProduto($event.target.value, item)"
                              placeholder="Código"
                              v-model="item.codigo"
                            ></v-text-field>
                          </template>
                          <template v-slot:item.valor="{ item }">
                            <money
                              @change="calcTotalItens();"
                              @keyup.native="calcTotalItens();"
                              @click="calcTotalItens();"
                              @blur="calcTotalItens();"
                              @focus="calcTotalItens();"
                              type="text"
                              v-model="item.valor"
                              v-bind="$money"
                            ></money>
                          </template>
                          <template v-slot:item.acao="{ item }">
                            <v-icon color="primary" small class="mr-2" @click="addLinha()">fa-plus</v-icon>
                            <v-icon color="error" small @click="deleteLinha(item)">fa-trash-alt</v-icon>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error" text @click="fechar()">Voltar</v-btn>
                <v-btn color="success" text @click="salvar()">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.total_kit="{ item }">R$ {{item.total_kit.toFixed(2).replace('.', ',')}}</template>
      <template v-slot:item.itens="{ item }">
        <v-btn @click="showItemsKit(item.itens)">Itens</v-btn>
      </template>
      <template v-slot:item.status_kit="{ item }">
        <v-chip v-if="item.status_kit == 1" color="success" dark>Ativo</v-chip>
        <v-chip v-else color="error" dark>Inativo</v-chip>
      </template>
      <template v-slot:item.pagamento_online="{ item }">
        <v-chip v-if="item.pagamento_online == 1" color="success" dark>Sim</v-chip>
        <v-chip v-else color="error" dark>Não</v-chip>
      </template>
      <template v-slot:item.formas="{ item }">
        <v-btn
          v-if="item.pagamento_online == 1"
          v-model="dialogFormas"
          @click="showFormasPagamento(item.formas)"
        >Formas</v-btn>
      </template>
      <template v-slot:item.acao="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editKit(item)">fa-edit</v-icon>
        <v-icon color="error" small @click="deleteDialog(item)">fa-trash-alt</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogItens" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Itens</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Codigo</th>
                    <th class="text-left">Descrição</th>
                    <th class="text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="itemKit in itensKit" :key="itemKit.id">
                    <td>{{ itemKit.id }}</td>
                    <td>{{ itemKit.codigo }}</td>
                    <td>{{ itemKit.descricao }}</td>
                    <td>R$ {{ itemKit.valor.toFixed(2).replace('.', ',') }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogItens = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogShowFormasPagamento" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Formas de Pagamento</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Parcela</th>
                    <th class="text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="forma in arrayShowFormasPagamento" :key="forma.id">
                    <td v-if="forma.parcela == 0">Boleto</td>
                    <td v-else>{{forma.parcela}}x</td>
                    <td>R$ {{ forma.valor.toFixed(2).replace('.', ',') }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogShowFormasPagamento = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogExcluir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Atenção!</v-card-title>
        <v-card-text>Deseja realmente excluir o kit?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">Não</v-btn>
          <v-btn color="error" text @click="deleteKit(objectItem)">Excluir</v-btn>
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    arrayShowFormasPagamento: [],
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    dialogFormas: false,
    dialogAjustarFormas: false,
    dialogItens: false,
    dialogExcluir: false,
    dialogShowFormasPagamento: false,
    loading: false,
    headers: [
      { text: "ID", value: "id_kit" },
      { text: "Nome", value: "nome_kit" },
      { text: "Descrição", value: "descricao_kit" },
      { text: "Itens", value: "itens" },
      { text: "Total", value: "total_kit" },
      { text: "Status", value: "status_kit" },
      { text: "Pgto Online", value: "pagamento_online" },
      { text: "Pgto Formas", value: "formas" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    kits: [],
    selectedSemestre: 0,
    semestres: [],
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    dialog: false,
    objectIndex: -1,
    objectItem: {
      id_kit: 0,
      nome_kit: "",
      descricao_kit: "",
      status_kit: "0",
      total_kit: 0,
      pagamento_online: 0,
    },
    defaultItem: {
      id_kit: 0,
      nome_kit: "",
      descricao_kit: "",
      status_kit: "0",
      total_kit: 0,
      pagamento_online: 0,
    },
    headersItensKit: [
      { text: "Código", value: "codigo", width: 200 },
      { text: "Saldo", value: "saldo" },
      { text: "Descrição", value: "descricao" },
      { text: "Valor", value: "valor" },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    itensKit: [],
    formasPagamento: [],
    selectedParcela: 10,
    parcelas: [
      {
        value: 1,
        text: "1x",
      },
      {
        value: 2,
        text: "2x",
      },
      {
        value: 3,
        text: "3x",
      },
      {
        value: 4,
        text: "4x",
      },
      {
        value: 5,
        text: "5x",
      },
      {
        value: 6,
        text: "6x",
      },
      {
        value: 7,
        text: "7x",
      },
      {
        value: 8,
        text: "8x",
      },
      {
        value: 9,
        text: "9x",
      },
      {
        value: 10,
        text: "10x",
      },
    ],
    valorTotal: 0,
    valid: false,
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
  },
  computed: {
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Kit" : "Editar Kit";
    },
  },
  methods: {
    openAdicionar() {
      this.itensKit.push({
        id: "",
        codigo: "",
        qtd: 1,
        descricao: "",
        valor: 0,
        saldo: "",
      });
    },
    onChangeParcelas() {
      this.formasPagamento = [];
      this.formasPagamento.push({
        id: 0,
        tipo: "Boleto",
        valor: this.valorTotal,
      });
      for (let i = 1; i <= this.selectedParcela; i++) {
        this.formasPagamento.push({
          id: i,
          tipo: "Valor em até: " + i + "x",
          valor: this.valorTotal,
        });
      }
    },
    openModal() {
      this.formasPagamento = [];
      if (this.objectItem.pagamento_online) {
        this.dialogAjustarFormas = true;
        this.formasPagamento.push({
          id: 0,
          tipo: "Boleto",
          valor: this.valorTotal,
        });
        for (let i = 1; i <= this.selectedParcela; i++) {
          this.formasPagamento.push({
            id: i,
            tipo: "Valor em até: " + i + "x",
            valor: this.valorTotal,
          });
        }
      }
    },
    addLinha() {
      let item = {
        id: this.itensKit.length,
        codigo: "",
        qtd: 1,
        descricao: "",
        valor: 0,
        saldo: 0,
      };
      this.itensKit.push(item);
    },
    deleteLinha(item) {
      if (item.id != 0) {
        this.itensKit = this.itensKit.filter(function (element) {
          return element.id != item.id;
        });

        for (let i = 0; i < this.itensKit.length; i++) {
          this.$set(this.itensKit[i], "id", i);
        }
        this.calcTotalItens();
      }
    },
    getProduto(value, item) {
      if (value) {
        this.$axios
          .get("/produto/getByCod", {
            params: {
              cod: value,
            },
          })
          .then((res) => {
            if (res.data != false) {
				console.log(res.data);
              item.codigo = res.data.codigo;
              item.descricao = res.data.descricao;
              item.valor = res.data.valor;
              item.saldo = res.data.saldo;
              this.calcTotalItens();
            } else {
              this.showSnakerbar("Produto Não Encontrado!", "warning", 3000);
            }
          })
          .catch((err) => {
            console.log(err);
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          });
      }
    },
    calcTotalItens() {
      let total = 0;

      this.itensKit.forEach((item) => {
        total += parseFloat(item.valor);
      });

      this.objectItem.total_kit = total.toFixed(2).replace(".", ",");
      this.valorTotal = total.toFixed(2).replace(".", ",");
    },
    fechar() {
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign({}, this.defaultItem);
      this.itensKit = [];
      this.valorTotal = 0;
    },
    salvar() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.objectIndex > -1) {
          this.$axios
            .put("/kit", {
              kit: this.objectItem,
              itensKit: this.itensKit,
              formasPagamento: this.formasPagamento,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
            })
            .then((res) => {
              this.loading = false;
              if (res.data) {
                this.fechar();
                this.onChangeSemestre();
                this.showSnakerbar("Kit Editado Com Sucesso!", "success", 3000);
              } else {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        } else {
          this.$axios
            .post("/kit", {
              kit: this.objectItem,
              itensKit: this.itensKit,
              formasPagamento: this.formasPagamento,
              id_faculdade: this.selectedFaculdade,
              id_semestre: this.selectedSemestre,
            })
            .then((res) => {
              this.loading = false;
              if (res.data) {
                this.fechar();
                this.onChangeSemestre();
                this.showSnakerbar(
                  "Kit Adicionado Com Sucesso!",
                  "success",
                  3000
                );
              } else {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      }
    },
    editKit(item) {
      this.objectIndex = this.kits.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.formasPagamento = this.objectItem.formas;
      this.itensKit = this.objectItem.itens;
      this.objectItem.total_kit = this.objectItem.total_kit
        .toFixed(2)
        .replace(".", ",");
      this.valorTotal = this.objectItem.total_kit;
      this.dialog = true;
    },
    deleteDialog(item) {
      this.objectIndex = this.kits.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    deleteKit() {
      this.dialogExcluir = false;
      this.loading = true;
      this.$axios
        .delete("/kit", {
          data: {
            id: this.objectItem.id_kit,
          },
        })
        .then((res) => {
          this.onChangeSemestre();
          this.loading = false;
          if (res.data) {
            this.showSnakerbar("Kit Deletado Com Sucesso!", "success", 3000);
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    onChange(){
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.semestres = [];
      this.kits = [];
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.kits = [];
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
    onChangeSemestre() {
      this.$axios
        .get("/kit/findallbyfaculdadesemestre", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre,
          },
        })
        .then((res) => {  
          this.kits = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
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
    showItemsKit(itensKit) {
      this.itensKit = itensKit;
      this.dialogItens = true;
    },
    showFormasPagamento(formasPagamento) {     
      this.arrayShowFormasPagamento = formasPagamento;
      this.dialogShowFormasPagamento = true;
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
  },
};
</script>
<style scoped>
</style>