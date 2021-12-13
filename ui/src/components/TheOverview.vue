<template>
    <div class="overview" v-if="overview">
        <div class="hstack gap-4">
            <div>
                <label>Log date range:&nbsp;</label>
                <span class="fw-bold">{{ overview.dateRange.startDate }}</span>
                to
                <span class="fw-bold">{{ overview.dateRange.endDate }}</span>
            </div>
            <div>
                <label>#Requests:&nbsp;</label>
                <span class="fw-bold">{{ overview.numberOfRequests }}</span>
            </div>
            <div>
                <label>#IPs:&nbsp;</label>
                <span class="fw-bold">{{ overview.numberOfIps }}</span>
            </div>
            <div>
                <label>#BytesIn:&nbsp;</label>
                <span class="fw-bold">{{ overview.numberOfBytesIn }}</span>
            </div>
            <div>
                <label>#BytesOut:&nbsp;</label>
                <span class="fw-bold">{{ overview.numberOfBytesOut }}</span>
            </div>
            <div>
                <label>Time taken (min/max/median/avg):&nbsp;</label>
                <span class="fw-bold">{{ overview.timeTakenMs.min }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.max }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.median }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.avg }} ms</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        overview() {
            return this.$store.state.overview;
        },
    },
};
</script>
