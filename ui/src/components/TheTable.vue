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
        <nav class="align-self-end" aria-label="Page navigation">
            <ul class="pagination">
                <li
                    :class="['page-item', { disabled: page === 0 }]"
                    @click="firstPage"
                >
                    <a class="page-link" aria-label="First">
                        <span aria-hidden="true">&Lang;</span>
                    </a>
                </li>
                <li :class="['page-item', { disabled: page === 0 }]">
                    <a
                        class="page-link"
                        aria-label="Previous"
                        @click="prevPage"
                    >
                        <span aria-hidden="true">&lang;</span>
                    </a>
                </li>
                <li
                    class="page-item"
                    v-if="page === totalPages - 1"
                    @click="toPage(page - 2)"
                >
                    <a class="page-link">{{ page - 1 }}</a>
                </li>
                <li class="page-item" v-if="page > 0" @click="toPage(page - 1)">
                    <a class="page-link">{{ page }}</a>
                </li>
                <li class="page-item active" aria-current="page">
                    <a class="page-link">{{ page + 1 }}</a>
                </li>
                <li
                    class="page-item"
                    v-if="page + 1 < totalPages"
                    @click="toPage(page + 1)"
                >
                    <a class="page-link">{{ page + 2 }}</a>
                </li>
                <li
                    class="page-item"
                    v-if="page === 0"
                    @click="toPage(page + 2)"
                >
                    <a class="page-link">{{ page + 3 }}</a>
                </li>
                <li
                    :class="['page-item', { disabled: page + 1 >= totalPages }]"
                    @click="nextPage"
                >
                    <a class="page-link" aria-label="Next">
                        <span aria-hidden="true">&rang;</span>
                    </a>
                </li>
                <li
                    :class="['page-item', { disabled: page + 1 >= totalPages }]"
                    @click="lastPage"
                >
                    <a class="page-link" aria-label="Last">
                        <span aria-hidden="true">&Rang;</span>
                    </a>
                </li>
            </ul>
        </nav>
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
        page() {
            return this.$store.state.table.page;
        },
        totalPages() {
            const totalCount = this.$store.state.rawData.rows.length;
            const pageSize = this.$store.state.table.size;
            return Math.ceil(totalCount / pageSize);
        },
    },
    methods: {
        toggleColumnSelection(column) {
            this.$store.dispatch('toggleColumnSelection', column);
        },
        deselectAllColumns() {
            this.$store.dispatch('deselectAllColumns');
        },
        firstPage() {
            this.$store.dispatch('firstPage');
        },
        prevPage() {
            this.$store.dispatch('prevPage');
        },
        nextPage() {
            this.$store.dispatch('nextPage');
        },
        lastPage() {
            this.$store.dispatch('lastPage');
        },
        toPage(page) {
            this.$store.dispatch('toPage', page);
        },
    },
};
</script>

<style lang="scss" scoped>
.table-container {
    display: flex;
    flex-direction: column;
}
.dropdown-menu {
    max-height: 20rem;
    overflow-y: auto;
}

.page-item {
    cursor: pointer;
    user-select: none;

    &.disabled {
        cursor: not-allowed;
    }
}
</style>
