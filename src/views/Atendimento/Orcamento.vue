<template>
  <v-container
    fluid
    pa-0
    class="d-flex flex-column flex-grow-1 fill-parent-height pl-3 pr-3"
  >
    <v-row no-gutters class="top-row flex-grow-1 flex-shrink-1">
      <v-col class="fill-parent-height">
        <v-row dense justify="center" style="height: 10%">
          <v-col class="fill-parent-height">
            <v-card>
              <v-card-text>
                <v-row dense justify="center">
                  <v-col cols="5">
                    <v-text-field
                      filled
                      @click="showDialogCliente()"
                      placeholder="Clique para buscar o cliente"
                      prepend-inner-icon="fa-user"
                      autocomplete="nope"
                      dense
                      :hide-details="true"
                      height="10"
                      v-model.trim="cliente.razao_social"
                      label="Cliente"
                    ></v-text-field>
                    <v-dialog
                      width="1400px"
                      persistent
                      eager
                      v-model="dialogCliente"
                      scrollable
                    >
                      <v-card>
                        <v-card-title>
                          Clientes
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-btn
                            text
                            color="error"
                            @click="dialogCliente = false"
                            ><v-icon left>fa-undo-alt</v-icon> Voltar</v-btn
                          >
                          <v-btn
                            text
                            color="success"
                            @click="showDialogCadastrar()"
                            ><v-icon left>fa-user-plus</v-icon> Cadastrar</v-btn
                          >
                          <div class="flex-grow-1"></div>
                          <v-row>
                            <v-col cols="12" sm="8">
                              <v-text-field
                                ref="inputSearchCliente"
                                autocomplete="off"
                                type="search"
                                autofocus
                                v-model="searchCliente"
                                prepend-icon="fa-search"
                                label="Nome, CPF, CNPJ"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-text-field
                                autoautocomplete="off"
                                type="search"
                                v-model="searchCod"
                                prepend-icon="fa-user"
                                label="Código"
                                v-mask="'#####'"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            text
                            color="success"
                            @click="dialogCliente = false"
                            ><v-icon left>fa-check</v-icon> Selecionar</v-btn
                          >
                        </v-card-title>
                        <q-virtual-scroll
                          ref="buscarcliente"
                          type="table"
                          dense
                          style="max-height: 65vh"
                          :virtual-scroll-item-size="24"
                          :virtual-scroll-sticky-size-start="24"
                          :virtual-scroll-sticky-size-end="16"
                          :items="clientes"
                        >
                          <template v-slot:before>
                            <thead
                              class="thead-sticky text-left bg-header-item"
                            >
                              <tr>
                                <th
                                  v-for="col in headersClientes"
                                  :key="'1--' + col.text"
                                >
                                  {{ col.text }}
                                </th>
                              </tr>
                            </thead>
                          </template>
                          <template v-slot="{ item: row, index }">
                            <tr
                              @click="selectCliente(row, index)"
                              dense
                              :class="{
                                'blue lighten-4': index === cliente.index,
                              }"
                              :key="index"
                            >
                              <td
                                v-for="col in headersClientes"
                                :key="index + '-' + col.text"
                              >
                                <div v-if="col.value == 'cpf_cnpj'">
                                  {{ putMask(row[col.value], "cpf/cnpj") }}
                                </div>
                                <div v-else-if="col.value == 'telefone'">
                                  {{ putMask(row[col.value], "telefone") }}
                                </div>
                                <div v-else-if="col.value == 'celular'">
                                  {{ putMask(row[col.value], "celular") }}
                                </div>
                                <div v-else>{{ row[col.value] }}</div>
                              </td>
                            </tr>
                          </template>
                        </q-virtual-scroll>
                      </v-card></v-dialog
                    >
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      height="10"
                      :hide-details="true"
                      autocomplete="nope"
                      filled
                      prepend-inner-icon="fa-id-card"
                      v-model="cliente.cpf_cnpj"
                      label="CPF/CNPJ"
                      v-mask="['###.###.###-##', '##.###.###/####-##']"
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col class="text-center" cols="2">
                    <v-menu
                      :close-on-click="false"
                      v-model="menu_cliente"
                      :close-on-content-click="false"
                      :nudge-width="800"
                      offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          :disabled="
                            permissoes.editar_cliente == 1
                              ? cliente.selected
                                ? false
                                : true
                              : true
                          "
                          small
                          v-bind="attrs"
                          v-on="on"
                          tile
                          color="success"
                        >
                          <v-icon left>fa-user-edit </v-icon>
                          Editar Informações
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item>
                            <v-list-item-avatar>
                              <v-icon large>fa-id-card </v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title>{{
                                cliente.razao_social
                              }}</v-list-item-title>
                              <v-list-item-subtitle>{{
                                cliente.fantasia
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                        <v-row dense no-gutters>
                          <v-col>
                            <v-text-field
                              class="input-uppercase"
                              :error-messages="
                                v$.cliente.email.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              height="10"
                              :hide-details="true"
                              autocomplete="nope"
                              filled
                              dense
                              label="E-Mail"
                              v-model="cliente.email"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              class="input-uppercase"
                              height="10"
                              :hide-details="true"
                              autocomplete="nope"
                              filled
                              dense
                              label="Contato"
                              v-model="cliente.observacao"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              :error-messages="
                                v$.cliente.telefone.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              label="Telefone"
                              height="10"
                              :hide-details="true"
                              autocomplete="nope"
                              filled
                              dense
                              v-mask="'(##) ####-####'"
                              v-model="cliente.telefone"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              :error-messages="
                                v$.cliente.celular.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              label="Celular"
                              v-mask="'(##) # ####-####'"
                              height="10"
                              :hide-details="true"
                              autocomplete="nope"
                              filled
                              dense
                              v-model="cliente.celular"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row dense no-gutters>
                          <v-col>
                            <v-text-field
                              @keyup="getCep(cliente.cliente_enderecos)"
                              :error-messages="
                                v$.cliente.cliente_enderecos.cep.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              :loading="cepLoading"
                              ref="cep_principal"
                              v-mask="'#####-###'"
                              height="10"
                              hint="Digite somento números"
                              autocomplete="nope"
                              filled
                              dense
                              label="Cep"
                              v-model="cliente.cliente_enderecos.cep"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              type="search"
                              autocomplete="off"
                              class="input-uppercase"
                              hint="Rua, Avenida, Estrada..."
                              v-model.trim="
                                cliente.cliente_enderecos.logradouro
                              "
                              :error-messages="
                                v$.cliente.cliente_enderecos.logradouro.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              filled
                              dense
                              label="Endereço"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              filled
                              dense
                              label="Número"
                              type="search"
                              autocomplete="off"
                              v-model="cliente.cliente_enderecos.numero"
                              :error-messages="
                                v$.cliente.cliente_enderecos.numero.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              ref="numero_principal"
                              v-mask="'####'"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              type="search"
                              autocomplete="off"
                              class="input-uppercase"
                              filled
                              dense
                              label="Complemento"
                              v-model.trim="
                                cliente.cliente_enderecos.complemento
                              "
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row dense no-gutters>
                          <v-col>
                            <v-text-field
                              height="10"
                              class="input-uppercase"
                              type="search"
                              autocomplete="off"
                              v-model.trim="cliente.cliente_enderecos.bairro"
                              :error-messages="
                                v$.cliente.cliente_enderecos.bairro.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              filled
                              dense
                              label="Bairro"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              type="search"
                              autocomplete="off"
                              class="input-uppercase"
                              v-model.trim="cliente.cliente_enderecos.cidade"
                              :error-messages="
                                v$.cliente.cliente_enderecos.cidade.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              filled
                              dense
                              label="Cidade"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              type="search"
                              autocomplete="off"
                              class="input-uppercase"
                              v-model.trim="cliente.cliente_enderecos.uf"
                              :error-messages="
                                v$.cliente.cliente_enderecos.uf.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              filled
                              dense
                              label="Estado"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row dense no-gutters>
                          <v-col>
                            <v-select
                              :error-messages="
                                v$.cliente.tipo.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              height="10"
                              filled
                              :items="tipos"
                              return-object
                              v-model="cliente.tipo"
                              label="Tipo"
                              dense
                              :hide-details="true"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              :error-messages="
                                v$.cliente.atividade.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              height="10"
                              filled
                              :items="atividades"
                              return-object
                              v-model="cliente.atividade"
                              label="Atividade"
                              dense
                              :hide-details="true"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              :error-messages="
                                v$.cliente.condicao.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              height="10"
                              filled
                              :items="condicoes"
                              return-object
                              v-model="cliente.condicao"
                              label="Condição"
                              dense
                              :hide-details="true"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-text-field
                              :error-messages="
                                v$.cliente.inscricao_estadual.$error
                                  ? 'Campo Obrigatório'
                                  : ''
                              "
                              height="10"
                              filled
                              dense
                              label="Inscrição Estadual"
                              v-mask="'#########'"
                              type="search"
                              autocomplete="off"
                              v-model="cliente.inscricao_estadual"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              height="10"
                              type="search"
                              autocomplete="off"
                              filled
                              dense
                              label="Inscrição Municipal"
                              v-model.trim="cliente.inscricao_municipal"
                              :hide-details="true"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row dense no-gutters>
                          <v-col>
                            <v-select
                              :error-messages="
                                v$.atendente.$error ? 'Campo Obrigatório' : ''
                              "
                              height="10"
                              filled
                              item-text="nome"
                              item-value="codigo"
                              :items="vendedores"
                              v-model="atendente"
                              label="Atendente"
                              dense
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-text-field
                              readonly
                              type="search"
                              height="10"
                              :hide-details="true"
                              autocomplete="off"
                              filled
                              dense
                              label="Grupo"
                              v-model="cliente.grupo_dc_info"
                            ></v-text-field>
                          </v-col>
                          <v-col class="text-center" align-self="center">
                            <v-btn
                              @click="editarGrupo()"
                              color="primary"
                              small
                              bottom
                              dense
                              >Editar Grupo</v-btn
                            >
                          </v-col>
                        </v-row>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn
                            color="error"
                            text
                            @click="menu_cliente = false"
                          >
                            Fechar
                          </v-btn>
                          <v-btn color="success" text @click="validate()">
                            Salvar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="pl-3 pr-3" dense justify="center">
          <v-col cols="6" class="fill-parent-height">
            <v-dialog
              width="1024px"
              @click:outside="closeSnackbar()"
              @keydown.esc="closeSnackbar()"
              eager
              v-model="dialogItems"
              scrollable
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  block
                  depressed
                  @click="focusInputSearch()"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Buscar Itens
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <v-text-field
                    dense
                    placeholder="Busque por código ou descrição"
                    ref="searchinput"
                    outlined
                    hide-details
                    v-on:keyup.page-down="focusOnTable()"
                    v-model="searchProduto"
                  ></v-text-field
                ></v-card-title>
                <v-card-text>
                  <q-virtual-scroll
                    class="fill-parent-height"
                    ref="tabelaItens"
                    type="table"
                    dense
                    :virtual-scroll-slice-size="100"
                    :virtual-scroll-item-size="100"
                    :virtual-scroll-sticky-size-start="48"
                    :virtual-scroll-sticky-size-end="32"
                    :items="items"
                  >
                    <template v-if="entries_items.length > 0" v-slot:before>
                      <thead class="thead-sticky bg-header-item text-left">
                        <tr>
                          <th
                            v-for="col in headersItens"
                            :key="'1--' + col.name"
                          >
                            {{ col.name }}
                          </th>
                        </tr>
                      </thead>
                    </template>
                    <template v-slot="{ item: row, index }">
                      <tr
                        class="bg-table-item"
                        ref="linha"
                        @click="selectItem(row, index)"
                        dense
                        :key="index"
                        :class="{
                          'blue lighten-4': index === selected_item.index,
                        }"
                      >
                        <td
                          v-for="col in headersItens"
                          :key="index + '-' + col.name"
                        >
                          <div v-if="col.prop == 'saldo'">
                            <span
                              v-if="permissoes.ver_saldo"
                              :class="
                                row[col.prop] > 0
                                  ? 'success--text'
                                  : 'error--text'
                              "
                              >{{ row[col.prop] }}</span
                            >
                          </div>
                          <div v-else-if="col.prop == 'valor'">
                            {{
                              new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(row[col.prop])
                            }}
                          </div>
                          <div v-else>{{ row[col.prop] }}</div>
                        </td>
                      </tr>
                    </template>
                  </q-virtual-scroll>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="error"
                    text
                    @click="
                      dialogItems = false;
                      closeSnackbar();
                    "
                  >
                    Fechar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col id="btn-menu" cols="2" class="fill-parent-height text-center">
            <v-chip
              @click="showMenuDesconto()"
              color="indigo"
              text-color="white"
            >
              <v-avatar left>
                {{ desconto_geral.length == 0 ? "0" : desconto_geral }} %
              </v-avatar>
              Desconto
            </v-chip>

            <v-menu
              attach="#btn-menu"
              v-model="menu_desconto"
              :close-on-content-click="false"
              :nudge-width="340"
              offset-x
            >
              <v-card>
                <div>
                  <v-overlay absolute :value="!permissoes.ver_desconto">
                    <h6 class="error--text">Você não tem permissão</h6>
                  </v-overlay>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>Desconto Geral</v-list-item-title>
                      <v-list-item-action>
                        <v-text-field
                          autocomplete="nope"
                          :disabled="!pode_desconto"
                          @keypress.enter="callDescontoGeral()"
                          @click="$event.target.select()"
                          v-model="desconto_geral"
                          class="input-qtd-produtos"
                          suffix="%"
                          :append-icon="
                            tem_desconto
                              ? 'fas fa-times'
                              : 'fas fa-check randonly'
                          "
                          @click:append="callDescontoGeral()"
                        ></v-text-field>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title
                        >Resetar desconto unitário</v-list-item-title
                      >
                      <v-list-item-action>
                        <v-btn
                          :disabled="pode_desconto"
                          class="white--text"
                          color="warning"
                          @click="resetarDesconto()"
                          small
                          ><v-icon x-small>fas fa-percent</v-icon></v-btn
                        >
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </div>

                <v-card-actions>
                  <v-btn color="error" text @click="menu_desconto = false">
                    Fechar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="2" class="fill-parent-height text-center">
            <v-btn
              @click="
                dialogObs = true;
                obs_pedido = obs_grupo;
              "
              color="success"
              dark
            >
              Salvar
            </v-btn>
          </v-col>
          <v-col cols="2" class="fill-parent-height text-center">
            <v-menu origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="black" v-bind="attrs" v-on="on" icon dark>
                  <v-icon>fa-bars</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn @click="imprimir()" tile color="success">
                    <v-icon left> fa-print </v-icon>
                    Imprimir
                  </v-btn>
                  <Imprimir
                    :pedido="{
                      cliente: cliente,
                      itens: itens_pedido,
                      id: false,
                      total: valor_total,
                      usuario: $usuario.value.usuario,
                    }"
                    v-show="dialogImprimir"
                    id="print"
                  ></Imprimir>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="dialogLimpar = true" tile color="error">
                    <v-icon left> fa-trash </v-icon>
                    Limpar
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-row
          class="mb-1 warning white--text"
          style="width: 50%; margin: auto"
          v-if="edicao"
          dense
          justify="center"
        >
          PEDIDO NÚMERO {{ pedido_editar.id }} EM EDIÇÃO
        </v-row>
        <v-row dense no-gutters style="height: 78%">
          <v-col class="fill-parent-height">
            <q-virtual-scroll
              class="fill-parent-height"
              v-if="itens_pedido.length > 0"
              ref="tabelaItensPedido"
              type="table"
              dense
              :virtual-scroll-item-size="24"
              :virtual-scroll-sticky-size-start="24"
              :virtual-scroll-sticky-size-end="16"
              :items="itens_pedido"
            >
              <template v-slot:before>
                <thead class="thead-sticky bg-header-item-pedido text-left">
                  <tr>
                    <th
                      v-for="col in headersItensPedido"
                      :key="'1--' + col.name"
                    >
                      {{ col.name }}
                    </th>
                  </tr>
                </thead>
              </template>
              <template v-slot="{ item: row, index }">
                <tr dense :key="index">
                  <td
                    v-for="col in headersItensPedido"
                    :key="index + '-' + col.name"
                  >
                    <div v-if="col.prop == '#'">#{{ index + 1 }}</div>
                    <div class="text-center" v-if="col.prop == 'X'">
                      <v-btn
                        @click="removeItem(index)"
                        x-small
                        icon
                        color="red darken-2"
                      >
                        <v-icon>fa-times</v-icon>
                      </v-btn>
                    </div>
                    <div v-if="col.prop == 'qtd'">
                      <v-text-field
                        dense
                        hide-details
                        v-model="row[col.prop]"
                        @click="
                          $event.target.select();
                          calcular_itens_pedido();
                        "
                        @keyup="
                          onRemove(index);
                          calcular_itens_pedido();
                        "
                        @change="calcular_itens_pedido()"
                        v-mask="'####'"
                        height="10"
                        style="width: 40px"
                      ></v-text-field>
                    </div>
                    <div v-else-if="col.prop == 'desconto'">
                      <v-text-field
                        :disabled="
                          tem_desconto || permissoes.ver_desconto == 1
                            ? false
                            : true
                        "
                        autocomplete="nope"
                        @click="$event.target.select()"
                        @keyup="
                          calcDesconto(row);
                          calcular_itens_pedido();
                        "
                        @change="calcular_itens_pedido()"
                        dense
                        height="10"
                        style="width: 60px"
                        hide-details
                        suffix="%"
                        v-model="row.desconto"
                      ></v-text-field>
                    </div>
                    <div v-else-if="col.prop == 'valor'">
                      {{
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(row[col.prop])
                      }}
                    </div>
                    <div v-else-if="col.prop == 'total'">
                      {{
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(row.valor * row.qtd)
                      }}
                    </div>
                    <div v-else-if="col.prop == 'descricao'">
                      {{ row.descricao }}
                      <div v-if="row.sem_saldo">
                        <v-chip
                          x-small
                          class="text-center"
                          color="error"
                          dark
                          heigth="40"
                          >SOB ENCOMENDA</v-chip
                        >
                      </div>
                    </div>
                    <div v-else>{{ row[col.prop] }}</div>
                  </td>
                </tr>
              </template>
            </q-virtual-scroll>
            <div v-else class="d-flex justify-center fill-height">
              <div class="align-self-center">
                <h5>Nenhum Item no Orçamento</h5>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      dense
      justify="center"
      no-gutters
      class="bottom-row flex-grow-0 flex-shrink-0 text-h6"
    >
      <v-col cols="4" class="grid-item text-center">
        PRODUTOS: {{ qtd_total }}
      </v-col>
      <v-col cols="4" class="grid-item text-center">
        <span v-if="permissoes.ver_lucro">
          LUCRO:
          {{
            new Intl.NumberFormat({
              style: "percent",
              minimumFractionDigits: 2,
            }).format(lucro_site)
          }}
          %
        </span>
      </v-col>
      <v-col cols="4" class="grid-item text-center">
        TOTAL:
        {{
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valor_total)
        }}
      </v-col>
    </v-row>
    <v-dialog v-model="dialogGrupo" max-width="800">
      <v-card>
        <v-container style="width: 600px">
          <v-card-title class="justify-center">
            <p>Escolha as opções abaixo para formar o Grupo</p>
            <v-checkbox
              v-model="check_grupo"
              label="Não encontrei a faculdade, semestre ou periodo do cliente"
            ></v-checkbox>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row dense justify="center">
              <v-col>
                <v-autocomplete
                  :disabled="check_grupo"
                  dense
                  hide-details
                  auto-select-first
                  autofocus
                  v-model="selected_faculdade"
                  :items="faculdades"
                  item-text="nome_exibicao_faculdade"
                  return-object
                  label="Faculdade"
                  @change="onChangeFaculdade()"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col>
                <v-select
                  :disabled="check_grupo"
                  dense
                  hide-details
                  v-model="selected_graduacao"
                  @change="onChangeGraduacao()"
                  :items="[
                    { text: 'Graduação', value: 0 },
                    { text: 'Especialização', value: 1 },
                  ]"
                  label="Graduação ou Especialização"
                ></v-select>
              </v-col>
            </v-row>

            <v-row dense justify="center">
              <v-col>
                <v-autocomplete
                  :disabled="check_grupo"
                  no-data-text="Nenhum semestre encontrado."
                  dense
                  hide-details
                  auto-select-first
                  autofocus
                  v-model="selected_semestre"
                  :items="semestres"
                  item-text="descri_semestre"
                  return-object
                  label="Semestre"
                  @change="onChangeSemestre()"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col>
                <v-autocomplete
                  :disabled="check_grupo"
                  no-data-text="Nenhum periodo encontrado."
                  dense
                  hide-details
                  auto-select-first
                  autofocus
                  v-model="selected_periodo"
                  :items="periodos"
                  item-text="nome_periodo"
                  return-object
                  label="Periodo"
                  @change="onChangePeriodo()"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <div v-if="!check_grupo" class="text-center">
            <h6>{{ new_grupo }}</h6>
          </div>
          <div class="text-center" v-if="check_grupo">
            <h6>À DEFINIR</h6>
            <v-textarea
              counter
              label="Descreva qual faculdade, semestre e periodo. Para que possamos ajustar posteriormente"
              :rules="[(v) => v.length <= 125 || 'Max 125 caracteres']"
              v-model="obs_grupo"
              no-resize
              rows="3"
            ></v-textarea>
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="error" text @click="dialogGrupo = false">
            Fechar
          </v-btn>
          <v-btn
            :disabled="checkGrupo()"
            color="success"
            text
            @click="salvarGrupo()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialogCadastrarCliente">
      <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title class="primary--text"
            >Cadastro de Cliente</v-toolbar-title
          >
          <v-btn
            :disabled="invalid_cpf_cnpj"
            @click="validate()"
            color="success"
            class="ml-5"
            text
          >
            <v-icon left>fa-save</v-icon> Salvar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="dialogCadastrarCliente = false" color="error" text>
            <v-icon left>fa-times</v-icon> Voltar
          </v-btn>
        </v-toolbar>
        <v-tabs vertical>
          <v-tab active-class="blue darken-2 white--text">Dados</v-tab>
          <v-tab-item>
            <v-container>
              <v-card class="mx-auto" outlined>
                <v-card-text>
                  <v-row dense no-gutters>
                    <v-col cols="4">
                      <v-text-field
                        :error-messages="
                          v$.cliente.cpf_cnpj.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        @keyup="checkCpfCnpj(cliente.cpf_cnpj)"
                        hint="Digite somento números"
                        type="search"
                        autocomplete="off"
                        filled
                        dense
                        label="CPF/CNPJ"
                        v-model="cliente.cpf_cnpj"
                        v-mask="['###.###.###-##', '##.###.###/####-##']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col cols="6">
                      <v-text-field
                        height="10"
                        v-model.trim="cliente.razao_social"
                        type="search"
                        autocomplete="off"
                        @keyup="fantasia = cliente.razao_social"
                        :error-messages="
                          v$.cliente.razao_social.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        label="Razão Social"
                        class="input-uppercase"
                        dense
                        filled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        height="10"
                        filled
                        class="input-uppercase"
                        v-model.trim="fantasia"
                        type="search"
                        autocomplete="off"
                        :error-messages="
                          v$.fantasia.$error ? 'Campo Obrigatório' : ''
                        "
                        label="Fantasia"
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col>
                      <v-text-field
                        class="input-uppercase"
                        :error-messages="
                          v$.cliente.email.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        autocomplete="nope"
                        filled
                        dense
                        label="E-Mail"
                        v-model.trim="cliente.email"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        class="input-uppercase"
                        height="10"
                        autocomplete="nope"
                        filled
                        dense
                        label="Contato"
                        v-model.trim="cliente.observacao"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :error-messages="
                          v$.cliente.telefone.$error ? 'Campo Obrigatório' : ''
                        "
                        hint="Digite somente números"
                        label="Telefone"
                        height="10"
                        autocomplete="nope"
                        filled
                        dense
                        v-mask="'(##) ####-####'"
                        v-model="cliente.telefone"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :error-messages="
                          v$.cliente.celular.$error ? 'Campo Obrigatório' : ''
                        "
                        hint="Digite somente números"
                        label="Celular"
                        height="10"
                        :hide-details="true"
                        type="search"
                        autocomplete="off"
                        v-mask="'(##) # ####-####'"
                        filled
                        dense
                        v-model="cliente.celular"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col>
                      <v-text-field
                        @keyup="getCep(cliente.cliente_enderecos)"
                        :error-messages="
                          v$.cliente.cliente_enderecos.cep.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        :loading="cepLoading"
                        ref="cep_principal"
                        v-mask="'#####-###'"
                        height="10"
                        hint="Digite somento números"
                        autocomplete="nope"
                        filled
                        dense
                        label="Cep"
                        v-model="cliente.cliente_enderecos.cep"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        hint="Rua, Avenida, Estrada..."
                        v-model.trim="cliente.cliente_enderecos.logradouro"
                        :error-messages="
                          v$.cliente.cliente_enderecos.logradouro.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        filled
                        dense
                        label="Endereço"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        filled
                        dense
                        label="Número"
                        type="search"
                        autocomplete="off"
                        v-model="cliente.cliente_enderecos.numero"
                        :error-messages="
                          v$.cliente.cliente_enderecos.numero.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        ref="numero_principal"
                        v-mask="'####'"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        filled
                        dense
                        label="Complemento"
                        v-model.trim="cliente.cliente_enderecos.complemento"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col>
                      <v-text-field
                        height="10"
                        class="input-uppercase"
                        type="search"
                        autocomplete="off"
                        v-model.trim="cliente.cliente_enderecos.bairro"
                        :error-messages="
                          v$.cliente.cliente_enderecos.bairro.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        filled
                        dense
                        label="Bairro"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        v-model.trim="cliente.cliente_enderecos.cidade"
                        :error-messages="
                          v$.cliente.cliente_enderecos.cidade.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        filled
                        dense
                        label="Cidade"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        type="search"
                        autocomplete="off"
                        class="input-uppercase"
                        v-model.trim="cliente.cliente_enderecos.uf"
                        :error-messages="
                          v$.cliente.cliente_enderecos.uf.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        filled
                        dense
                        label="Estado"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col>
                      <v-select
                        :error-messages="
                          v$.cliente.tipo.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        filled
                        :items="tipos"
                        return-object
                        v-model="cliente.tipo"
                        label="Tipo"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-select
                        :error-messages="
                          v$.cliente.atividade.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        filled
                        :items="atividades"
                        return-object
                        v-model="cliente.atividade"
                        label="Atividade"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-select
                        :error-messages="
                          v$.cliente.condicao.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        filled
                        :items="condicoes"
                        return-object
                        v-model="cliente.condicao"
                        label="Condição"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :error-messages="
                          v$.cliente.inscricao_estadual.$error
                            ? 'Campo Obrigatório'
                            : ''
                        "
                        height="10"
                        filled
                        dense
                        label="Inscrição Estadual"
                        v-mask="'#########'"
                        type="search"
                        autocomplete="off"
                        v-model="cliente.inscricao_estadual"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        height="10"
                        type="search"
                        autocomplete="off"
                        filled
                        dense
                        label="Inscrição Municipal"
                        v-model.trim="cliente.inscricao_municipal"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense no-gutters>
                    <v-col>
                      <v-select
                        :error-messages="
                          v$.atendente.$error ? 'Campo Obrigatório' : ''
                        "
                        height="10"
                        filled
                        item-text="nome"
                        item-value="codigo"
                        :items="vendedores"
                        v-model="atendente"
                        label="Atendente"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        readonly
                        height="10"
                        type="search"
                        autocomplete="off"
                        filled
                        dense
                        label="Grupo"
                        v-model="cliente.grupo"
                      ></v-text-field>
                    </v-col>
                    <v-col class="text-center" align-self="center">
                      <v-btn
                        @click="editarGrupo()"
                        color="primary"
                        small
                        bottom
                        dense
                        >Editar Grupo</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialogObs" max-width="800">
      <v-card>
        <v-container style="width: 600px">
          <v-card-title class="justify-center">
            <p>Deseja acrescentar alguma observação ao pedido?</p>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="text-center">
              <v-textarea
                counter
                label="Descreva resumidamente uma observação para o pedido"
                :rules="[(v) => v.length <= 125 || 'Max 125 caracteres']"
                v-model="obs_pedido"
                no-resize
                rows="3"
              ></v-textarea>
            </div>
          </v-card-text>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="
              dialogObs = false;
              salvarOrcamento();
            "
          >
            Não
          </v-btn>
          <v-btn
            color="success"
            text
            @click="
              dialogObs = false;
              salvarOrcamento();
            "
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLimpar" max-width="300">
      <v-card>
        <v-container>
          <v-card-title class="headline error--text">Atenção!</v-card-title>
          <v-card-text
            >Deseja realmente limpar TODOS OS DADOS do orçamento?</v-card-text
          >
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" text @click="dialogLimpar = false">Não</v-btn>
            <v-btn
              color="success"
              text
              @click="
                limpar();
                dialogLimpar = false;
              "
              >Sim</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <br />
      {{ snackbar.tiny }}
      <v-btn text @click="closeSnackbar()">Fechar</v-btn>
    </v-snackbar>
    <v-overlay z-index="99999" :value="loading">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import Imprimir from "./components/Imprimir";
