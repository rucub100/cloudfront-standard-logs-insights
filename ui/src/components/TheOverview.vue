<template>
    <div class="overview" v-if="overview">
        <div class="hstack gap-4">
            <div>
                <label class="d-block fw-light fs-5">Log date range:</label>
                <span class="fw-bold">{{ overview.dateRange.startDate }}</span>
                to
                <span class="fw-bold">{{ overview.dateRange.endDate }}</span>
            </div>
            <div class="vr"></div>
            <div>
                <label class="d-block fw-light fs-5">#Requests:</label>
                <span class="fw-bold">{{ overview.numberOfRequests }}</span>
            </div>
            <div>
                <label class="d-block fw-light fs-5">#IPs:</label>
                <span class="fw-bold">{{ overview.numberOfIps }}</span>
            </div>
            <div class="vr"></div>
            <div>
                <label class="d-block fw-light fs-5">#BytesIn:</label>
                <span class="fw-bold">{{ overview.numberOfBytesIn }}</span>
            </div>
            <div>
                <label class="d-block fw-light fs-5">#BytesOut:</label>
                <span class="fw-bold">{{ overview.numberOfBytesOut }}</span>
            </div>
            <div class="vr"></div>
            <div>
                <label class="d-block fw-light fs-5"
                    >Time taken (min/max/median/avg):</label
                >
                <span class="fw-bold">{{ overview.timeTakenMs.min }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.max }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.median }}/</span>
                <span class="fw-bold">{{ overview.timeTakenMs.avg }} ms</span>
            </div>
        </div>
        <h4 class="mt-5 mb-3">Edge Locations</h4>
        <div class="row gap-1">
            <div
                class="col-1 fw-bold"
                v-for="location in overview.edgeLocations"
                :key="location"
            >
                {{ location }}
            </div>
        </div>
        <h4 class="mt-5 mb-3">
            User Agents&nbsp;
            <a
                class="btn btn-outline-dark"
                data-bs-toggle="collapse"
                href="#collapseUserAgents"
                role="button"
                aria-expanded="false"
                aria-controls="collapseUserAgents"
            >
                show/hide
            </a>
        </h4>
        <ul id="collapseUserAgents" class="list-group collapse">
            <li
                class="list-group-item font-monospace text-break fs-6"
                v-for="userAgent in overview.userAgents"
                :key="userAgent"
            >
                {{ decodeURI(userAgent) }}
            </li>
        </ul>
        <h4 class="mt-5 mb-3">Collections</h4>
        <div class="accordion" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                    >
                        Referers
                    </button>
                </h2>
                <div
                    id="collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                        <ul class="list-group">
                            <li
                                class="list-group-item font-monospace text-break fs-6"
                                v-for="referer in overview.referers"
                                :key="referer"
                            >
                                {{ decodeURI(referer) }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                    >
                        URI Paths
                    </button>
                </h2>
                <div
                    id="collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                        <ul class="list-group">
                            <li
                                class="list-group-item font-monospace text-break fs-6"
                                v-for="path in overview.paths"
                                :key="path"
                            >
                                {{ decodeURI(path) }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                    >
                        IP Addresses
                    </button>
                </h2>
                <div
                    id="collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                        <div class="row">
                            <div
                                class="col-4 font-monospace"
                                v-for="ip in new Set(
                                    overview.Ips.concat(
                                        overview.xForwardedFor.filter(
                                            (ip) => ip.length > 6
                                        )
                                    )
                                )"
                                :key="ip"
                            >
                                {{ decodeURI(ip) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h4 class="mt-5 mb-3">Connection Information</h4>
        <div class="hstack gap-4 align-items-start">
            <div>
                <label class="d-block fw-light fs-5">HTTP Methods:</label>
                <span
                    v-for="method in overview.httpMethods"
                    :key="method"
                    class="d-block fw-bold"
                    >{{ method }}</span
                >
            </div>
            <div>
                <label class="d-block fw-light fs-5">Status Codes:</label>
                <span
                    v-for="code in overview.statusCodes"
                    :key="code"
                    class="d-block fw-bold"
                    >{{ code }}</span
                >
            </div>
            <div class="vr"></div>
            <div>
                <label class="d-block fw-light fs-5">Protocols:</label>
                <span
                    v-for="protocol in overview.protocols"
                    :key="protocol"
                    class="d-block fw-bold"
                    >{{ protocol }}</span
                >
            </div>
            <div>
                <label class="d-block fw-light fs-5">SSL Protocols:</label>

                >
                <span
                    v-for="protocol in overview.sslProtocols.filter(
                        (p) => p !== '-'
                    )"
                    :key="protocol"
                    class="d-block fw-bold"
                    >{{ protocol }}</span
                >
            </div>
            <div>
                <label class="d-block fw-light fs-5">SSL Cipher:</label>

                >
                <span
                    v-for="protocol in overview.sslCipher.filter(
                        (p) => p !== '-'
                    )"
                    :key="protocol"
                    class="d-block fw-bold"
                    >{{ protocol }}</span
                >
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
