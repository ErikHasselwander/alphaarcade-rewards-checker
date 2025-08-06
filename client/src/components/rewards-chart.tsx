import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RewardsChartPoint } from '@/lib/algorand';

interface RewardsChartProps {
  data: RewardsChartPoint[];
}

export function RewardsChart({ data }: RewardsChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No transaction data to display
      </div>
    );
  }

  // Custom tooltip to show reward details
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Date: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Cumulative: ${data.cumulativeRewards.toFixed(2)} USDC`}
          </p>
          <p className="text-sm text-green-600">
            {`Amount: +${data.amount.toFixed(2)} USDC`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value} USDC`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="cumulativeRewards" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}