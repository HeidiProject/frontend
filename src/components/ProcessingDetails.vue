<script setup>
import { ref, onMounted, watch } from "vue";
import {
  format_collection_parameters,
  format_strategy_parameters,
  format_xia2dials_results,
  format_xtal_params_4rows,
  format_autoproc_results,
  getAngularRange,
  resultIsErrorOrAbort,
} from "../helpers/mxdbScripts.js";
import ColumnTable from "./ColumnTable.vue";
import GetImage from "./GetImage.vue";
import RsyncPath from "./RsyncPath.vue";
import { format_fqdn_header } from "../helpers/mxdbScripts";

const props = defineProps({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const result = ref(null);
const items = ref(null);
const xtal_params = ref(null);
const processing_params = ref(null);
const collection_type = ref(null);
const error = ref(null);
const tracking_id = ref(null);

function collectionType(collection) {
  if (collection.method === "screening") {
    return "strategy";
  } else {
    return "dataset";
  }
}

function getProcessing(id, data) {
  if (id && data !== "No account was selected") {
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == id) {
        const document = data[i];
        result.value = document;
        tracking_id.value = document.trackingId;
        items.value = format_collection_parameters(document);
        if (document.adpInfo && document.adpInfo.strategy) {
          collection_type.value = "strategy";
          processing_params.value = format_strategy_parameters(document);
          error.value = resultIsErrorOrAbort(document, "strategy");
        } else if (document.adpExecutionStack) {
          collection_type.value = document.adpExecutionStack[4];
          xtal_params.value = format_xtal_params_4rows(document);
          processing_params.value = null;
        }
        if (collection_type.value === "xia2dials") {
          processing_params.value = format_xia2dials_results(document);
        } else if (collection_type.value === "autoproc") {
          processing_params.value = format_autoproc_results(document);
        }
      }
    }
  }
}

function processing_path(result) {
  if (collection_type.value === "strategy") {
    return format_fqdn_header(collectionType(result), result);
  } else {
    const inputString = format_fqdn_header(collectionType(result), result);
    if (inputString) {
      const parts = inputString.split("/"); // Split the string by "/"
      const desiredSubstring = parts.pop(); // Get the last element from the resulting array
      return (
        result.root_folder + "/" + desiredSubstring + "/" + collection_type.value
      );
    } else {
      return "No path available."
    }
  }
}

onMounted(() => {
  if (props.data.length > 0) {
    getProcessing(props._id, props.data);
  }
});

watch(
  () => props._id,
  (newValue, oldValue) => {
    getProcessing(newValue, props.data);
  }
);
</script>

