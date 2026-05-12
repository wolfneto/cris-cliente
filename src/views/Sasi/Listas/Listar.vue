<template>
  <v-container>
    <EditarLista
      v-if="editar"
      :lista="objectItem"
      :listas="listas"
      :original="original"
    ></EditarLista>
    <div v-if="!editar">
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="8">
          <v-autocomplete
            auto-select-first
            autofocus
            v-model="selectedFaculdade"
            :items="faculdades"
            item-text="nome_exibicao_faculdade"
            return-object
            label="Faculdade"
            @change="onChange()"
            dense
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="8">
          <v-select
            v-model="selectedPosGraduacao"
            @change="onChangeGraduacao()"
            :items="[
              { text: 'GraduaÃ§Ã£o', value: 0 },
              { text: 'EspecializaÃ§Ã£o', value: 1 },
            ]"
            label="GraduaÃ§Ã£o ou EspecializaÃ§Ã£o"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="8">
          <v-select
            @change="buscarListas()"
            v-model="selectedSemestre"
            :items="semestres"
            item-text="descri_semestre"
            return-object
            label="Semestre"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="12" md="2">
          <v-text-field
            v-model="data_de"
            v-mask="'##/##/####'"
            :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
            placeholder="dd/mm/aaaa"
            label="De"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="data_ate"
            v-mask="'##/##/####'"
            :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
            placeholder="dd/mm/aaaa"
            label="AtÃ©"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn color="primary" @click="buscarListas()">
            Buscar
            <v-icon dark right>fa-search</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="2">
          <b-form-checkbox
            switch
            v-if="permissoes.check_somente_originais == 1"
            v-model="original"
            :value="true"
            :unchecked-value="false"
            size="lg"
            @input="buscarListas()"
          >
            <span class="primary--text" v-if="original">Listas Originais</span>
            <span class="success--text" v-else>Listas Online</span>
          </b-form-checkbox>
          <!-- <v-btn color="primary" @click="criarPrevisao()">Criar Pendencia</v-btn> -->
        </v-col>
        <v-col cols="3">
          <v-btn v-if="!original && selectedSemestre" color="warning" @click="showDialogMinimoVenda(selectedSemestre)">
            valor minimo semestre
            <v-icon dark right>fas fa-dollar-sign</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-card :class="original ? 'corOriginal' : 'corOnline'">
        <v-row v-if="permissoes.check_somente_originais == 1" no-gutters>
          <v-col cols="12">
            <v-alert
              v-if="original"
              color="info"
              text
              dense
              style="text-align: center"
              ><b>LISTAS ORIGINAIS</b></v-alert
            >
            <v-alert
              v-else
              color="success"
              text
              dense
              style="text-align: center"
            >
              <b>LISTAS ONLINE / EM TESTE</b>
            </v-alert>
          </v-col>
        </v-row>
        <v-card-title>
          <v-row no-gutters class="mt-n6 mb-6 mr-6" justify="end">
            <div v-if="!original">
              <span v-if="!original"
                >Total Online
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  }).format(totalListasOnline)
                }}</span
              >
              <br />
              <small v-if="totalMinimoVenda != 0.0" class="primary--text"
                >Total Minimo p/ Venda
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  }).format(totalMinimoVenda)
                }}</small
              >
              <small v-else class="warning--text"
                >NÃ£o Possui Minimo p/ Venda</small
              >
            </div>
          </v-row>
        </v-card-title>
        <v-row no-gutters class="mt-n10">
          <v-col cols="12">
            <v-btn
              v-if="listas.length > 0 && original"
              color="primary"
              class="ml-1"
              @click="findRepetido"
              >Checar Itens Repetidos</v-btn
            >
          </v-col>
        </v-row>
        <v-list two-line :class="permissoes.check_somente_originais == 1 && original ? 'corOriginal' : 'corOnline'">
          <v-list-item-group >
            <template v-for="(item, index) in listas">
              <v-menu
                transition="slide-x-transition"
                absolute
                offset-y
                :key="item.id_lista"
              >
                <template v-slot:activator="{ on }">
                  <v-list-item
                    @contextmenu.prevent="on.click"
                    @click="editarLista(item)"
                    :key="item.id_lista"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="headline">
                        <v-row no-gutters>
                          <v-col v-if="original" cols="auto" class="mt-n4">
                            <v-checkbox v-model="item.checked"></v-checkbox>
                          </v-col>

                          <v-col cols="12" md="1">{{ item.id_lista }}</v-col>
                          <v-col cols="12" md="1" class="ml-n8 mt-n1">
                            <v-icon
                              v-if="permissoes.btn_update_titulo == 1"
                              dense
                              @click="editTitulo(item)"
                              >far fa-edit</v-icon
                            >
                          </v-col>
                          <v-col cols="12" md="10" class="ml-n12">
                            <span>{{ item.nome_exibi_lista }}</span>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                      <v-list-item-subtitle
                        class="subtitle-1"
                        :class="
                          item.status_lista == 1 || item.status == 1
                            ? 'success--text'
                            : 'error--text'
                        "
                      >
                        {{ item.nome_status_lista }}
                        <div v-if="item.hasOwnProperty('status')">
                          <span class="success--text" v-if="item.habilitada"
                            >DiponÃ­vel P/ EdiÃ§Ã£o</span
                          >
                          <span class="error--text" v-else
                            >NÃ£o DisponÃ­vel P/ EdiÃ§Ã£o</span
                          >
                        </div>
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="mt-2">
                        Criado Por
                        <b>{{ item.criado_por }}</b> em
                        <b>{{ item.date_create }}</b>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        v-if="item.date_modify"
                        class="mt-2"
                      >
                        Modificado Por
                        <b>{{ item.editado_por }}</b> em
                        <b>{{ item.date_modify }}</b>
                      </v-list-item-subtitle>
                      
                      <v-list-item-subtitle v-if="item.revisado" class="mt-n0">
                        Revisado Por
                        <b>{{ item.revisado_por }}</b> em
                        <b>{{ item.revisado_em }}</b>
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text
                        class="headline font-weight-black"
                      >
                        {{
                          new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(item.valor_total_lista)
                        }}
                        - {{ item.total_itens_lista }} Itens

                        <small
                          v-if="item.previsao > 0"
                          class="red--text body-2"
                        >
                          <b>
                            (Em PrevisÃ£o:
                            <span class="success--text" v-if="item.em_previsao"
                              >SIM</span
                            >
                            <span v-else>NÃƒO</span>
                            - {{ item.previsao }}x)
                          </b>
                        </small>
                      </v-list-item-action-text>

                      <!-- <v-icon v-if="!active" color="grey lighten-1">star_border</v-icon>

                      <v-icon v-else color="yellow">star</v-icon>-->
                    </v-list-item-action>
                  </v-list-item>
                </template>
                <v-list>
                  <v-list-item
                    v-if="
                      item.hasOwnProperty('status') &&
                      permissoes.habilitar_lista
                    "
                    @click="habilitar(item)"
                  >
                    <v-list-item-title v-if="item.habilitada"
                      >Desabilitar Lista</v-list-item-title
                    >
                    <v-list-item-title v-else
                      >Habilitar Lista</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="item.hasOwnProperty('id_lista_original')"
                    @click="colocarOnlineTeste(item)"
                  >
                    <v-list-item-title
                      v-if="item.status_lista == 1 || item.status_lista == -1"
                      >Colocar em TESTE</v-list-item-title
                    >
                    <v-list-item-title v-else-if="item.status_lista == 0"
                      >Colocar ONLINE</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    @click="aprovarLista(item)"
                    v-if="item.status == 0 && permissoes.aprovar == 1"
                  >
                    <v-list-item-title>Aprovar</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      item.previsao == 0 &&
                      permissoes.criar_previsao == 1 &&
                      item.nome_status_lista != 'EM TESTE' &&
                      item.nome_status_lista != 'ON-LINE'
                    "
                    @click="showPrevisao(item)"
                  >
                    <v-list-item-title>Criar PrevisÃ£o</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else-if="
                      permissoes.criar_previsao == 1 &&
                      item.nome_status_lista != 'EM TESTE' &&
                      item.nome_status_lista != 'ON-LINE'
                    "
                    @click="showPrevisao(item)"
                  >
                    <v-list-item-title>Ver PrevisÃ£o</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      item.em_previsao &&
                      item.previsao > 0 &&
                      permissoes.aprovar_previsao == 1
                    "
                    @click="aprovarPrevisao(item)"
                  >
                    <v-list-item-title>Desaprovar PrevisÃ£o</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      !item.em_previsao &&
                      item.previsao > 0 &&
                      permissoes.aprovar_previsao == 1
                    "
                    @click="aprovarPrevisao(item)"
                  >
                    <v-list-item-title>Aprovar PrevisÃ£o</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      permissoes.copiar_p_semestre == 1 &&
                      item.nome_status_lista != 'EM TESTE' &&
                      item.nome_status_lista != 'ON-LINE'
                    "
                    @click="showCopiar(item)"
                  >
                    <v-list-item-title>Copiar</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      (permissoes.copiar_p_original == 1 &&
                        item.nome_status_lista == 'EM TESTE') ||
                      item.nome_status_lista == 'ON-LINE'
                    "
                    @click="showCopiar(item)"
                  >
                    <v-list-item-title
                      >Copiar P/ Nova Original</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="permissoes.deletar == 1"
                    @click="excluirLista(item)"
                  >
                    <v-list-item-title>Excluir</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="verPrecosLista(item)">
                    <v-list-item-title>
                      Ver Valores Lista
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-divider
                v-if="index + 1 < listas.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-dialog v-model="dialogPrevisao" persistent max-width="300px">
        <v-card>
          <v-card-title>
            <span class="headline">PrevisÃ£o de Venda</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    @keypress.enter="criarPrevisao()"
                    v-model="previsao"
                    label="Multiplicar por"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" text @click="dialogPrevisao = false"
              >Voltar</v-btn
            >
            <v-btn color="success" text @click="criarPrevisao()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogCopiar" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Copiar Lista</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify="center" class="custom-row">
                <v-col cols="12" md="8">
                  <v-select
                    v-model="selectedFaculdadeCopiar"
                    :items="faculdadesCopiar"
                    item-text="nome_exibicao_faculdade"
                    return-object
                    label="Faculdade"
                    @change="onChangeCopiar()"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center" class="custom-row">
                <v-col cols="12" md="8">
                  <v-select
                    v-model="selectedPosGraduacaoCopiar"
                    @change="onChangeGraduacaoCopiar()"
                    :items="[
                      { text: 'GraduaÃ§Ã£o', value: 0 },
                      { text: 'EspecializaÃ§Ã£o', value: 1 },
                    ]"
                    label="GraduaÃ§Ã£o ou EspecializaÃ§Ã£o"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center" class="custom-row">
                <v-col cols="12" md="8">
                  <v-select
                    v-model="selectedSemestreCopiar"
                    :items="semestresCopiar"
                    item-text="descri_semestre"
                    return-object
                    label="Semestre"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="center" class="custom-row">
                <v-col cols="12" md="8">
                  <v-checkbox
                    v-model="checkUpdateValorSite"
                    color="primary"
                    label="Alterar valores site p/ valor sistema atual"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="error"
              text
              @click="
                dialogCopiar = false;
                checkUpdateValorSite = false;
              "
              >Voltar</v-btn
            >
            <v-btn color="success" text @click="copiarLista()">Copiar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogEditTitulo" max-width="1200px">
        <v-card>
          <v-card-title class="headline">Nome da Lista</v-card-title>

          <v-card-text>
            <v-text-field v-model="objectItem.nome_exibi_lista"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="cancelarTitulo()">Voltar</v-btn>
            <v-btn color="success" text @click="salvarTitulo()">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRepetidos">
        <v-card>
          <v-card-title class="headline">
            Itens Repetidos
            <v-btn color="primary" class="ml-3" @click="imprimir()"
              >Imprimir</v-btn
            >
            <v-btn class="ml-3" color="error" @click="dialogRepetidos = false"
              >Voltar</v-btn
            >
          </v-card-title>
          <v-card-text id="print">
            <v-data-table
            hide-default-footer
            :items-per-page="-1"
              :search="search"
              :headers="headers"
              :items="itensRepetidos"
              :no-data-text="'Nenhum item encontrado'"
              height="100%"
             
              class="elevation-1"
            >
            <template v-slot:item.cod="{ item }">
              <h6>{{ item.cod }}</h6>
            </template>              
              <template v-slot:item.encontrado_em="{ item }">
                <v-data-table
                  :headers="headersEncontrado"
                  :items="item.encontrado_em"
                  hide-default-footer
                  hide-default-header
                >
                <template v-slot:item.opcional_item="{ item }">
                  <span v-if="item.opcional_item == 1" class="primary--text font-weight-black">OPCIONAL</span>
                  <span v-else class="success--text font-weight-black">PRINCIPAL</span>                  
                  </template>
                  <template v-slot:item.valor="{ item }"
                    >R$ {{ item.valor.toFixed(2).replace(".", ",") }}</template
                  >
                </v-data-table>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSemRepetidos" width="500">     
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
          ATENÃ‡Ã‚O!
          </v-card-title>
           <v-card-text class="subtitle-1 mt-4 font-weight-black">
            NÃƒO FORAM ENCONTRADOS ITENS REPETIDOS NAS LISTAS SELECIONADAS!
           </v-card-text>       
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialogSemRepetidos = false">
              voltar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="itemRepetidoListaDialog" persistent max-width="1200">
        <v-card>
          <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
          <v-card-text>
            Esta lista nÃ£o pode ser aprovada pois possue item(s) que jÃ¡ constam
            nas listas ONLINE.

            <v-simple-table fixed-header height="250px" dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Codigo</th>
                    <th class="text-left">DescriÃ§Ã£o</th>
                    <th class="text-left">Marca</th>
                    <th class="text-left">Lista</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in itemRepetidoLista" :key="item.id_marca">
                    <td>{{ item.cod_marca }}</td>
                    <td>{{ item.descri_item }}</td>
                    <td>{{ item.nome_marca }}</td>
                    <td>{{ item.nome_lista }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="itemRepetidoListaDialog = false"
              >Entendi</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogMinimoVenda" max-width="550px">
        <v-card>
          <v-card-title class="headline" 
            >Defina o Valor Minimo p/ Venda</v-card-title
          >
          <v-card-text>            
            <h6
              class="primary--text"
              v-if="objectItem.valor_minimo_venda != 0.0"
            >
              Minimo p/ Venda Atual:
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                }).format(objectItem.valor_minimo_venda)
              }}
            </h6>
            <h6 class="warning--text" v-else>
              NÃ£o Possui Valor Minimo P/ Venda Atualmente
            </h6>
            <v-row justify="center" >
              <v-col cols="5">
                <money
                  maxlength="10"
                  class="form-control font-weight-bold text-center"
                  v-model="objectItem.valor_minimo_venda"
                  v-bind="money"
                  style="height: 125%"
                ></money>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
              <v-btn color="error" @click="closeDialogMinimoVenda()"
              >Voltar</v-btn
              >
              <v-spacer></v-spacer>
            <v-btn color="success" @click="salvarMinimoVenda(objectItem)"
              >Salvar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogValoresLista" max-width="350px">
        <v-card>
          <v-card-title class="headline">Valores Lista</v-card-title>
          <v-card-text>
            <h6>Lista EconÃ´mica: <b>R$ {{valorTotalListaEconomico}}</b></h6>
            <h6>Lista Sugerida: <b>R$ {{ valorTotalListaSugerida }}</b></h6>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="dialogValoresLista = false">Fechar</v-btn>            
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
    </div>
  </v-container>
