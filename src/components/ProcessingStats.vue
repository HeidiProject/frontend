<script setup>
import { storeToRefs } from "pinia";

import { useProcessingStore } from "../stores/processingStore";

const store = useProcessingStore();

const { numberOfDatasets, numberOfStrategy } = storeToRefs(store);
</script>

<template>
    Processing statistics:
    <br />
    Strategy: {{ numberOfStrategy }}
    <br />
    Datasets: {{ numberOfDatasets }}
</template>
