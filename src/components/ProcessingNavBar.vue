<script setup>
import thumbsUp from "../assets/thumbs-up-green-icon.svg";
import thumbsDown from "../assets/thumbs-down-red-icon.svg";
import cancelIcon from "../assets/cancel-icon.svg";
import pendingIcon from "../assets/pending-icon.svg";
import refreshIcon from "../assets/refresh-icon.svg";

defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["selectedId"]);

const today = new Date().toDateString();

// If collectionDate is the same day show HH:MM else show YYYY-MM-DD
function collectionDate(collection) {
  if (collection.createdOn) {
    if (new Date(collection.createdOn).toDateString() === today) {
      return collection.createdOn.slice(11, 16);
    } else {
      return collection.createdOn.slice(0, 10) + ' ' + collection.createdOn.slice(11,16);
    }
  }
}

function collectionType(collection) {
  if (collection.method === "screening") {
    return "strategy";
  } else {
    return "dataset";
  }
}

function statusIcon(dataItem) {
  //if dataItem has not been initalized yet and is empty array, return empty array
  if (dataItem === null) return new Array();
  if (dataItem === undefined) return new Array();
  if (dataItem.length === 0) return new Array();

  function _status2Icon(statusFull) {
    switch (statusFull) {
      case "completed":
        return { icon: thumbsUp };
      case "pending":
        return { icon: pendingIcon };
      case "running":
        return { icon: refreshIcon };
      case "aborted":
        return { icon: cancelIcon };
      case "error":
        return { icon: thumbsDown };
      default:
        return { icon: pendingIcon };
    }
  }

  function _adpName2Label(adpName) {
    switch (adpName) {
      case "fast_xds_1":
        return "Initialization";
      case "fast_xds_2":
        return "Fast Indexing"; //or 'radio-button-unchecked';
      case "fast_xds_3":
        return "Fast Processing";
      case "gocom":
        return "Go.com";
      case "gopy":
        return "Go.py";
      case "autoproc":
        return "Autoproc";
      case "xia2dials":
        return "Dials";
      case "strategy":
        return "Strategy";
      case "merging":
        return "Merge";
      default:
        return "adpName";
    }
  }

  var stack = dataItem.adpExecutionStack;
  if (stack) {
    var stackLength = Object.keys(stack).length;
  } else {
    stackLength = 0;
  }
  var out = [];
  for (var i = 1; i <= stackLength; i++) {
    var label = stack[i];
    var icon = _status2Icon(dataItem.adpStatus[label]).icon;
    label = _adpName2Label(label) + ": " + dataItem.adpStatus[label];
    var tmp = { icon: icon, label: label };
    out.push(tmp);
  }
  return out;
}
</script>

<template>
  <div class="navigation-pane" v-if="data.length > 0">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="strategy-tab"
          data-bs-toggle="tab"
          data-bs-target="#strategy"
          type="button"
          role="tab"
          aria-controls="strategy"
          aria-selected="false"
        >
          &nbsp;&nbsp;&nbsp; Strategy &nbsp;&nbsp;&nbsp;
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="datasets-tab"
          data-bs-toggle="tab"
          data-bs-target="#datasets"
          type="button"
          role="tab"
          aria-controls="datasets"
          aria-selected="true"
        >
          &nbsp;&nbsp;&nbsp; Datasets &nbsp;&nbsp;&nbsp;
        </button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div
        class="tab-pane"
        id="strategy"
        role="tabpanel"
        aria-labelledby="strategy-tab"
      >
        <div v-for="result in data" :key="result._id">
          <button
            v-if="collectionType(result) === 'strategy'"
            @click="emit('selectedId', result._id)"
          >
            <div class="results-summmary">
              <h6 align="left">{{ result.prefix }}</h6>
              <p style="display: flex; justify-content: space-between">
                <span v-for="icon in statusIcon(result)" :key="icon.label">
                  <img
                    class="status-icon"
                    :src="icon.icon"
                    :alt="icon.label"
                    :title="icon.label"
                    width="24"
                    height="24"
                  />
                </span>
                <span class="date-span">{{ collectionDate(result) }}</span>
              </p>
            </div>
          </button>
        </div>
      </div>
      <div
        class="tab-pane show active"
        id="datasets"
        role="tabpanel"
        aria-labelledby="datasets-tab"
      >
        <div v-for="result in data" :key="result._id">
          <button
            v-if="collectionType(result) !== 'strategy'"
            @click="emit('selectedId', result._id)"
          >
            <div class="results-summmary">
              <h6 align="left">{{ result.prefix }}</h6>
              <p style="display: flex; justify-content: space-between">
                <span v-for="icon in statusIcon(result)" :key="icon.label">
                  <img
                    class="status-icon"
                    :src="icon.icon"
                    :alt="icon.label"
                    width="24"
                    height="24"
                  />
                </span>
                <span
                  v-if="
                    result.adpExecutionStack && !result.adpExecutionStack[4]
                  "
                >
                </span>
                <span class="date-span">{{ collectionDate(result) }}</span>
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  width: 100%;
  padding: 1em;
  background-color: white;
  border: none;
  min-width: max-content;
}

button:hover {
  background-color: lightblue;
}

img {
  padding: 2px;
  height: 24px;
  width: 24px;
}
.date-span {
  margin-left: auto;
}

.nav-link {
  color: #6e6e6e;
}

.nav-link.active {
  color: #1371be;
}

.navigation-pane {
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  height: calc(100vh - 63.5px);
  overflow-y: auto;
}

.tab-pane.active {
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
}

</style>
