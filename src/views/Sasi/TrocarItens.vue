<template>
  <v-container>
    <v-card>
      <v-card-title>
        Consultar Codigo
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-switch v-model="original" @change="onChangeOriginal()">
          <template v-slot:label>
            <span class="primary--text" v-if="original"><b>LISTAS ORIGINAIS</b></span>
            <span class="success--text" v-else><b>LISTAS ONLINE</b></span>
          </template>
        </v-switch>
        <div class="flex-grow-1"></div>
        <v-row>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="data_de"
              :rules=" [v => !!v.trim() || 'Data obrigatÃ³ria!' ] "
              label="De"
              v-mask="'##/##/####'"
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="data_ate"
              :rules=" [v => !!v.trim() || 'Data obrigatÃ³ria!' ] "
              label="AtÃ©"
              v-mask="'##/##/####'"
              filled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="11" md="11" lg="11">
            <v-text-field
              ref="codigo_de"
              v-model="codigo_de"
              @click="$event.target.select()"
              @keyup.enter="findItensTroca()"
              prepend-inner-icon="fa-search"
              label="BUSCAR CODIGO"
              class="uppercase"
              filled    
              outlined
            clearable     
            autofocus  
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12" sm="6">
            <v-text-field
              v-if="itens.length > 0"
              v-model="codigo_para"
              @click="$event.target.select()"
              @keyup.enter="checkCodListaRepetido()"
              prepend-icon="fa-exchange-alt"
              label="Novo CÃ³digo"
              class="uppercase"
            ></v-text-field>
          </v-col> -->
        </v-row>
      </v-card-title>
      <!-- <v-card-subtitle>
        <v-menu v-model="menuFiltros" :close-on-content-click="false" :nudge-width="450" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn v-if="!itens.length" disabled color="indigo" v-on="on">Filtros</v-btn>
            <v-btn v-else color="primary" v-on="on">Filtros</v-btn>
          </template>
          <v-card max-width="550px">
            <v-container>
              <v-row>
                <v-col cols="12" sm="10" md="10" lg="10">
                  <v-select
                    @change="changeFilter()"
                    v-model="selectedFaculdade"
                    :items="faculdades"
                    label="Faculdades"
                    multiple
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="warning" @click="clearFilter()">Limpar Filtros</v-btn>
              <v-btn text @click="menuFiltros = false">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <span class="primary--text body-1 ml-3">Filtro Ativo:</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoFalculdade" class="red--text body-1">{{filtroAtivoFalculdade}}</span>
      </v-card-subtitle> -->
      <v-data-table
        height="100%"
        fixed-header
        item-key="codigo"
        locale="pt-PT"
        :loading="loading"
        loading-text="Carregando... Espere por favor"
        :headers="headers"
        :items="filteredItems"
        :no-data-text="'Nenhum item encontrado'"
        class="elevation-1 text-uppercase"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              {{item.nome_faculdade}}
              <br />
              {{item.nome_semestre}}
            </td>
            <td>{{item.nome_lista}}</td>
            <td>R$ {{item.valor_total_lista}}</td>
            <td>{{item.date_create}}</td>
            <td>{{item.descri_item}}</td>
            <td>{{item.nome_marca }}</td>
            <td>R$ {{item.valor_marca}}</td>
            <td>
              DisponÃ­vel:
              <span class="success--text" v-if="item.disponivel_item == 1"><b>SIM</b></span>
              <span class="error--text" v-else><b>NÃƒO</b></span>
              <br />Opcional:
              <span class="success--text" v-if="item.opcional_item == 1"><b>SIM</b></span>
              <span class="error--text" v-else><b>NÃƒO</b></span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- <v-dialog persistent v-model="dialogCodRepetido" max-width="1500px">
      <v-card>
        <v-card-title>
          <span class="headline ma-4">
           <h5> <b>AtenÃ§Ã£o! O codigo que vocÃª esta tentando inserir para alteraÃ§Ã£o, jÃ¡ consta na(as) lista(as) ou em outra lista do mesmo semestre!</b></h5>
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table
              height="450"
              fixed-header
              item-key="codigo"
              locale="pt-PT"
              :headers="headersRepetido"
              :items="itensRepetidos"
              :no-data-text="'Nenhum item encontrado'"
              class="elevation-1 text-uppercase"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>
                    {{item.nome_faculdade}}
                    <br />
                    {{item.nome_semestre}}
                  </td>
                  <td>{{item.nome_lista}}</td>
                  <td>R$ {{item.valor_total_lista}}</td>
                  <td>{{item.date_create}}</td>
                  <td>{{item.descri_item}}</td>
                  <td>{{item.nome_marca }}</td>
                  <td>R$ {{item.valor_marca}}</td>
                  <td>
                    DisponÃ­vel:
                    <span class="success--text" v-if="item.disponivel_item == 1">Sim</span>
                    <span class="error--text" v-else>NÃ£o</span>
                    <br />Opcional:
                    <span class="success--text" v-if="item.opcional_item == 1">Sim</span>
                    <span class="error--text" v-else>NÃ£o</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="dialogCodRepetido = false">OK Entendi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- <v-dialog persistent v-model="dialogMarca" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Trocar descriÃ§Ã£o da Marca</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" class="mt-5">
              <v-col cols="12">
                <div class="text-center">
                  <h4>Marcas Atuais</h4>
                  <v-select v-model="marcaNova" dense :items="marcasAtuais" label="Marcas"></v-select>
                </div>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field v-model="marcaNova" label="Nova Marca"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogMarca = false">Voltar</v-btn>
          <v-btn color="success" @click="trocarItens()">Trocar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
