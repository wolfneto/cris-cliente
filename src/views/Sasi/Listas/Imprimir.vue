<template>
  <v-container>
    <v-card id="print" style="margin-bottom: 90px !important;">
      <v-card-title>
        <b>{{ lista.id_lista }} - </b> {{ lista.faculdade }} - {{ lista.semestre }} - {{ lista.nome_exibi_lista }}
        <v-btn class="ml-3 error d-print-none" @click="$parent.imprimir = false;">Voltar</v-btn>
        <v-btn
          v-if="$parent.permissoes.check_imprimir_gerencial == 1 || imprimirAluno && !imprimirOpcional || imprimirAluno && imprimirOpcional || imprimirAlunoSistema"
          class="ml-3 mr-3 primary d-print-none" @click="imprimir()">Imprimir</v-btn>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn class="ml-3 d-print-none" color="indigo" dark v-on="on">Opções</v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-action>
                  <v-switch @change="imprimirAlunoChange()" v-model="imprimirOpcional" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Imprimir Opcionais</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="$parent.permissoes.check_imprimir_gerencial == 1">
                <v-list-item-action>
                  <v-switch @change="imprimirPadraoChange()" v-model="imprimirPadrao" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Imprimir Padrão</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="$parent.permissoes.check_imprimir_gerencial == 1">
                <v-list-item-action>
                  <v-switch v-model="imprimirGerencial" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Imprimir Gerencial</v-list-item-title>
              </v-list-item>
              <v-list-item>               
                <v-list-item-action>
                <v-switch @change="imprimirAlunoChange()" v-model="imprimirAluno" color="purple"></v-switch>
                 </v-list-item-action>
                 <v-list-item-title>Imprimir Aluno</v-list-item-title>
                 <v-list-item-action>              
                <v-switch v-if="imprimirAluno" v-model="removeValorSite" color="purple"></v-switch>                 
                  </v-list-item-action>  
                  <v-list-item-title v-if="imprimirAluno" class="ml-5">Remove Valor Site</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-switch @change="imprimirAlunoChange()" v-model="imprimirAlunoSistema" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Imprimir P/ Aluno C/ Descrição Sistema</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="$parent.permissoes.check_imprimir_mauricio == 1">
                <v-list-item-action>
                  <v-switch @change="imprimirMauricioChange()" v-model="imprimirMauricio" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Imprimir P/ Aluno Mauricio</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-card-title>
      <v-card-subtitle style="color:black !important">
        <h6><b>Criada em: {{ lista.date_create }}</b></h6>
        <div v-if="imprimirMauricio">
          <h6>Orçamento Valido Até: {{ validade }}</h6>
          <v-text-field class="d-print-none" v-model="validade"></v-text-field>
        </div>

      </v-card-subtitle>
      <v-container fluid>
        <v-row>
          <v-col v-if="imprimirGerencial" cols="12" sm="3" md="3" lg="3">
            <h6>
              <b>Sistema:</b>
              {{(lucroSistema * 1).toFixed(2).replace('.', ',')}}%
            </h6>
            <h6>
              <b>Site:</b>
              {{(lucroSite * 1).toFixed(2).replace('.', ',')}}%
            </h6>
          </v-col>
          <v-col cols="12" sm="3" md="3" lg="3">
            <h6 v-if="imprimirPadrao || imprimirGerencial">
              <b>Valor Sistema:</b>
              R$ {{(valorTotalSistema * 1).toFixed(2).replace('.', ',')}}
            </h6>
            <h6 v-if="imprimirPadrao || imprimirGerencial || imprimirAluno && !removeValorSite || imprimirAlunoSistema || imprimirMauricio">
              <b>Valor Site:</b>
              R$ {{(valorTotalSite * 1).toFixed(2).replace('.', ',')}}
            </h6>
          </v-col>
          <v-col v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
            cols="12" sm="3" md="3" lg="3">
            <h6>
              <b>Total Itens:</b>
              {{ totalItens }}
            </h6>
            <h6>
              <b>Total Itens Opcionais:</b>
              {{ totalItensOpcionais }}
            </h6>
          </v-col>
          <v-col v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
            cols="12" sm="3" md="3" lg="3">
            <h6 v-if="!imprimirAluno && !imprimirMauricio && !imprimirAlunoSistema">
              <b>Desconto Aplicado:</b>
              {{ descontoGeral }}%
            </h6>
          </v-col>
        </v-row>
      </v-container>
      <div v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
        class="text-left">
        <small>
          <b>{{ dateNowImpress() }}</b>
        </small>
      </div>
      <table class="table table-sm table-fixed table-hover table-bordered text-center">
        <thead class="thead-dark">
          <tr v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
            class="d-flex">
            <th v-if="!imprimirAluno && !imprimirAlunoSistema" class="col-1">Codigo</th>
            <th class="col-1">Qtd/Saldo</th>
            <th :class="!imprimirAluno && !imprimirAlunoSistema ? 'col-4' : 'col-5'">Descricao</th>
            <th v-if="!imprimirAluno && !imprimirAlunoSistema" class="col-2">Valor</th>
            <th class="col-2">Marca</th>
            <th v-if="!imprimirAluno && !imprimirAlunoSistema" class="col-1">Disp/Op</th>
            <th :class="imprimirAluno || imprimirAlunoSistema ? 'col-4' : 'col-1'">Obs</th>
          </tr>
        </thead>
        <tbody v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">
          <tr class="d-flex border border-dark" v-for="item of itensNoOptional" :key="item.id">
            <td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-1">
              <b v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio">{{ item.cod }}</b>
              <div v-if="item.imagem_item == 1 && imprimirGerencial">
                <hr class="mt-12">
                <v-btn x-small class="ma-1" color="grey" icon>
                  <v-icon dark>fas fa-camera</v-icon>
                </v-btn>
              </div>
              <div v-if="item.marcaOpcional && !imprimirAluno && !imprimirAlunoSistema">
                <br />
                <b>Codigo Marca Opcional</b>
                <br />
                <span class="bg-primary">{{ item.codMarcaOpcional }}</span>
              </div>
            </td>
            <td v-if="!item.titulo && item.disponivel_item == 0" class="col-1">
              <div>
                <b>Indisponível</b>
              </div>
            </td>
            <td v-if="!item.titulo && item.disponivel_item == 1" class="col-1">
              <b
                v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">Qtd:</b>
              <b
                v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">{{ item.qtd_item }}</b>
              <br />
              <div v-if="!imprimirAluno && !imprimirMauricio && !imprimirAlunoSistema">
                <b
                  v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">Saldo:</b>
                <b
                  v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">{{ item.saldo }}</b>
                <div v-if="imprimirGerencial" class="mt-3">
                  <span>{{ item.lucro }}</span>
                </div>
              </div>
            </td>
            <td v-if="!item.titulo" :class="!imprimirAluno && !imprimirAlunoSistema ? 'col-4' : 'col-5'">
              <div v-if="imprimirPadrao || imprimirGerencial">
                <b>Descrição Sistema</b>
                <br />
                <div>{{ item.descricao }}</div>
                <br />
              </div>
              <b v-if="imprimirPadrao || imprimirGerencial">Descrição Site</b>
              <br v-if="imprimirPadrao || imprimirGerencial" />
              <div
                :class="imprimirAluno || imprimirAlunoSistema ? 'text-left text-uppercase' : 'text-center text-uppercase'">
                <div
                  v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio || imprimirAluno && !imprimirAlunoSistema">
                  {{ item.descri_item }}</div>
                <div v-if="imprimirAlunoSistema">{{ item.descricao }}</div>
              </div>
              <div v-if="item.marcaOpcional">
                <hr />
                <b
                  v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">Descrição
                  Marca Opcional</b>
                <br />
                <div
                  :class="imprimirAluno || imprimirAlunoSistema ? 'text-left text-uppercase bg-primary' : 'text-center text-uppercase bg-primary'">
                  <p
                    v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">
                    {{ item.descricaoMarcaOpcional }}</p>
                </div>
              </div>
            </td>
            <td v-if="item.titulo" width="100%" justify="center">
              <b>{{ item.descri_item }}</b>
            </td>
            <td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-2">
              <div v-if="imprimirPadrao || imprimirGerencial">
                <b>Valor Sistema</b>
                <br />
                <!-- <div>{{(item.valor * item.qtd_item).toFixed(2)}}</div> -->
                <div v-if="!item.valor">R$ 0,00 </div>
                <div v-else>R$ {{(item.valor * 1).toFixed(2).replace('.', ',')}}</div>
                <hr />
              </div>
              <div v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio">
                <b>Site</b>
                <!-- <div>R$ {{(item.valor_site * item.qtd_item).toFixed(2)}}</div> -->
                <v-row>
                  <v-col cols="6">
                    <b>Unitário</b>
                    <br />
                    R$ {{(item.valor_site * 1).toFixed(2).replace('.', ',')}}
                  </v-col>
                  <v-col cols="6">
                    <b>Total</b>
                    <br />
                    R$ {{(item.valor_site * item.qtd_item).toFixed(2).replace('.', ',')}}
                  </v-col>
                </v-row>
              </div>
              <div v-if="item.marcaOpcional">
                <hr />
                <b v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio">Valor Marca Opcional</b>
                <br />
                <span v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio" class="bg-primary">R$
                  {{ item.valorMarcaOpcional.toFixed(2).replace('.', ',') }}</span>
              </div>
            </td>
            <td v-if="!item.titulo" class="col-2">
              <div
                v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
                class="text-center">{{ item.marca }}</div>
              <v-simple-table v-if="item.cor && item.rowsCores.length && imprimirGerencial" fixed-header height="auto"
                dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">Saldo</th>
                      <th class="text-center">Codigo</th>
                      <th class="text-center">Cor</th>
                    </tr>
                  </thead>
        <tbody>
          <tr v-for="c in item.rowsCores" :key="c.codigo">
            <td>{{ c.saldo }}</td>
            <td>{{ c.codigo }}</td>
            <td>{{ c.cor }}</td>
          </tr>
        </tbody>
