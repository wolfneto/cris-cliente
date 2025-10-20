import api from "../../../api/api";
export default {
  state: {
    relatorio_brindes_site: [],
    brindes_site: [],
    brinde_facul_sem: [],
    retorno: false,
    error: false,
  },
  getters: {},
  mutations: {
    set_relatorio_brindes_site(state, value) {
      state.relatorio_brindes_site = value;
    },
    set_brindes_site(state, value) {
      state.brindes_site = value;
    },
    set_brinde_facul_sem(state, value) {
      state.brinde_facul_sem = value;
    },
    clean_brindes_by_semestres(state) {
      state.brinde_facul_sem = [];
    },
    set_error(state, value) {
      state.error = value;
    },
    set_retorno(state, value) {
      state.retorno = value;
    },
  },
  actions: {
    async get_relatorio_brindes_site(context) {          
      let res = await api.get("/brindeSite/getRelatorioBrindesSite/");

      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_relatorio_brindes_site", res.data);
      }
    },
    async get_brindes_site(context) {
      let res = await api.get("/brindeSite/findAll/");

      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_brindes_site", res.data);
      }
    },
    async create_brinde_site(context, payload) {
      let res = await api.post("/brindeSite/createBrindeSite/", {
        item: payload,
      });

      if (res.data) {
        context.commit("set_retorno", true);
      } else if (res.data == false) {
        context.commit("set_retorno", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async update_brinde_site (context, payload) {
      
      let res = await api.put("/brindeSite/updateBrindeSite/", {
        item: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async delete_brinde_site(context, payload) {
      let res = await api.put("/brindeSite/deleteBrindeSite/", {
        item: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async save_brinde_lista(context, payload) {
      let res = await api.post("/brindeSite/createBrindeSiteLista/", {
        data: payload,
      });
      if (res.data) {
        context.commit("set_retorno", true);
      } else if (res.data == false) {
        context.commit("set_retorno", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async get_brinde_by_facul_sem(context, payload) {
      let res = await api.get("/brindeSite/getBrindeSiteByFaculSem/", {
        params: {
          codigo: payload,
        },
      });

      if (res.data === false) {
        context.commit("set_error", true);
      } else {
        context.commit("set_error", false);
        context.commit("set_brinde_facul_sem", res.data);
      }
    },
    async update_valor_brinde_lista(context, payload) {
      let res = await api.put("/brindeSite/updateValorBrindeLista/", {
        item: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async update_status_brinde_lista(context, payload) {
      let res = await api.put("/brindeSite/updateStatusBrindeLista/", {
        item: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async update_acumula_brinde_lista(context, payload) {
      let res = await api.put("/brindeSite/updateAcumulaBrindeLista/", {
        item: payload,
      });
      if (res.data !== false) {
        context.commit("set_error", false);
      } else {
        context.commit("set_error", true);
      }
    },
    async saveBrindeImage(context, payload) {
    
                let retorno = await api.post("/produto/saveItemImage/", payload);
    
                if (retorno.data !== false) {
                    context.commit('setError', false);
                } else {
                    context.commit('setError', true);
                }
            },
  },
};
