<template>
  <v-container class="no-padding">
    <div v-if="!telaPedidoOrcamento">
      <v-row justify="center">
        <v-col cols="3">
          <v-text-field
            class="upper"
            @keypress.enter="showPedidoOrcamento()"
            autofocus
            v-model="numero"
            label="Pedido ou Orçamento"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="3">
          <div
            @click="showTelaPedidoOrcamento({isPedido: true, isOrcamento: false})"
            v-ripple="{ center: true }"
            class="text-center elevation-2 pa-12 headline"
          >Novo Pedido</div>
        </v-col>
        <v-col cols="3">
          <div
            @click="showTelaPedidoOrcamento({isPedido: false, isOrcamento: true})"
            v-ripple="{ center: true }"
            class="text-center elevation-2 pa-12 headline"
          >Novo Orçamento</div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <ImprimirPedidoOrcamento style="display: none" id="print"></ImprimirPedidoOrcamento>
      <v-row class="white">
        <v-col style="padding-bottom: 0px" cols="7">
          <v-row>
            <v-col cols="6">
              <v-text-field
                color="orange lighten-1"
                height="12"
                dense
                hide-details
                readonly
                v-model="pedido.numero"
                label="Número"
                :prefix="pedido.isPedido ? 'PEDIDO ':'ORÃ‡AMENTO '"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="pedido.criado_em"
                label="Emissão"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field height="12" dense hide-details readonly label="Nota"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field height="12" dense hide-details readonly label="Emissão Nota"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.razao_social"
                label="Cliente"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                dense
                hide-details
                height="12"
                class="height-lupa"
                v-model="cliente.codigo"
                append-outer-icon="fa-search"
                @click:append="showDialogSearch()"
                label="Código"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.contato"
                label="Contato"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.tipo"
                item-text="descricao"
                item-value="id"
                :items="tipos"
                label="Tipo"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.email"
                label="E-Mail"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                height="12"
                v-model="pedido.grupo"
                :items="grupos"
                item-text="descricao"
                item-value="id"
                dense
                readonly
                hide-details
                label="Grupo"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.telefone"
                label="Telefone"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="cliente.celular"
                label="Celular"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col style="padding-bottom: 0px" cols="5">
          <v-row>
            <v-col cols="6">
              <v-text-field
                height="12"
                dense
                hide-details
                readonly
                v-model="pedido.orcamento_pedido_status.descricao"
                label="Status"
              ></v-text-field>
            </v-col>
            <v-col class="text-center" style="padding-bottom: 0px; padding-top: 0px;" cols="6">
              <v-btn
                class="mr-4"
                style="margin-bottom: 15px;"
                height="15"
                text
                icon
                color="primary"
                @click="imprimir()"
              >
                <v-icon>fa-print</v-icon>
              </v-btn>
              <v-btn
                class="ml-4 mr-4"
                style="margin-bottom: 15px;"
                height="15"
                text
                icon
                color="primary"
                @click="salvarPedido()"
              >
                <v-icon>fa-save</v-icon>
              </v-btn>
              <v-btn
                class="ml-4 mr-4"
                style="margin-bottom: 15px;"
                height="15"
                text
                icon
                color="success"
                @click="voltar()"
              >
                <v-icon>fa-chevron-circle-left</v-icon>
              </v-btn>
              <v-btn
                class="ml-4"
                style="margin-bottom: 15px;"
                height="15"
                text
                icon
                color="error"
                @click="excluir()"
              >
                <v-icon>fa-times</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select height="12" dense hide-details :items="operacoes" label="Operação"></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                height="12"
                dense
                hide-details
                :items="transportadoras"
                label="Transportadora"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                  height="12"
                  v-model="pedido.vendedor"
                  :items="vendedores"
                  item-text="nome"
                  item-value="codigo"
                  dense
                  hide-details
                  label="Vendedor"
                ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                  height="12"
                  v-model="pedido.atendente"
                  :items="vendedores"
                  item-text="nome"
                  item-value="codigo"
                  dense
                  hide-details
                  label="Atendente"
                ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-select
                height="12"
                dense
                hide-details
                :items="condicoesPagamento"
                label="Condição de Pagamento"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field height="12" dense hide-details suffix="%" label="Desconto"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-select
                height="12"
                dense
                hide-details
                item-text="text"
                item-value="id"
                :items="enderecosEntrega"
                label="Endereço de Entrega"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-tabs height="20" dense grow>
        <v-tab active-class="blue darken-2 white--text" class="blue lighten-5">Itens do Pedido</v-tab>
        <v-tab active-class="blue darken-2 white--text" class="blue lighten-5">Observações</v-tab>
        <v-tab active-class="blue darken-2 white--text" class="blue lighten-5">Dados do Cliente</v-tab>
        <v-tab-item>
          <v-row class="ml-2 mr-2" :class="item.editing ? 'yellow lighten-2': ''">
            <v-col cols="1">
              <v-text-field
                dense
                ref="qtd"
                id="qtd"
                hide-details
                v-model="item.qtd"
                placeholder="Qtd"
                label="Qtd"
                required
                @click="$event.target.select()"
                @keydown.enter="$refs.cod.focus"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                ref="cod"
                @keydown.enter="$refs.descricao.focus"
                dense
                hide-details
                v-model="item.codigo"
                placeholder="Código"
                v-on:keyup="findProdutoByCod($event)"
                v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                label="Código"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="7">
              <v-text-field
                ref="descricao"
                @keydown.enter="$refs.valor.focus"
                dense
                autofocus
                hide-details
                v-on:keyup="findProduto($event)"
                v-on:keyup.page-down="$refs.tabelaItem.$el.focus()"
                v-model="item.descricao"
                label="Descrição"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-text-field
                ref="valor"
                @keydown.enter="$refs.add.$el.focus"
                dense
                hide-details
                v-model="item.valor"
                label="Valor"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn ref="add" icon text color="success" @click="addItemPedido()">
                <v-icon>fa-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <TabelaItens v-on:page-up="$refs.cod.focus()" ref="tabelaItem"></TabelaItens>
          <v-card>
            <div class="text-center red darken-4 caption">
              <span class="caption">
                <b class="white--text">Itens do Pedido</b>
              </span>
            </div>
            <TabelaItensPedido></TabelaItensPedido>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-textarea
            no-resize
            rows="10"
            label="Observações"
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in molestie sem. Mauris ut elit in justo ornare tristique. Nunc interdum semper lorem vel volutpat. Suspendisse imperdiet tempus neque, vel dapibus urna euismod nec. Suspendisse pellentesque neque est, vel suscipit odio sodales sed. Nunc bibendum lectus non mi vehicula porttitor."
            hint="Observações gerais sobre qualquer assunto"
          ></v-textarea>
        </v-tab-item>
        <v-tab-item>
          <v-form ref="formCliente" v-model="validCliente" lazy-validation>
            <v-row class="mt-2">
              <v-col cols="12" md="1">
                <v-text-field
                  dense
                  height="12"
                  hide-details
                  v-model="cliente.codigo"
                  label="Código"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  @keyup="checkCpfCnpj(cliente.cpf_cnpj)"
                  hint="Digite somento números"
                  dense
                  height="12"
                  hide-details
                  v-model="cliente.cpf_cnpj"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  label="CPF/CNPJ"
                  v-mask="['###.###.###-##', '##.###.###/####-##']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="cliente.condicao"
                  :items="condicoes"
                  item-text="descricao"
                  item-value="id"
                  label="Condição"
                  dense
                  height="12"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  dense
                  height="12"
                  v-model="cliente.tipo"
                  :items="tipos"
                  item-text="descricao"
                  item-value="id"
                  label="Tipo"
                  hide-details
                  disabled
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  dense
                  height="12"
                  v-model="cliente.atividade"
                  item-text="descricao"
                  item-value="id"
                  :items="atividades"
                  label="Atividade"
                  hide-details
                ></v-select>
              </v-col>
              <v-col class="text-center" style="padding-bottom: 0px; padding-top: 0px;" cols="3">
                <v-btn
                  class="mr-6"
                  style="margin-bottom: 15px;"
                  height="15"
                  text
                  icon
                  color="primary"
                  @click="salvarCliente()"
                >
                  <v-icon>fa-save</v-icon>
                </v-btn>
                <v-btn
                  class="ml-6 mr-6"
                  style="margin-bottom: 15px;"
                  height="15"
                  text
                  icon
                  color="success"
                  @click="voltar()"
                >
                  <v-icon>fa-chevron-circle-left</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  hide-details
                  height="12"
                  v-model="cliente.razao_social"
                  @keyup="cliente.fantasia = cliente.razao_social"
                  :rules="nomeRules"
                  label="Razão Social"
                  class="input-uppercase"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  dense
                  hide-details
                  height="12"
                  hint="Digite somento números com DDD"
                  v-model="cliente.telefone"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  label="Telefone"
                  v-mask="'(##) ####-####'"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  dense
                  height="12"
                  class="input-uppercase"
                  v-model="cliente.email"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  label="E-Mail"
                  required
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  height="12"
                  class="input-uppercase"
                  v-model="cliente.fantasia"
                  :rules="nomeRules"
                  label="Fantasia"
                  required
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  dense
                  height="12"
                  hide-details
                  hint="Digite somento números com DDD"
                  v-model="cliente.celular"
                  :rules="[v => !!v || 'Campo Obrigatório']"
                  label="Celular/WhatsApp"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  height="12"
                  v-model="cliente.grupo"
                  :items="grupos"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Grupo"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="2">
                <v-autocomplete
                  height="12"
                  v-model="cliente.vendedor"
                  :items="vendedores"
                  item-text="nome"
                  item-value="codigo"
                  dense
                  hide-details
                  label="Vendedor"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  dense
                  height="12"
                  hide-details
                  label="Limite"
                  required
                  v-money="$money"
                  v-model.lazy="cliente.limite_credito"
                  maxlength="13"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  height="12"
                  v-mask="'#########'"
                  v-model="cliente.inscricao_estadual"
                  label="Inscrição Estadual"
                  required
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  height="12"
                  hide-details
                  v-model="cliente.inscricao_municipal"
                  label="Inscrição Municipal"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-tabs height="20" dense grow>
              <v-tab
                active-class="blue darken-2 white--text"
                class="blue lighten-5"
              >Endereço Principal</v-tab>
              <v-tab
                active-class="blue darken-2 white--text"
                class="blue lighten-5"
              >Endereços Entrega</v-tab>
              <v-tab active-class="blue darken-2 white--text" class="blue lighten-5">Contatos</v-tab>
              <v-tab-item>
                <v-row class="mt-2">
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      height="12"
                      hide-details
                      @keyup="getCep(cliente.endereco_principal)"
                      hint="Digite somento números"
                      v-model="cliente.endereco_principal.cep"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Cep"
                      :loading="cepPrincipalLoading"
                      ref="cep_principal"
                      v-mask="'#####-###'"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-text-field
                      dense
                      height="12"
                      hide-details
                      class="input-uppercase"
                      hint="Rua, Avenida, Estrada..."
                      v-model="cliente.endereco_principal.logradouro"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Endereço"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-text-field
                      dense
                      height="12"
                      hide-details
                      v-model="cliente.endereco_principal.numero"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Número"
                      ref="numero_principal"
                      required
                      v-mask="'####'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      height="12"
                      hide-details
                      class="input-uppercase"
                      v-model="cliente.endereco_principal.complemento"
                      label="Complemento"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-2">
                  <v-col cols="12" md="4">
                    <v-text-field
                      dense
                      hide-details
                      height="12"
                      class="input-uppercase"
                      v-model="cliente.endereco_principal.bairro"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Bairro"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      dense
                      hide-details
                      height="12"
                      class="input-uppercase"
                      v-model="cliente.endereco_principal.cidade"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Cidade"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-text-field
                      dense
                      height="12"
                      hide-details
                      class="input-uppercase"
                      v-model="cliente.endereco_principal.uf"
                      :rules="[v => !!v || 'Campo Obrigatório']"
                      label="Estado"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-card>
                  <v-card-title>
                    <v-btn small class="success" @click="addEnderecoEntrega()">Adicionar Endereço</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-data-table
                    height="200"
                    class="elevation-1"
                    hide-default-footer
                    dense
                    :headers="headersEnderecoEntrega"
                    :items="enderecosEntrega"
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>
                          <v-text-field
                            height="12"
                            hide-details
                            @keyup="getCep(item)"
                            hint="Digite somento números"
                            v-model="item.cep"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Cep"
                            :loading="item.loading"
                            ref="cep_entrega"
                            v-mask="'#####-###'"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            hint="Rua, Avenida, Estrada..."
                            v-model="item.logradouro"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Endereço"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            v-model="item.numero"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Número"
                            required
                            maxlength="4"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.complemento"
                            label="Complemento"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.bairro"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Bairro"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.cidade"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="Cidade"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :disabled="item.cep_ok ? false: true"
                            height="12"
                            hide-details
                            class="input-uppercase"
                            v-model="item.uf"
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            label="UF"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-btn
                            text
                            icon
                            class="ma-2"
                            small
                            color="error"
                            @click="deleteEnderecoEntrega(item)"
                          >
                            <i class="far fa-trash-alt mr-2"></i>
                          </v-btn>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card>
                  <v-card-title>
                    <v-btn small class="success" @click="addContato()">Adicionar Contato</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-data-table
                    height="200"
                    class="elevation-1"
                    hide-default-footer
                    dense
                    :headers="headersContatos"
                    :items="contatos"
                    fixed-header
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{item.id}}</td>
                        <td>
                          <v-text-field
                            :rules="[v => !!v || 'Campo Obrigatório']"
                            required
                            dense
                            height="12"
                            hide-details
                            v-model="item.nome"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field dense height="12" hide-details v-model="item.email"></v-text-field>
                        </td>
                        <td>
                          <v-text-field dense height="12" hide-details v-model="item.telefone"></v-text-field>
                        </td>
                        <td>
                          <v-text-field dense height="12" hide-details v-model="item.celular"></v-text-field>
                        </td>
                        <td>
                          <v-textarea dense hide-details :rows="2" no-resize v-model="item.obs"></v-textarea>
                        </td>
                        <td>
                          <v-btn
                            text
                            icon
                            class="ma-2"
                            small
                            color="error"
                            @click="deleteContato(item)"
                          >
                            <i class="far fa-trash-alt mr-2"></i>
                          </v-btn>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-form>
        </v-tab-item>
      </v-tabs>
    </div>
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
import TabelaItens from "./components/Pedido/TabelaItens";
import TabelaItensPedido from "./components/Pedido/TabelaItensPedido";
import ImprimirPedidoOrcamento from "./components/Pedido/ImprimirPedidoOrcamento";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    TabelaItens,
    TabelaItensPedido,
    ImprimirPedidoOrcamento
  },
  data: () => ({
    selected: [],
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    numero: "",
    headersEnderecoEntrega: [
      { text: "Cep", value: "cep", sortable: false, width: 150 },
      { text: "Endereço", value: "logradouro", sortable: false },
      { text: "NÂº", value: "numero", sortable: false, width: 100 },
      {
        text: "Complemento",
        value: "complemento",
        sortable: false,
        width: 150
      },
      { text: "Bairro", value: "bairro", sortable: false },
      { text: "Cidade", value: "cidade", sortable: false },
      { text: "UF", value: "uf", sortable: false, width: 70 },
      { text: "Ação", value: "acao", sortable: true }
    ],
    headersContatos: [
      { text: "#", value: "id", sortable: false },
      { text: "Nome", value: "nome", sortable: false },
      { text: "Email", value: "email", sortable: true },
      { text: "Telefone", value: "telefone", sortable: true },
      { text: "Celular", value: "celular", sortable: true },
      { text: "Obs", value: "obs", sortable: true },
      { text: "Ação", value: "acao", sortable: true }
    ],
    contatos: [],
    operacoes: [
      // ficar global no Inicio.vue do tela de atendimento
      { text: "VENDA (ESTADUAL)", value: "1" },
      { text: "COMPRA (PEDIDO)", value: "1102 P" },
      { text: "COMPRA (NOTA)", value: "1102 N" },
      { text: "* DEVOLUÃ‡ÃƒO (ESTADUAL)", value: "5202 E" },
      { text: "DEVOLUÃ‡ÃƒO (ESTADUAL)", value: "5202" }
    ],
    condicoesPagamento: [
      { text: "Ã€ VISTA", value: "1" },
      { text: "01X CRÃ‰DITO", value: "2" },
      { text: "02X CRÃ‰DITO", value: "3" },
      { text: "01X BOLETO 10 DIAS", value: "4" }
    ],
    transportadoras: [
      { text: "CLIENTE RETIRA", value: "1" },
      { text: "NOSSO CARRO", value: "2" }
    ],
    dialogDadosItem: false,
    objectIndex: -1,
    objectItem: {},
    pagination: {
      rowsPerPage: 0
    },
    validPedido: false,
    validCliente: false,
    cepPrincipalLoading: false,
    cepEntregaLoading: false,
    isCnpj: true,
    nomeRules: [
      v => !!v || "Campo Obrigatório",
      v => v.length >= 3 || "Campo deve possuir 3 caracteres ou mais"
    ],
    enderecosEntrega: [],
  }),
  watch: {
    enderecosEntrega: {
      handler: function(val) {
        val.forEach(item => {
          if (item.cep_ok && item.numero.length > 0) {
            item.text = item.logradouro + ", " + item.numero;
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        });
      },
      deep: true
    }
  },
  mounted() {
    console.log("OBA", this.cliente);
    if (this.cliente.selecionado != 0) {
      this.loadContatos();
      this.loadEnderecosEntrega();
      this.get_condicoes();
      this.get_atividades();
      this.get_tipos();
      this.get_grupos();
      this.get_vendedores();
    }
  },
  // beforeDestroy() {
  //   console.log("morri");
  // },
  computed: {
    ...mapState({
      pedido: state => state.pedidoAtendimento.pedido,
      itens: state => state.pedidoAtendimento.itens,
      itens_pedido: state => state.pedidoAtendimento.itens_pedido,
      item: state => state.pedidoAtendimento.item,
      cliente: state => state.cliente.cliente_selected,
      condicoes: state => state.cliente.condicoes,
      atividades: state => state.cliente.atividades,
      tipos: state => state.cliente.tipos,
      grupos: state => state.cliente.grupos,
      vendedores: state => state.cliente.vendedores,
      error: state => state.pedidoAtendimento.error
    }),
    telaPedidoOrcamento: {
      get() {
        return this.$store.state.telaPedidoOrcamento;
      },
      set(value) {
        this.set_tela_pedido_orcamento(value);
      }
    }
  },
  methods: {
    ...mapActions([
      "get_pedido",
      "getProdutos",
      "getProdutoByCod",
      "get_condicoes",
      "get_atividades",
      "get_tipos",
      "get_grupos",
      "get_vendedores",
      "update_cliente",
      "save_orcamento",
      "delete_pedido"
    ]),
    ...mapMutations([
      "set_deselect_cliente",
      "set_tela_pedido_orcamento",
      "set_pedido",
      "set_itens_pedido",
      "set_cliente_selected",
      "push_itens_pedido",
      "set_item_null",
      "change_itens_pedido"
    ]),

    async excluir() {
      await this.delete_pedido({
        prefix: this.pedido.prefix,
        numero: this.pedido.numero,
        excluido: 1,
        excluido_por: "SISTEMA",
        excluido_em: ""
      });

      if (!this.error) {
        console.log("excluido com sucesso");
      }
    },

    imprimir() {
      this.$htmlToPaper("print");
    },

    async salvarPedido() {
      console.log("cliente: ", this.cliente);
      console.log("dados: ", this.pedido);
      console.log("itens: ", this.itens_pedido);

      let orcamento = {
        pedido: this.pedido,
        cliente: this.cliente,
        itens: this.itens_pedido
      };

      await this.save_orcamento(orcamento);
    },

    async salvarCliente() {
      if (this.$refs.formCliente.validate()) {
        delete this.cliente.endereco_principal.id;
        delete this.cliente.endereco_principal.cep_ok;
        delete this.cliente.endereco_principal.disabled;

        this.cliente.cliente_enderecos = [];

        this.cliente.cliente_enderecos.push(this.cliente.endereco_principal);

        if (this.enderecosEntrega.length > 0) {
          this.enderecosEntrega.forEach(item => {
            delete item.id;
            delete item.cep_ok;
            delete item.disabled;
            this.cliente.cliente_enderecos.push(item);
          });
        }

        if (this.contatos.length > 0) {
          this.cliente.cliente_contatos = [];
          this.contatos.forEach(item => {
            delete item.id;
            delete item.acao;
            item.codigo_cliente = this.cliente.codigo;
            this.cliente.cliente_contatos.push(item);
          });
        }

        this.cliente.editado_por = this.$usuario.value.usuario.toUpperCase();

        this.loading = true;

        await this.update_cliente(this.cliente);

        if (this.error) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.showSnackbar("Cliente Atualizado Com Sucesso!", "success", 2000);
        }

        this.loading = false;
      }
    },

    loadEnderecosEntrega() {
      if (this.cliente.enderecos_entrega.length == 0) {
        this.enderecosEntrega.push({
          id: 1,
          codigo_cliente: this.cliente.codigo,
          tipo: 2,
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          cep: "",
          text: "",
          acao: "",
          cep_ok: false,
          disabled: true
        });
      } else {
        this.enderecosEntrega = this.cliente.enderecos_entrega;
      }
    },

    loadContatos() {
      if (this.cliente.cliente_contatos.length == 0) {
        this.contatos.push({
          id: 1,
          nome: "",
          email: "",
          telefone: "",
          celular: "",
          obs: "",
          acao: ""
        });
      } else {
        this.contatos = this.cliente.cliente_contatos;
      }
    },

    addContato() {
      let id = 1;
      if (this.contatos.length > 0) {
        id = this.contatos.length + 1;
      }
      let contato = {
        id: id,
        nome: "",
        email: "",
        telefone: "",
        celular: "",
        obs: "",
        acao: ""
      };

      this.contatos.push(contato);
    },

    deleteContato(contato) {
      if (this.contatos.length > 1) {
        this.contatos = this.contatos.filter(item => {
          return item.id != contato.id;
        });

        for (let i = 0; i < this.contatos.length; i++) {
          this.contatos[i].id = i + 1;
        }
      } else {
        this.contatos = [];
      }
    },

    addEnderecoEntrega() {
      let id = 1;

      if (this.enderecosEntrega.length > 0) {
        id = this.enderecosEntrega[this.enderecosEntrega.length - 1].id + 1;
      }

      let endereco = {
        id: id,
        codigo_cliente: "",
        tipo: 2,
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        text: "",
        acao: "",
        cep_ok: false,
        disabled: true
      };

      endereco.text = endereco.logradouro + ", " + endereco.numero;

      this.enderecosEntrega.push(endereco);
    },

    deleteEnderecoEntrega(endereco) {
      if (this.enderecosEntrega.length > 1) {
        this.enderecosEntrega = this.enderecosEntrega.filter(item => {
          return item.id != endereco.id;
        });

        for (let i = 0; i < this.enderecosEntrega.length; i++) {
          this.enderecosEntrega[i].id = i + 1;
        }
      } else {
        this.enderecosEntrega = [];
      }
    },

    checkCpfCnpj(cpfCnpj) {
      // nao vai ser usado por enquanto
      // if (cpfCnpj.length > 14) {
      //   this.isCnpj = true;
      //   this.cliente.tipo = 2;
      // } else {
      //   this.isCnpj = false;
      //   this.cliente.tipo = 1;
      // }
    },

    getCep(item) {
      if (item.cep.length == 9) {
        if (item.tipo == 1) {
          this.cepPrincipalLoading = true;
        } else {
          this.cepEntregaLoading = true;
        }

        item.cep = item.cep.replace("-", "");
        this.$axios
          .get("https://viacep.com.br/ws/" + item.cep + "/json/")
          .then(res => {
            if (res.data.erro) {
              if (item.tipo == 1) {
                this.cepPrincipalLoading = false;
                this.$refs.cep_principal.focus();
              } else {
                this.cepEntregaLoading = false;
              }
              this.showSnackbar("Cep Inválido", "warning", 2000);
              return;
            }

            if (item.tipo == 1) {
              this.cepPrincipalLoading = false;
              this.cliente.endereco_principal.logradouro = res.data.logradouro.toUpperCase();
              this.cliente.endereco_principal.bairro = res.data.bairro.toUpperCase();
              this.cliente.endereco_principal.cidade = res.data.localidade.toUpperCase();
              this.cliente.endereco_principal.uf = res.data.uf.toUpperCase();
              this.$refs.numero_principal.focus();
            } else {
              item.cep_ok = true;
              item.logradouro = res.data.logradouro.toUpperCase();
              item.bairro = res.data.bairro.toUpperCase();
              item.cidade = res.data.localidade.toUpperCase();
              item.uf = res.data.uf.toUpperCase();
            }
          })
          .catch(err => {
            this.cepPrincipalLoading = false;
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
    voltar() {
      this.set_deselect_cliente();
      this.telaPedidoOrcamento = false;
    },
    addItemPedido() {
      if (this.item.valido) {
        let ordem = this.itens_pedido.length;
        let insertProduto = {};

        insertProduto.ordem = ordem;
        insertProduto.qtd = this.item.qtd;
        insertProduto.codigo = this.item.codigo;
        insertProduto.descricao = this.item.descricao;
        insertProduto.saldo = this.item.saldo;
        insertProduto.marca = this.item.marca;
        insertProduto.valor = this.item.valor;
        insertProduto.total =
          parseInt(this.item.qtd) * parseFloat(this.item.valor);

        if (this.item.editing) {
          this.item.editing = false;
          this.item.total =
            parseInt(this.item.qtd) * parseFloat(this.item.valor);
          this.change_itens_pedido(this.item);
        } else {
          this.push_itens_pedido(insertProduto);

          //this.$refs.qtd.focus();
          //document.querySelector("#qtd").select();
        }
        this.set_item_null();
      }
    },
    nextItemPedido(event) {},
    prevItemPedido(event) {},
    selectItemPedido(item) {},

    showDialogSearch() {
      // global
    },
    async showPedidoOrcamento() {
      console.log(this.numero);

      await this.get_pedido(this.numero);

      if (this.error) {
        console.log("deu erro");
      } else {
        console.log(this.pedido);
        //this.pedido.isOrcamento = true;
        //this.pedido.isPedido = false;
        this.set_cliente_selected(this.pedido.clientes[0]);
        this.telaPedidoOrcamento = true;
      }
    },
    showTelaPedidoOrcamento(tipo) {
      console.log(this.cliente);
      if (tipo.isPedido) {
        this.pedido.isPedido = true;
        this.pedido.isOrcamento = false;
      } else {
        this.pedido.isOrcamento = true;
        this.pedido.isPedido = false;
      }
      this.telaPedidoOrcamento = true;
    },

    clearSelect() {
      this.itens.forEach(item => {
        item.selected = false;
        item.status_color = "white";
      });
    },
    showDadosItem(item) {
      this.objectIndex = this.itens.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogDadosItem = true;
    },
    findProdutoByCod(event) {
      if (
        this.item.codigo &&
        this.item.codigo.length >= 4 &&
        event.key != "PageDown" &&
        event.key != "PageUp"
      ) {
        this.item.descricao = "";
        setTimeout(() => {
          this.getProdutoByCod(this.item.codigo);
        }, 800);
      }
    },
    findProduto(event) {
      if (
        this.item.descricao &&
        this.item.descricao.length >= 4 &&
        event.key != "PageDown" &&
        event.key != "PageUp"
      ) {
        this.item.codigo = "";
        setTimeout(() => {
          this.getProdutos(this.item.descricao);
        }, 500);
      }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    }
  }
};
</script>
<style>
.v-text-field__prefix {
  color: #ffa726;
}
.height-lupa .v-input__append-outer {
  height: 5px;
  margin-top: -15px;
}
.upper input {
  text-transform: uppercase;
}
</style>