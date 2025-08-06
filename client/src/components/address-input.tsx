import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { isValidAlgorandAddress } from "@/lib/algorand";

interface AddressInputProps {
  onCheckRewards: (address: string) => void;
  isLoading: boolean;
}

export function AddressInput({ onCheckRewards, isLoading }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      setAddressError("Please enter an Algorand address");
      return;
    }

    if (!isValidAlgorandAddress(trimmedAddress)) {
      setAddressError("Invalid Algorand address format (must be 58 characters)");
      return;
    }

    setAddressError(null);
    onCheckRewards(trimmedAddress);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (addressError) {
      setAddressError(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Label 
            htmlFor="algorand-address" 
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Algorand Address
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="algorand-address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your Algorand address (58 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-sm font-mono bg-gray-50"
              disabled={isLoading}
            />
            {addressError && (
              <div className="mt-2 text-sm text-alpha-error">
                {addressError}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-alpha-blue hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          <span>{isLoading ? 'Checking...' : 'Check Rewards'}</span>
        </Button>
      </form>
    </div>
  );
}
