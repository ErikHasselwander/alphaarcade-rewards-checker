import { CheckCircle, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { formatUSDC } from "@/lib/algorand";
import { RewardsChart } from "@/components/rewards-chart";
import type { RewardsData } from "@/lib/algorand";

interface ResultsDisplayProps {
  results?: RewardsData | null;
  error?: string | null;
  isLoading: boolean;
}

export function ResultsDisplay({ results, error, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return null; // Loading state is handled by the button
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-alpha-error" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 max-w-sm mx-auto mb-4">
          {error}
        </p>
      </div>
    );
  }

  if (results === null) {
    return null; // No results to display yet
  }

  if (results && results.count === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No rewards found</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          This address hasn't received any USDC rewards from the $ALPHA rewards program yet.
        </p>
      </div>
    );
  }

  if (!results) return null;

  const totalRewards = formatUSDC(results.totalAmount);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-alpha-success" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rewards Found!</h2>
        <p className="text-gray-600">Here are your $ALPHA rewards</p>
      </div>

      {/* Rewards Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90 mb-1">Total USDC Rewards</div>
          <div className="text-3xl font-bold">
            {totalRewards} USDC
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Transactions</div>
          <div className="text-3xl font-bold text-gray-900">
            {results?.count}
          </div>
        </div>
      </div>

      {/* Cumulative Rewards Chart */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cumulative Rewards Over Time</h3>
        </div>
        <div className="flex justify-center">
          <RewardsChart data={results.chartData} />
        </div>
        {results.chartData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {results.chartData.length} reward transactions from {results.chartData[0]?.date} to {results.chartData[results.chartData.length - 1]?.date}
          </div>
        )}
      </div>
    </div>
  );
}
