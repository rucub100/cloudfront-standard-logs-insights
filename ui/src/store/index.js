import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        overview: undefined,
    },
    mutations: {
        setOverview(state, data) {
            state.overview = data;
        },
    },
    actions: {
        async loadOverview(context) {
            const data = await (await fetch('/api/overview')).json();
            context.commit('setOverview', data);
        },
    },
    modules: {},
});
