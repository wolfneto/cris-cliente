<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="1800" height="700" elevation="4">
      <v-row class="ma-auto">
        <v-col class cols="12" md="6">
          <v-text-field
            class="ml-4 ma-2"
            append-icon="fa-search"
            label="Item"
            filled
            dense
            autofocus
          ></v-text-field>
        </v-col>

        <v-col class="text-end ml-n6" cols="12" md="6">
          <v-btn class="ma-2">
            Cancelar
            <i class="fas fa-reply success--text ml-2"></i>
          </v-btn>
          <br />
          <v-btn class="ma-2">
            Etiquetas
            <i class="fas fa-print primary--text ml-2"></i>
          </v-btn>
        </v-col>
      </v-row>

      <div class="ml-6">
        <div class="text-left text-uppercase">
          <h4>Abridor de Boca Borracha</h4>
        </div>
        <div class="ml-4">
          <h6>
            <b>Marca</b>
          </h6>
          <h6 class="mt-n3">
            <b>Catálogo</b>
          </h6>
          <h6 class="mt-n3">
            <b>Localização</b>
          </h6>
        </div>

        <div class="ml-4">
          <v-row>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="6">
                  <h6>Disponível</h6>
                  <p class="mt-n2">
                    <b>Saídas previstas</b>
                  </p>
                  <v-card class="ma-0" elevation="4">
                  <v-simple-table class="ml-0" dense height="300" style="width: 450px">
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Calories</th>
                        <th class="text-left">Texto</th>
                        <th class="text-left">Teste</th>                                          
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in desserts" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                        <td>{{ item.texto }}</td>
                        <td>{{ item.teste }}</td>                                              
                      </tr>
                    </tbody>
                  </v-simple-table>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <h6>Em produção</h6>
                  <p class="mt-n2">
                    <b>Entradas previstas</b>
                  </p>
                  <v-card class="ml-2" elevation="4">
                  <v-simple-table class="ml-0" dense height="300" style="width: 450px">
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Calories</th>
                         <th class="text-left">Texto</th>
                        <th class="text-left">Teste</th>                         
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in desserts" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                         <td>{{ item.texto }}</td>
                        <td>{{ item.teste }}</td>                      
                      </tr>
                    </tbody>
                  </v-simple-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4">
              <v-card max-width="420" height="380" elevation="6"></v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    desserts: [
      {
        name: "Frozen Yogurt",
        calories: 159,
        texto: "text",
        teste: "teste",
        item: "item",
        item2: "item2",
        item3: "item3"
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Eclair",
        calories: 262,
        texto: "text",
        teste: "teste",
       item: "item"
      },
      {
        name: "Cupcake",
        calories: 305,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Gingerbread",
        calories: 356,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Jelly bean",
        calories: 375,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Lollipop",
        calories: 392,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Honeycomb",
        calories: 408,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "Donut",
        calories: 452,
        texto: "text",
        teste: "teste",
        item: "item"
      },
      {
        name: "KitKat",
        calories: 518,
        texto: "text",
        teste: "teste",
        item: "item"
      }
    ]
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  methods: {}
};
</script>