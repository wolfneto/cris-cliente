<template>
  <div class="div-content">
    <div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Faculdade</label>
        </div>
        <!-- <select
          @change="onChangeSelect(selectedFaculdade)"
          class="custom-select"
          id="select-faculdade"
          v-model="selectedFaculdade"
          required
        >
          <option value="0" selected disabled>Selecione a faculdade...</option>
          <option
            v-for="faculdade in faculdades"
            v-bind:value="faculdade"
            v-bind:key="faculdade.id_faculdade"
          >{{ faculdade.nome_exibicao_faculdade }}</option>
        </select> -->
      </div>
      <hr />
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Semestre</label>
        </div>
        <!-- <select class="custom-select" id="select-semestre" v-model="selectedSemestre" required>
          <option value="0" selected disabled>Selecione o semestre...</option>
          <option
            v-for="semestre in semestres"
            v-bind:value="semestre"
            v-bind:key="semestre.id_semestre"
          >{{ semestre.descri_semestre }}</option>
        </select> -->
      </div>
      <hr />
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Nome Lista</span>
        </div>
        <input
          v-model="nome_lista"
          type="text"
          class="form-control"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </div>
      <hr />
      <form class="form-inline">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">Data</label>
          </div>
        </div>
        <br />
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
        <br />

        <div class="input-group input-group-sm mb-2 ml-3">
          <button type="button" class="btn btn-primary" @click="submitFile()">Importar</button>
        </div>
      </form>
    </div>
    <b-modal ref="modalImport" hide-footer title="Aviso">
      <div class="d-block text-center">
        <h3>Sucesso</h3>
      </div>
      <button type="button" class="btn btn-danger mt-3" @click="$refs['modalImport'].hide()">Voltar</button>
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      faculdades: [],
      selectedFaculdade: 157,
      selectedSemestre: "",
      semestres: [],
      data: "15/01/2020",
      file: "",
      nome_lista: "",
      loadingImport: false
    };
  },
  created() {
    this.getFacudades();
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    submitFile() {
      this.loadingImport = true;
      let formData = new FormData();

      formData.append("file", this.file);
      formData.append("data", this.data);
      formData.append("faculdade", 157);
      formData.append("semestre", 596);
      formData.append("nome_lista", this.nome_lista);

      this.$axios
        .post("/lista/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          if (res.data === true) {
            this.$refs["modalImport"].show();
          }
          this.loadingImport = false;
        })
        .catch(err => {
          console.log(err);
          this.loadingImport = false;
          console.log("FAILURE!!");
        });
    },
    importar() {
      console.log();
    },
    onChangeSelect(selectedFaculdade) {
      this.selectedSemestre = "0";
      this.$axios
        .get("/semestre/findallbyfaculdade", {
          params: {
            faculdade: this.selectedFaculdade.id_faculdade
          }
        })
        .then(res => {
          this.semestres = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFacudades() {
      this.$axios
        .get("/faculdade/findbyuser", {
          params: {
            id_usuario: this.$usuario.value.id
          }
        })
        .then(res => {
          this.faculdades = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatterDate(data, sql) {
      let d = new Date(data);
      let date =
        d.getFullYear() +
        "-" +
        (d.getMonth().toString().length > 1
          ? d.getMonth() + 1
          : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate().toString().length > 1 ? d.getDate() : "0" + d.getDate());

      return date;
    }
  }
};
</script>

<style scoped>
</style>
