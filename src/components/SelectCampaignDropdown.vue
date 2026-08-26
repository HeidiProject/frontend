<template>
    <n-select
      :options="options"
      :value="modelValue"
      :loading="loading"
      :disabled="loading || options.length === 0"
      placeholder="No campaigns available"
      :consistent-menu-width="false"
      @update:value="handleSelect"
    >
    </n-select>
</template>

<script setup>
import { NSelect } from "naive-ui";
import { computed } from "vue";

const props = defineProps({
  campaigns: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const options = computed(() =>
  props.campaigns.map((campaign) => ({
    label: campaign.display_name,
    value: campaign.campaign_id,
  }))
);

const emit = defineEmits(["selectedCampaign"]);

function handleSelect(key) {
  emit("selectedCampaign", String(key));
}
</script>  
