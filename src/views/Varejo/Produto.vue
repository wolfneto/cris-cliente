<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="3">
            <v-select
              class="ma-2"
              :items="arrayCategorias"
              item-text="nome"
              item-value="id"
              label="Filtrar por Categoria"
              return-object
              outlined
              v-model="filterCategoria"
              @change="filtrarPorCategoria(filterCategoria.id)"
            ></v-select>
          </v-col>
          <v-col cols="7">
            <v-text-field
              class="uppercase ma-2"
              append-icon="fa-search"
              v-model="search"
              v-on:keyup="find(search)"
              @click="$event.target.select()"
              label="Buscar"
              hide-details
              filled
              rounded
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="2">
            <v-btn
              class="ma-2"
              color="primary"
              @click="dialog = true"
              text
              absolute
              right
              ><v-icon color="blue" class="mr-2">fa-plus</v-icon> Add
              Produto</v-btn
            >
          </v-col> -->
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-n8">
          <q-virtual-scroll
            class="my-sticky-dynamic"
            type="table"
            style="max-height: 80vh"
            virtual-scroll
            :virtual-scroll-slice-size="30"
            :virtual-scroll-item-size="47"
            :virtual-scroll-sticky-size-start="48"
            :virtual-scroll-sticky-size-end="32"
            :items="filteredProdutos"
            dense
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
                  <div v-if="col.name == 'img_path'" style="width:auto">
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                      max-width="55px"
                    ></v-img>
                  </div>
                  <div v-if="col.name == 'codigo'" style="width: auto">
                    <b>{{ row.codigo }}</b>
                  </div>
                  <div v-if="col.name == 'nome'" style="width: auto">
                    {{ row.nome }}
                  </div>
                  <div v-if="col.name == 'descricao'" style="width: auto">
                    {{ row.descricao }}
                  </div>
                  <div v-if="col.name == 'detalhes'" style="width: auto">
                    {{ row.detalhes }}
                  </div>
                  <div v-if="col.name == 'marca'" style="width: auto">
                    {{ row.marca }}
                  </div>
                  <div v-if="col.name == 'nome_categoria'" style="width: auto">
                    {{ row.nome_categoria }}
                  </div>
                  <div v-if="col.name == 'valor'" style="width: auto">                    
                    {{
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.valor)
                    }}
                  </div>
                  <div v-if="col.name == 'desconto'" style="width: auto">                  
                    {{
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.desconto)
                    }}
                  </div>
                  <div v-if="col.name == 'saldo'" style="width: auto">
                    {{ row.saldo }}
                  </div>

                  <div v-if="col.name == 'bloqueado'" style="width: 100%">
                    <v-row no-gutters class="mt-n0">
                      <span
                        v-if="row.bloqueado"
                        class="error--text font-weight-black h6"
                        >INATIVO</span
                      >
                      <span v-else class="success--text font-weight-black h6">
                        ATIVO</span
                      >
                    </v-row>
                    <v-row no-gutters class="mt-n6">
                      <v-switch
                        v-model="row.bloqueado"
                        small
                        color="red"
                        @change="updateStatus(row)"
                        >
                      </v-switch>
                    </v-row>
                    <!-- <v-chip v-if="row.bloqueado == 0" color="success" dark
                      ><b>Ativo</b></v-chip
                    >
                    <v-chip v-else color="error" dark><b>Inativo</b></v-chip> -->
                  </div>

                  <div v-if="col.name == 'acao'" style="width: 70%">
                    <div class="row justify-center">
                      <div class="col-4">
                        <v-btn
                          small
                          class="ma-1 mt-n2"
                          color="warning"
                          icon
                          @click="editProduto(row)"
                        >
                          <!-- @click="editarAdicionar(row)" -->
                          <v-icon dark>fas fa-edit</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </q-virtual-scroll>
          <!-- <v-col cols="4" v-for="item in filteredProdutos" :key="item.id">
            <v-card class="mx-auto">
              <v-btn color="orange lighten-1" fab dark small absolute top right>
                <v-icon
                  color="white"
                  class="ml-1"
                  small
                  @click="editProduto(item)"
                  >far fa-edit</v-icon
                >
              </v-btn>
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="200px"
              ></v-img>

              <v-card-subtitle>
                <div class="mt-n8">
                  <v-row nogutter>
                    <v-textarea
                      class="h5 text-uppercase font-weight-black ma-1"
                      :rows="3"
                      no-resize
                      v-model="item.nome"
                    ></v-textarea>
                  </v-row>

                  <v-row class="mt-n6">
                    <v-col cols="6">
                      <v-text-field
                        v-model="item.codigo"
                        label="Codigo"
                        placeholder="Placeholder"
                        outlined
                        dense
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="item.saldo"
                        outlined
                        dense
                        type="number"
                        label="Saldo"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-row no-gutters class="mt-n2">
                        <span
                          class="error--text font-weight-black h6"
                          v-if="item.bloqueado"
                          >Bloqueado</span
                        >
                        <span class="success--text font-weight-black h6" v-else>
                          Online</span
                        >
                      </v-row>
                      <v-row no-gutters class="mt-n6">
                        <v-switch
                          v-model="item.bloqueado"
                          inset
                          color="red"
                          @change="updateStatus(item)"
                        >
                        </v-switch>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row class="mt-n10">
                    <v-col cols="6">
                      <money
                        maxlength="10"
                        class="form-control font-weight-bold text-center"
                        style="width: 100%"
                        v-model="item.valor"
                        v-bind="money"
                        prefix="R$ "
                        readonly
                      ></money>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        v-model="item.desconto"
                        suffix="%"
                        outlined
                        dense
                        label="Desconto"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row class="mt-n10">
                    <v-col cols="6">
                      <v-text-field
                        v-model="item.marca"
                        label="Marca"
                        placeholder="Marca"
                        outlined
                        dense
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="item.categoria"
                        :items="categorias"
                        item-text="nome"
                        item-value="id"
                        label="Categoria"
                        return-object
                        outlined
                        dense
                        readonly
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row class="mt-n10">
                    <v-col cols="10">
                      <v-chip
                        v-if="item.cor === 1"
                        class="ma-2"
                        label
                      >
                      <v-icon class="mr-2" small>fas fa-star-half-alt</v-icon>
                      <span class="h6 ma-2">
                        Opção de Cor
                      </span>
                      </v-chip>
                      <v-chip
                        v-if="item.tamanho === 1"
                        class="ma-2"
                        label
                      >
                      <v-icon class="mr-2" small >as fa-expand-arrows-alt</v-icon>
                      <span class="h6 ma-2">
                        Opção de Tamanho
                      </span>
                      </v-chip>
                      
                    </v-col>
                
                    <v-col cols="2">
                      <v-btn
                        :disabled="!item.opcoes.length"
                        icon
                        @click="item.show_option = !item.show_option"
                      >
                        <v-icon>{{
                          item.show_option
                            ? "fas fa-chevron-up"
                            : "fas fa-chevron-down"
                        }}</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  
                  <v-row class="mt-n8">
                    <v-col cols="12">
                      <v-expand-transition>
                        <div v-show="item.show_option">
                          <v-divider></v-divider>
                          <v-simple-table dense>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">
                                    Codigo
                                  </th>
                                  <th class="text-left">
                                    Descrição
                                  </th>
                                  <th class="text-center">
                                    Valor
                                  </th>
                                  <th class="text-left">
                                    Saldo
                                  </th>
                                  <th class="text-left">
                                    Bloqueado
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="item in item.opcoes"
                                  :key="item.id"
                                >
                                  <td>{{ item.codigo }}</td>
                                  <td>{{ item.descricao }}</td>
                                  <td>{{ item.valor }}</td>
                                  <td>{{ item.saldo }}</td>
                                  <td>
                                    <span v-if="item.bloqueado" class="text-red"
                                      >Bloqueado</span
                                    >
                                    <span v-else class="text-primary"
                                      >Ativo</span
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </div>
                      </v-expand-transition>
                    </v-col>
                  </v-row>
                 
                  <v-row class="mt-n0">
                    <v-col cols="10">
                      <v-btn class="text-bold" text>
                        DESCRIÇÃO
                      </v-btn>
                    </v-col>
                    <v-col cols="2" class="align-end">
                      <v-btn icon @click="item.show_desc = !item.show_desc">
                        <v-icon>{{
                          item.show_desc
                            ? "fas fa-chevron-up"
                            : "fas fa-chevron-down"
                        }}</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="mt-n2" no-gutters>
                    <v-col cols="12">
                      <v-expand-transition>
                        <div v-show="item.show_desc" class="ma-n4">
                          <v-divider></v-divider>
                          <v-card-text>
                            <v-textarea
                              :rows="8"
                              no-resize
                              v-model="item.descricao"
                              filled
                              class="mt-n6 mb-n8"
                              readonly
                            ></v-textarea>
                          </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-col>
                  </v-row>
                </div>
              </v-card-subtitle>
            </v-card>
          </v-col> -->
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar flat dark dense color="orange accent-3">
                <v-toolbar-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn text @click="fecharDialog()">Voltar</v-btn>
                </v-toolbar-items>
                <v-toolbar-items>
                  <v-btn text @click="salvar()">Salvar</v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-form
                class="ma-6 mt-n1"
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="1" class="text-center">
                    <v-btn
                      :disabled="!objectItem.img_path"
                      color="primary"
                      icon
                    >
                      <!-- @click="showImage($event, item.image_path)" -->
                      <v-icon dark right large>fas fa-camera</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-file-input
                      chips
                      v-model="file"
                      :rules="[regras_imagem]"
                      label="Selecionar imagem"
                      accept="image/png, image/jpeg"
                      flat
                      outlined
                      dense
                    ></v-file-input>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      :disabled="!file"
                      color="success"
                      @click="uploadImagem(objectItem.codigo, file)"
                    >
                      Subir imagem
                      <v-icon small class="ml-2"
                        >fas fa-cloud-upload-alt</v-icon
                      ></v-btn
                    >
                  </v-col>
                </v-row>
                <v-row class="mt-n8">
                  <v-col cols="2">
                    <!-- @keyup.13="getProduto($event.target.value, objectItem)" -->
                    <v-text-field
                      :rules="[(v) => !!v || 'Campo Obrigatório']"
                      v-model="objectItem.codigo"
                      label="Codigo"
                      outlined
                      @click="$event.target.select()"
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="objectItem.saldo"
                      label="Saldo"
                      outlined
                      @click="$event.target.select()"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      required
                      :rules="[(v) => !!v || 'Campo Obrigatório']"
                      v-model="objectItem.nome"
                      label="Nome"
                      outlined
                      @click="$event.target.select()"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <money
                      maxlength="10"
                      class="form-control font-weight-bold text-center"
                      style="width:100%; height: 65%"
                      v-model="objectItem.valor"
                      v-bind="money"
                      prefix="R$ "
                    ></money>
                  </v-col>
                </v-row>
                <v-row class="mt-n8">
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="4">
                        <v-text-field
                          required
                          :rules="[(v) => !!v || 'Campo Obrigatório']"
                          v-model="objectItem.marca"
                          label="Marca"
                          outlined
                          @click="$event.target.select()"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          v-model="objectItem.desconto"
                          label="Desconto %"
                          outlined
                          suffix="%"
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          v-model="objectItem.categoria"
                          :items="categorias"
                          item-text="nome"
                          item-value="id"
                          label="Categoria"
                          return-object
                          outlined
                          dense
                        ></v-select>
                      </v-col>

                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-col cols="12">
                      <v-row>
                        <v-textarea
                        :rows="8"
                        no-resize
                        label="Descrição"
                        v-model="objectItem.descricao"
                        outlined
                        @click="$event.target.select()"
                        dense
                      ></v-textarea>   
                      </v-row>
                      <v-row>
                        <v-textarea
                          :rows="8"
                          no-resize
                          label="detalhes"
                          v-model="objectItem.detalhes"
                          outlined
                          @click="$event.target.select()"
                          dense
                        ></v-textarea>

                      </v-row>
                    </v-col>

                  </v-col>

                </v-row>

                <!-- <v-row class="mt-n8" >
                  <v-col cols="2">
                    <v-checkbox 
                    class="ml-8"            
                      v-model="objectItem.opcao"
                      label="Opcoes"
                      @change="adicionarOpcional()"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                    :disabled="!objectItem.opcao"
                      v-model="objectItem.opcional"
                      :items="[{id: 0, nome: 'TAMANHO'}, {id: 1, nome: 'COR'}]"
                      class='ml-n12 mt-4'
                      item-text="nome"
                      item-value="id"
                      label="Tipo Opção"
                      return-object
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row> -->
                <!-- <v-row v-if="objectItem.opcao" class="mt-n4">
                  <v-col cols="12">
                    <v-expand-transition>
                      <div>
                        <v-row class="mt-n8">
                          <v-col cols="12">
                            <v-data-table
                              :headers="headersOpcoesProduto"
                              :items="objectItem.arrayOpcoesProduto"
                              hide-default-footer
                              class="elevation-1"
                              fixed-header
                              height="400px"
                              dense
                            >
                              <template v-slot:item.codigo="{ item }">
                                <v-text-field
                                  @keyup.13="getProduto($event.target.value, item)"
                                  placeholder="Codigo"
                                  v-model="item.codigo"
                                  class="uppercase"
                                  outlined
                                  @click="$event.target.select()"
                                  dense
                                ></v-text-field>
                              </template>
                              <template v-slot:item.saldo="{ item }">
                                <v-text-field
                                  v-model="item.saldo"
                                  type="number"
                                  outlined
                                  dense
                                  @click="$event.target.select()"
                                ></v-text-field>
                              </template>
      
                              <template v-slot:item.descricao="{ item }">
                                <v-text-field
                                  v-model="item.descricao"
                                  class="uppercase"
                                  outlined
                                  @click="$event.target.select()"
                                  dense
                                ></v-text-field>
                              </template>
                              <template v-slot:item.valor="{ item }">
                                <money
                                  class="form-control font-weight-bold text-center mt-n6"
                                  maxlength="10"
                                  v-model="item.valor"
                                  v-bind="$money"
                                  style="width:100%; height: 55%"
                                ></money>
                              </template>
                              <template v-slot:item.bloqueado="{ item }">
                                <v-select
                                  v-model="item.bloqueado"
                                  :items="[
                                    { text: 'Ativo', value: 0 },
                                    { text: 'Bloqueado', value: 1 },
                                  ]"
                                  required
                                  outlined
                                  class="mt-1"
                                  dense
                                ></v-select>
                              </template>
                              <template v-slot:item.acao="{ item }">
                                <v-row>
                                  <v-col cols="6">
                                    <v-icon
                                      color="primary"
                                      class="mt-n2"
                                      @click="addLinhaOpcao()"
                                      small
                                      >fa-plus</v-icon
                                    >
                                  </v-col>
                                  <v-col cols="6">
                                    <v-icon
                                      color="error"
                                      class="mt-n2"
                                      @click="deleteLinhaOpcao(item)"
                                      small
                                      >fa-trash-alt</v-icon
                                    >
                                  </v-col>
                                </v-row>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </div>
                    </v-expand-transition>
                  </v-col>
                </v-row> -->
              </v-form>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- -->

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
    arrayCategorias: [],
    filterCategoria: "",
    search: "",
    dialog: false,
    objectIndex: -1,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    objectItem: {
      codigo: "",
      nome: "",
      descricao: "",
      detalhes:"",
      marca: "",
      valor: "0",
      desconto: "0",
      saldo: 0,
      categoria: "",
      bloqueado: 0,
      qtd:0,
      venda: 0,
      img_path: "",
      criado_em: "",
      criado_por: "",
      editado_em: "",
      editado_por: "",

      // arrayOpcoesProduto: [],
      // opcional: "",
    },
    disabled: false,
    valid: true,
    headers: [
      {
        name: "img_path",
        align: "left",
        label: "Foto",
        sortable: true,
      },
      {
        name: "codigo",
        align: "left",
        label: "Codigo",
        sortable: true,
      },
      {
        name: "nome",
        align: "left",
        label: "Nome",
        sortable: true,
      },
      {
        name: "detalhes",
        align: "left",
        label: "Detalhes",
        sortable: true,
      },
      {
        name: "marca",
        align: "left",
        label: "Marca",
        sortable: true,
      },
      {
        name: "nome_categoria",
        align: "left",
        label: "Categoria",
        sortable: true,
      },
      {
        name: "valor",
        align: "center",
        label: "Valor",
        sortable: true,
      },
      {
        name: "desconto",
        align: "center",
        label: "Desconto",
        sortable: true,
      },
      {
        name: "saldo",
        align: "center",
        label: "Saldo",
        sortable: true,
      },
      {
        name: "bloqueado",
        align: "left",
        label: "Bloqueado",
        sortable: true,
      },
      {
        name: "acao",
        align: "left",
        label: "acao",
        sortable: true,
      },
    ],
    headersOpcoesProduto: [
      { text: "Código", value: "codigo", width: 200 },
      { text: "Saldo", value: "saldo", width: 100 },
      { text: "Descrição", value: "descricao", width: 800 },
      { text: "Valor", value: "valor", width: 150 },
      { text: "Status", value: "bloqueado", width: 150 },
      {
        text: "Ação",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    filteredProdutos: [],
    // opcional: false,

    regras_imagem: (val) =>
      !val || val.size < 50000 || "Imagem não pode exceder 5MB.",
    file: null,
    showMenuImage: false,
    x: 0,
    y: 0,
    urlImg: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getProdutos();
    this.getCategorias();
  },
  computed: {
    ...mapState({
      produtos: (state) => state.produtoVarejo.produtos_varejo,
      // produto: (state) => state.gerenciarEquipamentos.produto,
      categorias: (state) => state.produtoVarejo.categorias_varejo,
      error: (state) => state.produtoVarejo.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitle() {
      return this.objectIndex === -1 ? "Adicionar Produto" : "Editar Produto";
    },
  },
  methods: {
    ...mapActions([
      "get_produtos_varejo",
      "get_categorias_varejo",
      // "get_produto",
      // "adicionar_produto_varejo",
      "update_status_produto_varejo",
      "saveProdutoImage_varejo",
    ]),
    ...mapMutations(["set_snackbar", "set_loading"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async getProdutos() {
      this.set_loading(true);
      await this.get_produtos_varejo();
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
      this.filteredProdutos = this.produtos;
      console.log("produtos", this.filteredProdutos);

      if (this.filterCategoria) {
        this.filtrarPorCategoria(this.filterCategoria.id);
      }
    },
    async getCategorias() {
      this.set_loading(true);
      await this.get_categorias_varejo();
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
          time: 0,
        });
      }
      this.arrayCategorias = [].concat(
        { id: 0, nome: "Todos" },
        this.categorias
      );
    },
    // adicionarOpcional() {
    //   if (this.objectItem.opcao == false) {
    //     this.objectItem.opcional = "";
    //   }
    //   if (!this.objectItem.hasOwnProperty("arrayOpcoesProduto")) {
    //     this.objectItem.arrayOpcoesProduto = [];
    //     // this.objectItem.arrayOpcoesProdutos = this.objectItem.arrayOpcoesProdutos.splice(0,this.objectItem.arrayOpcoesProdutos.length)
    //   }
    //   if (this.objectItem.arrayOpcoesProduto.length == 0) {
    //     this.objectItem.arrayOpcoesProduto.push({
    //       id_linha: this.objectItem.arrayOpcoesProduto.length,
    //       codigo: "",
    //       descricao: "",
    //       valor: 0,
    //       saldo: 0,
    //       bloqueado: 0,
    //     });
    //   }
    // },
    // addLinhaOpcao() {
    //   let item = {
    //     id_linha: this.objectItem.arrayOpcoesProduto.length,
    //     codigo: "",
    //     descricao: "",
    //     valor: 0,
    //     saldo: 0,
    //     bloqueado: 0,
    //   };
    //   this.objectItem.arrayOpcoesProduto.push(item);
    // },

    // deleteLinhaOpcao(item) {
    //   const index = this.objectItem.arrayOpcoesProduto.indexOf(item);
    //   console.log(item, index);
    //   if (index !== -1) {
    //     this.objectItem.arrayOpcoesProduto.splice(index, 1);
    //   }
    // },

    // async getProduto(value, item) {
    //   if (value) {
    //     this.set_loading(true);
    //     await this.get_produto(value);
    //     this.set_loading(false);

    //     if (this.error) {
    //       this.set_snackbar({
    //         show: true,
    //         msg: "Erro no Servidor, Contate o Administrador",
    //         type: "error",
    //         time: 0,
    //       });
    //     } else {
    //       if (Object.keys(this.produto).length == 0) {
    //         item.descricao = "";
    //         item.valor = "";
    //         item.saldo = "";

    //         this.set_snackbar({
    //           show: true,
    //           msg: "Codigo informado não existe!",
    //           type: "warning",
    //           time: 3000,
    //         });
    //       } else {
    //         item.codigo = this.produto.codigo.toUpperCase();
    //         item.descricao = this.produto.descricao.toUpperCase();
    //         item.valor = this.produto.valor;
    //         item.saldo = this.produto.saldo;
    //         item.marca = this.produto.marca.toUpperCase();
    //       }
    //     }
    //   }
    // },
    async salvar() {
      if (this.$refs.form.validate()) {
        // console.log("entrou", this.objectIndex > -1);
        let data = {};
        if (this.objectIndex > -1) {
          // if (
          //   (this.objectItem.opcao && this.objectItem.opcional == "") ||
          //   !this.objectItem.hasOwnProperty("opcional")
          // ) {
          //   if (!this.objectItem.arrayOpcoesProduto.length == 0) {
          //     console.log("boa");
          //   }
          //   this.set_snackbar({
          //     show: true,
          //     msg: "ATENÇÃO!, É necessario selecionar o tipo de opção!",
          //     type: "warning",
          //     time: 2000,
          //   });
          // } else {
            // console.log("1", this.objectItem.arrayOpcoesProduto);
            // data.id_categoria = this.objectItem.categoria.id;
            data.codigo = this.objectItem.codigo.toUpperCase();
            data.nome = this.objectItem.nome.toUpperCase();
            data.descricao = this.objectItem.descricao.toUpperCase();
            data.marca = this.objectItem.marca.toUpperCase();
            data.valor = parseFloat(this.objectItem.valor);
            data.desconto = parseFloat(this.objectItem.desconto);
            data.saldo = parseInt(this.objectItem.saldo);
            data.bloqueado = parseInt(this.objectItem.bloqueado);
            data.criado_por = this.$usuario.value.usuario.toUpperCase();
            data.opcoes = this.objectItem.arrayOpcoesProduto;
            data.opcional = this.objectItem.opcional;

            console.log("item", data);
            // this.set_loading(true);
            // await this.adicionar_produto_varejo(data);
            // this.set_loading(false);
          // }
        }
        //  else {
        //   console.log("criar");
        // }

        // this.dialog = false;
        // this.getProdutos();

        // console.log("validation", validation);
        // if (this.objectItem.tamanho) {
        //   // this.fechar();
        //   this.set_snackbar({
        //     show: true,
        //     msg: "Os tipos equipamentos não pode ser vazio!",
        //     type: "warning",
        //     time: 3000,
        //   });
        // }
        // else {
        //   this.set_loading(true);
        //   if (this.objectIndex > -1) {
        //     this.objectItem.tipos_equipamentos = this.tiposEquipamentos;
        //     await this.editar_equipamento(this.objectItem);
        //   } else {
        //     let data = {
        //       descricao: this.objectItem.descricao,
        //       tipos_equipamentos: this.tiposEquipamentos,
        //     };
        //     await this.adicionar_equipamento(data);
        //   }
        //   this.fechar();
        //   this.set_loading(false);

        //   if (this.error) {
        //     this.set_snackbar({
        //       show: true,
        //       msg: "Erro no Servidor, Contate o Administrador",
        //       type: "error",
        //       time: 0,
        //     });
        //   } else {
        //     this.set_snackbar({
        //       show: true,
        //       msg: "Salvo com sucesso!",
        //       type: "success",
        //       time: 3000,
        //     });
        //   }
        // }
      } else {
        console.log("vazio");
        this.set_snackbar({
          show: true,
          msg: "É necessario preencher as informações do produto!",
          type: "warning",
          time: 3000,
        });
      }
    },

    find() {
      if (this.search.length == 0) {
        this.filteredProdutos = this.produtos;
      }
      let searchProdutoCod = [];
      if (this.search && this.search.length >= 3) {
        searchProdutoCod = this.produtos.filter((i) =>
          i.codigo.includes(this.search.toUpperCase())
        );
        if (searchProdutoCod.length) {
          this.filteredProdutos = searchProdutoCod;
        }
      } else {
        searchProdutoCod = this.produtos.filter((i) =>
          i.nome.includes(this.search.toUpperCase())
        );
        if (searchProdutoCod.length) {
          this.filteredProdutos = searchProdutoCod;
        }
      }
      console.log(this.filteredProdutos);
    },

    filtrarPorCategoria(filterCategoria) {
      let searchProdutoCategoria = [];
      if (filterCategoria == 0) {
        this.filteredProdutos = this.produtos;
      } else {
        for (const i of this.produtos) {
          if (filterCategoria == i.categoria.id) {
            searchProdutoCategoria.push(i);
          }
        }
        this.filteredProdutos = searchProdutoCategoria;
      }
    },

    editProduto(data) {
      console.log(data);
      this.objectIndex = this.filteredProdutos.indexOf(data);
      this.objectItem = Object.assign({}, data);
      // this.objectItem.arrayOpcoesProduto = item.opcoes;
      this.dialog = true;
    },
    fecharDialog() {
      // this.getProdutos();
      let obj = {
        codigo: "",
        nome: "",
        descricao: "",
        marca: "",
        valor: "0",
        desconto: "0",
        saldo: 0,
        categoria: "",
        bloqueado: 0,
        criado_por: "",
        arrayOpcoesProduto: [],
        opcional: "",
      };
      this.dialog = false;
      this.objectIndex = -1;
      this.objectItem = Object.assign({}, obj);
    },

    async updateStatus(data) {
      this.set_loading(true);
      await this.update_status_produto_varejo(data);
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
      this.getProdutos();
    },

    async uploadImagem(codigo, file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const myRenamedFile = new File([file], codigo + ".png");
        const formData = new FormData();
        formData.append("file", myRenamedFile);

        await this.saveProdutoImage_varejo(formData);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.file = null;
          this.showSnackbar("imagem inserida com sucesso!", "success", 5000);
        }
      } else {
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
      return require("@/assets/produtos/" + img);
    },
  },
};
</script>
