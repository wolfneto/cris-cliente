<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row justify="center" class="custom-row">
          <v-col cols="1">
            <v-btn @click="getPedidos(0)" color="primary">Atualizar</v-btn>
          </v-col>
          <v-col cols="2">
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
          <v-col cols="2">
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
          <v-col cols="4">
            <v-text-field
              class="uppercase"
              v-model="search"
              @click="$event.target.select()"
              append-icon="fa-search"
              label="Nome, CPF ou nÂº Pedido"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-btn-toggle mandatory class="ml-3" dark v-model="status_link" tile>
        <v-btn small active-class="error" :value="false">NÃ£o Pagos</v-btn>
        <v-btn small active-class="success" :value="true">Pagos</v-btn>
      </v-btn-toggle>
      <q-table
        type="table"
        style="max-height: 83vh"
        class="my-sticky-dynamic ma-0"
        :data="pedidos_filtrados"
        :columns="columnsPedidos"
        row-key="id_pedidos"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-sticky-size-end="32"
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
          <q-tr :props="props" :key="`m_${props.row.id_pedidos}`">
            <v-btn
              v-if="props.row.pagamentos.length"
              v-model="props.expand"
              @click="
                calcExpirationDate(props.row.pagamentos);
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
            <v-btn v-else color="primary" fab text small disabled
              ><i class="fas fa-arrow-down"></i
            ></v-btn>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'data_pedido'">
                {{ $moment_format(props.row.data_pedido) }}
              </div>
              <div v-else-if="col.name == 'aluno'">
                {{ props.row.aluno.nome }} {{ props.row.aluno.sobrenome }}<br />
                {{ $put_mask(props.row.aluno.cpf, "cpf") }}
              </div>
              <div v-else-if="col.name == 'valor'">
                {{ $money_format(props.row.valor_total) }}
              </div>
              <div v-else-if="col.name == 'frete'">
                {{ $money_format(props.row.valor_frete) }}
              </div>
              <div v-else-if="col.name == 'total'">
                {{
                  $money_format(props.row.valor_total + props.row.valor_frete)
                }}
              </div>
              <div v-else-if="col.name == 'total_pago'">
                {{ calcTotalPago(props.row) }}
              </div>
              <div v-else-if="col.name == 'valor_restante'">
                {{ calcValorRestante(props.row) }}
              </div>
              <!-- <div v-else-if="col.name == 'valor_credito'">
                {{ calcValorCredito(props.row) }}
              </div> -->
              <div v-else-if="col.name == 'status_aluno'">
                <v-chip
                  :color="
                    props.row.status_aluno == 'AGUARDANDO PAGAMENTO'
                      ? 'red'
                      : props.row.status_aluno == 'AGUARDANDO PAGAMENTO PARCIAL'
                      ? 'warning'
                      : 'green'
                  "
                  text-color="white"
                  >{{ props.row.status_aluno }}</v-chip
                >
              </div>
              <div v-else-if="col.name == 'acao'">
                <!-- <v-menu
                  :close-on-click="props.row.obs_pagamento == undefined ? true:false"
                  @input="onMenuToggle($event, props.row)"
                  v-model="props.row.menu_obs_financeiro"
                  :close-on-content-click="false"
                  bottom
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" icon dark>
                      <v-icon small>far fa-comment</v-icon>
                    </v-btn>
                  </template>
                  <v-card width="400px">
                    <v-card-title>
                      ObservaÃ§Ãµes Financeiro
                    </v-card-title>

                    <v-textarea
                      label="Insira as observaÃ§Ãµes"
                      filled
                      clearable
                      no-resize
                      rows="3"
                      clear-icon="fa-times-circle"
                      v-model="props.row.obs_pagamento"
                    >
                    </v-textarea>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="salvarObsFinanceiro(props.row)"
                        color="success"
                        >Salvar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu> -->
                <v-btn @click="criarLink(props.row)" icon>
                  <v-icon small class="ma-4 text-blue">fas fa-plus</v-icon>
                </v-btn>
                <v-menu origin="center center" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" icon dark>
                      <v-icon small>fa-bars</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-btn @click="showItens(props.row)" tile color="success">
                        <v-icon left> fa-clipboard-list </v-icon>
                        Ver Itens
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn
                        @click="confirmEmitir(props.row)"
                        tile
                        color="primary"
                      >
                        <v-icon left> fa-download </v-icon>
                        Emitir
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn
                        @click="showDialogExcluirPedido(props.row)"
                        tile
                        color="error"
                      >
                        <v-icon left> fas fa-trash-alt </v-icon>
                        Excluir
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div v-else>{{ col.value }}</div>
            </q-td>
          </q-tr>
          <q-tr
            v-show="props.expand"
            :props="props"
            :key="`e_${props.row.id_pedidos}`"
          >
            <q-td colspan="100%">
              <div>
                <v-simple-table flat dense>
                  <template v-slot:default>
                    <tbody class="grey lighten-4">
                      <tr
                        v-for="item in props.row.pagamentos"
                        :key="item.id_pagamento"
                      >
                        <td style="width: 7%"># {{ item.id_pagamento }}</td>
                        <td style="width: 20%">
                          <span class="font-weight-bold">Link Criado Em: </span>
                          {{ $moment_format_time(item.data_cobranca) }}
                        </td>
                        <td>
                          <v-chip
                            text-color="white"
                            :color="
                              item.banco_cobranca == 'SANTANDER'
                                ? 'red lighten-1'
                                : 'purple darken-4'
                            "
                          >
                            <span>{{ item.banco_cobranca }}</span>
                          </v-chip>
                        </td>
                        <td style="width: 10%">
                          <v-chip
                            @click="show($event, item)"
                            :color="
                              item.status_pagamento == 'NÃƒO PAGO'
                                ? 'red'
                                : item.status_pagamento == 'EM ABERTO'
                                ? 'warning'
                                : item.status_pagamento == 'CANCELLED'
                                ? 'black'
                                : 'green'
                            "
                            text-color="white"
                          >
                            <span>{{ item.status_pagamento }}</span>
                          </v-chip>
                        </td>
                        <td style="width: 10%">
                          <span class="font-weight-bold">Tipo: </span>
                          <v-chip
                            :color="
                              item.tipo_pagamento == 'CREDITO'
                                ? 'cyan'
                                : 'deep-orange'
                            "
                            text-color="white"
                          >
                            {{ item.tipo_pagamento }}
                          </v-chip>
                        </td>
                        <td style="width: 10%">
                          <span class="font-weight-bold">Valor: </span>
                          {{ $money_format(item.valor_cobranca) }}
                        </td>
                        <td>
                          <v-btn
                            v-if="item.status_pagamento != 'PAGO'"
                            small
                            color="primary"
                            @click="enviarLink(props.row.aluno, item)"
                          >
                            Enviar Link Novamente
                          </v-btn>
                        </td>
                        <td class="caption text-right">
                          <v-btn
                            v-if="
                              item.status_pagamento != 'PAGO' &&
                              item.status_pagamento != 'EM ABERTO' ||
                              item.tipo_pagamento == 'DINHEIRO'
                            "
                            small
                            icon
                            @click="deletarLink(item)"
                          >
                            <v-icon small class="error--text"
                              >fas fa-trash-alt</v-icon
                            >
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </v-card>
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
      <div v-if="objectItem.tipo_pagamento == 'CREDITO'">
        <v-card v-if="objectItem.status_pagamento == 'PAGO'">
          <v-card-title class="headline font-weight-black"
            >Detalhes Pagamento</v-card-title
          >
          <v-card-text>
            <b>CartÃ£o de CrÃ©dito</b>
            <br />
            <b>Banco:</b>
            {{ objectItem.credito_pagamento.banco }}
            <br />
            <b>AutorizaÃ§Ã£o:</b>
            {{ objectItem.credito_pagamento.terminal_nsu }}
            <br />
            <b>NÂº Comprovante:</b>
            {{ objectItem.credito_pagamento.acquirer_transaction_id }}
            <br />
            <b>Status:</b>
            {{ objectItem.credito_pagamento.status }}
            <br />
            <b>Bandeira:</b>
            {{ objectItem.credito_pagamento.bandeira }}
            <br />
            <b>Valor:</b>
            {{ $money_format(objectItem.credito_pagamento.amount / 100) }}
            <br />
            <b>Parcelas:</b>
            {{ objectItem.credito_pagamento.number_installments }}x
            <br />
            <b>Recebido em:</b>
            {{
              $moment_format_sub_2(objectItem.credito_pagamento.authorized_at)
            }}
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
      </div>
      <div v-else>
        <v-card v-if="objectItem.status_pagamento == 'PAGO'">
          <v-card-title class="headline font-weight-black"
            >Detalhes Pagamento</v-card-title
          >
          <v-card-text>
            <b>Boleto</b>
            <br />
            <b>Banco:</b>
            {{ objectItem.boleto_pagamento.banco }}
            <br />
            <b>NÂº Documento:</b>
            {{ objectItem.boleto_pagamento.document_number }}
            <br />
            <b>Nosso NÃºmero:</b>
            {{ objectItem.boleto_pagamento.our_number }}
            <br />
            <b>Valor:</b>
            {{ $money_format(objectItem.valor_cobranca) }}
            <br />
            <b>Emitido em:</b>
            {{ $moment_format(objectItem.boleto_pagamento.issue_date) }}
            <br />
            <b>Vencimento:</b>
            {{ $moment_format(objectItem.boleto_pagamento.expiration_date) }}
            <br />
            <b>Recebido em:</b>
            {{ $moment_format_time(objectItem.boleto_pagamento.received_at) }}
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
        <v-card v-else-if="objectItem.status_pagamento == 'EM ABERTO'">
          <v-card-title
            v-if="objectItem.boleto_pagamento.vencido"
            class="headline font-weight-black"
          >
            Boleto Vencido
            <br />
          </v-card-title>
          <v-card-title v-else class="headline font-weight-black">
            Boleto em Aberto
            <br />
            {{ $moment_format(objectItem.boleto_pagamento.expiration_date) }}
          </v-card-title>
          <v-card-text class="text-center">
            <v-btn
              target="_blank"
              :href="objectItem.boleto_pagamento.boleto_html"
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
            <v-btn color="success" text @click="enviarEmail(objectItem)"
              >Enviar por E-mail</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </v-menu>
    <v-dialog v-model="dialog" persistent max-width="390">
      <v-card>
        <v-card-title>
          <span class="headline">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text>
          VocÃª nÃ£o pode mais criar link de pagamento! <br />
          Exclua um link para continuar.
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" @click="dialog = false">Ok! Entendi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAcao" persistent max-width="40%">
      <v-card>
        <v-card-title>
          <span class="headline">AtenÃ§Ã£o</span>
        </v-card-title>
        <v-card-text class="headline">
          <p>teste</p>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" @click="dialogAcao = false">Cancelar</v-btn>
          <v-btn color="success" @click="dialogAcao = false">Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" persistent max-width="50%">
      <v-card>
        <v-card-title>
          <span class="title">Deseja realmente excluir este link?</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <p class="font-weight-black">Pedido</p>
              <span class="font-weight-medium">{{
                objectItemDelete.id_pedido
              }}</span>
            </v-col>
            <v-col cols="12" md="2">
              <p class="font-weight-black">Link</p>
              <span class="font-weight-medium">{{
                objectItemDelete.id_pagamento
              }}</span>
            </v-col>
            <v-col cols="12" md="3">
              <p class="font-weight-black">Criado em</p>
              <span class="font-weight-medium">{{
                $moment_format_time(objectItemDelete.data_cobranca)
              }}</span>
            </v-col>
            <v-col cols="12" md="3">
              <p class="font-weight-black">Tipo Pagamento</p>
              <span class="font-weight-medium">{{
                objectItemDelete.tipo_pagamento
              }}</span>
            </v-col>
            <v-col cols="12" md="2">
              <p class="font-weight-black">Valor</p>
              <span class="font-weight-medium">{{
                $money_format(objectItemDelete.valor_cobranca)
              }}</span>
            </v-col>
          </v-row>
          <p></p>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" @click="dialogDelete = false">Cancelar</v-btn>
          <v-btn color="success" @click="deletar(objectItemDelete.id_pagamento)"
            >Continuar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogGerarLink" persistent width="800">
        <v-card>
          <v-card-title>
            <b class="headline"
              >Gerar Link - Pedido: {{ objectItemLink.id_pedidos }} - Aluno:
              {{ objectItemLink.aluno.nome }}
              {{ objectItemLink.aluno.sobrenome }}</b
            >
          </v-card-title>
          <v-card-text>
            <v-row class="justify-center">
              <v-col cols="6">
                <v-text-field
                  v-model="objectItemLink.aluno.email"
                  label="E-mail"
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  filled
                  ref="price"
                  v-money="$money"
                  v-model="valor"
                  label="Valor"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="6">
                <v-select
                  v-model="formasPagamento"
                  :items="arrayFormasPagamento"
                  label="Formas de pagamento"
                  outlined
                  @change="selectFormasPagamentoChange()"
                ></v-select>
                </v-col
            ></v-row>
            <v-row class="justify-center">
              <v-col v-if="formasPagamento == 'CREDITO'" cols="2">
                <v-select                  
                  v-model="parcelas"
                  :disabled="boletoSelected"
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                  label="Parcelas"
                  outlined
                ></v-select>
              </v-col>
              <v-col v-if="formasPagamento != null && formasPagamento != 'DINHEIRO'" cols="3">
                 <v-select
                 v-if="formasPagamento != null"
                  v-model="banco"
                  :items="bancos"
                  label="Banco"
                  outlined
                ></v-select>                
              </v-col>
            </v-row>
            <v-row v-if="boletoSelected" class="justify-center">
              <v-col>
                <v-textarea
                  v-model="obs_boleto"
                  class="text-uppercase"
                  no-resize
                  rows="3"
                  outlined
                  counter="100"
                  label="ObservaÃ§Ãµes do Boleto"
                  maxlength="100"
                  hint="Maximo 100 caracteres"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="close()">Cancelar</v-btn>
            <div class="flex-grow-1"></div>
            <v-btn @click="gerarLink()" color="success">Gerar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEmail" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Link de Pagamento</v-card-title>
        <v-card-text>
          <span
            >https://solident.com.br/pagamento/academico/{{
              cpfCrypto + codigo_link.id_pagamento
            }}</span
          >
          <v-btn @click="copyLink()" text icon color="pink">
            <v-icon>fa-copy</v-icon>
          </v-btn>
          <input
            type="hidden"
            id="linkCopy"
            :value="
              'https://solident.com.br/pagamento/academico/' +
              cpfCrypto +
              codigo_link.id_pagamento
            "
          />
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="danger" text @click="dialogEmail = false">Voltar</v-btn>
          <v-btn
            color="success"
            text
            @click="enviarEmail(codigo_link, codigo_link.id_pagamento)"
            >Enviar E-Mail</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogComprovante" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">Comprovante</v-card-title>
        <div id="printComprovante">
          <v-card-text style="height: 750px">
            <div v-if="objectComprovante.tipo_pagamento == 'BOLETO'">
              <h2 class="text-center">COMPROVANTE BOLETO PAGO</h2>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ $put_mask(objectComprovante.aluno.cpf, "cpf") }}</h5>
              <h5>
                <br />
                <b>NÃºmero Documento:</b>
                {{ objectComprovante.boleto_pagamento.document_number }}
              </h5>
              <h5>
                <b>Nosso NÃºmero:</b>
                {{ objectComprovante.boleto_pagamento.our_number }}
              </h5>
              <h5>
                <b>Pedido Online:</b>
                {{ objectComprovante.id_pedido }}
              </h5>
              <h5>
                <b>Total: </b>
                {{ $money_format(objectComprovante.valor_cobranca) }}
              </h5>
              <h5>
                <b>Vencimento:</b>
                {{
                  $moment_format(
                    objectComprovante.boleto_pagamento.expiration_date
                  )
                }}
              </h5>
              <h5>
                <b>Pago em:</b>
                {{
                  $moment_format_time(
                    objectComprovante.boleto_pagamento.received_at
                  )
                }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="objectComprovante.tipo_pagamento == 'CREDITO'"
            >
              <h2 class="text-center">
                COMPROVANTE
                <span
                  v-if="
                    objectComprovante.credito_pagamento.status == 'CONFIRMED'
                  "
                  >RESERVA PAGA</span
                >
                <span
                  v-else-if="
                    objectComprovante.credito_pagamento.status == 'APPROVED'
                  "
                  >CRÃ‰DITO PAGO</span
                >
                <span v-else>CANCELAMENTO</span>
              </h2>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ $put_mask(objectComprovante.aluno.cpf, "cpf") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedido }}
              </h5>
              <h5>
                <b>Total:</b>
                {{ $money_format(objectComprovante.valor_cobranca) }}
              </h5>
              <h5>
                <b>Bandeira:</b>
                {{ objectComprovante.credito_pagamento.bandeira }} -
                {{ objectComprovante.credito_pagamento.number_installments }}x
              </h5>
              <h5>
                <b>Banco:</b>
                {{ objectComprovante.credito_pagamento.banco }}
              </h5>
              <h5>
                <b>AutorizaÃ§Ã£o:</b>
                {{ objectComprovante.credito_pagamento.terminal_nsu }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{
                  objectComprovante.credito_pagamento.acquirer_transaction_id
                }}
              </h5>
              <div
                v-if="objectComprovante.credito_pagamento.status == 'CONFIRMED'"
              >
                <h5>
                  <b>Reservado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
                <h5>
                  <b>Cobrado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.confirm_date
                    )
                  }}
                </h5>
                <h5>
                  <b>Valor Cobrado:</b>
                  {{
                    $money_format(
                      objectComprovante.credito_pagamento.valor_cobrar
                    )
                  }}
                </h5>
              </div>
              <div
                v-else-if="
                  objectComprovante.credito_pagamento.status == 'APPROVED'
                "
              >
                <h5>
                  <b>Recebido em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
              </div>
              <div v-else>
                <h5>
                  <b>Reservado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
                <h5>
                  <b>Cancelado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.canceled_at
                    )
                  }}
                </h5>
              </div>
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
            <div v-if="objectComprovante.tipo_pagamento == 'BOLETO'">
              <h2 class="text-center">COMPROVANTE BOLETO PAGO</h2>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ $put_mask(objectComprovante.aluno.cpf, "cpf") }}</h5>
              <h5>
                <br />
                <b>NÃºmero Documento:</b>
                {{ objectComprovante.boleto_pagamento.document_number }}
              </h5>
              <h5>
                <b>Nosso NÃºmero:</b>
                {{ objectComprovante.boleto_pagamento.our_number }}
              </h5>
              <h5>
                <b>Pedido Online:</b>
                {{ objectComprovante.id_pedido }}
              </h5>
              <h5>
                <b>Total: </b>
                {{ $money_format(objectComprovante.valor_cobranca) }}
              </h5>
              <h5>
                <b>Vencimento:</b>
                {{
                  $moment_format(
                    objectComprovante.boleto_pagamento.expiration_date
                  )
                }}
              </h5>
              <h5>
                <b>Pago em:</b>
                {{
                  $moment_format_time(
                    objectComprovante.boleto_pagamento.received_at
                  )
                }}
              </h5>
            </div>
            <div
              style="width: 800px"
              v-if="objectComprovante.tipo_pagamento == 'CREDITO'"
            >
              <h2 class="text-center">
                COMPROVANTE
                <span
                  v-if="
                    objectComprovante.credito_pagamento.status == 'CONFIRMED'
                  "
                  >RESERVA PAGA</span
                >
                <span
                  v-else-if="
                    objectComprovante.credito_pagamento.status == 'APPROVED'
                  "
                  >CRÃ‰DITO PAGO</span
                >
                <span v-else>CANCELAMENTO</span>
              </h2>
              <h5>
                <b
                  >{{ objectComprovante.aluno.nome }}
                  {{ objectComprovante.aluno.sobrenome }}</b
                >
              </h5>
              <h5>{{ $put_mask(objectComprovante.aluno.cpf, "cpf") }}</h5>
              <h5>
                <br />
                <b>Pedido Online</b>
                {{ objectComprovante.id_pedido }}
              </h5>
              <h5>
                <b>Total:</b>
                {{ $money_format(objectComprovante.valor_cobranca) }}
              </h5>
              <h5>
                <b>Bandeira:</b>
                {{ objectComprovante.credito_pagamento.bandeira }} -
                {{ objectComprovante.credito_pagamento.number_installments }}x
              </h5>
              <h5>
                <b>Banco:</b>
                {{ objectComprovante.credito_pagamento.banco }}
              </h5>
              <h5>
                <b>AutorizaÃ§Ã£o:</b>
                {{ objectComprovante.credito_pagamento.terminal_nsu }}
              </h5>
              <h5>
                <b>NÂ° Comprovante:</b>
                {{
                  objectComprovante.credito_pagamento.acquirer_transaction_id
                }}
              </h5>
              <div
                v-if="objectComprovante.credito_pagamento.status == 'CONFIRMED'"
              >
                <h5>
                  <b>Reservado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
                <h5>
                  <b>Cobrado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.confirm_date
                    )
                  }}
                </h5>
                <h5>
                  <b>Valor Cobrado:</b>
                  {{
                    $money_format(
                      objectComprovante.credito_pagamento.valor_cobrar
                    )
                  }}
                </h5>
              </div>
              <div
                v-else-if="
                  objectComprovante.credito_pagamento.status == 'APPROVED'
                "
              >
                <h5>
                  <b>Recebido em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
              </div>
              <div v-else>
                <h5>
                  <b>Reservado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.authorized_at
                    )
                  }}
                </h5>
                <h5>
                  <b>Cancelado em:</b>
                  {{
                    $moment_format_time(
                      objectComprovante.credito_pagamento.canceled_at
                    )
                  }}
                </h5>
              </div>
            </div>
          </v-card-text>
        </div>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogComprovante = false"
            >Voltar</v-btn
          >
          <v-btn @click="printComprovante()" color="success" text
            >Imprimir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogItens" persistent max-width="1200px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Itens do Pedido - {{ $money_format(objectItem.valor_total) }}</span
          >
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
          <template v-slot:item.valor_item="{ item }">
            <span>{{ $money_format(item.valor_item) }}</span>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEmitir" persistent max-width="300">
      <v-card>
        <v-card-title class="headline error--text">AtenÃ§Ã£o!</v-card-title>
        <v-card-text
          >Deseja realmente emitir o pedido para o DC-INFO?</v-card-text
        >
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogEmitir = false">NÃ£o</v-btn>
          <v-btn color="success" text @click="emitirPedido(objectItem)"
            >Sim</v-btn
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
          {{ pedido_emitido.pedidoDcinfo }}

          <!-- <div v-if="divEnderecoEntrega1" id="printEnderecoEntrega">
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
          </div> -->
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
    <v-dialog v-model="dialogExcluirPedido" persistent max-width="350">
      <v-card>
        <v-card-title class="headline error--text">AtenÃ§Ã£o!</v-card-title>
        <v-card-text>Deseja realmente <b>EXCLUIR</b> este pedido?</v-card-text>
        <v-card-text>NÃƒO SERÃ POSSÃVEL DESFAZER ESTA AÃ‡ÃƒO!</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="success" @click="dialogExcluirPedido = false"
            >Voltar</v-btn
          >
          <v-btn color="error" @click="excluirPedido(objectItem)"
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
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    pode_fechar_menu_obs_financeiro: true,
    banco: null,
    bancos: [],
    status_link: false,
    search: "",
    data: [],
    expanded: [],
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
        value: "valor_item",
        text: "Valor",
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
    columnsPedidos: [
      {
        name: "data_pedido",
        label: "Data do pedido",
        align: "left",
        field: "data_pedido",
        sortable: false,
      },
      {
        name: "aluno",
        label: "Aluno",
        align: "left",
        field: "aluno",
        sortable: false,
      },
      {
        name: "pedido",
        label: "Pedido",
        align: "center",
        field: "id_pedidos",
        sortable: false,
      },
      {
        name: "valor",
        label: "Valor",
        align: "center",
        field: "valor_total",
        sortable: false,
      },
      {
        name: "frete",
        label: "Frete",
        align: "center",
        field: "valor_frete",
        sortable: false,
      },
      {
        name: "total",
        label: "Total",
        align: "center",
        field: "valor_total",
        sortable: false,
      },
      {
        name: "total_pago",
        label: "Total Pago",
        align: "center",
        field: "total_pago",
        sortable: false,
      },
      {
        name: "valor_restante",
        label: "Valor Restante",
        align: "center",
        field: "valor_restante",
        sortable: false,
      },
      // {
      //   name: "valor_credito",
      //   label: "Valor Credito",
      //   align: "center",
      //   field: "valor_credito",
      //   sortable: false,
      // },
      {
        name: "status_aluno",
        label: "Status",
        align: "center",
        field: "status_aluno",
        sortable: false,
      },
      {
        name: "acao",
        label: "AÃ§Ã£o",
        align: "center",
        field: "acao",
        sortable: false,
      },
    ],
    objectItem: {},
    objectItemLink: { aluno: {} },
    objectItemDelete: {},
    objectComprovante: {
      pagamento: {},
      credito: {},
      boleto: {},
      aluno: {},
      info_pagamento: {},
    },
    objectAluno: {},
    cpfCrypto: "",
    valor: 0,
    parcelas: 1,
    obs_boleto: "",
    searchItem: "",
    formasPagamento: null,
    arrayFormasPagamento: [
      { text: "BOLETO", value: "BOLETO" },
      { text: "CARTÃƒO DE CREDITO", value: "CREDITO" },
      { text: "PIX", value: "PIX" },
      { text: "DINHEIRO", value: "DINHEIRO" },
    ],
    boletoSelected: false,
    disabledBtn: true,
    dialog: false,
    dialogAcao: false,
    dialogGerarLink: false,
    dialogDelete: false,
    dialogEmail: false,
    dialogComprovante: false,
    dialogItens: false,
    dialogEmitir: false,
    dialogNumeroPedido: false,
    dialogExcluirPedido: false,
    divEnderecoEntrega1: false,
    showMenu: false,
    x: 0,
    y: 0,
  }),
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    await this.getDatas();
    await this.getPedidos();
  },

  computed: {
    ...mapGetters(["filteredPedidos"]),
    ...mapState({
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      pedidos: (state) => state.pedidoCobranca.pedidos,
      itens: (state) => state.pedidoAcademico.itens,
      alunoReceita: (state) => state.pedidoAcademico.alunoReceita,
      pedido_emitido: (state) => state.pedidoCobranca.pedido_emitido,
      codigo_link: (state) => state.pedidoCobranca.codigo_link,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
      error: (state) => state.pedidoCobranca.error,
    }),
    pedidos_filtrados() {
      return this.filteredPedidos({
        status: this.status_link,
        val: this.search,
      });
    },
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
    ...mapMutations([
      "set_snackbar",
      "set_loading",
      "set_codigo_link",
      "set_alunoReceita",
    ]),
    ...mapActions([
      "get_pedidos_cobranca_outros",
      "delete_link",
      "criar_link",
      "enviar_email_link",
      "get_itens",
      "get_cpf_receita",
      "emitir_pedido_cobranca",
      "excluir_pedido",
      "getDatas",
    ]),
    closeSnackbar() {
      this.set_snackbar({
        show: false,
      });
    },
    onMenuToggle(event, row) {
      if (!event) {
        if (row.obs_pagamento == undefined) {
          this.pode_fechar_menu_obs_financeiro = true;
        } else if (row.obs_pagamento.length > 0) {
          this.pode_fechar_menu_obs_financeiro = false;
          console.log("nao foi salvo oporra");
        }
      }
    },
    async salvarObsFinanceiro(row) {
      row.menu_obs_financeiro = false;
      console.log("obs", row.obs_pagamento);
      row.obs_pagamento = "";
    },
    async emitirPedido(pedido) {
      this.dialogEmitir = false;

      this.set_loading(true);
      await this.emitir_pedido_cobranca(pedido);
      this.set_loading(false);
      if (this.error) {
        this.set_snackbar({
          show: true,
          msg: "Erro no Servidor, Contate o Administrador",
          type: "error",
        });
      } else {
        console.log("foi", this.pedido_emitido);
        // let resposta = false;
        // if (this.pedido_emitido.hasOwnProperty("dadosEndereco")) {
        //   resposta = this.pedido_emitido.dadosEndereco;
        // }

        // if (typeof this.pedido_emitido == "object") {
        //   console.log(this.pedido_emitido);

        //   if (resposta != false) {
        //     this.dadosEndereco = resposta;
        //     // tem endereÃ§o de entrega, salvar no store pra tambem imprimir junto com o pedido
        //   }
        //this.$htmlToPaper("print");
        // mostral modal com o numero do pedido
        //this.dialogNumeroPedido = true;
        // if (Object.keys(this.enderecoEntrega).length) {
        //   this.divEnderecoEntrega1 = true;
        // } else {
        //   this.divEnderecoEntrega1 = false;
        // }
        // } else {
        //   this.set_snackbar({
        //     show: true,
        //     msg: "Erro no Servidor, Contate o Administrador",
        //     type: "error",
        //   });
        // }
        this.getPedidos();
      }
    },
    async confirmEmitir(row) {
      this.objectItem = Object.assign({}, row);
      this.objectItem.has_consulta_receita = false;
      if (typeof this.objectItem.aluno.obj_consulta_cpf_receita == "object") {
        this.set_loading(true);
        await this.get_cpf_receita(this.objectItem.aluno.cpf);
        this.set_loading(false);
        if (this.error) {
          this.set_snackbar({
            show: true,
            msg: "Erro no Servidor, Contate o Administrador",
            type: "error",
          });
        } else {
          this.objectItem.aluno.obj_consulta_cpf_receita = this.alunoReceita;
          this.objectItem.has_consulta_receita = true;
          this.dialogEmitir = true;
        }
      } else {
        this.dialogEmitir = true;
      }
    },
    async showItens(row) {
      this.objectItem = Object.assign({}, row);
      this.set_loading(true);
      await this.get_itens(row.id_pedidos);
      this.dialogItens = true;
      this.set_loading(false);
    },
    showComprovante(pedido) {
      var result = this.pedidos.find((obj) => {
        return obj.id_pedidos === pedido.id_pedido;
      });
      this.objectComprovante = Object.assign({}, pedido);
      this.objectComprovante.aluno = result.aluno;
      this.dialogComprovante = true;
    },
    async gerarLink() {
      let valor = parseFloat(this.valor.replace(/[^\d]/g, ""));
      valor = valor / 100;
     
      if (valor > this.objectItemLink.diferencaTotal) {
        this.set_snackbar({
          show: true,
          msg: "O valor do Link nÃ£o pode ser maior que o valor total restante do pedido!",
          type: "warning",
          time: 2000,
        });
      }else{
      if (this.formasPagamento == 'DINHEIRO') {
        this.banco = 'SOLIDENT'
      }
      if (valor < 50) {
        this.set_snackbar({
          show: true,
          msg: "Valor Minimo Para Gerar um Link Ã© de R$ 50,00",
          type: "warning",
          time: 2000,
        });
      } else if (this.formasPagamento == null) {
        this.set_snackbar({
          show: true,
          msg: "Selecione Pelo menos uma Forma de Pagamento",
          type: "warning",
          time: 2000,
        });
      } else if (this.banco == null) {
        this.set_snackbar({
          show: true,
          msg: "Selecione Pelo menos um Banco",
          type: "warning",
          time: 2000,
        });
      } else {
        this.set_loading(true);
        let link = {
          id_pedido: this.objectItemLink.id_pedidos,
          obs_boleto_cobranca:
            this.formasPagamento == "BOLETO" ? this.obs_boleto : "",
          tipo_pagamento: this.formasPagamento,
          status_pagamento: "NÃƒO PAGO",
          data_cobranca: this.$moment_now_db(),
          valor_cobranca: valor,
          max_parcela_cobranca: this.parcelas,
          banco_cobranca: this.banco,
          cpf: this.objectItemLink.aluno.cpf,
          nome:
            this.objectItemLink.aluno.nome.trim() +
            " " +
            this.objectItemLink.aluno.sobrenome.trim(),
        };
        await this.criar_link(link);
        this.set_loading(false);
        await this.getPedidos();
        if (this.formasPagamento != 'DINHEIRO') {
          this.cpfCrypto = this.cryptoGaleda(this.objectItemLink.aluno.cpf);
          this.dialogEmail = true;          
        }
        this.close();
        this.set_snackbar({
          show: true,
          msg: "Link Criado",
          type: "success",
          time: 2000,
        });
      }
      }
    },
    calcExpirationDate(pagamentos) {
      for (let pagamento of pagamentos) {
        if (
          pagamento.tipo_pagamento == "BOLETO" &&
          pagamento.status_pagamento == "EM ABERTO"
        ) {
          if (
            this.$moment_compare(pagamento.boleto_pagamento.expiration_date) > 0
          ) {
            pagamento.boleto_pagamento.vencido = true;
          }
        }
      }
    },
    // calcValorCredito(row) {
    //   let total = 0.0;
    //   let credito = 0;
    //   if (row.pagamentos.length == 0) return this.$money_format(0.0);
    //   for (let pagamento of row.pagamentos) {
    //     if (pagamento.status_pagamento == "PAGO") {
    //       total += pagamento.valor_cobranca;
    //     }
    //   }
    //   if (total > row.valor_total) {
    //     credito = total - row.valor_total;
    //   }
    //   return this.$money_format(credito);
    // },
    calcTotalPago(row) {
      let total = 0.0;
      if (row.pagamentos.length == 0) return this.$money_format(0.0);
      for (let pagamento of row.pagamentos) {
        if (pagamento.status_pagamento == "PAGO") {
          total += pagamento.valor_cobranca;
        }
      }

      return this.$money_format(total);
    },
    calcValorRestante(row) {
      let total = 0.0;
      let restante = 0.0;
      if (row.pagamentos.length == 0) return this.$money_format(0.0);
      for (let pagamento of row.pagamentos) {
        if (pagamento.status_pagamento == "PAGO") {
          total += pagamento.valor_cobranca;
        }
      }
      restante = row.valor_frete + row.valor_total - total;
      restante = restante < 0 ? 0 : restante;
      row.status_aluno =
        restante == 0 ? "PAGO" : "AGUARDANDO PAGAMENTO PARCIAL";
      return this.$money_format(restante);
    },
    async getPedidos() {
      this.set_loading(true);
      await this.get_pedidos_cobranca_outros({
        de: this.data_de,
        ate: this.data_ate,
      });
      this.set_loading(false);
      console.log(this.pedidos);
    },
    criarLink(item) {
      let somaLinks = 0.0;
      let diferencaTotal = 0.0;
     
      for (let i of item.pagamentos) {       
        somaLinks += i.valor_cobranca;
      }
      diferencaTotal = item.valor_total - somaLinks;
      item.somaLinks = somaLinks;      
      item.diferencaTotal = parseFloat(diferencaTotal);     
      this.objectItemLink = item;
      this.dialogGerarLink = true;
    },
    selectFormasPagamentoChange() {
      this.banco = null;
      this.bancos = [];
      if (this.formasPagamento === "BOLETO") {
        this.bancos.push('SANTANDER');
        this.boletoSelected = true;
        this.parcelas = 1;
      } else {
        this.descricaoBoleto = "";
        this.boletoSelected = false;
      }      
      if (this.formasPagamento === "PIX") {
         this.bancos.push('BB');    
      }
      if (this.formasPagamento === "CREDITO") {
         this.bancos.push('SANTANDER', 'SAFRA');    
      }
    },
    close() {
      this.$refs.price.$el.getElementsByTagName("input")[0].value = 0;
      this.valor = 0;
      this.formasPagamento = null;
      this.disabledBtn = true;
      this.boletoSelected = false;
      this.dialogGerarLink = false;
    },
    deletarLink(item) {
      this.objectItemDelete = item;
      this.dialogDelete = true;
    },
    async deletar(id) {
      this.set_loading(true);
      await this.delete_link(id);
      this.set_loading(false);
      this.dialogDelete = false;
      await this.getPedidos();
    },
    show(e, item) {
      if (item.status_pagamento != "NÃƒO PAGO") {
        this.x = e.clientX;
        this.y = e.clientY;
        this.objectItem = { ...item };
        this.showMenu = true;
      }
    },
    showSnackbar(msg, type, time = 0) {
      this.msgSnackbar = msg;
      this.typeSnackbar = type;
      this.snackbar = true;
      this.timeSnackbar = time;
    },
    printComprovante() {
      this.$htmlToPaper("printComprovante");
      this.dialogComprovante = false;
    },
    copyLink() {
      let copy = document.querySelector("#linkCopy");
      copy.setAttribute("type", "text");
      copy.select();
      try {
        let success = document.execCommand("copy");
        if (success) {
          this.set_snackbar({
            show: true,
            msg: "Link Copiado",
            type: "success",
            time: 2000,
          });
        } else {
          this.set_snackbar({
            show: true,
            msg: "Erro ao Copiar",
            type: "error",
            time: 2000,
          });
        }
      } catch (error) {
        this.set_snackbar({
          show: true,
          msg: error,
          type: "error",
          time: 2000,
        });
      }

      copy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    enviarLink(aluno, row) {
      this.objectAluno = Object.assign({}, aluno);
      this.set_codigo_link(row);
      this.cpfCrypto = this.cryptoGaleda(aluno.cpf);
      this.dialogEmail = true;
    },
    cryptoGaleda(cpf) {
      let data = "";
      cpf = cpf.split("").reverse().join("");
      let str1 = cpf.substring(0, 5);
      let str2 = cpf.charAt(5);
      let str3 = cpf.substring(6);

      return data.concat(str3, str1, str2);
    },
    async enviarEmail(item) {
      this.set_loading(true);
      var result = this.pedidos.find((obj) => {
        return obj.id_pedidos === item.id_pedido;
      });
      let link = {
        template:
          item.status_pagamento == "NÃƒO PAGO" ? "cobranca" : "cobranca_boleto",
        nome: result.aluno.nome + " " + result.aluno.sobrenome,
        email: result.aluno.email,
        pedido: result.id_pedidos,
        link: this.cpfCrypto + item.id_pagamento,
        valor: this.$money_format(item.valor_cobranca),
        boleto: item.boleto_pagamento,
      };
      await this.enviar_email_link(link);
      this.set_loading(false);
      this.dialogEmail = false;
    },
    showDialogExcluirPedido(row) {
      console.log("epa", row);
      let pode = true;
      for (let pagamento of row.pagamentos) {
        if (pagamento.status_pagamento == "PAGO") {
          pode = false;
        }
      }
        if (row.pagamentos.length) {
          pode = false;
      }
      if (pode) {
        this.objectItem = { ...row };
        this.dialogExcluirPedido = true;
      } else {
        this.set_snackbar({
          show: true,
          msg: "NÃƒO Ã‰ POSSIVEL EXCLUIR ESTE PEDIDO, POIS O MESMO POSSUI LINK PAGO",
          type: "warning",
          time: 3000,
        });
      }
    },
    async excluirPedido(row) {
      this.set_loading(true);
      await this.excluir_pedido(row);
      this.dialogExcluirPedido = false;
      this.set_loading(false);
      if (!this.error) {
        this.set_snackbar({
          show: true,
          msg: "O PEDIDO FOI EXCLUIDO",
          type: "success",
          time: 3000,
        });
        await this.getPedidos();
      }
    },
  },
};
</script>
