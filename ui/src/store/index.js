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
            rows: [],
        },
    },
    mutations: {
        setOverview(state, data) {
            state.overview = data;
        },
        setData(state, data) {
            state.rawData = data;
        },
        setTablePage(state, page) {
            state.table.page = page;
        },
        setTableSize(state, size) {
            state.table.page = size;
        },
        setSelectedColumns(state, selectedColumns) {
            state.table.selectedColumns = selectedColumns;
        },
        updateSelectedColumns(state, column) {
            if (state.table.selectedColumns.includes(column)) {
                state.table.selectedColumns =
                    state.table.selectedColumns.filter((c) => c !== column);
            } else {
                state.table.selectedColumns = [
                    ...state.table.selectedColumns,
                    column,
                ];
            }
        },
        calcTableRows(state) {
            const page = state.table.page;
            const size = state.table.size;
            const selectedColumns = state.table.selectedColumns;
            const rows = [];

            if (selectedColumns.length > 0) {
                const indexFrom = page * size;
                const indexTo = Math.min(
                    state.rawData.rows.length,
                    (page + 1) * size
                );
                for (let i = indexFrom; i < indexTo; i++) {
                    rows.push({
                        id: i,
                        ...selectedColumns
                            .map((column) => {
                                return {
                                    [column]: state.rawData.rows[i][column],
                                };
                            })
                            .reduce((previousValue, currentValue) => {
                                return { ...previousValue, ...currentValue };
                            }),
                    });
                }
            }

            state.table.rows = rows;
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
            context.commit('setSelectedColumns', data.columns.slice(0, 6));
            context.commit('calcTableRows');
        },
        toggleColumnSelection(context, column) {
            context.commit('updateSelectedColumns', column);
            context.commit('calcTableRows');
        },
        deselectAllColumns(context) {
            context.commit('setSelectedColumns', []);
            context.commit('calcTableRows');
        },
    },
    modules: {},
});
