<template>
  <v-container>
    <div v-if="!proximaTela">
      <v-row justify="center" class="custom-row">
        <v-col cols="8">
          <v-autocomplete
            auto-select-first
            autocomplete="off"
            v-model="selectedFaculdade"
            :items="faculdades"
            class="text-uppercase"
            label="Selecione a Faculdade"
            item-text="nome_exibicao_faculdade"
            return-object
            @change="onChange()"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="8">
          <v-select
            v-model="selectedPosGraduacao"
            @change="onChangeGraduacao()"
            :items="[
              { text: 'GRADUAÃ‡ÃƒO', value: 0 },
              { text: 'ESPECIALIZAÃ‡ÃƒO', value: 1 },
            ]"
            class="text-uppercase"
            label="GraduaÃ§Ã£o ou EspecializaÃ§Ã£o"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="8">
          <v-select
            v-model="selectedSemestre"
            :items="semestres"
            class="text-uppercase"
            label="Selecione o Semestre"
            item-text="descri_semestre"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col cols="8">
          <v-text-field
            autocomplete="off"
            @keypress.enter="avancar()"
            v-model="nome_exibicao"
            label="NOME DA LISTA"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" class="custom-row">
        <v-col align-self="start" class="text-center" cols="8">
          <v-btn color="success" @click="avancar()">AvanÃ§ar</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div v-if="this.allLocalList.length > 0" class="ma-3 text-center">
            <h4>Listas NÃ£o Salvas</h4>

            <div class="mt-3" v-for="lista in allLocalList" :key="lista.key">
              <v-row>
                <v-btn
                  @click="
                    proximaTela = true;
                    checkpoint(lista.key);
                  "
                  color="blue lighten-4"
                  height="80px"
                >
                  {{ lista.key.split("_")[1] }}
                  <br />
                  {{ lista.key.split("_")[2] }}
                  <br />
                  {{ lista.key.split("_")[3] }}
                </v-btn>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div v-if="proximaTela">
      <v-card style="margin-bottom: 90px !important">
        <v-card-title>
          {{ this.selectedFaculdade.nome_exibicao_faculdade }} -
          {{ this.selectedSemestre.descri_semestre }} - {{ this.nome_exibicao }}
          <v-btn class="ml-3 error" @click="voltar()">Voltar</v-btn>
        </v-card-title>
        <v-banner single-line class="blue lighten-5" sticky width="100%">
          <div class="blue lighten-5" style="width: 100%">
            <v-card class="blue lighten-5">
              <v-card-title style="padding: 0px 0px 0px !important">
                <v-row>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="descricao"
                      v-on:keyup="findProduto()"
                      prepend-icon="fa-edit"
                      label="Buscar por descriÃ§Ã£o"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="codigo"
                      v-on:keyup="findProdutoByCod()"
                      prepend-icon="fa-search"
                      label="Buscar por cÃ³digo"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn v-if="toggle" color="warning" @click="toggle = false"
                      >Fechar</v-btn
                    >
                    <v-btn
                      v-else-if="produtos.length > 0"
                      color="primary"
                      @click="toggle = true"
                      >Mostrar</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-title>

              <v-data-table
                v-if="toggle"
                fixed-header
                dense
                :headers="headersProdutos"
                height="150"
                hide-default-footer
                :items="produtos"
                disable-pagination
                class="elevation-1"
              >
                <template v-slot:item.saldo="{ item }"
                  ><span v-if="permissoes.ver_saldo == 1">{{
                    item.saldo
                  }}</span></template
                >
                <template v-slot:item.valor="{ item }"
                  ><span v-if="permissoes.ver_preco == 1"
                    >R$ {{ formatValues(item.valor) }}</span
                  ></template
                >
                <template v-slot:item.qtd="{ item }">
                  <v-text-field
                    class="input-qtd-produtos input-no-details"
                    dense
                    @click:append="addOrRemoveItem(item)"
                    @keypress.enter="addOrRemoveItem(item)"
                    :append-icon="
                      item.added
                        ? 'fa-times error--text'
                        : 'fa-check success--text'
                    "
                    v-model="item.qtd"
                  ></v-text-field>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-banner>
        <v-divider></v-divider>
        <div class="ml-3 mr-3">
          <v-row class="custom-row">
            <v-col cols="12" md="3">
              <v-btn @click="aplicarValorSistema()" color="primary" small
                >Aplicar Valor de Sistema</v-btn
              >
            </v-col>
          </v-row>
        </div>
        <table
          class="table table-sm table-hover table-bordered"
          style="margin-bottom: 10rem"
        >
          <thead>
            <tr class="text-center">
              <th style="width: 14%" scope="col">CÃ³digo</th>
              <th style="width: 5%" scope="col">Qtd</th>
              <th style="width: 33%" scope="col">DescriÃ§Ã£o</th>
              <th
                v-if="permissoes.ver_preco == 1"
                style="width: 12%"
                scope="col"
              >
                Valor
              </th>
              <th style="width: 14%" scope="col">Marca</th>
              <th style="width: 14%" scope="col">Obs</th>
              <th style="width: 8%" scope="col">Disp/Op</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in orderedItens"
              :key="item.id"
              @contextmenu.prevent="$refs.menu.open($event, item)"
              class="mt-3"
              :id="'item' + item.id"
              :class="corLinha(item)"
            >
              <v-dialog
                v-model="item.dialogSenhaUsuario"
                persistent
                max-width="400px"
              >
                <v-card>
                  <v-card-title>
                    <span class="headline">Senha ObrigatÃ³ria</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row justify="center">
                        <b>Entre com sua senha de confirmaÃ§Ã£o.</b>
                      </v-row>
                      <v-row justify="center">
                        <v-col cols="8">
                          <v-text-field
                            autocomplete="off"
                            v-model="senhaUsuario"
                            label="Senha"
                            type="password"
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions class="mt-n10">
                    <v-spacer></v-spacer>
                    <v-btn class="error" @click="cancelarDialogSenha(item)"
                      >Cancelar</v-btn
                    >
                    <v-btn class="success" @click="checkSenhaUsuario(item)"
                      >AvanÃ§ar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <td scope="row">
                <div v-if="!item.titulo">
                  <input
                    maxlength="14"
                    :ref="'codigo'"
                    type="text"
                    class="form-control text-uppercase"
                    placeholder="Cod"
                    aria-label="Cod"
                    aria-describedby="basic-addon2"
                    :value="item.cod"
                    @keyup="
                      $event.target.value.length == 0
                        ? (item.disponivel = 0)
                        : ''
                    "
                    @keyup.13="getProduto($event.target.value, item)"
                  />
                  <!-- <v-row justify="center" >
                    <v-btn                    
                      :disabled="!item.image_path"
                      small
                      class="ma-1"
                      color="primary"
                      icon
                      @click="showImage($event, item.image_path)"
                    >
                      <v-icon dark right>fas fa-camera</v-icon>
                    </v-btn> 
                    </v-row> -->
                  <div v-if="item.marcaOpcional">
                    <br />
                    <b>Codigo Marca 2</b>
                    <br />
                    <input
                      type="text"
                      class="form-control white--text text-uppercase"
                      :class="item.checkedMarca2 ? 'bg-primary' : 'bg-warning'"
                      :value="item.codMarcaOpcional"
                      @keyup.13="getMarcaOp($event.target.value, item)"
                      @keyup="checkIfCheckedMarca2(item)"
                      @change="checkIfCheckedMarca2(item)"
                      @click="checkIfCheckedMarca2(item)"
                      @blur="checkIfCheckedMarca2(item)"
                      @focus="checkIfCheckedMarca2(item)"
                    />
                     <!-- <v-row justify="center" >
                      <v-btn
                        :disabled="!item.imagePathOpcional"
                        small
                        class="ma-1"
                        color="primary"
                        icon
                        @click="showImage($event, item.imagePathOpcional)"
                      >
                        <v-icon dark right>fas fa-camera</v-icon>
                      </v-btn>   
                     </v-row>                -->
                  </div>
                  <!-- <hr class="mt-n1" /> -->
                  <h4 class="mt-1 text-center">{{ item.id + 1 }}</h4>
                </div>
              </td>
              <td style="max-width: 98px" scope="row">
                <div v-if="!item.titulo">
                  <input
                    type="number"
                    class="form-control text-center"
                    :class="item.checkedQtd ? 'bg-white' : 'bg-warning'"
                    placeholder="Qtd"
                    aria-label="Qtd"
                    aria-describedby="basic-addon2"
                    :value="item.qtd"
                    @input="item.qtd = $event.target.value"
                    @change="
                      calcTotalItens();
                      checkIfCheckedQtd(item);
                    "
                    @keyup="
                      calcTotalItens();
                      checkIfCheckedQtd(item);
                    "
                    @click="
                      calcTotalItens();
                      checkIfCheckedQtd(item);
                    "
                    maxlength="2"
                    min="1"
                    max="99"
                  />
                  <div v-if="permissoes.ver_saldo == 1">
                    <b>Saldo:</b>
                    <span
                      :class="item.saldo <= 0 ? 'text-danger' : 'text-saldo'"
                      >{{ item.saldo }}</span
                    >
                  </div>
                  <!-- <div v-if="permissoes.input_lucro_site == 1" class="mt-3">
                    <div class="text-center">
                      <b>Lucro:</b>
                      <br />
                      <span>{{item.lucro}}%</span>
                    </div>
                  </div>-->
                </div>
              </td>
              <td style="max-width: 400px" scope="row">
                <div
                  class="text-center text-uppercase title"
                  v-if="item.titulo"
                >
                  <b>Titulo</b>
                  <div
                    class="border border-dark text-uppercase"
                    contenteditable="true"
                    v-html="item.descricao_site"
                    @focusout="item.descricao_site = $event.target.innerText"
                  ></div>
                </div>

                <div v-else>
                  <b>DescriÃ§Ã£o Sistema</b>
                  <br />
                  <div>{{ item.descricao }}</div>
                  <hr />
                  <b>DescriÃ§Ã£o Site</b>
                  <br />
                  <div
                    class="border border-dark text-uppercase"
                    :class="item.markDescricao ? 'bg-warning' : 'bg-white'"
                    v-on:click="item.markDescricao = false"
                    @focusout="item.descricao_site = $event.target.innerText"
                    contenteditable="true"
                    v-html="item.descricao_site"
                  ></div>

                  <div v-if="item.marcaOpcional">
                    <hr />
                    <b>DescriÃ§Ã£o Marca 2</b>
                    <br />
                    <div class="primary white--text">
                      {{ item.descricaoMarcaOpcional }}
                    </div>
                  </div>
                  <div v-if="item.kit">
                    <hr />
                    <b>Conteudo do Kit</b>
                    <br />
                    <div
                      v-for="row in item.rowsKits"
                      :key="row.porra"
                      class="row no-gutters mt-3"
                    >
                      <div class="col-3">
                        <input
                          type="number"
                          class="form-control text-center bg-warning"
                          placeholder="Qtd"
                          :value="row.qtd"
                          @input="row.qtd = $event.target.value"
                          min="1"
                          max="99"
                        />
                      </div>
                      <div class="col-9">
                        <div class="input-group input-group-sm">
                          <textarea
                            :value="row.descricao"
                            @input="row.descricao = $event.target.value"
                            class="form-control bg-warning"
                            rows="2"
                            placeholder="DescriÃ§Ã£o Conteudo"
                          ></textarea>
                          <div class="input-group-append">
                            <button
                              v-if="row.button == '+'"
                              @click="addRowKit(item)"
                              class="btn btn-outline-secondary"
                              type="button"
                            >
                              +
                            </button>
                            <button
                              v-if="row.button == '-'"
                              @click="removeRowKit(item)"
                              class="btn btn-outline-secondary"
                              type="button"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td
                v-if="permissoes.ver_preco == 1"
                class="text-center"
                scope="row"
              >
                <div v-if="!item.titulo">
                  <b>Valor Sistema</b>
                  <br />
                  <div>R$ {{ item.valor }}</div>
                  <hr />
                  <b>Valor Site</b>
                  <br />
                  <money
                    maxlength="10"
                    class="form-control text-center"
                    :class="item.checked ? 'bg-white' : 'bg-warning'"
                    v-model="item.valor_site"
                    v-bind="money"
                    @change="
                      calcTotalItens();
                      checkIfChecked(item);
                    "
                    @keyup.native="
                      calcTotalItens();
                      checkIfChecked(item);
                    "
                    @click="
                      calcTotalItens();
                      checkIfChecked(item);
                    "
                    @blur.native="
                      calcTotalItens();
                      checkIfChecked(item);
                      checkLimiteValorSite($event.target.value, item);
                    "
                    @focus="
                      calcTotalItens();
                      checkIfChecked(item);
                    "
                  ></money>
                  <div v-if="item.marcaOpcional">
                    <hr />
                    <b>Valor Marca 2</b>
                    <br />
                    <money
                      maxlength="10"
                      class="form-control white--text primary text-center"
                      v-model="item.valorMarcaOpcional"
                      v-bind="money"
                      @change="calcTotalItens()"
                      @keyup.native="calcTotalItens()"
                      @click="calcTotalItens()"
                      @blur.native="
                        checkLimiteValorMarcaOpcional($event.target.value, item)
                      "
                    ></money>
                  </div>
                </div>
              </td>
              <td style="max-width: 166px" scope="row" class="align-middle">
                <div v-if="!item.titulo">
                  <b>Marca Principal</b>
                  <br />
                  <div
                    class="border border-dark text-uppercase"
                    contenteditable="true"
                    v-html="item.marca"
                    @focusout="item.marca = $event.target.innerText"
                  ></div>
                  <div v-if="item.marcaOpcional">
                    <hr />
                    <b>Marca 2</b>
                    <br />
                    <div
                      class="border border-dark white--text primary text-uppercase"
                      contenteditable="true"
                      v-html="item.nomeMarcaOpcional"
                      @focusout="
                        item.nomeMarcaOpcional = $event.target.innerText
                      "
                    ></div>
                  </div>
                  <!-- cores -->
                  <div class="placeholder-color" v-if="item.cor">
                    <div
                      v-for="row in item.rowsCores"
                      :key="row.porra"
                      class="input-group input-group-sm"
                    >
                      <input
                        @keyup.13="getLuva($event.target.value, row)"
                        placeholder="CÃ³digo"
                        :value="row.codigo"
                        @input="row.codigo = $event.target.value"
                        type="text"
                        class="form-control text-uppercase bg-grey text-white"
                      />

                      <input
                        placeholder="Cor"
                        type="text"
                        :value="row.cor"
                        @input="row.cor = $event.target.value"
                        class="form-control text-uppercase bg-grey text-white"
                      />
                      <div class="input-group-append">
                        <button
                          v-if="row.button == '+'"
                          @click="addRowCor(item)"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          +
                        </button>
                        <button
                          v-if="row.button == '-'"
                          @click="removeRowCor(item)"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          -
                        </button>
                      </div>
                      <div class="input-group input-group-sm">
                        <v-row no-gutters>
                          <v-col cols="2" class="bg-grey ">
                            <!-- <v-btn       
                            class="ml-1 mt-2"                     
                             :disabled="!row.image_path"
                              small
                              color="white"
                              icon
                              @click="showImage($event, row.image_path)"
                            >
                              <v-icon dark>fas fa-camera</v-icon>
                            </v-btn> -->
                          </v-col>
                          <v-col cols="10">
                            <textarea
                          readonly
                          :value="row.descricao"
                          class="form-control bg-grey text-white"
                          rows="2"
                          placeholder="DescriÃ§Ã£o Sistema"
                        ></textarea>
                          </v-col>                          
                        </v-row>                        
                      </div>                                                       
                    </div>
                  </div>
                  <!-- /cores -->
                  <div class="placeholder-color" v-if="item.luva">
                    <div
                      v-for="row in item.rowsLuvas"
                      :key="row.porra"
                      class="input-group input-group-sm"
                    >
                      <input
                        @keyup.13="getLuva($event.target.value, row)"
                        placeholder="CÃ³digo"
                        :value="row.codigo"
                        @input="row.codigo = $event.target.value"
                        type="text"
                        class="form-control text-uppercase bg-success text-white"
                      />

                      <input
                        placeholder="Tamanho"
                        type="text"
                        :value="row.tamanho"
                        @input="row.tamanho = $event.target.value"
                        class="form-control text-uppercase bg-success text-white"
                      />
                      <div class="input-group-append">
                        <button
                          v-if="row.button == '+'"
                          @click="addRowLuva(item)"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          +
                        </button>
                        <button
                          v-if="row.button == '-'"
                          @click="removeRowLuva(item)"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          -
                        </button>
                      </div>
                      <div class="input-group input-group-sm">
                        <textarea
                          readonly
                          :value="row.descricao"
                          class="form-control bg-success text-white"
                          rows="2"
                          placeholder="DescriÃ§Ã£o Sistema"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td style="max-width: 166px" scope="row" class="align-middle">
                <div
                  v-if="!item.titulo"
                  class="border border-dark text-uppercase"
                  contenteditable="true"
                  v-html="item.obs_item"
                  @focusout="item.obs_item = $event.target.innerText"
                ></div>
              </td>

              <td scope="row">
                <div v-if="!item.titulo">
                  <b-form-checkbox
                    switch
                    @input="calcTotalItens()"
                    v-model="item.disponivel"
                    :value="1"
                    :unchecked-value="0"
                  >
                    <span class="success--text" v-if="item.disponivel == '1'">
                      DisponÃ­vel:
                      <b>SIM</b>
                    </span>
                    <span class="error--text" v-else>
                      DisponÃ­vel:
                      <b>NÃ‚O</b>
                    </span>
                  </b-form-checkbox>
                  <b-form-checkbox
                    switch
                    :value="1"
                    :unchecked-value="0"
                    v-model="item.opcional"
                    @input="
                      calcTotalItens();
                      callDestacarOpcionais();
                    "
                  >
                    <span class="success--text" v-if="item.opcional == '1'">
                      Opcional:
                      <b>SIM</b>
                    </span>
                    <span class="error--text" v-else>
                      Opcional:
                      <b>NÃ‚O</b>
                    </span>
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-if="permissoes.ver_trava_qtd == 1"
                    v-model="item.trava_qtd_item"
                    :value="1"
                    :unchecked-value="0"
                    >Travar Qtd</b-form-checkbox
                  >
                  <!-- <b-form-checkbox
                    v-if="item.cod && item.image_path"
                    v-model="item.imagem"
                    :value="1"
                    :unchecked-value="0"
                    >Mostrar img</b-form-checkbox
                  > -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </v-card>
      <v-footer style="padding-left: 260px" fixed>
        <v-row>
          <!-- <v-col cols="12" md="2" v-if="permissoes.input_lucro_site == 1 && permissoes.input_lucro_sistema == 1">
            <div>
              <b class="mr-1">Lucro Site:</b>
              <span>{{lucroSite}}%</span>
            </div>
            <div>
              <b class="mr-1">Lucro Sistema:</b>
              <span>{{lucroSistema}}%</span>
            </div>
          </v-col>-->
          <v-col cols="12" md="3">
            <div v-if="permissoes.ver_preco == 1">
              <div>
                <b class="mr-1">Total Site:</b>
                <span>R$ {{ formatValues(valorTotalSite) }}</span>
              </div>
              <div>
                <b class="mr-1">Total Sistema:</b>
                <span>R$ {{ formatValues(valorTotalSistema) }}</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div>
              <b class="mr-1">Itens:</b>
              <span>{{ totalItens }}</span>
            </div>
            <div>
              <b class="mr-1">Opcionais:</b>
              <span>{{ totalItensOpcionais }}</span>
            </div>
          </v-col>
          <v-divider vertical light></v-divider>
          <v-col cols="12" md="2">
            <div v-if="permissoes.ver_desconto_geral == 1">
              <v-text-field
                @keypress.enter="callDescontoGeral()"
                @click="$event.target.select()"
                v-model="descontoGeral"
                label="Desconto Geral"
                class="input-qtd-produtos"
                suffix="%"
              ></v-text-field>
              <v-btn
                v-if="temDesconto"
                class="ml-3 warning"
                @click="callDescontoGeral()"
                >Resetar</v-btn
              >
              <v-btn v-else class="ml-3 primary" @click="callDescontoGeral()"
                >Aplicar</v-btn
              >
            </div>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-col cols="3">
                <!-- v-if="permissoes.ver_salvar_p_teste == 1" -->
                <v-btn class="success" @click="dialogSalvar = true"
                  >Salvar</v-btn
                >
              </v-col>
              <v-col cols="3">
                <v-btn class="error" @click="voltar()">Voltar</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn v-if="temStorage" class="error" @click="removeTemp()"
                  >Remover Lista</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn class="primary" @click="salvarTemp()"
                  >Salvar e continuar depois</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-footer>
      <!-- menu -->
      <vue-context ref="menu">
        <v-list slot-scope="child" v-if="child.data">
          <v-list-item>
            <v-list-item-title @click="addRow(child.data)">
              <v-btn icon color="success" small>
                <v-icon>fa-plus</v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              !child.data.titulo &&
              !child.data.cor &&
              !child.data.luva &&
              !child.data.marcaOpcional
            "
          >
            <v-list-item-title @click="child.data.marcaOpcional = true">
              <v-btn text color="primary" small>Marca 2</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.marcaOpcional">
            <v-list-item-title>
              <v-btn
                @click="child.data.marcaOpcional = false"
                text
                color="primary"
                small
                >Remover Marca 2</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              !child.data.titulo &&
              !child.data.cor &&
              !child.data.luva &&
              !child.data.kit
            "
          >
            <v-list-item-title>
              <v-btn @click="child.data.kit = true" text color="warning" small
                >Ã¨ um KIT</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.kit">
            <v-list-item-title>
              <v-btn @click="child.data.kit = false" text color="warning" small
                >NÃ£o Ã¨ um KIT</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              !child.data.titulo &&
              !child.data.cor &&
              !child.data.luva &&
              !child.data.marcaOpcional &&
              !child.data.kit
            "
          >
            <v-list-item-title>
              <v-btn @click="child.data.cor = true" text color="grey" small
                >CORES</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.cor">
            <v-list-item-title class="primary--text">
              <v-btn @click="child.data.cor = false" text color="grey" small
                >Remover CORES</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              !child.data.titulo &&
              !child.data.cor &&
              !child.data.luva &&
              !child.data.marcaOpcional &&
              !child.data.kit
            "
          >
            <v-list-item-title>
              <v-btn @click="child.data.luva = true" text color="success" small
                >Ã¨ uma LUVA</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.luva">
            <v-list-item-title class="primary--text">
              <v-btn @click="child.data.luva = false" text color="success" small
                >NÃ£o Ã¨ uma LUVA</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="
              !child.data.titulo &&
              !child.data.cor &&
              !child.data.luva &&
              !child.data.marcaOpcional &&
              !child.data.kit
            "
          >
            <v-list-item-title class="primary--text">
              <v-btn @click="titulo(child.data)" text color="primary" small
                >Titulo</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.titulo">
            <v-list-item-title class="primary--text">
              <v-btn
                @click="child.data.titulo = false"
                text
                color="primary"
                small
                >NÃ£o Ã© Titulo</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn text color="primary" small>Destacar</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                @click="removeRowDialog(child.data)"
                icon
                color="error"
                small
              >
                <v-icon>fa-minus</v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </vue-context>
      <!-- /menu -->
      <v-dialog v-model="itemRepetidoDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Item Repetido</v-card-title>
          <v-card-text
            >O Item {{ objectItem.codigo }} - {{ objectItem.descricao }} jÃ¡ se
            encontra na lista, o que deseja fazer?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="itemRepetidoDialog = false"
              >Voltar</v-btn
            >
            <v-btn color="primary" text @click="somarItemRepetido(objectItem)"
              >Somar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogSalvar" persistent width="290">
        <v-card>
          <v-card-title class="headline">Deseja salvar Lista?</v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div class="text-center">
              <v-btn color="error" @click="dialogSalvar = false">NÃ£o</v-btn>
              <v-btn color="success" @click="salvarLista()">Sim</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteRowDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
          <v-card-text>
            <b
              v-if="
                !objectItem.cod &&
                objectItem.descricao_site &&
                objectItem.titulo
              "
              >Tem certeza que deseja remover este Titulo?</b
            >
            <b
              v-if="
                !objectItem.cod &&
                !objectItem.disponivel &&
                objectItem.titulo == false
              "
              >Tem certeza que deseja remover este item?</b
            >
            <b v-if="objectItem.cod"
              >Tem certeza que deseja remover este item?</b
            >
            <br />
            <br />
            <v-row no-gutters>
              <v-col v-if="objectItem.cod" cols="12" md="3" lg="3">
                <b class="uppercase">{{ objectItem.cod }}</b>
              </v-col>
              <v-col
                cols="12"
                md="9"
                lg="9"
                :class="
                  objectItem.cod || objectItem.cod == null
                    ? 'ml-n12 uppercase'
                    : 'ml-0 uppercase'
                "
              >
                <b>{{ objectItem.descricao_site }}</b>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteRowDialog = false" small
              >Cancelar</v-btn
            >
            <v-btn color="success" @click="removeRow(objectItem)" small
              >Continuar</v-btn
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
          <img v-bind:src="`${urlImg}`" width="160" height="100" />
        </v-card>
      </v-menu>
    </div>
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
import VueScrollTo from "vue-scrollto";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    destacarOpcionais: true,
    itemRepetidoDialog: false,
    objectIndex: -1,
    objectItem: {},
    selectedFaculdade: {},
    faculdades: [],
    selectedPosGraduacao: "",
    selectedSemestre: {},
    semestres: [],
    nome_exibicao: "",
    proximaTela: false,
    codigo: "",
    descricao: "",
    toggle: false,
    produtos: [],
    headersProdutos: [
      { text: "CÃ³digo", value: "codigo", sortable: true },
      { text: "Saldo", value: "saldo", sortable: true },
      { text: "DescriÃ§Ã£o", value: "descricao", sortable: true },
      { text: "Marca", value: "marca", sortable: true },
      { text: "Valor", value: "valor", sortable: true },
      { text: "Qtd", value: "qtd", sortable: false, width: 100 },
    ],
    rowData: [],
    rowId: 1,
    money: {
      decimal: ",",
      thousands: ".",
      precision: 2,
      masked: false,
      prefix: "R$",
    },
    arrayLuvas: [],
    SearchLuva: null,
    valorTotalSite: 0,
    valorTotalSistema: 0,
    lucroSistema: 0,
    lucroSite: 0,
    totalItensOpcionais: 0,
    descontoGeral: 0,
    temDesconto: false,
    temStorage: false,
    allLocalList: [],
    dialogSenhaUsuario: false,
    senhaUsuario: "",
    dialogSalvar: false,
    deleteRowDialog: false,
    showMenuImage: false,
    showMenuImageOpcional: false,
    x: 0,
    y: 0,
    urlImg: "",
  }),

  created() {
    this.$root.$emit("title", "Inserir Lista");
    this.get_permissoes({
      id_usuario: this.$usuario.value.id,
      pagina: "inserir_lista",
    });

    var row = {
      id: 0,
      cod: "",
      image_path: "",
      qtd: 1,
      saldo: 0,
      descricao: "",
      descricao_site: "",
      valor: 0,
      valor_site: 0,
      valor_original_site: 0,
      marca: "",
      obs: "",
      disponivel: 0,
      opcional: 0,
      // imagem: 0,
      markDescricao: false,
      marcaOpcional: false,
      descricaoMarcaOpcional: "",
      nomeMarcaOpcional: "",
      valorMarcaOpcional: "",
      codMarcaOpcional: "",
      imagePathOpcional: "",
      cor: false,
      luva: false,
      rowsCores: [
        {
          codigo: "",
          cor: "",
          descricao: "",
          image_path: "",          
          button: "+",
        },
      ],
      rowsLuvas: [{ codigo: "", tamanho: "", descricao: "", button: "+" }],
      kit: false,
      rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
      travaQtd: false,
      titulo: false,
      valorUltimaCompra: 0,
      ipi: 0,
      valorFabricante: 0,
      checked: true,
      checkedMarca2: true,
      checkedQtd: true,
      dialogSenhaUsuario: false,
      permissaoValor: false,
      permissaoValorMarca2: false,
    };
    this.rowData.push(row);
    //this.rowId++;
    this.totalItens += row.qtd;
  },

  mounted() {
    this.getFacudades();
    this.allLocalList = this.getAllStorageList();
  },
  computed: {
    changedArrayProdutos() {
      this.produtos.forEach((element) => {
        element["isAdd"] = true;
        element["qtd"] = 1;
        element["idLinha"] = 0;
      });

      return this.produtos;
    },
    orderedItens: function () {
      function compare(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      }

      return this.rowData.sort(compare);
    },
    ...mapState({
      permissoes: (state) => state.permissoes,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapMutations(["set_snackbar", "set_loading"]),
    ...mapActions(["get_permissoes"]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    corLinha(item) {
      //item.destacar || item.titulo ? '' : 'white'
      if (item.destacar || item.titulo) {
        return "blue lighten-4";
      } else if ((item.id + 1) % 2 == 0) {
        return "blue-grey lighten-4";
      } else {
        return "white";
      }
    },
    callDestacarOpcionais() {
      if (this.destacarOpcionais) {
        this.rowData.forEach((item) => {
          if (item.opcional == 1) {
            item.destacar = true;
          } else {
            item.destacar = false;
          }
        });
      } else {
        this.rowData.forEach((item) => {
          if (item.opcional == 1) {
            item.destacar = false;
          }
        });
      }
    },
    formatValues(val) {
      if (!isNaN(val)) {
        val = parseFloat(val);
        return val.toFixed(2).replace(".", ",");
      }
    },
    aplicarValorSistema() {
      this.$bvModal
        .msgBoxConfirm(
          "Deseja realmente aplicar o valor de sistema na lista?",
          {
            title: "ConfirmaÃ§Ã£o!",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "SIM",
            cancelTitle: "NÃƒO",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value == true) {
            this.orderedItens.forEach((item) => {
              item.valor_site = item.valor;
              item.valorMarcaOpcional = item.valorMarcaOpcionalOriginal;
            });

            this.set_snackbar({
              show: true,
              msg: "PreÃ§o de Sistema Aplicado com Sucesso!",
              type: "success",
              time: 3000,
            });

            this.calcTotalItens();
          }
        })
        .catch((err) => {});
    },
    titulo(item) {
      item.cod = "";
      image_path = "";
      item.qtd = 1;
      item.saldo = 0;
      item.descricao = "";
      item.valor = 0;
      item.valor_site = 0;
      item.valor_original_site = 0;
      item.marca = "";
      item.obs_item = "";
      item.disponivel = 0;
      item.opcional = 0;
      // item.imagem = 0;
      item.markDescricao = false;
      item.marcaOpcional = false;
      item.descricaoMarcaOpcional = "";
      item.nomeMarcaOpcional = "";
      item.valorMarcaOpcional = "";
      item.codMarcaOpcional = "";
      item.imagePathOpcional = "";
      item.cor = false;
      item.luva = false;
      item.luvaCodigos = [];
      item.luvaTamanhos = [];
      item.kit = false;
      item.rowsCores = [
        {
          codigo: "",
          cor: "",
          descricao: "",
          image_path: "",         
          button: "+",
        },
      ];
      item.rowsLuvas = [
        { codigo: "", tamanho: "", descricao: "", button: "+" },
      ];
      item.rowsKits = [{ qtd: 1, descricao: "", button: "+" }];
      item.trava_qtd_item = false;
      item.titulo = false;
      item.valorUltimaCompra = 0;
      item.ipi = 0;
      item.valorFabricante = 0;
      item.titulo = true;
      this.calcTotalItens();
    },
    getAllStorageList() {
      var archive = [],
        keys = Object.keys(localStorage),
        i = keys.length;

      while (i--) {
        if (keys[i].includes("lista_")) {
          archive.push({ key: keys[i], data: localStorage.getItem(keys[i]) });
        }
      }

      return archive;
    },
    checkIfChecked(item) {
      if (item.valor_site) {
        item.checked = true;
      }
    },
    checkIfCheckedMarca2(item) {
      item.checkedMarca2 = true;
    },
    checkIfCheckedQtd(item) {
      item.checkedQtd = true;
    },
    checkListaBeforeSave() {
      let checked = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -60,
        force: true,
      };
      this.rowData.forEach((item) => {
        if (item.disponivel == 1 && !item.valor_site) {
          id = "#item" + item.id;
          checked = false;
          item.checked = false;
        }
        if (item.cod.length <= 0 && item.descricao_site.length <= 0) {
          this.removeRow(item);
        }
      });

      if (!checked) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.set_snackbar({
          show: true,
          msg:
            "AtenÃ§Ã£o VocÃª esqueceu de preencher o valor de um item disponÃ­vel!",
          type: "warning",
          time: 3000,
        });
      }

      return checked;
    },
    checkListaMarca2BeforeSave() {
      let checked2 = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -60,
        force: true,
      };
      this.rowData.forEach((item) => {
        if (
          (item.marcaOpcional && !item.codMarcaOpcional) ||
          (item.marcaOpcional && item.valorMarcaOpcional === 0)
        ) {
          id = "#item" + item.id;
          checked2 = false;
          item.checkedMarca2 = false;
        }
      });
      if (!checked2) {
        this.dialogSalvar = false;
        VueScrollTo.scrollTo(id, 500, options);
        this.set_snackbar({
          show: true,
          msg:
            "AtenÃ§Ã£o VocÃª esqueceu de preencher o Codigo da marca 2 ou Valor marca 2",
          type: "warning",
          time: 3000,
        });
      }
      return checked2;
    },
    checkListaBeforeSaveQtd() {
      let checked3 = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -60,
        force: true,
      };
      this.rowData.forEach((item) => {
        if (item.disponivel == 1 && item.qtd <= 0) {
          id = "#item" + item.id;
          checked3 = false;
          item.checkedQtd = false;
        }
      });

      if (!checked3) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.set_snackbar({
          show: true,
          msg: "VocÃª esqueceu de preencher a quantidade de um item disponivel!",
          type: "warning",
          time: 3000,
        });
      }

      return checked3;
    },
    removeTemp() {
      let key =
        "lista_" +
        this.selectedFaculdade.nome_exibicao_faculdade +
        "_" +
        this.selectedSemestre.descri_semestre +
        "_" +
        this.nome_exibicao;
      localStorage.removeItem(key);
      this.set_snackbar({
        show: true,
        msg: "AtenÃ§Ã£o Lista Removida!",
        type: "success",
        time: 3000,
      });

      this.proximaTela = false;
      this.allLocalList = this.getAllStorageList();
    },

    checkpoint(key) {
      let savedData = JSON.parse(localStorage.getItem(key));
      if (savedData !== null) {
        this.rowData = savedData.itens;
        this.selectedFaculdade = savedData.faculdade;
        this.selectedSemestre = savedData.semestre;
        this.nome_exibicao = savedData.nome_exibicao;

        this.temStorage = true;
        this.calcTotalItens();
      }
    },
    salvarTemp() {
      console.log(this.rowData);

      if (
        this.checkListaBeforeSave() &&
        this.checkListaMarca2BeforeSave() &&
        this.checkListaBeforeSaveQtd()
      ) {
        this.rowData.forEach((item) => {
          item.permissaoValor = false;
          item.permissaoValorMarca2 = false;
        });
        let dadosLista = {
          faculdade: this.selectedFaculdade,
          semestre: this.selectedSemestre,
          itens: this.rowData,
          nome_exibicao: this.nome_exibicao,
          usuario: this.$usuario.value.usuario.toUpperCase(),
        };
        let key =
          "lista_" +
          this.selectedFaculdade.nome_exibicao_faculdade +
          "_" +
          this.selectedSemestre.descri_semestre +
          "_" +
          this.nome_exibicao;
        localStorage.setItem(key, JSON.stringify(dadosLista));
        this.set_snackbar({
          show: true,
          msg: "AtenÃ§Ã£o salvo com sucesso!",
          type: "success",
          time: 3000,
        });
      }
    },
    salvarLista() {
      console.log(this.rowData);

      if (
        this.selectedFaculdade.id_faculdade &&
        this.selectedSemestre.id_semestre
      ) {
        if (
          this.checkListaBeforeSave() &&
          this.checkListaMarca2BeforeSave() &&
          this.checkListaBeforeSaveQtd()
        ) {
          this.dialogSalvar = false;
          this.set_loading(true);

          this.$axios
            .post("/lista", {
              faculdade: this.selectedFaculdade.id_faculdade,
              semestre: this.selectedSemestre.id_semestre,
              itens: this.rowData,
              valor_total: this.valorTotalSite,
              itens_total: this.totalItens,
              lucro_sistema: this.lucroSistema,
              lucro_site: this.lucroSite,
              nome_exibicao: this.nome_exibicao,
              usuario: this.$usuario.value.usuario.toUpperCase(),
            })
            .then((res) => {
              if (res.data === true) {
                this.set_snackbar({
                  show: true,
                  msg: "Lista Salva Com Sucesso!",
                  type: "success",
                  time: 3000,
                });

                let key =
                  "lista_" +
                  this.selectedFaculdade.nome_exibicao_faculdade +
                  "_" +
                  this.selectedSemestre.descri_semestre +
                  "_" +
                  this.nome_exibicao;
                localStorage.removeItem(key);
                this.proximaTela = false;
              } else {
                this.set_snackbar({
                  show: true,
                  msg: "Ops, algo deu errado" + res.data,
                  type: "error",
                  time: 0,
                });
              }
            })
            .catch((err) => {
              this.set_snackbar({
                show: true,
                msg: "Ops, algo deu errado" + res.data,
                type: "error",
                time: 0,
              });
            });
          this.set_loading(false);
        }
      } else {
        this.set_snackbar({
          show: true,
          msg: "TODOS OS CAMPOS SÃƒO OBRIGATÃ“RIOS",
          type: "warning",
          time: 3000,
        });
      }
    },
    getFacudades() {
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id,
          },
        })
        .then((res) => {
          this.faculdades = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange() {
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";
    },
    onChangeGraduacao() {
      this.selectedSemestre = "";
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade.id_faculdade,
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

    avancar() {
      if (
        this.selectedFaculdade &&
        this.selectedSemestre &&
        this.nome_exibicao
      ) {
        this.proximaTela = true;
        this.temStorage = false;

        this.rowData = [];

        var row = {
          id: 0,
          cod: "",
          image_path: "",
          qtd: 1,
          saldo: 0,
          descricao: "",
          descricao_site: "",
          valor: 0,
          valor_site: 0,
          valor_original_site: 0,
          marca: "",
          obs: "",
          disponivel: 0,
          opcional: 0,
          // imagem: 0,
          markDescricao: false,
          marcaOpcional: false,
          descricaoMarcaOpcional: "",
          nomeMarcaOpcional: "",
          valorMarcaOpcional: "",
          codMarcaOpcional: "",
          imagePathOpcional: "",
          cor: false,
          luva: false,
          rowsCores: [
            {
              codigo: "",
              cor: "",
              descricao: "",
              image_path: "",              
              button: "+",
            },
          ],
          rowsLuvas: [{ codigo: "", tamanho: "", descricao: "", button: "+" }],
          kit: false,
          rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
          travaQtd: false,
          titulo: false,
          valorUltimaCompra: 0,
          ipi: 0,
          valorFabricante: 0,
          checked: true,
          checkedMarca2: true,
          checkedQtd: true,
          dialogSenhaUsuario: false,
          permissaoValor: false,
          permissaoValorMarca2: false,
        };

        this.rowData.push(row);
      } else {
        this.set_snackbar({
          show: true,
          msg: "TODOS OS CAMPOS SÃƒO OBRIGATÃ“RIOS",
          type: "warning",
          time: 3000,
        });
      }
    },
    findProdutoByCod() {
      if (this.codigo && this.codigo.length >= 4) {
        this.descricao = "";
        setTimeout(
          () =>
            this.$axios
              .get("/produto/findByCod", {
                params: {
                  codigo: this.codigo,
                },
              })
              .then((res) => {
                if (res.data !== false) {
                  this.produtos = res.data;
                  this.toggle = true;
                }
              })
              .catch((err) => {
                console.log(err);
              }),
          800
        );
      }
    },
    findProduto() {
      if (this.descricao && this.descricao.length >= 4) {
        this.codigo = "";
        setTimeout(
          () =>
            this.$axios
              .get("/produto/find", {
                params: {
                  descricao: this.descricao,
                },
              })
              .then((res) => {
                if (res.data !== false) {
                  this.produtos = res.data;
                  this.toggle = true;
                }
              })
              .catch((err) => {
                console.log(err);
              }),
          800
        );
      }
    },
    getMarcaOp(value, item) {
      if (value) {
        this.$axios
          .get("/produto/getByCod", {
            params: {
              cod: value,
            },
          })
          .then((res) => {
            if (res.data === false) {
              this.set_snackbar({
                show: true,
                msg: "Produto NÃ£o Encontrado!",
                type: "warning",
                time: 3000,
              });
            } else {
              if (
                this.rowData.some(
                  (e) =>
                    e.cod == res.data.codigo ||
                    e.codMarcaOpcional == res.data.codigo
                )
              ) {
                this.set_snackbar({
                  show: true,
                  msg: "ITEM JÃ ADICIONADO NESTA LISTA!",
                  type: "warning",
                  time: 3000,
                });
              } else {
                item.codMarcaOpcional = res.data.codigo;
                item.descricaoMarcaOpcional = res.data.descricao;
                item.nomeMarcaOpcional = res.data.marca;
                item.valorMarcaOpcional = res.data.valor;
                item.valorMarcaOpcionalOriginal = res.data.valor;
                item.imagePathOpcional = res.data.image_path;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    toggleTableSearch() {
      if (this.toggle) {
        this.toggle = false;
      } else {
        this.toggle = true;
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
             console.log("res", res.data);
            if (!res.data) {
              this.set_snackbar({show: true,msg: "Item NÃ£o Encontrado!",type: "warning",time: 3000});
            } else {
              item.cod = "";
              item.descricao = "";
              item.image_path = "";
              //item.descricao_site = "";
              //item.valor_site = "";
              item.valor_original_site = "";
              item.valor = 0;
              item.marca = "";
              item.saldo = 0;
              item.valorUltimaCompra = 0;
              item.ipi = 0;
              item.valorFabricante = 0;
              item.disponivel = 0;
              if (
                this.rowData.some(
                  (e) =>
                    e.cod == res.data.codigo ||
                    e.codMarcaOpcional == res.data.codigo
                )
              ) {
                this.set_snackbar({
                  show: true,
                  msg: "ITEM JÃ ADICIONADO NESTA LISTA!",
                  type: "warning",
                  time: 3000,
                });
              } else {
                if (item.valor_site) {
                  this.checkEditValue(item, res.data);
                } else {
                  item.cod = res.data.codigo;
                  item.image_path = res.data.image_path;
                  item.descricao = res.data.descricao;
                  item.descricao_site = res.data.descricao;
                  item.valor_site = res.data.valor;
                  item.valor_original_site = res.data.valor;
                  item.valor = res.data.valor;
                  item.marca = res.data.marca;
                  item.saldo = res.data.saldo;
                  item.disponivel = 1;
                  item.valorUltimaCompra = res.data.valor_ultima_compra;
                  item.ipi = res.data.ipi;
                  item.valorFabricante = res.data.valor_fabricante;
                  this.calcTotalItens();
                }
              }
              this.calcTotalItens();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    callDescontoGeral() {
      if (!this.temDesconto) {
        if (this.descontoGeral.indexOf(",") == 1) {
          this.descontoGeral = this.descontoGeral.replace(",", ".");
        }
        if (
          this.descontoGeral == 0 ||
          isNaN(this.descontoGeral) ||
          this.descontoGeral == ""
        ) {
          this.set_snackbar({
            show: true,
            msg: "Valor de desconto incorreto!",
            type: "warning",
            time: 3000,
          });
        } else {
          this.descontoGeral = parseFloat(this.descontoGeral);
          this.rowData.forEach((element) => {
            let valorAtual = parseFloat(element.valor_site);
            let valorComDesconto =
              valorAtual - valorAtual * (this.descontoGeral / 100);
            element.valor_site = valorComDesconto.toFixed(2);
          });
          this.calcTotalItens();
          this.temDesconto = true;
        }
      } else {
        this.rowData.forEach((element) => {
          element.valor_site = element.valor_original_site;
        });
        this.temDesconto = false;
        this.descontoGeral = "";
        this.calcTotalItens();
      }
    },
    calcTotalItens() {
      let itens = 0;
      let itensOpcionais = 0;
      let valoresSite = 0;
      let valoresSistema = 0;
      let ultimaCompra = 0;
      let totalUltimaCompra = 0;
      this.rowData.forEach((element) => {
        ultimaCompra = parseFloat(element.valorUltimaCompra);

        if (ultimaCompra == 0) {
          ultimaCompra = parseFloat(element.valorFabricante);
        } else {
          ultimaCompra =
            parseFloat(element.valorUltimaCompra) *
            ((100 + parseFloat(element.ipi)) / 100);
        }

        if (
          element.disponivel == 1 &&
          element.opcional == 0 &&
          !element.titulo
        ) {
          if (!element.qtd) {
            element.qtd = 1;
          }
          if (element.valor_site < 0) {
            element.valor_site = 0;
          }

          itens += parseInt(element.qtd);
          valoresSite += parseFloat(element.valor_site) * element.qtd;
          valoresSistema += parseFloat(element.valor) * element.qtd;
          totalUltimaCompra += ultimaCompra * element.qtd;
        } else {
          if (element.opcional == 1) {
            itensOpcionais += parseInt(element.qtd);
          }
        }
      });

      this.valorTotalSite = valoresSite.toFixed(2);
      this.valorTotalSistema = valoresSistema.toFixed(2);
      this.totalItens = itens;
      this.totalItensOpcionais = itensOpcionais;

      this.lucroSistema =
        (this.valorTotalSistema / totalUltimaCompra) * 100 - 100;
      this.lucroSite = (this.valorTotalSite / totalUltimaCompra) * 100 - 100;

      this.lucroSistema = this.lucroSistema.toFixed(2);
      this.lucroSite = this.lucroSite.toFixed(2);
    },

    checkEditValue(item, data) {
      this.$bvModal
        .msgBoxConfirm("O que vocÃª deseja fazer?", {
          title: "ConfirmaÃ§Ã£o",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "Usar Valor Sistema",
          cancelTitle: "Manter Valor",
          footerClass: "p-2",
          noCloseOnBackdrop: true,
          hideHeaderClose: true,
          centered: true,
        })
        .then((res) => {
          if (res) {
            item.valor_site = data.valor;
            item.valor_original_site = data.valor;
            item.valor = data.valor;
            item.cod = data.codigo;
            item.image_path = data.image_path;
            item.descricao = data.descricao;
            //item.descricao_site = data.descricao;
            item.marca = data.marca;
            item.saldo = data.saldo;
            item.valorUltimaCompra = data.valor_ultima_compra;
            item.disponivel = 1;
            item.ipi = data.ipi;
            item.valorFabricante = data.valor_fabricante;
          } else {
            item.cod = data.codigo;
            item.image_path = data.image_path;
            item.descricao = data.descricao;
            //item.descricao_site = data.descricao;
            item.valor = data.valor;
            item.marca = data.marca;
            item.saldo = data.saldo;
            item.valorUltimaCompra = data.valor_ultima_compra;
            item.disponivel = 1;
            item.ipi = data.ipi;
            item.valorFabricante = data.valor_fabricante;
          }
          this.calcTotalItens();
        });
      item.markDescricao = true;
    },

    checkLimiteValorSite(valor_digitado, item) {
      //100   *   (10   Ã·   100)
      let maximo =
        item.valor * (this.permissoes.margem_preco / 100) + item.valor;
      let minimo =
        item.valor - item.valor * (this.permissoes.margem_preco / 100);

      let limiteMinimoItem = (item.valor * 50) / 100;
      let limiteMaximoItem = (item.valor * 200) / 100;

      if (valor_digitado > maximo) {
        item.valor_site = maximo.toFixed(2);
      }
      if (valor_digitado < minimo) {
        item.valor_site = minimo.toFixed(2);
      }

      if (item.valor_site <= limiteMinimoItem) {
        if (item.permissaoValor == false) {
          item.dialogSenhaUsuario = true;
        }
      }
      if (item.valor_site >= limiteMaximoItem) {
        if (item.permissaoValor == false) {
          item.dialogSenhaUsuario = true;
        }
      }
      this.calcTotalItens();
    },

    checkSenhaUsuario(item) {
      this.$axios
        .get("/usuario/permissao/alterarValorItemSite", {
          params: {
            senha: this.senhaUsuario,
          },
        })
        .then((res) => {
          if (res.data == false) {
            this.set_snackbar({
              show: true,
              msg: "Senha incorreta!",
              type: "warning",
              time: 3000,
            });
          } else {
            if (item.marcaOpcional == false) {
              item.dialogSenhaUsuario = false;
              item.permissaoValor = true;
            }
            if (item.marcaOpcional == true) {
              item.dialogSenhaUsuario = false;
              item.permissaoValorMarca2 = true;
            }
            this.senhaUsuario = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelarDialogSenha(item) {
      if (item.permissaoValor == false) {
        item.valor_site = item.valor_original_site;
        item.dialogSenhaUsuario = false;
        this.senhaUsuario = "";
      }
      if (item.permissaoValorMarca2 == false) {
        item.valorMarcaOpcional = item.valorMarcaOpcionalOriginal;
        item.dialogSenhaUsuario = false;
        this.senhaUsuario = "";
      }
    },

    checkLimiteValorMarcaOpcional(valor_digitado, item) {
      //100   *   (10   Ã·   100)
      let maximo =
        item.valorMarcaOpcionalOriginal * (this.permissoes.margem_preco / 100) +
        item.valorMarcaOpcionalOriginal;
      let minimo =
        item.valorMarcaOpcionalOriginal -
        item.valorMarcaOpcionalOriginal * (this.permissoes.margem_preco / 100);

      let limiteMinimoItem = (item.valorMarcaOpcionalOriginal * 50) / 100;
      let limiteMaximoItem = (item.valorMarcaOpcionalOriginal * 200) / 100;

      if (valor_digitado > maximo) {
        item.valorMarcaOpcional = maximo.toFixed(2);
      }
      if (valor_digitado < minimo) {
        item.valorMarcaOpcional = minimo.toFixed(2);
      }

      if (item.valorMarcaOpcional <= limiteMinimoItem) {
        if (item.permissaoValorMarca2 == false) {
          item.dialogSenhaUsuario = true;
        }
      }
      if (item.valorMarcaOpcional >= limiteMaximoItem) {
        if (item.permissaoValorMarca2 == false) {
          item.dialogSenhaUsuario = true;
        }
      }
      this.calcTotalItens();
    },
    checkValorMarcaOpcional(item) {
      if (!item.valorMarcaOpcional) {
        item.disponivel = 0;
      } else {
        item.disponivel = 1;
      }
    },

    somarItemRepetido(itemRepetido) {
      this.rowData.forEach((item) => {
        if (item.cod === itemRepetido.codigo) {
          item.qtd = parseInt(item.qtd) + parseInt(itemRepetido.qtd);
        }
      });
      this.itemRepetidoDialog = false;
      this.calcTotalItens();
    },
    addOrRemoveItem(produto) {
      if (!produto.added) {
        if (this.rowData.some((e) => e.cod === produto.codigo)) {
          this.objectItem = produto;
          this.itemRepetidoDialog = true;
        } else {
          this.rowId = this.rowData.length;
          var row = {
            id: this.rowId,
            cod: produto.codigo,
            image_path: produto.image_path,
            qtd: produto.qtd,
            saldo: produto.saldo,
            descricao: produto.descricao,
            descricao_site: produto.descricao,
            valor: produto.valor,
            valor_site: produto.valor,
            valor_original_site: produto.valor,
            marca: produto.marca,
            obs: "",
            disponivel: 1,
            opcional: 0,
            // imagem: 0,
            markDescricao: false,
            marcaOpcional: false,
            descricaoMarcaOpcional: "",
            nomeMarcaOpcional: "",
            valorMarcaOpcional: "",
            codMarcaOpcional: "",
            imagePathOpcional: "",
            cor: false,
            luva: false,
            rowsCores: [
              {
                codigo: "",
                cor: "",
                descricao: "",
                image_path: "",                
                button: "+",
              },
            ],
            rowsLuvas: [
              { codigo: "", tamanho: "", descricao: "", button: "+" },
            ],
            kit: false,
            rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
            travaQtd: false,
            titulo: false,
            valorUltimaCompra: produto.valor_ultima_compra,
            ipi: produto.ipi,
            valorFabricante: produto.valor_fabricante,
            checked: true,
            checkedMarca2: true,
            checkedQtd: true,
          };

          this.rowData.push(row);

          produto.added = true;
          produto.row = this.rowId;
          this.rowId = this.rowData.length;
          this.totalItens += parseInt(produto.qtd);
        }
      } else {
        // remover
        this.rowData = this.rowData.filter(function (element) {
          return element.cod != produto.codigo;
        });
        for (let i = 0; i < this.rowData.length; i++) {
          this.$set(this.rowData[i], "id", i);
        }
        produto.added = false;
        this.totalItens -= parseInt(produto.qtd);
      }

      this.calcTotalItens();
    },

    addRow(item) {
      var row = {
        id: item.id + 1,
        cod: "",
        image_path: "",
        qtd: 1,
        saldo: 0,
        descricao: "",
        descricao_site: "",
        valor: 0,
        valor_site: 0,
        valor_original_site: 0,
        marca: "",
        obs: "",
        disponivel: 0,
        opcional: 0,
        // imagem: 0,
        markDescricao: false,
        marcaOpcional: false,
        descricaoMarcaOpcional: "",
        nomeMarcaOpcional: "",
        valorMarcaOpcional: "",
        codMarcaOpcional: "",
        imagePathOpcional: "",
        cor: false,
        luva: false,
        rowsCores: [
          {
            codigo: "",
            cor: "",
            descricao: "",
            image_path: "",            
            button: "+",
          },
        ],
        rowsLuvas: [{ codigo: "", tamanho: "", descricao: "", button: "+" }],
        kit: false,
        rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
        travaQtd: false,
        titulo: false,
        valorUltimaCompra: 0,
        ipi: 0,
        valorFabricante: 0,
        checked: true,
        checkedMarca2: true,
        checkedQtd: true,
        dialogSenhaUsuario: false,
        permissaoValor: false,
        permissaoValorMarca2: false,
      };

      let i = item.id + 1;

      for (i; i < this.rowData.length; i++) {
        this.$set(this.rowData[i], "id", this.rowData[i].id + 1);
      }
      this.rowData.push(row);
      this.rowId = this.rowData.length;
      this.totalItens += row.qtd;
      this.calcTotalItens();

      this.$nextTick(() => {
        let index = this.rowData.length - 1;
        let input = this.$refs.codigo[item.id + 1];

        input.focus();
        input.scrollIntoView();
        this.$nextTick(() => {
          window.scrollBy(0, -50);
        });
      });
    },
    removeRowDialog(item) {

      this.objectItem = item;

      if (!item.cod && !item.descricao_site) {
        this.removeRow(this.objectItem);
      } else {
        this.deleteRowDialog = true;
      }
    },
    removeRow(item) {
      this.rowData = this.rowData.filter(function (element) {
        return element.id != item.id;
      });

      for (let i = 0; i < this.rowData.length; i++) {
        this.$set(this.rowData[i], "id", i);
      }
      this.totalItens -= item.qtd;
      this.calcTotalItens();
      this.deleteRowDialog = false;
    },

    onClick(option, item) {
      if (option == "marca") {
        item.marcaOpcional = true;
      }
      if (option == "cor") {
        item.cor = true;
      }
      if (option == "luva") {
        item.luva = true;
      }
      if (option == "kit") {
        item.kit = true;
      }
      if (option == "titulo") {
        item.titulo = true;
      }
    },

    getLuva(value, rowLuva) {
      if (value) {
        this.$axios
          .get("/produto/getByCod", {
            params: {
              cod: value,
            },
          })
          .then((res) => {
            rowLuva.descricao = res.data.descricao;
            rowLuva.image_path = res.data.image_path;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    addRowKit(item) {
      if (item.rowsKits.length >= 1) {
        item.rowsKits.push({ qtd: 1, descricao: "", button: "-" });
      }
    },
    removeRowKit(item) {
      item.rowsKits.pop();
    },
    addRowCor(item) {
      if (item.rowsCores.length >= 1) {
        item.rowsCores.push({
          codigo: "",
          cor: "",
          descricao: "",
          image_path: "",         
          button: "-",
        });
      }
    },
    removeRowCor(item) {
      item.rowsCores.pop();
    },
    addRowLuva(item) {
      if (item.rowsLuvas.length >= 1) {
        item.rowsLuvas.push({
          codigo: "",
          tamanho: "",
          descricao: "",
          button: "-",
        });
      }
    },
    removeRowLuva(item) {
      item.rowsLuvas.pop();
    },
    voltar() {
      this.proximaTela = false;
      this.allLocalList = this.getAllStorageList();

      this.selectedFaculdade = "";
      this.selectedPosGraduacao = "";
      this.selectedSemestre = "";

      this.nome_exibicao = "";
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
<style  scoped>
.text-saldo {
  color: #1d6810;
}
.bg-opcional {
  background-color: #50becf !important;
}
label {
  font-size: 0.9rem;
}

.sticky-top {
  border-style: solid;
  border-width: 10px;
  border-color: #007bff;
}

.placeholder-color ::placeholder {
  color: white;
  opacity: 0.5;
}

.fixed-bottom {
  padding-left: 100px;
  padding-right: 100px;
}

.uppercase input {
  text-transform: uppercase;
}
.text-uppercase {
  text-transform: uppercase !important;
}
</style>