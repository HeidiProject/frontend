<template>
  <div>
    <table id="tableComponent" class="table table-bordered">
      <thead>
        <tr>
          <!-- loop through each value of the fields to get the table header -->
          <th v-for="field in fields" :key="field">
            {{ field }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through the list get each sample data -->
        <tr class="rows" v-for="item in data" :key="item">
          <td v-for="field in fields" :key="field" :class="rowClass(item)">
            {{ item[field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TableComponent",
  props: {
    data: {
      type: Array,
    },
    fields: {
      type: Array,
    },
  },
  methods: {
    rowClass(item) {
      // colors rows puck by puck
      if (!item) return;
      if (item.color === "odd") return "table-success";
    },
  },
};
</script>

<style scoped>
.table {
  padding-left: 0;
  border-color: lightgrey;
}

.rows:hover {
  background-color: #e9ecef;
}
</style>
