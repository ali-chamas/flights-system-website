const xValues = ['jan','feb','march','april','may','june','july','august','sept','oct','nov','dec'];
const yValues = [7,8,8,9,9,9,10,11,14,14,15];

const ctx = document.getElementById('myChart').getContext('2d');

new Chart(ctx, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{ticks: {min: 6, max:16}}],
    }
  }
});
