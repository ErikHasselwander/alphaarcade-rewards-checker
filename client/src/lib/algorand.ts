// Algorand API constants
export const ALPHA_REWARDS_WALLET = 'XUIBTKHE7ISNMCLJWXUOOK6X3OCP3GVV3Z4J33PHMYX6XXK3XWN3KDMMNI';
export const USDC_ASSET_ID = 31566704;
export const API_BASE_URL = 'https://mainnet-idx.4160.nodely.dev/v2/transactions';

// Validate Algorand address format
export function isValidAlgorandAddress(address: string): boolean {
  // Basic validation: 58 characters, alphanumeric (Base32)
  const regex = /^[A-Z2-7]{58}$/;
  return regex.test(address.toUpperCase());
}

// Format USDC amount (from microUSDC to USDC)
export function formatUSDC(microUsdc: number): string {
  return (microUsdc / 1000000).toFixed(2);
}

// Transaction interface
export interface AlgorandTransaction {
  'asset-transfer-transaction': {
    'amount': number;
    'sender': string;
    'receiver': string;
  };
  'confirmed-round': number;
  'round-time': number;
}

// API response interface
export interface TransactionResponse {
  transactions: AlgorandTransaction[];
  'next-token'?: string;
  'current-round': number;
}

// Processed rewards data
export interface RewardsData {
  totalAmount: number;
  transactions: AlgorandTransaction[];
  count: number;
}

// Fetch transactions from Algorand Indexer
export async function fetchTransactions(
  address: string, 
  nextToken?: string
): Promise<TransactionResponse> {
  const params = new URLSearchParams({
    'asset-id': USDC_ASSET_ID.toString(),
    'address': address,
    'address-role': 'receiver',
    'tx-type': 'axfer',
    'limit': '1000'
  });

  if (nextToken) {
    params.append('next', nextToken);
  }

  const url = `${API_BASE_URL}?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Process and sum rewards
export async function checkRewards(address: string): Promise<RewardsData> {
  let allTransactions: AlgorandTransaction[] = [];
  let nextToken: string | undefined = undefined;
  let totalAmount = 0;

  try {
    do {
      const data = await fetchTransactions(address, nextToken);
      
      if (data.transactions) {
        // Filter transactions from ALPHA rewards wallet
        const rewardTransactions = data.transactions.filter(tx => 
          tx['asset-transfer-transaction'] && 
          tx['asset-transfer-transaction']['sender'] === ALPHA_REWARDS_WALLET
        );

        allTransactions.push(...rewardTransactions);
        
        // Sum the amounts
        rewardTransactions.forEach(tx => {
          totalAmount += tx['asset-transfer-transaction']['amount'] || 0;
        });
      }
      
      nextToken = data['next-token'];
    } while (nextToken);

    return {
      totalAmount,
      transactions: allTransactions,
      count: allTransactions.length
    };
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw new Error('Failed to fetch transaction data. Please try again later.');
  }
}
