<template>
    <div class="filters">
        <!-- Button trigger modal -->
        <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#filtersModal"
            :disabled="columns.length === 0"
        >
            Filters
        </button>

        <!-- Modal -->
        <div
            class="modal fade"
            id="filtersModal"
            tabindex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-labelledby="filtersModalLabel"
            aria-hidden="true"
        >
            <div
                class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="filtersModalLabel">
                            Filters
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div
                            class="vstack gap-3 mb-3"
                            v-if="filters.length > 0"
                        >
                            <div
                                class="hstack gap-3"
                                v-for="filter in filters"
                                :key="filter.id"
                            >
                                <div class="input-group">
                                    <select
                                        class="form-select"
                                        aria-label="Attribute to filter"
                                        v-model="filter.field"
                                    >
                                        <option
                                            v-for="column in columns"
                                            :key="column"
                                            :value="column"
                                        >
                                            {{ column }}
                                        </option>
                                    </select>
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Value"
                                        aria-label="Value"
                                        v-model.trim="filter.value"
                                    />
                                </div>
                                <button
                                    type="button"
                                    class="btn btn-outline-dark"
                                    @click="removeFilter(filter.id)"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="btn btn-outline-dark"
                            @click="addFilter"
                        >
                            Add
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-dismiss="modal"
                            @click="applyFilters"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filters: [...this.$store.state.table.filters],
        };
    },
    mounted() {
        const filtersModal = document.getElementById('filtersModal');
        filtersModal.addEventListener('hidden.bs.modal', () => {
            this.filters = [...this.$store.state.table.filters];
        });
    },
    computed: {
        columns() {
            return this.$store.state.rawData?.columns;
        },
    },
    methods: {
        addFilter() {
            this.filters.push({
                id: this.filters.length,
                field: this.columns[0],
                value: '',
            });
        },
        removeFilter(id) {
            this.filters = this.filters.filter((filter) => filter.id !== id);
        },
        applyFilters() {
            this.$store.dispatch('updateFilters', this.filters);
        },
    },
};
</script>
