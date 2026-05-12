<template>
  <v-container>
    <Tabs></Tabs>
    <v-card
      color="#ECEFF1"
      class="ma-0"
      max-width="100%"
      height="100%"
      elevation="4"
    >
      <div class="ma-4">
        <v-row class="custom-row">
          <v-col cols="12" md="3">
            <v-autocomplete
              auto-select-first
              autofocus
              v-model="selectedFaculdade"
              :items="faculdades"
              item-text="nome_exibicao_faculdade"
              item-value="id_faculdade"
              label="Faculdade"
              @change="onChange()"
              solo
              density="comfortable"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedPosGraduacao"
              :disabled="selectedFaculdade == 0 ? true : false"
              @change="onChangeSelect()"
              :items="[
                { text: 'GraduaÃ§Ã£o', value: 0 },
                { text: 'EspecializaÃ§Ã£o', value: 1 },
              ]"
              label="GraduaÃ§Ã£o ou EspecializaÃ§Ã£o"
              solo
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedSemestre"
              @change="onChangeSemestre()"
              :items="semestres"
              item-text="descri_semestre"
              item-value="id_semestre"
              label="Semestre"
              solo
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-row no-gutters>
              <v-col cols="10">
                <v-select
                  v-model="selectedPeriodo"
                  @change="onChangePeriodo()"
                  :items="periodos"
                  item-text="nome_periodo"
                  item-value="cod_periodo"
                  label="PerÃ­odo"
                  solo
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-btn class="ml-3 mt-1" outlined small fab color="grey">
                  <v-icon  color="grey" @click="reset()"
                    >fas fa-sync-alt</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-data-table
          hide-default-footer
          :items-per-page="-1"
          :headers="headers"
          :items="semestres"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat color="white" dense>
              <v-toolbar-title v-if="selectedPosGraduacao === 0">
                Semestres</v-toolbar-title
              >
              <v-toolbar-title v-else-if="selectedPosGraduacao === 1"
                >EspecializaÃ§Ãµes</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <div class="flex-grow-1"></div>
              <v-dialog
                persistent
                v-model="dialogSemestre"
                max-width="1200px"
                height="auto"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="typeof selectedPosGraduacao === 'string'"
                    color="primary"
                    small
                    v-on="on"
                    text
                  >
                    <v-icon color="blue" class="mr-2" small>fa-plus</v-icon>
                    Semestre
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitleSemestre }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="formSemestre"
                        v-model="validSemestre"
                        lazy-validation
                      >
                        <v-row>
                          <v-col cols="2">
                            <v-text-field
                              :rules="[(v) => !!v || 'Campo ObrigatÃ³rio']"
                              v-model="objectItemSemestre.cod_semestre"
                              label="CÃ³digo"
                              v-mask="'##'"
                              dense
                              clearable
                              outlined
                            ></v-text-field>
                          </v-col>

                          <v-col cols="10">
                            <v-text-field
                              required
                              :rules="[(v) => !!v || 'Campo ObrigatÃ³rio']"
                              v-model="objectItemSemestre.descri_semestre"
                              label="DescriÃ§Ã£o"
                              dense
                              clearable
                              outlined
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="mt-n6">
                            <v-textarea
                              :rows="10"
                              no-resize
                              label="Mensagem"
                              v-model="objectItemSemestre.msg_semestre"
                              clearable
                              outlined
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row class="mt-n10">
                          <v-col cols="12" md="2">
                            <v-radio-group
                              label="Status"
                              v-model="objectItemSemestre.status_semestre"
                              mandatory
                            >
                              <v-radio label="Ativo" value="1"></v-radio>
                              <v-radio label="Bloqueado" value="0"></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col cols="12" md="2">
                            <v-radio-group
                              label="SituaÃ§Ã£o"
                              v-model="objectItemSemestre.situacao_semestre"
                              mandatory
                            >
                              <v-radio label="VisÃ­vel" value="1"></v-radio>
                              <v-radio label="InvisÃ­vel" value="0"></v-radio>
                            </v-radio-group>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-divider class="mt-n10"></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="error" text @click="fecharDialogSemestre()"
                      >Voltar</v-btn
                    >
                    <v-btn color="success" text @click="salvarSemestre()"
                      >Salvar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.status_semestre="{ item }">
            <v-chip
              v-if="item.status_semestre == 1"
              @click="updateStatusSemestre(item)"
              class="ma-0"
              color="#B9F6CA"
              text-color="green"
              small
              >ATIVO</v-chip
            >
            <v-chip
              v-else
              @click="updateStatusSemestre(item)"
              class="ma-0"
              color="#FFCDD2"
              text-color="red"
              small
              >BLOQUEADO</v-chip
            >
          </template>
          <template v-slot:item.situacao_semestre="{ item }">
            <v-chip
              v-if="item.situacao_semestre == 1"
              @click="updateSituacaoSemestre(item)"
              class="ma-1"
              color="#B9F6CA"
              text-color="green"
              small
              >VISÃVEL</v-chip
            >
            <v-chip
              v-else
              @click="updateSituacaoSemestre(item)"
              class="ma-1"
              color="#FFCDD2"
              text-color="red"
              small
              >INVISÃVEL</v-chip
            >
          </template>
          <template v-slot:item.acao="{ item }">
            <v-icon color="primary" class="mr-2" @click="editSemestre(item)"
              >fa-edit</v-icon
            >
            <v-icon
              :disabled="permissoes.btn_excluir_semestre != 1"
              color="error"
              @click="deleteDialogSemestre(item)"
              >fa-trash-alt</v-icon
            >
          </template>
        </v-data-table>
        <br />
        <v-data-table
          hide-default-footer
          :items-per-page="-1"
          :headers="headersPeriodos"
          :items="periodos"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat color="white" dense>
              <v-toolbar-title>Periodos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <div class="flex-grow-1"></div>
              <v-dialog persistent v-model="dialogPeriodo" max-width="1200px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="selectedSemestre == 0 ? true : false"
                    color="primary"
                    v-on="on"
                    small
                    text
                  >
                    <v-icon color="primary" class="mr-2" small>fa-plus</v-icon>
                    PerÃ­odo</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitlePeriodo }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="formPeriodo"
                        v-model="validPeriodo"
                        lazy-validation
                      >
                        <v-row>
                          <v-col cols="6">
                            <v-select
                              v-model="objectItemPeriodo.cod_periodo"
                              :items="dadosPeriodos"
                              item-text="nome"
                              item-value="id"
                              label="Periodo"
                              return-object
                              dense
                              outlined
                            ></v-select>
                          </v-col>

                          <v-col cols="6">
                            <v-select
                              v-model="objectItemPeriodo.codigo_vendedor"
                              :items="vendedores"
                              item-text="nome"
                              item-value="codigo"
                              label="Vendedor"
                              return-object
                              dense
                              outlined
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row class="mt-n5">
                          <v-col cols="12" md="2">
                            <v-radio-group
                              label="Status"
                              v-model="objectItemPeriodo.status_periodo"
                              mandatory
                            >
                              <v-radio label="Ativo" value="1"></v-radio>
                              <v-radio label="Bloqueado" value="0"></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col cols="12" md="2">
                            <v-radio-group
                              label="SituaÃ§Ã£o"
                              v-model="objectItemPeriodo.situacao_periodo"
                              mandatory
                            >
                              <v-radio label="VisÃ­vel" value="1"></v-radio>
                              <v-radio label="InvisÃ­vel" value="0"></v-radio>
                            </v-radio-group>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-divider class="mt-n10"></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="error" text @click="fecharDialogPeriodo()"
                      >Voltar</v-btn
                    >
                    <v-btn color="success" text @click="salvarPeriodo()"
                      >Salvar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.codigo_vendedor="{ item }">{{
            item.nome_vendedor
          }}</template>
          <template v-slot:item.cod_periodo="{ item }">{{
            item.cod_periodo.id
          }}</template>
          <template v-slot:item.status_periodo="{ item }">
            <v-chip
              v-if="item.status_periodo == 1"
              @click="updateStatusPeriodo(item)"
              class="ma-1"
              color="#B9F6CA"
              text-color="green"
              small
              >ATIVO</v-chip
            >
            <v-chip
              v-else
              @click="updateStatusPeriodo(item)"
              class="ma-1"
              color="#FFCDD2"
              text-color="red"
              small
              >BLOQUEADO</v-chip
            >
          </template>
          <template v-slot:item.situacao_periodo="{ item }">
            <v-chip
              v-if="item.situacao_periodo == 1"
              @click="updateSituacaoPeriodo(item)"
              class="ma-1"
              color="#B9F6CA"
              text-color="green"
              small
              >VISÃVEL</v-chip
            >
            <v-chip
              v-else
              @click="updateSituacaoPeriodo(item)"
              class="ma-1"
              color="#FFCDD2"
              text-color="red"
              small
              >INVISÃVEL</v-chip
            >
          </template>
          <template v-slot:item.acao="{ item }">
            <v-icon color="primary" class="mr-2" @click="editPeriodo(item)"
              >fa-edit</v-icon
            >
            <v-icon
              :disabled="permissoes.btn_excluir_periodo != 1"
              color="error"
              @click="deleteDialogPeriodo(item)"
              >fa-trash-alt</v-icon
            >
          </template>
        </v-data-table>
        <br />
        <v-data-table
          hide-default-footer
          :items-per-page="-1"
          :headers="headersRepresentantes"
          :items="representantes"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat color="white" dense>
              <v-toolbar-title>Representantes</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <div class="flex-grow-1"></div>
              <v-dialog
                persistent
                v-model="dialogRepresentante"
                max-width="1200px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="selectedPeriodo == 0 ? true : false"
                    color="primary"
                    v-on="on"
                    small
                    text
                  >
                    <v-icon color="primary" class="mr-2" small>fa-plus</v-icon>
                    Representante</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitleRepresentante }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="formRepresentante"
                        v-model="validRepresentante"
                        lazy-validation
                      >
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              :rules="[(v) => !!v || 'Campo ObrigatÃ³rio']"
                              v-model="
                                objectItemRepresentante.nome_representante
                              "
                              label="Nome"
                              dense
                              clearable
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-row class="mt-n8">
                              <v-col cols="6" md="6">
                                <v-radio-group
                                  label="Status"
                                  v-model="
                                    objectItemRepresentante.status_representante
                                  "
                                  mandatory
                                >
                                  <v-radio label="Ativo" value="1"></v-radio>
                                  <v-radio
                                    label="Bloqueado"
                                    value="0"
                                  ></v-radio>
                                </v-radio-group>
                              </v-col>
                              <v-col cols="6" md="6">
                                <v-radio-group
                                  label="SituaÃ§Ã£o"
                                  v-model="
                                    objectItemRepresentante.situacao_representante
                                  "
                                  mandatory
                                >
                                  <v-radio label="VisÃ­vel" value="1"></v-radio>
                                  <v-radio
                                    label="InvisÃ­vel"
                                    value="0"
                                  ></v-radio>
                                </v-radio-group>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-divider class="mt-n10"></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                      color="error"
                      text
                      @click="fecharDialogRepresentante()"
                      >Voltar</v-btn
                    >
                    <v-btn color="success" text @click="salvarRepresentante()"
                      >Salvar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.status_representante="{ item }">
            <v-chip
              v-if="item.status_representante == 1"
              @click="updateStatusRepresentante(item)"
              class="ma-1"
              color="#B9F6CA"
              text-color="green"
              small
              >ATIVO</v-chip
            >
            <v-chip
              v-else
              @click="updateStatusRepresentante(item)"
              class="ma-1"
              color="#FFCDD2"
              text-color="red"
              small
              >BLOQUEADO</v-chip
            >
          </template>
          <template v-slot:item.situacao_representante="{ item }">
            <v-chip
              v-if="item.situacao_representante == 1"
              @click="updateSituacaoRepresentante(item)"
              class="ma-1"
              color="#B9F6CA"
              text-color="green"
              small
              >VISÃVEL</v-chip
            >
            <v-chip
              v-else
              @click="updateSituacaoRepresentante(item)"
              class="ma-1"
              color="#FFCDD2"
              text-color="red"
              small
              >INVISÃVEL</v-chip
            >
          </template>
          <template v-slot:item.acao="{ item }">
            <v-icon
              color="primary"
              class="mr-2"
              @click="editRepresentante(item)"
              >fa-edit</v-icon
            >
            <v-icon
              :disabled="permissoes.btn_excluir_representante != 1"
              color="error"
              @click="deleteDialogRepresentante(item)"
              >fa-trash-alt</v-icon
            >
          </template>
        </v-data-table>
        <br />
        <v-data-table
          hide-default-footer
          :items-per-page="-1"
          :headers="headersAvisos"
          :items="avisos"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat color="white" dense>
              <v-toolbar-title>Avisos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <div class="flex-grow-1"></div>
              <v-dialog persistent v-model="dialogAviso" max-width="1200px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="typeof selectedPosGraduacao === 'string'"
                    color="primary"
                    v-on="on"
                    small
                    text
                  >
                    <v-icon color="primary" class="mr-2" small>fa-plus</v-icon>
                    Aviso</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitleAviso }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form ref="formAviso" v-model="validAviso">
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="objectItemAviso.titulo_aviso"
                              label="Titulo"
                              dense
                              clearable
                              outlined
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="mt-n6">
                            <v-textarea
                              :rows="10"
                              no-resize
                              v-model="objectItemAviso.mensagem_aviso"
                              label="Mensagem"
                              clearable
                              outlined
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-divider class="mt-n10"></v-divider>
                  <v-card-actions>
                    <div class="flex-grow-1 ma-8"></div>
                    <v-btn color="error" text @click="fecharDialogAviso()"
                      >Voltar</v-btn
                    >
                    <v-btn color="success" text @click="salvarAviso()"
                      >Salvar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.acao="{ item }">
            <v-icon color="primary" class="mr-2" @click="editAviso(item)"
              >fa-edit</v-icon
            >
            <v-icon
              :disabled="permissoes.btn_excluir_aviso != 1"
              color="error"
              @click="deleteDialogAviso(item)"
              >fa-trash-alt</v-icon
            >
          </template>
        </v-data-table>
        <br />
      </div>
    </v-card>
    <v-dialog v-model="dialogExcluirSemestre" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <span class="text-h5"> Deseja realmente excluir este semestre?</span
          ><br /><br />
          <span class="text-h5 font-weight-black">{{
            objectItemSemestre.descri_semestre
          }}</span>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluirSemestre = false"
            >NÃ£o</v-btn
          >
          <v-btn color="error" text @click="deleteSemestre(objectItemSemestre)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogExcluirPeriodo" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <span class="text-h5"> Deseja realmente excluir este Periodo? </span
          ><br /><br />
          <span class="text-h5 font-weight-black">{{
            objectItemPeriodo.nome_periodo
          }}</span>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluirPeriodo = false"
            >NÃ£o</v-btn
          >
          <v-btn color="error" text @click="deletePeriodo(objectItemPeriodo)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluirRepresentante" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <span class="text-h5"
            >Deseja realmente excluir este representante? </span
          ><br /><br />
          <span class="text-h5 font-weight-black">{{
            objectItemRepresentante.nome_representante
          }}</span>
        </v-card-text>
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            text
            @click="dialogExcluirRepresentante = false"
            >NÃ£o</v-btn
          >
          <v-btn
            color="error"
            text
            @click="deleteRepresentante(objectItemRepresentante)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluirAviso" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>
          <span class="text-h5"> Deseja realmente excluir este aviso?</span
          ><br /><br />
          <span class="text-h5 font-weight-black">{{
            objectItemAviso.mensagem_aviso
          }}</span></v-card-text
        >
        <v-divider class="mt-10"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluirAviso = false"
            >NÃ£o</v-btn
          >
          <v-btn color="error" text @click="deleteAviso(objectItemAviso)"
            >Excluir</v-btn
          >
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
import Tabs from "../../../components/academico/TabsGerenciar.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    Tabs,
  },
  data: () => ({
    selectedFaculdade: "",
    selectedPosGraduacao: "",
    selectedSemestre: "",
    selectedPeriodo: "",
    dialogExcluirSemestre: false,
    dialogExcluirPeriodo: false,
    dialogExcluirRepresentante: false,
    dialogExcluirAviso: false,

    headers: [
      { text: "Id", value: "id_semestre" },
      { text: "Semestre/EspecializaÃ§Ã£o", value: "descri_semestre" },
      { text: "Mensagem", value: "msg_semestre", sortable: false },
      { text: "Status", value: "status_semestre", align: "center" },
      { text: "SituaÃ§Ã£o", value: "situacao_semestre", align: "center" },
      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    headersPeriodos: [
      { text: "Id", value: "id_periodo" },
      { text: "PerÃ­odo", value: "nome_periodo" },
      { text: "Vendedor", value: "codigo_vendedor" },
      { text: "Status", value: "status_periodo", align: "center" },
      { text: "SituaÃ§Ã£o", value: "situacao_periodo", align: "center" },
      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    headersRepresentantes: [
      { text: "ID", value: "id_representante" },
      { text: "Periodo", value: "nome_periodo" },
      { text: "Representante", value: "nome_representante" },
      { text: "Status", value: "status_representante", align: "center" },
      { text: "SituaÃ§Ã£o", value: "situacao_representante", align: "center" },
      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    headersAvisos: [
      { text: "ID", value: "id_aviso" },
      { text: "Titulo", value: "titulo_aviso" },
      { text: "Mensagem", value: "mensagem_aviso" },
      {
        text: "AÃ§Ã£o",
        value: "acao",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    dialogSemestre: false,
    dialogPeriodo: false,
    dialogRepresentante: false,
    dialogAviso: false,
    objectIndexSemestre: -1,
    objectIndexPeriodo: -1,
    objectIndexRepresentante: -1,
    objectIndexAviso: -1,
    objectItemSemestre: {
      pos_graduacao: "",
      cod_semestre: "",
      descri_semestre: "",
      msg_semestre: "",
      status_semestre: "0",
      situacao_semestre: "0",
    },
    dadosPeriodos: [
      { id: 1, nome: "DIURNO" },
      { id: 2, nome: "VESPERTINO" },
      { id: 3, nome: "NOTURNO" },
      { id: 4, nome: "INTEGRAL" },
    ],
    objectItemPeriodo: {
      cod_periodo: 0,
      codigo_vendedor: 0,
      status_periodo: "0",
      situacao_periodo: "0",
    },
    objectItemRepresentante: {
      nome_representante: "",
      status_representante: "0",
      situacao_representante: "0",
    },
    objectItemAviso: {
      titulo_aviso: "",
      mensagem_aviso: "",
    },
    validSemestre: false,
    validPeriodo: false,
    validRepresentante: false,
    validAviso: false,
    texto: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.reset();
    this.getPermissao();
    this.getFacudades();
    this.getVendedores();
  },
  computed: {
    ...mapState({
      faculdades: (state) => state.gerenciarFaculdades.faculdades,
      semestres: (state) => state.gerenciarSemestres.semestres,
      periodos: (state) => state.gerenciarPeriodos.periodos,
      representantes: (state) => state.gerenciarRepresentantes.representantes,
      avisos: (state) => state.gerenciarAvisos.avisos,
      vendedores: (state) => state.gerenciarPeriodos.vendedores,
      error: (state) => state.gerenciarSemestres.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
    formTitleSemestre() {
      if (this.objectItemSemestre.pos_graduacao == 0) {
        this.texto = "GraduaÃ§Ã£o";
      } else {
        this.texto = "EspecializaÃ§Ã£o";
      }
      return this.objectIndexSemestre === -1
        ? "Adicionar" + " " + this.texto
        : "Editar" + " " + this.texto;
    },
    formTitlePeriodo() {
      return this.objectIndexPeriodo === -1
        ? "Adicionar Periodo"
        : "Editar Periodo";
    },
    formTitleRepresentante() {
      return this.objectIndexRepresentante === -1
        ? "Adicionar Representante"
        : "Editar Representante";
    },
    formTitleAviso() {
      return this.objectIndexAviso === -1 ? "Adicionar Aviso" : "Editar Aviso";
    },
  },
  methods: {
    ...mapActions([
      "get_faculdades",
      "get_semestres",
      "get_periodos",
      "get_vendedores",
      "get_all_representantes",
      "get_avisos",
      "create_semestre",
      "create_periodo",
      "create_representante",
      "create_aviso",
      "update_semestre",
      "update_periodo",
      "update_representante",
      "update_aviso",
      "update_status_semestre",
      "update_status_periodo",
      "update_status_representante",
      "update_situacao_semestre",
      "update_situacao_periodo",
      "update_situacao_representante",
      "delete_semestre",
      "delete_periodo",
      "delete_representante",
      "delete_aviso",
    ]),
    ...mapMutations([
      "set_snackbar",
      "set_loading",
      "clean_faculdade",
      "clean_semestre",
      "clean_periodo",
      "clean_representante",
      "clean_aviso",
    ]),
    reset() {
      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.selectedPeriodo = "";
      this.clean_faculdade();
      this.clean_semestre();
      this.clean_periodo();
      this.clean_representante();
      this.clean_aviso();
      this.getFacudades();
    },
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    fecharDialogSemestre() {
      this.dialogSemestre = false;
      this.objectIndexSemestre = -1;
      this.objectItemSemestre = Object.assign({}, {});
    },
    fecharDialogPeriodo() {
      this.dialogPeriodo = false;
      this.objectIndexPeriodo = -1;
      this.objectItemPeriodo = Object.assign({}, {});
    },
    fecharDialogRepresentante() {
      this.dialogRepresentante = false;
      this.objectIndexRepresentante = -1;
      this.objectItemRepresentante = Object.assign({}, {});
    },
    fecharDialogAviso() {
      this.dialogAviso = false;
      this.objectIndexAviso = -1;
      this.objectItemAviso = Object.assign({}, {});
    },
    async salvarSemestre() {
      if (this.$refs.formSemestre.validate()) {
        if (this.objectIndexSemestre > -1) {
          let obj = {
            semestre: this.objectItemSemestre,
            id_faculdade: this.selectedFaculdade,
          };
          this.set_loading(true);
          await this.update_semestre(obj);
          this.set_loading(false);
          this.fecharDialogSemestre();
          this.getSemestres();
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
              msg: "Semestre editado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } else {
          // if (!this.semestres.length) {
          //   this.set_snackbar({
          //     show: true,
          //     msg: "Ã‰ necessario selecionar GraduaÃ§Ã£o ou EspecializaÃ§Ã£o!",
          //     type: "warning",
          //     time: 0,
          //   });
          // } else {
          this.objectItemSemestre.pos_graduacao = this.selectedPosGraduacao;
          let obj = {
            semestre: this.objectItemSemestre,
            id_faculdade: this.selectedFaculdade,
          };
          this.set_loading(true);
          await this.create_semestre(obj);
          this.set_loading(false);
          this.fecharDialogSemestre();
          this.getSemestres();
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
              msg: "Semestre criado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
          // }
        }
      }
    },
    async salvarPeriodo() {
      if (this.$refs.formPeriodo.validate()) {
        if (this.objectIndexPeriodo > -1) {
          let obj = {
            periodo: this.objectItemPeriodo,
            id_faculdade: this.selectedFaculdade,
            id_semestre: this.selectedSemestre,
          };
          this.set_loading(true);
          await this.update_periodo(obj);
          this.set_loading(false);
          this.fecharDialogPeriodo();
          this.getPeriodos();
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
              msg: "Periodo editado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } else {
          let obj = {
            periodo: this.objectItemPeriodo,
            id_faculdade: this.selectedFaculdade,
            id_semestre: this.selectedSemestre,
          };
          this.set_loading(true);
          await this.create_periodo(obj);
          this.set_loading(false);
          this.fecharDialogPeriodo();
          this.getPeriodos();
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
              msg: "Periodo criado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        }
      }
    },
    async salvarRepresentante() {
      if (this.$refs.formRepresentante.validate()) {
        if (this.objectIndexRepresentante > -1) {
          let obj = {
            representante: this.objectItemRepresentante,
          };
          this.set_loading(true);
          await this.update_representante(obj);
          this.set_loading(false);
          this.fecharDialogRepresentante();
          this.onChangePeriodo();
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
              msg: "Representante editado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } else {
          let obj = {
            representante: this.objectItemRepresentante,
            id_faculdade: this.selectedFaculdade,
            id_semestre: this.selectedSemestre,
            periodo: this.selectedPeriodo.id,
          };
          this.set_loading(true);
          await this.create_representante(obj);
          this.set_loading(false);
          this.fecharDialogRepresentante();
          this.onChangePeriodo();
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
              msg: "Representante criado com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        }
      }
    },
    async salvarAviso() {
      if (this.objectItemAviso.titulo_aviso == null) {
        this.objectItemAviso.titulo_aviso = "";
      }
      if (this.objectItemAviso.mensagem_aviso == null) {
        this.objectItemAviso.mensagem_aviso = "";
      }
      // if (this.$refs.formAviso.validate()) {
      if (this.objectIndexAviso > -1) {
        let obj = {
          aviso: this.objectItemAviso,
          id_faculdade: this.selectedFaculdade,
          id_semestre: this.selectedSemestre,
        };
        this.set_loading(true);
        await this.update_aviso(obj);
        this.set_loading(false);
        this.fecharDialogAviso();
        this.getAvisos();
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
            msg: "Aviso editado com sucesso!",
            type: "success",
            time: 3000,
          });
        }
      } else {
        let obj = {
          aviso: this.objectItemAviso,
          id_faculdade: this.selectedFaculdade,
          id_semestre: this.selectedSemestre,
        };
        this.set_loading(true);
        await this.create_aviso(obj);
        this.set_loading(false);
        this.fecharDialogAviso();
        this.getAvisos();
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
            msg: "Aviso criado com sucesso!",
            type: "success",
            time: 3000,
          });
        }
      }
      // }
    },
    editSemestre(item) {
      this.objectIndexSemestre = this.semestres.indexOf(item);
      this.objectItemSemestre = Object.assign({}, item);
      this.dialogSemestre = true;
    },
    editPeriodo(item) {
      this.objectIndexPeriodo = this.periodos.indexOf(item);
      this.objectItemPeriodo = Object.assign({}, item);
      this.dialogPeriodo = true;
    },
    editRepresentante(item) {
      this.objectIndexRepresentante = this.representantes.indexOf(item);
      this.objectItemRepresentante = Object.assign({}, item);
      this.dialogRepresentante = true;
    },
    editAviso(item) {
      this.objectIndexAviso = this.avisos.indexOf(item);
      this.objectItemAviso = Object.assign({}, item);
      this.dialogAviso = true;
    },
    deleteDialogSemestre(item) {
      this.objectIndexSemestre = this.semestres.indexOf(item);
      this.objectItemSemestre = Object.assign({}, item);
      this.dialogExcluirSemestre = true;
    },
    deleteDialogPeriodo(item) {
      this.objectIndexPeriodo = this.periodos.indexOf(item);
      this.objectItemPeriodo = Object.assign({}, item);
      this.dialogExcluirPeriodo = true;
    },
    deleteDialogRepresentante(item) {
      this.objectIndexRepresentante = this.representantes.indexOf(item);
      this.objectItemRepresentante = Object.assign({}, item);
      this.dialogExcluirRepresentante = true;
    },
    deleteDialogAviso(item) {
      this.objectIndexAviso = this.avisos.indexOf(item);
      this.objectItemAviso = Object.assign({}, item);
      this.dialogExcluirAviso = true;
    },
    async deleteSemestre() {
      this.dialogExcluirSemestre = false;
      this.set_loading(true);
      await this.delete_semestre(this.objectItemSemestre.id_semestre);
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
          msg: "Semestre excluÃ­do com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.selectedSemestre = "";
      this.selectedPeriodo = "";
      this.clean_periodo();
      this.clean_representante();
      this.clean_aviso();
      this.getSemestres();
    },
    async deletePeriodo() {
      this.dialogExcluirPeriodo = false;
      this.set_loading(true);
      await this.delete_periodo(this.objectItemPeriodo.id_periodo);
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
          msg: "Periodo excluÃ­do com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getPeriodos();
    },
    async deleteRepresentante() {
      this.dialogExcluirRepresentante = false;
      this.set_loading(true);
      await this.delete_representante(
        this.objectItemRepresentante.id_representante
      );
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
          msg: "Representante excluÃ­do com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.onChangePeriodo();
    },
    async deleteAviso() {
      this.dialogExcluirAviso = false;
      this.set_loading(true);
      await this.delete_aviso(this.objectItemAviso.id_aviso);
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
          msg: "Aviso excluÃ­do com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getPeriodos();
    },
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
      this.selectedPeriodo = "";
      this.clean_semestre();
      this.clean_periodo();
      this.clean_representante();
      this.clean_aviso();
    },
    async onChangeSelect() {
      this.selectedSemestre = "";
      this.selectedPeriodo = "";
      this.clean_semestre();
      this.clean_periodo();
      this.clean_representante();
      this.clean_aviso();
      this.getSemestres();
    },
    async onChangeSemestre() {
      this.selectedPeriodo = "";
      this.clean_representante();
      this.clean_aviso();
      this.getPeriodos();
    },
    async onChangePeriodo() {
      let obj = {
        faculdade: this.selectedFaculdade,
        semestre: this.selectedSemestre,
        periodo: this.selectedPeriodo.id,
      };
      this.set_loading(true);
      await this.get_all_representantes(obj);
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
    async updateStatusSemestre(item) {
      this.set_loading(true);
      await this.update_status_semestre(item);
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
      this.getSemestres();
    },
    async updateStatusPeriodo(item) {
      this.set_loading(true);
      await this.update_status_periodo(item);
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
      this.getPeriodos();
    },
    async updateStatusRepresentante(item) {
      this.set_loading(true);
      await this.update_status_representante(item);
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
      this.onChangePeriodo();
    },
    async updateSituacaoSemestre(item) {
      this.set_loading(true);
      await this.update_situacao_semestre(item);
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
          msg: "SituaÃ§Ã£o editada com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getSemestres();
    },
    async updateSituacaoPeriodo(item) {
      this.set_loading(true);
      await this.update_situacao_periodo(item);
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
          msg: "SituaÃ§Ã£o editada com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.getPeriodos();
    },
    async updateSituacaoRepresentante(item) {
      this.set_loading(true);
      await this.update_situacao_representante(item);
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
          msg: "SituaÃ§Ã£o editada com sucesso!",
          type: "success",
          time: 3000,
        });
      }
      this.onChangePeriodo();
    },
    async getFacudades() {
      if (this.faculdades.length === 0) {
        this.set_loading(true);
        await this.get_faculdades();
        this.set_loading(false);
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        }
      }
    },
    async getSemestres() {
      let obj = {
        faculdade: this.selectedFaculdade,
        graduacao: this.selectedPosGraduacao,
      };
      this.set_loading(true);
      await this.get_semestres(obj);
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
    async getPeriodos() {
      let obj = {
        faculdade: this.selectedFaculdade,
        semestre: this.selectedSemestre,
      };
      this.set_loading(true);
      await this.get_periodos(obj);
      await this.get_avisos(obj);
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
    async getAvisos() {
      let obj = {
        faculdade: this.selectedFaculdade,
        semestre: this.selectedSemestre,
      };
      this.set_loading(true);

      await this.get_avisos(obj);
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
    async getVendedores() {
      if (this.faculdades.length === 0) {
        this.set_loading(true);
        await this.get_vendedores();
        this.set_loading(false);
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
            time: 0,
          });
        }
      }
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "gerenciar_site",
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
<style scoped></style>
