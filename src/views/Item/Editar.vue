<template>
  <v-container>
    <v-card max-width="1500" height="auto" elevation="2">
      <v-toolbar dense flat color="indigo darken-3" dark>
        <v-toolbar-title>
          <span class="h5">{{ item.codigo }} - {{ item.descricao }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="refresh()">
          <v-icon>fas fa-sync</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="
            $parent.editar = false;
            $parent.volta();
          "
        >
          <v-icon>fa-chevron-circle-left</v-icon>
        </v-btn>
        <v-btn class="mr-6" @click="salvar()" icon>
          <v-icon>fa-save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid">
        <v-tabs vertical v-model="tab">
          <v-tab active-class="blue darken-2 white--text">Dados</v-tab>
          <v-tab disabled active-class="blue darken-2 white--text"
            >Descrição</v-tab
          >
          <v-tab disabled active-class="blue darken-2 white--text"
            >Historico</v-tab
          >
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" style="!important;">
                <v-form ref="form" v-model="valid" class="ma-2">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          class="uppercase"
                          v-model="item.codigo"
                          label="Codigo"
                          :rules="[regras]"
                          required
                          dense
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          class="uppercase"
                          v-model="item.codigo_fornecedor"
                          label="Codigo Fornecedor"
                          :rules="[regras]"
                          required
                          dense
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-row justify="center">
                          <v-switch
                            v-model="item.status"
                            :value="1"
                            :unchecked-value="3"
                            label="Status"
                            class="mt-n5"
                          ></v-switch>
                        </v-row>
                        <v-row justify="center" class="mt-n6 ml-8">
                          <span class="primary--text" v-if="item.status == '1'">
                            <h6>
                              <b>Ativo</b>
                            </h6>
                          </span>
                          <span class="error--text" v-else>
                            <h6>
                              <b>Bloqueado</b>
                            </h6>
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-row no-gutters>
                          <v-col cols="12" md="2">
                            <v-btn
                            :disabled="!item.image_path"                                                         
                              class="ma-0"
                              color="primary"
                              icon
                              large
                              @click="showImage($event, item.image_path)"
                            >
                              <v-icon dark right>fas fa-camera</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-file-input                             
                              chips
                              class="ml-1"                              
                              v-model="file"
                               :rules="[regras_imagem]"                                
                              label="Selecionar imagem"
                              accept="image/png, image/jpeg"
                              flat
                              dense
                            ></v-file-input>
                            </v-col>
                          <v-col cols="12" md="4">  
                            <v-btn 
                            :disabled="!file"
                            class="ml-6"
                            small
                            color="success"
                            @click="uploadImagem(item.codigo, file)"
                            >                            
                            Subir imagem <v-icon small class="ml-2">fas fa-cloud-upload-alt</v-icon></v-btn>
                          </v-col>
                        </v-row>                       
                      </v-col>
                    </v-row>
                    <v-row class="mt-n4">
                      <v-col cols="12" md="7">
                        <v-text-field
                          class="uppercase"
                          v-model="item.descricao"
                          label="Descrição"
                          :rules="[regras]"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="mt-n4">
                      <v-col cols="12" md="3">
                        <v-text-field
                          class="uppercase"
                          v-model="item.marca"
                          label="Marca"
                          :rules="[regras_marca]"
                          @click="$event.target.select()"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="item.saldo"
                          label="Saldo"
                          @click="$event.target.select()"
                          required
                          dense
                          readonly
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="item.valor"
                          label="Valor"
                          v-money="$money"
                          maxlength="13"
                          @click="$event.target.select()"
                          required
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="1">
                        <v-text-field
                          @keypress.enter="calcDescontoExemplo(item)"
                          @click="$event.target.select()"
                          v-model="item.desconto"
                          class="input-qtd-produtos"
                          suffix="%"
                          :append-icon="
                            temDesconto ? 'fas fa-times' : 'fas fa-check'
                          "
                          @click:append="calcDescontoExemplo(item)"
                          :disabled="!item.aceita_desconto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-checkbox
                          class="mt-n1"
                          v-model="item.aceita_desconto"
                        >
                          <template v-slot:label>
                            <span class="font-weight-medium"
                              >Aceita desconto:</span
                            >
                            <span
                              v-if="item.aceita_desconto == 0"
                              class="error--text font-weight-medium"
                            >
                              Não</span
                            >
                            <span
                              v-else
                              class="success--text font-weight-medium"
                            >
                              Sim</span
                            >
                          </template>
                        </v-checkbox>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="item.valor_desconto"
                          label="Valor Exemplo"
                          maxlength="13"
                          @click="$event.target.select()"
                          required
                          readonly
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" height="auto" style="!important;">
                <div class="ma-2">
                  <v-row>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-textarea
                        class="uppercase-area"
                        label="Descrição detalhada"
                        rows="12"
                        no-resize
                        filled
                      ></v-textarea>
                      <v-textarea
                        class="uppercase-area"
                        label="Especificações técnicas"
                        rows="12"
                        no-resize
                        filled
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-img
                        class="ma-2"
                        src="https://picsum.photos/510/300?random"
                        aspect-ratio="1.4"
                        max-width="100%"
                        max-height="100%"
                      ></v-img>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item eager>
            <v-container>
              <v-card class="mx-auto" height="auto" style="!important;">
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <div class="primary text-center white--text">
                      <span class="h5">Realizado</span>
                    </div>
                    <v-row justify="center" class="mt-n2">
                      <v-col cols="12" sm="6" md="6" lg="6">
                        <div class="primary white--text text-center">
                          <span class="h6">Entradas</span>
                        </div>
                        <!-- <TabelaRealizadoEntradas></TabelaRealizadoEntradas> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6" lg="6">
                        <div class="primary white--text text-center">
                          <span class="h6">Saídas</span>
                        </div>
                        <!-- <TabelaRealizadoSaidas></TabelaRealizadoSaidas> -->
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="6">
                    <div class="primary white--text text-center">
                      <span class="h5">Pendente</span>
                    </div>

                    <v-row justify="center" class="mt-n2">
                      <v-col cols="12" sm="6" md="6" lg="6">
                        <div class="primary white--text text-center">
                          <span class="h6">Entradas</span>
                        </div>
                        <!-- <TabelaPendenteEntradas></TabelaPendenteEntradas> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6" lg="6">
                        <div class="primary white--text text-center">
                          <span class="h6">Saídas</span>
                        </div>
                        <!-- <TabelaPendenteSaidas></TabelaPendenteSaidas> -->
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <div class="primary white--text text-center">
                      <span class="h5">Historico de Pedidos</span>
                    </div>
                    <!-- <TabelaHistorico></TabelaHistorico> -->
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-form>
    </v-card>
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
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions } from "vuex";
// import TabelaRealizadoEntradas from "./components/TabelaRealizadoEntradas";
// import TabelaRealizadoSaidas from "./components/TabelaRealizadoSaidas";
// import TabelaPendenteEntradas from "./components/TabelaPendenteEntradas";
// import TabelaPendenteSaidas from "./components/TabelaPendenteSaidas";
// import TabelaHistorico from "./components/TabelaHistorico";

