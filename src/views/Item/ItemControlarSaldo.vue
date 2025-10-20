<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn @click="$router.push('/item')" color="error">Voltar</v-btn>
      </v-card-title>
      <v-card-text v-if="item.hasOwnProperty('descricao')">
        <v-row class="justify-center text-center">
          <v-col class="font-weight-black" cols="4">
            Código: {{ item.codigo }}
          </v-col>
          <v-col class="font-weight-black" cols="8">
            <v-fade-transition leave-absolute>
              <v-row no-gutters style="width: 100%">
                <v-col cols="6"> {{ item.descricao }} </v-col>
                <v-col cols="6"> Saldo SITE: {{ item.saldo }} </v-col>
              </v-row>
            </v-fade-transition>
          </v-col>
        </v-row>

        <v-row justify="space-around" no-gutters>
          <v-col cols="4">
            <div class="title text-center">Entradas</div>
            <v-card raised outlined>
              <v-simple-table
                dark
                dense
                fixed-header
                height="300px"
                class="ma-1"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Data
                      </th>
                      <th class="text-left">
                        Qtd
                      </th>
                      <th class="text-left">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="entrada in item.entradas" :key="entrada.id">
                      <td>{{ $moment_format_time(entrada.data) }}</td>
                      <td>{{ entrada.qtd }}</td>
                      <td>{{ entrada.usuario }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
          <v-col cols="4">
            <div class="title text-center">Saidas</div>
            <v-card raised outlined>
              <v-simple-table
                dark
                dense
                fixed-header
                height="300px"
                class="ma-1"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Data
                      </th>
                      <th class="text-left">
                        Qtd
                      </th>
                      <th class="text-left">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="saida in item.saidas" :key="saida.id">
                      <td>{{ $moment_format_time(saida.data) }}</td>
                      <td>{{ saida.qtd }}</td>
                      <td>{{ saida.usuario }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn @click="showDialog(true)" color="success">Nova Entrada</v-btn>
        <v-btn @click="showDialog(false)" color="error">Nova Saída</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="200" persistent>
      <v-card class="mx-auto">
        <v-card-title>
          <span class="text-h5">{{ entrada ? "Entrada" : "Saída" }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              ><v-text-field
                v-model="qtd"
                ref="input_qtd"
                autofocus
                label="Qtd"
                hide-details
                type="number"
                outlined
                filled
              ></v-text-field
            ></v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="dialog = false">
            Voltar
          </v-btn>
          <div class="flex-grow-1"></div>
          <v-btn color="success" @click="entrada_saida()">
            Salvar
          </v-btn>
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
export default {
  data: () => ({
    search: "",
    loading: false,
    msgSnackbar: "",
    typeSnackbar: "",
    snackbar: false,
    timeSnackbar: 2000,
    dialog: false,
    saldo_site: 0,
    item: {},
    entrada: false,
    qtd: "",
  }),
  async created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
    await this.buscarItem(this.$route.params.codigo);
  },
  methods: {
    async buscarItem(codigo) {
      this.loading = true;
      this.$axios
        .get("/produto/getItemSaldo", {
          params: {
            codigo: codigo,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data != false) {
            console.log(res.data);
            this.item = res.data;
            //this.dialogSaldo = true;
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
    showDialog(tipo) {
      this.qtd = "";
      this.dialog = true;
      this.entrada = tipo;
    },
    async entrada_saida() {
      this.loading = true;
      this.$axios
        .post("/produto/salvarQtdItemSaldo", {
          dados: {
            codigo: this.$route.params.codigo,
            qtd: this.qtd,
            usuario: this.$usuario.value.usuario,
            entrada: this.entrada,
          },
        })
        .then( async (res) => {
          this.loading = false;
          if (res.data != false) {
            this.dialog = false
            await this.buscarItem(this.$route.params.codigo);
            if(this.entrada) {
              this.showSnakerbar("Entrada Realizada!", "success");
            } else {
              this.showSnakerbar("Saída Realizada!", "success");
            }
            
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
    showSnakerbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
  },
};
</script>
