<template>
    <div class="table-container">
        <div class="dropdown">
            <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                Selected columns
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="deselectAllColumns"
                    >
                        <div class="form-check">Deselect all columns</div>
                    </button>
                </li>
                <li v-for="column in allColumns" :key="column">
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="toggleColumnSelection(column)"
                    >
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :checked="columns.includes(column)"
                            />
                            <label class="form-check-label">
                                {{ column }}
                            </label>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
        <table class="table" v-if="columns.length > 0">
            <thead>
                <tr>
                    <template v-for="column in columns">
                        <th scope="col" :key="column">{{ column }}</th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.id">
                    <td v-for="column in columns" :key="row.id + row[column]">
                        {{ row[column] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    computed: {
        rows() {
            return this.$store.state.table.rows;
        },
        columns() {
            return this.$store.state.table.selectedColumns;
        },
        allColumns() {
            return this.$store.state.rawData?.columns;
        },
    },
    methods: {
        toggleColumnSelection(column) {
            this.$store.dispatch('toggleColumnSelection', column);
        },
        deselectAllColumns() {
            this.$store.dispatch('deselectAllColumns');
        },
    },
};
</script>

<style lang="scss" scoped>
.dropdown-menu {
    max-height: 20rem;
    overflow-y: auto;
}
</style>
