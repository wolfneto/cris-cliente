import api from '../../../plugins/axios'
const getDefaultState = () => {
    return {
        zonas: [{
                name: "SP",
                status: false,
                children: [{
                        name: "SP Interior",
                        multiplicador: 1,
                        frete: 0,
                        status: false,
                    },
                    {
                        name: "Cidade SP",
                        status: false,
                        children: [
                            { name: "Centro", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Norte", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Leste", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Sul", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Oeste", multiplicador: 1, frete: 0, status: false },
                        ],
                    },
                    {
                        name: "Grande SP",
                        status: false,
                        children: [{
                                name: "Ferraz De Vasconcelos",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Poá", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Itaquaquecetuba",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Suzano", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Mogi das Cruzes",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Guararema", multiplicador: 1, frete: 0, status: false },
                            { name: "Osasco", multiplicador: 1, frete: 0, status: false },
                            { name: "Carapicuíba", multiplicador: 1, frete: 0, status: false },
                            { name: "Barueri", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Santana do Parnaíba",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Jandira", multiplicador: 1, frete: 0, status: false },
                            { name: "Itapevi", multiplicador: 1, frete: 0, status: false },
                            { name: "Cotia", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Vargem Grande Paulista",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Taboão da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Embu", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Itapecirica da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Embu-Guaçu", multiplicador: 1, frete: 0, status: false },
                            { name: "Guarulhos", multiplicador: 1, frete: 0, status: false },
                            { name: "Arujá", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Santa Isabel",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Mairiporã", multiplicador: 1, frete: 0, status: false },
                            { name: "Caieiras", multiplicador: 1, frete: 0, status: false },
                            { name: "Cajamar", multiplicador: 1, frete: 0, status: false },
                            { name: "Jordanesia", multiplicador: 1, frete: 0, status: false },
                            { name: "Polvilho", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Franco da Rocha",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Francisco Morato",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Santo André",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Mauá", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Ribeirão Pires",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Rio Grande da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "São Caetano do Sul",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "São Bernardo do Campo",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Diadema", multiplicador: 1, frete: 0, status: false },
                        ],
                    },
                ],
            },
            {
                name: "RJ e ES",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "MG",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "BA e SE",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "PE, AL, PB, RN",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "CE, PI, MA, PA, AP, AM, RR, AC",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "DF, GO, RO, TO, MT, MS",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "PR E SC",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
            {
                name: "RS",
                multiplicador: 1,
                frete: 0,
                status: false,
            },
        ],

    }
}
export default {
    state: {
        faculdades: [],
        semestres: [],
        zonas: [{
                name: "SP",
                status: false,
                locked: true,
                children: [{
                        name: "SP Interior",
                        multiplicador: 1,
                        frete: 0,
                        status: false,
                    },
                    {
                        name: "Cidade SP",
                        status: false,
                        locked: true,
                        children: [
                            { name: "Centro", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Norte", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Leste", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Sul", multiplicador: 1, frete: 0, status: false },
                            { name: "Zona Oeste", multiplicador: 1, frete: 0, status: false },
                        ],
                    },
                    {
                        name: "Grande SP",
                        status: false,
                        locked: true,
                        children: [{
                                name: "Ferraz De Vasconcelos",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Poá", multiplicador: 1, status: false },
                            {
                                name: "Itaquaquecetuba",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Suzano", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Mogi das Cruzes",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Guararema", multiplicador: 1, frete: 0, status: false },
                            { name: "Osasco", multiplicador: 1, frete: 0, status: false },
                            { name: "Carapicuíba", multiplicador: 1, frete: 0, status: false },
                            { name: "Barueri", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Santana do Parnaíba",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Jandira", multiplicador: 1, frete: 0, status: false },
                            { name: "Itapevi", multiplicador: 1, frete: 0, status: false },
                            { name: "Cotia", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Vargem Grande Paulista",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Taboão da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Embu", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Itapecirica da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Embu-Guaçu", multiplicador: 1, frete: 0, status: false },
                            { name: "Guarulhos", multiplicador: 1, frete: 0, status: false },
                            { name: "Arujá", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Santa Isabel",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Mairiporã", multiplicador: 1, frete: 0, status: false },
                            { name: "Caieiras", multiplicador: 1, frete: 0, status: false },
                            { name: "Cajamar", multiplicador: 1, frete: 0, status: false },
                            { name: "Jordanesia", multiplicador: 1, frete: 0, status: false },
                            { name: "Polvilho", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Franco da Rocha",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Francisco Morato",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Santo André",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Mauá", multiplicador: 1, frete: 0, status: false },
                            {
                                name: "Ribeirão Pires",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "Rio Grande da Serra",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "São Caetano do Sul",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            {
                                name: "São Bernardo do Campo",
                                multiplicador: 1,
                                frete: 0,
                                status: false,
                            },
                            { name: "Diadema", multiplicador: 1, frete: 0, status: false },
                        ],
                    },
                ],
            },
            {
                name: "RJ e ES",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "MG",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "BA e SE",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "PE, AL, PB, RN",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "CE, PI, MA, PA, AP, AM, RR, AC",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "DF, GO, RO, TO, MT, MS",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "PR E SC",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
            {
                name: "RS",
                multiplicador: 1,
                frete: 0,
                status: false,
                locked: true,
            },
        ],
        total_listas_online: 0,
        error: false
    },

    getters: {},

    mutations: {
        setFaculdades(state, value) {
            state.faculdades = value;
        },
        setSemestres(state, value) {
            state.semestres = value;
        },
        setZonas(state, value) {
            state.zonas = value;
        },
        setTotalListasOnline(state, value) {
            state.total_listas_online = value;
        },
        setError(state, value) {
            state.error = value;
        },
        set_reset_zonas(state) {
            Object.assign(state, getDefaultState());
        },

    },

    actions: {
        async get_faculdades(context) {
            let res = await api.get("/faculdades", {});

            if (res.data === false) {
                context.commit('setError', true);
            } else {
                context.commit('setError', false);
                context.commit('setFaculdades', res.data);
            }
        },
        async get_semestres(context, payload) {
            let res = await api.get("/semestre/findallbyfaculdade", {
                params: {
                    faculdade: payload.faculdade,
                    graduacao: payload.graduacao
                }
            });

            if (res.data === false) {
                context.commit('setError', true);
            } else {
                context.commit('setError', false);
                context.commit('setSemestres', res.data);
            }
        },
        async get_frete(context, payload) {

            let res = await api.get("/frete/findFretebySemestre", {
                params: {
                    id_semestre: payload
                }
            });

            if (res.data === false) {
                context.commit('setError', true);
            } else {
                context.commit('setError', false);
                if (res.data.length) {
                    context.commit('setZonas', res.data);
                } else {
                    context.commit('set_reset_zonas');
                }

            }
        },
        async get_total_listas(context, payload) {

            let res = await api.get("/frete/getTotalListas", {
                params: {
                    id_semestre: payload
                }
            });
            if (res.data === false) {
                context.commit('setError', true);
            } else {
                context.commit('setError', false);
                context.commit('setTotalListasOnline', res.data);
            }
        },
        async salvar(context, payload) {

            let retorno = await api.post("/frete/salvar/", {
                id_semestre: payload.id_semestre,
                zonas: payload.zonas,
                base_frete: payload.base_frete,
                valor_minimo_frete: payload.valor_minimo_frete
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },



    }
}