</template>
<script>
import EditarLista from "./Editar";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    EditarLista,
  },
  data: () => ({
    headers: [
      { text: "DescriÃ§Ã£o", value: "descricao" },
      { text: "Codigo", value: "cod" },
      // { text: "Lista", value: "nome_lista_inicial" },
      // { text: "Valor", value: "valor_lista_inicial" },
      { text: "Encontrado em", value: "encontrado_em" },
    ],
    headersEncontrado: [
    { text: "ID", value: "id_lista" },
      { text: "Lista", value: "nome_lista" },
      { text: "Valor", value: "valor" },
      { text: "Opcional", value: "opcional_item" },
    ],
    dialogEditTitulo: false,
    dialogRepetidos: false,
    dialogSemRepetidos: false,
    dialogMinimoVenda: false,
    dialogValoresLista: false,
    itemRepetidoLista: [],
    itemRepetidoListaDialog: false,
    editar: false,
    objectIndex: -1,
    objectItem: {},
    previsao: 0,
    dialogPrevisao: false,
    dialogCopiar: false,
    search: "",
    listas: [],
    itensRepetidos: [],
    objectIndex: -1,
    objectItem: {},
    selectedSemestre: 0,
    semestres: [],
    selectedSemestreCopiar: 0,
    semestresCopiar: [],
    selectedFaculdadeCopiar: 0,
    selectedPosGraduacaoCopiar: "",
    faculdadesCopiar: [],
    faculdades: [],
    selectedFaculdade: 0,
    selectedPosGraduacao: "",
    original: true,
    timer: null,
    permissoes: {},
    checkUpdateValorSite: false,
    totalListasOnline: 0.0,
    totalMinimoVenda: 0.0,
    valorTotalListaEconomico: 0,
    valorTotalListaSugerida: 0,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);

    this.getFacudades();
    this.getPermissao();
    this.getDatas();
  },
  computed: {
    ...mapState({
      error: (state) => state.pedidoAtendimento.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      retorno_valor_minimo_venda_semestre: (state) => state.listas.retorno_valor_minimo_venda_semestre,
    }),
    data_de: {
      get() {
        return this.data_inicial;
      },
      set(value) {
        this.$store.commit("setDataInicial", value);
      },
    },
    data_ate: {
      get() {
        return this.data_final;
      },
      set(value) {
        this.$store.commit("setDataFinal", value);
      },
    },
  },
  methods: {
    ...mapActions(["getDatas", "salvar_minimo_venda"]),
    ...mapMutations([
      "set_snackbar",
      "set_loading",
      "set_valor_total_listas_online",
      "clean_retorno_valor_minimo_venda_semestre"
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    async salvarMinimoVenda(item) {
      let obj = {
        id_semestre: item.id_semestre,
        valor_minimo_venda: item.valor_minimo_venda,
      }
        this.set_loading(true);
        await this.salvar_minimo_venda(obj);
        this.set_loading(false);
        this.closeDialogMinimoVenda();
        
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
          });
        } else {
          this.totalMinimoVenda = this.retorno_valor_minimo_venda_semestre.valor_minimo_venda; 
          this.set_snackbar({
            show: true,
            msg: "Valor Minimo p/ Venda Salvo com Sucesso!",
            type: "success",
          });
        }
    },
    showDialogMinimoVenda(item) {
      if(Object.keys(this.retorno_valor_minimo_venda_semestre).length != 0){
        
        this.objectItem = {
          id_semestre: this.retorno_valor_minimo_venda_semestre.id_semestre,
          valor_minimo_venda: this.retorno_valor_minimo_venda_semestre.valor_minimo_venda,
        }
      }else{
        this.objectItem = { ...item };
      }
      
      this.dialogMinimoVenda = true;
    },
    closeDialogMinimoVenda() {
      this.dialogMinimoVenda = false;
    },
    imprimir() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("print").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`<!DOCTYPE html>
                    <html>
                    <head>
                        ${stylesHtml}
                    </head>
                    <body>
                        ${prtHtml}
                    </body>
                    </html>`);

     WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      // WinPrint.close();
    },
    findRepetido() {
      this.itensRepetidos = [];
      let idListas = [];
      this.listas.forEach((element) => {
        if (element.checked) {
          idListas.push(element.id_lista);
        }
      });  
      console.log(idListas);
      if (idListas.length > 1) {
        this.set_loading(true);
        this.$axios
          .get("/lista/findRepetido", {
            params: {
              de: this.data_de,
              ate: this.data_ate,
              semestre: this.selectedSemestre.id_semestre,
              faculdade: this.selectedFaculdade.id_faculdade,
              listas: idListas,
              original: this.original,
            },
          })
          .then((res) => {
            this.set_loading(false);
            if (res.data !== false) {
              if (!res.data.length) {
                this.dialogSemRepetidos = true;
              }else{
                console.log("array", res.data);
                this.itensRepetidos = res.data;
                this.dialogRepetidos = true;
              }
            } else {
              this.set_snackbar({
                show: true,
                msg: "Erro no Servidor, Contate o Administrador",
                type: "error",
                time: 0,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.set_loading(false);
          });
      } else {
        this.set_snackbar({
          show: true,
          msg: "ATENÃ‡ÃƒO! Ã‰ NECESSÃRIO MARCAR MAIS DE 1 LISTA PARA CHECAR ITENS REPETIDOS! ",
          type: "warning",
          time: 0,
        });
      }
    },
    editTitulo(item) {
      this.objectIndex = this.listas.indexOf(item);
      this.objectItem = item;

      this.dialogEditTitulo = true;
    },
    cancelarTitulo() {
      this.dialogEditTitulo = false;
      this.objectItem.nome_lista = this.objectItem.nome_exibi_lista;
    },

    salvarTitulo() {
      if (this.objectItem.nome_exibi_lista.length <= 0) {
        this.set_snackbar({
          show: true,
          msg: "O campo nome nÃ£o pode ser vazio!",
          type: "warning",
          time: 0,
        });
      } else {
        this.dialogEditTitulo = false;
        this.set_loading(true);

        this.$axios
          .put("/lista/updateTitulo", {
            id_lista: this.objectItem.id_lista,
            titulo: this.objectItem.nome_exibi_lista,
            original: this.original,
          })
          .then((res) => {
            this.set_loading(false);
            if (res.data !== false) {
              this.buscarListas();
            }
          })
          .catch((err) => {
            console.log(err);
            this.set_loading(false);
          });
      }
    },
    habilitar(item) {
      this.set_loading(true);
      this.$axios
        .post("/lista/habilitar", {
          lista: item,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data === false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          } else {
            this.set_loading(false);
            this.buscarListas();
          }
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
        });
    },
    colocarOnlineTeste(item) {
      this.set_loading(true);
      this.$axios
        .post("/lista/colocarOnlineTeste", {
          lista: item,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data === false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          } else {
            this.set_loading(false);
            this.buscarListas();
          }
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
        });
    },
    showCopiar(item) {
      this.objectIndex = this.listas.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.selectedFaculdadeCopiar = this.selectedFaculdade;
      this.selectedPosGraduacaoCopiar = this.selectedPosGraduacao;
      this.selectedSemestreCopiar = this.selectedSemestre;
      this.semestresCopiar = this.semestres;
      this.dialogCopiar = true;
    },
    copiarLista() {
      this.dialogCopiar = false;
      this.set_loading(true);
      this.$axios
        .post("/lista/copiar", {
          original: this.original,
          lista: this.objectItem,
          usuario: this.$usuario.value.usuario,
          faculdade: this.selectedFaculdadeCopiar,
          semestre: this.selectedSemestreCopiar,
          checkUpdateValorSite: this.checkUpdateValorSite,
        })
        .then((res) => {
          this.set_loading(false);
          if (res.data === false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          } else {
            this.set_snackbar({
              show: true,
              msg:
                "Lista " +
                res.data.lista +
                " copiada com a data: " +
                res.data.data +
                " ",
              type: "success",
              time: 0,
            });
            this.buscarListas();
            this.checkUpdateValorSite = false;
          }
          console.log(res.data);
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
        });
    },
    editarLista(item) {
      item.clicks++;
      if (item.clicks == 1) {
        this.timer = setTimeout(function () {
          item.clicks = 0;
        }, 500);
      } else {
        if (item.hasOwnProperty("status")) {
          if (!item.habilitada && this.permissoes.visualizar_lista) {
            clearTimeout(this.timer);
            this.objectIndex = this.listas.indexOf(item);
            this.objectItem = Object.assign({}, item);
            item.clicks = 0;
            this.editar = true;
          } else if (item.habilitada) {
            clearTimeout(this.timer);
            this.objectIndex = this.listas.indexOf(item);
            this.objectItem = Object.assign({}, item);
            item.clicks = 0;
            this.editar = true;
          } else {
            this.set_snackbar({
              show: true,
              msg: "VOCÃŠ NÃƒO PODE EDITAR ESTA LISTA",
              type: "error",
              time: 0,
            });
          }
        } else {
          clearTimeout(this.timer);
          this.objectIndex = this.listas.indexOf(item);
          this.objectItem = Object.assign({}, item);

          item.clicks = 0;
          this.editar = true;
        }
      }
    },
    aprovarLista(item) {
      this.set_loading(true);
      this.$axios
        .post("/lista/aprovar", {
          lista: item,
          usuario: this.$usuario.value,
          completa: item.mostrar_completa,
        })
        .then((res) => {
          this.set_loading(false);
          if (res.data === false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          } else {
            if (Array.isArray(res.data)) {
              this.set_loading(false);
              this.itemRepetidoLista = [];
              this.itemRepetidoLista = res.data;
              this.itemRepetidoListaDialog = true;
            } else {
              this.set_snackbar({
                show: true,
                msg: "Lista aprovada para teste no site!",
                type: "success",
                time: 0,
              });
            }
          }
          this.buscarListas();
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
        });
    },
    async excluirLista(lista) {
      let check = await this.$bvModal.msgBoxConfirm(
        "Deseja realmente deletar a lista?",
        {
          title: "ConfirmaÃ§Ã£o!",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "SIM",
          cancelTitle: "NÃƒO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        }
      );
      if (check) {
        this.set_loading(true);
        let original = false;
        let idListaOriginal = 0;
        if (lista.hasOwnProperty("status")) {
          original = true;
        }
        if (lista.hasOwnProperty("id_lista_original")) {
          idListaOriginal = lista.id_lista_original;
        }

        this.$axios
          .delete("/lista", {
            params: {
              id_lista: lista.id_lista,
              original: original,
              id_lista_original: idListaOriginal,
              usuario: this.$usuario.value.usuario,
            },
          })
          .then((res) => {
            this.buscarListas();
            this.set_loading(false);
            if (res.data === false) {
              this.set_snackbar({
                show: true,
                msg: "Erro no Servidor, Contate o Administrador",
                type: "error",
                time: 0,
              });
            } else {
              this.set_snackbar({
                show: true,
                msg: "Lista Excluida!",
                type: "success",
                time: 0,
              });
            }
          })
          .catch((err) => {
            this.set_loading(false);
            console.log(err);
          });
      }
    },
    verPrecosLista(item){     
      let valoresSiteEconomico = 0;
      let valoresSiteSugerida = 0;
      let menorValor = 0;
      let maiorValor = 0;
          
      this.$axios
        .post("/lista/getItens", {
          id: item.id_lista,
          original: this.original,
        })
        .then((res) => {
          if (res.data === false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {              
            res.data.forEach((i) =>{
              if (i.disponivel_item == 1 && i.opcional_item == 0 && !i.titulo) {                      
                if (!i.qtd_item) {
                  i.qtd = 1;
                }
                if (i.valor_site < 0) {
                  i.valor_site = 0;
                }
                if (i.marcaOpcional) {
                  menorValor = Math.min(i.valor_site, i.valorMarcaOpcional);
                  maiorValor = Math.max(i.valor_site, i.valorMarcaOpcional);
                  valoresSiteEconomico += parseFloat(menorValor) * parseInt(i.qtd_item);                  
                  valoresSiteSugerida += parseFloat(maiorValor) * parseInt(i.qtd_item);                  
                }else{
                  valoresSiteEconomico += parseFloat(i.valor_site) * parseInt(i.qtd_item);  
                  valoresSiteSugerida += parseFloat(i.valor_site) * parseInt(i.qtd_item);  
                }
               }                                        
              });
              this.valorTotalListaEconomico = valoresSiteEconomico.toFixed(2);
              this.valorTotalListaSugerida = valoresSiteSugerida.toFixed(2);
              this.dialogValoresLista = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });

    
    },
    buscarListas() {
      if (this.selectedFaculdade && this.selectedSemestre) {
        this.totalMinimoVenda = 0.0;
        this.clean_retorno_valor_minimo_venda_semestre();

        this.set_loading(true);
        var dados = {
          de: this.data_de,
          ate: this.data_ate,
          faculdade: this.selectedFaculdade.id_faculdade,
          semestre: this.selectedSemestre.id_semestre,
          original: this.original,
        };
        this.$axios
          .get("/listas", {
            params: {
              dados: dados,
            },
          })
          .then((res) => {
            this.set_loading(false);
            if (res.data === false) {
              this.set_snackbar({
                show: true,
                msg: "Erro no Servidor, Contate o Administrador",
                type: "error",
                time: 0,
              });
            } else {
              if (res.data.length > 0) {
                this.totalListasOnline = 0.0;
                this.totalMinimoVenda = 0.0;
                this.listas = res.data;

                this.listas.forEach((item) => {
                  item.faculdade =
                    this.selectedFaculdade.nome_exibicao_faculdade;
                  item.semestre = this.selectedSemestre.descri_semestre;
                  item.venda_semestre = !!this.selectedSemestre.venda_semestre;
                  item.reserva_semestre =
                    !!this.selectedSemestre.reserva_semestre;
                  item.limite_venda = this.selectedSemestre.limite_venda;
                  item.semestre_pagamento =
                    this.selectedSemestre.semestre_pagamento;
                    item.parcelas_pagamento_credito = this.selectedSemestre.parcelas_pagamento_credito;
                  if (item.mostrar_completa) {
                    item.mostrar_completa = 1;
                  } else {
                    item.mostrar_completa = 0;
                  }
                  if (!this.original) {
                    this.totalListasOnline += item.valor_total_lista;
                    this.set_valor_total_listas_online(this.totalListasOnline);
                  }
                });
              } else {
                this.listas = [];
                this.set_snackbar({
                  show: true,
                  msg: "Nenhuma Lista Encontrada",
                  type: "warning",
                  time: 3000,
                });
              }
              this.totalMinimoVenda = this.selectedSemestre.valor_minimo_venda;
            }
          })
          .catch((err) => {
            this.set_loading(false);
            console.log(err);
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          });
      }
    },
    aprovarPrevisao(item) {
      this.set_loading(true);
      let aprovar = item.em_previsao;
      if (aprovar == 1) {
        aprovar = 0;
      } else {
        aprovar = 1;
      }

      this.$axios
        .post("/lista/aprovarPrevisao", {
          id_lista: item.id_lista,
          em_previsao: aprovar,
        })
        .then((res) => {
          this.set_loading(false);
          if (res.data === false) {
            this.set_snackbar({
              show: true,
              msg: "Erro no Servidor, Contate o Administrador",
              type: "error",
              time: 0,
            });
          } else {
            if (aprovar == 1) {
              this.set_snackbar({
                show: true,
                msg: "PrevisÃ£o Aprovada",
                type: "success",
                time: 3000,
              });
            } else {
              this.set_snackbar({
                show: true,
                msg: "PrevisÃ£o Desaprovada",
                type: "warning",
                time: 3000,
              });
            }
            this.buscarListas();
          }
        })
        .catch((err) => {
          this.set_loading(false);
          console.log(err);
        });
    },
    showPrevisao(item) {
      this.objectIndex = this.listas.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.previsao = this.objectItem.previsao;
      this.dialogPrevisao = true;
    },
    criarPrevisao() {
      if (this.previsao.length >= 1) {
        this.dialogPrevisao = false;
        this.set_loading(true);
        this.$axios
          .post("/lista/criarPrevisao", {
            id_lista: this.objectItem.id_lista,
            previsao: this.previsao,
          })
          .then((res) => {
            this.set_loading(false);
            if (res.data === false) {
              this.set_snackbar({
                show: true,
                msg: "Erro no Servidor, Contate o Administrador",
                type: "error",
                time: 0,
              });
            } else {
              this.set_snackbar({
                show: true,
                msg: "PrevisÃ£o Criada Com Sucesso",
                type: "success",
                time: 3000,
              });
              this.buscarListas();
            }
          })
          .catch((err) => {
            this.set_loading(false);
            console.log(err);
          });
      } else {
        this.set_snackbar({
          show: true,
          msg: "Preencha a previsÃ£o",
          type: "warning",
          time: 3000,
        });
      }
    },
    onChange(){
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.listas = [];
      this.totalMinimoVenda = 0.0;
      this.clean_retorno_valor_minimo_venda_semestre();
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.listas = [];
      this.totalMinimoVenda = 0.0;
      this.clean_retorno_valor_minimo_venda_semestre();
      this.set_loading(true);
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade.id_faculdade,
            graduacao: this.selectedPosGraduacao,
          },
        })
        .then((res) => {
          this.set_loading(false);
          this.semestres = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChangeCopiar() {
      this.selectedPosGraduacaoCopiar = "";
      this.selectedSemestreCopiar = "";
    },
    onChangeGraduacaoCopiar() {
      this.selectedSemestreCopiar = "";
      this.set_loading(true);
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdadeCopiar.id_faculdade,
            graduacao: this.selectedPosGraduacaoCopiar,
          },
        })
        .then((res) => {
          this.set_loading(false);
          console.log(res.data);
          this.semestresCopiar = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFacudades() {
      this.set_loading(true);
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id,
          },
        })
        .then((res) => {
          this.set_loading(false);
          this.faculdades = res.data;
          this.faculdadesCopiar = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "ver_lista",
          },
        })
        .then((res) => {
          this.permissoes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.corOriginal {
  background-color: #E3F2FD !important;
}
.corOnline {
  background-color: #f1f8e9 !important;
}
</style>