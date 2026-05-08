<template>
  <v-container>
    <v-tabs grow icons-and-text class="mb-5">
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        @click="divInseridoResgatados = true ; divResgatesGeral = false ; divRelatorioGeral = false"
      >
        Pontos Inseridos/Resgatados
        <v-icon>fa-search-dollar</v-icon>
      </v-tab>

      <v-tab
        @click="divResgatesGeral = true ; divInseridoResgatados = false ; divRelatorioGeral = false"
      >
        Resgates Geral
        <v-icon>fa-dollar-sign</v-icon>
      </v-tab>

      <v-tab
        @click="divRelatorioGeral = true ; divInseridoResgatados = false ; divResgatesGeral = false"
      >
        Pontos Geral
        <v-icon>fa-chart-line</v-icon>
      </v-tab>
    </v-tabs>
    <div v-if="divInseridoResgatados">
      <v-row justify="center" class="custom-row">
        <v-col cols="4">
          <v-text-field
            v-mask="'###.###.###-##'"
            v-model="cpf"
            label="CPF"
            v-on:keydown.enter="buscarAluno()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="buscarAluno()">Buscar</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn v-if="aluno !== null" @click="dialogInserir = true" color="success">Inserir Pontos</v-btn>
        </v-col>
      </v-row>
      <!-- <br />
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
      <br />

      <div class="input-group input-group-sm mb-2 ml-3">
        <button type="button" class="btn btn-primary" @click="submitFile()">Importar</button>
      </div>-->
      <v-row v-if="aluno !== null" justify="center" class="custom-row">
        <v-col cols="4">
          <v-text-field filled readonly v-model="aluno.nome" label="Nome"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field filled readonly v-model="aluno.email" label="Email"></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-text-field filled readonly v-model="aluno.pontos" label="Pontos"></v-text-field>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-title>
          Resgates
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchResgates"
            append-icon="fa-search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :items-per-page="5"
          :footer-props="{
					itemsPerPageOptions: [5, 10, 30, -1],
					itemsPerPageText: 'Resgates por pagina',
					}"
          no-data-text="Nenhum resgate feito"
          sort-by="create_at"
          sort-desc
          :headers="headersResgates"
          :items="resgates"
          :search="searchResgates"
        >
          <template v-slot:item.status="{ item }">
            <span v-if="item.status" class="success--text">DiponÃ­vel</span>
            <span v-else class="error--text">Utilizado</span>
          </template>
          <template v-slot:item.acao="{ item }">
            <v-btn v-if="item.status" small color="primary" @click="validar(item)">
              <i class="fas fa-check mr-2"></i> Validar
            </v-btn>
            <v-btn
              v-else-if="permissoes.restaurar_voucher"
              small
              color="warning"
              @click="restaurar(item)"
            >
              <i class="fas fa-times mr-2"></i> Restaurar
            </v-btn>
            <v-btn class="ml-2" v-if="item.status" small color="error" @click="excluir(item)">
              <i class="fas fa-times mr-2"></i> Excluir
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-divider class="ma-5"></v-divider>
      <v-card>
        <v-card-title>
          Inseridos
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchInseridos"
            append-icon="fa-search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :items-per-page="5"
          :footer-props="{
					itemsPerPageOptions: [5, 10, 30, -1],
					itemsPerPageText: 'InserÃ§Ãµes por pagina',
					}"
          no-data-text="Nenhum ponto inserido"
          sort-by="inserido_em"
          sort-desc
          :headers="headersInseridos"
          :items="inseridos"
          :search="searchInseridos"
        >
          <template v-slot:item.expirado="{ item }">
            <span class="error--text" v-if="item.expirado">Sim</span>
            <span class="primary--text" v-else>NÃ£o</span>
          </template>
          <template v-slot:item.acao="{ item }">
            <v-btn small color="warning" @click="remover(item)">
              <i class="fas fa-times mr-2"></i> Remover
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <div v-if="divResgatesGeral">
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="6">
          <v-select
            @change="onChangeSelect()"
            v-model="selectedFaculdade"
            :items="faculdades"
            item-text="nome_exibicao_faculdade"
            item-value="id_faculdade"
            label="Faculdade"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="6">
          <v-select
            @change="onChangeSemestreSelect()"
            v-model="selectedSemestre"
            :items="semestres"
            item-text="descri_semestre"
            item-value="id_semestre"
            label="Semestre"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="6">
          <v-select
            @change="onChangePeriodoSelect()"
            v-model="selectedPeriodo"
            :items="periodos"
            item-text="nome_periodo"
            item-value="id_periodo"
            label="Periodo"
          ></v-select>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          Resgates Gerais -
          <v-btn class="ml-2" @click="imprimir()" color="primary" small>Imprimir</v-btn>
          <v-btn
            class="ml-2"
            @click="relatorioGeralResgates()"
            color="primary"
            small
          >Gerar Relatorio Geral Resgates</v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-if="geral.length"
            v-model="searchGeral"
            append-icon="fa-search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <v-text-field
            v-if="arrayResgatesGeral.length"
            v-model="searchResgatesGeral"
            append-icon="fa-search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-if="geral.length"
          dense
          :items-per-page="50"
          :footer-props="{
					itemsPerPageOptions: [50, -1],
					itemsPerPageText: 'Resgates por pagina',
					}"
          no-data-text="Nenhum resgate feito"
          sort-by="create_at"
          sort-desc
          :headers="headersGeral"
          :items="geral"
          :search="searchGeral"
        >
        <template v-slot:item.status="{ item }">
          <span v-if="item.status == '1'" class="green--text">Disponivel</span>
          <span v-if="item.status == '0'" class="red--text">Utilizado</span>
        </template>
          <template v-slot:item.cpf_aluno="{ item }">
            {{item.nome}}
            <br />
            {{item.cpf_aluno}}
          </template>
          <!-- <template v-slot:item.nome_exibicao_faculdade="{ item }">
						{{item.nome_exibicao_faculdade}}
						<br />
						{{item.descri_semestre}}
						<br />
						{{item.nome_periodo}}
          </template>-->
        </v-data-table>
        <v-data-table
          v-if="arrayResgatesGeral.length"
          dense
          :items-per-page="20"
          :footer-props="{
					itemsPerPageOptions: [20, -1],
					itemsPerPageText: 'Resgates por pagina',
					}"
          no-data-text="Nenhum resgate feito"
          sort-by="create_at"
          sort-desc
          :headers="headersResgatesGeral"
          :items="arrayResgatesGeral"
          :search="searchResgatesGeral"
        >
        <template v-slot:item.status="{ item }">
          <span v-if="item.status == '1'" class="green--text">Disponivel</span>
          <span v-if="item.status == '0'" class="red--text">Utilizado</span>
        </template>

          <template v-slot:item.cpf_aluno="{ item }">
            {{item.nome}}
            <br />
            {{item.cpf_aluno}}
          </template>
          <!-- <template v-slot:item.nome_exibicao_faculdade="{ item }">
						{{item.nome_exibicao_faculdade}}
						<br />
						{{item.descri_semestre}}
						<br />
						{{item.nome_periodo}}
          </template>-->
        </v-data-table>
      </v-card>
    </div>

    <div v-if="divRelatorioGeral">
      <v-card>
        <v-card-title>
          RelatÃ³rio Geral -
          <v-btn class="primary ml-2" @click="relatorioGeralPontos()" small>Gerar RelatÃ³rio Geral Pontos</v-btn>
          <v-btn v-if="pontosGeral.length > 0" class="success ml-2" @click="excel()" small>Gerar Excel</v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
        <template>
          <v-data-table
            class="text-uppercase"
            :headers="headerPontosGeral"
            :items="pontosGeral"
            :expanded.sync="expanded"
            item-key="cpf"
            no-data-text="nenhum ponto"
            :items-per-page="15"
            :footer-props="{
            itemsPerPageOptions: [15, -1],
           itemsPerPageText: 'Pontos Alunos pagina',
            }"
            show-expand
            dense
          >
            <template v-slot:item.aluno="{ item }">
              <p class="mt-2">{{item.nome}} {{item.sobrenome}}</p>
            </template>

            <template v-slot:expanded-item="{ item }">
              <v-banner class="ma-0" width="720%">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="caption text-left" width="10%">Pontos</th>
                        <th class="caption text-left">Expiram em</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="iten in item.pontosInseridos" :key="iten.id">
                        <td class="caption text-left">
                          <b>{{ iten.pontos }}</b>
                        </td>
                        <td class="caption text-left">
                          <b v-if="iten.expira_em <= 0" class="red--text">0 Dias - Expirado</b>
                          <b v-else>{{ iten.expira_em }} Dias</b>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-banner>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </div>

    <div style="display:none" id="print">
      <h3
        v-if="geral.length > 0"
      >RelatÃ³rio de Resgates {{geral[0].nome_exibicao_faculdade}} - {{geral[0].descri_semestre}} - {{geral[0].nome_periodo}}</h3>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Codigo</th>
            <th scope="col">Produto</th>
            <th scope="col">Status</th>
            <th scope="col">Aluno</th>
            <th scope="col">Faculdade</th>
            <th scope="col">Resgatado Em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in geral" v-bind:key="index">
            <td>{{item.id}}</td>
            <td>{{item.nome_produto}}</td>
             <td v-if="item.status == '1'" class="green--text">Disponivel</td>
            <td v-if="item.status == '0'" class="red--text">Utilizado</td>
            <td>
              {{item.nome}}
              <br />
              {{item.cpf_aluno}}
            </td>
            <td>
              {{item.nome_exibicao_faculdade}}
              <br />
              {{item.descri_semestre}}
              <br />
              {{item.nome_periodo}}
            </td>
            <td>{{item.create_at}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="display:none" id="print2">
      <h3
        v-if="arrayResgatesGeral.length > 0"
      >RelatÃ³rio de Resgates Geral</h3>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Codigo</th>
            <th scope="col">Produto</th>
            <th scope="col">Status</th>
            <th scope="col">Aluno</th>
            <th scope="col">Faculdade</th>
            <th scope="col">Resgatado Em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in arrayResgatesGeral" v-bind:key="index">
            <td>{{item.id}}</td>
            <td>{{item.nome_produto}}</td>
            <td v-if="item.status == '1'" class="green--text">Disponivel</td>
            <td v-if="item.status == '0'" class="red--text">Utilizado</td>
            <td>
              {{item.nome}}
              <br />
              {{item.cpf_aluno}}
            </td>
            <td>
              {{item.nome_exibicao_faculdade}}
              <br />
              {{item.descri_semestre}}
              <br />
              {{item.nome_periodo}}
            </td>
            <td>{{item.create_at}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-dialog v-model="dialogInserir" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Inserir Pontos</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row justify="center" class="mt-5">
                <v-col cols="12">
                  <v-text-field v-mask="'######'" maxlength="6" v-model="pontos" label="Pontos"></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field v-mask="'##/##/####'" maxlength="10" v-model="data" label="Data"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogInserir = false">Voltar</v-btn>
          <v-btn color="success" @click="inserirPontos()">Inserir</v-btn>
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
export default {
  data: () => ({
    permissoes: {},
    valid: true,
    pontos: "",
    data: "",
    dialogInserir: false,
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    searchResgates: "",
    searchInseridos: "",
    searchGeral: "",
    divInseridoResgatados: false,
    divResgatesGeral: false,
    divRelatorioGeral: false,
    resgates: [],
    inseridos: [],
    geral: [],
    aluno: null,
    cpf: "",
    headersResgates: [
      { text: "Codigo", value: "id" },
      { text: "DescriÃ§Ã£o", value: "nome_produto" },
      { text: "Pontos Usados", value: "pontos_produto" },
      { text: "Status", value: "status" },
      { text: "Tipo", value: "tipo_resgate" },
      { text: "Resgatado Em", value: "create_at" },
      { text: "AÃ§Ã£o", value: "acao" }
    ],
    headersInseridos: [
      { text: "Pedido", value: "id_pedido" },
      { text: "Pontos", value: "pontos" },
      { text: "Metodo", value: "metodo" },
      { text: "Expirado", value: "expirado" },
      { text: "Inserido Por", value: "inserido_por" },
      { text: "Inserido Em", value: "inserido_em" },
      { text: "AÃ§Ã£o", value: "acao" }
    ],
    headersGeral: [
      { text: "Codigo", value: "id" },
      { text: "Produto", value: "nome_produto" },
      { text: "Status", value: "status"},
      { text: "Aluno", value: "nome" },
      { text: "Resgatado Em", value: "create_at" }
    ],
    headersResgatesGeral: [     
      { text: "Codigo", value: "id" },
      { text: "Produto", value: "nome_produto" },
      { text: "Status", value: "status"},
      { text: "Aluno", value: "nome" },
      { text: "Faculdade", value: "nome_exibicao_faculdade" },
      { text: "Semestre", value: "descri_semestre" },
      { text: "Resgatado Em", value: "create_at" }
    ],
    faculdades: [],
    selectedFaculdade: 0,
    semestres: [],
    selectedSemestre: 0,
    periodos: [],
    selectedPeriodo: 0,
    file: "",
    loadingImport: false,
    pontosGeral: [],
    expanded: [],
    headerPontosGeral: [
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "cpf",
        width: 200
      },
      { text: "Nome", value: "aluno" },
      // { text: "Sobrenome", value: "sobrenome" },
      { text: "Faculdade", value: "nome_facul", align: "center" },
      { text: "Semestre", value: "nome_semestre", align: "center" },
      { text: "Pontos", value: "pontos", align: "center" },
      { text: "", value: "data-table-expand" }
    ],
    getAllResgates: false,
    arrayResgatesGeral: [],
    searchResgatesGeral: ""
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getFacudades();
    this.getPermissao();
    this.divInseridoResgatados = true;
  },
  methods: {
    /**
	 handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    submitFile() {
      this.loadingImport = true;
      let formData = new FormData();

      formData.append("file", this.file);

      this.$axios
        .post("/fidelidade/importarPontos", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          if (res.data === true) {
            console.log("deu nois");
          } else {
            console.log("deu erro");
          }
          this.loadingImport = false;
        })
        .catch(err => {
          console.log(err);
          this.loadingImport = false;
        });
    },
	 */
    excel() {
      let json = [];

      this.pontosGeral.forEach(item => {
        let obj = {};

        obj.cpf = item.cpf;
        obj.nome = item.nome + " " + item.sobrenome;
        obj.email = item.email;
        obj.faculdade = item.nome_facul;
        obj.semestre = item.nome_semestre;
        obj.pontos = item.pontos;

        json.push(obj);
      });

      var ws = this.$XLSX.utils.json_to_sheet(json);

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_pontos"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_pontos.xlsx"); // name of the file is 'book.xlsx'
    },
    async excluir(item) {
      let check = await this.$bvModal.msgBoxConfirm(
        "VocÃª tem certeza que deseja excluir o voucher?, " +
          item.pontos_produto +
          " pontos serÃ£o devolvidos ao aluno.",
        {
          title: "ConfirmaÃ§Ã£o!",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "SIM",
          cancelTitle: "NÃƒO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        }
      );
      if (check == true) {
        this.loading = true;
        this.$axios
          .put("/fidelidade/excluirVoucher", {
            item: item,
            aluno: this.aluno,
            usuario: this.$usuario.value.usuario
          })
          .then(res => {
            this.loading = false;
            if (res.data === false) {
              this.showSnackbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else {
              this.showSnackbar(
                "Voucher Excluido Com Sucesso!",
                "success",
                2000
              );
              this.buscarAluno();
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    async remover(item) {
      let check = await this.$bvModal.msgBoxConfirm(
        "VocÃª tem certeza que deseja remover os pontos?",
        {
          title: "ConfirmaÃ§Ã£o!",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "SIM",
          cancelTitle: "NÃƒO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        }
      );
      if (check == true) {
        this.loading = true;
        this.$axios
          .put("/fidelidade/removerPontos", {
            item: item,
            aluno: this.aluno,
            usuario: this.$usuario.value.usuario
          })
          .then(res => {
            this.loading = false;
            if (res.data === false) {
              this.showSnackbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else {
              this.showSnackbar(
                "Pontos Removidos Com Sucesso!",
                "success",
                2000
              );
              this.buscarAluno();
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    restaurar(item) {
      this.loading = true;
      this.$axios
        .put("/fidelidade/restaurarVoucher", {
          id: item.id
        })
        .then(res => {
          this.loading = false;
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.showSnackbar("Voucher Restaurado", "success", 2000);
            this.buscarAluno();
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    validar(item) {
      this.loading = true;
      this.$axios
        .put("/fidelidade/validarVoucher", {
          id: item.id
        })
        .then(res => {
          this.loading = false;
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.showSnackbar("Voucher Validado", "success", 2000);
            this.buscarAluno();
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    inserirPontos() {
      if (this.pontos > 0) {
        this.dialogInserir = false;
        this.loading = true;
        this.$axios
          .post("/fidelidade/inserirPontos", {
            cpf: this.cpf,
            pontos: this.pontos,
            data: this.data,
            usuario: this.$usuario.value.usuario
          })
          .then(res => {
            this.loading = false;
            if (res.data === false) {
              this.showSnackbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else {
              this.pontos = "";
              this.data = "";
              this.showSnackbar(
                "Pontos Inseridos Com Sucesso!",
                "success",
                2000
              );
              this.buscarAluno();
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    imprimir() {
      if (this.geral.length) {
       this.$htmlToPaper("print");     
      }
      if (this.arrayResgatesGeral.length) {
        this.$htmlToPaper("print2");        
      }
      
    },
    buscarAluno() {
      this.loading = true;
      this.$axios
        .get("/fidelidade/resgatesInseridosAluno", {
          params: {
            cpf: this.cpf
          }
        })
        .then(res => {
          this.loading = false;
          if (res.data === false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            console.log(res.data);
            this.aluno = res.data;
            this.resgates = res.data.aluno_resgates;
            this.inseridos = res.data.aluno_pontos_inseridos;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    onChangeSelect() {
      this.selectedSemestre = "0";
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade
          }
        })
        .then(res => {
          this.semestres = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeSemestreSelect() {
      this.$axios
        .get("/periodo/findallbyfaculdadesemestre", {
          params: {
            faculdade: this.selectedFaculdade,
            semestre: this.selectedSemestre
          }
        })
        .then(res => {         
          this.periodos = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangePeriodoSelect() {
      if (this.selectedPeriodo !== 0) {
        this.loading = true;
        this.$axios
          .get("/fidelidade/resgatesGeral", {
            params: {
              faculdade: this.selectedFaculdade,
              semestre: this.selectedSemestre,
              periodo: this.selectedPeriodo
            }
          })
          .then(res => {
            this.loading = false;
            this.geral = res.data;
            console.log(this.geral);
            
            this.arrayResgatesGeral = "";
            this.searchResgatesGeral = "";
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      }
    },
    getFacudades() {
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id
          }
        })
        .then(res => {
          this.faculdades = res.data;
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
            pagina: "fidelidade_relatorios"
          }
        })
        .then(res => {
          this.permissoes = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    relatorioGeralPontos() {
      this.loading = true;

      this.$axios
        .get("fidelidade/pontosGeral", {})
        .then(res => {
          this.pontosGeral = res.data;
          console.log(this.pontosGeral);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    relatorioGeralResgates() {
      this.getAllResgates = true;
      this.$axios
        .get("fidelidade/resgatesGeral", {
          params: {
            getAllResgates: this.getAllResgates
          }
        })
        .then(res => {
          this.arrayResgatesGeral = res.data;
          console.log(this.arrayResgatesGeral);
          
          this.loading = false;
          this.selectedFaculdade = "";
          this.selectedSemestre = "";
          this.selectedPeriodo = "";
          this.geral = "";
          this.searchGeral = "";
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>