import useVuelidate from "@vuelidate/core";
import { required, helpers, requiredIf } from "@vuelidate/validators";
import { mapState, mapMutations, mapActions } from "vuex";
import { QVirtualScroll } from "quasar/dist/quasar.esm";

export default {
  components: {
    Imprimir,
    QVirtualScroll,
  },
  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      edicao: false,
      pedido_editar: {},
      atividades: [
        { text: "VAREJO", value: 1, ref: "03" },
        { text: "ACADÊMICO", value: 2, ref: "10" },
        { text: "ORGÃO PUBLICO", value: 3, ref: "02" },
        { text: "OUTROS", value: 4, ref: "03" },
      ],
      condicoes: [
        { text: "ATIVO", value: 1, ref: "A" },
        { text: "BLOQUEADO", value: 2, ref: "BL" },
      ],
      tipos: [
        { text: "FÍSICO", value: 1, ref: "FI" },
        { text: "JURIDICO", value: 2, ref: "JU" },
      ],
      fantasia: "",
      cepLoading: false,
      cliente: {
        selected: false,
        cpf_cnpj: "",
        razao_social: "",
        fantasia: "",
        email: "",
        observacao: "",
        telefone: "",
        celular: "",
        tipo: { text: "FÍSICO", value: 1, ref: "FI" },
        atividade: "",
        condicao: { text: "ATIVO", value: 1, ref: "A" },
        inscricao_estadual: "",
        inscricao_municipal: "",
        atendente: "",
        grupo: "A DEFINIR",
        obs_grupo: "",
        grupo_dc_info: "A DEFINIR",
        cliente_enderecos: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
        },
      },
      invalid_cpf_cnpj: false,
      isCnpj: false,
      obs_grupo: "",
      obs_pedido: "",
      check_grupo: false,
      new_grupo: "",
      atendente: {},
      searchAll: "",
      searchCod: "",
      menu_desconto: false,
      menu_cliente: false,
      dialogCadastrarCliente: false,
      dialogItems: false,
      dialogCliente: false,
      dialogGrupo: false,
      dialogLimpar: false,
      dialogImprimir: false,
      tem_desconto: false,
      pode_desconto: true,
      desconto_geral: 0.0,
      qtd_total: 0.0,
      valor_total: 0.0,
      lucro_site: 0.0,
      tem_desconto: false,
      selected_item: {},
      selected_faculdade: {},
      selected_semestre: {},
      selected_periodo: {},
      selected_graduacao: {},
      descriptionLimit: 60,
      item_selecionado: null,
      entries_items: [],
      entries_clientes: [],
      autocompleteLoading: false,
      searchProduto: null,
      searchCliente: "",
      dialogCliente: false,
      dialogObs: false,
      headersItensPedido: [
        {
          name: "",
          prop: "X",
          align: "center",
        },
        {
          name: "QTD",
          prop: "qtd",
          align: "center",
          sortable: false,
        },
        {
          name: "CÓDIGO",
          prop: "codigo",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCRIÇÃO",
          prop: "descricao",
          align: "center",
          sortable: true,
        },
        {
          name: "MARCA",
          prop: "marca",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCONTO",
          prop: "desconto",
          align: "center",
          sortable: true,
        },
        {
          name: "VALOR",
          prop: "valor",
          align: "center",
          sortable: true,
        },
        {
          name: "TOTAL",
          prop: "total",
          align: "center",
          sortable: true,
        },
        {
          name: "#",
          prop: "#",
          align: "center",
          sortable: false,
        },
      ],
      headersItens: [
        {
          name: "CÓDIGO",
          prop: "codigo",
          align: "center",
          sortable: true,
        },
        {
          name: "DESCRIÇÃO",
          prop: "descricao",
          align: "center",
          sortable: true,
        },
        {
          name: "MARCA",
          prop: "marca",
          align: "center",
          sortable: true,
        },
        {
          name: "Saldo",
          prop: "saldo",
          align: "center",
          sortable: true,
        },
        {
          name: "VALOR",
          prop: "valor",
          align: "center",
          sortable: true,
        },
      ],
      headersClientes: [
        {
          text: "Codigo",
          sortable: true,
          value: "codigo",
        },
        {
          text: "CPF/CNPJ",
          sortable: true,
          width: 160,
          value: "cpf_cnpj",
        },
        {
          text: "Razão Social",
          sortable: true,
          value: "razao_social",
        },
        {
          text: "Fantasia",
          sortable: true,
          value: "fantasia",
        },
        {
          text: "Telefone",
          sortable: true,
          width: 160,
          value: "telefone",
        },
        {
          text: "Celular",
          sortable: true,
          width: 160,
          value: "celular",
        },
        {
          text: "E-Mail",
          sortable: true,
          value: "email",
        },
      ],
    };
  },
  validations() {
    return {
      atendente: {
        required: helpers.withMessage(
          "Campo ATENDENTE é obrigatório",
          required
        ),
      },
      fantasia: {
        required: helpers.withMessage("Campo FANTASIA é obrigatório", required),
        required: requiredIf(!this.menu_cliente),
      },
      cliente: {
        cpf_cnpj: {
          required: helpers.withMessage(
            "Campo CPF/CNPJ é obrigatório",
            required
          ),
        },
        razao_social: {
          required: helpers.withMessage(
            "Campo RAZÃO SOCIAL é obrigatório",
            required
          ),
        },
        email: {
          required: helpers.withMessage("Campo EMAIL é obrigatório", required),
        },
        telefone: {
          required: helpers.withMessage(
            "Campo TELEFONE é obrigatório",
            required
          ),
        },
        celular: {
          required: helpers.withMessage(
            "Campo CELULAR é obrigatório",
            required
          ),
        },
        tipo: {
          required: helpers.withMessage("Campo TIPO é obrigatório", required),
        },
        atividade: {
          required: helpers.withMessage(
            "Campo ATIVIDADE é obrigatório",
            required
          ),
        },
        condicao: {
          required: helpers.withMessage(
            "Campo CONDIÇÃO é obrigatório",
            required
          ),
        },
        inscricao_estadual: {
          required: helpers.withMessage(
            "Campo INCRIÇÃO ESTADUAL é obrigatório",
            required
          ),
          required: requiredIf(this.isCnpj),
        },
        cliente_enderecos: {
          cep: {
            required: helpers.withMessage("Campo CEP é obrigatório", required),
          },
          logradouro: {
            required: helpers.withMessage(
              "Campo ENDEREÇO é obrigatório",
              required
            ),
          },
          numero: {
            required: helpers.withMessage(
              "Campo NÚMERO é obrigatório",
              required
            ),
          },
          bairro: {
            required: helpers.withMessage(
              "Campo BAIRRO é obrigatório",
              required
            ),
          },
          cidade: {
            required: helpers.withMessage(
              "Campo CIDADE é obrigatório",
              required
            ),
          },
          uf: {
            required: helpers.withMessage(
              "Campo ESTADO é obrigatório",
              required
            ),
          },
        },
      },
    };
  },
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    await this.copiarPedido();
    await this.editarPedido();
    this.set_loading(true);
    await this.get_permissoes({
      id_usuario: this.$usuario.value.id,
      pagina: "orcamento",
    });
    await this.get_vendedores();
    this.atendente =
      this.$usuario.value.vendedor == "SITE" ? 0 : this.$usuario.value.vendedor;

    this.autocompleteLoading = true;
    this.$axios
      .get("/clientes", {
        params: {
          usuario: this.$usuario.value,
        },
      })
      .then((res) => {
        this.entries_clientes = res.data;
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.set_loading(false);
        this.autocompleteLoading = false;
      });
  },
  mounted() {
    this.event();
  },

  computed: {
    ...mapState({
      itemScrollIndex: (state) => state.pedidoAtendimento.itemScrollIndex,
      itemRemovido: (state) => state.pedidoAtendimento.itemRemovido,
      itemExcluido: (state) => state.pedidoAtendimento.itemExcluido,
      qtdItemAdicionado: (state) => state.pedidoAtendimento.qtdItemAdicionado,
      faculdades: (state) => state.aluno.faculdades,
      semestres: (state) => state.aluno.semestres,
      periodos: (state) => state.aluno.periodos,
      cliente_salvo: (state) => state.cliente.cliente_salvo,
      vendedores: (state) => state.cliente.vendedores,
      itens_pedido: (state) => state.pedidoAtendimento.itens_pedido,
      vendedor: (state) => state.cliente.vendedor,
      cpf_cnpj_exist: (state) => state.cliente.cpf_cnpj_exist,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
      error: (state) => state.pedidoAtendimento.error,
      permissoes: (state) => state.permissoes,
    }),
    clientes() {
      let arr = this.entries_clientes;
      let filteredClientes = [];

      if (this.searchCod.length > 0) {
        filteredClientes = arr.filter((i) =>
          i.codigo.toString().includes(this.searchCod)
        );
      } else {
        filteredClientes = arr.filter((i) => {
          return (
            i.razao_social.includes(this.searchCliente.toUpperCase()) ||
            i.fantasia.includes(this.searchCliente.toUpperCase()) ||
            i.cpf_cnpj.includes(this.searchCliente.toUpperCase())
          );
        });

        let searchArr =
          this.searchCliente == null ? [] : this.searchCliente.split(" ");

        if (!filteredClientes.length || searchArr.length > 1) {
          filteredClientes = arr.filter((i) => {
            return (
              i.razao_social.includes(searchArr[0].toUpperCase()) ||
              i.fantasia.includes(searchArr[0].toUpperCase())
            );
          });
          filteredClientes = filteredClientes.filter((i) => {
            return (
              i.razao_social.includes(searchArr[1].toUpperCase()) ||
              i.fantasia.includes(searchArr[1].toUpperCase())
            );
          });
          if (searchArr.length > 2) {
            filteredClientes = filteredClientes.filter((i) => {
              return (
                i.razao_social.includes(searchArr[2].toUpperCase()) ||
                i.fantasia.includes(searchArr[2].toUpperCase())
              );
            });
          }
        }
      }

      return filteredClientes;
    },
    items() {
      let arr = this.entries_items;
      let filteredItems = [];

      filteredItems = arr.filter((i) =>
        i.descricao.includes(this.searchProduto.toUpperCase())
      );
      let searchArr =
        this.searchProduto == null ? [] : this.searchProduto.split(" ");
      if (!filteredItems.length || searchArr.length > 1) {
        filteredItems = arr.filter((i) =>
          i.descricao.includes(searchArr[0].toUpperCase())
        );
        filteredItems = filteredItems.filter((i) =>
          i.descricao.includes(searchArr[1].toUpperCase())
        );
        if (searchArr.length > 2) {
          filteredItems = filteredItems.filter((i) =>
            i.descricao.includes(searchArr[2].toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.marca.includes(this.searchProduto.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo.includes(this.searchProduto.toUpperCase())
          );
        }
        if (!filteredItems.length) {
          filteredItems = arr.filter((i) =>
            i.codigo_fornecedor.includes(this.searchProduto.toUpperCase())
          );
        }
      }

      return filteredItems;
    },
  },
  watch: {
    searchCod(val) {
      if (val.length > 0) {
        this.searchCliente = "";
      }
    },
    searchCliente(val) {
      if (val.length > 0) {
        this.searchCod = "";
      }
    },
    searchProduto(val) {
      // Items have already been loaded
      if (this.entries_items.length > 0) return;

      // Items have already been requested
      if (this.autocompleteLoading) return;

      this.autocompleteLoading = true;
      // Lazily load input items
      this.set_loading(true);
      this.$axios
        .get("/produto/findAll")
        .then((res) => {
          this.entries_items = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.set_loading(false);
          this.autocompleteLoading = false;
        });
    },
  },
  methods: {
    ...mapMutations([
      "set_itens_pedido",
      "set_selected_item",
      "set_item",
      "set_semestres",
      "push_itens_pedido",
      "set_snackbar",
      "set_loading",
      "set_cpf_cnpj_exist",
    ]),
    ...mapActions([
      "get_vendedores",
      "get_permissoes",
      "get_clientes",
      "get_faculdades",
      "get_semestres",
      "get_periodos",
      "check_cpf_cnpj",
      "save_cliente",
      "save_orcamento",
      "sync_itens_pedido",
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    focusOnInput() {
      this.$refs.searchinput.$refs.input.focus();
    },
    focusOnTable() {
      this.selected_item = this.items[0];
      this.selected_item.index = 0;
      this.$refs.tabelaItens.$el.focus();
    },
    async copiarPedido() {
      if (this.$route.params.itens != undefined) {
        this.set_loading(true);
        await this.sync_itens_pedido(this.$route.params.itens);
        this.set_loading(false);
        this.calcular_itens_pedido();

        this.set_snackbar({
          show: true,
          msg: "ORÇAMENTO COPIADO",
          type: "success",
          time: 3000,
        });
      }
    },
    async editarPedido() {
      if (this.$route.params.pedido != undefined) {
        this.pedido_editar = this.$route.params.pedido;
        this.edicao = true;
        this.cliente = this.pedido_editar.cliente_obj;
        this.cliente.cliente_enderecos = this.pedido_editar.cliente_endereco;
        this.cliente.selected = true;
        this.set_loading(true);
        await this.sync_itens_pedido(this.pedido_editar.orcamento_itens);
        this.set_loading(false);
        this.valor_total = this.pedido_editar.total;
        this.desconto_geral = this.pedido_editar.desconto;
        this.atendente =
          this.pedido_editar.atendente == "SITE"
            ? 0
            : this.pedido_editar.atendente;

        if (this.pedido_editar.desconto == 0) {
          this.pode_desconto = this.itens_pedido[0].pode_desconto;
          this.calcular_itens_pedido();
        } else {
          this.tem_desconto = true;
          this.callDescontoGeral();
        }
      }
    },
    resetCliente() {
      this.cliente = {
        cpf_cnpj: "",
        razao_social: "",
        fantasia: "",
        email: "",
        observacao: "",
        telefone: "",
        celular: "",
        tipo: 1,
        atividade: 1,
        condicao: 1,
        inscricao_estadual: "",
        inscricao_municipal: "",
        atendente: "",
        grupo: "A DEFINIR",
        obs_grupo: "",
        grupo_dc_info: "A DEFINIR",
        cliente_enderecos: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
        },
      };
    },
    event() {
      let isso = this;
      this.$refs.tabelaItens.$el.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.moveTabelaItens(isso.selected_item.index + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.moveTabelaItens(isso.selected_item.index - 1, "prev");
        }
        if (key == 13) {
          e.preventDefault();
          isso.changeItemPedido(true);
        }
        if (key == 33) {
          isso.focusOnInput();
        }

        // mais e MAIS
        if (key == 107 || key == 187) {
          isso.changeItemPedido(true);
        }
        // menos e MENOS
        if (key == 109 || key == 189) {
          isso.changeItemPedido(false);
        }
      });

      this.$refs.buscarcliente.$el.addEventListener("keydown", function (e) {
        var key = window.event.keyCode;
        if (key == 40) {
          e.preventDefault();
          isso.moveTabelaClientes(isso.cliente.index + 1, "next");
        }
        if (key == 38) {
          e.preventDefault();
          isso.moveTabelaClientes(isso.cliente.index - 1, "prev");
        }
        if (key == 13) {
          e.preventDefault();
          isso.dialogCliente = false;
        }
      });
    },
    moveTabelaItens(index, dest) {
      if (index >= 0 && index < this.items.length) {
        this.selected_item = this.items[index];
        this.selected_item.index = index;

        if (dest == "prev") {
          if (this.selected_item.index < 0) {
            this.selected_item.index = 0;
          }
        } else {
          if (this.selected_item.index >= this.items.length) {
            this.selected_item.index = this.items.length - 1;
          }
        }

        this.$refs.tabelaItens.scrollTo(this.selected_item.index);
      }
    },
    moveTabelaClientes(index, dest) {
      if (index >= 0 && index < this.clientes.length) {
        this.cliente = this.clientes[index];
        this.cliente.index = index;

        if (dest == "prev") {
          if (this.cliente.index < 0) {
            this.cliente.index = 0;
          }
        } else {
          if (this.cliente.index >= this.clientes.length) {
            this.cliente.index = this.clientes.length - 1;
          }
        }

        this.$refs.buscarcliente.scrollTo(this.cliente.index);
      }
    },
    focusInputSearch() {
      setTimeout(() => this.$refs.searchinput.$refs.input.focus(), 100);
    },
    selectCliente(row, index) {
      if (this.clientes[index] != undefined) {
        this.cliente = this.clientes[index];
        this.cliente.index = index;
        this.clientes[index].selected = true;

        this.cliente.atividade = this.atividades.find((val) => {
          return val.value === this.cliente.atividade;
        });
        this.cliente.condicao = this.condicoes.find((val) => {
          return val.value === this.cliente.condicao;
        });
        this.cliente.tipo = this.tipos.find((val) => {
          return val.value === this.cliente.tipo;
        });
      }
    },
    selectItem(row, index) {
      if (this.items[index] != undefined) {
        this.selected_item = this.items[index];
        this.selected_item.index = index;
      }
    },
    changeItemPedido(plus) {
      this.selected_item.qtd = 1;
      let ordem = this.itens_pedido.length;
      let insertProduto = {};
      insertProduto.ordem = ordem;
      insertProduto.qtd = this.selected_item.qtd;
      insertProduto.codigo = this.selected_item.codigo;
      insertProduto.descricao = this.selected_item.descricao;
      insertProduto.saldo = this.selected_item.saldo;
      insertProduto.marca = this.selected_item.marca;
      insertProduto.valor = this.selected_item.valor;
      insertProduto.valor_original = this.selected_item.valor;
      insertProduto.valor_ultima_compra =
        this.selected_item.valor_ultima_compra;
      insertProduto.ipi = this.selected_item.ipi;
      insertProduto.valor_fabricante = this.selected_item.valor_fabricante;
      insertProduto.desconto_original = this.selected_item.desconto;
      insertProduto.total =
        parseInt(this.selected_item.qtd) * parseFloat(this.selected_item.valor);

      this.push_itens_pedido({ item: insertProduto, plus: plus });

      this.calcular_itens_pedido();

      if (this.$refs.tabelaItensPedido != undefined) {
        this.$refs.tabelaItensPedido.scrollTo(this.itemScrollIndex);
      }
      if (plus) {
        this.set_snackbar({
          show: true,
          msg: "1 - " + insertProduto.descricao + " ADICIONADO",
          tiny: "(QTD ATUAL: " + this.qtdItemAdicionado + ")",
          type: "success",
          time: 0,
        });
      } else {
        if (this.itemRemovido) {
          this.set_snackbar({
            show: true,
            msg: "1 - " + insertProduto.descricao + " REMOVIDO",
            tiny: "(QTD ATUAL: " + this.qtdItemAdicionado + ")",
            type: "warning",
            time: 0,
          });
        }

        if (this.itemExcluido) {
          this.set_snackbar({
            show: true,
            msg: insertProduto.descricao + " RETIRADO",
            type: "error",
            time: 0,
          });
        }
      }
    },
    calcular_itens_pedido() {
      let qtd_total = 0;
      let valor_total = 0;
      let ultima_compra = 0;
      let total_ultima_compra = 0;
      let lucro_site = 0;

      this.itens_pedido.forEach((i) => {
        //i.qtd = parseInt(i.qtd)
        ultima_compra = parseFloat(i.valor_ultima_compra);
        if (ultima_compra == 0) {
          ultima_compra = parseFloat(i.valor_fabricante);
        } else {
          ultima_compra =
            parseFloat(i.valor_ultima_compra) *
            ((100 + parseFloat(i.ipi)) / 100);
        }

        qtd_total += parseInt(i.qtd);
        valor_total += parseFloat(i.valor).toFixed(2) * i.qtd;
        total_ultima_compra += parseFloat(ultima_compra).toFixed(2) * i.qtd;

        if (i.saldo < i.qtd || i.saldo <= 0) {
          i.sem_saldo = true;
        } else {
          i.sem_saldo = false;
        }
      });
      lucro_site = (valor_total / total_ultima_compra) * 100 - 100;

      lucro_site = lucro_site.toFixed(2);

      if (isNaN(lucro_site)) {
        lucro_site = 0;
      }

      this.qtd_total = qtd_total;
      this.valor_total = valor_total;
      this.lucro_site = lucro_site;
    },
    calcDesconto(row) {
      try {
        if (this.tem_desconto) {
          this.tem_desconto = true;
          this.callDescontoGeral();
        }
        let val = row.desconto.replace(",", ".");
        let valFloat = parseFloat(val);
        let margemFloat = parseFloat(this.permissoes.margem_preco);

        if (row.desconto == "") {
          row.valor = row.valor_original;
        }

        if (row.desconto_original > margemFloat) {
          margemFloat = row.desconto_original;
        }
        if (valFloat > margemFloat) {
          valFloat = margemFloat;
          row.desconto = margemFloat;
        }

        if (!isNaN(valFloat)) {
          row.valor =
            row.valor_original - row.valor_original * (valFloat / 100);
          this.calcular_itens_pedido();
        }
        let check = [];
        for (let item of this.itens_pedido) {
          if (
            item.desconto == 0 ||
            item.desconto == "" ||
            item.desconto == "undefined"
          ) {
            check.push(true);
          } else {
            check.push(false);
          }
        }
        if (check.every((i) => i)) {
          this.pode_desconto = true;
        } else {
          this.pode_desconto = false;
          this.desconto_geral = 0;
        }
      } catch (error) {}
    },
    callDescontoGeral() {
      if (!this.tem_desconto) {
        try {
          if (
            this.desconto_geral <= 0 ||
            isNaN(this.desconto_geral) ||
            this.desconto_geral > 99.99
          ) {
            this.desconto_geral = 0;
            this.set_snackbar({
              show: true,
              msg: "Valor de desconto incorreto!",
              type: "warning",
              time: 3000,
            });
            this.desconto_geral = 0;
          } else {
            let margemFloat = parseFloat(this.permissoes.margem_preco);
            if (this.desconto_geral > margemFloat) {
              this.desconto_geral = margemFloat;
            }
            for (let item of this.itens_pedido) {
              let valorAtual = parseFloat(item.valor);
              let valorComDesconto =
                valorAtual - valorAtual * (this.desconto_geral / 100);
              item.valor = valorComDesconto.toFixed(2);
            }
            this.calcular_itens_pedido();
            this.tem_desconto = true;
            this.set_snackbar({
              show: true,
              msg: "Desconto inserido com sucesso!",
              type: "success",
              time: 3000,
            });
          }
        } catch (error) {
          console.log(error);
          this.desconto_geral = 0;
          this.set_snackbar({
            show: true,
            msg: "Valor de desconto incorreto!",
            type: "warning",
            time: 3000,
          });
        }
      } else {
        this.itens_pedido.forEach((element) => {
          element.valor = element.valor_original;
          element.desconto = "";
        });
        this.tem_desconto = false;
        this.desconto_geral = "";
        this.calcular_itens_pedido();
      }
    },
    resetarDesconto() {
      for (let item of this.itens_pedido) {
        delete item.desconto;
        item.valor = item.valor_original;
      }
      this.calcular_itens_pedido();
      this.pode_desconto = true;
    },
    removeItem(index) {
      this.$delete(this.itens_pedido, index);
      this.calcular_itens_pedido();
    },
    onRemove(index) {
      if (
        (this.itens_pedido.length > 1 &&
          this.itens_pedido[index].qtd.length === 0) ||
        this.itens_pedido[index].qtd == 0
      ) {
        this.$delete(this.itens_pedido, index);
        this.calcular_itens_pedido();
      }
    },
    showMenuDesconto() {
      if (this.itens_pedido.length > 0) {
        this.menu_desconto = true;
      } else {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Item no orçamento",
          type: "warning",
          time: 3000,
        });
      }
    },
    imprimir() {
      if (this.itens_pedido.length > 0) {
        if (this.permissoes.ver_imprimir) {
          this.dialogImprimir = true;
          this.$htmlToPaper("print");
          this.dialogImprimir = false;
        } else {
          this.set_snackbar({
            show: true,
            msg: "Você não tem permissão",
            type: "warning",
            time: 3000,
          });
        }
      } else {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Item no orçamento",
          type: "warning",
          time: 3000,
        });
      }
    },
    limpar() {
      if (this.itens_pedido.length > 0) {
        this.desconto_geral = 0;
        this.pode_desconto = true;
        this.tem_desconto = false;
        this.set_itens_pedido([]);
        this.qtd_total = 0;
        this.valor_total = 0.0;
        this.lucro_site = 0.0;
        this.edicao = false;
        this.dialogObs = false;
      } else {
        this.set_snackbar({
          show: true,
          msg: "Nenhum Item no orçamento",
          type: "warning",
          time: 3000,
        });
      }
    },
    putMask(item, type) {
      if (type == "cpf/cnpj") {
        if (item.length < 14) {
          return this.$mask.apply(item, "000.000.000-00");
        } else {
          return this.$mask.apply(item, "00.000.000/0000-00");
        }
      }
      if (type == "telefone") {
        return this.$mask.apply(item, "(00) 0000-0000");
      }
      if (type == "celular") {
        return this.$mask.apply(item, "(00) 0 0000-0000");
      }
    },
    showDialogCliente() {
      this.dialogCliente = true;
      setTimeout(() => this.$refs.inputSearchCliente.$refs.input.focus(), 100);
    },
    async validate() {
      this.v$.$touch();
      if (this.v$.$error) {
        this.set_snackbar({
          show: true,
          msg: this.v$.$errors[0].$message,
          type: "error",
          time: 3000,
        });
      } else {
        let msg = "";
        if (this.menu_cliente) {
          // edição
          this.cliente.editar = true;
          this.cliente.atendente = this.atendente;
          msg =
            "Cliente " +
            this.cliente.razao_social.toUpperCase() +
            " Editado com Sucesso!";
        } else {
          // criação
          this.cliente.editar = false;
          this.cliente.vendedor = this.atendente;
          this.cliente.atendente = this.atendente;
          this.cliente.fantasia = this.fantasia;
          msg =
            "Cliente " +
            this.cliente.razao_social.toUpperCase() +
            " Cadastrado com Sucesso!";
        }
        this.cliente.grupo =
          this.cliente.grupo.length == 0 ? "A DEFINIR" : this.cliente.grupo;
        this.cliente.grupo_dc_info =
          this.cliente.grupo_dc_info.length == 0
            ? "A DEFINIR"
            : this.cliente.grupo_dc_info;

        if (typeof this.cliente.atividade != "object") {
          this.cliente.atividade = this.atividades.find((val) => {
            return val.value === this.cliente.atividade;
          });
        }
        if (typeof this.cliente.condicao != "object") {
          this.cliente.condicao = this.condicoes.find((val) => {
            return val.value === this.cliente.condicao;
          });
        }
        if (typeof this.cliente.tipo != "object") {
          this.cliente.tipo = this.tipos.find((val) => {
            return val.value === this.cliente.tipo;
          });
        }

        this.cliente.usuario = this.$usuario.value.usuario;
        this.set_loading(true);
        await this.save_cliente(this.cliente);
        let endereco = this.cliente.cliente_enderecos;
        this.cliente = this.cliente_salvo;
        this.cliente.cliente_enderecos = endereco;
        this.cliente.selected = true;
        this.dialogCadastrarCliente = false;
        this.dialogCliente = false;
        this.menu_cliente = false;
        this.set_loading(false);
        this.set_snackbar({
          show: true,
          msg: msg,
          type: "success",
          time: 3000,
        });
      }
    },
    async checkCpfCnpj(cpfCnpj) {
      if (cpfCnpj.length == 14) {
        if (this.isValidCPF(cpfCnpj)) {
          this.set_loading(true);
          await this.check_cpf_cnpj(cpfCnpj);
          this.set_loading(false);
          this.isCnpj = false;
          this.cliente.tipo = 1;
        } else {
          this.invalid_cpf_cnpj = true;
          this.set_snackbar({
            show: true,
            msg: "CPF inválido.",
            type: "warning",
            time: 3000,
          });
        }
      } else if (cpfCnpj.length == 18) {
        if (this.isValidCnpj(cpfCnpj)) {
          this.set_loading(true);
          await this.check_cpf_cnpj(cpfCnpj);
          this.set_loading(false);
          this.isCnpj = true;
          this.cliente.tipo = 2;
        } else {
          this.invalid_cpf_cnpj = true;
          this.set_snackbar({
            show: true,
            msg: "CNPJ inválido.",
            type: "warning",
            time: 3000,
          });
        }
      } else {
        this.invalid_cpf_cnpj = false;
        this.set_cpf_cnpj_exist(false);
      }

      if (this.cpf_cnpj_exist) {
        this.invalid_cpf_cnpj = true;
        this.set_snackbar({
          show: true,
          msg: "Este CPF ou CNPJ já possui cadastro no sistema.",
          type: "warning",
          time: 3000,
        });
      }
    },
    isValidCnpj(value) {
      if (!value) return false;

      // Aceita receber o valor como string, número ou array com todos os dígitos
      const isString = typeof value === "string";
      const validTypes =
        isString || Number.isInteger(value) || Array.isArray(value);

      // Elimina valor em formato inválido
      if (!validTypes) return false;

      // Filtro inicial para entradas do tipo string
      if (isString) {
        // Limita ao máximo de 18 caracteres, para CNPJ formatado
        if (value.length > 18) return false;

        // Teste Regex para veificar se é uma string apenas dígitos válida
        const digitsOnly = /^\d{14}$/.test(value);
        // Teste Regex para verificar se é uma string formatada válida
        const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value);

        // Se o formato é válido, usa um truque para seguir o fluxo da validação
        if (digitsOnly || validFormat) true;
        // Se não, retorna inválido
        else return false;
      }

      // Guarda um array com todos os dígitos do valor
      const match = value.toString().match(/\d/g);
      const numbers = Array.isArray(match) ? match.map(Number) : [];

      // Valida a quantidade de dígitos
      if (numbers.length !== 14) return false;

      // Elimina inválidos com todos os dígitos iguais
      const items = [...new Set(numbers)];
      if (items.length === 1) return false;

      // Cálculo validador
      const calc = (x) => {
        const slice = numbers.slice(0, x);
        let factor = x - 7;
        let sum = 0;

        for (let i = x; i >= 1; i--) {
          const n = slice[x - i];
          sum += n * factor--;
          if (factor < 2) factor = 9;
        }

        const result = 11 - (sum % 11);

        return result > 9 ? 0 : result;
      };

      // Separa os 2 últimos dígitos de verificadores
      const digits = numbers.slice(12);

      // Valida 1o. dígito verificador
      const digit0 = calc(12);
      if (digit0 !== digits[0]) return false;

      // Valida 2o. dígito verificador
      const digit1 = calc(13);
      return digit1 === digits[1];
    },
    isValidCPF(cpf) {
      if (typeof cpf !== "string") return false;
      cpf = cpf.replace(/[^\d]+/g, "");
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
      cpf = cpf.split("");
      const validator = cpf
        .filter((digit, index, array) => index >= array.length - 2 && digit)
        .map((el) => +el);
      const toValidate = (pop) =>
        cpf
          .filter((digit, index, array) => index < array.length - pop && digit)
          .map((el) => +el);
      const rest = (count, pop) =>
        ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
          10) %
          11) %
        10;
      return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]);
    },
    salvarGrupo() {
      this.new_grupo = this.check_grupo ? "A DEFINIR" : this.new_grupo;
      this.cliente.grupo = this.new_grupo;
      this.cliente.grupo_dc_info = this.new_grupo;
      this.cliente.obs_grupo = this.obs_grupo;
      this.dialogGrupo = false;
    },
    async editarGrupo() {
      this.new_grupo = "";
      this.check_grupo = false;
      this.selected_faculdade = null;
      this.selected_graduacao = null;
      this.selected_semestre = null;
      this.selected_periodo = null;
      this.set_loading(true);
      await this.get_faculdades(this.$usuario.value.id);
      this.set_loading(false);

      this.dialogGrupo = true;
    },
    checkGrupo() {
      if (this.check_grupo == false) {
        if (
          this.selected_faculdade == null ||
          this.selected_semestre == null ||
          this.selected_periodo == null
        ) {
          return true;
        }
      } else {
        if (this.obs_grupo.length == 0) {
          return true;
        }
      }
      return false;
    },
    async onChangeFaculdade() {
      this.selected_graduacao = null;
      this.selected_semestre = null;
      this.selected_periodo = null;
    },
    onChangeGraduacao() {
      this.selected_semestre = null;
      this.selected_periodo = null;
      this.set_loading(true);
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selected_faculdade.id_faculdade,
            graduacao: this.selected_graduacao,
          },
        })
        .then((res) => {
          this.set_loading(false);
          console.log(res.data);
          this.set_semestres(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async onChangeSemestre() {
      this.selected_periodo = null;
      this.set_loading(true);
      await this.get_periodos({
        faculdade: this.selected_faculdade.id_faculdade,
        semestre: this.selected_semestre.id_semestre,
      });
      this.set_loading(false);
    },
    onChangePeriodo() {
      // vamo montar o grupo

      if (this.selected_faculdade.grupo == 0) {
        //grupo 0 monta o grupo da seguinte forma:
        //código do semestre + primeira letra do periodo + faculdade
        this.new_grupo =
          this.selected_semestre.cod_semestre +
          this.selected_periodo.nome_periodo.charAt(0) +
          " - " +
          this.selected_faculdade.nome_faculdade.toUpperCase();
      } else if (this.selected_faculdade.grupo == 1) {
        //grupo 1 monta o grupo da seguinte forma:
        //contato + faculdade
        this.new_grupo =
          this.selected_semestre.descri_semestre +
          " - " +
          this.selected_faculdade.nome_faculdade.toUpperCase();
      }
    },
    getCep(item) {
      if (item.cep.length == 9) {
        this.set_loading(true);

        item.cep = item.cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + item.cep + "/json/")
          .then((res) => {
            if (res.data.erro) {
              this.set_loading(false);
              this.$refs.cep_principal.focus();

              this.set_snackbar({
                show: true,
                msg: "Cep Inválido",
                type: "warning",
                time: 2000,
              });

              return;
            }
            this.set_loading(false);
            this.cliente.cliente_enderecos.logradouro =
              res.data.logradouro.toUpperCase();
            this.cliente.cliente_enderecos.bairro =
              res.data.bairro.toUpperCase();
            this.cliente.cliente_enderecos.cidade =
              res.data.localidade.toUpperCase();
            this.cliente.cliente_enderecos.uf = res.data.uf.toUpperCase();
            this.$refs.numero_principal.focus();
          })
          .catch((err) => {
            this.set_loading(false);
            console.log(err);
          });
      } else {
        item.cep_ok = false;
        item.disabled = true;
        item.logradouro = "";
        item.bairro = "";
        item.cidade = "";
        item.uf = "";
      }
    },
    showDialogCadastrar() {
      this.dialogCadastrarCliente = true;
      this.resetCliente();
    },
    async salvarOrcamento() {
      if (this.itens_pedido.length == 0) {
        this.set_snackbar({
          show: true,
          msg: "Não foi possível salvar o orçamento, nenhum item selecionado!",
          type: "warning",
          time: 3000,
        });
      } else if (!this.cliente.selected) {
        this.set_snackbar({
          show: true,
          msg: "Não foi possível salvar o orçamento, nenhum cliente selecionado!",
          type: "warning",
          time: 3000,
        });
      } else {
        this.set_loading(true);
        let pedido = {
          id: this.edicao ? this.pedido_editar.id : false,
          itens: this.itens_pedido,
          desconto: this.desconto_geral,
          total: this.valor_total,
          atendente: this.atendente,
          obs: this.obs_pedido,
          usuario: this.$usuario.value.usuario.toUpperCase(),
        };
        await this.save_orcamento({ pedido: pedido, cliente: this.cliente });
        this.set_loading(false);
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Não foi possível salvar o orçamento, erro interno!",
            type: "error",
            time: 3000,
          });
        } else {
          this.limpar();
          this.resetCliente();
          this.set_snackbar({
            show: true,
            msg: "Orçamento salvo com sucesso!",
            type: "success",
            time: 3000,
          });
        }
      }
    },
  },
};
</script>
<style scoped>
.v-card__text,
.v-card__title {
  padding: 0px !important;
}
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 30px !important;
}
.v-expansion-panel-header {
  padding: 0px 24px !important;
  min-height: 30px !important;
}
.thead-sticky {
  position: sticky;
  z-index: 1;
  top: 0px;
  opacity: 1;
  color: white;
}
.tfooter-sticky {
  position: sticky;
  z-index: 1;
  bottom: 0px;
  opacity: 1;
  background-color: #28a745;
  color: white;
}
.bg-table-item {
  background-color: #d3d3d37a;
}
.bg-header-item {
  background-color: #565555;
}
.bg-header-item-pedido {
  background-color: #28a745;
}

.grid-item {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
  color: white;
  height: 100px;
}

.fill-parent-height {
  height: 100%;
}

.top-row {
  min-height: 0;
}

.invalid-input {
  border-color: rgb(199, 0, 0) !important;
}
</style>