</template>
</v-simple-table>
<div v-if="item.marcaOpcional">
  <br />
  <hr />
  <b v-if="!imprimirAluno && !imprimirAlunoSistema">Marca Opcional</b>
  <div class="text-center bg-primary">{{ item.nomeMarcaOpcional }}</div>
</div>
</td>
<td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-1">
  <div v-if="!item.titulo && imprimirPadrao || imprimirGerencial || imprimirMauricio">
    <b>Disponível:</b>
    <br />
    <span v-if="item.disponivel_item == 1">SIM</span>
    <span v-else>NÃO</span>
  </div>
  <div v-if="!item.titulo && imprimirPadrao || imprimirGerencial || imprimirMauricio">
    <br v-if="!item.titulo" />
    <b>Opcional:</b>
    <br />
    <span v-if="item.opcional_item == 1">SIM</span>
    <span v-else>NÃO</span>
  </div>
</td>
<td v-if="!item.titulo" class="col-1"
  :class="imprimirAluno || imprimirAlunoSistema ? 'col-4 text-center' : 'col-1 text-center'">
  <div v-if="imprimirGerencial || imprimirPadrao || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">
    {{ item.obs_item }}</div>
</td>
</tr>
<tr class="d-flex border border-dark text-center" v-if="itensOpcional.length > 0 && imprimirOpcional">
  <td class="col-12">
    <h3 class="mt-n2">Opcionais</h3>
    <small>
      <b>(Não inclusos no valor total da lista)</b>
    </small>
  </td>
