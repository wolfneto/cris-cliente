<template>
  <v-container>
    <v-card max-width="auto" height="auto" elevation="2">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              class="uppercase"
              v-model="search"
              label="Buscar por código"
              @keypress.enter="getItem()"
              @click="$event.target.select()"
              filled
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="1">
            <v-btn
              :disabled="!item.image_path"
              class="ma-0"
              color="primary"
              icon
              x-large
              @click="showImage($event, item.image_path)"
            >
              <v-icon dark right>fas fa-camera</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              :disabled="!inputImg"
              chips
              class="ml-1"
              v-model="file"
              :rules="[regras_imagem]"
              label="Selecionar imagem"
              accept="image/png, image/jpeg"
              filled
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :disabled="!file"
              color="success"
              @click="uploadImagem(item.codigo, file)"
            >
              Subir imagem
              <v-icon class="ml-2">fas fa-cloud-upload-alt</v-icon></v-btn
            >
          </v-col>
          <v-col cols="12" md="2">
            <v-btn :disabled="!inputImg" class="ml-6" color="warning" @click="cleanData()">
              Limpar
              <v-icon class="ml-2">far fa-trash-alt</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="8">
            <v-text-field
              class="uppercase"
              v-model="item.descricao"
              label="Descrição"
              readonly
              filled
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="uppercase"
              v-model="item.marca"
              label="Marca"
              readonly
              filled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-menu
      v-model="showMenuImage"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="true"
      :close-on-click="true"
    >
      <v-card>
        <img v-bind:src="`${urlImg}`" width="300" height="250" />
      </v-card>
    </v-menu>
    <v-snackbar
      :color="typeSnackbar"
      :timeout="timeSnackbar"
      v-model="snackbar"
    >
      {{ msgSnackbar }}
      <v-btn text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data: () => ({
    search: "",
    item: {},
    inputImg: false,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      masked: false,
    },
    typeSnackbar: "",
    timeSnackbar: 2000,
    snackbar: false,
    msgSnackbar: "",

    regras_imagem: (val) =>
      !val || val.size < 50000 || "Imagem não pode exceder 5MB.",
    file: null,
    showMenuImage: false,
    x: 0,
    y: 0,
    urlImg: "",
  }),
  created() {
    this.$root.$emit("title", this.$rota.currentRoute.name);
  },
  computed: {
    ...mapState({
      error: (state) => state.item.error,
    }),
  },
  methods: {
    ...mapActions(["saveItemImage"]),

    async getItem() {
      this.inputImg = false;
      this.loading = true;
      this.$axios
        .get("/produto/getByCod", {
          params: {
            cod: this.search,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data == false) {
            this.showSnackbar(
              "Erro no Servidor, Contate o Administrador",
              "error"
            );
          } else if (res.data == null) {
            this.item = {};
            this.file = null;
            this.showSnackbar("ITEM NÃƒO ENCONTRADO!", "warning", 5000);
          } else {
            this.item = res.data;
            this.inputImg = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        });
    },
    showSnackbar(msg, type, time = 0) {
      this.typeSnackbar = type;
      this.timeSnackbar = time;
      this.msgSnackbar = msg;
      this.snackbar = true;
    },
    async uploadImagem(codigo, file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const myRenamedFile = new File([file], codigo + ".png");
        const formData = new FormData();
        formData.append("file", myRenamedFile);

        await this.saveItemImage(formData);

        if (this.error != false) {
          this.showSnackbar(
            "Erro no Servidor, Contate o Administrador",
            "error"
          );
        } else {
          this.search = "";
          this.item = {};
          this.file = null;
          this.inputImg = false;
          this.showSnackbar("IMAGEM INSERIDA COM SUCESSO!", "success", 5000);
        }
      } else {
        this.file = null;
        this.showSnackbar("SOMENTE IMAGENS JPEG OU PNG!", "warning", 5000);
      }
    },
    cleanData() {
      this.search = "";
      this.item = {};
      this.file = null;
      this.inputImg = false;
    },
    showImage(e, img) {
      e.preventDefault();
      this.showMenuImage = false;
      this.x = e.clientX;
      this.y = e.clientY;

      this.urlImg = this.getUrl(img);

      this.$nextTick(() => {
        this.showMenuImage = true;
      });
    },
    getUrl(img) {
      return require("@/assets/produtos/" + img);
    },
  },
};
</script>
<style lang="sass"></style>
