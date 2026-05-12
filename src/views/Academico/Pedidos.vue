<template>
  <v-container>
    <ImprimirPedido style="display: none" id="print"></ImprimirPedido>
    <v-card>
      <v-card-title>
        <v-row justify="center" class="custom-row">
          <v-col cols="4">
            <v-text-field
              v-model="data_de"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
              @keydown.enter="getPedidos()"
              placeholder="dd/mm/aaaa"
              label="De"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="data_ate"
              v-mask="'##/##/####'"
              @keydown.enter="getPedidos()"
              :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
              placeholder="dd/mm/aaaa"
              label="AtÃ©"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <span v-if="emitido == 1">
          Pedidos
          <span class="primary--text">Baixados</span> AcadÃªmico -
        </span>
        <span v-else-if="emitido == 0">
          Pedidos
          <span class="warning--text">Pendentes</span> AcadÃªmico -
        </span>
        <span v-else-if="emitido == 2">
          Pedidos
          <span class="warning--text">Entregues</span> AcadÃªmico -
        </span>
        <span v-else-if="emitido == 3">
          Pedidos
          <span class="error--text">Cancelados</span> AcadÃªmico -
        </span>
        <span v-else-if="emitido == 4">
          Pedidos
          <span class="deep-purple--text">Outros </span> AcadÃªmico -
        </span>
        <span v-else-if="emitido == 5">
          Pedidos
          <span class="deep-purple--text">NÃ£o ConcluÃ­dos </span> AcadÃªmico -
        </span>
        <v-btn small class="ml-3" @click="getPedidos()">Atualizar</v-btn>
        <!-- <v-btn
          v-if="emitido == 1"
          small
          class="ml-3 warning"
          @click="changeTablePedidos()"
        >Ir p/ Pendentes</v-btn>
        <v-btn v-else small class="ml-3 primary" @click="changeTablePedidos()">Ir p/ Emitidos</v-btn>-->
        <!-- <v-btn v-if="emitido == 1" small class="ml-3 primary" @click="getEntregue()">Ir p/ Entregues</v-btn> -->
        <v-menu
          v-model="menuRelatorios"
          :close-on-content-click="false"
          :nudge-width="150"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="success ml-2" small>RelatÃ³rios</v-btn>
          </template>
          <v-card>
            <v-container class="ma-3">
              <v-row dense>
                <v-col>
                  <v-btn class="success" @click="excel('todos')" small
                    >Todos Pedidos</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="emitido == 0 || emitido == 1" dense>
                <v-col>
                  <v-btn
                    class="light-blue lighten-1 white--text"
                    @click="excel('reservado')"
                    small
                    >Reservados</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="emitido == 1 || emitido == 2" dense>
                <v-col>
                  <v-btn class="success" @click="excel('reserva_paga')" small
                    >Reserva Paga</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="emitido == 0" dense>
                <v-col>
                  <v-btn
                    class="warning"
                    @click="excel('boleto_em_aberto')"
                    small
                    >Boleto em Aberto</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="emitido == 1 || emitido == 2" dense>
                <v-col>
                  <v-btn class="success" @click="excel('boleto_pago')" small
                    >Boleto Pago</v-btn
                  >
                </v-col>
              </v-row>
              <!-- <v-row dense>
                <v-col>
                  <v-btn
                    class="purple white--text"
                    @click="excelFinanceiro()"
                    small
                    >Financeiro</v-btn
                  >
                </v-col>
              </v-row> -->
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="error" text @click="menuRelatorios = false"
                >Voltar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn
          v-if="permissoes.btn_emitir_todos"
          @click="showDialogEmitirTodos()"
          color="purple"
          x-large
          classs="ml-4"
          icon
          ><v-icon>fas fa-arrow-alt-circle-down</v-icon></v-btn
        >
        <div class="flex-grow-1"></div>
        <v-text-field
          class="uppercase"
          v-model="search"
          v-on:keyup="find(search)"
          append-icon="fa-search"
          label="Busque por: Nome, CPF, Pedido ou Status"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-subtitle>
        <!-- <v-menu v-model="menuFiltros" :close-on-content-click="false" :nudge-width="400" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn color="indigo" dark v-on="on">Filtros</v-btn>
          </template>
          <v-card>
            <v-container>
              <v-row dense>
                <v-col>
                  <v-select
                    @change="changeFilter"
                    v-model="selectedGrupo"
                    dense
                    multiple
                    hide-details
                    :items="grupos"
                    label="Grupos"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="warning" @click="clearFilter(true)">Limpar Filtros</v-btn>
              <v-btn text @click="menuFiltros = false">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <span class="primary--text body-1 ml-3">Filtro Ativo:</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoGrupo" class="red--text body-1">{{filtroAtivoGrupo}}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoStatus" class="red--text body-1">{{filtroAtivoStatus}}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoSistema" class="red--text body-1">{{filtroAtivoSistema}}</span>-->
        <v-btn-toggle
          mandatory
          class="ml-3"
          @change="getPedidos()"
          dark
          v-model="emitido"
          tile
        >
          <v-btn small active-class="deep-purple" :value="5"
            >NÃ£o Concluidos</v-btn
          >
          <v-btn small active-class="warning" :value="0">Pendentes</v-btn>
          <v-btn small active-class="primary" :value="1">Emitidos</v-btn>
          <v-btn small active-class="success" :value="2">Entregues</v-btn>
          <v-btn small active-class="error" :value="3">Cancelados</v-btn>
          <v-btn small active-class="deep-purple" :value="4">Outros</v-btn>
        </v-btn-toggle>
      </v-card-subtitle>

      <q-virtual-scroll
        class="my-sticky-dynamic"
        type="table"
        dense
        style="max-height: 70vh"
        virtual-scroll
        :virtual-scroll-slice-size="30"
        :virtual-scroll-item-size="47"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
        :items="filteredPedidos"
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
              <div v-if="col.name == 'data_pedido'">
                <v-sheet
                  >Pedido: {{ row.data_pedido }} {{ row.hora_pedido }}</v-sheet
                >
                <!-- <v-sheet color="success--text" v-if="row.emitido == 1"
                  >Emitido: {{ row.data_pedido_dcinfo }}</v-sheet
                > -->
                <!-- oi -->
                <v-tooltip v-if="row.emitido == 1" right color="grey darken-1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" small v-bind="attrs" v-on="on"
                      >far fa-question-circle</v-icon
                    >
                  </template>
                  <span
                    >Emitido em:
                    {{ $moment_format_sub_2(row.emitido_em) }}</span
                  ><br />
                  <span>Emitido por: {{ row.emitido_por }}</span>
                </v-tooltip>
                <v-sheet v-if="row.entregue == 1" color="warning--text"
                  >Entregue: {{ row.entregue_em }} -
                  {{ row.entregue_por }}</v-sheet
                >
                <span v-if="row.emitido == 0 && row.aluno.bloqueado">
                  <br />
                  <v-chip class="mt-1 mb-1" color="red" text-color="white">
                    CLIENTE BLOQUEADO
                  </v-chip>
                </span>
                <span
                  v-if="
                    row.emitido == 0 &&
                    row.novo_pedido == 1 &&
                    row.pagamento.tipo_pagamento == 'CREDITO'
                  "
                >
                  <br />
                  <v-chip class="mt-1 mb-1" color="red" text-color="white">
                    CLIENTE NOVO
                  </v-chip>
                </span>
                <span
                  v-if="
                    row.emitido == 0 &&
                    row.pagamento.tipo_pagamento == 'CREDITO' &&
                    row.pagamento.parentesco != '' &&
                    row.credito != null &&
                    row.credito.hasOwnProperty('banco') &&
                    row.credito.banco != 'SAFRA' &&
                    typeof row.pagamento.parentesco == 'string'
                  "
                >
                  <br />
                  <v-chip class="mt-1 mb-1" color="red" text-color="white">
                    NÃƒO Ã‰ TITULAR
                  </v-chip>
                </span>
                <span
                  v-if="
                    row.emitido == 0 &&
                    row.pagamento.tipo_pagamento == 'CREDITO'
                  "
                >
                  <div v-if="row.credito != null && row.credito.hasOwnProperty('banco') && row.credito.banco == 'SAFRA'">
                    <v-chip
                      @click="showAntifraude($event, row)"
                      class="mt-1 mb-1"
                      :color="
                        row.pagamento.status_antifraude == 'APROVADO'
                          ? 'success'
                          : row.pagamento.status_antifraude == 'ANALISAR'
                          ? 'warning'
                          : 'error'
                      "
                      text-color="white"
                    >
                      {{ row.pagamento.status_antifraude }}
                    </v-chip>
                  </div>
                </span>
              </div>
              <div v-if="col.name == 'aluno'">
                <span @click="copy('nome', index)"
                  >{{ row.aluno.nome }} {{ row.aluno.sobrenome }}</span
                >
                <input
                  type="hidden"
                  :id="'nomeCopy' + index"
                  :value="
                    row.aluno.nome.trim() + ' ' + row.aluno.sobrenome.trim()
                  "
                />
                <br />
                <span @click="copy('cpf', index)">{{
                  putMask(row.aluno.cpf)
                }}</span>
                <input
                  type="hidden"
                  :id="'cpfCopy' + index"
                  :value="putMask(row.aluno.cpf)"
                />
                <br />

                <!-- <div
                  v-if="
                    row.pagamento.status_pagamento == 'NÃƒO PAGO' &&
                      row.emitido == 0
                  "
                > -->
                <!-- oi -->
                <span @click="copy('celular', index)">{{
                  putMask(row.aluno.celular, "celular")
                }}</span>
                <input
                  type="hidden"
                  :id="'celularCopy' + index"
                  :value="putMask(row.aluno.celular, 'celular')"
                />
                |
                <span @click="copy('email', index)">{{ row.aluno.email }}</span>
                <input
                  type="hidden"
                  :id="'emailCopy' + index"
                  :value="row.aluno.email"
                />
                <!-- </div> -->
              </div>
              <div v-if="col.name == 'grupo'">
                {{ row.grupo }} <br />
                <!-- <span v-if="row.emitido == 0 && row.pagamento.tipo_pagamento == 'CREDITO' || row.emitido == 1 && row.pagamento.tipo_pagamento == 'CREDITO'"><br />
                  <v-btn                
                        class="mt-n6"        
                        color="primary"
                        icon
                        small
                        @click="showImage($event, row)"
                        >
                        <v-icon dark>fas fa-camera</v-icon>
                  </v-btn>
                </span> -->
              </div>
              <div v-if="col.name == 'id_pedidos'">
                <span @click="copy('pedido-Online', index)">{{
                  row.id_pedidos
                }}</span>
                <input
                  type="hidden"
                  :id="'pedido-OnlineCopy' + index"
                  :value="row.id_pedidos"
                />
                <br />
                <span @click="copy('pedido-DcInfo', index)">{{
                  row.pedido_dcinfo
                }}</span>
                <input
                  type="hidden"
                  :id="'pedido-DcInfoCopy' + index"
                  :value="row.pedido_dcinfo"
                />
              </div>
              <div v-if="col.name == 'pagamento'">
                <v-chip
                  @click="show($event, row)"
                  class="text-center"
                  :class="classWarning(row)"
                  :color="colorStatusSistema(row.pagamento.status_pagamento)"
                  dark
                  heigth="40"
                >
                  <div v-if="row.pagamento.hasOwnProperty('boleto')">
                    <span
                      v-if="row.boleto.vencido && row.boleto.status != 'PAGO'"
                      >BOLETO VENCIDO</span
                    >
                    <span v-else>{{ row.pagamento.status_pagamento }}</span>
                  </div>
                  <div v-else>
                    <span
                      v-if="row.pix != null && row.pix.status == 'DEVOLVIDO'"
                    >
                      PIX DEVOLVIDO
                    </span>
                    <span v-else>{{ row.pagamento.status_pagamento }}</span>
                    <div v-if="row.hasOwnProperty('credito')">
                      <div
                        style="margin-top: -3px"
                        v-if="
                          row.credito != null &&
                          row.credito.status == 'CONFIRMED'
                        "
                      >
                        R$ {{ row.credito.amount }}
                      </div>
                    </div>
                  </div>
                </v-chip>
              </div>
              <div v-if="col.name == 'valor_total'">
                <div>
                  {{ $money_format(row.valor_total) }}
                </div>
              </div>
              <div v-if="col.name == 'desconto'">
                {{ $money_format(row.valor_desconto) }}
                <div v-if="row.pagamento.tipo_pagamento == 'BOLETO'">
                  <i>Ã€ Vista ({{ row.boleto.desconto }}%): </i> <br />
                  {{
                    $money_format(
                      (row.valor_total - row.valor_desconto) *
                        (row.boleto.desconto / 100)
                    )
                  }}
                </div>
                <div v-else-if="row.pagamento.tipo_pagamento == 'PIX'">
                  <i>Ã€ Vista ({{ row.pix.desconto_valor }}%): </i> <br />
                  {{
                    $money_format(
                      (row.valor_total - row.valor_desconto) *
                        (row.pix.desconto_valor / 100)
                    )
                  }}
                </div>
              </div>
              <div v-if="col.name == 'valor_frete'">
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(row.valor_frete)
                }}
              </div>
              <div v-if="col.name == 'valor_total_final'">
                <div v-if="row.desconto_representantes">
                  <div v-if="row.pagamento.tipo_pagamento == 'BOLETO'">
                    {{
                      $money_format(
                        row.valor_total_final -
                          row.valor_desconto -
                          (row.valor_total - row.valor_desconto) *
                            (row.boleto.desconto / 100)
                      )
                    }}
                  </div>
                  <div v-else-if="row.pagamento.tipo_pagamento == 'PIX'">
                    {{
                      $money_format(
                        row.valor_total_final -
                          row.valor_desconto -
                          (row.valor_total - row.valor_desconto) *
                            (row.pix.desconto_valor / 100)
                      )
                    }}
                  </div>
                  <div v-else>
                    {{ row.valor_total_final - row.valor_desconto }}
                  </div>
                </div>
                <div v-else>
                  <div v-if="row.pagamento.tipo_pagamento == 'PIX'">
                    {{
                      $money_format(
                        row.valor_total_final -
                          (row.valor_total - row.valor_desconto) *
                            (row.pix.desconto_valor / 100)
                      )
                    }}
                  </div>
                  <div v-else-if="row.pagamento.tipo_pagamento == 'BOLETO'">
                    {{
                      $money_format(
                        row.valor_total_final -
                          (row.valor_total - row.valor_desconto) *
                            (row.boleto.desconto / 100)
                      )
                    }}
                  </div>
                  <div v-else>
                    <span v-if="row.acrescimo != 0">
                      {{ $money_format(row.valor_total_final * (1 + row.acrescimo/100)) }} <br>
                      ({{ row.acrescimo }}% juros)
                    </span>
                    <span v-else>{{ $money_format(row.valor_total_final) }}</span>
                  </div>
                </div>
              </div>
              <div v-if="col.name == 'status_aluno'">
                <v-chip class="warning" v-if="row.entregue == 1" dark
                  >ENTREGUE</v-chip
                >
                <v-chip
                  :class="
                    row.valor_faturado < row.valor_total &&
                    (row.status_aluno == 'FATURADO' ||
                      row.status_aluno == 'CONFERIDO')
                      ? 'text-center warning-conferido'
                      : 'text-center black'
                  "
                  @click="showStatus($event, row)"
                  :color="colorStatusSistema(row.status_aluno)"
                  dark
                  >{{ row.status_aluno }}</v-chip
                >
                <span
                  v-if="
                    row.status_aluno == 'FATURADO' ||
                    row.status_aluno == 'CONFERIDO'
                  "
                  >R$
                  {{ row.valor_faturado.toFixed(2).replace(".", ",") }}</span
                >
              </div>
              <div v-if="col.name == 'acao'">
                <v-btn
                  v-if="row.status_aluno != 'RETIRADA'"
                  small
                  class="ma-1"
                  color="primary"
                  icon
                  @click="showBotoes($event, row)"
                >
                  <v-icon dark right>fa fa-bars</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </v-card>
    <!-- MENUS DA TABELA -->
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="false"
      :close-on-click="false"
      :nudge-width="200"
      scrollable
    >
      <v-card v-if="objectItem.pagamento.status_pagamento == 'RESERVADO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes Reserva</v-card-title
        >
        <v-card-text>
          <b>CartÃ£o de CrÃ©dito</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.credito.banco }}
          <br />
          <b>AutorizaÃ§Ã£o:</b>
          {{ objectItem.credito.terminal_nsu }}
          <br />
          <b>NÂº Comprovante:</b>
          {{ objectItem.credito.acquirer_transaction_id }}
          <br />
          <b>Status:</b>
          {{ objectItem.credito.status }}
          <br />
          <b>Bandeira:</b>
          {{ objectItem.credito.bandeira }}
          <br />
          <b>Parcelas:</b>
          {{ objectItem.credito.number_installments }}x
          <br />
          <b>Recebido em:</b>
          {{ objectItem.credito.authorized_at }}
          <br />
          <b>Dias p/ Estorno</b>
          {{ objectItem.credito.dias_p_extorno }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Valor Pedido:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_total)
          }}
          <br />
          <div class="title font-weight-black">
            <b>Valor Total:</b>
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                objectItem.valor_total_final * (1 + objectItem.acrescimo / 100)
              )
            }}
            <b v-if="objectItem.acrescimo != 0">
              ({{ objectItem.acrescimo }}% juros)</b
            >
          </div>
          <v-divider></v-divider>

          <b>CPF:</b>
          {{
            objectItem.aluno.cpf == undefined
              ? ""
              : putMask(objectItem.aluno.cpf)
          }}
          <br />
          <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
          <br />
          <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
          {{ objectItem.aluno.sobrenome }}
          <br />
          <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
          <br />
          <b>Telefone Cadastro:</b>
          {{
            objectItem.aluno.celular == undefined
              ? ""
              : putMask(objectItem.aluno.celular, "celular")
          }}
          <br />

          <div
            v-if="
              objectItem.pagamento.parentesco != '' &&
              typeof objectItem.pagamento.parentesco != 'object'
            "
          >
            <b>Parentesco:</b> {{ objectItem.pagamento.parentesco }}
            <br />
            <b>Nome Titular:</b>
            {{
              objectItem.credito == null ? "" : objectItem.credito.nome_cartao
            }}
            <br />
            <b class="error--text">CLIENTE NÃƒO Ã‰ O TITULAR</b>
            <br />
          </div>
          <div v-else>
            <b class="success--text">CLIENTE Ã‰ O TITULAR</b>
            <br />
          </div>
          <v-divider></v-divider>

          <b class="title font-weight-black"
            >Valor Reservado: R$ {{ objectItem.credito.amount }}</b
          >
          <br />
          <b class="title font-weight-black">Valor a Cobrar:</b>
          <money
            maxlength="10"
            class="form-control font-weight-bold text-center"
            style="width: 90%"
            @keydown.enter.prevent="checkValorCobrar(objectItem)"
            v-model="objectItem.credito.valor_cobrar"
            v-bind="money"
          ></money>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            text
            color="success"
            @click="
              checkValorCobrar(objectItem);
              showMenu = false;
            "
            >Cobrar</v-btn
          >
          <v-btn
            text
            color="error"
            @click="
              dialogCancelarReserva = true;
              showMenu = false;
            "
            >Estornar</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="objectItem.pagamento.status_pagamento == 'RESERVA PAGA'"
      >
        <v-card-title class="headline font-weight-black"
          >Detalhes ConfirmaÃ§Ã£o</v-card-title
        >
        <v-card-text>
          <b>CartÃ£o de CrÃ©dito</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.credito.banco }}
          <br />
          <b>AutorizaÃ§Ã£o:</b>
          {{ objectItem.credito.terminal_nsu }}
          <br />
          <b>NÂº Comprovante:</b>
          {{ objectItem.credito.acquirer_transaction_id }}
          <br />
          <b>Status:</b>
          {{ objectItem.credito.status }}
          <br />
          <b>Bandeira:</b>
          {{ objectItem.credito.bandeira }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Valor Pedido:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_total)
          }}

          <br />
          <div class="title font-weight-black">
            <b>Valor Total:</b>
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                objectItem.valor_total_final * (1 + objectItem.acrescimo / 100)
              )
            }}
            <b v-if="objectItem.acrescimo != 0">
              ({{ objectItem.acrescimo }}% de juros)</b
            >
          </div>
          <br />
          <b>Parcelas:</b>
          {{ objectItem.credito.number_installments }}x
          <br />
          <b>Recebido em:</b>
          {{ objectItem.credito.authorized_at }}
          <br />
          <b>Confirmado em:</b>
          {{ objectItem.credito.confirm_date }}
          <br />
          <b>Valor Cobrado:</b>
          R$ {{ objectItem.credito.amount }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="objectItem.pagamento.status_pagamento == 'CREDITO PAGO'"
      >
        <v-card-title class="headline font-weight-black"
          >Detalhes Pagamento</v-card-title
        >
        <v-card-text>
          <b>CartÃ£o de CrÃ©dito</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.credito.banco }}
          <br />
          <b>AutorizaÃ§Ã£o:</b>
          {{ objectItem.credito.terminal_nsu }}
          <br />
          <b>NÂº Comprovante:</b>
          {{ objectItem.credito.acquirer_transaction_id }}
          <br />
          <b>Status:</b>
          {{ objectItem.credito.status }}
          <br />
          <b>Bandeira:</b>
          {{ objectItem.credito.bandeira }}
          <br />
          <b>Valor:</b>
          R$ {{ objectItem.credito.amount }}
          <br />
          <b>Parcelas:</b>
          {{ objectItem.credito.number_installments }}x
          <br />
          <b>Recebido em:</b>
          {{ objectItem.credito.authorized_at }}

          <v-divider></v-divider>
          <b>CPF:</b>
          {{
            objectItem.aluno.cpf == undefined
              ? ""
              : putMask(objectItem.aluno.cpf)
          }}
          <br />
          <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
          <br />
          <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
          {{ objectItem.aluno.sobrenome }}
          <br />
          <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
          <br />
          <b>Telefone Cadastro:</b>
          {{
            objectItem.aluno.celular == undefined
              ? ""
              : putMask(objectItem.aluno.celular, "celular")
          }}
          <br />

          <div
            v-if="
              objectItem.pagamento.parentesco != '' &&
              typeof objectItem.pagamento.parentesco != 'object'
            "
          >
            <b>Parentesco:</b> {{ objectItem.pagamento.parentesco }}
            <br />
            <b>Nome Titular:</b>
            {{
              objectItem.credito == null ? "" : objectItem.credito.nome_cartao
            }}
            <br />
            <b class="error--text">CLIENTE NÃƒO Ã‰ O TITULAR</b>
            <br />
          </div>
          <div v-else>
            <b class="success--text">CLIENTE Ã‰ O TITULAR</b>
            <br />
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="objectItem.pagamento.status_pagamento == 'BOLETO PAGO'"
      >
        <v-card-title class="headline font-weight-black"
          >Detalhes Pagamento</v-card-title
        >
        <v-card-text>
          <b>Boleto</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.boleto.banco }}
          <br />
          <b>NÂº Documento:</b>
          {{ objectItem.boleto.document_number }}
          <br />
          <b>Nosso NÃºmero:</b>
          {{ objectItem.boleto.our_number }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Valor Pedido:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_total)
          }}
          <br />
          <div v-if="objectItem.desconto_representantes">
            <b>Desconto CPF:</b>
            {{ $money_format(objectItem.valor_desconto) }}
            <br />
          </div>
          <b>Desconto Ã  Vista ({{ objectItem.boleto.desconto }}%):</b>
          {{
            $money_format(
              (objectItem.valor_total - objectItem.valor_desconto) *
                (objectItem.boleto.desconto / 100)
            )
          }}
          <br />
          <b>Valor Pago:</b>
          {{
            $money_format(
              objectItem.valor_total_final -
                objectItem.valor_desconto -
                (objectItem.valor_total - objectItem.valor_desconto) *
                  (objectItem.boleto.desconto / 100)
            )
          }}
          <br />
          <b>Emitido em:</b>
          {{ objectItem.boleto.issue_date }}
          <br />
          <b>Vencimento:</b>
          {{ objectItem.boleto.expiration_date }}
          <br />
          <b>Recebido em:</b>
          {{ objectItem.boleto.received_at }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="objectItem.pagamento.status_pagamento == 'BOLETO EM ABERTO'"
      >
        <v-card-title
          v-if="objectItem.boleto.vencido"
          class="headline font-weight-black"
        >
          Boleto Vencido
          <br />
          {{ objectItem.boleto.expiration_date }}
        </v-card-title>
        <v-card-title v-else class="headline font-weight-black">
          Boleto em Aberto
          <br />
          {{ objectItem.boleto.expiration_date }}
        </v-card-title>
        <v-card-text v-if="objectItem.boleto.bank == 'C6'" class="text-center">
          <v-btn
            color="primary"
            @click="abrirBoletoC6(objectItem.boleto.boleto_html)"
          >
            Ver Boleto
            <v-icon dark right>fa-file-alt</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text v-else class="text-center">
          <v-btn
            target="_blank"
            :href="objectItem.boleto.boleto_html"
            color="primary"
          >
            Ver Boleto
            <v-icon dark right>fa-file-alt</v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text @click="showMenu = false">Voltar</v-btn>
          <v-btn color="success" text @click="enviarEmailLink(objectItem)"
            >Enviar por E-mail</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-else-if="objectItem.pagamento.status_pagamento == 'CANCELADO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes Cancelamento</v-card-title
        >
        <v-card-text>
          <b>CartÃ£o de CrÃ©dito</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.credito.banco }}
          <br />
          <b>AutorizaÃ§Ã£o:</b>
          {{ objectItem.credito.terminal_nsu }}
          <br />
          <b>NÂº Comprovante:</b>
          {{ objectItem.credito.acquirer_transaction_id }}
          <br />
          <b>Status:</b>
          {{ objectItem.credito.status }}
          <br />
          <b>Bandeira:</b>
          {{ objectItem.credito.bandeira }}
          <br />
          <b>Valor:</b>
          R$ {{ objectItem.credito.amount }}
          <br />
          <b>Parcelas:</b>
          {{ objectItem.credito.number_installments }}x
          <br />
          <b>Recebido em:</b>
          {{ objectItem.credito.authorized_at }}
          <br />
          <b>Cancelado em:</b>
          {{ objectItem.credito.canceled_at }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn class="error--text" text @click="showMenu = false"
            >Voltar</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-else-if="objectItem.pagamento.status_pagamento == 'PIX PAGO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes ConfirmaÃ§Ã£o PIX</v-card-title
        >
        <v-card-text>
          <b>PIX</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.pix.banco }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Criado em:</b>
          {{ objectItem.pix.criado_em }}
          <br />
          <b>Pago em:</b>
          {{ objectItem.pix.pago_em }}
          <br />
          <b>Valor:</b>
          R$
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.pix.valor)
          }}
          <br />
          <b>ObservaÃ§Ã£o:</b>
          {{ objectItem.pix.obs }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn
            text
            color="error"
            @click="
              dialogCancelarPix = true;
              showMenu = false;
            "
            >Estornar</v-btn
          >
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="objectItem.pagamento.status_pagamento == 'DEVOLVIDO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes Estorno PIX</v-card-title
        >
        <v-card-text>
          <b>PIX</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.pix.banco }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Criado em:</b>
          {{ objectItem.pix.criado_em }}
          <br />
          <b>Pago em:</b>
          {{ objectItem.pix.pago_em }}
          <br />
          <b>Estornado em:</b>
          {{ $moment_format_time(objectItem.pix.devolvido_em) }}
          <br />
          <b>Valor:</b>
          R$
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.pix.valor)
          }}
          <br />
          <b>ObservaÃ§Ã£o:</b>
          {{ objectItem.pix.obs }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="showComprovante(objectItem)"
            >Imprimir</v-btn
          >
          <v-btn text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="objectItem.log_pagamento != null">
        <v-card-title class="headline font-weight-black">Detalhes</v-card-title>
        <v-card-text>
          <div v-for="log in objectItem.log_pagamento" :key="log.id">
            <div v-if="log.obj_retorno.hasOwnProperty('cielo')">
              <b>Motivo:</b>
              <span>{{ log.obj_retorno.Payment.ReturnMessage }}</span>
            </div>
            <div v-else-if="log.obj_retorno.hasOwnProperty('charge')">
              <b>Data:</b>
              {{ $moment_format_sub_2(log.created_at) }}
              <br />
              <div v-if="!log.razao.includes('{')">
                <b>Motivo: {{ log.razao }}</b>
                <br />
              </div>
              <b>Status:</b>
              {{ log.obj_retorno.charge.chargeStatus }}
              <br />
              <b>CÃ³digo de Erro Banco:</b>
              {{ log.obj_retorno.charge.transactions[0].errorCode }}
              <br />
              <b>Mensagem de Erro Banco:</b>
              {{ log.obj_retorno.charge.transactions[0].errorMessage }}
              <br />
              <b>CÃ³digo de Erro Adquirente:</b>
              {{ log.obj_retorno.charge.transactions[0].acquirerErrorCode }}
              <br />
              <b>Mensagem de Erro Adquirente:</b>
              {{ log.obj_retorno.charge.transactions[0].acquirerErrorMessage }}
              <br />
            </div>
            <div
              v-else-if="log.obj_retorno.details[0].hasOwnProperty('antifraud')"
            >
              <br />
              <b>Data:</b>
              {{
                $moment_format_sub_2(
                  log.obj_retorno.details[0].antifraud.transaction_datetime
                )
              }}
              <br />
              <b>Status:</b>
              {{ log.obj_retorno.details[0].antifraud.code }}
              <br />
              <b>Codigo de Erro:</b>
              {{ log.obj_retorno.details[0].antifraud.status_code }}
              <br />
              <div v-if="!log.razao.includes('{')">
                <b>Motivo: {{ log.razao }}</b>
              </div>
              <br />
            </div>
            <div
              v-else-if="
                log.obj_retorno.details[0].hasOwnProperty(
                  'acquirer_transaction_id'
                )
              "
            >
              <br />
              <b>Data:</b>
              {{ $moment_format_sub_2(log.created_at) }}
              <br />
              <b>Status:</b>
              {{ log.obj_retorno.details[0].status }}
              <br />
              <b>Codigo de Erro:</b>
              {{ log.obj_retorno.details[0].error_code }}
              <br />
              <b>Motivo</b>
              {{ log.obj_retorno.details[0].description_detail }}
              <br />
            </div>
            <div v-else-if="log.obj_retorno.status_code == '500'">
              <br />
              <b>Data:</b>
              {{ $moment_format_sub_2(log.created_at) }}
              <br />
              <b>Status:</b>
              {{ log.obj_retorno.details[0].status }}
              <br />
              <b>Codigo de Erro:</b>
              {{ log.obj_retorno.details[0].error_code }}
              <br />
              <b>Motivo: </b>
              <span
                v-if="
                  log.obj_retorno.details[0].description ==
                  'Internal Server Error'
                "
                >Erro interno do Banco</span
              >
              <br />
            </div>
            <div v-else-if="log.obj_retorno.status_code == '400'">
              <br />
              <b>Data:</b>
              {{ $moment_format_sub_2(log.created_at) }}
              <br />
              <b>Status:</b>
              {{ log.obj_retorno.status }}
              <br />
              <b>Codigo de Erro:</b>
              {{ log.obj_retorno.status_code }}
              <br />
              <b>Motivo: </b>
              <span
                v-if="
                  log.obj_retorno.details[0].description ==
                  'customer.email is invalid'
                "
              >
                Email invÃ¡lido
              </span>
              <br />
            </div>
          </div>
          <v-divider></v-divider>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="
          objectItem.pagamento.status_pagamento == 'NÃƒO PAGO' ||
          objectItem.pagamento.status_pagamento == 'PAGO'
        "
      >
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                counter
                filled
                label="ObservaÃ§Ãµes"
                rows="6"
                row-height="30"
                v-model="objectItem.pagamento.observacao"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="salvarObsPagamento(objectItem.pagamento)"
            >Salvar</v-btn
          >
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="showMenu = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!--- MENU STATUS ALUNO --->
    <v-menu
      v-model="showMenuStatus"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="false"
      :close-on-click="false"
      :nudge-width="200"
    >
      <v-card v-if="objectItem.status_aluno == 'FATURADO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes Faturamento</v-card-title
        >
        <v-card-text class="h6">
          <b>Pedido:</b>
          {{ objectItem.pedido_dcinfo }}
          <br />
          <b>Valor Online:</b>
          R$ {{ objectItem.valor_total.toFixed(2).replace(".", ",") }}
          <br />
          <b>Valor Faturado:</b>
          R$ {{ objectItem.valor_faturado.toFixed(2).replace(".", ",") }}
          <br />
          <b>Faturado em:</b>
          {{ objectItem.faturado_em }}
          <br />
          <br />
          <div v-for="saldo in pedidosSaldoDcInfo.array" :key="saldo.ynumero">
            <p>
              <b>Pedido:</b>
              {{ saldo.ynumero }}
              <br />
              <b>Status:</b>
              {{ alteraNomeStatus(saldo.ystatus) }}
              <br />
              <b>Valor:</b>
              R$ {{ saldo.yvaltot }}
            </p>
          </div>
          <br />
          <b>Total Fat/Conf:</b>
          {{
            (pedidosSaldoDcInfo.total + objectItem.valor_faturado)
              .toFixed(2)
              .replace(",", ",")
          }}
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text @click="showMenuStatus = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="objectItem.status_aluno == 'CONFERIDO'">
        <v-card-title class="headline font-weight-black"
          >Detalhes Conferencia</v-card-title
        >
        <v-card-text class="h6">
          <b>Pedido:</b>
          {{ objectItem.pedido_dcinfo }}
          <br />
          <b>Status:</b>
          {{ objectItem.status_aluno }}
          <br />
          <b>Valor:</b>
          R$ {{ objectItem.valor_faturado.toFixed(2).replace(".", ",") }}
          <br />
          <br />
          <div v-for="saldo in pedidosSaldoDcInfo" :key="saldo.ynumero">
            <p>
              <b>Pedido:</b>
              {{ saldo.ynumero }}
              <br />
              <b>Status:</b>
              {{ alteraNomeStatus(saldo.ystatus) }}
              <br />
              <b>Valor:</b>
              R$ {{ saldo.yvaltot }}
            </p>
          </div>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text @click="showMenuStatus = false">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!--- MENU BOTOES --->
    <v-menu
      v-model="showMenuBotoes"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="true"
      :close-on-click="true"
    >
      <v-list>
        <v-list-item
          v-if="
            objectItem.pagamento.status_pagamento == 'NÃƒO PAGO' &&
            objectItem.emitido == 0
          "
        >
          <v-btn small class="ma-1" color="success" @click="cobrar(objectItem)">
            Cobrar
            <v-icon dark right>far fa-thumbs-up</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.pagamento.status_pagamento == 'NÃƒO PAGO' &&
            objectItem.pagamento.tipo_pagamento == 'OUTROS' &&
            objectItem.emitido == 1
          "
        >
          <v-btn
            small
            class="ma-1"
            color="success"
            @click="confirmPago(objectItem)"
          >
            Marcar Como Pago
            <v-icon dark right>far fa-thumbs-up</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.pagamento.status_pagamento !== 'CANCELADO' &&
            objectItem.emitido == 0 &&
            objectItem.pagamento.tipo_pagamento != null &&
            objectItem.aluno.bloqueado != true
          "
        >
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="confirmBaixar(objectItem)"
          >
            Emitir
            <v-icon dark right>fa-download</v-icon>
          </v-btn>
          <!-- ajuste virus -->
          <!-- <v-btn
            small
            class="ma-1"
            color="primary"
            @click="emitirExcel(objectItem)"
          >
            Emitir Excel
            <v-icon dark right>fa-download</v-icon>
          </v-btn> -->
          <!-- ajuste virus -->
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.pagamento.status_pagamento !== 'CANCELADO' &&
            objectItem.emitido == 0
          "
        >
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="showItens(objectItem)"
          >
            Ver Itens
            <v-icon dark right>fa-clipboard-list</v-icon>
          </v-btn>
          <v-list-item
            v-if="
              (objectItem.emitido == 0 &&
                objectItem.pagamento.status_pagamento != 'RESERVADO') ||
              objectItem.status_aluno == 'CANCELADO'
            "
          >
          </v-list-item>
          <v-btn
            small
            class="ma-1"
            color="error"
            @click="confirmDelete(objectItem)"
          >
            Excluir
            <v-icon dark right>fa-trash-alt</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item v-if="objectItem.emitido == 1">
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="imprimirPedidoDcInfo(objectItem)"
          >
            Imprimir
            <v-icon dark right>fa-print</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="showItens(objectItem)"
          >
            Ver Itens
            <v-icon dark right>fas fa-list-ol</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.emitido == 1 &&
            objectItem.entregue == 0 &&
            objectItem.status_aluno == 'FATURADO'
          "
        >
          <v-btn
            small
            class="ma-1"
            color="warning"
            @click="showDialogEntrega($event, objectItem)"
          >
            Entregue
            <v-icon dark right>fa fa-check</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.emitido == 1 &&
            objectItem.entregue == 0 &&
            (objectItem.pagamento.status_pagamento == 'BOLETO PAGO' ||
              objectItem.pagamento.status_pagamento == 'NÃƒO PAGO') &&
            objectItem.status_aluno != 'CANCELADO'
          "
        >
          <v-btn
            small
            class="ma-1"
            color="error"
            @click="showDialogCancelar($event, objectItem)"
          >
            Cancelar
            <v-icon dark right>fa fa-times</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-if="
            objectItem.status_aluno != 'CANCELADO' && objectItem.emitido == 1
          "
        >
          <v-btn
            small
            class="ma-1"
            color="primary"
            @click="getEnderecoEntrega(objectItem)"
          >
            imprimir entrega
            <v-icon dark right>fas fa-print</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- MENU BOTOES -->
    <!-- MENU ANTIFRAUDE -->
    <v-menu
      v-model="showMenuAntifraude"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="false"
      :close-on-click="true"
      :nudge-width="200"
    >
      <v-card v-if="showMenuAntifraude">
        <v-card-title class="headline font-weight-black"
          >DecisÃ£o Antifraude <br />
          <v-chip
            class="mt-1 mb-1"
            :color="
              objectItem.pagamento.status_antifraude == 'APROVADO'
                ? 'success'
                : objectItem.pagamento.status_antifraude == 'ANALISAR'
                ? 'warning'
                : 'error'
            "
            text-color="white"
          >
            {{ objectItem.pagamento.status_antifraude }}
          </v-chip></v-card-title
        >
        <v-card-text>
          <b>CartÃ£o de CrÃ©dito</b>
          <br />
          <b>Banco:</b>
          {{ objectItem.credito.banco }}
          <br />
          <b>Parcelas:</b>
          {{ objectItem.credito.number_installments }}x
          <br />
          <b>Recebido em:</b>
          {{ objectItem.credito.authorized_at }}
          <br />
          <b>Frete:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_frete)
          }}
          <br />
          <b>Valor Pedido:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_total)
          }}
          <br />
          <div class="title font-weight-black">
            <b>Valor Total:</b>
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                objectItem.valor_total_final * (1 + objectItem.acrescimo / 100)
              )
            }}
            <b v-if="objectItem.acrescimo != 0">
              ({{ objectItem.acrescimo }}% de juros)</b
            >
          </div>

          <b>CPF:</b>
          {{
            objectItem.aluno.cpf == undefined
              ? ""
              : putMask(objectItem.aluno.cpf)
          }}
          <br />
          <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
          <br />
          <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
          {{ objectItem.aluno.sobrenome }}
          <br />
          <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
          <br />
          <b>Telefone Cadastro:</b>
          {{
            objectItem.aluno.celular == undefined
              ? ""
              : putMask(objectItem.aluno.celular, "celular")
          }}
          <br />

          <div
            v-if="
              objectItem.pagamento.parentesco != '' &&
              typeof objectItem.pagamento.parentesco != 'object'
            "
          >
            <b>Parentesco:</b> {{ objectItem.pagamento.parentesco }}
            <br />
            <b>Nome Titular:</b>
            {{
              objectItem.credito == null ? "" : objectItem.credito.nome_cartao
            }}
            <br />
            <b class="error--text">CLIENTE NÃƒO Ã‰ O TITULAR</b>
            <br />
          </div>
          <div v-else>
            <b class="success--text">CLIENTE Ã‰ O TITULAR</b>
            <br />
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            v-if="
              objectItem.pagamento.status_antifraude != 'RECUSADO' &&
              objectItem.pagamento.status_antifraude != 'FRAUDE'
            "
            text
            color="error"
            @click="
              showAlterarAntifraude(false);
              showMenuAntifraude = false;
            "
            >Recusar</v-btn
          >
          <v-btn
            v-if="objectItem.pagamento.status_antifraude != 'APROVADO'"
            text
            color="success"
            @click="
              showAlterarAntifraude(true);
              showMenuAntifraude = false;
            "
            >Aprovar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-menu>
    <!-- MENU ANTIFRAUDE -->
    <!-- MENUS DA TABELA -->
    <v-dialog v-model="dialogCancelarReserva" persistent max-width="400">
      <v-card>
        <v-card-title class="display-1 error--text">AtenÃ§Ã£o!</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="body-1 font-weight-black">
          <p>Deseja cancelar a reserva de pagamento?</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogCancelarReserva = false"
            >NÃ£o</v-btn
          >
          <v-btn color="success" text @click="cancelarReserva()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancelarPix" persistent max-width="400">
      <v-card>
        <v-card-title class="display-1 error--text">AtenÃ§Ã£o!</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="body-1 font-weight-black">
          <p>Deseja cancelar o PIX?</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogCancelarPix = false"
            >NÃ£o</v-btn
          >
          <v-btn color="success" text @click="cancelarPix()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogReserva" persistent max-width="400">
      <v-card>
        <v-card-title class="display-1 error--text">AtenÃ§Ã£o!</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="dialogReserva" class="body-1 font-weight-black">
          <p>Ã‰ isso mesmo que deseja fazer ?</p>
          <p v-if="typeof objectItem.credito.valor_cobrar == 'number'">
            VALOR A COBRAR: R$
            {{
              objectItem.credito.valor_cobrar
                .toFixed(2)
                .toString()
                .replace(".", ",")
            }}
          </p>
          <p v-else>
            VALOR A COBRAR: R$
            {{ objectItem.credito.valor_cobrar }}
          </p>
          <p>VALOR RESERVADO: R$ {{ objectItem.credito.amount }}</p>
          <p>PEDIDO: {{ objectItem.id_pedidos }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogReserva = false">NÃ£o</v-btn>
          <v-btn color="success" text @click="cobrarReserva()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRastreio" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">AtenÃ§Ã£o!</v-card-title>
        <v-card-text
          >Deseja realmente enviar o rastreio para o aluno ?</v-card-text
        >
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogRastreio = false">NÃ£o</v-btn>
          <v-btn color="success" text @click="enviarRastreio()">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPago" persistent max-width="300">
      <v-card>
        <v-card-title class="headline error--text">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>Deseja realmente marcar o pedido como PAGO?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogPago = false">NÃ£o</v-btn>
          <v-btn color="success" text @click="pagarPedido(objectItem)"
            >Sim</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogBaixar" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><span
            v-if="
              objectItem.pagamento.parentesco == '' ||
              typeof objectItem.pagamento.parentesco == 'object'
            "
            class="success--text"
          >
            Ã‰ O TITULAR</span
          >
          <span v-else class="error--text"> NÃƒO Ã‰ O TITULAR</span></v-card-title
        >
        <div
          v-if="
            objectItem.aluno.num_pedido > 1 &&
            (objectItem.pagamento.parentesco == '' ||
              typeof objectItem.pagamento.parentesco == 'object')
          "
        >
          <v-card-text
            ><h6>Deseja realmente enviar o pedido para o DC-INFO?</h6>
            <br />
            <b>CPF:</b>
            {{
              objectItem.aluno.cpf == undefined
                ? ""
                : putMask(objectItem.aluno.cpf)
            }}
            - {{ alunoReceita.situacao.descricao }}
            <br />
            <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
            <br />
            <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
            {{ objectItem.aluno.sobrenome }}
            <br />
            <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
            <br />
            <b>Telefone Cadastro:</b>
            {{
              objectItem.aluno.celular == undefined
                ? ""
                : putMask(objectItem.aluno.celular, "celular")
            }}
            <br />
            <div v-if="alunoReceita.nome != false">
              <b>Nome Receita Federal:</b> {{ alunoReceita.nome }}
              <br />
              <b>Data Nascimento Receita Federal:</b>
              {{ alunoReceita.nascimento }}
              <br />
            </div>
            <div v-else>
              <h5 class="error--text">CPF NÃƒO EXISTE</h5>
            </div>
            <b>Valor do Pedido:</b>
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(objectItem.valor_total * (1 + objectItem.acrescimo / 100)
              )
            }}
            <b v-if="objectItem.acrescimo != 0">
              ({{ objectItem.acrescimo }}% juros)</b
            >
            <br />
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" text @click="dialogBaixar = false">NÃ£o</v-btn>
            <v-btn color="success" text @click="baixarPedido(objectItem)"
              >Sim</v-btn
            >
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text id="printNovoCliente">
            <b>CPF:</b>
            {{
              objectItem.aluno.cpf == undefined
                ? ""
                : putMask(objectItem.aluno.cpf)
            }}
            - {{ alunoReceita.situacao.descricao }}
            <br />
            <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
            <br />
            <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
            {{ objectItem.aluno.sobrenome }}
            <br />
            <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
            <br />
            <b>Telefone Cadastro:</b>
            {{
              objectItem.aluno.celular == undefined
                ? ""
                : putMask(objectItem.aluno.celular, "celular")
            }}
            <br />
            <div v-if="alunoReceita.nome != false">
              <b>Nome Receita Federal:</b> {{ alunoReceita.nome }}
              <br />
              <b>Data Nascimento Receita Federal:</b>
              {{ alunoReceita.nascimento }}
              <br />
            </div>
            <div v-else>
              <h5 class="error--text">CPF NÃƒO EXISTE</h5>
            </div>
            <b>Valor do Pedido:</b>
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(objectItem.valor_total)
            }}
            <br />
            <div
              v-if="
                objectItem.pagamento.parentesco != '' &&
                typeof objectItem.pagamento.parentesco != 'object'
              "
            >
              <b>Parentesco:</b> {{ objectItem.pagamento.parentesco }}
              <br />
              <b>Nome Titular:</b>
              {{
                objectItem.credito == null ? "" : objectItem.credito.nome_cartao
              }}
              <br />
              <b>CLIENTE NÃƒO Ã‰ O TITULAR</b>
              <br />
            </div>
            <div v-else>
              <b>CLIENTE Ã‰ O TITULAR</b>
              <br />
            </div>
          </v-card-text>
          <v-btn
            style="width: 80%"
            block
            color="primary"
            @click="printAutorizacaoNovoCliente()"
          >
            Imprimir
            <v-icon right dark> fas fa-print </v-icon>
          </v-btn>
          <v-divider></v-divider>

          <v-text-field
            type="password"
            class="mx-auto"
            style="width: 50%"
            label="Senha de AutorizaÃ§Ã£o"
            v-model="senhaNovoCliente"
            @keypress.enter="novoCliente()"
          ></v-text-field>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="error"
              text
              @click="
                dialogBaixar = false;
                senhaNovoCliente = '';
                autorizacaoNovoCliente = false;
              "
              >Voltar</v-btn
            >
            <v-btn
              v-if="autorizacaoNovoCliente"
              color="success"
              text
              @click="
                baixarPedido(objectItem);
                senhaNovoCliente = '';
                autorizacaoNovoCliente = false;
              "
              >Emitir Pedido</v-btn
            >
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExcluir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline error--text">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>Deseja realmente excluir o pedido?</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialogExcluir = false">NÃ£o</v-btn>
          <v-btn color="error" text @click="excluirPedido(objectItem)"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogBaixarBoleto" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Data de Pagamento</span>
        </v-card-title>
        <v-card-text>
          <b>CPF:</b>
          {{
            objectItem.aluno.cpf == undefined
              ? ""
              : putMask(objectItem.aluno.cpf)
          }}
          - {{ alunoReceita.situacao.descricao }}
          <br />
          <b>Data Nascimento:</b> {{ objectItem.aluno.nascimento }}
          <br />
          <b>Nome Cadastro:</b> {{ objectItem.aluno.nome }}
          {{ objectItem.aluno.sobrenome }}
          <br />
          <b>Email Cadastro:</b> {{ objectItem.aluno.email }}
          <br />
          <b>Telefone Cadastro:</b>
          {{
            objectItem.aluno.celular == undefined
              ? ""
              : putMask(objectItem.aluno.celular, "celular")
          }}
          <br />
          <div v-if="alunoReceita.nome != false">
            <b>Nome Receita Federal:</b> {{ alunoReceita.nome }}
            <br />
            <b>Data Nascimento Receita Federal:</b>
            {{ alunoReceita.nascimento }}
            <br />
          </div>
          <div v-else>
            <h5 class="error--text">CPF NÃƒO EXISTE</h5>
          </div>
          <b>Valor do Pedido:</b>
          {{
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(objectItem.valor_total * (1 + objectItem.acrescimo / 100)
              )
            }}
            <b v-if="objectItem.acrescimo != 0">
              ({{ objectItem.acrescimo }}% juros)</b
            >
          <br />

          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    @keydown.enter.prevent="checkDataBoleto()"
                    v-model="dataBoleto"
                    v-mask="'##/##/####'"
                    :rules="[(v) => !!v.trim() || 'Data obrigatÃ³ria!']"
                    placeholder="dd/mm/aaaa"
                    label="Recebido em"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogBaixarBoleto = false"
            >Voltar</v-btn
          >
          <v-btn color="success" text @click="checkDataBoleto()">Emitir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modalComprovante" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">Comprovante</v-card-title>
        <div id="printComprovante">
          <v-card-text style="height: 750px">
            <div v-if="objectComprovante.pagamento.tipo_pagamento == 'BOLETO'">
              <h2 class="text-center">COMPROVANTE BOLETO PAGO</h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>NÃºmero Documento:</b>
                {{ objectComprovante.boleto.document_number }}
              </h5>
              <h5>
                <b>Nosso NÃºmero:</b>
                {{ objectComprovante.boleto.our_number }}
              </h5>
              <h5>
                <b>Pedido Online:</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total: R$</b>
                {{ objectComprovante.boleto.amount }}
              </h5>
              <h5>
                <b>Vencimento:</b>
                {{ objectComprovante.boleto.expiration_date }}
              </h5>
              <h5>
                <b>Pago em:</b>
                {{ objectComprovante.boleto.received_at }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="objectComprovante.pagamento.tipo_pagamento == 'CREDITO'"
            >
              <h2 class="text-center">
                COMPROVANTE
                <span v-if="objectComprovante.credito.status == 'CONFIRMED'"
                  >RESERVA PAGA</span
                >
                <span v-else-if="objectComprovante.credito.status == 'APPROVED'"
                  >CRÃ‰DITO PAGO</span
                >
                <span v-else>CANCELAMENTO</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                R$
                {{
                  objectComprovante.valor_total_final
                    .toFixed(2)
                    .replace(".", ",")
                }}
              </h5>
              <h5>
                <b>Bandeira:</b>
                {{ objectComprovante.credito.bandeira }} -
                {{ objectComprovante.credito.number_installments }}x
              </h5>
              <h5>
                <b>Banco:</b>
                {{ objectComprovante.credito.banco }}
              </h5>
              <h5>
                <b>AutorizaÃ§Ã£o:</b>
                {{ objectComprovante.credito.terminal_nsu }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.credito.acquirer_transaction_id }}
              </h5>
              <div v-if="objectComprovante.credito.status == 'CONFIRMED'">
                <h5>
                  <b>Reservado em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
                <h5>
                  <b>Cobrado em:</b>
                  {{ objectComprovante.credito.confirm_date }}
                </h5>
                <h5>
                  <b>Valor Cobrado:</b>
                  R$ {{ objectComprovante.credito.valor_cobrar }}
                </h5>
              </div>
              <div v-else-if="objectComprovante.credito.status == 'APPROVED'">
                <h5>
                  <b>Recebido em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
              </div>
              <div v-else>
                <h5>
                  <b>Reservado em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
                <h5>
                  <b>Cancelado em:</b>
                  {{ objectComprovante.credito.canceled_at }}
                </h5>
              </div>
            </div>
            <div
              style="width: 800px"
              v-if="
                objectComprovante.pagamento.tipo_pagamento == 'PIX' &&
                objectComprovante.pagamento.status_pagamento == 'PIX PAGO'
              "
            >
              <h2 class="text-center">
                <span>COMPROVANTE PIX PAGO</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(objectComprovante.pix.valor)
                }}
              </h5>

              <h5>
                <b>Banco:</b>
                {{ objectComprovante.pix.banco }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.pix.txid }}
              </h5>
              <h5>
                <b>Recebido em:</b>
                {{ objectComprovante.pix.pago_em }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="
                objectComprovante.pagamento.tipo_pagamento == 'PIX' &&
                objectComprovante.pagamento.status_pagamento == 'DEVOLVIDO'
              "
            >
              <h2 class="text-center">
                <span>COMPROVANTE ESTORNO PIX</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(objectComprovante.pix.valor)
                }}
              </h5>

              <h5>
                <b>Banco:</b>
                {{ objectComprovante.pix.banco }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.pix.txid }}
              </h5>
              <h5>
                <b>Recebido em:</b>
                {{ objectComprovante.pix.pago_em }}
              </h5>
              <h5>
                <b>Estornado em:</b>
                {{ $moment_format_time(objectComprovante.pix.devolvido_em) }}
              </h5>
            </div>
          </v-card-text>
          <hr
            style="
              border: 1px dashed #000 !important;
              width: 100%;
              margin: auto;
              margin-bottom: 10%;
            "
          />
          <v-card-text>
            <div v-if="objectComprovante.pagamento.tipo_pagamento == 'BOLETO'">
              <h2 class="text-center">COMPROVANTE BOLETO PAGO</h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>NÃºmero Documento:</b>
                {{ objectComprovante.boleto.document_number }}
              </h5>
              <h5>
                <b>Nosso NÃºmero:</b>
                {{ objectComprovante.boleto.our_number }}
              </h5>
              <h5>
                <b>Pedido Online:</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total: R$</b>
                {{ objectComprovante.boleto.amount }}
              </h5>
              <h5>
                <b>Vencimento:</b>
                {{ objectComprovante.boleto.expiration_date }}
              </h5>
              <h5>
                <b>Pago em:</b>
                {{ objectComprovante.boleto.received_at }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="objectComprovante.pagamento.tipo_pagamento == 'CREDITO'"
            >
              <h2 class="text-center">
                COMPROVANTE
                <span v-if="objectComprovante.credito.status == 'CONFIRMED'"
                  >RESERVA PAGA</span
                >
                <span v-else-if="objectComprovante.credito.status == 'APPROVED'"
                  >CRÃ‰DITO PAGO</span
                >
                <span v-else>CANCELAMENTO</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                R$
                {{
                  objectComprovante.valor_total_final
                    .toFixed(2)
                    .replace(".", ",")
                }}
              </h5>
              <h5>
                <b>Bandeira:</b>
                {{ objectComprovante.credito.bandeira }} -
                {{ objectComprovante.credito.number_installments }}x
              </h5>
              <h5>
                <b>Banco:</b>
                {{ objectComprovante.credito.banco }}
              </h5>
              <h5>
                <b>AutorizaÃ§Ã£o:</b>
                {{ objectComprovante.credito.terminal_nsu }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.credito.acquirer_transaction_id }}
              </h5>
              <div v-if="objectComprovante.credito.status == 'CONFIRMED'">
                <h5>
                  <b>Reservado em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
                <h5>
                  <b>Cobrado em:</b>
                  {{ objectComprovante.credito.confirm_date }}
                </h5>
                <h5>
                  <b>Valor Cobrado:</b>
                  R$ {{ objectComprovante.credito.valor_cobrar }}
                </h5>
              </div>
              <div v-else-if="objectComprovante.credito.status == 'APPROVED'">
                <h5>
                  <b>Recebido em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
              </div>
              <div v-else>
                <h5>
                  <b>Reservado em:</b>
                  {{ objectComprovante.credito.authorized_at }}
                </h5>
                <h5>
                  <b>Cancelado em:</b>
                  {{ objectComprovante.credito.canceled_at }}
                </h5>
              </div>
            </div>
            <div
              style="width: 800px"
              v-if="
                objectComprovante.pagamento.tipo_pagamento == 'PIX' &&
                objectComprovante.pagamento.status_pagamento == 'PIX PAGO'
              "
            >
              <h2 class="text-center">
                COMPROVANTE
                <span>PIX PAGO</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(objectComprovante.pix.valor)
                }}
              </h5>

              <h5>
                <b>Banco:</b>
                {{ objectComprovante.pix.banco }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.pix.txid }}
              </h5>
              <h5>
                <b>Recebido em:</b>
                {{ objectComprovante.pix.pago_em }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="
                objectComprovante.pagamento.tipo_pagamento == 'PIX' &&
                objectComprovante.pagamento.status_pagamento == 'DEVOLVIDO'
              "
            >
              <h2 class="text-center">
                <span>COMPROVANTE ESTORNO PIX</span>
              </h2>
              <br />
              <h3 class="text-center">{{ objectComprovante.pedido_dcinfo }}</h3>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ putMask(objectComprovante.aluno.cpf, "") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedidos }}
              </h5>
              <h5>
                <b>Total:</b>
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(objectComprovante.pix.valor)
                }}
              </h5>

              <h5>
                <b>Banco:</b>
                {{ objectComprovante.pix.banco }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{ objectComprovante.pix.txid }}
              </h5>
              <h5>
                <b>Recebido em:</b>
                {{ objectComprovante.pix.pago_em }}
              </h5>
              <h5>
                <b>Estornado em:</b>
                {{ $moment_format_time(objectComprovante.pix.devolvido_em) }}
              </h5>
            </div>
          </v-card-text>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="modalComprovante = false"
            >Voltar</v-btn
          >
          <v-btn @click="printComprovante()" color="success" text
            >Imprimir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEntrega" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Data da Entrega</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    @keydown.enter.prevent="marcarEntregue()"
                    v-model="objectItem.data_entrega"
                    v-mask="'##/##/####'"
                    placeholder="dd/mm/aaaa"
                    label="Entregue em"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogEntrega = false"
            >Voltar</v-btn
          >
          <v-btn color="success" text @click="marcarEntregue()">Entregue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancelar" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text class="headline">
          Deseja realmente cancelar o pedido?
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogCancelar = false"
            >Voltar</v-btn
          >
          <v-btn color="success" text @click="marcarCancelado()"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancelado" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text class="headline error--text">
          NÃ£o se esqueÃ§a de cancelar o pedido {{ objectItem.pedido_dcinfo }} no
          DC-INFO
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="error"
            text
            @click="
              getPedidos();
              dialogCancelado = false;
            "
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNumeroPedido" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline success--text">PEDIDO EMITIDO</span>
        </v-card-title>
        <v-card-text class="headline">
          {{ pedidoBaixado.result.GravaPedidoVendaDentalSolidentResult }}

          <div v-if="divEnderecoEntrega1" id="printEnderecoEntrega">
            <v-card-text>
              <h5><b>EndereÃ§o de Entrega</b></h5>
              <h5>
                <b>NÃºmero Pedido:</b> {{ this.enderecoEntrega.numero_pedido }}
              </h5>
              <h5>
                <b>NÃºmero Online:</b> {{ this.enderecoEntrega.numero_online }}
              </h5>
              <h5><b>Nome:</b> {{ this.enderecoEntrega.nome }}</h5>
              <h6><b>CPF:</b> {{ putMask(this.enderecoEntrega.cpf_aluno) }}</h6>
              <h5>
                <b>EndereÃ§o</b>: {{ this.enderecoEntrega.endereco }},
                {{ this.enderecoEntrega.numero }}
              </h5>
              <h5 v-if="enderecoEntrega.complemento">
                <b>Complemento:</b> {{ this.enderecoEntrega.complemento }}
              </h5>
              <h5><b>Bairro:</b> {{ this.enderecoEntrega.bairro }}</h5>
              <h5><b>Cep:</b> {{ this.enderecoEntrega.cep }}</h5>
              <h5><b>Cidade:</b> {{ this.enderecoEntrega.cidade }}</h5>
              <h5><b>Estado:</b> {{ this.enderecoEntrega.estado }}</h5>
            </v-card-text>
          </div>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            v-if="!divEnderecoEntrega1"
            color="success"
            text
            @click="dialogNumeroPedido = false"
            >Ok</v-btn
          >
          <v-btn
            v-if="divEnderecoEntrega1"
            @click="imprimirEnderecoEntrega()"
            color="success"
            text
            >Imprimir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMostrarEndereco" persistent max-width="600px">
      <v-card>
        <div v-if="divEnderecoEntrega2" id="printEndereco1">
          <v-card-text class="headline">
            <h5><b>EndereÃ§o de Entrega</b></h5>
            <h5>
              <b>NÃºmero Pedido:</b> {{ this.enderecoEntrega.numero_pedido }}
            </h5>
            <h5>
              <b>NÃºmero Online:</b> {{ this.enderecoEntrega.numero_online }}
            </h5>
            <h5><b>Nome:</b> {{ this.enderecoEntrega.nome }}</h5>
            <h6><b>CPF:</b> {{ putMask(this.enderecoEntrega.cpf_aluno) }}</h6>
            <h5>
              <b>EndereÃ§o</b>: {{ this.enderecoEntrega.endereco }},
              {{ this.enderecoEntrega.numero }}
            </h5>
            <h5 v-if="enderecoEntrega.complemento">
              <b>Complemento:</b> {{ this.enderecoEntrega.complemento }}
            </h5>
            <h5><b>Bairro:</b> {{ this.enderecoEntrega.bairro }}</h5>
            <h5><b>Cep:</b> {{ this.enderecoEntrega.cep }}</h5>
            <h5><b>Cidade:</b> {{ this.enderecoEntrega.cidade }}</h5>
            <h5><b>Estado:</b> {{ this.enderecoEntrega.estado }}</h5>
          </v-card-text>
        </div>
        <div v-if="divEnderecoEntrega3" id="printEndereco2">
          <v-card-text class="headline">
            <h5><b>EndereÃ§o de Entrega</b></h5>
            <h5>
              <b>NÃºmero Pedido:</b> {{ this.objEnderecoEntrega.pedido_dcinfo }}
            </h5>
            <h5>
              <b>NÃºmero Online:</b> {{ this.objEnderecoEntrega.id_pedidos }}
            </h5>
            <h5>
              <b>Nome:</b> {{ this.objEnderecoEntrega.nome }}
              {{ this.objEnderecoEntrega.sobrenome }}
            </h5>
            <h5><b>CPF:</b> {{ putMask(this.objEnderecoEntrega.cpf) }}</h5>
            <h5>
              <b>EndereÃ§o</b>: {{ this.objEnderecoEntrega.endereco }},
              {{ this.objEnderecoEntrega.numero }}
            </h5>
            <h5 v-if="objEnderecoEntrega.complemento">
              <b>Complemento:</b> {{ this.objEnderecoEntrega.complemento }}
            </h5>
            <h5><b>Bairro:</b> {{ this.objEnderecoEntrega.bairro }}</h5>
            <h5><b>Cep:</b> {{ this.objEnderecoEntrega.cep }}</h5>
            <h5><b>Cidade:</b> {{ this.objEnderecoEntrega.cidade }}</h5>
            <h5><b>Estado:</b> {{ this.objEnderecoEntrega.estado }}</h5>
          </v-card-text>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" text @click="dialogMostrarEndereco = false"
            >Voltar</v-btn
          >
          <v-btn
            v-if="divEnderecoEntrega2"
            @click="imprimirEnderecoEntrega()"
            color="success"
            text
            >Imprimir
          </v-btn>
          <v-btn
            v-if="divEnderecoEntrega3"
            @click="imprimirEnderecoEntrega()"
            color="success"
            text
            >Imprimir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogItens" persistent max-width="1200px">
      <v-card>
        <v-card-title>
          <span class="headline">Itens do Pedido - </span>
          <v-btn small class="ml-3 error" @click="dialogItens = false"
            >Voltar</v-btn
          >
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchItem"
            append-icon="fa-search"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headersItens"
          :items="itens"
          :search="searchItem"
          class="elevation-1"
          dense
          disable-sort
          disable-pagination
          fixed-header
          hide-default-footer
        >
          <template v-slot:item.descri_item="{ item }">
            <div
              :class="
                item.cod_item != 0 ? '' : 'text-center primary white--text'
              "
            >
              <span>{{ item.descri_item }}</span>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAntifraude" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text class="headline">
          Deseja realmente alterar o STATUS ANTIFRAUDE para
          <span :class="statusAntifraude ? 'success--text' : 'error--text'">{{
            statusAntifraude ? "APROVADO" : "RECUSADO"
          }}</span
          >?
          <br />
          <v-textarea
            label="Motivo"
            no-resize
            rows="3"
            v-model="motivo"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogAntifraude = false"
            >Voltar</v-btn
          >
          <v-btn color="success" text @click="alterarAntifraude()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      style="z-index: 0"
      scrollable
      v-model="dialogEmitirTodos"
      persistent
      max-width="1100px"
    >
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Pedidos Pendentes</span>
        </v-card-title>
        <v-card-text style="height: 500px" class="headline">
          <v-data-table
            v-model="selectedPedidosEmitir"
            :headers="headersPedidosEmitir"
            :items="pedidosEmitirTodos"
            item-key="id_pedidos"
            :single-select="false"
            show-select
            dense
            disable-sort
            disable-pagination
            fixed-header
            hide-default-footer
          >
            <template v-slot:item.pagamento="{ item }">
              <v-chip
                :color="colorStatusSistema(item.pagamento.status_pagamento)"
                dark
              >
                {{ item.pagamento.status_pagamento }}
              </v-chip>
            </template>
            <template v-slot:item.aluno="{ item }">
              {{ item.aluno.nome }} {{ item.aluno.sobrenome }}
            </template>
            <template v-slot:item.valor_total="{ item }">
              <div v-if="item.desconto_representantes">
                <div v-if="item.pagamento.tipo_pagamento == 'BOLETO'">
                  {{
                    $money_format(
                      item.valor_total_final -
                        item.valor_desconto -
                        (item.valor_total - item.valor_desconto) *
                          (item.boleto.desconto / 100)
                    )
                  }}
                </div>
                <div v-else-if="item.pagamento.tipo_pagamento == 'PIX'">
                  {{
                    $money_format(
                      item.valor_total_final -
                        item.valor_desconto -
                        (item.valor_total - item.valor_desconto) *
                          (item.pix.desconto_valor / 100)
                    )
                  }}
                </div>
                <div v-else>
                  {{ item.valor_total_final - item.valor_desconto }}
                </div>
              </div>
              <div v-else>
                <div v-if="item.pagamento.tipo_pagamento == 'PIX'">
                  {{
                    $money_format(
                      item.valor_total_final -
                        (item.valor_total - item.valor_desconto) *
                          (item.pix.desconto_valor / 100)
                    )
                  }}
                </div>
                <div v-else-if="item.pagamento.tipo_pagamento == 'BOLETO'">
                  {{
                    $money_format(
                      item.valor_total_final -
                        (item.valor_total - item.valor_desconto) *
                          (item.boleto.desconto / 100)
                    )
                  }}
                </div>
                <div v-else>
                  {{ $money_format(item.valor_total_final) }}
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogEmitirTodos = false"
            >Voltar</v-btn
          >
          <v-btn color="success" @click="emitirTodos()" text>Emitir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      style="z-index: 0"
      scrollable
      v-model="dialogEmitidos"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="headline success--text">Pedidos Emitidos</span>
          <div class="flex-grow-1"></div>
          <v-btn color="success" @click="gerarExcelEmitidos()">Excel</v-btn>
        </v-card-title>
        <v-card-text style="height: 500px" class="headline">
          <v-data-table
            :headers="headersEmitidos"
            :items="pedidosEmitidos"
            item-key="online"
            dense
            disable-sort
            disable-pagination
            fixed-header
            hide-default-footer
          >
            <template v-slot:item.valor_total="{ item }">
              {{ $money_format(item.valor_total) }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogEmitidos = false"
            >Voltar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showMenuImage" max-width="750px">
      <v-card>
        <img v-bind:src="`${urlImg}`" width="750" height="750" />
      </v-card>
    </v-dialog>

    <!-- ajuste virus  -->
    <v-dialog
      style="z-index: 0"
      v-model="dialogPedidoDCInfo"
      persistent
      max-width="550px"
    >
      <v-card>
        <v-card-title>
          <span class="headline success--text">Pedido DC Info</span>
        </v-card-title>
        <v-card-text class="headline">
          <v-row justify="center">
            <v-col cols="6">
              <v-text-field
                class="uppercase"
                v-model="numeroPedidoDCInfo"
                label="Insira o nÂ° DC Info!"
                filled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="6">
              <span>PEDIDO EM EXCEL</span>
            </v-col>
          </v-row>
          <v-row v-if="objPedidoDCInfo.credito != null" justify="center">
            <v-col cols="12">
              <span
                >Reserva ONLINE: {{ objPedidoDCInfo.credito.id_pedido }}</span
              ><br />
              <span>
                {{ objPedidoDCInfo.credito.bandeira }}
                {{ objPedidoDCInfo.credito.number_installments }}x Total:
                {{ objPedidoDCInfo.credito.amount }}</span
              ><br />
              <span
                >AutorizaÃ§Ã£o: {{ objPedidoDCInfo.credito.terminal_nsu }}</span
              ><br />
              {{ objPedidoDCInfo.credito.authorized_at }}
            </v-col>
          </v-row>
          <v-row v-if="objPedidoDCInfo.boleto != null" justify="center">
            <v-col cols="12">
              <span
                >ONLINE: {{ objPedidoDCInfo.boleto.id_pedido }} - R$:
                {{ objPedidoDCInfo.boleto.amount }}</span
              ><br />
              <span
                >BOLETO, NOSSO NUMERO:
                {{ objPedidoDCInfo.boleto.our_number }} </span
              ><br />
              <span>EMITIDO EM: {{ objPedidoDCInfo.boleto.issue_date }}</span
              ><br />
              <span
                >VENCIMENTO: {{ objPedidoDCInfo.boleto.expiration_date }}</span
              ><br />
              <span>RECEBIDO EM: {{ objPedidoDCInfo.boleto.received_at }}</span>
            </v-col>
          </v-row>
          <v-row v-if="objPedidoDCInfo.pix != null" justify="center">
            <v-col cols="12">
              <span
                >ONLINE: {{ objPedidoDCInfo.pix.id_pedido }} - R$:
                {{ objPedidoDCInfo.pix.valor }}</span
              ><br />
              <span>PIX RECEBIDO EM: {{ objPedidoDCInfo.pix.pago_em }}</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            :disabled="numeroPedidoDCInfo.length != 7"
            color="primary"
            text
            @click="emitirPedidoDCInfo(objPedidoDCInfo, numeroPedidoDCInfo)"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ajuste virus -->
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
  </v-container>
</template>
<script>
import { QVirtualScroll } from "quasar/dist/quasar.esm";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import ImprimirPedido from "./components/ImprimirPedido";
export default {
  components: {
    ImprimirPedido,
  },
  data: () => ({
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    loading: false,
    valid: true,
    validReserva: true,
    search: "",
    emitido: 0,
    entregue: 0,
    searchItem: "",
    selectedPedidosEmitir: [],
    headersPedidosEmitir: [
      {
        value: "id_pedidos",
        text: "Online",
      },
      {
        value: "aluno",
        text: "Aluno",
      },
      {
        value: "grupo",
        text: "Grupo",
      },
      {
        value: "valor_total",
        text: "Total",
      },
      {
        value: "pagamento",
        text: "Status Pagamento",
      },
    ],
    headersEmitidos: [
      {
        value: "online",
        text: "Online",
      },
      {
        value: "aluno",
        text: "Aluno",
      },
      {
        value: "grupo",
        text: "Grupo",
      },
      {
        value: "valor_total",
        text: "Total",
      },
      {
        value: "numero_dc_info",
        text: "Dc-Info",
      },
    ],
    headersItens: [
      {
        value: "qtd_item",
        text: "QTD",
      },
      {
        value: "descri_item",
        text: "DESCRIÃ‡ÃƒO",
      },
      {
        value: "marca_item",
        text: "MARCA",
      },
      {
        value: "cod_item",
        text: "CODIGO",
      },
    ],
    headers: [
      {
        name: "data_pedido",
        align: "center",
        label: "Data",
        sortable: true,
      },
      {
        name: "aluno",
        align: "center",
        label: "Aluno",
        sortable: true,
      },
      {
        name: "grupo",
        align: "center",
        label: "Grupo",
        sortable: true,
      },
      {
        name: "id_pedidos",
        align: "center",
        label: "Pedido",
        sortable: true,
      },
      {
        name: "valor_total",
        align: "center",
        label: "Valor Pedido",
        sortable: true,
      },
      {
        name: "desconto",
        align: "center",
        label: "Descontos",
        sortable: true,
      },
      {
        name: "valor_frete",
        align: "center",
        label: "Frete",
        sortable: true,
      },
      {
        name: "valor_total_final",
        align: "center",
        label: "Valor Total",
        sortable: true,
      },
      {
        name: "pagamento",
        align: "center",
        label: "Status Pagamento",
        sortable: true,
      },
      {
        name: "status_aluno",
        align: "center",
        label: "Status Sistema",
        sortable: true,
      },
      {
        name: "acao",
        align: "center",
        label: "AÃ§Ã£o",
        sortable: false,
      },
    ],
    pedido: 0,
    print: false,
    modalComprovante: false,
    dadosEndereco: {},
    motivo: "",
    statusAntifraude: false,
    dialogEmitirTodos: false,
    dialogEmitidos: false,
    dialogAntifraude: false,
    dialogExcluir: false,
    dialogBaixarBoleto: false,
    dialogBaixar: false,
    dialogPago: false,
    dialogRastreio: false,
    dialogReserva: false,
    dialogCancelarReserva: false,
    dialogCancelarPix: false,
    dialogEntrega: false,
    dialogCancelar: false,
    dialogCancelado: false,
    dialogNumeroPedido: false,
    dialogMostrarEndereco: false,
    divEnderecoEntrega1: false,
    divEnderecoEntrega2: false,
    divEnderecoEntrega3: false,
    objEnderecoEntrega: {},
    dialogItens: false,
    objectIndex: -1,
    objectItem: {
      aluno: {},
      credito: {},
      boleto: {},
      pagamento: { credito: {}, boleto: {} },
    },
    objectComprovante: {
      pagamento: {},
      credito: {},
      boleto: {},
      aluno: {},
      info_pagamento: {},
    },
    dataBoleto: "",
    menuFiltros: false,
    menuRelatorios: false,
    showSelectGrupo: false,
    showSelectStatus: false,
    selectedGrupo: [],
    selectedStatusPagamento: [],
    filteredPedidos: [],
    pedidosEmitirTodos: [],
    pedidosEmitidos: [],
    filtroAtivoGrupo: false,
    filtroAtivoStatus: false,
    filtroAtivoSistema: false,
    permissoes: {},
    showMenu: false,
    showMenuStatus: false,
    showMenuBotoes: false,
    showMenuAntifraude: false,
    x: 0,
    y: 0,
    senhaNovoCliente: "",
    autorizacaoNovoCliente: false,
    showMenuImage: false,
    x: 0,
    y: 0,
    urlImg: "",
    // ajuste virus
    dialogPedidoDCInfo: false,
    objPedidoDCInfo: {},
    numeroPedidoDCInfo: "",
    // ajuste virus
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
  },
  async mounted() {
    await this.getDatas();
    this.getPedidos();
  },
  computed: {
    ...mapGetters(["colorStatusSistema", "formatDateToExcel"]),
    ...mapState({
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      pedidos: (state) => state.pedidoAcademico.pedidos,
      pedidoBaixado: (state) => state.pedidoAcademico.pedido,
      itens: (state) => state.pedidoAcademico.itens,
      pagamento: (state) => state.pedidoAcademico.pagamento,
      getnet: (state) => state.pedidoAcademico.getnet,
      pedidoDcinfo: (state) => state.pedidoAcademico.pedidoDcinfo,
      pedidosSaldoDcInfo: (state) => state.pedidoAcademico.pedidosSaldoDcInfo,
      statusPedidoDcInfo: (state) => state.pedidoAcademico.statusPedidoDcInfo,
      itensPedidoDcinfo: (state) => state.pedidoAcademico.itensPedidoDcinfo,
      alunoReceita: (state) => state.pedidoAcademico.alunoReceita,
      enderecoEntrega: (state) => state.pedidoAcademico.endereco_entrega,
      financeiro_dcinfo: (state) => state.pedidoAcademico.financeiro_dcinfo,
      error: (state) => state.pedidoAcademico.error,
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
    grupos: function () {
      let data = [];
      for (const pedido of this.pedidos) {
        data.push(pedido.grupo);
      }
      return data;
    },
    statusPagamento: function () {
      let data = [];
      for (const pedido of this.pedidos) {
        data.push(pedido.pagamento.status_pagamento);
      }
      return data;
    },
  },
  methods: {
    ...mapActions([
      "getDatas",
      "get_pedidos",
      "get_pagamento",
      "post_pedido",
      "aprovar_reserva_academico",
      "cancelar_reserva_academico",
      "cancelar_pix_academico",
      "update_pagamento",
      "get_pedido_dcinfo",
      "get_info_pedido_saldo_dcinfo",
      "get_financeiro_dcinfo",
      "get_status_pedido_dcinfo",
      "get_itens_pedido_dcinfo",
      "get_itens",
      "marcar_entregue",
      "marcar_cancelado",
      "update_pagamento_retirada",
      "get_cpf_receita",
      "get_endereco_Entrega",
      "enviar_outros_cobranca",
      "save_obs_pagamento",
      // ajuste virus
      "emitir_pedido_DC_info",
      // ajuste virus
    ]),
    ...mapMutations(["empty_pedidosSaldoDcInfo", "set_alunoReceita"]),
    abrirBoletoC6(boleto) {
      const win = window.open("", "_blank");
      let html = "";

      html += "<html>";
      html += '<body style="margin:0!important">';
      html +=
        '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
        boleto +
        '" type="application/pdf" />';
      html += "</body>";
      html += "</html>";

      setTimeout(() => {
        win.document.write(html);
      }, 0);
    },
    async cobrar(row) {
      this.loading = true;
      await this.enviar_outros_cobranca(row.id_pedidos);
      this.loading = false;
      this.$router.push({
        name: "CobranÃ§a - Pagamento Parcial",
      });
    },
    async emitirTodos() {
      this.dialogEmitirTodos = false;
      this.loading = true;
      console.log("oba", this.selectedPedidosEmitir);
      this.$axios
        .post("/academico/pedido/baixarTodos", {
          dados: this.selectedPedidosEmitir,
        })
        .then((res) => {
          this.loading = false;
          this.selectedPedidosEmitir = [];
          if (res.data == false) {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else {
            console.log(res.data);
            this.pedidosEmitidos = res.data;
            this.dialogEmitidos = true;
            this.getPedidos();
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    showDialogEmitirTodos() {
      this.pedidosEmitirTodos = this.pedidos.filter(
        (p) => p.pagamento.tipo_pagamento != "CREDITO" && p.emitido != 1
      );
      this.dialogEmitirTodos = true;
    },
    async showItens(row) {
      this.loading = true;
      await this.get_itens(row.id_pedidos);
      this.dialogItens = true;
      this.loading = false;
    },
    novoCliente() {
      if (this.senhaNovoCliente == 681) {
        this.autorizacaoNovoCliente = true;
      } else {
        this.autorizacaoNovoCliente = false;
        this.showSnakerbar("Senha Incorreta", "warning");
      }
    },
    classWarning(row) {
      // VERIFICAR COM WOLF A NECESSIDADE
      // if (row.boleto != null) {
      //   if (row.boleto.amount < row.valor_total) {
      //     return "text-center warning-reservado";
      //   }
      // }

      if (row.credito != null) {
        if (row.pagamento.status_pagamento != "RESERVA PAGA") {
          if (
            parseFloat(row.credito.amount.replace(",", ".")) < row.valor_total
          ) {
            return "text-center warning-reservado";
          }
        }
      }
    },
    showDialogCancelar(e, row) {
      e.preventDefault();
      this.dialogCancelar = false;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.dialogCancelar = true;
      });
    },
    async marcarCancelado() {
      this.loading = true;
      await this.marcar_cancelado({
        id_pedido: this.objectItem.id_pedidos,
      });
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("Pedido Marcado Como Cancelado", "success", 3000);
      }
      this.loading = false;
      this.dialogCancelar = false;
      this.dialogCancelado = true;
    },
    showDialogEntrega(e, row) {
      e.preventDefault();
      this.dialogEntrega = false;
      this.objectItem = { ...row };
      var data = new Date(),
        dia = (data.getDate() - 1).toString(),
        diaF = dia.length == 1 ? "0" + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro comeÃ§a com zero.
        mesF = mes.length == 1 ? "0" + mes : mes,
        anoF = data.getFullYear();
      this.objectItem.data_entrega = diaF + "/" + mesF + "/" + anoF;
      this.$nextTick(() => {
        this.dialogEntrega = true;
      });
    },
    async marcarEntregue() {
      this.loading = true;
      await this.marcar_entregue({
        id_pedido: this.objectItem.id_pedidos,
        entregue_em: this.objectItem.data_entrega,
        entregue_por: this.$usuario.value.usuario,
      });
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("Pedido Marcado Como Entregue", "success", 3000);
      }
      this.loading = false;
      this.dialogEntrega = false;
      this.getPedidos();
    },
    show(e, row) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.showMenu = true;
      });
      if (this.objectItem.log_pagamento != null) {
        // se tiver pagamento cartao de credito recusado
        for (let log of this.objectItem.log_pagamento) {
          if (typeof log.obj_retorno != "object") {
            log.obj_retorno = JSON.parse(this.$crypto_decrypt(log.obj_retorno));
          }
        }
      }
    },
    showAntifraude(e, row) {
      e.preventDefault();
      this.showMenuAntifraude = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.showMenuAntifraude = true;
      });
    },
    showBotoes(e, row) {
      e.preventDefault();
      this.showMenuBotoes = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItem = { ...row };
      this.$nextTick(() => {
        this.showMenuBotoes = true;
      });
    },
    async showStatus(e, row) {
      e.preventDefault();
      if (row.status_aluno == "FATURADO" || row.status_aluno == "CONFERIDO") {
        this.loading = true;
        await this.getInfoPedidosSaldo(row.id_pedidos);
        await this.getStatusPedidoDcInfo(row);
        this.showMenuStatus = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.objectItem = { ...row };
        this.$nextTick(() => {
          this.showMenuStatus = true;
          this.loading = false;
        });
      } else if (
        this.emitido == 1 &&
        row.status_aluno != "CANCELADO" &&
        row.status_aluno != "RETIRADA"
      ) {
        this.loading = true;
        await this.getStatusPedidoDcInfo(row);
        this.loading = false;
      }
    },
    copy(val, index) {
      let query = "#" + val + "Copy" + index;
      let copy = document.querySelector(query);
      copy.setAttribute("type", "text");
      copy.select();
      try {
        let success = document.execCommand("copy");
        if (success) {
          this.showSnakerbar(val.toUpperCase() + " Copiado", "success", 2000);
        } else {
          this.showSnakerbar("Erro ao Copiar", "error");
        }
      } catch (error) {
        this.showSnakerbar(error, "error");
      }

      copy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    async getStatusPedidoDcInfo(row) {
      if (row.entregue == 0) {
        await this.get_status_pedido_dcinfo(row.pedido_dcinfo);
        row.status_aluno = this.alteraNomeStatus(
          this.statusPedidoDcInfo.ystatus
        );
        if (row.status_aluno == "CONFERIDO") {
          row.valor_faturado = parseFloat(this.statusPedidoDcInfo.yvaltot);
        }
      }
    },
    async getInfoPedidosSaldo(pedido) {
      this.empty_pedidosSaldoDcInfo();

      await this.get_info_pedido_saldo_dcinfo(pedido);
      console.log(this.pedidosSaldoDcInfo);
    },
    async imprimirItensPedidoDcInfo(row) {
      this.loading = true;

      await this.get_itens_pedido_dcinfo(row);

      this.loading = false;

      //monstrar modal com itens
    },
    async imprimirPedidoDcInfo(row) {
      this.loading = true;
      await this.get_pedido_dcinfo(row.pedido_dcinfo);
      this.loading = false;
      this.$htmlToPaper("print");
    },
    showComprovante(pedido) {
      console.log("pedido", pedido);
      this.objectComprovante = Object.assign({}, pedido);
      this.modalComprovante = true;
    },
    printComprovante() {
      this.$htmlToPaper("printComprovante");
      this.modalComprovante = false;
    },
    printAutorizacaoNovoCliente() {
      this.$htmlToPaper("printNovoCliente");
    },
    clearFilter(all) {
      this.filtroAtivoGrupo = "";
      this.filtroAtivoStatus = "";
      this.filtroAtivoSistema = "";
      this.selectedGrupo = [];
      this.selectedStatusPagamento = [];

      this.filteredPedidos = this.pedidos;
    },
    changeFilter() {
      console.log(this.selectedGrupo);
      if (
        this.selectedGrupo.length > 0 &&
        this.selectedStatusPagamento.length > 0
      ) {
        this.filteredPedidos = this.pedidos.filter(
          (p) =>
            this.selectedGrupo.includes(p.grupo) &&
            this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
        );
        this.filtroAtivoGrupo = this.selectedGrupo;
        this.filtroAtivoStatus = this.selectedStatusPagamento;
      } else if (this.selectedGrupo.length > 0) {
        this.filteredPedidos = this.pedidos.filter((p) =>
          this.selectedGrupo.includes(p.grupo)
        );
        this.filtroAtivoGrupo = this.selectedGrupo;
      } else if (this.selectedStatusPagamento.length > 0) {
        this.filteredPedidos = this.pedidos.filter((p) =>
          this.selectedStatusPagamento.includes(p.pagamento.status_pagamento)
        );
        this.filtroAtivoStatus = this.selectedStatusPagamento;
      } else {
        this.clearFilter();
      }
    },
    find() {
      if (this.search.length == 0) {
        if (
          this.filtroAtivoGrupo ||
          this.filtroAtivoStatus ||
          this.filtroAtivoSistema
        ) {
          this.changeFilter();
        } else {
          this.clearFilter();
        }
      }
      if (this.search && this.search.length >= 3) {
        let searchPedidoNome = [];
        let searchPedidoSobrenome = [];
        let searchPedidoCpf = [];
        let searchPedidoId = [];
        let searchPedidoDcinfo = [];
        let searchPedidoStatus = [];
        let searchPedidoStatusPagamento = [];
        let searchGrupo = [];

        if (this.search.length == 5) {
          searchPedidoId = this.pedidos.filter((i) =>
            i.id_pedidos.toString().includes(this.search)
          );
          if (searchPedidoId.length) {
            this.filteredPedidos = searchPedidoId;
          }
        } else {
          searchPedidoNome = this.pedidos.filter((i) =>
            i.aluno.nome.includes(this.search.toUpperCase())
          );
          if (searchPedidoNome.length) {
            this.filteredPedidos = searchPedidoNome;
          }

          searchPedidoSobrenome = this.pedidos.filter((i) =>
            i.aluno.sobrenome.includes(this.search.toUpperCase())
          );
          if (searchPedidoSobrenome.length) {
            this.filteredPedidos = searchPedidoSobrenome;
          }

          searchPedidoCpf = this.pedidos.filter((i) =>
            i.aluno.cpf.includes(this.search.toUpperCase())
          );
          if (searchPedidoCpf.length) {
            this.filteredPedidos = searchPedidoCpf;
          }

          searchPedidoDcinfo = this.pedidos.filter((i) => {
            if (i.pedido_dcinfo != null) {
              return i.pedido_dcinfo.includes(this.search.toUpperCase());
            }
          });
          if (searchPedidoDcinfo.length) {
            this.filteredPedidos = searchPedidoDcinfo;
          }

          searchPedidoStatus = this.pedidos.filter((i) =>
            i.status_aluno.includes(this.search.toUpperCase())
          );
          if (searchPedidoStatus.length) {
            this.filteredPedidos = searchPedidoStatus;
          }

          searchPedidoStatusPagamento = this.pedidos.filter((i) =>
            i.pagamento.status_pagamento.includes(this.search.toUpperCase())
          );
          if (searchPedidoStatusPagamento.length) {
            this.filteredPedidos = searchPedidoStatusPagamento;
          }

          searchGrupo = this.pedidos.filter((i) =>
            i.grupo.toUpperCase().includes(this.search.toUpperCase())
          );
          if (searchGrupo.length) {
            this.filteredPedidos = searchGrupo;
          }
        }
      }
    },
    confirmRastreio(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogRastreio = true;
    },
    enviarRastreio() {
      this.loading = true;
      this.$axios
        .post("/academico/pedido/rastreio", {
          pedido: this.objectItem,
        })
        .then((res) => {
          this.loading = false;
          this.dialogRastreio = false;
          console.log(res.data);
          if (res.data != false) {
            this.showSnakerbar("Rastreio Enviado com Sucesso", "success");
            this.getPedidos();
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    printInfo() {
      this.$htmlToPaper("print");
    },
    async getPagamento(item) {
      this.loading = true;
      await this.get_pagamento(item);
      this.loading = false;
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        if (this.pagamento.hasOwnProperty("boleto_html")) {
          // if (res.data.status == "EM ABERTO") {
          //   window.open(res.data.boleto_html, "_blank");
          // }
        }
      }
    },
    enviarEmailLink(item) {
      this.loading = true;
      this.$axios
        .post("/academico/pedido/emailLink", {
          pedido: item,
        })
        .then((res) => {
          this.loading = false;
          item.menuBoleto = false;
          item.menuLink = false;
          if (res.data) {
            this.showSnakerbar("Email Enviado com Sucesso!", "success", 2000);
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    confirmPago(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);

      this.dialogPago = true;
    },
    async confirmBaixar(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);

      if (typeof this.objectItem.aluno.obj_consulta_cpf_receita == "object") {
        this.loading = true;
        await this.get_cpf_receita(this.objectItem.aluno.cpf);
        this.loading = false;
        if (this.error) {
          this.showSnakerbar(
            "AtenÃ§Ã£o! Cliente Menor de Idade. Contate o Administrador informando o CPF",
            "warning"
          );
        } else {
          this.objectItem.aluno.obj_consulta_cpf_receita = this.alunoReceita;
          if (this.objectItem.pagamento.tipo_pagamento == "BOLETO") {
            this.dialogBaixarBoleto = true;
          } else {
            this.dialogBaixar = true;
          }
        }
      } else {
        this.set_alunoReceita(
          JSON.parse(this.objectItem.aluno.obj_consulta_cpf_receita)
        );
        if (this.objectItem.pagamento.tipo_pagamento == "BOLETO") {
          this.dialogBaixarBoleto = true;
        } else {
          this.dialogBaixar = true;
        }
      }
      this.objectItem.alunoReceita = this.alunoReceita;
    },
    checkDataBoleto() {
      if (this.$refs.form.validate()) {
        this.objectItem.pagamento.received_at = this.dataBoleto;
        this.baixarPedido(this.objectItem);
        this.dialogBaixarBoleto = false;
      }
    },
    checkValorCobrar() {
      if (this.objectItem.credito.valor_cobrar == "0") {
        this.showSnakerbar("Obrigatorio Preencher o Valor a Cobrar", "warning");
      } else {
        this.dialogReserva = true;
      }
    },
    async cobrarReserva() {
      this.loading = true;
      this.dialogReserva = false;
      await this.aprovar_reserva_academico(this.objectItem.credito);

      if (!this.error) {
        this.objectItem.credito.getnet = this.getnet;
        this.objectItem.credito.tipo = "COBRAR";

        await this.update_pagamento(this.objectItem.credito);
        let horaAjustada =
          parseInt(this.getnet.credit_confirm.confirm_date.substring(11, 13)) -
          3;
        this.objectItem.credito.status = this.getnet.status;
        this.objectItem.credito.amount =
          this.objectItem.credito.valor_cobrar * 100;
        this.objectItem.credito.confirm_date =
          this.getnet.credit_confirm.confirm_date.substring(8, 10) +
          "/" +
          this.getnet.credit_confirm.confirm_date.substring(5, 7) +
          "/" +
          this.getnet.credit_confirm.confirm_date.substring(0, 4) +
          " " +
          horaAjustada +
          ":" +
          this.getnet.credit_confirm.confirm_date.substring(14, 16) +
          ":" +
          this.getnet.credit_confirm.confirm_date.substring(17, 19);

        this.showSnakerbar("CobranÃ§a Realizada!", "success");
        this.getPedidos();
        this.showComprovante(this.objectItem);

        //this.modalComprovante = true;
      } else {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      }
      this.loading = false;
    },
    async cancelarPix() {
      this.loading = true;
      this.dialogCancelarPix = false;
      this.objectItem.pix.academico = true;
      await this.cancelar_pix_academico(this.objectItem.pix);
      if (!this.error) {
        this.objectItem.pix.cancelado = this.pix_cancelado;

        await this.marcar_cancelado({
          id_pedido: this.objectItem.id_pedidos,
        });

        this.showSnakerbar("Pix Cancelado!", "success");
        this.getPedidos();
        this.showComprovante(this.objectItem);
      } else {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      }

      this.loading = false;
    },
    async cancelarReserva() {
      this.loading = true;
      this.dialogCancelarReserva = false;
      await this.cancelar_reserva_academico(this.objectItem.credito);
      if (!this.error) {
        this.objectItem.credito.getnet = this.getnet;
        this.objectItem.credito.tipo = "CANCELAR";

        await this.update_pagamento(this.objectItem.credito);

        let horaAjustada =
          parseInt(this.getnet.credit_cancel.canceled_at.substring(11, 13)) - 3;

        this.objectItem.credito.canceled_at =
          this.getnet.credit_cancel.canceled_at.substring(8, 10) +
          "/" +
          this.getnet.credit_cancel.canceled_at.substring(5, 7) +
          "/" +
          this.getnet.credit_cancel.canceled_at.substring(0, 4) +
          " " +
          horaAjustada +
          ":" +
          this.getnet.credit_cancel.canceled_at.substring(14, 16) +
          ":" +
          this.getnet.credit_cancel.canceled_at.substring(17, 19);

        this.showSnakerbar("Reserva Cancelada!", "success");
        this.getPedidos();
        this.showComprovante(this.objectItem);
      } else {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      }

      this.loading = false;
    },
    imprimir() {
      //this.dialogPrint = false;
      //this.print = true;
      this.$htmlToPaper("print");
    },
    async pagarPedido(item) {
      this.dialogPago = false;

      this.loading = true;
      await this.update_pagamento_retirada(item);
      this.loading = false;
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("Pedido Marcado Como Pago!", "success");
      }

      this.getPedidos();
    },
    async baixarPedido(item) {
      this.dialogBaixar = false;

      console.log(item);

      this.loading = true;
      item.usuario = this.$usuario.value.usuario;
      await this.post_pedido(item);
      this.loading = false;
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        let resposta = false;
        if (this.pedidoBaixado.hasOwnProperty("dadosEndereco")) {
          resposta = this.pedidoBaixado.dadosEndereco;
        }
        let pedido =
          this.pedidoBaixado.result.GravaPedidoVendaDentalSolidentResult;

        if (typeof this.pedidoBaixado == "object") {
          console.log(this.pedidoBaixado);

          if (resposta != false) {
            this.dadosEndereco = resposta;
            // tem endereÃ§o de entrega, salvar no store pra tambem imprimir junto com o pedido
          }
          //this.$htmlToPaper("print");
          // mostral modal com o numero do pedido
          this.dialogNumeroPedido = true;
          if (Object.keys(this.enderecoEntrega).length) {
            this.divEnderecoEntrega1 = true;
          } else {
            this.divEnderecoEntrega1 = false;
          }
        } else {
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        }
        this.getPedidos();
      }
    },
    imprimirEnderecoEntrega() {
      if (this.divEnderecoEntrega1) {
        this.$htmlToPaper("printEnderecoEntrega");
        this.divEnderecoEntrega1 = false;
      } else {
        if (this.divEnderecoEntrega2) {
          this.$htmlToPaper("printEndereco1");
        } else {
          this.$htmlToPaper("printEndereco2");
        }
      }
    },
    async getEnderecoEntrega(row) {
      console.log("row", row);
      this.loading = true;
      await this.get_endereco_Entrega(row.aluno.cpf);
      this.loading = false;

      this.dialogMostrarEndereco = true;
      if (Object.keys(this.enderecoEntrega).length) {
        this.divEnderecoEntrega2 = true;
        this.divEnderecoEntrega3 = false;
      } else {
        row.aluno.pedido_dcinfo = row.pedido_dcinfo;
        row.aluno.id_pedidos = row.id_pedidos;
        this.objEnderecoEntrega = Object.assign({}, row.aluno);
        this.divEnderecoEntrega3 = true;
        this.divEnderecoEntrega2 = false;
      }
    },
    confirmDelete(item) {
      this.objectIndex = this.pedidos.indexOf(item);
      this.objectItem = Object.assign({}, item);
      this.dialogExcluir = true;
    },
    excluirPedido(item) {
      this.dialogExcluir = false;
      this.loading = true;
      this.$axios
        .delete("/academico/pedido", {
          data: {
            id: this.objectItem.id_pedidos,
            usuario: this.$usuario.value.usuario,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data != false) {
            this.loading = false;
            this.showSnakerbar("Pedido Excluido!", "success");
            this.getPedidos();
          } else {
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnakerbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    showAlterarAntifraude(status) {
      this.motivo = "";
      this.statusAntifraude = status;
      this.dialogAntifraude = true;
    },
    alterarAntifraude() {
      // FAZ A CHAMADA PARA O SERVIDOR

      if (this.motivo.trim() == "") {
        this.showSnakerbar("O Motivo Ã© obrigatÃ³rio", "error");
      } else {
        this.loading = true;
        this.$axios
          .post("/academico/pedido/alterar_antifraude", {
            dados: {
              id: this.objectItem.id_pedidos,
              statusAntifraude: this.statusAntifraude,
              motivo: this.motivo,
              usuario: this.$usuario.value.usuario,
            },
          })
          .then((res) => {
            this.loading = false;
            if (res.data != false) {
              this.loading = false;
              this.showSnakerbar("Status Alterado!", "success");
              this.getPedidos();
            } else {
              this.showSnakerbar(
                "Erro no Servidor, Contate o Administrador",
                "error"
              );
            }
            this.dialogAntifraude = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
            this.showSnakerbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          });
      }
    },
    copyLink() {
      let copy = document.querySelector("#linkCopy");
      copy.setAttribute("type", "text");
      copy.select();
      try {
        let success = document.execCommand("copy");
        this.msgSnackbar = success ? "Link Copiado" : "Erro ao Copiar";
        this.typeSnackbar = "success";
        this.snackbar = true;
        this.timeSnackbar = 2000;
      } catch (error) {
        this.msgSnackbar = error;
        this.typeSnackbar = "danger";
        this.snackbar = true;
        this.timeSnackbar = 2000;
      }

      copy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    putMask(item, type) {
      if (type == "celular") {
        if (item != null) {
          item = item.replace(/\D/g, "");
        }
        return this.$mask.apply(item, "(00) 0 0000-0000");
      } else {
        if (item.length < 14) {
          return this.$mask.apply(item, "000.000.000-00");
        } else {
          return this.$mask.apply(item, "00.000.000/0000-00");
        }
      }
    },
    getEntregue() {
      if (this.entregue == 1) {
        this.entregue = 0;
      } else {
        this.entregue = 1;
      }
      this.getPedidos();
    },
    async getPedidos() {
      this.loading = true;
      this.search = "";
      await this.get_pedidos({
        de: this.data_de,
        ate: this.data_ate,
        emitido: this.emitido,
        entregue: this.entregue,
        limite: 5000,
        usuario: this.$usuario.value.id,
      });
      this.loading = false;
      console.log(this.pedidos);
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.filteredPedidos = this.pedidos;
      }
    },
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
    gerarExcelEmitidos() {
      this.loading = true;
      let pedidos = this.pedidosEmitidos;
      // let pedidos = [{
      //   online: '123',
      //   aluno: 'edgar',
      //   grupo: 'sadad',
      //   valor_total: 1234.5,
      //   numero_dc_info: '225412A'
      // },
      // {
      //   online: '124',
      //   aluno: 'edgar',
      //   grupo: 'sadad',
      //   valor_total: 34.5,
      //   numero_dc_info: '225413A'
      // }]//
      const jsonKeys = Object.keys(pedidos[0]);
      let objectMaxLength = [];
      for (let i = 0; i < pedidos.length; i++) {
        let value = pedidos[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(pedidos);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 9 }; // tamanho da coluna para data
      ws["!cols"][1] = { wch: 30 };
      ws["!cols"][2] = { wch: 12 };
      ws["!cols"][3] = { wch: 9 }; // tamanho da coluna para data
      ws["!cols"][4] = { wch: 12 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "pedidos_emitidos"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "pedidos_emitidos.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      this.loading = false;
    },
    async excelFinanceiro() {
      await this.getPedidos();
      this.loading = true;
      let pedidos = this.filteredPedidos;
      let pedidos_financeiro = [];
      for (let pedido of pedidos) {
        if (
          (pedido.status_aluno == "FATURADO" ||
            pedido.status_aluno == "CONFERIDO") &&
          (pedido.pagamento.status_pagamento == "RESERVA PAGA" ||
            pedido.pagamento.status_pagamento == "BOLETO PAGO")
        ) {
          let aux = pedido.pedido_dcinfo
            ? pedido.pedido_dcinfo.slice(0, -1)
            : "";
          let res = await this.$axios.get(
            "http://192.168.0.200:36730/dc-info/API/pedido?pedido=" + aux
          );
          console.log("oporra", res.data);
          pedidos_financeiro.push(res.data);
        }
      }

      //await this.get_financeiro_dcinfo(numeroPedidos);
      //console.log("ooprra", this.financeiro_dcinfo);

      let json = [];
      for (let item of pedidos) {
        let obj = {};
        let valor_boleto = 0,
          valor_cartao = 0;
        if (
          (item.status_aluno == "FATURADO" ||
            item.status_aluno == "CONFERIDO") &&
          (item.pagamento.status_pagamento == "RESERVA PAGA" ||
            item.pagamento.status_pagamento == "BOLETO PAGO")
        ) {
          obj.data = this.formatDateToExcel(
            item.data_pedido + " " + item.hora_pedido
          );
          obj.data_emitido = this.formatDateToExcel(
            item.data_pedido_dcinfo + " 06:00:00"
          );

          obj.on_line = item.id_pedidos;
          obj.dc_info = item.pedido_dcinfo;
          obj.status_sistema = item.status_aluno;
          obj.valor_pedido = parseFloat(item.valor_total);
          obj.desconto_aplicado = 0;
          obj.valor_recebido = 0;
          obj.valor_conf_fat = parseFloat(item.valor_faturado).toFixed(2);
          obj.a_receber = 0;
          obj.total_saldo = 0;
          for (let financeiro of pedidos_financeiro) {
            if (financeiro.length >= 2) {
              // [`interpolated-${c}`]: true, // dynamic property + interpolation
              // Ã© array
              if (item.pedido_dcinfo == financeiro[0].yNumero.trim()) {
                obj.valor_conf_fat = parseFloat(financeiro[0].yValTot);
                obj.valor_conf_fat = obj.valor_conf_fat.toFixed(2);
                obj.total_saldo = 0;
                let letra = "";
                let index = 0;
                for (let fin of financeiro) {
                  if (index >= 1) {
                    switch (index) {
                      case 1:
                        letra = "B";
                        break;
                      case 2:
                        letra = "C";
                        break;
                      case 3:
                        letra = "D";
                        break;
                      case 4:
                        letra = "E";
                        break;
                      case 5:
                        letra = "F";
                        break;
                      case 6:
                        letra = "G";
                        break;
                      case 7:
                        letra = "H";
                        break;

                      default:
                        letra = "SALDO";
                    }
                    obj[`VALOR-PEDIDO-${letra}`] = parseFloat(fin.yValTot);
                    obj[`PEDIDO-${letra}-STATUS`] = this.alteraNomeStatus(
                      fin.yStatus.toString()
                    );
                    obj.total_saldo += parseFloat(fin.yValTot);
                  }
                  index++;
                }
              }
            } else {
              if (item.pedido_dcinfo == financeiro.yNumero) {
                obj.valor_conf_fat = parseFloat(financeiro.yValTot);
                obj.valor_conf_fat = obj.valor_conf_fat.toFixed(2);
              }
            }
          }

          // obj.nome = item.aluno.nome + " " + item.aluno.sobrenome;
          // obj.cpf = item.aluno.cpf;
          // obj.grupo = item.grupo;
          // obj.status_pgto = item.pagamento.status_pagamento;

          // obj.faturado_em = this.formatDateToExcel(
          //   item.faturado_em + " 06:00:00"
          // );
          if (item.credito != null) {
            if (item.credito.status == "CONFIRMED") {
              valor_cartao = parseFloat(
                item.credito.amount.toString().replace(",", ".")
              );
            }
          } else if (item.boleto != null) {
            if (item.boleto.status == "PAGO") {
              valor_boleto = parseFloat(
                item.boleto.amount.toString().replace(",", ".")
              );
              obj.desconto_aplicado = item.boleto.desconto;
            }
          }

          obj.valor_recebido = parseFloat(valor_cartao + valor_boleto);
          obj.valor_recebido = obj.valor_recebido.toFixed(2);
          obj.a_receber = parseFloat(
            (
              parseFloat(obj.valor_conf_fat) -
              parseFloat(obj.valor_recebido) +
              obj.total_saldo
            ).toFixed(2)
          );

          if (obj.a_receber < 1 && obj.a_receber > 0) {
            obj.a_receber = 0.0;
          }

          json.push(obj);
        }
      }
      const jsonKeys = Object.keys(json[0]);
      let objectMaxLength = [];
      for (let i = 0; i < json.length; i++) {
        let value = json[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(json, { dateNF: "DD/MM/YYYY" });
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 12 }; // tamanho da coluna para data
      // ws["!cols"][2] = { wch: 9 };
      ws["!cols"][11] = { wch: 17 }; // tamanho da coluna para data
      ws["!cols"][22] = { wch: 17 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_financeiro"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_financeiro.xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      this.loading = false;
    },
    async excel(tipo) {
      this.loading = true;
      let json = [];

      await this.getPedidos();
      let pedidos = this.filteredPedidos;
      if (tipo == "reserva_paga") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("RESERVA PAGA")
        );
      } else if (tipo == "reservado") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("RESERVADO")
        );
      } else if (tipo == "boleto_em_aberto") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("EM ABERTO")
        );
      } else if (tipo == "boleto_pago") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("BOLETO PAGO")
        );
      } else if (tipo == "pago") {
        pedidos = pedidos.filter((p) =>
          p.pagamento.status_pagamento.includes("CREDITO PAGO")
        );
      }
      // else {
      for (let item of pedidos) {
        console.log("excel", item);
        let obj = {};

        obj.data = this.formatDateToExcel(
          item.data_pedido + " " + item.hora_pedido
        );
        obj.data_emitido = this.formatDateToExcel(
          item.data_pedido_dcinfo + " 06:00:00"
        );
        obj.on_line = item.id_pedidos;
        obj.dc_info = item.pedido_dcinfo;
        obj.nome = item.aluno.nome + " " + item.aluno.sobrenome;
        obj.cpf = item.aluno.cpf;
        obj.celular = item.aluno.celular;
        obj.grupo = item.grupo;
        obj.valor_pedido = parseFloat(item.valor_total);
        obj.valor_boleto = 0;
        obj.valor_cobrado = 0;
        obj.status_pgto = item.pagamento.status_pagamento;
        obj.status_sistema = item.status_aluno;
        obj.valor_conf_fat = item.valor_faturado;
        obj.faturado_em = this.formatDateToExcel(
          item.faturado_em + " 06:00:00"
        );
        if (item.credito != null) {
          if (item.credito.status == "CONFIRMED") {
            obj.data_cobranca = this.formatDateToExcel(
              item.credito.confirm_date
            );
            obj.valor_cobrado = item.credito.amount;
            obj.banco = item.credito.banco;
            obj.parcelas =
              item.credito.bandeira +
              " - " +
              item.credito.number_installments +
              "x";
            obj.autorizacao = item.credito.terminal_nsu;
            obj.n_comprovante = item.credito.acquirer_transaction_id;
          } else if (item.credito.status == "AUTHORIZED") {
            obj.banco = item.credito.banco;
            obj.parcelas =
              item.credito.bandeira +
              " - " +
              item.credito.number_installments +
              "x";
            obj.autorizacao = item.credito.terminal_nsu;
            obj.n_comprovante = item.credito.acquirer_transaction_id;
          }
        } else if (item.boleto != null) {
          obj.banco = item.boleto.banco;
          if (item.boleto.status == "PENDING") {
          } else if (item.boleto.status == "PAGO") {
            obj.valor_boleto = item.boleto.amount;
            obj.documento = item.boleto.document_number;
            obj.nosso_numero = item.boleto.our_number;
            obj.desconto_aplicado = item.boleto.desconto;
            obj.emitido_em = this.formatDateToExcel(item.boleto.issue_date);
            obj.vencimento_em = this.formatDateToExcel(
              item.boleto.expiration_date
            );
            obj.recebido_em = this.formatDateToExcel(item.boleto.received_at);
          }
        } else if (item.pix != null) {
          obj.banco = item.pix.banco;
        }

        json.push(obj);
      }
      // }

      this.loading = false;

      const jsonKeys = Object.keys(json[0]);
      let objectMaxLength = [];
      for (let i = 0; i < json.length; i++) {
        let value = json[i];
        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(json, { dateNF: "DD/MM/YYYY" });
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 12 }; // tamanho da coluna para data
      // ws["!cols"][2] = { wch: 9 };
      ws["!cols"][11] = { wch: 17 }; // tamanho da coluna para data
      ws["!cols"][22] = { wch: 17 }; // tamanho da coluna para data

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "relatorio_" + tipo); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, "relatorio_" + tipo + ".xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
    },

    alteraNomeStatus(status) {
      let retorno = "";
      switch (status) {
        case "2":
          retorno = "EMITIDO";
          break;
        case "3":
          retorno = "EMITIDO";
          break;
        case "13":
          retorno = "SEPARANDO";
          break;
        case "17":
          retorno = "SEPARADO"; //PARCIAL
          break;
        case "8":
          retorno = "SEPARADO";
          break;
        case "14":
          retorno = "CONFERINDO";
          break;
        case "11":
          retorno = "PAUSADO"; // pausado
          break;
        case "9":
          retorno = "CONFERIDO";
          break;
        case "4":
          retorno = "FATURADO";
          break;
        case "10":
          retorno = "CANCELADO";
          break;
        case "1":
          retorno = "PENDENTE";
          break;
        case "7":
          retorno = "SALDO";
          break;

        default:
          break;
      }

      return retorno;
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "pedidos",
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

      this.urlImg = "https://picsum.photos/510/300?random";
      // this.urlImg = this.getUrl(img);

      this.$nextTick(() => {
        this.showMenuImage = true;
      });
    },
    // getUrl(img) {
    //   return require('@/assets/produtos/' +img
    //   );
    // },
    async salvarObsPagamento(data) {
      let obj = {
        id: data.id_pagamento,
        observacao: data.observacao,
      };
      await this.save_obs_pagamento(obj);

      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("ObservaÃ§Ã£o salva!", "success");
        this.showMenu = false;
      }
    },
    //  ajuste virus
    async emitirExcel(row) {
      this.objPedidoDCInfo = row;
      // console.log("oi",row);
      this.loading = true;
      await this.get_itens(row.id_pedidos);

      let itensPedido = this.itens.filter((item) => item.cod_item != 0);
      let json = [];
      let nomeAluno = row.aluno.nome.trim() + " " + row.aluno.sobrenome.trim();
      let nomeExcel = row.aluno.grupo + " - " + nomeAluno;
      var number = 1;
      json.push({
        item: "",
        qtd: "",
        descricao: nomeAluno.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.grupo,
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: "ISENTO",
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        ),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.email
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.celular.substring(0, 2),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.celular.slice(2),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.telefone.substring(0, 2),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.telefone.slice(2),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.cep,
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.endereco
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.numero,
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.complemento
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.bairro
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.cidade
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      json.push({
        item: "",
        qtd: "",
        descricao: row.aluno.estado
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        marca: "",
        unitario: "",
        total: "",
        codigo: "",
      });
      for (let item of itensPedido) {
        let obj = {};
        obj.item = number++;
        obj.qtd = parseInt(item.qtd_item);
        obj.descricao = item.descri_item
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (item.marca_item != null) {
          obj.marca = item.marca_item
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        } else {
          obj.marca = item.marca_item;
        }
        obj.unitario = item.valor_item;
        obj.total = parseInt(item.qtd_item) * parseFloat(item.valor_item);
        obj.codigo = item.cod_item;

        json.push(obj);
      }
      const jsonKeys = Object.keys(json[0]);

      let objectMaxLength = [];
      for (let i = 0; i < json.length; i++) {
        let value = json[i];

        for (let j = 0; j < jsonKeys.length; j++) {
          if (value[jsonKeys[j]] != null) {
            if (typeof value[jsonKeys[j]] == "number") {
              objectMaxLength[j] = 10;
            } else {
              const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

              objectMaxLength[j] =
                objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
          }
        }

        let key = jsonKeys;
        for (let j = 0; j < key.length; j++) {
          objectMaxLength[j] =
            objectMaxLength[j] >= key[j].length
              ? objectMaxLength[j]
              : key[j].length;
        }
      }

      const wscols = objectMaxLength.map((w) => {
        return { width: w };
      });

      var ws = this.$XLSX.utils.json_to_sheet(json);
      ws["!cols"] = wscols;
      ws["!cols"][0] = { wch: 10 }; // tamanho da coluna para qtd
      ws["!cols"][1] = { wch: 20 }; // tamanho da coluna para codigo
      ws["!cols"][2] = { wch: 60 }; // tamanho da coluna para descricao
      ws["!cols"][3] = { wch: 30 }; // tamanho da coluna para marca
      ws["!cols"][4] = { wch: 10 }; // tamanho da coluna para unitario
      ws["!cols"][4] = { wch: 10 }; // tamanho da coluna para total

      var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel

      this.$XLSX.utils.book_append_sheet(wb, ws, "pedido_teste"); // sheetAName is name of Worksheet

      this.$XLSX.writeFile(wb, nomeExcel + ".xlsx", {
        cellDates: true,
        bookType: "xlsx",
      }); // name of the file is 'book.xlsx'
      this.loading = false;
      this.dialogPedidoDCInfo = true;
    },
    async emitirPedidoDCInfo(data, numeroDCInfo) {
      data.pedido_dcinfo = numeroDCInfo;
      data.usuario = this.$usuario.value.usuario;
      await this.emitir_pedido_DC_info(data);
      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        this.showSnakerbar("Pedido Emitido com sucesso!", "success");
        this.dialogPedidoDCInfo = false;
        this.objPedidoDCInfo = {};
        this.numeroPedidoDCInfo = "";
        this.getPedidos();
      }
    },
    // ajuste virus
  },
};
</script>
<style>
.v-text-field__prefix {
  padding: 4px 4px 8px !important;
  color: #000000 !important;
}
.warning-conferido {
  background: rgb(2, 0, 36) !important;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 87%,
    rgba(250, 247, 0, 1) 87%
  ) !important;
}

.warning-reservado {
  background: #29b6f6 !important;
  background: linear-gradient(90deg, #29b6f6 87%, red 87%) !important;
}
</style>