</tr>
<tr class="d-flex border border-dark" v-for="item in itensOpcional" :key="item.sdada" v-if="imprimirOpcional">
  <td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-1">
    <b v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio">{{ item.cod }}</b>
    <div v-if="item.marcaOpcional && !imprimirAluno && !imprimirAlunoSistema">
      <br />
      <b>Codigo Marca Opcional</b>
      <br />
      <span class="bg-primary">{{ item.codMarcaOpcional }}</span>
    </div>
  </td>
  <td v-if="!item.titulo && item.disponivel_item == 0" class="col-1">
    <div>
      <b>Indisponível</b>
    </div>
  </td>
  <td v-if="!item.titulo && !item.disponivel_item == 0" class="col-1">
    <b v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">Qtd:</b>
    <b
      v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">{{ item.qtd_item }}</b>
    <div v-if="imprimirPadrao || imprimirGerencial">
      <b>Saldo:</b>
      <b>{{ item.saldo }}</b>
      <div v-if="imprimirGerencial" class="mt-3">
        <span>{{ item.lucro }}</span>
      </div>
    </div>
  </td>
  <td v-if="!item.titulo" :class="!imprimirAluno && !imprimirAlunoSistema ? 'col-4' : 'col-5'">
    <div v-if="imprimirPadrao || imprimirGerencial">
      <b>Descrição Sistema</b>
      <br />
      <div>{{ item.descricao }}</div>
      <br />
    </div>
    <b v-if="imprimirPadrao || imprimirGerencial">Descrição Site</b>
    <br v-if="imprimirPadrao || imprimirGerencial" />
    <div :class="imprimirAluno || imprimirAlunoSistema ? 'text-left text-uppercase' : 'text-center text-uppercase'">
      <div v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio || imprimirAluno && !imprimirAlunoSistema">
        {{ item.descri_item }}</div>
      <div v-if="imprimirAlunoSistema">{{ item.descricao }}</div>
    </div>
    <div v-if="item.marcaOpcional">
      <hr />
      <b v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">Descrição
        Marca Opcional</b>
      <br />
      <div
        :class="imprimirAluno || imprimirAlunoSistema ? 'text-left text-uppercase bg-primary' : 'text-center text-uppercase bg-primary'">
        <p v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">
          {{ item.descricaoMarcaOpcional }}</p>
      </div>
    </div>
  </td>
  <td v-if="item.titulo && item.opcional_item == 1" width="100%" justify="center">
    <b>{{ item.descri_item }}</b>
  </td>
  <td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-2">
    <!-- <div>R$ {{(item.valor_site * item.qtd_item).toFixed(2)}}</div> -->
    <div v-if="!imprimirMauricio">
      <b>Valor Sistema</b>
      <br />
      <!-- <div>{{(item.valor * item.qtd_item).toFixed(2)}}</div> -->
      <div>R$ {{(item.valor * 1).toFixed(2).replace('.', ',')}}</div>
      <hr />
    </div>
    <b>Site</b>
    <div>
      <v-row>
        <v-col cols="6">
          <b>Unitário</b>
          <br />
          R$ {{(item.valor_site * 1).toFixed(2).replace('.', ',')}}
        </v-col>
        <v-col cols="6">
          <b>Total</b>
          <br />
          R$ {{(item.valor_site * item.qtd_item).toFixed(2).replace('.', ',')}}
        </v-col>
      </v-row>
    </div>
    <div v-if="item.marcaOpcional">
      <hr />
      <b v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio">Valor Marca Opcional</b>
      <br />
      <span v-if="imprimirPadrao || imprimirGerencial || imprimirMauricio" class="bg-primary">R$
        {{ item.valorMarcaOpcional.toFixed(2).replace('.', ',') }}</span>
    </div>
  </td>
  <td v-if="!item.titulo" class="col-2">
    <div v-if="imprimirPadrao || imprimirGerencial || imprimirAluno || imprimirAlunoSistema || imprimirMauricio"
      class="text-center">{{ item.marca }}</div>
    <div v-if="item.marcaOpcional">
      <br />
      <hr />
      <b v-if="!imprimirAluno && !imprimirAlunoSistema">Marca Opcional</b>
      <div class="text-center bg-primary">{{ item.nomeMarcaOpcional }}</div>
    </div>
  </td>
  <td v-if="!item.titulo && !imprimirAluno && !imprimirAlunoSistema" class="col-1">
    <div v-if="!item.titulo && imprimirPadrao || imprimirGerencial || imprimirMauricio">
      <b>Disponível:</b>
      <br />
      <span v-if="item.disponivel_item == 1">SIM</span>
      <span v-else>NÃO</span>
    </div>
  </td>
  <td v-if="!item.titulo" :class="imprimirAluno || imprimirAlunoSistema ? 'col-4 text-center' : 'col-1 text-center'">
    <div v-if="!imprimirGerencial && imprimirPadrao || imprimirAluno || imprimirAlunoSistema || imprimirMauricio">
      {{ item.obs_item }}</div>
  </td>