<template>
  <div class="processing-details-container" v-if="result">
    <div class="alert alert-info" role="alert">
      <h5 align="left">
        {{ format_fqdn_header(collectionType(result), result) }}
      </h5>
    </div>
    <div class="grid-container">
      <div class="collection-image" align="left">
        <GetImage :_id="tracking_id" />
      </div>
      <div class="raw-data-path">
        <div class="label">Raw data filepath:</div>
        <RsyncPath :rsyncPath="result.root_folder" />
      </div>
      <div class="processing-data-path">
        <div class="label">Processing data filepath:</div>
        <RsyncPath :rsyncPath="processing_path(result)" />
      </div>
      <div class="collection-details" v-if="result">
        <ColumnTable
          :title="'Experimental Parameters'"
          :dataArray="items"
          :numberOfColumns="2"
        />
      </div>
      <div
        class="crystal-details"
        v-if="result && collection_type === 'strategy' && result.adpStatus['strategy'] !== 'running' && result.adpStatus['strategy'] !== 'pending'"
      >
        <div v-if="error && result.adpInfo">
          {{ result.adpInfo.strategy }}
          <img
            src="../assets/cancel-icon.svg"
            alt="failed processing"
            width="24"
            height="24"
          />
        </div>
        <ColumnTable
          v-else
          :title="'Crystal Parameters'"
          :dataArray="processing_params"
          :numberOfColumns="4"
        />
      </div>
      <div
        class="crystal-details"
        v-if="
          result &&
          collection_type !== 'strategy' &&
          result.adpExecutionStack &&
          !resultIsErrorOrAbort(result, result.adpExecutionStack[4])
        "
      >
        <ColumnTable
          :title="`Crystal Parameters: ${result.adpExecutionStack[4]}`"
          :dataArray="xtal_params"
          :numberOfColumns="4"
        />
      </div>
      <div
        class="crystal-details"
        v-else-if="
          result &&
          collection_type !== 'strategy' &&
          result.adpExecutionStack &&
          !resultIsErrorOrAbort(result, result.adpExecutionStack[3]) &&
          resultIsErrorOrAbort(result, result.adpExecutionStack[4])
        "
      >
        <ColumnTable
          :title="`Crystal Parameters: ${result.adpExecutionStack[3]}`"
          :dataArray="xtal_params"
          :numberOfColumns="4"
        />
      </div>
      <div
        v-if="
          result &&
          collection_type === 'gopy' &&
          !resultIsErrorOrAbort(result, result.adpExecutionStack[4])
          && result.adpStatus['gopy'] !== 'running' && result.adpStatus['gopy'] !==  'pending'
        "
        class="twinning-details"
      >
        <ColumnTable
          :title="'Twinning'"
          :dataArray="result.result.gopy_params.twinning"
          :numberOfColumns="4"
          :headers="['Label', 'Value', 'Untwinned', 'Twinned']"
        />
      </div>

      <div
        v-if="
          result &&
          collection_type === 'gopy' &&
          !resultIsErrorOrAbort(result, result.adpExecutionStack[4])
          && result.adpStatus['gopy'] !== 'running' && result.adpStatus['gopy'] !== 'pending'
        "
        class="space-group-details"
      >
        <ColumnTable
          :title="'Pointless'"
          :dataArray="result.result.gopy_params.spacegroup"
          :numberOfColumns="5"
          :headers="[
            'Order',
            'Space Group',
            'Space Group Number',
            'Laue Group Confidence',
            'Space Group Confidence',
          ]"
        />
      </div>
    </div>
    <div
      class="strategy-details"
      v-if="result && (collection_type === 'strategy') & !error && result.adpStatus['strategy'] !== 'running' && result.adpStatus['strategy'] !== 'pending'"
    >
      <table>
        <th colspan="7">Strategy: {{ result.result.strategy.description }}</th>
        <tr>
          <th style="color: #6e6e6e; font-size: 10pt; text-align: left">
            Omega
          </th>
          <th class="grey-heading">Phi</th>
          <th class="grey-heading">Chi</th>
          <th class="grey-heading">Total Range</th>
          <th class="grey-heading">Multiplicity</th>
          <th class="grey-heading">Completeness</th>
          <th class="grey-heading">Anomalous Completeness</th>
        </tr>
        <tr>
          <td align="left">{{ result.result.strategy.omega }}</td>
          <td class="decimal-cell">{{ result.result.strategy.phi }}</td>
          <td class="decimal-cell">{{ result.result.strategy.chi }}</td>
          <td class="decimal-cell">{{ result.result.strategy.totalRange }}</td>
          <td class="decimal-cell">
            {{ result.result.strategy.multiplicity }}
          </td>
          <td class="decimal-cell">
            {{ result.result.strategy.completeness }}
          </td>
          <td class="decimal-cell">
            {{ result.result.strategy.anomalous_completness }}
          </td>
        </tr>
      </table>
    </div>

    <div v-if="result && collection_type === 'gopy' && result.adpStatus['gopy'] !== 'running' && result.adpStatus['gopy'] !==  'pending'" class="gopy">
      <table>
        <th colspan="11">
          Gopy (angularRange: {{ getAngularRange(result, "gopy") }})
        </th>
        <tr v-if="!resultIsErrorOrAbort(result, result.adpExecutionStack[4])">
          <th class="grey-heading">Resolution Limit</th>
          <th class="grey-heading">Observed Reflections</th>
          <th class="grey-heading">Unique Reflections</th>
          <th class="grey-heading">Completeness</th>
          <th class="grey-heading">R-factor observed</th>
          <th class="grey-heading">R-factor expected</th>
          <th class="grey-heading">Isigma</th>
          <th class="grey-heading">Rmeas</th>
          <th class="grey-heading">CChalf</th>
          <th class="grey-heading">Anomalous Correlation</th>
          <th class="grey-heading">sigAno</th>
        </tr>
        <tr v-for="value in result.result.gopy" :key="value._id">
          <td class="decimal-cell">{{ value.resolution_limit }}</td>
          <td class="decimal-cell">{{ value.observed_reflections }}</td>
          <td class="decimal-cell">{{ value.unique_reflections }}</td>
          <td class="decimal-cell">{{ value.completeness }}</td>
          <td class="decimal-cell">{{ value.r_factor_observed }}</td>
          <td class="decimal-cell">{{ value.r_factor_expected }}</td>
          <td class="decimal-cell">{{ value.Isigma }}</td>
          <td class="decimal-cell">{{ value.rmeas }}</td>
          <td class="decimal-cell">{{ value.cc_half }}</td>
          <td class="decimal-cell">{{ value.anomalous_correlation }}</td>
          <td class="decimal-cell">{{ value.sigAno }}</td>
        </tr>
      </table>

      <div
        class="card mb-3"
        align="center"
        v-if="
          result && resultIsErrorOrAbort(result, result.adpExecutionStack[4])
        "
      >
        {{ result.adpInfo.gopy }}
        <img
          src="../assets/cancel-icon.svg"
          class="card-img-bottom"
          alt="failed processing"
          width="24"
          height="24"
        />
      </div>
    </div>

    <div
      v-else-if="
        (collection_type === 'xia2dials' && result.adpStatus['xia2dials'] !== 'running' && result.adpStatus['xia2dials'] !==  'pending') ||
        (collection_type === 'autoproc' && result.adpStatus['autoproc'] !== 'running' && result.adpStatus['autoproc'] !== 'pending')
      "
      class="third-party-results"
    >
      <table>
        <th colspan="4">
          {{ collection_type }} (angularRange:
          {{ getAngularRange(result, collection_type) }})
        </th>
        <tr v-if="!resultIsErrorOrAbort(result, result.adpExecutionStack[4])">
          <th></th>
          <th class="grey-heading">Overall</th>
          <th class="grey-heading">Inner shell</th>
          <th class="grey-heading">Outer shell</th>
        </tr>
        <tr v-for="value in processing_params" :key="value._id">
          <td class="decimal-cell">{{ value.parameter1 }}</td>
          <td class="decimal-cell">{{ value.value1 }}</td>
          <td class="decimal-cell">{{ value.parameter2 }}</td>
          <td class="decimal-cell">{{ value.value2 }}</td>
        </tr>
      </table>
      <div
        class="card mb-3"
        align="center"
        v-if="resultIsErrorOrAbort(result, result.adpExecutionStack[4]) && result.adpExecutionStack[4] === 'autoproc'"
      >
        {{ result.adpInfo.autoproc }}
        <img
          src="../assets/cancel-icon.svg"
          class="card-img-bottom"
          alt="failed processing"
          width="24"
          height="24"
        />
      </div>

      <div
          class="card mb-3"
          align="center"
          v-if="resultIsErrorOrAbort(result, result.adpExecutionStack[4]) && result.adpExecutionStack[4] === 'xia2dials'"
          >
          {{ result.adpInfo.xia2dials }}
          <img
            src="../assets/cancel-icon.svg"
            class="card-img-bottom"
            alt="failed processing"
            width="24"
            height="24"
          />
      </div>
    </div>

   



    <div
      class="fast-xds-3"
      v-if="result && result.result && collection_type !== 'strategy' && result.adpStatus['fast_xds_3'] !== 'running' && result.adpStatus['fast_xds_3'] !== 'pending'"
    >
      <table>
        <th colspan="11">
          Fast Processing (angularRange:
          {{ getAngularRange(result, "fast_xds_3") }})
        </th>
        <tr v-if="!resultIsErrorOrAbort(result, result.adpExecutionStack[3])">
          <th class="grey-heading">Resolution Limit</th>
          <th class="grey-heading">Observed Reflections</th>
          <th class="grey-heading">Unique Reflections</th>
          <th class="grey-heading">Completeness</th>
          <th class="grey-heading">R-factor observed</th>
          <th class="grey-heading">R-factor expected</th>
          <th class="grey-heading">Isigma</th>
          <th class="grey-heading">Rmeas</th>
          <th class="grey-heading">CChalf</th>
          <th class="grey-heading">Anomalous Correlation</th>
          <th class="grey-heading">sigAno</th>
        </tr>
        <tr v-for="value in result.result.fast_xds_3" :key="value._id">
          <td class="decimal-cell">{{ value.resolution_limit }}</td>
          <td class="decimal-cell">{{ value.observed_reflections }}</td>
          <td class="decimal-cell">{{ value.unique_reflections }}</td>
          <td class="decimal-cell">{{ value.completeness }}</td>
          <td class="decimal-cell">{{ value.r_factor_observed }}</td>
          <td class="decimal-cell">{{ value.r_factor_expected }}</td>
          <td class="decimal-cell">{{ value.Isigma }}</td>
          <td class="decimal-cell">{{ value.rmeas }}</td>
          <td class="decimal-cell">{{ value.cc_half }}</td>
          <td class="decimal-cell">{{ value.anomalous_correlation }}</td>
          <td class="decimal-cell">{{ value.sigAno }}</td>
        </tr>
      </table>

      <div
        class="card mb-3"
        align="center"
        v-if="resultIsErrorOrAbort(result, result.adpExecutionStack[3])"
      >
        {{ result.adpInfo.fast_xds_3 }}
        <img
          src="../assets/cancel-icon.svg"
          class="card-img-bottom"
          alt="failed processing"
          width="24"
          height="24"
        />
      </div>
    </div>
    <div
      class="fast-xds-2"
      v-if="result && result.result && collection_type !== 'strategy' && result.adpStatus['fast_xds_2'] !== 'running' && result.adpStatus['fast_xds_2'] !== 'pending'"
    >
      <table>
        <th colspan="8">
          Fast Indexing (angularRange:
          {{ getAngularRange(result, "fast_xds_2") }})
        </th>
        <tr v-if="!resultIsErrorOrAbort(result, result.adpExecutionStack[2])">
          <th class="grey-heading">Bravais Lattice</th>
          <th class="grey-heading">Quality of Fit</th>
          <th class="grey-heading">Cell A</th>
          <th class="grey-heading">Cell B</th>
          <th class="grey-heading">Cell C</th>
          <th class="grey-heading">Alpha</th>
          <th class="grey-heading">Beta</th>
          <th class="grey-heading">Gamma</th>
        </tr>
        <tr v-for="value in result.result.fast_xds_2" :key="value._id">
          <td class="decimal-cell">{{ value.bravais_lattice }}</td>
          <td class="decimal-cell">{{ value.quality_of_fit }}</td>
          <td class="decimal-cell">{{ value.cell_a }}</td>
          <td class="decimal-cell">{{ value.cell_b }}</td>
          <td class="decimal-cell">{{ value.cell_c }}</td>
          <td class="decimal-cell">{{ value.alpha }}</td>
          <td class="decimal-cell">{{ value.beta }}</td>
          <td class="decimal-cell">{{ value.gamma }}</td>
        </tr>
      </table>

      <div
        class="card mb-3"
        align="center"
        v-if="resultIsErrorOrAbort(result, result.adpExecutionStack[2])"
      >
        {{ result.adpInfo.fast_xds_2 }}
        <img
          src="../assets/cancel-icon.svg"
          class="card-img-bottom"
          alt="failed processing"
          width="24"
          height="24"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.processing-details-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 2em;
  width: 100%;
  height: calc(100vh - 63.5px);
  overflow-y: auto;
}

