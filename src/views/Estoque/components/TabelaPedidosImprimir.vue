<template>
  <v-container>      
        
         <div class="headline">ImpressÃ£o para separaÃ§Ã£o</div>       
            <v-card elevation="2" class="mt-8">
                  <v-simple-table dense height="550">
                    <thead>
                      <tr>
                        <th class="text-left">NÂ° Pedido</th>
                        <th class="text-left">Status</th>
                        <th class="text-left">Total</th>
                        <th class="text-left">Cliente</th>                                          
                        <th class="text-left">Vendedor</th>                                          
                        <th class="text-left">Usuario</th>                                          
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in desserts" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                        <td>{{ item.texto }}</td>
                        <td>{{ item.teste }}</td>                                              
                        <td>{{ item.teste }}</td>                                              
                        <td>{{ item.teste }}</td>                                              
                      </tr>
                    </tbody>
                  </v-simple-table>
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
//   created() {
//     this.$root.$emit("title", this.$rota.currentRoute.name);
//   },
  methods: {}
};
</script>