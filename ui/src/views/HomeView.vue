<template>
    <div class="container home">
        <h1 class="display-3 mt-4 mb-3">CloudFront Standard Logs Insights</h1>
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
        <div class="pt-5"></div>
        <hr class="mt-5 mb-1" />
        <span class="d-block mb-1">&copy; 2021 Ruslan Curbanov</span>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'HomeView',
    components: {
        TheOverview: defineAsyncComponent(() =>
            import('@/components/TheOverview.vue')
        ),
        TheTable: defineAsyncComponent(() =>
            import('@/components/TheTable.vue')
        ),
    },
    computed: {
        tab() {
            return this.$route.query.tab === 'table' ? 'table' : 'overview';
        },
    },
};
</script>
