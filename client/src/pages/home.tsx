import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { AddressInput } from "@/components/address-input";
import { ResultsDisplay } from "@/components/results-display";
import { checkRewards, isValidAlgorandAddress } from "@/lib/algorand";
import type { RewardsData } from "@/lib/algorand";

export default function Home() {
  const [results, setResults] = useState<RewardsData | null>(null);
  const params = useParams();

  const checkRewardsMutation = useMutation({
    mutationFn: checkRewards,
    onSuccess: (data) => {
      setResults(data);
    },
    onError: () => {
      setResults(null);
    }
  });

  // Auto-check rewards if valid address is in URL
  useEffect(() => {
    const addressFromUrl = params.address;
    if (addressFromUrl && isValidAlgorandAddress(addressFromUrl)) {
      checkRewardsMutation.mutate(addressFromUrl);
    }
  }, [params.address]);

  const handleCheckRewards = (address: string) => {
    checkRewardsMutation.mutate(address);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-alpha-blue">$ALPHA</span> rewards checker
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Check your total USDC rewards received from the ALPHA rewards program
          </p>
        </div>

        {/* Main Card */}
        <AddressInput 
          onCheckRewards={handleCheckRewards}
          isLoading={checkRewardsMutation.isPending}
          initialAddress={params.address || ''}
        />

        {/* Results Section */}
        <ResultsDisplay 
          results={results}
          error={checkRewardsMutation.error?.message}
          isLoading={checkRewardsMutation.isPending}
        />

        {/* Info Section - Only show when no results */}
        {!results && !checkRewardsMutation.error && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold">1</span>
                  </div>
                  <p>Enter your Algorand address</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold">2</span>
                  </div>
                  <p>We scan for USDC transfers from ALPHA rewards</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold">3</span>
                  </div>
                  <p>View your total rewards earned</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
