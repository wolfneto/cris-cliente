<template>
  <v-container>
    <v-card>
      <h4 class="text-center">Entregas</h4>
      <v-row justify="center" class="mt-4">
        <v-col cols="6">
          <div
            style="cursor: pointer"
            v-ripple="{ center: true }"
            class="primary white--text text-center elevation-8 pa-6 h6"
            @click="$router.push('/estoque/entregas_controle')"
          >
            Controle de Entregas
          </div>
        </v-col>
        <v-col cols="6">
          <div
            style="cursor: pointer"
            v-ripple="{ center: true }"
            class="primary white--text text-center elevation-8 pa-6 h6"
            @click="$router.push('/estoque/entregas_relatorio')"
          >
            Relátorio de Entregas
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-4"> </v-row>
    </v-card>
    <v-snackbar
      :color="snackbar.type"
      :timeout="snackbar.time"
      v-model="snackbar.show"
    >
      {{ snackbar.msg }}
      <v-btn text @click="close_snackbar()">Fechar</v-btn>
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
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({}),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      error: (state) => state.estoque.error,
      snackbar: (state) => state.snackbar,
      loading: (state) => state.loading,
    }),
  },
  methods: {
    ...mapActions([]),
    ...mapMutations([]),
  },
};
</script>
<style scoped>
</style>