tr {
  border: 1px solid lightgray;
}

tr,
td,
th {
  padding-left: 1em;
  padding-right: 1em;
}

th {
  max-width: 4em;
}

td:empty::after {
  content: "\00a0";
}
.decimal-cell {
  text-align: right;
}

.grey-heading {
  color: #6e6e6e;
  font-size: 10pt;
  text-align: right;
}

table {
  display: inline-table;
  width: 100%;
  margin-top: 1em;
}

.grid-container {
  display: grid;
  height: fit-content;
  width: 100%;
  margin-right: 2em;
  grid-auto-rows: auto;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "raw-data-path processing-data-path"
    "collection-image collection-details"
    "collection-image crystal-details"
    "twinning-details space-group-details";
  gap: 1em;
}

.collection-image {
  grid-area: collection-image;
}

.raw-data-path {
  grid-area: raw-data-path;
  flex-shrink: 1;
  flex: 1;
}

.processing-data-path {
  grid-area: processing-data-path;
  flex-shrink: 1;
  flex: 1;
}
.collection-details {
  grid-area: collection-details;
}

.crystal-details {
  grid-area: crystal-details;
}

.twinning-details {
  grid-area: twinning-details;
}

.space-group-details {
  grid-area: space-group-details;
}

tr:hover {
  background-color: #ececec;
}

.card {
  padding: 1em;
}

.label {
  font-weight: bold;
}
</style>
