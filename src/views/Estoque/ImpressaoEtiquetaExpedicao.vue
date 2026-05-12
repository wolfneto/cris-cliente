<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="1000" height="650" elevation="5">
      <v-row class="ma-auto">
        <v-col class cols="12" md="4">
          <v-text-field
            class="ml-4 ma-2 uppercase"
            append-icon="fa-search"
            label="Numero pedido"
            v-mask="'######A'"
            v-model="numeroPedido"
            @keypress.enter="showLayout()"
            filled
            dense
            autofocus
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="divIprimirLayout" class="ma-auto mt-n6">
        <v-card class="ma-auto" max-width="550" height="130" elevation="5">
          <div class="ma-0">
            <h6 class="text-center">Tipo de layout</h6>
          </div>
          <div class="ma-4 mt-4">
            <v-radio-group v-model="radios" :mandatory="true" dense>
              <v-radio label="ImpressÃ£o 1" @change="radio1 = true ; radio2 = false"></v-radio>
              <v-radio label="ImpressÃ£o 2" @change="radio2 = true ; radio1 = false"></v-radio>
            </v-radio-group>
          </div>

          <div v-if="radio1" class="ma-auto mt-10">
            <v-card class="ma-auto" max-width="550" height="300" elevation="5">
              <v-row>
                <v-col cols="12" md="12" class="text-center">
                  <v-btn class="mr-2 blue-grey lighten-4" small>
                    <i class="fas fa-print mr-2"></i>
                    imprimir
                  </v-btn>
                </v-col>
              </v-row>

              <div class="ma-4 mt-1">
                <v-img
                  class
                  src="https://picsum.photos/510/300?random"
                  height="210"
                  aspect-ratio="2"
                ></v-img>
              </div>
            </v-card>
          </div>
          <div v-if="radio2" class="ma-auto mt-10">
            <v-card class="ma-auto" max-width="550" height="300" elevation="5">
              <v-row>
                <v-col cols="12" md="12" class="text-center">
                  <v-btn class="mr-2 blue-grey lighten-4" small>
                    <i class="fas fa-print mr-2"></i>
                    imprimir
                  </v-btn>
                </v-col>
              </v-row>

              <div class="ma-4 mt-1">
                <v-img
                  class
                  src="https://picsum.photos/500/300?random"
                  height="210"
                  aspect-ratio="2"
                ></v-img>
              </div>
            </v-card>
          </div>
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    numeroPedido: "",
    divIprimirLayout: false,
    radios: false,
    radio1: true,
    radio2: false
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {
    showLayout() {
      if (this.numeroPedido.length >= 6) {
        this.divIprimirLayout = true;
      }
    }
  }
};
</script>
   <style scope>
.uppercase input {
  text-transform: uppercase;
}
</style>