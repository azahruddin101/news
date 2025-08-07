import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdsDetails = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${url}advertisements/analytics/overview?period=monthly`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOverview(res.data?.data?.overview || {});
      } catch (error) {
        console.error("Failed to fetch overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const InfoCard = ({ label, value }) => (
    <div className="bg-white text-red-600 rounded-lg shadow p-3 w-full sm:w-40 text-center">
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );

  if (loading) {
    return <div className="text-center text-red-600">Loading...</div>;
  }

  if (!overview) {
    return <div className="text-center text-red-600">No data available</div>;
  }

  // Chart data
  const chartData = [
    { name: "Impressions", value: overview.totalImpressions ?? 0 },
    { name: "Clicks", value: overview.totalClicks ?? 0 },
    { name: "CTR (%)", value: parseFloat(overview.averageCTR ?? 0) },
    { name: "Revenue", value: overview.totalRevenue ?? 0 },
  ];

  // Pie chart data
  const total = overview.totalAds ?? 0;
  const active = overview.activeAds ?? 0;
  const pending = overview.pendingReview ?? 0;
  const inactive = Math.max(total - active - pending, 0);

  const pieData = [
    { name: "Active Ads", value: active },
    { name: "Pending Review", value: pending },
    { name: "Inactive Ads", value: inactive },
  ];

  const COLORS = ["#dc2626", "#facc15", "#fca5a5"]; 

  return (
    <div className="rounded-lg py-4 px-4">
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <InfoCard label="Total Ads" value={total} />
        <InfoCard label="Active Ads" value={active} />
        <InfoCard label="Pending" value={pending} />
        <InfoCard label="Impressions" value={overview.totalImpressions ?? 0} />
        <InfoCard label="Clicks" value={overview.totalClicks ?? 0} />
        <InfoCard label="Revenue" value={`₹ ${overview.totalRevenue ?? 0}`} />
        <InfoCard
          label="Avg. CTR"
          value={`${overview.averageCTR?.toFixed(2) ?? 0}%`}
        />
      </div>
      <div className="flex flex-wrap w-full gap-4 justify-between">
        <div className="bg-white rounded-xl shadow p-4 mb-6 w-full md:w-[49%]">
          <h3 className="text-lg font-semibold text-red-600 mb-2 text-center">
            Performance Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-6 w-full md:w-[49%]">
          <h3 className="text-lg font-semibold text-red-600 mb-2 text-center">
            Active, Pending & Inactive Ads
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default AdsDetails;