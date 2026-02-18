import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const StatsChart = ({ stats, statsSeconds }) => {
  if (!stats || stats.length === 0) {
    return <p style={{ textAlign: "center" }}>No stats available.</p>;
  }

  return (
    <div>
      <h3 style={{ color: "#1f2937", fontWeight: 600 }}>
        Log Stats (Last {statsSeconds} Seconds)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis dataKey="_id" tick={{ fontSize: 12, fill: "#374151" }} />

          <YAxis allowDecimals={false} tick={{ fill: "#374151" }} />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#1f2937"
            barSize={45}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
