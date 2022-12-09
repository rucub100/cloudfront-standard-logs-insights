import { createStore } from 'vuex';

export default createStore({
    state: {
        overview: undefined,
        rawData: undefined,
        table: {
            page: 0,
            size: 10,
            selectedColumns: [],
            filters: [],
            rows: [],
            totalRows: 0,
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
            const totalCount = state.table.totalRows;
            const pageSize = state.table.size;
            const lastPage = Math.max(0, Math.ceil(totalCount / pageSize) - 1);

            if (page >= 0 && page <= lastPage && page !== state.table.page) {
                state.table.page = page;
            }
        },
        incTablePage(state) {
            const totalCount = state.table.totalRows;
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
            const totalCount = state.table.totalRows;
            const pageSize = state.table.size;
            const lastPage = Math.max(0, Math.ceil(totalCount / pageSize) - 1);
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
            const filters = state.table.filters;
            const filteredRawDataRows = ((rawDataRows) => {
                let filteredRawDataRows = rawDataRows;

                const fields = new Set(filters.map((filter) => filter.field));

                for (const field of fields) {
                    const values = filters
                        .filter((filter) => filter.field === field)
                        .map((filter) => filter.value);
                    filteredRawDataRows = filteredRawDataRows.filter(
                        (row) =>
                            values.includes(row[field]) ||
                            values.includes(decodeURI(row[field]))
                    );
                }

                return filteredRawDataRows;
            })(state.rawData.rows);

            state.table.totalRows = filteredRawDataRows.length;

            if (selectedColumns.length > 0) {
                const indexFrom = page * size;
                const indexTo = Math.min(
                    filteredRawDataRows.length,
                    (page + 1) * size
                );
                for (let i = indexFrom; i < indexTo; i++) {
                    rows.push({
                        id: i,
                        ...selectedColumns
                            .map((column) => {
                                return {
                                    [column]: filteredRawDataRows[i][column],
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
        setFilters(state, filters) {
            state.table.filters = filters;
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
            context.commit('setTablePage', 0);
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
        updateFilters(context, filters) {
            context.commit('setFilters', filters);
            context.commit('setTablePage', 0);
            context.commit('calcTableRows');
        },
    },
    modules: {},
});
