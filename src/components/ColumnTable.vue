<script setup>
const props = defineProps(["title", "dataArray", "numberOfColumns", "headers"]);
</script>

<template>
  <table v-if="props.numberOfColumns === 2 && !props.headers">
    <th :colspan="props.numberOfColumns">{{ props.title }}</th>
    <tr v-for="item in props.dataArray">
      <td align="left">{{ item.parameter }}</td>
      <td align="right">{{ item.value }}</td>
    </tr>
  </table>
  <table v-if="props.numberOfColumns === 4 && !props.headers">
    <th colspan="4">{{ props.title }}</th>
    <tr v-for="item in props.dataArray">
      <td align="left">{{ item.parameter1 }}</td>
      <td align="right">{{ item.value1 }}</td>
      <td align="left">{{ item.parameter2 }}</td>
      <td align="right">{{ item.value2 }}</td>
    </tr>
  </table>
  <table v-if="props.headers">
    <table>
      <th :colspan="props.numberOfColumns">{{ props.title }}</th>
      <tr>
        <th style="color: #6e6e6e; font-size: 10pt; text-align: left">
          {{ props.headers[0] }}
        </th>
        <th
          v-for="header in props.headers.slice(1)"
          style="color: #6e6e6e; font-size: 10pt; text-align: right"
        >
          {{ header }}
        </th>
      </tr>
      <tr v-if="props.title === 'Twinning'" v-for="value in props.dataArray">
        <td align="left">{{ value.label }}</td>
        <td align="right">{{ value.value }}</td>
        <td align="right">{{ value.untwinned.toFixed(3) }}</td>
        <td align="right">{{ value.perfect_twin.toFixed(3) }}</td>
      </tr>
      <tr v-if="props.title === 'Pointless'" v-for="value in props.dataArray">
        <td align="left">{{ value.order }}</td>
        <td align="right">{{ value.sg }}</td>
        <td align="right">{{ value.sg_nr }}</td>
        <td align="right">{{ value.LGconfidence }}</td>
        <td align="right">{{ value.SGconfidence }}</td>
      </tr>
    </table>
  </table>
</template>

<style scoped>
tr {
  border: 1px solid lightgray;
}
tr,
td,
th {
  padding-left: 1em;
  padding-right: 1em;
}
td:empty::after {
  content: "\00a0";
}
table {
  display: inline-table;
  width: 100%;
  padding-bottom: 3em;
}
tr:hover {
  background-color: #ececec;
}
</style>
