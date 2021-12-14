<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    beforeMount() {
        this.loadOverview();
        this.loadData();
    },
    methods: {
        ...mapActions(['loadOverview', 'loadData']),
    },
};
</script>