export default {
  data: () => ({
    valid: false,
    // marcasAtuais: [],
    // marcaNova: "",
    // dialogMarca: false,
    original: true,
    codigo_de: "",
    // codigo_para: "",
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    itens: [],
    headers: [
      {
        text: "Faculdade",
        sortable: true,
        value: "nome_faculdade",
        width: "200pt"
      },
      {
        text: "Lista",
        sortable: true,
        value: "nome_lista",
        width: "200pt"
      },
      {
        text: "Total Lista",
        sortable: true,
        value: "valor_total_lista",
        width: "80pt"
      },
      {
        text: "Data",
        sortable: true,
        value: "data_create"
      },
      {
        text: "DescriÃ§Ã£o",
        sortable: true,
        value: "descri_item",
        width: "250pt"
      },
      {
        text: "Marca",
        sortable: true,
        value: "nome_marca",
        width: "100pt"
      },
      {
        text: "Valor Item",
        sortable: true,
        value: "valor_marca",
        width: "80pt"
      },
      {
        text: "Status",
        sortable: true,
        value: "disponivel_item",
        width: "120pt"
      }
    ],
    // menuFiltros: false,
    // selectedFaculdade: [],
    // filtroAtivoFalculdade: false,
    filteredItems: [],
    // dialogCodRepetido: false,
    // itensRepetidos: [],
    // headersRepetido: [
    //   {
    //     text: "Faculdade",
    //     sortable: true,
    //     value: "nome_faculdade"
    //   },
    //   {
    //     text: "Lista",
    //     sortable: true,
    //     value: "nome_lista"
    //   },
    //   {
    //     text: "Total",
    //     sortable: true,
    //     value: "valor_total_lista"
    //   },
    //   {
    //     text: "Data",
    //     sortable: true,
    //     value: "data_create"
    //   },
    //   {
    //     text: "DescriÃ§Ã£o",
    //     sortable: true,
    //     value: "descri_item"
    //   },
    //   {
    //     text: "Marca",
    //     sortable: true,
    //     value: "nome_marca"
    //   },
    //   {
    //     text: "Valor",
    //     sortable: true,
    //     value: "valor_marca"
    //   },
    //   {
    //     text: "Status",
    //     sortable: true,
    //     value: "disponivel_item"
    //   }
    // ]
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getDatas();
  },
  computed: {
    ...mapState({
      data_inicial: state => state.config.data_inicial,
      data_final: state => state.config.data_final
    }),
    // faculdades: function() {
    //   let data = [];
    //   for (const item of this.itens) {
    //     data.push(item.nome_faculdade);
    //   }
    //   return data;
    // },
    // marcas: function() {
    //   let data = [];
    //   for (const item of this.itens) {
    //     data.push(item.nome_marca);
    //   }
    //   return data;
    // },
    data_de: {
      get() {
        return this.data_inicial;
      },
      set(value) {
        this.$store.commit("setDataInicial", value);
      }
    },
    data_ate: {
      get() {
        return this.data_final;
      },
      set(value) {
        this.$store.commit("setDataFinal", value);
      }
    }
  },
  methods: {
    ...mapActions(["getDatas"]),
    // checkCodTroca() {
    //   this.loading = true;
    //   this.$axios
    //     .get("/produto/getByCod", {
    //       params: {
    //         cod: this.codigo_para
    //       }
    //     })
    //     .then(res => {
    //       this.loading = false;
    //       if (res.data === false) {
    //         this.showSnakerbar(
    //           "Erro no Servidor, Contate o Administradore",
    //           "error"
    //         );
    //       } else if (res.data) {
    //         // this.dialogMarca = true;
    //         this.marcasAtuais = [
    //           ...new Set(this.itens.map(item => item.nome_marca))
    //         ];
    //       } else {
    //         this.showSnakerbar(
    //           "AtenÃ§Ã£o! O codigo do item inserido para alteraÃ§Ã£o " + this.codigo_para + " nÃ£o foi encontrado ou nÃ£o existe.",
    //           "warning",
    //         );
    //       }
    //     });
    // },
    // trocarItens() {
    //   this.loading = true;
    //   if (this.marcaNova.length > 0) {
    //     this.marcaNova = this.marcaNova.toUpperCase();
    //   }
    //   this.$axios
    //     .post("/lista/trocarItens", {
    //       codigo_de: this.codigo_de.toUpperCase(),
    //       codigo_para: this.codigo_para.toUpperCase(),
    //       listas: this.filteredItems,
    //       original: this.original,
    //       nova_marca: this.marcaNova
    //     })
    //     .then(res => {
    //       this.loading = false;

    //       if (res.data === false) {
    //         this.showSnakerbar(
    //           "Erro no Servidor, Contate o Administrador",
    //           "error"
    //         );
    //       } else {
    //         // this.dialogMarca = false;
    //         this.codigo_de = "";
    //         this.codigo_para = "";
    //         this.itens = [];
    //         this.filteredItems = [];
    //         // this.filtroAtivoFalculdade = false;
    //         // this.selectedFaculdade = [];
    //         this.$nextTick(() => this.$refs.codigo_de.focus());

    //         this.showSnakerbar(
    //           "Codigo e nome da marca trocados com sucesso!",
    //           "success",
    //           2000
    //         );
    //       }
    //     });
    // },
    //1
    findItensTroca() {
      // this.clearFilter();      
      this.codigo_de = this.codigo_de.replace(/\s+/g, "").toUpperCase();

      if (this.codigo_de.length > 0) {
        this.loading = true;
        this.$axios
          .get("/lista/findItensTroca", {
            params: {
              codigo: this.codigo_de,
              de: this.data_de,
              ate: this.data_ate,
              original: this.original
            }
          })
          .then(res => {
            this.loading = false;

            if (res.data === false) {
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            } else if (res.data.length > 0) {
              // console.log("listas", res.data);

              this.itens = res.data;
              // this.codigo_para = "";
              this.showAll();
            } else {
              this.filteredItems = [];
              this.showSnakerbar("Nenhum item encontrado", "warning", 2000);
            }
          });
      }
    },
    showAll() {
      this.filteredItems = this.itens;
    },
    onChangeOriginal() {
      this.codigo_de = "";
      // this.codigo_para = "";
      this.filteredItems = [];
    },
    //2
    // checkCodListaRepetido() {
    //   this.codigo_para = this.codigo_para.replace(/\s+/g, "").toUpperCase();

    //   if (this.codigo_para.length > 0) {
    //     this.loading = true;

    //     this.$axios
    //       .post("/lista/checkCodListaRepetido", {
    //         codigo_para: this.codigo_para,
    //         de: this.data_de,
    //         ate: this.data_ate,
    //         original: this.original,
    //         listas: this.filteredItems
    //       })
    //       .then(res => {
    //         this.loading = false;
    //         if (res.data.length > 0) {
    //           this.itensRepetidos = res.data;
    //           this.dialogCodRepetido = true;
    //         } else {
    //           this.checkCodTroca();
    //         }
    //       });
    //   }
    // },   
    // clearFilter() {
    //   this.showAll();
    //   // this.filtroAtivoFalculdade = false;
    //   // this.selectedFaculdade = [];
    // },
    // changeFilter() {
    //   if (this.selectedFaculdade.length > 0) {
    //     this.filteredItems = this.itens.filter(f =>
    //       this.selectedFaculdade.includes(f.nome_faculdade)
    //     );
    //     this.filtroAtivoFalculdade = this.selectedFaculdade;
    //   } else {
    //     this.clearFilter();
    //   }
    // },
     showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    }
  }
};
</script>