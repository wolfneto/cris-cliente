import api from "../../../api/api";
export default {
  state: {
    semestres: [],
    error: false,
  },
  getters: {},
  mutations: {
    set_semestres(state, value) {
      state.semestres = value;
    },
    set_error(state, value) {
      state.error = value;
    },
  },
  actions: {
    async get_faculdade_semestre_carteirinha(context, payload) {
      let res = await api.get("/faculdades_semestres_carteirinha", {});
      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_semestres", res.data);
      }
    },

    async delete_carteirinha(context, payload) {
      let res = await api.delete("/carteirinha/deleteCarteirinha/", {
        params: {
          id: payload.id,
        },
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },

    async editar_carteirinha(context, payload) {
      let res = await api.put("/carteirinha/udpateCarteirinha/", {
        data: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async criar_carteirinha(context, payload) {
      let res = await api.post("/carteirinha/createCarteirinha/", {
        data: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
  },
};
