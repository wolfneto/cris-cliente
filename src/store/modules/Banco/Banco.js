import { push } from "core-js/fn/array";
import api from "../../../plugins/axios";
export default {
  state: {
    bancoAcademico: {},
    relatorioBancosAcademico: [],
    error: false,
  },

  getters: {},

  mutations: {
    setBancoAcademico(state, value) {
      state.bancoAcademico = { ...value };
    },
    set_relatorio_bancos_academico(state, value) {
      state.relatorioBancosAcademico = value;
    },
    setError(state, value) {
      state.error = value;
    },
  },

  actions: {
    async get_banco(context, payload) {
      let res = await api.get("/banco/getBancoAcademicoBySemestre", {
        params: {
          id_semestre: payload,
        },
      });

      if (res.data === false) {
        context.commit("setError", true);
      } else {
        context.commit("setError", false);
        context.commit("setBancoAcademico", res.data);
      }
    },
    async save_banco(context, payload) {
      let retorno = await api.post("/banco/salvar/", {
        data: payload,
      });
      if (retorno.data !== false) {
        context.commit("setError", false);
      } else {
        context.commit("setError", true);
      }
    },
    async get_relatorio_bancos_academico(context) {
      let res = await api.get("/banco/getRelatorioBancoAcademico/");

      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_relatorio_bancos_academico", res.data);
      }
    },
    async save_banco_credito_todos_semestres(context, payload) {
      let res = await api.post("/banco/salvarBancoCreditoTodosSemestres", {
        data: payload,
      });
      if (res.data !== false) {
        context.commit("setError", false);
      } else {
        context.commit("setError", true);
      }
    },
  },
};
