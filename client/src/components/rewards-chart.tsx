import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RewardsChartPoint } from '@/lib/algorand';

interface RewardsChartProps {
  data: RewardsChartPoint[];
}

export function RewardsChart({ data }: RewardsChartProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initialize date range with full data range
  useMemo(() => {
    if (data.length > 0) {
      setStartDate(data[0].fullDate || '');
      setEndDate(data[data.length - 1].fullDate || '');
    }
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No transaction data to display
      </div>
    );
  }

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return data;
    
    return data.filter(point => {
      if (!point.fullDate) return true;
      return point.fullDate >= startDate && point.fullDate <= endDate;
    });
  }, [data, startDate, endDate]);

  const resetDateRange = () => {
    if (data.length > 0) {
      setStartDate(data[0].fullDate || '');
      setEndDate(data[data.length - 1].fullDate || '');
    }
  };

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
    <div className="w-full max-w-4xl mx-auto">
      {/* Date Range Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-32">
            <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex-1 min-w-32">
            <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={resetDateRange}
            variant="outline"
            className="text-sm"
          >
            Reset to Full Range
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 70,
            }}
          >
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={Math.max(0, Math.floor(filteredData.length / 8))}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={['dataMin', 'dataMax']}
              allowDataOverflow={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="cumulativeRewards" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Powered by Nodely.io */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <a 
            href="https://nodely.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Nodely.io
          </a>
        </p>
      </div>
    </div>
  );
}