<template>
  <div>
    <ImprimirLista
      v-if="imprimir"
      :lista="lista"
      :itens="itens"
      :descontoGeral="descontoGeral"
      :totalItensOpcionais="totalItensOpcionais"
      :totalItens="totalItens"
      :valorTotalSistema="valorTotalSistema"
      :valorTotalSite="valorTotalSite"
      :lucroSistema="lucroSistema"
      :lucroSite="lucroSite"
    ></ImprimirLista>
    <div v-else>
      <v-card style="margin-bottom: 90px !important">
        <v-card-title style="z-index: 6">
          <b>{{ lista.id_lista }} &nbsp</b> - {{ lista.faculdade }} - {{ lista.semestre }} - {{ lista.nome_exibi_lista }}
          <v-btn
            class="ml-3 error"
            @click="
              $parent.editar = false;
              $parent.buscarListas();
            "
            >Voltar</v-btn
          >
        </v-card-title>
        <v-banner single-line :class="original ? 'corOriginal' : 'corOnline'" sticky width="100%">
          <div :class="original ? 'corOriginal' : 'corOnline'" style="width: 100%">
            <v-card :class="original ? 'corOriginal' : 'corOnline'">
              <v-card-title style="padding: 0px 0px 0px !important">
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="descricao"
                      v-on:keyup="findProduto()"
                      prepend-icon="fa-edit"
                      label="Buscar por descrição"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="codigo"
                      v-on:keyup="findProdutoByCod()"
                      prepend-icon="fa-search"
                      label="Buscar por código"
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
                  <v-col v-if="permissoes.check_somente_originais == 1" cols="12" sm="2">
                      <v-alert v-if="original" color="info" type="info" text outlined dense style="text-align: center"> ORIGINAL</v-alert>
                      <v-alert v-else color="success" type="success" text outlined dense style="text-align: center">ONLINE</v-alert>
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
              <template v-slot:item.codigo="{ item }"><b :disabled="item.status != 1">{{ item.codigo }}</b></template>
              <template v-slot:item.saldo="{ item }"><b :disabled="item.status != 1">{{ item.saldo }}</b></template>
              <template v-slot:item.descricao="{ item }"><b :disabled="item.status != 1">{{ item.descricao }}</b></template>
              <template v-slot:item.marca="{ item }"><b :disabled="item.status != 1">{{ item.marca }}</b></template>
              <template v-slot:item.status="{ item }">                
                <v-chip class="error" v-if="item.status != 1" dark small><b>BLOQUEADO</b></v-chip></template>
                <template v-slot:item.valor="{ item }"><b :disabled="item.status != 1">R$ {{ formatValues(item.valor) }}</b></template>
                <template v-slot:item.qtd="{ item }">
                  <v-text-field
                  :disabled="item.status != 1"
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
        <div class="ma-2">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on }">
              <v-btn class="ml-3 d-print-none" color="indigo" dark v-on="on"
                >Opções</v-btn
              >
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-action>
                    <v-btn
                      @click="
                        aplicarValorSistema();
                        menu = false;
                      "
                      color="primary"
                      small
                      >Aplicar Valor de Sistema</v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-list-item
                  v-if="
                    lista.nome_status_lista == 'EM TESTE' ||
                    lista.nome_status_lista == 'ON-LINE'
                  "
                >
                  <v-list-item-action>
                    <v-btn @click="dialogPagamento = true" color="primary" small
                      >Gerenciar Pagamento</v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-action>
                    <v-checkbox
                      dense
                      hide-details
                      :false-value="0"
                      :true-value="1"
                      v-model="lista.mostrar_completa"
                      label="Permitir somente a compra da lista completa"
                    ></v-checkbox>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-action>
                    <v-text-field
                      dense
                      persistent-hint
                      v-model="lista.limite_venda"
                      hint="-1 = sem limite"
                      label="Limite de Venda"
                    ></v-text-field>
                  </v-list-item-action>
                  <v-list-item-title>-1 = sem limite</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
        <div
          :class="
            !permissoes.editar_habilitada && !lista.habilitada
              ? 'overlay-trava'
              : ''
          "
        >
          <table
            class="table table-sm table-hover table-bordered"
            style="margin-bottom: 10rem"
          >
            <thead>
              <tr class="text-center">
                <th style="width: 14%" scope="col">Código</th>
                <th style="width: 5%" scope="col">Qtd</th>
                <th style="width: 33%" scope="col">Descrição</th>
                <th style="width: 12%" scope="col">Valor</th>
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
                      <span class="headline">Senha Obrigatória</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row justify="center">
                          <b>Entre com sua senha de confirmação.</b>
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
                        >Avançar</v-btn
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
                      :class="item.checked ? 'bg-white' : 'bg-warning'"
                      class="form-control text-uppercase"
                      placeholder="Cod"
                      aria-label="Cod"
                      aria-describedby="basic-addon2"
                      :value="item.cod"
                      @keyup="
                        $event.target.value.length == 0
                          ? (item.disponivel_item = 0)
                          : ''
                      "
                      @keyup.13="getProduto($event.target.value, item)"
                    />
                    <v-row justify="center">
                      <v-btn
                        v-if="item.image_path"
                        small
                        class="ma-1"
                        color="primary"
                        icon
                        @click="showImage($event, item.image_path)"
                      >
                        <v-icon dark right>fas fa-camera</v-icon>
                      </v-btn>
                    </v-row>
                    <div v-if="item.marcaOpcional">
                      <br />
                      <b>Codigo Marca 2</b>
                      <br />
                      <input
                        type="text"
                        class="form-control white--text text-uppercase"
                        :class="
                          item.checkedMarca2 ? 'bg-primary' : 'bg-warning'
                        "
                        :value="item.codMarcaOpcional"
                        @keyup.13="getMarcaOp($event.target.value, item)"
                        @keyup="checkIfCheckedMarca2(item)"
                        @change="checkIfCheckedMarca2(item)"
                        @click="checkIfCheckedMarca2(item)"
                        @blur="checkIfCheckedMarca2(item)"
                        @focus="checkIfCheckedMarca2(item)"
                      />
                      <v-row justify="center">
                        <v-btn
                          v-if="item.imagePathOpcional"
                          small
                          class="ma-1"
                          color="primary"
                          icon
                          @click="showImage($event, item.imagePathOpcional)"
                        >
                          <v-icon dark right>fas fa-camera</v-icon>
                        </v-btn>
                      </v-row>
                    </div>
                    <hr class="mt-n1" />
                    <h4 class="text-center">{{ item.id + 1 }}</h4>
                    <v-row justify="center" no-gutters>
                      <v-col cols="12" lg="6" class="text-center"
                        >
                        <b>Controle Saldo:</b>
                        <input v-if="lista.id_faculdade_lista == 157 && lista.id_semestre_lista" type="number" class="form-control text-center bg-grey text-white" v-model="item.controle_saldo"/>
                      </v-col>
                    </v-row>
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
                      :value="item.qtd_item"
                      @input="item.qtd_item = $event.target.value"
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
                    <b>Saldo:</b>
                    <span
                      :class="item.saldo <= 0 ? 'text-danger' : 'text-saldo'"
                      >{{ item.saldo }}</span
                    >
                    <div v-if="permissoes.input_lucro_site == 1" class="mt-3">
                      <div class="text-center">
                        <b>Lucro:</b>
                        <br />
                        <span>{{ item.lucro }}%</span>
                      </div>
                    </div>
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
                      v-html="item.descri_item"
                      @focusout="item.descri_item = $event.target.innerText"
                    ></div>
                  </div>

                  <div v-else>
                    <b>Descrição Sistema</b>
                    <br />
                    <div>{{ item.descricao }}</div>
                    <hr />
                    <b>Descrição Site</b>
                    <br />
                    <div
                      class="border border-dark text-uppercase"
                      :class="item.markDescricao ? 'bg-warning' : 'bg-white'"
                      @click="item.markDescricao = false"
                      @focusout="item.descri_item = $event.target.innerText"
                      contenteditable="true"
                      v-html="item.descri_item"
                    ></div>

                    <div v-if="item.marcaOpcional">
                      <hr />
                      <b>Descrição Marca 2</b>
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
                              placeholder="Descrição Conteudo"
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
                <td class="text-center" scope="row">
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
                          checkLimiteValorMarcaOpcional(
                            $event.target.value,
                            item
                          )
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
                    <!-- cores  -->
                    <div class="placeholder-color" v-if="item.cor">
                      <div
                        v-for="row in item.rowsCores"
                        :key="row.porra"
                        class="input-group input-group-sm"
                      >
                        <input
                          @keyup.13="getLuva($event.target.value, row)"
                          placeholder="Código"
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
                            <v-col cols="3" class="bg-grey">
                            <v-row no-gutters justify="center" class="bg-grey text-white"> Saldo:</v-row>
                            <v-row no-gutters justify="center">
                               <span class="bg-grey text-white">{{ row.saldo }}</span>
                            </v-row >                              
                              <!-- <v-btn
                                class="ml-1 mt-2"
                                v-if="row.image_path"
                                small
                                color="white"
                                icon
                                @click="showImage($event, row.image_path)"
                              >
                                <v-icon dark>fas fa-camera</v-icon>
                              </v-btn> -->
                            </v-col>
                            <v-col cols="9">
                              <textarea
                                readonly
                                :value="row.descricao"
                                class="form-control bg-grey text-white"
                                rows="2"
                                placeholder="Descrição Sistema"
                              ></textarea>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </div>
                    <!-- cores -->
                    <div class="placeholder-color" v-if="item.luva">
                      <div
                        v-for="row in item.rowsLuvas"
                        :key="row.porra"
                        class="input-group input-group-sm"
                      >
                        <input
                          @keyup.13="getLuva($event.target.value, row)"
                          placeholder="Código"
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
                            placeholder="Descrição Sistema"
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
                    :disabled="item.bloqueado"
                      switch
                      @input="calcTotalItens()"
                      v-model="item.disponivel_item"
                      :value="1"
                      :unchecked-value="0"
                    >
                      <span
                        class="success--text"
                        v-if="item.disponivel_item == '1'"
                      >
                        Disponível:
                        <b>SIM</b>
                      </span>
                      <span class="error--text" v-else>
                        Disponível:
                        <b>NÃO</b>
                      </span>
                    </b-form-checkbox>
                    <b-form-checkbox
                      switch
                      :value="1"
                      :unchecked-value="0"
                      v-model="item.opcional_item"
                      @input="
                        calcTotalItens();
                        callDestacarOpcionais();
                      "
                    >
                      <span
                        class="success--text"
                        v-if="item.opcional_item == '1'"
                      >
                        Opcional:
                        <b>SIM</b>
                      </span>

                      <span class="error--text" v-else>
                        Opcional:
                        <b>NÃO</b>
                      </span>
                    </b-form-checkbox>
                    <b-form-checkbox
                      v-if="permissoes.input_trava_qtd == 1"
                      v-model="item.trava_qtd_item"
                      :value="1"
                      :unchecked-value="0"
                      >Travar Qtd</b-form-checkbox
                    >
                    <b-form-checkbox
                    v-if="item.cod && item.image_path"
                    v-model="item.imagem_item"
                    :value="1"
                    :unchecked-value="0"
                    >Ver imagem</b-form-checkbox
                  >
                  </div>
                </td>
              </tr>
            </tbody>
            <!-- <v-overlay id="oporra" v-if="!lista.habilitada && permissoes.id_usuario == 9" :absolute="true" opacity="0.02"></v-overlay> -->
          </table>
        </div>
      </v-card>
      <v-footer style="padding-left: 260px" fixed>
        <v-row>
          <v-col
            cols="12"
            md="2"
            v-if="
              permissoes.input_lucro_site == 1 &&
              permissoes.input_lucro_sistema == 1
            "
          >
            <div>
              <b class="mr-1">Lucro Site:</b>
              <span>{{ lucroSite }}%</span>
            </div>
            <div>
              <b class="mr-1">Lucro Sistema:</b>
              <span>{{ lucroSistema }}%</span>
            </div>
          </v-col>
          <v-col cols="12" md="2">
            <div>
              <b class="mr-1">Total Site:</b>
              <span>R$ {{ formatValues(valorTotalSite) }}</span>
            </div>
            <div>
              <b class="mr-1">Total Sistema:</b>
              <span>R$ {{ formatValues(valorTotalSistema) }}</span>
            </div>
          </v-col>
          <v-col cols="12" md="1">
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
          <v-col v-if="permissoes.input_desconto_geral == 1" cols="12" md="2">
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
          </v-col>
          <v-col cols="12" md="1">
            <v-btn
              v-if="
                (permissoes.editar == 1 && permissoes.editar_habilitada) ||
                lista.habilitada
              "
              class="ma-1 success"
              @click="salvarLista()"
              >Salvar</v-btn
            >

            <v-btn
              v-if="permissoes.btn_imprimir == 1"
              class="ma-1 primary"
              @click="imprimir = true"
              >Imprimir</v-btn
            >
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              class="ma-1 error"
              @click="
                $parent.editar = false;
                $parent.buscarListas();
              "
              >Voltar</v-btn
            >
            <v-btn
              v-if="permissoes.btn_pedido_dc_info == 1"
              class="ma-1 primary"
              @click="pedidoDCInfo()"
              >Orçamento DC-Info</v-btn
            >
          </v-col>
          <v-col cols="12" sm="1">           
              <v-btn
              v-if="original"
              icon
              color="primary"
              @click="showMenuObservacao($event)"
              >Observações:
                  <v-icon color="error" large dark right>far fa-comment-dots</v-icon>
              </v-btn>              
          </v-col>
        </v-row>
      </v-footer>
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
                >É um KIT</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.kit">
            <v-list-item-title>
              <v-btn @click="child.data.kit = false" text color="warning" small
                >Não É um KIT</v-btn
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
                >É uma LUVA</v-btn
              >
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="child.data.luva">
            <v-list-item-title class="primary--text">
              <v-btn @click="child.data.luva = false" text color="success" small
                >Não É uma LUVA</v-btn
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
                >Não é Titulo</v-btn
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
      <v-dialog v-model="itemRepetidoDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Item Repetido</v-card-title>
          <v-card-text
            >O Item {{ objectItem.codigo }} - {{ objectItem.descricao }} já se
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
      <v-dialog v-model="deleteRowDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">Atenção!</v-card-title>
          <v-card-text>
            <b
              v-if="
                !objectItem.cod && objectItem.descri_item && objectItem.titulo
              "
              >Tem certeza que deseja remover este Titulo?</b
            >
            <b
              v-if="
                !objectItem.cod &&
                !objectItem.disponivel_item &&
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
                <b>{{ objectItem.descri_item }}</b>
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
      <v-dialog v-model="itemRepetidoListaDialog" persistent max-width="1150">
        <v-card>
          <v-card-title class="headline">Atenção!</v-card-title>
          <v-card-text>
            <span class="subtitle-1 text-uppercase error--text font-weight-black"
              >Esta lista possue item(s) que já constam em listas deste mesmo
              semestre.</span
            >
            <v-simple-table fixed-header height="250px" dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Codigo</th>
                    <th class="text-left">Descrição</th>
                    <th class="text-left">Id Lista</th>
                    <th class="text-left">Lista</th>
                    <th class="text-left">Item</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in itemRepetidoLista" :key="item.name">
                    <td><h6>{{ item.cod_marca }}</h6></td>
                    <td>{{ item.descri_item }}</td>
                    <td>{{ item.id_lista }}</td>
                    <td> <span class="text-uppercase">{{ item.nome_exibi_lista }}</span></td>
                    <td>
                      <span v-if="item.opcional_item == 1" class="primary--text font-weight-black">OPCIONAL</span>
                  <span v-else class="success--text font-weight-black">PRINCIPAL</span>
                   
                    </td>
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
      <v-dialog
      v-model="dialogItemsBlocked"
      persistent
      max-width="45%"
    >   
      <v-card>
        <v-card-title class="text-h5">
          Atenção!  Esta lista contém itens Bloqueados.
        </v-card-title>
        <v-card-text>
        
        <v-row>
          <v-col cols="12">
            <v-simple-table dense class="elevation-1">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Codigo
                    </th>
                    <th class="text-left">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in arrayItemsBlocked"
                    :key="item.cod"
                  >
                    <td>{{ item.cod }}</td>
                    <td>{{ item.descri_item }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"            
            @click="dialogItemsBlocked = false"
          >
           ok, Estou ciente!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <PagamentoListaModal
        v-if="dialogPagamento"
        :lista="lista"
        v-on:close-dialog="closePagamendoModal"
      ></PagamentoListaModal>
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
      <v-menu 
          v-model="showMenuObs"
          :position-x="x"
          :position-y="y"
          absolute
          offset-y   
          :close-on-content-click="false"
          :nudge-width="650"        
          >               
            <v-card>
              <v-card-title class="headline font-weight-black">Observações</v-card-title>
              <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" md="12">
                <v-textarea
                :disabled="permissoes.observacao != 1"
                v-model="lista.observacao"  
                filled
                label="Observação"              
                row-height="30"                  
                rows="6"                   
                ></v-textarea>                
              </v-col>          
              </v-row>
            </v-card-text>
          <v-card-actions>        
            <v-btn v-if="permissoes.observacao == 1" color="primary" text @click="salvarObsLista()">Salvar</v-btn>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="showMenuObs = false">Voltar</v-btn>
        </v-card-actions>
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
      <v-overlay :value="loading">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
  </div>
</template>
<script>
import VueScrollTo from "vue-scrollto";
import ImprimirLista from "./Imprimir";
import PagamentoListaModal from "./components/PagamentoListaModal";
export default {
  components: {
    ImprimirLista,
    PagamentoListaModal,
  },
  props: {
    lista: [Object],
    original: [Boolean],
    listas: [Array],
  },
  data: () => ({
    menu: false,
    imprimir: false,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    permissoes: {},
    typeSnackbar: "",
    timeSnackbar: 0,
    msgSnackbar: "",
    snackbar: false,
    loading: false,
    search: "",
    itens: [],
    headersProdutos: [   
     { text: "Código", value: "codigo", sortable: true },
      { text: "Saldo", value: "saldo", sortable: true },
      { text: "Descrição", value: "descricao", sortable: true },
      { text: "Marca", value: "marca", sortable: true },
      { text: "Status", value: "status", sortable: true},
      { text: "Valor", value: "valor", sortable: true },
      { text: "Qtd", value: "qtd", sortable: false, width: 100 },
    ],
    headers: [
      {
        text: "Código",
        value: "cod",
        align: "center",
        sortable: true,
        width: 180,
      },
      {
        text: "Qtd",
        value: "qtd_item",
        align: "center",
        sortable: false,
        width: 80,
      },
      { text: "Descrição", value: "descri_item", sortable: false, width: 300 },
      {
        text: "Valor",
        value: "valor",
        align: "center",
        sortable: false,
        width: 150,
      },
      { text: "Marca", value: "marca", sortable: false },
      { text: "Obs", value: "obs_item", sortable: false },
      {
        text: "Disponivel/Opcional",
        align: "center",
        value: "disponivel_item",
        sortable: false,
      },
      {
        text: "Ação",
        align: "center",
        value: "acao",
        sortable: false,
        width: 50,
      },
    ],
    descricao: "",
    codigo: "",
    image_path: "",
    produtos: [],
    toggle: false,
    rowId: 0,
    itemRepetidoDialog: false,
    itemRepetidoListaDialog: false,
    itemRepetidoLista: [],
    objectIndex: -1,
    objectItem: {},
    valorTotalSite: 0,
    valorTotalSistema: 0,
    lucroSistema: 0,
    lucroSite: 0,
    totalItens: 0,
    totalItensOpcionais: 0,
    descontoGeral: "",
    temDesconto: false,
    destacarOpcionais: true,
    dialogSenhaUsuario: false,
    dialogPagamento: false,
    senhaUsuario: "",
    deleteRowDialog: false,
    arrayItemsBlocked: [],
    dialogItemsBlocked: false,
    overlay: false,
    idsListas: [],
    showMenuImage: false,
    x: 0,
    y: 0,
    urlImg: "",
    showMenuObs: false,
  }),
  created() {
    this.$root.$emit("title", "Editar Lista");
    this.getPermissao();
    this.getItensLista();
  },
  computed: {
    orderedItens: function () {
      function compare(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      }

      this.itens.forEach((item) => {
        item.checked = true;
        item.checkedMarca2 = true;
        item.checkedQtd = true;
        item.permissaoValor = false;
        item.permissaoValorMarca2 = false;
      });

      return this.itens.sort(compare);
    },
  },
  methods: {
    corLinha(item) {
      //item.destacar || item.titulo ? '' : 'white'
      if (item.destacar || item.titulo) {
        return "blue lighten-4";
      } 
      if (item.bloqueado) {
        return "red lighten-4";
      }else if ((item.id + 1) % 2 == 0) {
        return "blue-grey lighten-4";
      } else {
        return "white";
      }
    },
    closePagamendoModal() {
      this.dialogPagamento = false;
      this.$parent.selectedSemestre.venda_semestre = this.lista.venda_semestre;
      this.$parent.selectedSemestre.reserva_semestre = this.lista.reserva_semestre;
    },
    pedidoDCInfo() {
      this.loading = true;
      this.$axios
        .post("/lista/pedidodcinfo", {
          itens: this.itens,
        })
        .then((res) => {
          this.loading = false;
          if (res.data === false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            console.log(res.data);
            console.log(res.data.body);
            let pedido = res.data.GravaPedidoVendaDentalSolidentResult;
            if (pedido) {
              this.showSnakerbar(
                "Orçamento " +
                  pedido.replace("_", ",") +
                  " Gerado Com Sucesso!",
                "success"
              );
            } else {
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    titulo(item) {
      item.cod = "";
      item.image_path = "";
      item.qtd_item = 1;
      item.saldo = 0;
      item.descricao = "";
      item.valor = 0;
      item.valor_site = 0;
      item.valor_original_site = 0;
      item.marca = "";
      item.obs_item = "";
      item.disponivel_item = 0;
      item.opcional_item = item.opcional_item;
      item.markDescricao = false;
      item.marcaOpcional = false;
      item.descricaoMarcaOpcional = "";
      item.nomeMarcaOpcional = "";
      item.valorMarcaOpcional = "";
      item.codMarcaOpcional = "";
      item.imagePathOpcional = "";
      item.cor = false;
      item.corCodigos = [];
      item.corCores = [];
      item.luva = false;
      item.luvaCodigos = [];
      item.luvaTamanhos = [];
      item.kit = false;
      item.rowsCores = [
        { codigo: "", cor: "", descricao: "", image_path: "", button: "+" },
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
    aplicarValorSistema() {
      this.$bvModal
        .msgBoxConfirm(
          "Deseja realmente aplicar o valor de sistema na lista?",
          {
            title: "Confirmação!",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "SIM",
            cancelTitle: "NÃO",
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

            this.showSnakerbar(
              "Preço de Sistema Aplicado com Sucesso!",
              "success",
              2000
            );
            this.calcTotalItens();
          }
        })
        .catch((err) => {});
    },
    checkListaBeforeSave() {
      let checked = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -60,
        force: true,
      };
     
          this.itens.forEach((item) => {
             try {
        if (item.disponivel_item == 1 && !item.valor_site) {
          id = "#item" + item.id;
          checked = false;
          item.checked = false;
        }
        if(item.cod == null){
          item.cod = ""
        }
        
        if (item.cod.length <= 0 && item.descri_item.length <= 0) {
          if (!item.cod && !item.descri_item) {
            this.removeRow(item);
          }
          item.permissaoValor = false;
          item.permissaoValorMarca2 = false;
        }
        if (item.disponivel_item == 1 && !item.cod) {                   
          id = "#item" + item.id;
          checked = false;
          item.checked = false;
        }
         } catch(error) {
        console.log('oporra', item, error)
      }
      });
     
    

      if (!checked) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.showSnakerbar(
          "Você esqueceu de preencher o CODIGO ou VALOR de um item disponível",
          "warning",
          4000
        );
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
      this.itens.forEach((item) => {
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
        VueScrollTo.scrollTo(id, 500, options);
        this.showSnakerbar(
          "Você esqueceu de preencher o Codigo da marca 2 ou Valor marca 2 disponível",
          "warning",
          2000
        );
      }
      return checked2;
    },
    checkListaBeforeSaveQtd() {
      let checked3 = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -160,
        force: true,
      };
      this.itens.forEach((item) => {
        if (item.disponivel_item == 1 && item.qtd_item <= 0) {
          id = "#item" + item.id;
          checked3 = false;
          item.checkedQtd = false;
        }
      });

      if (!checked3) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.showSnakerbar(
          "Você esqueceu de preencher a quantidade de um item disponivel! ",
          "warning",
          2000
        );
      }
      return checked3;
    },
    checkListaLuva(){
      let checkedLuva = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -160,
        force: true,
      };
      this.itens.forEach((item) => {
        if(item.luva){
          if (item.rowsLuvas.length) {
            item.rowsLuvas.forEach((i) => {
              i.codigo = i.codigo.replace(/^\s+/g, '');
              i.tamanho = i.tamanho.replace(/^\s+/g, '');
              if (
              i.codigo == "" && i.tamanho == "" || 
              i.codigo && i.tamanho == "" || 
              i.codigo == "" && i.tamanho 
              ) {
                id = "#item" + item.id;
                checkedLuva = false;
              }
              if (item.rowsLuvas.length < 2) {
                id = "#item" + item.id;
                checkedLuva = false;
              }
          });            
          }
      }
      });

      if (!checkedLuva) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.showSnakerbar(
          "Verifique se o Codigo e Tamanho da Luva estão preenchidos! ",
          "warning",
          2000
        );
      }
      return checkedLuva;
    },
    checkListaCor(){
      let checkedCor = true;
      let id = "";
      var options = {
        easing: "ease-in",
        offset: -160,
        force: true,
      };
      this.itens.forEach((item) => {
        if(item.cor){
          if (item.rowsCores.length) {
            item.rowsCores.forEach((i) => {
              i.codigo = i.codigo.replace(/^\s+/g, '');
              i.cor = i.cor.replace(/^\s+/g, '');
              if (
                i.codigo == "" && i.cor == "" ||
                 i.codigo && i.cor == "" ||
                  i.codigo == "" && i.cor 
                  ) {                
                id = "#item" + item.id;
                checkedCor = false;
              }
              if (item.rowsCores.length < 2) {
                id = "#item" + item.id;
                checkedCor = false;
              }
          });            
          }
      }
      });

      if (!checkedCor) {
        VueScrollTo.scrollTo(id, 500, options);
        this.calcTotalItens();
        this.showSnakerbar(
          "Verifique se o Codigo e Cor do item estão preenchidos! ",
          "warning",
          2000
        );
      }
      return checkedCor;
    },
    salvarLista() {
      if (
        this.checkListaBeforeSave() &&
        this.checkListaMarca2BeforeSave() &&
        this.checkListaBeforeSaveQtd() &&
        this.checkListaLuva() &&
        this.checkListaCor()  
      ) {
        this.calcTotalItens();
        this.disabledSave = true;
        this.loading = true;
        if (
          this.lista.nome_status_lista == "EM TESTE" ||
          this.lista.nome_status_lista == "ON-LINE"
        ) {
          this.listas.forEach((i) => {
            if (i.id_lista != this.lista.id_lista) {
              this.idsListas.push(i.id_lista);
            }
          });
          // salvar lista online
          this.$axios
            .put("/lista", {
              id_lista: this.lista.id_lista,
              itens: this.itens,
              valor_total: this.valorTotalSite,
              itens_total: this.totalItens,
              lucro_sistema: this.lucroSistema,
              lucro_site: this.lucroSite,
              nome_exibicao: this.lista.nome_exibi_lista,
              usuario: this.$usuario.value.usuario.toUpperCase(),
              original: this.original,
              id_semestre: this.lista.id_semestre_lista,
              completa: this.lista.mostrar_completa,
              pagamento: this.lista.venda_semestre,
              reserva: this.lista.reserva_semestre,
              limite_venda: this.lista.limite_venda,
              idsListas: this.idsListas,
              id_faculdade: this.lista.id_faculdade_lista,
            })
            .then((res) => {
              this.loading = false;
              this.disabledSave = false;
              if (res.data === false) {
                this.idsListas = [];
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              } else {
                if (Array.isArray(res.data)) {
                  this.itemRepetidoLista = [];
                  this.itemRepetidoLista = res.data;
                  this.itemRepetidoListaDialog = true;
                  this.idsListas = [];
                  this.loading = false;
                } else {
                  this.idsListas = [];
                  this.showSnakerbar(
                    "Lista Editada Com Sucesso!",
                    "success",
                    2000
                  );
                  this.itemRepetidoLista = [];
                  this.$parent.selectedSemestre.limite_venda = this.lista.limite_venda;
                  //this.$parent.completa = this.listaCompleta;
                  this.loading = false;
                }
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        } else {          
          this.$axios
            .put("/lista", {
              id_lista: this.lista.id_lista,
              itens: this.itens,
              valor_total: this.valorTotalSite,
              itens_total: this.totalItens,
              lucro_sistema: this.lucroSistema,
              lucro_site: this.lucroSite,
              nome_exibicao: this.lista.nome_exibi_lista,
              usuario: this.$usuario.value.usuario.toUpperCase(),
              original: this.original,
              id_semestre: this.lista.id_semestre_lista,
              completa: this.lista.mostrar_completa,
              pagamento: this.lista.venda_semestre,
              reserva: this.lista.reserva_semestre,
              limite_venda: this.lista.limite_venda,
              revisador: this.$usuario.value.revisador,
              observacao: this.lista.observacao
            })
            .then((res) => {
              this.loading = false;
              this.disabledSave = false;
              if (res.data === false) {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              } else {
                this.showSnakerbar(
                  "Lista Editada Com Sucesso!",
                  "success",
                  2000
                );

                this.$parent.selectedSemestre.limite_venda = this.lista.limite_venda;
                //this.$parent.completa = this.listaCompleta;
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      }
    },
    callDestacarOpcionais() {
      if (this.destacarOpcionais) {
        this.itens.forEach((item) => {
          if (item.opcional_item == 1) {
            item.destacar = true;
          } else {
            item.destacar = false;
          }
        });
      } else {
        this.itens.forEach((item) => {
          if (item.opcional_item == 1) {
            item.destacar = false;
          }
        });
      }
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
    checkLimiteValorMarcaOpcional(valor_digitado, item) {
      valor_digitado = parseFloat(valor_digitado.replace(",", "."));
      //100   *   (10   ÷   100)
      let maximo =
        parseFloat(item.valorMarcaOpcionalOriginal) *
          (this.permissoes.margem_preco / 100) +
        parseFloat(item.valorMarcaOpcionalOriginal);
      let minimo =
        parseFloat(item.valorMarcaOpcionalOriginal) -
        parseFloat(item.valorMarcaOpcionalOriginal) *
          (this.permissoes.margem_preco / 100);

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
    checkLimiteValorSite(valor_digitado, item) {
      valor_digitado = parseFloat(valor_digitado.replace(",", "."));
      //100   *   (10   ÷   100)
      let maximo =
        parseFloat(item.valor) * (this.permissoes.margem_preco / 100) +
        parseFloat(item.valor);

      let minimo =
        parseFloat(item.valor) -
        parseFloat(item.valor) * (this.permissoes.margem_preco / 100);

      let limiteMinimoItem = (item.valor_original_site * 50) / 100;
      let limiteMaximoItem = (item.valor_original_site * 200) / 100;

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
            this.showSnakerbar("Senha incorreta!", "warning", 2000);
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
        item.valor_site = item.valor;
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
      //100   *   (10   ÷   100)
      let maximo =
        item.valorMarcaOpcionalOriginal * (this.permissoes.margem_preco / 100) +
        item.valorMarcaOpcionalOriginal;
      let minimo =
        item.valorMarcaOpcionalOriginal -
        item.valorMarcaOpcionalOriginal * (this.permissoes.margem_preco / 100);

      let limiteMinimoItem = (item.valorMarcaOpcionalOriginal * 50) / 100;
      let limiteMaximoItem = (item.valorMarcaOpcionalOriginal * 200) / 100;
      console.log(limiteMinimoItem);
      console.log(limiteMaximoItem);

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
    calcTotalItens() {
      let itens = 0;
      let itensOpcionais = 0;
      let valoresSite = 0;
      let valoresSistema = 0;
      let ultimaCompra = 0;
      let totalUltimaCompra = 0;
      this.itens.forEach((item) => {
        ultimaCompra = parseFloat(item.valorUltimaCompra);

        if (ultimaCompra == 0) {
          ultimaCompra = parseFloat(item.valorFabricante);
        } else {
          ultimaCompra =
            parseFloat(item.valorUltimaCompra) *
            ((100 + parseFloat(item.ipi)) / 100);
        }

        if (
          item.disponivel_item == 1 &&
          item.opcional_item == 0 &&
          !item.titulo
        ) {
          if (!item.qtd_item) {
            item.qtd = 1;
          }
          if (item.valor_site < 0) {
            item.valor_site = 0;
          }
          itens += parseInt(item.qtd_item);
          valoresSite += parseFloat(item.valor_site) * item.qtd_item;
          valoresSistema += parseFloat(item.valor) * item.qtd_item;
          totalUltimaCompra += ultimaCompra * item.qtd_item;

          let lucro = (item.valor_site / ultimaCompra) * 100 - 100;
          item.lucro = lucro.toFixed(2);
        } else {
          if (item.opcional_item == 1) {
            itensOpcionais += parseInt(item.qtd_item);
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
          this.showSnakerbar("Valor de desconto incorreto!", "warning", 2000);
        } else {
          this.descontoGeral = parseFloat(this.descontoGeral);
          this.itens.forEach((element) => {
            let valorAtual = parseFloat(element.valor_site);
            let valorComDesconto =
              valorAtual - valorAtual * (this.descontoGeral / 100);
            element.valor_site = valorComDesconto.toFixed(2);
          });
          this.calcTotalItens();
          this.temDesconto = true;
        }
      } else {
        this.itens.forEach((element) => {
          element.valor_site = element.valor_original_site;
        });
        this.temDesconto = false;
        this.descontoGeral = "";
        this.calcTotalItens();
      }
    },
    checkEditValue(item, data) {
      this.$bvModal
        .msgBoxConfirm("O que você deseja fazer?", {
          title: "Confirmação",
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
            item.valor = data.valor;
            item.valor_original_site = data.valor;
            item.cod = data.codigo;
            item.image_path = data.image_path;
            //item.descri_item = data.descricao;
            item.descricao = data.descricao;
            item.marca = data.marca;
            item.saldo = data.saldo;
            item.valorUltimaCompra = data.valor_ultima_compra;
            item.ipi = data.ipi;
            item.valorFabricante = data.valor_fabricante;
            item.permissaoValor = false;
          } else {
            item.cod = data.codigo;
            item.image_path = data.image_path;
            //item.descri_item = data.descricao;
            item.descricao = data.descricao;
            item.valor = data.valor;
            item.marca = data.marca;
            item.saldo = data.saldo;
            item.valorUltimaCompra = data.valor_ultima_compra;
            item.ipi = data.ipi;
            item.valorFabricante = data.valor_fabricante;
            item.permissaoValor = false;
          }

          item.disponivel_item = 1;
          this.calcTotalItens();
        });
      item.markDescricao = true;
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
    getLuva(value, rowLuva) {
      if (value) {
        this.$axios
          .get("/produto/getByCod", {
            params: {
              cod: value,
            },
          })
          .then((res) => {
            console.log(res.data);
            rowLuva.descricao = res.data.descricao;
            rowLuva.image_path = res.data.image_path;
            rowLuva.saldo = res.data.saldo;
          })
          .catch((err) => {
            console.log(err);
          });
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
            if (res.data === false || res.data === null) {
              //item nao encontrado
              this.showSnakerbar("Produto Não Encontrado!", "warning", 2000);
            }
            if (res.data != null && res.data.status != 1) {           
              this.showSnakerbar("Produto " + res.data.codigo +" - " + res.data.descricao + " Item Bloqueado!","error", 3000);
            }
            else {             
              item.cod = "";
              item.descricao = "";
              item.image_path = "";
              //item.descri_item = "";
              // item.valor_site = "";
              item.valor_original_site = "";
              item.valor = "";
              item.marca = "";
              item.saldo = "";
              item.valorUltimaCompra = "";
              item.ipi = "";
              item.valorFabricante = "";
              item.disponivel_item = 0;
              item.bloqueado = false;
              if (
                this.itens.some(
                  (e) =>
                    e.cod == res.data.codigo ||
                    e.codMarcaOpcional == res.data.codigo
                )
              ) {
                this.showSnakerbar(
                  "Produto " +
                    res.data.codigo +
                    " - " +
                    res.data.descricao +
                    " Repetido!",
                  "warning"
                );
              } else {
                console.log("2");
                if (item.valor_site) {
                  this.checkEditValue(item, res.data);
                } else {
                  console.log("3");
                  item.cod = res.data.codigo;
                  item.image_path = res.data.image_path;
                  item.descricao = res.data.descricao;
                  item.descri_item = res.data.descricao;
                  item.valor_site = res.data.valor;
                  item.valor_original_site = res.data.valor;
                  item.valor = res.data.valor;
                  item.marca = res.data.marca;
                  item.saldo = res.data.saldo;
                  item.valorUltimaCompra = res.data.valor_ultima_compra;
                  item.ipi = res.data.ipi;
                  item.valorFabricante = res.data.valor_fabricante;
                  item.disponivel_item = 1;
                  item.bloqueado = false;
                  //this.insertRowLuva(res.data.codigo);
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
              this.showSnakerbar("Produto Não Encontrado!", "warning", 2000);
            } else {
              if (
                this.itens.some(
                  (e) =>
                    e.cod == res.data.codigo ||
                    e.codMarcaOpcional == res.data.codigo
                )
              ) {
                this.showSnakerbar(
                  "Produto " +
                    res.data.codigo +
                    " - " +
                    res.data.descricao +
                    " Repetido!",
                  "warning"
                );
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
    removeRowDialog(item) {
      this.objectItem = item;

      if (!item.cod && !item.descri_item) {
        this.removeRow(this.objectItem);
      } else {
        this.deleteRowDialog = true;
      }
    },
    removeRow(item) {
      if (this.itens.length !== 1) {
        this.itens = this.itens.filter(function (element) {
          return element.id != item.id;
        });
        for (let i = 0; i < this.itens.length; i++) {
          this.$set(this.itens[i], "id", i);
        }
        this.totalItens -= item.qtd_item;
        this.calcTotalItens();
      }
      this.deleteRowDialog = false;
    },
    addRow(item) {
      var row = {
        id: item.id + 1,
        cod: "",
        image_path: "",
        qtd_item: 1,
        saldo: 0,
        descricao: "",
        descri_item: "",
        valor: 0,
        valor_site: 0,
        valor_original_site: 0,
        marca: "",
        obs_item: "",
        disponivel_item: 0,
        opcional_item: 0,
        imagem_item: 0,
        markDescricao: false,
        marcaOpcional: false,
        descricaoMarcaOpcional: "",
        nomeMarcaOpcional: "",
        valorMarcaOpcional: "",
        codMarcaOpcional: "",
        imagePathOpcional: "",
        cor: false,
        corCodigos: [],
        corCores: [],
        luva: false,
        luvaCodigos: [],
        luvaTamanhos: [],
        kit: false,
        rowsCores: [
          { codigo: "", cor: "", descricao: "", image_path: "", button: "+" },
        ],
        rowsLuvas: [{ codigo: "", tamanho: "", descricao: "", button: "+" }],
        rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
        trava_qtd_item: false,
        titulo: false,
        valorUltimaCompra: 0,
        ipi: 0,
        valorFabricante: 0,
        dialogSenhaUsuario: false,
        permissaoValor: false,
        permissaoValorMarca2: false,
      };

      let i = item.id + 1;
      for (i; i < this.itens.length; i++) {
        this.$set(this.itens[i], "id", this.itens[i].id + 1);
      }

      this.itens.push(row);
      this.rowId = this.itens.length;
      this.totalItens += row.qtd;
      this.calcTotalItens();

      this.$nextTick(() => {
        let index = this.itens.length - 1;
        let input = this.$refs.codigo[item.id + 1];

        input.focus();
        input.scrollIntoView();
        this.$nextTick(() => {
          window.scrollBy(0, -50);
        });
        // let index = item.id + 1 + "input-codigo";
        // let input = this.$refs[index];
        // input.focus();
        // this.$nextTick(() => {
        // 	window.scrollBy(0, -50);
        // });
      });
    },
    addRowKit(item) {
      if (item.rowsKits.length >= 1) {
        item.rowsKits.push({ qtd: 1, descricao: "", button: "-" });
      }
    },
    removeRowKit(item) {
      item.rowsKits.pop();
    },
    somarItemRepetido(itemRepetido) {
      this.itens.forEach((item) => {
        if (item.cod === itemRepetido.codigo) {
          item.qtd_item = parseInt(item.qtd_item) + parseInt(itemRepetido);
        }
      });
      this.itemRepetidoDialog = false;
      this.calcTotalItens();
    },
    addOrRemoveItem(produto) {
      if (!produto.added) {
        if (this.itens.some((e) => e.cod === produto.codigo)) {
          this.objectItem = produto;
          this.itemRepetidoDialog = true;
        } else {
          this.rowId = this.itens.length;
          var row = {
            id: this.rowId,
            cod: produto.codigo,
            image_path: produto.image_path,
            qtd_item: produto.qtd,
            saldo: produto.saldo,
            descricao: produto.descricao,
            descri_item: produto.descricao,
            valor: produto.valor,
            valor_site: produto.valor,
            valor_original_site: produto.valor,
            marca: produto.marca,
            obs_item: "",
            disponivel_item: 1,
            opcional_item: 0,
            imagem_item: 0,
            markDescricao: false,
            marcaOpcional: false,
            descricaoMarcaOpcional: "",
            nomeMarcaOpcional: "",
            valorMarcaOpcional: "",
            codMarcaOpcional: "",
            imagePathOpcional: "",
            cor: false,
            corCodigos: [],
            corCores: [],
            luva: false,
            luvaCodigos: [],
            luvaTamanhos: [],
            kit: false,
            rowsKits: [{ qtd: 1, descricao: "", button: "+" }],
            trava_qtd_item: false,
            titulo: false,
            valorUltimaCompra: produto.valor_ultima_compra,
            ipi: produto.ipi,
            valorFabricante: produto.valor_fabricante,
            checked: true,
          };

          this.itens.push(row);

          produto.added = true;
          produto.row = this.rowId;
          this.rowId = this.itens.length;
          this.totalItens += parseInt(produto.qtd);
        }
      } else {
        // remover
        this.itens = this.itens.filter(function (element) {
          return element.cod != produto.codigo;
        });
        for (let i = 0; i < this.itens.length; i++) {
          this.$set(this.itens[i], "id", i);
        }
        produto.added = false;
        this.totalItens -= parseInt(produto.qtd);
      }

      this.calcTotalItens();
    },
    findProduto() {
      if (this.descricao && this.descricao.length >= 4) {
        setTimeout(
          () =>
            this.$axios
              .get("/produto/find", {
                params: {
                  descricao: this.descricao.trim(),
                },
              })
              .then((res) => {
                console.log(res.data);
                if (res.data !== false) {
                  this.produtos = res.data;
                  this.toggle = true;
                }
              })
              .catch((err) => {
                console.log(err);
              }),
          500
        );
      }
    },
    findProdutoByCod() {
      if (this.codigo && this.codigo.length >= 4) {
        setTimeout(
          () =>
            this.$axios
              .get("/produto/findByCod", {
                params: {
                  codigo: this.codigo.trim(),
                },
              })
              .then((res) => {
                if (res.data !== false) {
                  console.log(this.produtos);
                  this.produtos = res.data;
                  this.toggle = true;
                }
              })
              .catch((err) => {
                console.log(err);
              }),
          500
        );
      }
    },
    getItensLista() {
      this.loading = true;
      this.$axios
        .post("/lista/getItens", {
          id: this.lista.id_lista,
          original: this.original,
          id_faculdade: this.lista.id_faculdade_lista,
        })
        .then((res) => {
          this.loading = false;
          console.log(res.data);
          if (res.data === false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            this.itens = res.data;
            this.rowId = res.data.length;
            this.calcTotalItens();
            this.verItemsBlocked();
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    verItemsBlocked(){
      let checkItemBlocked = false;
      
      for(let i of this.itens){
        if (i.bloqueado) {
          this.arrayItemsBlocked.push(i);
        }
      }
      
      if (this.arrayItemsBlocked.length) {
        checkItemBlocked = true;
       this.dialogItemsBlocked = true;
      }
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
    formatValues(val) {
      if (!isNaN(val)) {
        val = parseFloat(val);
        return val.toFixed(2).replace(".", ",");
      }
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
    showMenuObservacao(e){
      this.showMenuStatus = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenuObs = true;
        });
    },
    salvarObsLista(){
      this.$axios
            .put("/listaObservacao", {
              id_lista: this.lista.id_lista,
              observacao: this.lista.observacao
            })
            .then((res) => {             
              if (res.data === false) {
                this.showSnakerbar(
                  "Erro no Servidor, Contate o Administrador",
                  "error"
                );
              } else {
                this.showSnakerbar(
                  "Observação salva com Sucesso!",
                  "success",
                  2000
                );              
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
    },
  },
};
</script>
<style scope>
.label-text {
  font-weight: 600;
  font-size: 14px;
  color: black !important;
}
.overlay-trava {
  z-index: 9999;
  pointer-events: none;
}
.corOriginal {
  background-color: #E3F2FD !important;
}
.corOnline {
  background-color: #f1f8e9 !important;
}
</style>
