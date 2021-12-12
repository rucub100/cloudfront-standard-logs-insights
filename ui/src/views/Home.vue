<template>
    <div class="container home">
        <h1 class="mt-4 mb-3">CloudFront Standard Logs Insights</h1>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link
                    :class="['nav-link', { active: tab === 'overview' }]"
                    :aria-current="tab === 'overview' ? 'page' : undefined"
                    to="/?tab=overview"
                    >Overview</router-link
                >
            </li>
            <li class="nav-item">
                <router-link
                    :class="['nav-link', { active: tab !== 'overview' }]"
                    :aria-current="tab !== 'overview' ? 'page' : undefined"
                    to="/?tab=table"
                    >Table</router-link
                >
            </li>
        </ul>
        <div class="table-container mt-4" v-if="tab === 'table'">
            <the-table></the-table>
        </div>
        <div class="overview-container mt-4" v-else-if="tab === 'overview'">
            <the-overview></the-overview>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import TheOverview from '@/components/TheOverview.vue';
import TheTable from '@/components/TheTable.vue';

export default {
    name: 'Home',
    components: {
        TheOverview,
        TheTable,
    },
    computed: {
        tab() {
            return this.$route.query.tab === 'table' ? 'table' : 'overview';
        },
    },
};
</script>
