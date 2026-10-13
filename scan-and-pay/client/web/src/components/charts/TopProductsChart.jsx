import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const TopProductsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No product sales recorded yet.
      </div>
    );
  }

  // Format product names for display
  const chartData = data.slice(0, 6).map(item => ({
    name: item.name?.length > 15 ? item.name.substring(0, 13) + '...' : item.name,
    fullName: item.name,
    quantity: item.totalQuantity || item.quantity || 0,
    revenue: item.totalRevenue || item.revenue || 0
  }));

  return (
    <div style={{ width: '100%', height: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 10 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            tickLine={false}
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value, name) => [
              name === 'quantity' ? `${value} units` : `₹${value}`,
              name === 'quantity' ? 'Quantity Sold' : 'Revenue'
            ]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
          />
          <Bar dataKey="quantity" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
