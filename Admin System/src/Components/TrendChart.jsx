import "./TrendChart.css";
import { defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
defaults.maintainAspectRatio = false;
defaults.responsive = true;
function TrendChart() {
  return (
    <div className="trend-chart">
      <Line
        data={{
          labels: ["Male", "Female"],
          datasets: [
            {
              label: "Doctors",
              data: [10, 20],
            },
            {
              label: "Counsellors",
              data: [30, 10],
            },
          ],
        }}
      />
    </div>
  );
}

export default TrendChart;