export default {
  // components: {
  //   TabelaRealizadoEntradas,
  //   TabelaRealizadoSaidas,
  //   TabelaPendenteEntradas,
  //   TabelaPendenteSaidas,
  //   TabelaHistorico,
  // },
  data: () => ({
    tab: null,
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    valid: false,
    temDesconto: false,
    regras: (val) => (val || "").length >= 4 || "*Campo obrigatório",
    regras_marca: (val) => (val || "").length >= 2 || "*Campo obrigatório",
    regras_imagem: (val) => (!val || val.size < 50000) || 'Imagem não pode exceder 5MB.',      
    file: null,
    showMenuImage: false,    
    x: 0,
    y: 0,
    urlImg: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      item: (state) => state.item.item,
      itens_realizado_entrada: (state) => state.item.itens_realizado_entrada,
      itens_realizado_saida: (state) => state.item.itens_realizado_saida,
      selected_item_realizado_entrada: (state) =>
        state.item.selected_item_realizado_entrada,
      selected_item_realizado_saida: (state) =>
        state.item.selected_item_realizado_saida,
      error: (state) => state.item.error,
    }),
  },
  methods: {
    ...mapActions(["saveEditItem", "getRealizadoEntrada", "getRealizadoSaida", "saveItemImage"]),
    ...mapMutations([
      "set_itens_historico",
      "set_selected_item_realizado_entrada",
    ]),
    calcDescontoExemplo(item) {
      if (!this.temDesconto) {
        try {
          item.desconto = item.desconto.replace(",", ".");
          item.desconto = parseFloat(item.desconto);
          if (
            isNaN(item.desconto) ||
            item.desconto <= 0 ||
            item.desconto > 99.99
          ) {
            this.showSnackbar("Valor de desconto incorreto!", "warning", 2000);
            item.desconto = 0;
          } else {
            let valor = parseFloat(item.valor.replace("R$ ", ""));
            item.valor_desconto = (
              valor -
              valor * (item.desconto / 100)
            ).toFixed(2);
            item.valor_desconto = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.valor_desconto);
            this.temDesconto = true;
          }
        } catch (error) {
          console.log(error);
          item.desconto = 0;
          this.showSnackbar("Valor de desconto incorreto!", "warning", 2000);
        }
      } else {
        this.temDesconto = false;
        item.desconto = 0;
        item.valor_desconto = 0;
      }
    },
    async salvar() {
      if (this.$refs.form.validate()) {
        await this.saveEditItem(this.item);
        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.showSnackbar("Item salvo com sucesso!", "success", 5000);
        }
      }
    },
    async refresh() {
      // await this.getRealizadoEntrada(this.item);
      // await this.getRealizadoSaida(this.item);
      // if (this.selected_item_realizado_entrada != null) {
      //   this.set_itens_historico(
      //     this.itens_realizado_entrada[this.selected_item_realizado_entrada]
      //       .registros
      //   );
      // }
      // if (this.selected_item_realizado_saida != null) {
      //   this.set_itens_historico(
      //     this.itens_realizado_saida[this.selected_item_realizado_saida]
      //       .registros
      //   );
      // }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
   async uploadImagem(codigo, file){
           
      if (file.type ==='image/jpeg' || file.type ==='image/png') {
        const myRenamedFile = new File([file], codigo + ".png");
        const formData = new FormData();
        formData.append("file", myRenamedFile);

        await this.saveItemImage(formData);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {      
          this.file = null;
          this.showSnackbar("imagem inserida com sucesso!", "success", 5000);
        }
      }else{       
        this.file = null;
        this.showSnackbar("Somente imagens JPEG ou PNG!", "warning", 5000);
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
      return require('@/assets/produtos/' +
        img);
    },
  },
};
</script>
<style lang="sass">
.my-sticky-dynamic
  thead tr:first-child th
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
  thead tr:last-child th
    height: 50px
    top: 48px
  thead tr:first-child th
    top: 0
</style>