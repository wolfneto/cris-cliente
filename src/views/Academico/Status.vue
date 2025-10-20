<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row justify="center" class="custom-row">
          <v-col cols="4">
            <v-text-field
              v-model="data_de"
              v-mask="'##/##/####'"
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
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
              :rules="[(v) => !!v.trim() || 'Data obrigatória!']"
              placeholder="dd/mm/aaaa"
              label="Até"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        Pedidos Acadêmico
        <v-btn small class="ml-3" @click="getPedidos()">Atualizar</v-btn>
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
        <v-menu
          v-model="menuFiltros"
          :close-on-content-click="false"
          :nudge-width="400"
          offset-x
        >
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
              <!-- <v-row dense>
                <v-col>
                  <v-select
                    @change="changeFilter"
                    multiple
                    v-model="selectedStatusPagamento"
                    dense
                    hide-details
                    :items="statusPagamento"
                    label="Status"
                  ></v-select>
                </v-col>
              </v-row>-->
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="warning" @click="clearFilter(true)"
                >Limpar Filtros</v-btn
              >
              <v-btn text @click="menuFiltros = false">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <span class="primary--text body-1 ml-3">Filtro Ativo:</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoGrupo" class="red--text body-1">{{
          filtroAtivoGrupo
        }}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoStatus" class="red--text body-1">{{
          filtroAtivoStatus
        }}</span>
        <i class="ml-2 mr-2 grey--text fas fa-angle-right"></i>
        <span v-if="filtroAtivoSistema" class="red--text body-1">{{
          filtroAtivoSistema
        }}</span>
      </v-card-subtitle>

      <q-virtual-scroll
        class="my-sticky-dynamic"
        type="table"
        dense
        style="max-height: 70vh"
        virtual-scroll
        :virtual-scroll-slice-size="50"
        :virtual-scroll-item-size="48"
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
                {{ row.data_pedido }} {{ row.hora_pedido }}
              </div>
              <div v-if="col.name == 'aluno'">
                {{ row.aluno.nome }} {{ row.aluno.sobrenome }}
                <br />
                {{ putMask(row.aluno.cpf, "cpf/cnpj") }}
                <br />
                {{ putMask(row.aluno.celular, "celular") }}
                <br />
                {{ row.aluno.email }}
              </div>
              <div v-if="col.name == 'grupo'">{{ row.grupo }}</div>
              <div v-if="col.name == 'id_pedidos'">
                {{ row.id_pedidos }}
                <br />
                {{ row.pedido_dcinfo }}
              </div>
              <div v-if="col.name == 'valor_total'">
                R$ {{ row.valor_total.toFixed(2).replace(".", ",") }}
              </div>
              <div v-if="col.name == 'pagamento'">
                <v-chip
                  class="text-center"
                  :color="colorStatusSistema(row.pagamento.status_pagamento)"
                  dark
                  >{{ row.pagamento.status_pagamento }}</v-chip
                >
              </div>
              <div v-if="col.name == 'status_aluno'">
                <div
                  v-if="
                    row.status_aluno == 'CONFERIDO' ||
                      row.status_aluno == 'FATURADO'
                  "
                >
                  <v-chip
                    :class="
                      row.valor_faturado < row.valor_total
                        ? 'text-center warning-conferido'
                        : 'text-center black'
                    "
                    @click="showStatus($event, row)"
                    :color="colorStatusSistema(row.status_aluno)"
                    dark
                    >{{ row.status_aluno }}</v-chip
                  >
                  R$ {{ row.valor_faturado.toFixed(2).replace(".", ",") }}
                </div>
                <div
                  v-else-if="
                    row.status_aluno == 'EMITIDO' ||
                      row.status_aluno == 'APROVADO' ||
                      row.status_aluno == 'SEPARANDO' ||
                      row.status_aluno == 'SEPARADO' ||
                      row.status_aluno == 'PAUSADO'
                  "
                >
                  <v-chip
                    @click="showStatus($event, row)"
                    :color="colorStatusSistema(row.status_aluno)"
                    dark
                    >{{ row.status_aluno }}</v-chip
                  >
                </div>
                <div v-else>
                  <v-chip :color="colorStatusSistema(row.status_aluno)" dark>{{
                    row.status_aluno
                  }}</v-chip>
                </div>
              </div>
              <div v-if="col.name == 'acao'">
                <v-btn
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
      </v-list>
    </v-menu>
    <!-- MENU BOTOES -->
    <v-dialog v-model="dialogItens" persistent max-width="1200px">
      <v-card>
        <v-card-title>
          <span class="headline">Itens Originais do Pedido - </span>
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
export default {
  data: () => ({
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",
    search: "",
    loading: false,
    selectedGrupo: [],
    selectedStatusPagamento: [],
    filteredPedidos: [],
    menuFiltros: false,
    filtroAtivoGrupo: false,
    filtroAtivoStatus: false,
    filtroAtivoSistema: false,
    showMenuBotoes: false,
    dialogItens: false,
    searchItem: "",
    objectItem: {},
    x: 0,
    y: 0,
    permissoes: {},
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
        label: "Total",
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
        label: "Ação",
        sortable: false,
      },
    ],
    headersItens: [
      {
        value: "qtd_item",
        text: "QTD",
      },
      {
        value: "descri_item",
        text: "DESCRIÇÃO",
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
    ...mapGetters(["colorStatusSistema"]),
    ...mapState({
      data_inicial: (state) => state.config.data_inicial,
      data_final: (state) => state.config.data_final,
      pedidos: (state) => state.pedidoAcademico.pedidos,
      itens: (state) => state.pedidoAcademico.itens,
      error: (state) => state.pedidoAcademico.error,
      statusPedidoDcInfo: (state) => state.pedidoAcademico.statusPedidoDcInfo,
    }),
    data_de: {
      get() {
        if (this.permissoes.qtd_dias_data_inicial > 0) {
          return this.$moment_format_subtract_days(new Date(), this.permissoes.qtd_dias_data_inicial)
        }else{
          return this.data_inicial;
        }
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
    grupos: function() {
      let data = [];
      for (const pedido of this.pedidos) {
        data.push(pedido.grupo);
      }     
      data = data.sort();
      return data;
    },
    statusPagamento: function() {
      let data = [];
      for (const pedido of this.pedidos) {
        data.push(pedido.pagamento.status_pagamento);
      }
      return data;
    },
  },
  methods: {
    ...mapActions(["getDatas", "get_pedidos", "get_status_pedido_dcinfo", "get_itens"]),
    async showItens(row) {
      this.loading = true;
      await this.get_itens(row.id_pedidos);
      this.dialogItens = true;
      this.loading = false;
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
        await this.getStatusPedidoDcInfo(row);
        this.$nextTick(() => {
          this.loading = false;
        });
      } else if (row.status_aluno != "CANCELADO") {
        this.loading = true;
        await this.getStatusPedidoDcInfo(row);
        this.$nextTick(() => {
          this.loading = false;
        });
      }
    },
    async getStatusPedidoDcInfo(row) {
      if (row.entregue == 0) {
        await this.get_status_pedido_dcinfo(row.pedido_dcinfo);
        row.status_aluno = this.alteraNomeStatus(
          this.statusPedidoDcInfo.ystatus
        );
      }
    },
    putMask(item, type) {
      if (item != null) {
        switch (type) {
          case "cpf/cnpj":
            if (item.length < 14) {
              return this.$mask.apply(item, "000.000.000-00");
            } else {
              return this.$mask.apply(item, "00.000.000/0000-00");
            }
          case "celular":
            if (item.length == 11) {
              return this.$mask.apply(item, "(00) 0 0000-0000");
            } else {
              return this.$mask.apply(item, "(00) 0000-0000");
            }
          default:
            break;
        }
      }
    },
    async getPedidos() {
      this.loading = true;
      await this.get_pedidos({
        de: this.data_de,
        ate: this.data_ate,
        emitido: this.emitido,
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

        this.search = this.search.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '');
        searchPedidoNome = this.pedidos.filter((i) =>
          i.aluno.nome.includes(this.search.toUpperCase())
        );
        if (searchPedidoNome.length) {
          this.filteredPedidos = searchPedidoNome;
        }
   
        if (!searchPedidoNome.length) { 
          searchPedidoSobrenome = this.pedidos.filter((i) =>
            i.aluno.sobrenome.includes(this.search.toUpperCase())
          );
          if (searchPedidoSobrenome.length) {
            this.filteredPedidos = searchPedidoSobrenome;
          }
          
        }

        if (!searchPedidoNome.length && !searchPedidoSobrenome.length && this.search.length == 11) {
          searchPedidoCpf = this.pedidos.filter((i) =>
            i.aluno.cpf.includes(this.search.toUpperCase())
          );
          if (searchPedidoCpf.length) {
            this.filteredPedidos = searchPedidoCpf;
          }          
        }

        if (!searchPedidoCpf.length && this.search.length == 5) {          
          searchPedidoId = this.pedidos.filter((i) =>
            i.id_pedidos.toString().includes(this.search)
          );
          if (searchPedidoId.length) {
            this.filteredPedidos = searchPedidoId;
          }
        }

        if (!searchPedidoCpf.length && !searchPedidoId.length && this.search.length == 7) {  
          searchPedidoDcinfo = this.pedidos.filter((i) => {
          if (i.pedido_dcinfo != null) {
            return i.pedido_dcinfo.includes(this.search.toUpperCase());
          }
        });
        if (searchPedidoDcinfo.length) {
          this.filteredPedidos = searchPedidoDcinfo;
        }
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
      }
    },
    getPermissao() {
      this.$axios
        .get("/usuario/permissao/pagina", {
          params: {
            id_usuario: this.$usuario.value.id,
            pagina: "pedidos_status",
          },
        })
        .then((res) => {
          this.permissoes = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
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
  },
};
</script>
<style>
.warning-conferido {
  background: rgb(2, 0, 36) !important;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 87%,
    rgba(250, 247, 0, 1) 87%
  ) !important;
}
</style>
