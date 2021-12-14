import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        overview: undefined,
        rawData: undefined,
        table: {
            page: 0,
            size: 10,
            selectedColumns: [],
            filters: [],
        },
    },
    mutations: {
        setOverview(state, data) {
            state.overview = data;
        },
        setData(state, data) {
            state.rawData = data;
        },
    },
    actions: {
        async loadOverview(context) {
            const data = await (await fetch('/api/overview')).json();
            context.commit('setOverview', data);
        },
        async loadData(context) {
            const data = await (await fetch('/api/data')).json();
            context.commit('setData', data);
        },
    },
    modules: {},
});
