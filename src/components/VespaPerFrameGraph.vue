<template>
  <div>
    <Line :data="chartData" :options="chartOptions"></Line>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
        type: Array,
        required: true,
      },
  });

const chartData = ref({
  labels: Array.from({ length: props.data.length }, (_, i) => i + 1),
  datasets: [
    {
      label: 'Number of Spots per Image',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: false,
      data: props.data,
    },
  ],
});

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

onMounted(() => {
  // Additional setup goes here
});
</script>
