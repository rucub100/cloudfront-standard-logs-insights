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
                <li v-for="column in table.columns" :key="column">
                    <button class="dropdown-item" type="button">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                            />
                            <label class="form-check-label">
                                {{ column }}
                            </label>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <template v-for="column in table.columns.slice(0, 6)">
                        <th scope="col" :key="column">{{ column }}</th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in table.rows.slice(0, 100)" :key="row">
                    <td
                        v-for="column in table.columns.slice(0, 6)"
                        :key="row[column]"
                    >
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
        table() {
            return this.$store.state.rawData;
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
