<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="6">
            <span v-if="status_link == 0"
              >Pedidos Varejo - <span class="primary--text">Todos </span></span
            >
            <span v-else-if="status_link == 1"
              >Pedidos Varejo - <span class="error--text">Em Aberto</span></span
            >
            <span v-else-if="status_link == 2"
              >Pedidos Varejo - <span class="success--text">Pagos</span></span
            >
          </v-col>
          <v-col cols="5">
            <v-text-field
              class="uppercase ma-0"
              v-model="search"
              v-on:keyup="find(search)"
              @click="$event.target.select()"
              append-icon="fa-search"
              label="Nome, CPF ou nº Pedido"
              single-line
              hide-details
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>
        <v-row no-gutters>
          <v-col cols="6" md="2" lg="2">
            <v-text-field
              class="ma-2"
              v-model="data_de"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
              placeholder="dd/mm/aaaa"
              label="De"
              required
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="2" lg="2">
            <v-text-field
              class="ma-2"
              v-model="data_ate"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
              placeholder="dd/mm/aaaa"
              label="Até"
              required
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn small color="primary" @click="getClientes()">
              Buscar
              <v-icon x-small dark class="ma-1">fa-search</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-btn-toggle
          mandatory
          class="ml-3"
          @change="getClientes()"
          dark
          v-model="status_link"
          tile
        >
          <v-btn small active-class="primary" :value="0">Todos</v-btn>
          <v-btn small active-class="error" :value="1">Em Aberto</v-btn>
          <v-btn small active-class="success" :value="2">Pagos</v-btn>
        </v-btn-toggle>
        <v-menu
          v-model="menuExcel"
          :close-on-content-click="true"
          :nudge-width="100"
          transition="slide-y-transition"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="ml-2 d-print-none text-white"
              color="grey darken-3"
              tile
              small
              v-on="on"
              >relatórios
              <v-icon x-small class="ma-1 text-white">fas fa-chart-line</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-row>
              <v-col class="ml-2" cols="12" sm="8" md="8" lg="8">
                <div class="ma-1">
                  <v-btn small text color="primary" @click="excel('todos')"
                    >Todos</v-btn
                  >
                </div>
                <div class="ma-1">
                  <v-btn small text color="error" @click="excel('em_aberto')"
                    >Em Aberto</v-btn
                  >
                </div>
                <div class="ma-1">
                  <v-btn small text color="success" @click="excel('pagos')"
                    >Pagos</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-menu>
      </v-card-subtitle>
      <q-table
        class="my-sticky-dynamic"
        style="height: 600px"
        ref="table"
        :data="pagamentos"
        :columns="columns"
        row-key="cpf_cnpj"
        :table-colspan="12"
        virtual-scroll
        :virtual-scroll-item-size="65"
        :rows-per-page-options="[0]"
        hide-bottom
        :expanded.sync="expanded"
        flat
        dense
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <v-btn
                v-model="props.expand"
                @click="
                  props.expand = true;
                  props.expand = false;
                "
                color="primary"
                fab
                text
                small
              >
                <i
                  :class="
                    !props.expand
                      ? 'fas fa-arrow-down'
                      : 'fas fa-arrow-up text-red'
                  "
                ></i>
              </v-btn>
            </q-td>
            <!-- <v-btn v-else color="primary" fab text small disabled
              ><i class="fas fa-arrow-down"></i
            ></v-btn> -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'nome'">
                {{ props.row.nome }}<br />
                {{ putMask(props.row.cpf_cnpj) }} <br />
                <b>Vendedor: {{ props.row.vendedore.nome }}</b>
              </div>
              <div v-else-if="col.name == 'email'">
                {{ props.row.email }}<br />
                {{ phoneMask(props.row.celular) }}
              </div>
              <div v-else>{{ col.value }}</div>
            </q-td>
          </q-tr>
          <!-- expand -->
          <q-tr
            v-show="props.expand"
            :props="props"
            class="q-virtual-scroll--with-prev"
          >
            <q-td colspan="100%">
              <div style="width: 100%">
                <v-simple-table flat dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Data</th>
                        <th class="text-left">Status</th>
                        <th class="text-left">Pedido</th>
                        <th class="text-left">Codigo</th>
                        <th class="text-left">Banco</th>
                        <th class="text-left">Total</th>
                        <th class="text-left">Ação</th>
                      </tr>
                    </thead>
                    <tbody class="grey lighten-4">
                      <tr v-for="item in props.row.pagamentos" :key="item.id">
                        <td v-if="item.created_at" style="width: 10%">
                          <b class="ma-0"> {{ item.created_at }} </b><br />
                          <v-chip
                            v-if="item.baixado == 1"
                            color="success text-white"
                            small
                          >
                            <p class="ma-0 text-center">BAIXADO</p>
                          </v-chip>
                        </td>

                        <td v-if="item.status_pagamento" style="width: 10%">
                          <v-chip
                            v-if="
                              item.status_pagamento == 'EM ABERTO' &&
                                item.tipo_pagamento == 'BOLETO' &&
                                item.boleto.vencido
                            "
                            color="warning text-white"
                            small
                          >
                            <span class="ma-0">BOLETO VENCIDO</span>&nbsp;
                            <span>{{ item.boleto.expiration_date }}</span>
                          </v-chip>
                          <v-chip
                            v-if="
                              item.status_pagamento == 'EM ABERTO' &&
                                item.tipo_pagamento == 'BOLETO' &&
                                item.boleto.vencido == false
                            "
                            small
                            color="primary"
                            class="text-center"
                            dark
                          >
                            <span>BOLETO EM ABERTO -</span>&nbsp;

                            <span>{{ item.boleto.expiration_date }}</span>
                          </v-chip>
                          <v-chip
                            v-if="item.status_pagamento == 'NÃO PAGO'"
                            @click="show($event, item)"
                            color="error text-white"
                            small
                          >
                            <p class="ma-0">
                              {{ item.status_pagamento }}
                            </p>
                          </v-chip>
                          <v-chip
                            v-if="item.status_pagamento == 'RESERVADO'"
                            @click="show($event, item)"
                            color="light-blue lighten-1"
                            dark
                            small
                            >RESERVADO</v-chip
                          >

                          <v-chip
                            v-if="
                              item.status_pagamento == 'PAGO' &&
                                item.tipo_pagamento == 'CREDITO'
                            "
                            @click="show($event, item)"
                            color="success"
                            dark
                            small
                            >CRÉDITO PAGO</v-chip
                          >
                          <v-chip
                            v-else-if="
                              item.status_pagamento == 'PAGO' &&
                                item.tipo_pagamento == 'BOLETO'
                            "
                            @click="show($event, item)"
                            color="success"
                            dark
                            small
                            >BOLETO PAGO</v-chip
                          >
                          <v-chip
                            v-else-if="
                              item.status_pagamento == 'PAGO' &&
                                item.tipo_pagamento == 'PIX'
                            "
                            @click="show($event, item)"
                            color="success"
                            dark
                            small
                            >PIX PAGO</v-chip
                          >
                          <v-chip
                            v-else-if="
                              item.status_pagamento == 'DEVOLVIDO' &&
                                item.tipo_pagamento == 'PIX'
                            "
                            @click="show($event, item)"
                            color="warning"
                            dark
                            small
                            >PIX DEVOLVIDO</v-chip
                          >
                          <v-chip
                            v-else-if="
                              item.status_pagamento == 'EXPIRADO' &&
                                item.tipo_pagamento == 'PIX'
                            "
                            @click="show($event, item)"
                            color="success"
                            dark
                            small
                            >PIX EXPIRADO</v-chip
                          >
                        </td>
                        <td v-if="item.pedidos" style="width: 10%">
                          <li
                            style="list-style-type: none"
                            v-for="item in item.pedidos"
                            :key="item.id"
                          >
                            {{ item.numero_pedido }}
                          </li>
                        </td>
                        <td style="width: 10%">{{ item.codigo_link }}</td>
                        <td style="width: 10%">{{ item.banco }}</td>
                        <td v-if="item.total" style="width: 10%">
                          {{
                            new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.total)
                          }}
                        </td>
                        <td style="width: 10%">
                          <v-btn
                            small
                            text
                            v-if="item.status_pagamento == 'EM ABERTO'"
                            :disabled="checkDisabled(item)"
                            color="primary"
                            @click="confirmBaixar(item)"
                          >
                            Baixar
                            <v-icon dark right small>fa-download</v-icon>
                          </v-btn>
                          <!-- botao imprimir -->
                          <v-btn
                            small
                            text
                            v-if="item.status_pagamento == 'PAGO'"
                            color="primary"
                            @click="confirmImprimir(item)"
                          >
                            Imprimir
                            <v-icon dark right small>fa-print</v-icon>
                          </v-btn>

                          <v-btn
                            :disabled="
                              item.status_pagamento == 'PAGO' ||
                                item.status_pagamento == 'RESERVADO' ||
                                item.status_pagamento == 'DEVOLVIDO'
                            "
                            @click="excluir_link(item.codigo_link)"
                            small
                            text
                            color="error"
                          >
                            excluir
                            <v-icon dark right small>far fa-trash-alt</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="
                              item.pagamentos_logs.length > 0 &&
                                item.status_pagamento == 'NÃO PAGO'
                            "
                            @click="ver_logs(item.pagamentos_logs)"
                            small
                            text
                            color="warning"
                          >
                            Erro do cliente<br />ao tentar pagar
                            <v-icon dark right small
                              >fas fa-exclamation-triangle</v-icon
                            >
                          </v-btn>
                        </td>
                      </tr>
                    </tbody></template
                  ></v-simple-table
                >
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <v-dialog v-model="dialogBoleto" persistent max-width="600">
        <v-card>
          <v-card-title class="headline"
            >Insira a Data de Pagamento do Boleto!</v-card-title
          >
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                hint="Digite somento números"
                autofocus
                v-model="dataPagamentoBoleto"
                :rules="[(v) => !!v || 'Campo Obrigatório']"
                label="Data do Pagamento"
                v-mask="'##/##/####'"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="danger" text @click="dialogBoleto = false"
              >Voltar</v-btn
            >
            <v-btn
              :disabled="!valid"
              color="success"
              text
              @click="baixarBoleto(objectItemBoleto)"
              >Baixar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogExcluir" persistent max-width="350">
        <v-card>
          <v-card-title class="headline">Atenção!</v-card-title>
          <v-card-text
            ><span class="subtitle-2">Deseja realmente excluir este link?</span>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" small @click="dialogExcluir = false"
              >Voltar</v-btn
            >
            <v-btn color="error" small @click="deletar(objectItem)"
              >Excluir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>

    <v-dialog v-model="print" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">Pagamento</v-card-title>
        <v-card-text id="print">
          <div
            class="mx-auto"
            style="width: 800px; height: 50%"
            v-if="objectItemPrint.tipo_pagamento == 'BOLETO'"
          >
            <h2 class="text-center">BOLETO PAGO</h2>
            <br />
            <h5>
              <b
                >{{ objectItemPrint.cliente_id }} -
                {{ objectItemPrint.nome }}</b
              >
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <br />
            <h5>
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total: R$</b>
              <span>{{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}</span>
            </h5>
            <h5>
              <b>Vencimento:</b>
              <span>{{ objectItemPrint.boleto.expiration_date }}</span>
            </h5>
            <h5>
              <b>Pago em:</b>
              <span>{{ objectItemPrint.boleto.received_at }}</span>
            </h5>
          </div>
          <hr
            style="
              border: 1px dashed #000 !important;
              width: 100%;
              margin: auto;
              margin-bottom: 10%;
            "
            v-if="objectItemPrint.tipo_pagamento == 'BOLETO'"
          />
          <div
            class="mx-auto"
            style="width: 800px; height: 40%"
            v-if="objectItemPrint.tipo_pagamento == 'BOLETO'"
          >
            <h2 class="text-center">BOLETO PAGO</h2>
            <br />
            <h5>
              <b
                >{{ objectItemPrint.cliente_id }} -
                {{ objectItemPrint.nome }}</b
              >
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <br />
            <h5>
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total: </b>
              <span>{{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}</span>
            </h5>
            <h5>
              <b>Vencimento:</b>
              <span>{{ objectItemPrint.boleto.expiration_date }}</span>
            </h5>
            <h5>
              <b>Pago em:</b>
              <span>{{ objectItemPrint.boleto.received_at }}</span>
            </h5>
          </div>

          <div
            class="mx-auto"
            style="width: 800px; height: 50%"
            v-if="objectItemPrint.tipo_pagamento == 'CREDITO'"
          >
            <h2 class="text-center">CRÉDITO PAGO</h2>
            <br />
            <h5>
              <b>{{ objectItemPrint.cliente_id }}</b>
              - {{ objectItemPrint.nome }}
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <h5>
              <br />
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}
            </h5>
            <h5>
              <b>Bandeira:</b>
              {{ objectItemPrint.credito.bandeira }} -
              {{ objectItemPrint.credito.number_installments }}x
            </h5>
            <h5>
              <b>Banco:</b>
              {{ objectItemPrint.banco }}
            </h5>
            <h5>
              <b>Autorização:</b>
              {{ objectItemPrint.credito.terminal_nsu }}
            </h5>
            <h5>
              <b>N° Comprovante:</b>
              {{ objectItemPrint.credito.acquirer_transaction_id }}
            </h5>
            <h5>
              <b>Recebido em:</b>
              {{ objectItemPrint.credito.received_at }}
            </h5>
          </div>

          <hr
            style="
              border: 1px dashed #000 !important;
              width: 100%;
              margin: auto;
              margin-bottom: 10%;
            "
            v-if="objectItemPrint.tipo_pagamento == 'CREDITO'"
          />

          <div
            class="mx-auto"
            style="width: 800px; height: 40%"
            v-if="objectItemPrint.tipo_pagamento == 'CREDITO'"
          >
            <h2 class="text-center">CRÉDITO PAGO</h2>
            <br />
            <h5>
              <b>{{ objectItemPrint.codigo_cliente }}</b>
              - {{ objectItemPrint.nome }}
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <h5>
              <br />
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}
            </h5>
            <h5>
              <b>Bandeira:</b>
              {{ objectItemPrint.credito.bandeira }} -
              {{ objectItemPrint.credito.number_installments }}x
            </h5>
            <h5>
              <b>Banco:</b>
              {{ objectItemPrint.banco }}
            </h5>
            <h5>
              <b>Autorização:</b>
              {{ objectItemPrint.credito.terminal_nsu }}
            </h5>
            <h5>
              <b>N° Comprovante:</b>
              {{ objectItemPrint.credito.acquirer_transaction_id }}
            </h5>
            <h5>
              <b>Recebido em:</b>
              {{ objectItemPrint.credito.received_at }}
            </h5>
          </div>
          <div
            class="mx-auto"
            style="width: 800px; height: 50%"
            v-if="objectItemPrint.tipo_pagamento == 'PIX'"
          >
            <h2 class="text-center">
              PIX {{ objectItemPrint.status_pagamento }}
            </h2>
            <br />
            <h5>
              <b>{{ objectItemPrint.cliente_id }}</b>
              - {{ objectItemPrint.nome }}
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <h5>
              <br />
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}
            </h5>

            <h5 v-if="objectItemPrint.status_pagamento == 'DEVOLVIDO'">
              <b>Total Estornado:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.pagamentos_pix.valor_devolvido)
              }}
            </h5>
            <h5>
              <b>Obs:</b>
              {{ objectItemPrint.pagamentos_pix.obs }}
            </h5>
            <h5>
              <b>Txid:</b>
              {{ objectItemPrint.pagamentos_pix.txid }}
            </h5>
            <h5>
              <b>Recebido em:</b>
              {{ $moment_format_time(objectItemPrint.pagamentos_pix.pago_em) }}
            </h5>
            <h5 v-if="objectItemPrint.status_pagamento == 'DEVOLVIDO'">
              <b>Estonado em:</b>
              {{
                $moment_format_time(objectItemPrint.pagamentos_pix.devolvido_em)
              }}
            </h5>
          </div>

          <hr
            style="
              border: 1px dashed #000 !important;
              width: 100%;
              margin: auto;
              margin-bottom: 10%;
            "
            v-if="objectItemPrint.tipo_pagamento == 'PIX'"
          />

          <div
            class="mx-auto"
            style="width: 800px; height: 40%"
            v-if="objectItemPrint.tipo_pagamento == 'PIX'"
          >
            <h2 class="text-center">
              PIX {{ objectItemPrint.status_pagamento }}
            </h2>
            <br />
            <h5>
              <b>{{ objectItemPrint.cliente_id }}</b>
              - {{ objectItemPrint.nome }}
            </h5>
            <h5>{{ putMask(objectItemPrint.cpf_cnpj) }}</h5>
            <h5>
              <br />
              <b>Pedidos:</b>
              <span
                v-for="pedido in objectItemPrint.pedidos"
                :key="pedido.pedido"
                >({{ pedido.numero_pedido }})</span
              >
            </h5>
            <h5>
              <b>Vendedor:</b>
              <span>{{ objectItemPrint.vendedore.nome }}</span>
            </h5>
            <h5>
              <b>Total:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.total)
              }}
            </h5>

            <h5 v-if="objectItemPrint.status_pagamento == 'DEVOLVIDO'">
              <b>Total Estornado:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPrint.pagamentos_pix.valor_devolvido)
              }}
            </h5>
            <h5>
              <b>Obs:</b>
              {{ objectItemPrint.pagamentos_pix.obs }}
            </h5>
            <h5>
              <b>Txid:</b>
              {{ objectItemPrint.pagamentos_pix.txid }}
            </h5>
            <h5>
              <b>Recebido em:</b>
              {{ $moment_format_time(objectItemPrint.pagamentos_pix.pago_em) }}
            </h5>
            <h5 v-if="objectItemPrint.status_pagamento == 'DEVOLVIDO'">
              <b>Estonado em:</b>
              {{
                $moment_format_time(objectItemPrint.pagamentos_pix.devolvido_em)
              }}
            </h5>
          </div>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="print = false">Voltar</v-btn>
          <v-btn @click="printInfo()" color="success" text>Imprimir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="false"
      :close-on-click="false"
      :nudge-width="200"
    >
      <v-card>
        <v-card-title class="headline font-weight-black"> </v-card-title>
        <div v-if="objectItemPagamento.status_pagamento == 'NÃO PAGO'">
          <v-card>
            <v-card-title class="headline">Link de Pagamento</v-card-title>
            <v-card-text>
              <span v-if="objectItemPagamento.iugu"
                >{{ objectItemPagamento.iugu }}</span
              >
              <span v-else>
                https://solident.com.br/pagamento/{{
                  objectItemPagamento.codigo_link
                }}
                
              </span>
              <v-btn
                @click="
                  copyLink();
                  showMenu = false;
                "
                text
                icon
                color="pink"
              >
                <v-icon>fa-copy</v-icon>
              </v-btn>
              <input
                type="hidden"
                id="linkCopy"
                :value="objectItemPagamento.iugu ? objectItemPagamento.iugu :'https://solident.com.br/pagamento/' +
                    objectItemPagamento.codigo_link "
              />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <v-btn text @click="showMenu = false">Voltar</v-btn>
              <v-btn
                color="success"
                text
                @click="enviarEmailLink(objectItemPagamento)"
                >Enviar por E-mail</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
        <div v-else-if="objectItemPagamento.status_pagamento == 'RESERVADO'">
          <v-card>
            <v-card-title class="headline">
              PAGAMENTO RESERVADO
              <br />PARA COBRAR OU EXTORNAR FALAR COM EDGAR
              <br />
              <span class="error--text"
                >DIAS RESTANTES PARA EXTORNO AUTOMATICO:
                {{ objectItemPagamento.credito.dias_restantes }} -
                {{ objectItemPagamento.credito.data_extorno }}</span
              >
            </v-card-title>

            <!--
                    <v-divider></v-divider>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn text @click="row.menuLink = false">Voltar</v-btn>
                      <v-btn color="success" text @click="cobrarReserva(row.total)">Cobrar</v-btn>
                    </v-card-actions>-->
          </v-card>
        </div>
        <div
          v-else-if="
            objectItemPagamento.tipo_pagamento == 'CREDITO' &&
              objectItemPagamento.status_pagamento == 'PAGO'
          "
        >
          <v-card>
            <v-card-title>Detalhes Pagamento</v-card-title>
            <v-card-text>
              <b>Cartão de Crédito</b><br />
              <b>Banco:</b> {{ objectItemPagamento.banco }}<br />
              <b>Autorização:</b>
              {{ objectItemPagamento.credito.terminal_nsu }}<br />
              <b>N° Comprovante:</b>
              {{ objectItemPagamento.credito.acquirer_transaction_id }}<br />
              <b>Status:</b> {{ objectItemPagamento.credito.status }}<br />
              <b>Bandeira:</b> {{ objectItemPagamento.credito.bandeira }}<br />
              <b>Valor:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPagamento.total)
              }}<br />
              <b>Parcelas:</b>
              {{ objectItemPagamento.credito.number_installments }}<br />
              <b>Recebido em:</b>
              {{ objectItemPagamento.credito.received_at }}<br />
              <v-divider></v-divider>
             
         <b>CPF:</b>
          {{
            objectItemPagamento.cpf_cnpj == undefined
              ? ""
              : putMask(objectItemPagamento.cpf_cnpj)
          }}
          <br />          
          <b>Nome Cadastro:</b> {{ objectItemPagamento.nome }}          
          <br />                         
          <div
            v-if="
              objectItemPagamento.parentesco != '' &&
                typeof objectItemPagamento.parentesco != 'object'
            "
          >
            <b>Parentesco:</b> {{ objectItemPagamento.parentesco }}
            <br />
            <b>Nome Titular:</b>
            {{
              objectItemPagamento.credito == null ? "" : objectItemPagamento.pagamentos_cartao_credito.nome_cartao
            }}             
            <br />
            <b class="error--text">CLIENTE NÃO É O TITULAR</b>
            <br />
          </div>
          <div v-else>
            <b class="success--text">CLIENTE É O TITULAR</b>
            <br />
          </div> 
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn text @click="showMenu = false">Voltar</v-btn>
              <v-btn
                color="success"
                @click="confirmImprimir(objectItemPagamento)"
                text
                >Imprimir</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
        <div
          v-else-if="
            objectItemPagamento.tipo_pagamento == 'BOLETO' &&
              objectItemPagamento.status_pagamento == 'PAGO'
          "
        >
          <v-card>
            <v-card-title>Detalhes Pagamento</v-card-title>
            <v-card-text>
              <b>Boleto</b><br />
              <b>Banco:</b> {{ objectItemPagamento.banco }}<br />
              <b>N° Documento:</b>
              {{ objectItemPagamento.boleto.document_number }}<br />
              <b>Nosso Número:</b> {{ objectItemPagamento.boleto.our_number
              }}<br />
              <b>Valor:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPagamento.boleto.amount)
              }}<br />
              <b>Emitido em:</b> {{ objectItemPagamento.boleto.issue_date
              }}<br />
              <b>Vencimento:</b> {{ objectItemPagamento.boleto.expiration_date
              }}<br />
              <b>Recebido em:</b> {{ objectItemPagamento.boleto.received_at
              }}<br />
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn text @click="showMenu = false">Voltar</v-btn>
              <v-btn
                color="success"
                @click="confirmImprimir(objectItemPagamento)"
                text
                >Imprimir</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
        <div
          v-else-if="
            objectItemPagamento.tipo_pagamento == 'PIX' &&
              objectItemPagamento.status_pagamento != 'NÃO PAGO'
          "
        >
          <v-card>
            <v-card-title>Detalhes Pagamento</v-card-title>
            <v-card-text>
              <b>PIX</b><br />
              <b>Status:</b>
              <span
                :class="
                  objectItemPagamento.pagamentos_pix.status == 'CONCLUIDA'
                    ? 'success--text'
                    : objectItemPagamento.pagamentos_pix.status == 'DEVOLVIDO'
                    ? 'warning--text'
                    : 'error--text'
                "
                >{{ objectItemPagamento.pagamentos_pix.status }}</span
              ><br />
              <b>Banco:</b> {{ objectItemPagamento.banco }}<br />
              <b>Valor:</b>
              {{
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(objectItemPagamento.pagamentos_pix.valor)
              }}<br />
              <div
                v-if="objectItemPagamento.pagamentos_pix.status == 'DEVOLVIDO'"
              >
                <b>Valor Estornado:</b>
                {{
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(objectItemPagamento.pagamentos_pix.valor_devolvido)
                }}<br />
              </div>
              <b>Obs:</b> {{ objectItemPagamento.pagamentos_pix.obs }}<br />
              <b>Txid:</b> {{ objectItemPagamento.pagamentos_pix.txid }}<br />
              <b>End2End:</b>
              {{ objectItemPagamento.pagamentos_pix.end_to_end_id }}<br />
              <b>Recebido em:</b>
              {{
                $moment_format_time(objectItemPagamento.pagamentos_pix.pago_em)
              }}<br />
              <div
                v-if="objectItemPagamento.pagamentos_pix.status == 'DEVOLVIDO'"
              >
                <b>Estornado em:</b>
                {{
                  $moment_format_time(
                    objectItemPagamento.pagamentos_pix.devolvido_em
                  )
                }}<br />
              </div>
              <br />
              <div
                v-if="objectItemPagamento.pagamentos_pix.status == 'CONCLUIDA'"
              >
                <b class="title font-weight-black">Valor a Estornar:</b>
                <v-currency-field
                  prefix="R$"
                  dense
                  hide-details
                  @keydown.enter.prevent="
                    checkValorEstornar(objectItemPagamento)
                  "
                  v-model="objectItemPagamento.pagamentos_pix.valor_devolvido"
                />
              </div>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn class="error--text" text @click="showMenu = false"
                >Voltar</v-btn
              >
              <v-btn
                color="success"
                @click="confirmImprimir(objectItemPagamento)"
                text
                >Imprimir</v-btn
              >
              <v-btn
                v-if="objectItemPagamento.pagamentos_pix.status == 'CONCLUIDA'"
                color="warning"
                @click="checkValorEstornar()"
                text
                >Estornar</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </v-card>
    </v-menu>
    <v-dialog v-model="dialogLog" width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Tentativas e Erros do Cliente</span>
        </v-card-title>
        <v-card-text>
          <div v-for="log in objectItem" :key="log.id">
            <b>Código do Link: </b><span>{{ log.codigo_link }}</span>
            <br />
            <b>Razão: </b><span class="error--text">{{ log.razao }}</span>
            <br />
            <b>Data: </b><span>{{ log.created_at }}</span>
            <br />
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  Retorno do Banco
                  <template v-slot:actions>
                    <v-icon color="error"> fas fa-exclamation-circle </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ log.obj_retorno }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-divider></v-divider>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialogLog = false"> Voltar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="objectItemPagamento.tipo_pagamento == 'PIX'" v-model="dialogEstornar" persistent max-width="400">
      <v-card v-if="objectItemPagamento.pagamentos_pix.status == 'CONCLUIDA'">
        <v-card-title class="display-1 error--text">Atenção!</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="body-1 font-weight-black">
          <p>É isso mesmo que deseja fazer ?</p>
          <p>
            VALOR A ESTORNAR:
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(objectItemPagamento.pagamentos_pix.valor_devolvido)
            }}
          </p>
          <p>
            VALOR RECEBIDO:
            {{
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(objectItemPagamento.pagamentos_pix.valor)
            }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogEstornar = false">Não</v-btn>
          <v-btn color="success" text @click="estornarPix()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    data: [],
    expanded: [],
    status_link: 0,
    permissoes: {},
    columns: [
      {
        name: "nome",
        align: "left",
        label: "Nome/CPF_CNPJ/Vendedor",
        field: "nome",
        sortable: false,
      },
      {
        name: "email",
        align: "left",
        label: "Contato",
        field: "email",
        sortable: false,
      },
    ],
    print: false,
    objectIndex: -1,
    objectItem: { codigo_link: "" },
    objectItemPrint: { codigo_link: "" },
    objectItemEstorno: { codigo_link: "" },
    objectItemBoleto: { codigo_link: "" },
    dialogBoleto: false,
    dialogEstornar: false,
    dataPagamentoBoleto: "",
    valid: false,
    search: "",
    objectItemPagamento: { pagamentos_pix: { valor_devolvido: "" } },
    showMenu: false,
    x: 0,
    y: 0,
    snackbar: false,
    msgSnackbar: "",
    typeSnackbar: "",
    timeSnackbar: 0,
    loading: false,
    dialogExcluir: false,
    dialogEstorno: false,
    dialogLog: false,
    filteredPagamentosExcel: [],
    menu: false,
    menuExcel: false,
  }),
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    this.getPermissao();
    await this.getDatas();
    await this.getClientes();
  },
  computed: {
    ...mapState({
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      pagamentos: (state) => state.varejo.clientes_pagamentos,
      excel_pagamentos: (state) => state.varejo.excel_pagamentos,
      error: (state) => state.varejo.error,
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
    ...mapActions([
      "getDatas",
      "get_clientes_pagamentos",
      "deletar_link",
      "get_excel_pagamentos",
      "enviar_email",
      "baixar_impressao",
      "baixar",
    ]),
    ...mapMutations(["filtered_pagamentos"]),

    async estornarPix() {
      this.loading = true;
      let res = await this.$axios.post(
        "https://solident.com.br/node/pix_estorno",
        {
          dados: {
            codigo_link: this.objectItemPagamento.codigo_link,
            end_to_end_id: this.objectItemPagamento.pagamentos_pix
              .end_to_end_id,
            txid: this.objectItemPagamento.pagamentos_pix.txid,
            valor: this.objectItemPagamento.pagamentos_pix.valor_devolvido.toFixed(
              2
            ),
          },
        }
      );

      if (res.data.hasOwnProperty("rtrId")) {
        this.showSnackbar("Pix Estornado", "success", 2000);
      } else {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
      }
      console.log("opa resposta", res.data);

      this.dialogEstornar = false;
      this.loading = false;
    },

    checkValorEstornar() {
      if (
        this.objectItemPagamento.pagamentos_pix.valor_devolvido == parseFloat(0)
      ) {
        this.showSnackbar(
          "Obrigatorio Preencher o Valor a Estornar",
          "warning"
        );
      } else if (
        this.objectItemPagamento.pagamentos_pix.valor_devolvido >
        this.objectItemPagamento.pagamentos_pix.valor
      ) {
        this.showSnackbar("Valor Incorreto", "warning");
      } else {
        this.dialogEstornar = true;
      }
    },

    ver_logs(logs) {
      for (let log of logs) {
        if (typeof log.obj_retorno != "object") {
          log.obj_retorno = this.$crypto_decrypt(log.obj_retorno, true);
        }
      }
      this.objectItem = logs;
      this.dialogLog = true;
    },
    async getClientes() {
      let obj = {
        status: this.status_link,
        data_de: this.data_de,
        data_ate: this.data_ate,
      };

      this.loading = true;
      await this.get_clientes_pagamentos(obj);
      if (this.error) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
      }
      this.loading = false;
      console.log("pagamentos", this.pagamentos);
    },
    excluir_link(item) {
      this.objectIndex = this.pagamentos.indexOf(item);
      this.objectItem = item;
      this.dialogExcluir = true;
    },
    async deletar(item) {
      this.dialogExcluir = false;
      this.loading = true;
      await this.deletar_link(item);
      if (this.error) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
        this.loading = false;
      } else {
        this.showSnackbar("Link Excluido", "success", 2000);
        this.loading = false;
      }
      this.getClientes();
    },
    confirmImprimir(item) {
      console.log("item", item);
      this.objectIndex = this.pagamentos.indexOf(item);
      this.objectItemPrint = { ...item };

      this.print = true;
    },
    async printInfo() {
      this.$htmlToPaper("print");
      await this.baixar_impressao(this.objectItemPrint);
      if (this.error) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
      }
      this.loading = false;
    },
    checkDisabled(item) {
      if (item.status_pagamento != "EM ABERTO") {
        return true;
      }
      return false;
    },
    confirmBaixar(item) {
      this.objectIndex = this.pagamentos.indexOf(item);
      this.objectItemBoleto = { ...item };
      this.dialogBoleto = true;
    },
    async baixarBoleto(item) {
      if (this.$refs.form.validate()) {
        item.received_at = this.dataPagamentoBoleto;
        this.objectItemBoleto.boleto.received_at = this.dataPagamentoBoleto;

        this.loading = true;
        await this.baixar(item);

        if (this.error) {
          this.showSnackbar("Erro ao Baixar!", "warning");
        } else {
          this.showSnackbar("Boleto Baixado com Sucesso!", "success", 2000);
          this.objectItemPrint = { ...item };
          this.dialogBoleto = false;
          this.print = true;
        }
        this.loading = false;
        this.getClientes();
      }
    },
    async enviarEmailLink(item) {
      item = { pedidos: item.pedidos };

      this.loading = true;
      await this.enviar_email(item);

      if (this.error) {
        this.showSnackbar("Erro no Servidor, Contate o Administrador", "error");
      } else {
        this.showSnackbar("Email Enviado com Sucesso", "success", 2000);
      }
      this.menuBoleto = false;
      this.showMenu = false;
      this.loading = false;
    },
    copyLink() {
      let copy = document.querySelector("#linkCopy");
      copy.setAttribute("type", "text");
      copy.select();
      try {
        let success = document.execCommand("copy");
        if (success) {
          this.showSnackbar("Link Copiado", "success", 2000);
        } else {
          this.showSnackbar("Erro ao Copiar", "error");
        }
      } catch (error) {
        this.showSnackbar(error, "error");
      }

      copy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    putMask(item, type) {
      if (item.length < 14) {
        return this.$mask.apply(item, "000.000.000-00");
      } else {
        return this.$mask.apply(item, "00.000.000/0000-00");
      }
    },
    phoneMask(item, type) {
      if (item.length < 11) {
        return this.$mask.apply(item, "(00)0 0000-0000");
      } else {
        return this.$mask.apply(item, "(00)0000-0000");
      }
    },
    show(e, item) {
      this.x = e.clientX;
      this.y = e.clientY;
      this.objectItemPagamento = { ...item };
      this.showMenu = true;
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "ver_pagamentos",
          },
        })
        .then((res) => {
          this.permissoes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async excel(tipo) {
      this.loading = true;
      let status = 0;
      let json = [];

      if (tipo == "todos") {
        status = 0;
      }
      if (tipo == "em_aberto") {
        status = 1;
      }
      if (tipo == "pagos") {
        status = 2;
      }
      let obj = {
        status: status,
        data_de: this.data_de,
        data_ate: this.data_ate,
      };
      await this.get_excel_pagamentos(obj);

      if (this.error) {
        this.showSnakerbar(
          "Erro no Servidor, Contate o Administrador",
          "error"
        );
      } else {
        for (let cliente of this.excel_pagamentos) {
          for (let pagamento of cliente.pagamentos) {
            for (let pedido of pagamento.pedidos) {
              let obj = {};

              obj.nome = cliente.nome;
              obj.cpf_cnpj = cliente.cpf_cnpj;
              obj.numero_pedido = pedido.numero_pedido;
              obj.codigo_link = pagamento.codigo_link;
              obj.created_at = pagamento.created_at;

              if (pagamento.tipo_pagamento == "NÃO PAGO") {
                obj.valor = parseFloat(pagamento.total);
                obj.status = "NÃO PAGO";
                json.push(obj);
              } else if (pagamento.tipo_pagamento == "CREDITO") {
                if (
                  !Object.keys(pagamento.pagamentos_cartao_credito).length == 0
                ) {
                  obj.tipo = "CREDITO";
                  pagamento.credito.amount =
                    pagamento.credito.amount.toString().slice(0, -2) +
                    "," +
                    pagamento.credito.amount.toString().slice(-2);

                  obj.valor = parseFloat(
                    pagamento.credito.amount.replace(/,/g, ".")
                  );
                  obj.status = pagamento.pagamentos_cartao_credito.status;

                  json.push(obj);
                }
              } else if (pagamento.tipo_pagamento == "BOLETO") {
                if (!Object.keys(pagamento.pagamentos_boleto).length == 0) {
                  obj.tipo = "BOLETO";
                  pagamento.boleto.amount =
                    pagamento.boleto.amount.toString().slice(0, -2) +
                    "," +
                    pagamento.boleto.amount.toString().slice(-2);
                  obj.valor = parseFloat(
                    pagamento.boleto.amount.replace(/,/g, ".")
                  );
                  obj.status = pagamento.pagamentos_boleto.status;

                  json.push(obj);
                }
              } else {
                obj.tipo = "PIX";
                obj.status = pagamento.pagamentos_pix.status;
                json.push(obj);
              }
            }
          }
        }
      }
      if (json.length) {
        var ws = this.$XLSX.utils.json_to_sheet(json);
        var wb = this.$XLSX.utils.book_new(); // make Workbook of Excel
        this.$XLSX.utils.book_append_sheet(wb, ws, "pagamentos_varejo_" + tipo); // sheetAName is name of Worksheet
        this.$XLSX.writeFile(wb, "pagamentos_varejo_" + tipo + ".xlsx"); // name of the file is 'book.xlsx'
      } else {
        this.showSnackbar("Atenção! Não existem pagamentos!", "warning", 5000);
      }
      this.loading = false;
    },
    find() {
      this.search = this.search.replace(/[.,-\s]/g, "");
      if (this.search.length == 0) {
        this.getClientes();
      }
      if (this.search && this.search.length > 4) {
        let isso = this;
        let filteredPagamentos = [];
        let filteredPagamentosNome = [];
        let filteredPagamentosCpf = [];
        let filteredPagamentosPedido = [];
        let filteredPagamentosCodLink = [];

        filteredPagamentosNome = this.pagamentos.filter((p) =>
          p.nome.includes(isso.search.toUpperCase())
        );
        if (filteredPagamentosNome.length) {
          filteredPagamentos = filteredPagamentosNome;
          this.filtered_pagamentos(filteredPagamentos);
        }

        filteredPagamentosCpf = this.pagamentos.filter((p) =>
          p.cpf_cnpj.includes(isso.search.toUpperCase())
        );
        if (filteredPagamentosCpf.length) {
          filteredPagamentos = filteredPagamentosCpf;
          this.filtered_pagamentos(filteredPagamentos);
        }

        if (
          filteredPagamentosNome.length == 0 &&
          filteredPagamentosCpf.length == 0
        ) {
          if (this.search.length == 7 && isNaN(this.search.slice(-1))) {
            filteredPagamentosPedido = this.pagamentos.filter(function(a) {
              a.pagamentos = a.pagamentos.filter(function(b) {
                b.pedidos = b.pedidos.filter(function(c) {
                  return c.numero_pedido == isso.search.toUpperCase();
                });
                return b.pedidos.length != 0;
              });
              return a.pagamentos.length != 0;
            });
            if (filteredPagamentosPedido.length) {
              filteredPagamentos = filteredPagamentosPedido;
              this.filtered_pagamentos(filteredPagamentos);
            }
          }
        }

        if (
          filteredPagamentosNome.length == 0 &&
          filteredPagamentosCpf.length == 0 &&
          filteredPagamentosPedido.length == 0
        ) {
          if (this.search.length >= 8) {
            filteredPagamentosCodLink = this.pagamentos.filter(function(a) {
              a.pagamentos = a.pagamentos.filter((b) =>
                b.codigo_link.includes(isso.search.toUpperCase())
              );
              return a.pagamentos.length != 0;
            });

            if (filteredPagamentosCodLink.length) {
              filteredPagamentos = filteredPagamentosCodLink;
              this.filtered_pagamentos(filteredPagamentos);
            }
          }
        }
      }
    },
  },
};
</script>