</tr>
</tbody>
</table>
</v-card>
</v-container>
</template>
<script>
import { log } from "util";
export default {
  props: {
    lista: [Object],
    itens: [Array, Object],
    descontoGeral: [String, Number],
    totalItensOpcionais: [String, Number],
    totalItens: [String, Number],
    valorTotalSistema: [String, Number],
    valorTotalSite: [String, Number],
    lucroSistema: [String, Number],
    lucroSite: [String, Number]
  },
  data: () => ({
    menu: false,
    itensOpcional: [],
    imprimirPadrao: false,
    imprimirOpcional: false,
    imprimirGerencial: false,
    imprimirAluno: false,
    imprimirMauricio: false,
    imprimirAlunoSistema: false,
    removeValorSite: false,
    validade: ""
  }),
  created() {
    this.$root.$emit("title", "Imprimir Lista");
  },
  computed: {
    itensNoOptional: function () {
      //if (this.imprimirOpcional) return this.itens;

      return this.itens.filter(item => item.opcional_item == 0);
    }
  },
  methods: {
    imprimir() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("print").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=auto,height=auto,toolbar=0,scrollbars=0,status=0"
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
    dateNowImpress() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();

      today =
        "Impresso por: " +
        this.$usuario.value.usuario.toUpperCase() +
        " - " +
        dd +
        "/" +
        mm +
        "/" +
        yyyy +
        " - " +
        hours +
        ":" +
        minutes;
      return today;
    },
    imprimirPadraoChange() {
      this.itensOpcional = [];
      this.itens.forEach(item => {
        if (item.opcional_item == 1) {
          this.itensOpcional.push(item);
        }
      });
    },
    imprimirAlunoChange() {
      this.itensOpcional = [];
      this.itens.forEach(item => {
        if (item.opcional_item == 1) {
          this.itensOpcional.push(item);
        }
      });
    },
    imprimirMauricioChange() {
      this.itensOpcional = [];
      this.itens.forEach(item => {
        if (item.opcional_item == 1) {
          this.itensOpcional.push(item);
        }
      });
    }
  }
};
</script>