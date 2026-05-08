<template>
  <v-container>
    <v-card>
      <h2>oba</h2>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({}),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  }
};
</script>