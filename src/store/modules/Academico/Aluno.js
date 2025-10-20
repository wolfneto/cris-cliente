import api from '../../../api/api'
export default {
    state: {
        aluno: {},
        alunos: [],
        faculdades: [],
        semestres: [],
        periodos: [],
        representantes: [],
        enviadas: [],
        error: false,
    },

    getters: {

    },

    mutations: {
        set_alunos(state, value) {
            state.alunos = value;
        },
        set_faculdades(state, value) {
            state.faculdades = value;
        },
        set_semestres(state, value) {
            state.semestres = value;
        },
        set_periodos(state, value) {
            state.periodos = value;
        },
        set_representantes(state, value) {
            state.representantes = value;
        },
        set_enviadas(state, value) {
            state.enviadas = value;
        },
        set_error(state, value) {
            state.error = value;
        },
        set_aluno(state, value) {
            state.aluno = value;
        }
    },

    actions: {
        async get_aluno(context, payload) {
            try {
                let res = await api.get("/aluno/getAluno", {
                    params: {
                        cpf: payload
                    }
                })
                context.commit('set_error', false);
                context.commit('set_aluno', res.data);
            } catch (error) {
                if (error.response.status == 500) {
                    context.commit('set_error', true);
                }
            }

        },
        async get_alunos(context, payload) {
            let res = await api.get("/firebase/alunos", {
                params: {
                    dados: payload
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_alunos', res.data);
            }
        },
        async get_alunos_bloqueados(context) {
            let res = await api.get("/aluno/getAlunosBloqueados")

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_alunos', res.data);
            }
        },
        async get_faculdades(context, payload) {
            let res = await api.get("/faculdade/findbyuser", {
                params: {
                    id_usuario: payload
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_faculdades', res.data);
            }
        },
        async get_semestres(context, payload) {
            let res = await api.get("/semestre/findallbyfaculdade", {
                params: {
                    faculdade: payload
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_semestres', res.data);
            }
        },
        async get_periodos(context, payload) {
            let res = await api.get("/periodo/findallbyfaculdadesemestre", {
                params: {
                    faculdade: payload.faculdade,
                    semestre: payload.semestre
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_periodos', res.data);
            }
        },
        async get_representantes(context, payload) {
            let res = await api.get("/representante/findallbyfaculdadesemestreperiodo", {
                params: {
                    faculdade: payload.faculdade,
                    semestre: payload.semestre,
                    periodo: payload.periodo,
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_representantes', res.data);
            }
        },
        async get_enviadas(context, payload) {
            let res = await api.get("/firebase/getEnviadas")

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_enviadas', res.data);
            }
        },
        async send_notification(context, payload) {
            let res = await api.post("/firebase/send", {
                dados: payload
            })

            console.log('oba', res.data);
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },
        async set_bloqueado(context, payload) {
            let res = await api.post("/aluno/bloqueado", {
                dados: payload
            })
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        }
    }
}