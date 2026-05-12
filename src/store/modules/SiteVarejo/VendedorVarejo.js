import api from "../../../plugins/axios";
export default {
  state: {
    vendedores_varejo: [],
    error: false,
  },

  mutations: {
    set_vendedores_varejo(state, value) {
      state.vendedores_varejo = value;
    },
    set_error(state, value) {
      state.error = value;
    },
  },
  getters: {},

  actions: {
    async get_vendedores_varejo(context) {
      let res = await api.get("/varejo/vendedores", {});
      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_vendedores_varejo", res.data);
      }
    },

    async create_vendedor_varejo(context, payload) {
      let res = await api.post("/varejo/vendedor", {
        data: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },

    async update_vendedor_varejo(context, payload) {
      let res = await api.put("/varejo/vendedor", {
        data: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },

    async update_status_vendedor_varejo(context, payload) {      
      let res = await api.put("/varejo/update_status_vendedor", {
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
