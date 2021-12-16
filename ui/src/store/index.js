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
            const totalCount = state.rawData.rows.length;
            const pageSize = state.table.size;
            const lastPage = Math.ceil(totalCount / pageSize) - 1;

            if (page >= 0 && page <= lastPage) {
                state.table.page = page;
            }
        },
        incTablePage(state) {
            const totalCount = state.rawData.rows.length;
            const itemsLeft =
                totalCount - (state.table.page + 1) * state.table.size;
            if (itemsLeft > 0) {
                state.table.page++;
            }
        },
        decTablePage(state) {
            if (state.table.page > 0) {
                state.table.page--;
            }
        },
        lastTablePage(state) {
            const totalCount = state.rawData.rows.length;
            const pageSize = state.table.size;
            const lastPage = Math.ceil(totalCount / pageSize) - 1;
            if (state.table.page != lastPage) {
                state.table.page = lastPage;
            }
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
        firstPage(context) {
            context.commit('setTablePage', 0);
            context.commit('calcTableRows');
        },
        prevPage(context) {
            context.commit('decTablePage');
            context.commit('calcTableRows');
        },
        nextPage(context) {
            context.commit('incTablePage');
            context.commit('calcTableRows');
        },
        lastPage(context) {
            context.commit('lastTablePage');
            context.commit('calcTableRows');
        },
        toPage(context, page) {
            context.commit('setTablePage', page);
            context.commit('calcTableRows');
        },
    },
    modules: {},
});
