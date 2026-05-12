<template>
  <v-container>

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